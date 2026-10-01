// Per-frame simulation of the tank, extracted from the card so it can be
// tested without a DOM, a LitElement or a running animation loop.
//
// Conventions
//  - Every step function receives a `frame` (see createFrame): the time step,
//    the clocks and the state of the tank for this frame.
//  - The clock is injected (`frame.nowMs`, `frame.timestamp`) and so is the
//    random source (`rand`, defaulting to Math.random): nothing in here reads
//    Date.now() or Math.random() on its own account.
//  - A step function advances the creature, bubble or flake it is given IN
//    PLACE (the card keeps those objects between frames) and returns whether
//    something changed when that is not always the case.

import { flowBubbleCount, pickFoodTarget, RIPPLE_DURATION_MS } from "./pure.js";
import { CRAB_ROUTE_LENGTH, CRAB_CAVES, CRAB_START_S, crabPointAt } from "./reef-layout.js";

/** @typedef {import("./types.js").Frame} Frame */
/** @typedef {import("./types.js").TankState} TankState */
/** @typedef {import("./types.js").Fish} Fish */
/** @typedef {import("./types.js").Snail} Snail */
/** @typedef {import("./types.js").Ancistrus} Ancistrus */
/** @typedef {import("./types.js").Crawler} Crawler */
/** @typedef {import("./types.js").Flake} Flake */
/** @typedef {import("./types.js").FlowBubble} FlowBubble */
/** @typedef {import("./types.js").Bubble} Bubble */
/** @typedef {import("./types.js").BoilingBubble} BoilingBubble */
/** @typedef {import("./types.js").Ripple} Ripple */
/** @typedef {Pick<TankState, "tankTop" | "tankBottom" | "waterSurfaceY" | "waterRatio" | "isDead" | "isBoiling" | "speedMultiplier">} TankSnapshot */
/** @typedef {() => number} RandomSource */

/**
 * Where a crawling creature lives and how it behaves. The idle delays are
 * [fixed part, random part] in ms.
 *
 * @typedef {object} CrawlerSpec
 * @property {number} minX
 * @property {number} maxX
 * @property {number} [fleeMinX]  how far left it runs when startled, when that is beyond its lane
 * @property {number} [fleeMaxX]  how far right it runs when startled, when that is beyond its lane
 * @property {number} floorOffset  distance between its feet and the tank bottom
 * @property {number} speed
 * @property {[number, number]} firstIdle
 * @property {[number, number]} nextIdle
 */

/** Duration (ms) of the death animation. */
export const DEATH_DURATION_MS = 4500;

/** How long (ms) a flake stays on the sand before it disappears. */
export const FOOD_LIFETIME_MS = 6000;

/** How the thrown flakes slow down in the water (the share of their sideways speed kept each frame), and the walls they stop at. */
export const FOOD_DRAG = { keep: 0.96, minX: 30, maxX: 994 };

/** Time step (ms) assumed when the real one is unknown (first frame). */
const DEFAULT_FRAME_MS = 16.66;

/** How long (ms) the white dots of stress stay after a knock on the glass, fading out. */
export const STRESS_MS = 3500;

/**
 * Marks an animal as frightened by a knock on the glass: it shows the white dots
 * of stress for STRESS_MS. A new knock starts over.
 *
 * @param {{ stressUntil?: number, stressPower?: number }} creature
 * @param {number} nowMs
 * @param {number} [power]  0..1, how strong the stress is at the start
 */
export function markStressed(creature, nowMs, power = 1) {
  creature.stressUntil = nowMs + STRESS_MS;
  creature.stressPower = Math.max(0, Math.min(1, power));
}

/**
 * The stress of an animal now, from 0 (calm) to 1, fading out linearly after the
 * knock. It is kept on the animal (`stress`) for the drawing.
 *
 * @param {{ stressUntil?: number, stressPower?: number, stress?: number }} creature
 * @param {number} nowMs
 * @returns {number}
 */
export function stressLevel(creature, nowMs) {
  const left = (creature.stressUntil ?? 0) - nowMs;
  creature.stress = left <= 0 ? 0 : Math.min(1, left / STRESS_MS) * (creature.stressPower ?? 1);
  return creature.stress;
}

/** How the legs go: phase added per unit walked, the most it may advance in one frame, and how fast the swing opens and closes (per frame). */
export const WALK = { rate: 0.25, maxStep: 0.9, ease: 0.15 };

/**
 * Moves the legs of a walking animal: the phase follows the distance walked (so
 * the legs never slide on the ground) and the swing opens while it walks and
 * closes when it stops.
 *
 * @param {{ walk?: number, stride?: number }} creature
 * @param {number} walked  distance walked this frame (any sign)
 * @param {boolean} moving
 * @param {number} delta
 */
function stepLegs(creature, walked, moving, delta) {
  creature.walk = (creature.walk ?? 0) + Math.min(WALK.maxStep, Math.abs(walked) * WALK.rate);
  const stride = creature.stride ?? 0;
  creature.stride = stride + ((moving ? 1 : 0) - stride) * Math.min(1, WALK.ease * delta);
}

