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
import { REEF_PILE } from "./reef-layout.js";

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

/** Time step (ms) assumed when the real one is unknown (first frame). */
const DEFAULT_FRAME_MS = 16.66;

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
    f.x += Math.sin(animTime * 1.5 + f.phase) * 0.25 * delta;
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

/**
 * A knock on the glass at (tx, ty) startles the Ancistrus: it turns away from
 * the knock and darts off, much faster than its usual glide, for a moment.
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
  anc.targetX = Math.min(934, Math.max(90, anc.x + Math.sin(angle) * trip));
  anc.targetY = Math.min(tank.tankBottom - 110, Math.max(Math.max(tank.tankTop + 65, tank.waterSurfaceY + 70), anc.y - Math.cos(angle) * trip));
  anc.state = "moving";
  anc.fleeUntil = nowMs + FLEE.durationMs;
  return true;
}

/**
 * A knock on the glass startles a creature that walks on the sand (shrimp,
 * crab, goby): it runs away from the knock, along its lane, much faster than
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

/** How the plecostomus moves: units per frame, degrees per frame it can turn, and how far it goes at a time. */
export const ANCISTRUS_MOVE = { speed: 0.8, turn: 3, minTrip: 140, maxTrip: 420 };

/** The shortest way round from one heading to another, in degrees (-180..180). @param {number} from @param {number} to */
const turnBetween = (from, to) => ((((to - from) % 360) + 540) % 360) - 180;

/**
 * The plecostomus: rests on the glass, then turns to face a new spot and
 * glides to it, in any direction (up, down, sideways, diagonally), and sinks
 * when the tank is dead. Idle and move delays come from the injected clock and
 * random source.
 *
 * @param {Ancistrus} anc
 * @param {Frame} frame
 * @param {RandomSource} [rand]
 */
export function stepAncistrus(anc, frame, rand = Math.random) {
  const { isDead, deathStep, tankBottom, tankTop, waterSurfaceY, delta, timestamp, userSpeed, nowMs } = frame;
  const fleeing = (anc.fleeUntil ?? 0) > nowMs;

  if (isDead) {
    anc.deathProgress = Math.min(1.0, (anc.deathProgress || 0) + deathStep);
    anc.y = Math.min(tankBottom - 35, anc.y + 1.2 * delta);
    return;
  }

  anc.deathProgress = 0;
  anc.heading = anc.heading ?? 0;
  const minVX = 90;
  const maxVX = 934;
  const minVY = Math.max(tankTop + 65, waterSurfaceY + 70);
  const maxVY = tankBottom - 110;

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
    anc.state = "moving";
    // A trip of a good length in a random direction, kept inside its area.
    const angle = rand() * 2 * Math.PI;
    const trip = ANCISTRUS_MOVE.minTrip + rand() * (ANCISTRUS_MOVE.maxTrip - ANCISTRUS_MOVE.minTrip);
    anc.targetX = Math.min(maxVX, Math.max(minVX, anc.x + Math.sin(angle) * trip));
    anc.targetY = Math.min(maxVY, Math.max(minVY, anc.y - Math.cos(angle) * trip));
  }
}

/** @type {CrawlerSpec} */
// The shrimp walks on the sand between the coral and the pile of rock; the crab
// lives on the flat rock of that pile, at three quarters of its height; the
// goby stays at its burrow in the sand (its lane is one point).
export const SHRIMP_SPEC = {
  minX: 560,
  maxX: 740,
  floorOffset: 25,
  speed: 0.9,
  firstIdle: [1200, 2000],
  nextIdle: [1500, 2500],
};
/** @type {CrawlerSpec} */
export const CRAB_SPEC = {
  minX: REEF_PILE.ledgeFrom,
  maxX: REEF_PILE.ledgeTo,
  // The crab's body is drawn about 30 units above its feet.
  floorOffset: REEF_PILE.ledge + 30,
  speed: 0.5,
  firstIdle: [2000, 3000],
  nextIdle: [2500, 3500],
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
  creature.y = tankBottom - spec.floorOffset;

  if (!creature.idleUntil) {
    creature.idleUntil = timestamp + spec.firstIdle[0] + rand() * spec.firstIdle[1];
  }

  if (creature.state === "moving") {
    const dx = creature.targetX - creature.x;
    creature.dir = dx < 0 ? -1 : 1;
    const step = Math.sign(dx) * Math.min(Math.abs(dx), spec.speed * userSpeed * (fleeing ? FLEE.crawlerFactor : 1) * delta);
    creature.x += step;
    if (Math.abs(creature.targetX - creature.x) < 1.5) {
      creature.state = "idle";
      creature.idleUntil = timestamp + spec.nextIdle[0] + rand() * spec.nextIdle[1];
    }
  } else if (timestamp >= creature.idleUntil) {
    creature.state = "moving";
    creature.targetX = spec.minX + rand() * (spec.maxX - spec.minX);
  }
}