/**
 * Everything a step function needs to know about the current frame.
 *
 * @param {object} input
 * @param {number} input.timestamp  animation clock (ms), used for idle timers
 * @param {number} input.deltaMs    real time since the previous frame (ms)
 * @param {number} input.delta      time step in 60 Hz frame units, already clamped
 * @param {number} input.nowMs      wall clock (ms)
 * @param {number} input.animTime   phase of the periodic motions
 * @param {TankSnapshot} input.tank  result of computeTankState()
 * @param {number} input.userSpeed  the fish_speed_multiplier option
 * @param {string} input.themeKey   freshwater, saltwater or coldwater
 * @returns {Frame}
 */
export function createFrame({ timestamp, deltaMs, delta, nowMs, animTime, tank, userSpeed, themeKey }) {
  const { tankTop, tankBottom, waterSurfaceY, waterRatio, isDead, isBoiling, speedMultiplier } = tank;
  return {
    timestamp,
    deltaMs,
    delta,
    nowMs,
    animTime,
    userSpeed,
    themeKey,
    tankTop,
    tankBottom,
    waterSurfaceY,
    waterRatio,
    isDead,
    isBoiling,
    speedMultiplier,
    // Fraction of the death animation covered during this frame.
    deathStep: (deltaMs || DEFAULT_FRAME_MS) / DEATH_DURATION_MS,
  };
}

/**
 * Death progress (0..1) after one more frame; back to 0 while alive.
 *
 * @param {number | undefined} current
 * @param {boolean} isDead
 * @param {number} deathStep
 * @returns {number}
 */
export function advanceDeath(current, isDead, deathStep) {
  return isDead ? Math.min(1.0, (current || 0) + deathStep) : 0;
}

/**
 * Eases the flow intensity toward its goal; snaps to exactly 0 once calm.
 *
 * @param {number} current
 * @param {number} goal
 * @param {number} delta
 * @returns {number}
 */
export function smoothFlowIntensity(current, goal, delta) {
  const next = current + (goal - current) * Math.min(1, 0.03 * delta);
  return next < 0.005 && goal === 0 ? 0 : next;
}

/**
 * Ripples that are still visible.
 *
 * @param {Ripple[]} ripples
 * @param {number} nowMs
 * @returns {Ripple[]}
 */
export function pruneRipples(ripples, nowMs) {
  return ripples.filter((r) => nowMs - r.born < RIPPLE_DURATION_MS);
}

// ---------------------------------------------------------------------------
// Fish food and bubbles
// ---------------------------------------------------------------------------

/**
 * Makes the flakes sink, lands them on the sand and removes the eaten ones and
 * the ones that stayed on the sand too long. There is no food in a dead or
 * empty tank.
 *
 * @param {Flake[]} food
 * @param {Frame} frame
 * @returns {{ food: Flake[], changed: boolean }}
 */
export function stepFood(food, frame) {
  const { isDead, waterRatio, delta, animTime, waterSurfaceY, tankBottom, nowMs } = frame;
  if (isDead || waterRatio <= 0) return { food: [], changed: false };
  if (food.length === 0) return { food, changed: false };

  food.forEach((f) => {
    if (f.landedAt) return;
    f.y += f.vy * delta;
    // The throw: the flake flies sideways, then the water holds it back. The distance covered
    // in this step is the sum of the speeds of the frames it lasts, so the throw is the same
    // whatever the frame rate.
    const vx = f.vx ?? 0;
    const kept = Math.pow(FOOD_DRAG.keep, delta);
    f.x += (vx * (1 - kept)) / (1 - FOOD_DRAG.keep) + Math.sin(animTime * 1.5 + f.phase) * 0.25 * delta;
    f.vx = vx * kept;
    f.x = Math.min(FOOD_DRAG.maxX, Math.max(FOOD_DRAG.minX, f.x));
    if (f.y < waterSurfaceY) f.y = waterSurfaceY;
    if (f.y >= tankBottom - 30) {
      f.y = tankBottom - 30;
      f.landedAt = nowMs;
    }
  });
  return {
    food: food.filter((f) => !f.eaten && !(f.landedAt && nowMs - f.landedAt > FOOD_LIFETIME_MS)),
    changed: true,
  };
}

/**
 * The stream of bubbles rising from the bottom while water runs: starts as
 * many bubbles as the flow intensity asks for and moves the active ones.
 *
 * @param {FlowBubble[]} bubbles
 * @param {Frame} frame
 * @param {number} flowIntensity
 * @param {number} maxBubbles
 * @param {RandomSource} [rand]
 * @returns {boolean} true when a bubble moved
 */
export function stepFlowBubbles(bubbles, frame, flowIntensity, maxBubbles, rand = Math.random) {
  const { waterRatio, isDead, tankBottom, waterSurfaceY, delta, animTime } = frame;
  const wanted = waterRatio > 0 && !isDead ? flowBubbleCount(flowIntensity, maxBubbles) : 0;
  let changed = false;
  bubbles.forEach((b, i) => {
    if (!b.active) {
      if (i < wanted) {
        b.active = true;
        b.baseX = 512 + (rand() - 0.5) * 90;
        b.x = b.baseX;
        b.y = tankBottom - 10 - rand() * 40;
        b.vy = 1.8 + rand() * 2.2 + flowIntensity * 1.2;
        b.r = 2 + rand() * 4;
        b.phase = rand() * Math.PI * 2;
      }
      return;
    }
    b.y -= b.vy * delta;
    b.x = b.baseX + Math.sin(animTime * 2 + b.phase) * 6;
    if (b.y < waterSurfaceY + 2 || isDead) b.active = false;
    changed = true;
  });
  return changed;
}

/**
 * The few decorative bubbles that always rise from the sand.
 *
 * @param {Bubble[]} bubbles
 * @param {Frame} frame
 * @returns {boolean} true when they moved (never in a dead or empty tank)
 */
export function stepRisingBubbles(bubbles, frame) {
  const { waterRatio, isDead, delta, waterSurfaceY, tankBottom } = frame;
  if (!(waterRatio > 0 && !isDead) || bubbles.length === 0) return false;
  bubbles.forEach((b) => {
    b.y -= b.vy * delta;
    if (b.y < waterSurfaceY) b.y = tankBottom - 15;
  });
  return true;
}

/**
 * The large fast bubbles of a boiling tank.
 *
 * @param {BoilingBubble[]} bubbles
 * @param {Frame} frame
 * @param {RandomSource} [rand]
 * @returns {boolean} true when they moved (only while boiling)
 */
export function stepBoilingBubbles(bubbles, frame, rand = Math.random) {
  const { isBoiling, waterRatio, delta, waterSurfaceY, tankBottom } = frame;
  if (!(isBoiling && waterRatio > 0) || bubbles.length === 0) return false;
  bubbles.forEach((b) => {
    b.y -= b.vy * delta;
    b.x += b.vx * delta;
    if (b.y < waterSurfaceY) {
      b.y = tankBottom - 15;
      b.x = 10 + rand() * 1004;
    }
  });
  return true;
}

// ---------------------------------------------------------------------------
// Creatures
// ---------------------------------------------------------------------------

/**
 * Where a fish may swim: the clownfish stay near their anemone, the others
 * anywhere in the water.
 *
 * @param {Fish} fish
 * @param {Frame} frame
 */
function fishBounds(fish, frame) {
  const { tankBottom, tankTop, waterSurfaceY, themeKey } = frame;
  const isClownfish = themeKey === "saltwater" && fish.species === 0;
  return {
    minX: isClownfish ? 160 : 110,
    maxX: isClownfish ? 380 : 910,
    minY: isClownfish
      ? Math.max(tankTop + 45, waterSurfaceY + 35, tankBottom - 160)
      : Math.max(tankTop + 45, waterSurfaceY + 35),
    maxY: tankBottom - 45,
  };
}

/**
 * How much room the fish keep between them. A fish is taken for an ellipse of
 * about `rx` by `ry` per unit of its scale, and two fish are pushed apart when
 * their ellipses (shrunk by `factor`) overlap, by at most `push` units per frame:
 * a gentle nudge, not a rule the eye would see.
 */
export const FISH_SPACING = { rx: 25, ry: 16, factor: 0.85, push: 1.4 };

/**
 * Keeps the fish from piling up: any two that are too close are moved a little
 * further apart (and kept inside the water). Nothing happens in a dead tank.
 *
 * @param {Fish[]} fishes
 * @param {Frame} frame
 * @returns {boolean} true when at least one pair was pushed apart
 */
export function separateFish(fishes, frame) {
  if (frame.isDead) return false;
  let moved = false;
  for (let i = 0; i < fishes.length; i++) {
    for (let j = i + 1; j < fishes.length; j++) {
      const a = fishes[i];
      const b = fishes[j];
      const size = (a.scale || 1.4) + (b.scale || 1.4);
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const closeness = Math.hypot(dx / (FISH_SPACING.rx * FISH_SPACING.factor * size), dy / (FISH_SPACING.ry * FISH_SPACING.factor * size));
      if (closeness >= 1) continue;
      // Two fish at the very same spot are pushed apart sideways, one each way.
      const length = Math.hypot(dx, dy);
      const [ux, uy] = length < 1e-6 ? [1, 0] : [dx / length, dy / length];
      const nudge = (1 - closeness) * FISH_SPACING.push * frame.delta;
      a.x += ux * nudge;
      a.y += uy * nudge;
      b.x -= ux * nudge;
      b.y -= uy * nudge;
      moved = true;
    }
  }
  if (moved) {
    for (const fish of fishes) {
      const { minX, maxX, minY, maxY } = fishBounds(fish, frame);
      fish.x = Math.min(maxX, Math.max(minX, fish.x));
      fish.y = Math.min(maxY, Math.max(minY, fish.y));
    }
  }
  return moved;
}

/**
 * One fish: sinks when dead; otherwise chases the nearest flake (unless
 * startled), swims, dashes away after a knock on the glass, eats flakes that
 * reach its mouth and turns around at the walls.
 *
 * @param {Fish} fish
 * @param {Frame} frame
 * @param {Flake[]} food  the flakes in the water; eaten ones are flagged
 */
export function stepFish(fish, frame, food) {
  const { isDead, deathStep, tankBottom, delta, speedMultiplier } = frame;

  if (isDead) {
    fish.deathProgress = Math.min(1.0, (fish.deathProgress || 0) + deathStep);
    fish.y = Math.min(tankBottom - 30, fish.y + 1.2 * delta);
    return;
  }

  fish.deathProgress = 0;
  stressLevel(fish, frame.nowMs);

  // Head for the nearest food flake (unless startled).
  const foodTarget = (fish.scare ?? 0) > 0.05 ? null : pickFoodTarget(fish.x, fish.y, food);
  if (foodTarget) {
    if (fish._baseVy === undefined) fish._baseVy = fish.vy;
    if (Math.abs(foodTarget.x - fish.x) > 6) fish.dir = foodTarget.x < fish.x ? -1 : 1;
    fish.vy = Math.max(-1.1, Math.min(1.1, (foodTarget.y - fish.y) * 0.02));
    fish._seeking = true;
  } else if (fish._seeking) {
    if (fish._baseVy !== undefined) fish.vy = fish._baseVy;
    fish._seeking = false;
  }
  const foodBoost = foodTarget ? 1.8 : 1;
  const { minX, maxX, minY, maxY } = fishBounds(fish, frame);

  fish.x += fish.vx * fish.dir * speedMultiplier * foodBoost * delta;
  fish.y += fish.vy * speedMultiplier * delta;

  // Startle impulse from a knock on the glass: a sharp dash that fades.
  // (Either component may be missing: a missing one counts as 0.)
  const kickX = fish.kickX ?? 0;
  const kickY = fish.kickY ?? 0;
  if (kickX || kickY) {
    fish.x += kickX * delta;
    fish.y += kickY * delta;
    const decay = Math.pow(0.93, delta);
    fish.kickX = kickX * decay;
    fish.kickY = kickY * decay;
    const speed = Math.hypot(fish.kickX, fish.kickY);
    fish.scare = Math.min(1, speed / 8);
    if (speed < 0.15) {
      fish.kickX = 0;
      fish.kickY = 0;
      fish.scare = 0;
    }
  }

  // Swallow any flake that reaches the mouth.
  if (food.length > 0) {
    const mouthX = fish.x + fish.dir * 22 * (fish.scale || 1.4);
    food.forEach((f) => {
      if (!f.eaten && Math.hypot(f.x - mouthX, f.y - fish.y) < 28) f.eaten = true;
    });
  }

  if (fish.x < minX) {
    fish.x = minX;
    fish.dir = 1;
  } else if (fish.x > maxX) {
    fish.x = maxX;
    fish.dir = -1;
  }

  if (fish.y < minY) {
    fish.y = minY;
    fish.vy = Math.abs(fish.vy);
  } else if (fish.y > maxY) {
    fish.y = maxY;
    fish.vy = -Math.abs(fish.vy);
  }
}

/** How fast (units per frame) a snail above the water crawls down to rejoin it. */
export const SNAIL_REJOIN_SPEED = 0.2;

/**
 * One snail: crawls along the sand (pinned to it) or up and down a glass wall; sinks when dead.
 *
 * @param {Snail} snail
 * @param {Frame} frame
 */
export function stepSnail(snail, frame) {
  const { isDead, tankBottom, tankTop, waterSurfaceY, delta } = frame;

  if (isDead) {
    snail.y = Math.min(tankBottom - 10, snail.y + 1.5 * delta);
    return;
  }

  if (snail.type === "bottom") {
    // On the sand, whatever the height of the tank (its resting place when dead is the same).
    snail.y = tankBottom - 10;
    snail.x += snail.vx * snail.dir * delta;
    if (snail.x < 100) {
      snail.x = 100;
      snail.dir = 1;
    } else if (snail.x > 920) {
      snail.x = 920;
      snail.dir = -1;
    }
  } else if (snail.type === "glass_left" || snail.type === "glass_right") {
    const minY = Math.max(tankTop + 35, waterSurfaceY + 25);
    if (snail.y < minY) {
      // The water went down and left the snail on the glass above it: it is not
      // obliged to be in the water, but it crawls down (a little faster than it
      // grazes) to rejoin it, instead of being carried down with the surface.
      snail.vy = Math.abs(snail.vy);
      snail.y = Math.min(minY, snail.y + Math.max(snail.vy, SNAIL_REJOIN_SPEED) * delta);
      return;
    }
    snail.y += snail.vy * delta;
    if (snail.y < minY) {
      snail.y = minY;
      snail.vy = Math.abs(snail.vy);
    } else if (snail.y > tankBottom - 25) {
      snail.y = tankBottom - 25;
      snail.vy = -Math.abs(snail.vy);
    }
  }
}

/** How long (ms) the bottom dwellers keep running after a knock on the glass, and how much faster they go. */
export const FLEE = { durationMs: 1800, radius: 520, ancistrusFactor: 7, crawlerFactor: 6, ancistrusTurn: 6 };

/** How the plecostomus moves: units per frame, degrees per frame it can turn, and how far it goes at a time. */
export const ANCISTRUS_MOVE = { speed: 0.8, turn: 3, minTrip: 140, maxTrip: 420 };

/** The shortest way round from one heading to another, in degrees (-180..180). @param {number} from @param {number} to */
const turnBetween = (from, to) => ((((to - from) % 360) + 540) % 360) - 180;

/** The drawing of the Ancistrus is scaled by this much (see render/creatures.js). */
const ANCISTRUS_SCALE = 1.5;
/**
 * Points of the drawing of the Ancistrus (in its own units, head at the top):
 * the tentacles, the lips, the tips of the fins and the end of the body. They
 * must stay in the water.
 * @type {number[][]}
 */
const ANCISTRUS_BODY = [[0, -21], [13, -19], [-13, -19], [15, 0], [-15, 0], [34, 32], [-34, 32], [19, 55], [-19, 55], [9, 72], [-9, 72]];
/**
 * The end of the tail: it may stick out of the water a little, the rest may not.
 * @type {number[][]}
 */
const ANCISTRUS_TAIL = [[9, 89], [-9, 89], [0, 84]];
/** How far (drawing units) the body stays under the surface, how far the tail may stick out of it, the gap kept above the bottom, and how fast (units per frame) it is brought back into the water. */
export const ANCISTRUS_WATER = { surfaceMargin: 6, tailOut: 16, floorMargin: 4, rescue: 12 };

/**
 * The highest and the lowest place (y of its centre) where the Ancistrus can
 * be with its head pointing at `heading`, so that its body is in the water (the
 * tip of its tail may be a little above the surface) and above the bottom.
 * Turned head down, the long body reaches far above its centre; turned sideways,
 * it takes little height: the range depends on the heading.
 *
 * @param {number} heading  degrees, 0 = head straight up
 * @param {{ tankBottom: number, waterSurfaceY: number }} tank
 * @returns {{ minY: number, maxY: number }}
 */
export function ancistrusYRange(heading, tank) {
  const rad = (heading * Math.PI) / 180;
  const [sin, cos] = [Math.sin(rad), Math.cos(rad)];
  // Vertical offset of a point of the drawing from the centre of the fish.
  const dy = (/** @type {number[]} */ [x, y]) => ANCISTRUS_SCALE * (x * sin + y * cos);
  const body = ANCISTRUS_BODY.map(dy);
  const tail = ANCISTRUS_TAIL.map(dy);
  const minY = Math.max(tank.waterSurfaceY + ANCISTRUS_WATER.surfaceMargin - Math.min(...body), tank.waterSurfaceY - ANCISTRUS_WATER.tailOut - Math.min(...tail));
  const maxY = tank.tankBottom - ANCISTRUS_WATER.floorMargin - Math.max(...body, ...tail);
  return { minY, maxY };
}

/**
 * Where the Ancistrus can go from where it is: a point `trip` units away in
 * the direction `angle`, kept in its area and in the water. When that spot is
 * out of reach (a wall, the surface), the other directions are tried and the
 * best one is taken: the one that goes the nearest to the wanted trip or, when
 * the fish runs away from a knock, the one that takes it the farthest from it.
 * Returns null when it has nowhere to go (almost no water).
 *
 * @param {Ancistrus} anc
 * @param {{ tankBottom: number, waterSurfaceY: number }} tank
 * @param {number} angle  radians, 0 = straight up
 * @param {number} trip
 * @param {{ x: number, y: number }} [awayFrom]  the place of a knock on the glass
 * @returns {{ x: number, y: number } | null}
 */
function chooseAncistrusTarget(anc, tank, angle, trip, awayFrom) {
  const [minX, maxX] = [90, 934];
  const before = awayFrom ? Math.hypot(anc.x - awayFrom.x, anc.y - awayFrom.y) : 0;
  /** @type {{ x: number, y: number, score: number } | null} */
  let best = null;
  for (const offset of [0, 40, -40, 80, -80, 120, -120, 160, 180]) {
    const a = angle + (offset * Math.PI) / 180;
    const x = Math.min(maxX, Math.max(minX, anc.x + Math.sin(a) * trip));
    let y = anc.y - Math.cos(a) * trip;
    let ok = true;
    // Its heading on arrival depends on where it ends up, which depends on the range: a few passes settle it.
    for (let pass = 0; pass < 4 && ok; pass++) {
      const heading = (Math.atan2(x - anc.x, -(y - anc.y)) * 180) / Math.PI;
      const range = ancistrusYRange(heading, tank);
      if (range.minY > range.maxY) ok = false;
      else y = Math.min(range.maxY, Math.max(range.minY, y));
    }
    if (!ok) continue;
    const move = Math.hypot(x - anc.x, y - anc.y);
    if (move < 60) continue;
    const score = awayFrom
      ? Math.hypot(x - awayFrom.x, y - awayFrom.y) - before + move * 0.5 - Math.abs(offset) * 0.5
      : -Math.abs(move - trip) - Math.abs(offset) * 0.3;
    if (!best || score > best.score) best = { x, y, score };
  }
  return best;
}

/**
 * A knock on the glass at (tx, ty) startles the Ancistrus: it turns away from
 * the knock and darts off, much faster than its usual glide, for a moment. When
 * a wall is in the way it takes the way that is open (along the wall).
 *
 * @param {Ancistrus} anc
 * @param {number} tx
 * @param {number} ty
 * @param {number} nowMs
 * @param {{ tankTop: number, tankBottom: number, waterSurfaceY: number }} tank
 * @param {RandomSource} [rand]
 * @returns {boolean} whether it was startled
 */
export function startleAncistrus(anc, tx, ty, nowMs, tank, rand = Math.random) {
  const dx = anc.x - tx;
  const dy = anc.y - ty;
  const dist = Math.hypot(dx, dy);
  if (dist > FLEE.radius) return false;
  // Straight away from the knock; a random direction when it is right on it.
  const angle = dist < 1 ? rand() * 2 * Math.PI : Math.atan2(dx, -dy);
  const trip = 300 + 200 * (1 - dist / FLEE.radius);
  const target = chooseAncistrusTarget(anc, tank, angle, trip, { x: tx, y: ty });
  if (target) {
    anc.targetX = target.x;
    anc.targetY = target.y;
  } else {
    // Hardly any water: it only shakes where it is.
    anc.targetX = anc.x;
    anc.targetY = anc.y;
  }
  anc.state = "moving";
  anc.fleeUntil = nowMs + FLEE.durationMs;
  return true;
}

/**
 * The plecostomus: rests on the glass, then turns to face a new spot and
 * glides to it, in any direction (up, down, sideways, diagonally), and sinks
 * when the tank is dead. It always stays in the water (only the tip of its
 * tail may come out of it). Idle and move delays come from the injected clock
 * and random source.
 *
 * @param {Ancistrus} anc
 * @param {Frame} frame
 * @param {RandomSource} [rand]
 */
export function stepAncistrus(anc, frame, rand = Math.random) {
  const { isDead, deathStep, tankBottom, waterSurfaceY, delta, timestamp, userSpeed, nowMs } = frame;
  const fleeing = (anc.fleeUntil ?? 0) > nowMs;

  if (isDead) {
    anc.deathProgress = Math.min(1.0, (anc.deathProgress || 0) + deathStep);
    anc.y = Math.min(tankBottom - 35, anc.y + 1.2 * delta);
    return;
  }

  anc.deathProgress = 0;
  stressLevel(anc, nowMs);
  anc.heading = anc.heading ?? 0;
  const tank = { tankBottom, waterSurfaceY };

  if (!anc.idleUntil) {
    anc.idleUntil = timestamp + 1000 + rand() * 2000;
  }

  if (anc.state === "moving") {
    const dx = anc.targetX - anc.x;
    const dy = anc.targetY - anc.y;
    const distance = Math.hypot(dx, dy);
    // The head turns towards where it is going (0 degrees is straight up).
    const wanted = (Math.atan2(dx, -dy) * 180) / Math.PI;
    const turn = (fleeing ? FLEE.ancistrusTurn : ANCISTRUS_MOVE.turn) * delta;
    anc.heading += Math.max(-turn, Math.min(turn, turnBetween(anc.heading, wanted)));
    const step = Math.min(distance, ANCISTRUS_MOVE.speed * userSpeed * (fleeing ? FLEE.ancistrusFactor : 1) * delta);
    anc.x += (dx / (distance || 1)) * step;
    anc.y += (dy / (distance || 1)) * step;
    if (Math.hypot(anc.targetX - anc.x, anc.targetY - anc.y) < 1.5) {
      anc.state = "idle";
      anc.idleUntil = timestamp + (fleeing ? 2500 : 1200) + rand() * 2000;
    }
  } else if (timestamp >= anc.idleUntil) {
    // A trip of a good length in a random direction, kept inside its area and in the water.
    const angle = rand() * 2 * Math.PI;
    const trip = ANCISTRUS_MOVE.minTrip + rand() * (ANCISTRUS_MOVE.maxTrip - ANCISTRUS_MOVE.minTrip);
    const target = chooseAncistrusTarget(anc, tank, angle, trip);
    if (target) {
      anc.state = "moving";
      anc.targetX = target.x;
      anc.targetY = target.y;
    } else {
      anc.idleUntil = timestamp + 1500;
    }
  }

  // Whatever the heading it has now, or the water level (it goes down with the
  // consumption), the fish is brought back into the water, fast enough to keep up
  // with its own turning (a long body swings its tail up to 7 units per frame).
  const range = ancistrusYRange(anc.heading, tank);
  const goal = range.minY > range.maxY ? (range.minY + range.maxY) / 2 : Math.min(range.maxY, Math.max(range.minY, anc.y));
  if (goal !== anc.y) anc.y += Math.sign(goal - anc.y) * Math.min(Math.abs(goal - anc.y), ANCISTRUS_WATER.rescue * delta);
}

/**
 * A knock on the glass startles a creature that walks on the sand (shrimp,
 * goby): it runs away from the knock, along its lane, much faster than
 * usual. The goby, whose lane is a single point (its burrow), darts a short
 * way out and comes back on its own afterwards.
 *
 * @param {Crawler} creature
 * @param {number} tx
 * @param {number} ty
 * @param {number} nowMs
 * @param {CrawlerSpec} spec
 * @returns {boolean} whether it was startled
 */
export function startleCrawler(creature, tx, ty, nowMs, spec) {
  if (Math.hypot(creature.x - tx, creature.y - ty) > FLEE.radius) return false;
  const minX = spec.fleeMinX ?? spec.minX;
  const maxX = spec.fleeMaxX ?? spec.maxX;
  const awayDir = creature.x === tx ? (creature.dir || 1) : Math.sign(creature.x - tx);
  // Away from the knock; when it already stands at the end of its lane, the other way.
  let target = awayDir > 0 ? maxX : minX;
  if (Math.abs(target - creature.x) < 8) target = awayDir > 0 ? minX : maxX;
  creature.targetX = target;
  creature.state = "moving";
  creature.fleeUntil = nowMs + FLEE.durationMs;
  return true;
}

/** @type {CrawlerSpec} */
// The shrimp walks on the sand between the coral and the pile of rock; the goby
// stays at its burrow in the sand (its lane is one point). The crab does not
// have a lane: it follows a route over the whole reef (see stepCrab()).
export const SHRIMP_SPEC = {
  minX: 560,
  maxX: 740,
  // Startled, it runs a long way along the sand, much farther than it ever walks.
  fleeMinX: 470,
  fleeMaxX: 770,
  floorOffset: 25,
  speed: 0.9,
  firstIdle: [1200, 2000],
  nextIdle: [1500, 2500],
};
/** @type {CrawlerSpec} */
export const GOBY_SPEC = {
  minX: 530,
  maxX: 530,
  // Where it darts to when startled, before it goes back to its burrow.
  fleeMinX: 450,
  fleeMaxX: 610,
  floorOffset: 14,
  speed: 0.5,
  firstIdle: [2000, 3000],
  nextIdle: [2500, 3500],
};

/**
 * A creature that walks left and right along the sand (shrimp, crab): pauses,
 * then walks to a random spot inside its lane. When dead it stays in place and
 * only fades.
 *
 * @param {Crawler} creature
 * @param {Frame} frame
 * @param {CrawlerSpec} spec
 * @param {RandomSource} [rand]
 */
export function stepCrawler(creature, frame, spec, rand = Math.random) {
  const { isDead, deathStep, tankBottom, delta, timestamp, userSpeed, nowMs } = frame;
  const fleeing = (creature.fleeUntil ?? 0) > nowMs;

  if (isDead) {
    creature.deathProgress = Math.min(1.0, (creature.deathProgress || 0) + deathStep);
    return;
  }

  creature.deathProgress = 0;
  stressLevel(creature, nowMs);
  creature.y = tankBottom - spec.floorOffset;
  let walked = 0;

  if (!creature.idleUntil) {
    creature.idleUntil = timestamp + spec.firstIdle[0] + rand() * spec.firstIdle[1];
  }

  if (creature.state === "moving") {
    const dx = creature.targetX - creature.x;
    creature.dir = dx < 0 ? -1 : 1;
    const step = Math.sign(dx) * Math.min(Math.abs(dx), spec.speed * userSpeed * (fleeing ? FLEE.crawlerFactor : 1) * delta);
    creature.x += step;
    walked = step;
    if (Math.abs(creature.targetX - creature.x) < 1.5) {
      creature.state = "idle";
      creature.idleUntil = timestamp + spec.nextIdle[0] + rand() * spec.nextIdle[1];
    }
  } else if (timestamp >= creature.idleUntil) {
    creature.state = "moving";
    creature.targetX = spec.minX + rand() * (spec.maxX - spec.minX);
  }
  stepLegs(creature, walked, creature.state === "moving", delta);
}

// ---------------------------------------------------------------------------
// The crab: it walks along its route over the reef, hides in the caves
// ---------------------------------------------------------------------------

/**
 * How the crab behaves: units per frame along its route, the share of the
 * hiding it does per frame (0 = in sight, 1 = hidden), and the delays in ms,
 * [fixed part, random part].
 */
export const CRAB_MOVE = { speed: 0.9, hideStep: 0.03, idle: [1500, 2500], hidden: [4000, 4000], fleeHidden: [6000, 3000], firstIdle: [1500, 2000], caveChance: 0.4 };

/**
 * Where on its route the crab is: the distance walked from the start. A crab
 * that was placed by hand (x only) is put on the route at the nearest place.
 *
 * @param {Crawler} crab
 * @returns {number}
 */
function crabDistance(crab) {
  if (typeof crab.s === "number") return crab.s;
  crab.s = CRAB_START_S;
  return crab.s;
}

/**
 * Puts the crab where its distance along the route says, standing on the floor
 * of the tank whatever its height.
 *
 * @param {Crawler} crab
 * @param {number} tankBottom
 * @returns {number} the horizontal distance it moved since the last call
 */
function placeCrab(crab, tankBottom) {
  const { x, h } = crabPointAt(crabDistance(crab));
  const moved = x - crab.x;
  crab.x = x;
  // The body of the crab is drawn about 30 units above its feet.
  crab.y = tankBottom - (h + 30);
  return moved;
}

/**
 * The next place the crab walks to: now and then a cave, otherwise anywhere
 * along its route (the other end of it when that is too close to be worth it).
 *
 * @param {number} s
 * @param {RandomSource} rand
 * @returns {number}
 */
function pickCrabGoal(s, rand) {
  const caves = CRAB_CAVES.filter((stop) => Math.abs(stop - s) > 40);
  if (caves.length > 0 && rand() < CRAB_MOVE.caveChance) return caves[Math.min(caves.length - 1, Math.floor(rand() * caves.length))];
  const goal = rand() * CRAB_ROUTE_LENGTH;
  if (Math.abs(goal - s) >= 40) return goal;
  return s < CRAB_ROUTE_LENGTH / 2 ? CRAB_ROUTE_LENGTH : 0;
}

/**
 * The crab: rests, then walks along its route (over the sand, up the pile of
 * rock to its flat rock), and from time to time goes into a cave, where it
 * hides for a while and shows only its eyes, before it comes out again. Dead,
 * it comes out of its hiding place and stays where it is, fading.
 *
 * @param {Crawler} crab
 * @param {Frame} frame
 * @param {RandomSource} [rand]
 */
export function stepCrab(crab, frame, rand = Math.random) {
  const { isDead, deathStep, tankBottom, delta, userSpeed, nowMs } = frame;
  const fleeing = (crab.fleeUntil ?? 0) > nowMs;
  crab.hide = crab.hide ?? 0;

  if (isDead) {
    crab.deathProgress = Math.min(1.0, (crab.deathProgress || 0) + deathStep);
    crab.hide = Math.max(0, crab.hide - CRAB_MOVE.hideStep * delta);
    placeCrab(crab, tankBottom);
    return;
  }

  crab.deathProgress = 0;
  stressLevel(crab, nowMs);
  placeCrab(crab, tankBottom);
  let walked = 0;

  if (!crab.idleUntil) crab.idleUntil = nowMs + CRAB_MOVE.firstIdle[0] + rand() * CRAB_MOVE.firstIdle[1];

  switch (crab.state) {
    case "moving": {
      const s = crabDistance(crab);
      const goal = crab.goalS ?? s;
      const step = Math.sign(goal - s) * Math.min(Math.abs(goal - s), CRAB_MOVE.speed * userSpeed * (fleeing ? FLEE.crawlerFactor : 1) * delta);
      crab.s = s + step;
      const moved = placeCrab(crab, tankBottom);
      walked = step;
      if (Math.abs(moved) > 0.01) crab.dir = moved < 0 ? -1 : 1;
      if (Math.abs(goal - crab.s) < 0.5) {
        crab.s = goal;
        const atCave = CRAB_CAVES.some((stop) => Math.abs(stop - goal) < 1);
        if (atCave) {
          crab.state = "hiding";
        } else {
          crab.state = "idle";
          crab.idleUntil = nowMs + CRAB_MOVE.idle[0] + rand() * CRAB_MOVE.idle[1];
        }
      }
      break;
    }
    case "hiding":
      crab.hide = Math.min(1, crab.hide + CRAB_MOVE.hideStep * (fleeing ? 2 : 1) * delta);
      if (crab.hide >= 1) {
        crab.state = "hidden";
        const [fixed, extra] = fleeing ? CRAB_MOVE.fleeHidden : CRAB_MOVE.hidden;
        crab.idleUntil = nowMs + fixed + rand() * extra;
      }
      break;
    case "hidden":
      if (nowMs >= crab.idleUntil) crab.state = "emerging";
      break;
    case "emerging":
      crab.hide = Math.max(0, crab.hide - CRAB_MOVE.hideStep * delta);
      if (crab.hide <= 0) {
        crab.state = "idle";
        crab.idleUntil = nowMs + 600 + rand() * 800;
      }
      break;
    default:
      if (nowMs >= crab.idleUntil) {
        crab.state = "moving";
        crab.goalS = pickCrabGoal(crabDistance(crab), rand);
      }
  }
  crab.targetX = crabPointAt(crab.goalS ?? crabDistance(crab)).x;
  stepLegs(crab, walked, crab.state === "moving", delta);
}

/**
 * A knock on the glass at (tx, ty) startles the crab: it runs, much faster than
 * usual, to the cave that is the nearest along its route (the other one when
 * the first lies on the side of the knock), and hides there. A crab that is
 * already hiding stays hidden for longer.
 *
 * @param {Crawler} crab
 * @param {number} tx
 * @param {number} ty
 * @param {number} nowMs
 * @returns {boolean} whether it was startled
 */
export function startleCrab(crab, tx, ty, nowMs) {
  if (Math.hypot(crab.x - tx, crab.y - ty) > FLEE.radius) return false;
  const s = crabDistance(crab);
  crab.fleeUntil = nowMs + 4000;
  if (crab.state === "hidden" || crab.state === "hiding") {
    crab.idleUntil = Math.max(crab.idleUntil ?? 0, nowMs + CRAB_MOVE.fleeHidden[0]);
    return true;
  }
  if (crab.state === "emerging") {
    // Back in, at once.
    crab.state = "hiding";
    return true;
  }
  // The caves, nearest first; a cave on the side of the knock comes last (it would run towards it).
  const caves = [...CRAB_CAVES]
    .map((stop) => {
      const stopX = crabPointAt(stop).x;
      const towardKnock = Math.sign(stopX - crab.x) === Math.sign(tx - crab.x) && Math.abs(tx - crab.x) < Math.abs(stopX - crab.x);
      return { stop, cost: Math.abs(stop - s) + (towardKnock ? 400 : 0) };
    })
    .sort((a, b) => a.cost - b.cost);
  crab.goalS = caves[0].stop;
  crab.state = Math.abs(crab.goalS - s) < 0.5 ? "hiding" : "moving";
  return true;
}
