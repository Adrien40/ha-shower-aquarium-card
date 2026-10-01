// Unit tests of the extracted simulation (physics.js). No DOM, no card: every
// function is called with a hand-made frame, a fixed clock and a scripted
// random source, so each formula can be checked exactly.
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  DEATH_DURATION_MS,
  FOOD_LIFETIME_MS,
  createFrame,
  advanceDeath,
  smoothFlowIntensity,
  pruneRipples,
  stepFood,
  FOOD_DRAG,
  stepFlowBubbles,
  stepRisingBubbles,
  stepBoilingBubbles,
  stepFish,
  stepSnail,
  stepAncistrus,
  ancistrusYRange,
  separateFish,
  FISH_SPACING,
  stepCrawler,
  SHRIMP_SPEC,
  GOBY_SPEC,
  SNAIL_REJOIN_SPEED,
} from "./physics.js";
import { RIPPLE_DURATION_MS } from "./pure.js";
import { REEF_PILE, CRAB_ROUTE } from "./reef-layout.js";

// A lane on the flat rock of the pile of live rock (where the crab used to live): a crawler specification
// for the generic walking tests.
const LEDGE_SPEC = {
  minX: REEF_PILE.ledgeFrom,
  maxX: REEF_PILE.ledgeTo,
  floorOffset: REEF_PILE.ledge + 30,
  speed: 0.5,
  firstIdle: [2000, 3000],
  nextIdle: [2500, 3500],
};


afterEach(() => vi.restoreAllMocks());

const NOW = 1_000_000;

const tank = (over = {}) => ({
  tankTop: 15,
  tankBottom: 565,
  waterSurfaceY: 15,
  waterRatio: 1,
  isDead: false,
  isBoiling: false,
  speedMultiplier: 1,
  ...over,
});

const frame = (over = {}, tankOver = {}) =>
  createFrame({
    timestamp: 1000,
    deltaMs: 16.66,
    delta: 1,
    nowMs: NOW,
    animTime: 0,
    tank: tank(tankOver),
    userSpeed: 1,
    themeKey: "freshwater",
    ...over,
  });

/** A small seeded random source (mulberry32). */
const seededRandom = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** A random source that always returns the same value. */
const constant = (v) => () => v;
/** A random source that returns the given values in order (then repeats the last). */
const scripted = (...values) => {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
};

const flake = (over = {}) => ({ x: 500, y: 100, vy: 1, phase: 0, r: 4, color: "#f59e0b", landedAt: 0, eaten: false, ...over });
const fish = (over = {}) => ({
  species: 0, x: 500, y: 300, vx: 1, vy: 0, dir: 1, scale: 1.4, scare: 0, deathProgress: 0, ...over,
});

// ---------------------------------------------------------------------------
describe("createFrame()", () => {
  it("carries the clocks, the options and the state of the tank", () => {
    const f = createFrame({
      timestamp: 7, deltaMs: 20, delta: 1.2, nowMs: 9, animTime: 3, userSpeed: 1.5, themeKey: "saltwater",
      tank: tank({ isDead: true, isBoiling: true, waterRatio: 0.4, waterSurfaceY: 300, speedMultiplier: 2.4 }),
    });
    expect(f).toMatchObject({
      timestamp: 7, deltaMs: 20, delta: 1.2, nowMs: 9, animTime: 3, userSpeed: 1.5, themeKey: "saltwater",
      tankTop: 15, tankBottom: 565, waterSurfaceY: 300, waterRatio: 0.4, isDead: true, isBoiling: true, speedMultiplier: 2.4,
    });
  });

  it("derives the death step from the real frame duration", () => {
    expect(frame({ deltaMs: 45 }).deathStep).toBeCloseTo(45 / DEATH_DURATION_MS, 10);
  });

  it("assumes 60 Hz when the real duration is unknown (first frame)", () => {
    expect(frame({ deltaMs: 0 }).deathStep).toBeCloseTo(16.66 / DEATH_DURATION_MS, 10);
  });

  it("the whole death animation lasts DEATH_DURATION_MS", () => {
    expect(DEATH_DURATION_MS).toBe(4500);
  });
});

describe("advanceDeath()", () => {
  it("is 0 while alive, whatever it was", () => {
    expect(advanceDeath(0.8, false, 0.1)).toBe(0);
  });

  it("adds the step while dead", () => {
    expect(advanceDeath(0.25, true, 0.1)).toBeCloseTo(0.35, 10);
  });

  it("never exceeds 1", () => {
    expect(advanceDeath(0.99, true, 0.5)).toBe(1);
  });

  it("treats a missing value as 0", () => {
    expect(advanceDeath(undefined, true, 0.2)).toBeCloseTo(0.2, 10);
  });
});

describe("smoothFlowIntensity()", () => {
  it("moves 3 % of the way to the goal per 60 Hz frame", () => {
    expect(smoothFlowIntensity(0, 1, 1)).toBeCloseTo(0.03, 10);
    expect(smoothFlowIntensity(1, 0.5, 1)).toBeCloseTo(0.985, 10);
  });

  it("scales with the time step", () => {
    expect(smoothFlowIntensity(0, 1, 2)).toBeCloseTo(0.06, 10);
  });

  it("never overshoots, even after a very long frame", () => {
    expect(smoothFlowIntensity(0, 0.8, 1000)).toBeCloseTo(0.8, 10);
  });

  it("snaps to exactly 0 once nearly calm with no flow", () => {
    expect(smoothFlowIntensity(0.004, 0, 1)).toBe(0);
  });

  it("does not snap while there is still flow to reach", () => {
    expect(smoothFlowIntensity(0.001, 0.5, 1)).toBeGreaterThan(0.001);
  });

  it("does not snap while still noticeably above zero", () => {
    expect(smoothFlowIntensity(0.5, 0, 1)).toBeGreaterThan(0.4);
  });
});

describe("pruneRipples()", () => {
  it("keeps a ripple until RIPPLE_DURATION_MS has elapsed", () => {
    const ripples = [{ born: NOW - RIPPLE_DURATION_MS + 1 }, { born: NOW - RIPPLE_DURATION_MS }];
    expect(pruneRipples(ripples, NOW)).toEqual([ripples[0]]);
  });

  it("does not modify the list it is given", () => {
    const ripples = [{ born: 0 }];
    pruneRipples(ripples, NOW);
    expect(ripples).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
describe("stepFood()", () => {
  it("returns a fresh empty list and reports no change in a dead tank", () => {
    const food = [flake()];
    const result = stepFood(food, frame({}, { isDead: true }));
    expect(result.food).toEqual([]);
    expect(result.food).not.toBe(food);
    expect(result.changed).toBe(false);
  });

  it("returns an empty list when the tank is empty", () => {
    expect(stepFood([flake()], frame({}, { waterRatio: 0 })).food).toEqual([]);
  });

  it("returns the very same list, unchanged, when there is no food", () => {
    const food = [];
    const result = stepFood(food, frame());
    expect(result.food).toBe(food);
    expect(result.changed).toBe(false);
  });

  it("sinks a flake by vy per frame and sways it sideways", () => {
    const f = flake({ y: 100, vy: 0.6, x: 500, phase: 0 });
    stepFood([f], frame({ delta: 2, animTime: 1 }));
    expect(f.y).toBeCloseTo(101.2, 10);
    expect(f.x).toBeCloseTo(500 + Math.sin(1.5) * 0.25 * 2, 10);
  });

  it("a thrown flake flies sideways and the water holds it back, a little more each frame", () => {
    const f = flake({ y: 100, vy: 0.6, x: 500, phase: 0, vx: 3 });
    stepFood([f], frame({ animTime: 0 }));
    expect(f.x).toBeCloseTo(503, 6);
    expect(f.vx).toBeCloseTo(3 * FOOD_DRAG.keep, 9);
    let before = f.x;
    let step = Infinity;
    for (let i = 0; i < 400; i++) {
      stepFood([f], frame({ animTime: 0 }));
      const moved = f.x - before;
      expect(moved).toBeLessThanOrEqual(step + 1e-9);
      step = moved;
      before = f.x;
    }
    expect(f.vx).toBeLessThan(0.001);
    // It goes about 3 / (1 - 0.96) = 75 units farther in all.
    expect(f.x).toBeGreaterThan(560);
    expect(f.x).toBeLessThan(590);
  });

  it("the drag follows the time step, so a slow screen throws the same distance", () => {
    const [a, b] = [flake({ x: 500, vx: 3, vy: 0, y: 100 }), flake({ x: 500, vx: 3, vy: 0, y: 100 })];
    for (let i = 0; i < 40; i++) stepFood([a], frame({ delta: 1 }));
    for (let i = 0; i < 20; i++) stepFood([b], frame({ delta: 2 }));
    expect(b.x).toBeCloseTo(a.x, 0);
    expect(b.vx).toBeCloseTo(a.vx, 6);
  });

  it("a flake thrown to the left goes left, and never through the glass on either side", () => {
    const left = flake({ x: 40, vx: -9, vy: 0, y: 100 });
    const right = flake({ x: 985, vx: 9, vy: 0, y: 100 });
    for (let i = 0; i < 20; i++) stepFood([left, right], frame());
    expect(left.x).toBe(FOOD_DRAG.minX);
    expect(right.x).toBe(FOOD_DRAG.maxX);
  });

  it("a flake without a throw (an old one) just sways", () => {
    const f = flake({ x: 500, vy: 0, y: 100, vx: undefined, phase: 0 });
    stepFood([f], frame({ animTime: 0 }));
    expect(f.x).toBe(500);
    expect(f.vx).toBe(0);
  });

  it("holds a flake at the water surface", () => {
    const f = flake({ y: 100, vy: 0 });
    stepFood([f], frame({}, { waterSurfaceY: 300, waterRatio: 0.5 }));
    expect(f.y).toBe(300);
  });

  it("lands a flake on the sand 30 px above the bottom and stamps the time", () => {
    const f = flake({ y: 534, vy: 5 });
    const result = stepFood([f], frame());
    expect(f.y).toBe(535);
    expect(f.landedAt).toBe(NOW);
    expect(result.changed).toBe(true);
  });

  it("leaves a landed flake exactly where it is", () => {
    const f = flake({ y: 535, x: 400, landedAt: NOW - 100 });
    stepFood([f], frame({ delta: 2, animTime: 5 }));
    expect(f).toMatchObject({ x: 400, y: 535 });
  });

  it("removes a flake once it has been on the sand longer than FOOD_LIFETIME_MS", () => {
    const stays = flake({ y: 535, landedAt: NOW - FOOD_LIFETIME_MS });
    const goes = flake({ y: 535, landedAt: NOW - FOOD_LIFETIME_MS - 1 });
    expect(stepFood([stays, goes], frame()).food).toEqual([stays]);
  });

  it("removes eaten flakes", () => {
    const keep = flake();
    expect(stepFood([flake({ eaten: true }), keep], frame()).food).toEqual([keep]);
  });
});

// ---------------------------------------------------------------------------
describe("stepFlowBubbles()", () => {
  const pool = (n = 10) =>
    Array.from({ length: n }, () => ({ active: false, x: 512, baseX: 512, y: 0, vy: 2, r: 3, phase: 0 }));

  it("starts the bubbles the flow asks for, and no more", () => {
    const bubbles = pool(36);
    stepFlowBubbles(bubbles, frame(), 0.5, 36, constant(0.5));
    expect(bubbles.filter((b) => b.active)).toHaveLength(20); // round(4 + 0.5 * 32)
  });

  it("starts nothing without flow", () => {
    const bubbles = pool();
    stepFlowBubbles(bubbles, frame(), 0, 36, constant(0.5));
    expect(bubbles.some((b) => b.active)).toBe(false);
  });

  it("draws the five random numbers of a new bubble in a fixed order", () => {
    const bubbles = pool(1);
    stepFlowBubbles(bubbles, frame(), 1, 36, scripted(0.25, 0.5, 0.75, 0.125, 0.5));
    const b = bubbles[0];
    expect(b.baseX).toBeCloseTo(512 + (0.25 - 0.5) * 90, 10);
    expect(b.x).toBe(b.baseX);
    expect(b.y).toBeCloseTo(565 - 10 - 0.5 * 40, 10);
    expect(b.vy).toBeCloseTo(1.8 + 0.75 * 2.2 + 1 * 1.2, 10);
    expect(b.r).toBeCloseTo(2 + 0.125 * 4, 10);
    expect(b.phase).toBeCloseTo(0.5 * Math.PI * 2, 10);
  });

  it("does not use Math.random when a random source is given", () => {
    const spy = vi.spyOn(Math, "random");
    stepFlowBubbles(pool(), frame(), 1, 36, constant(0.5));
    expect(spy).not.toHaveBeenCalled();
  });

  it("moves an active bubble up and sways it around its base column", () => {
    const b = { active: true, x: 0, baseX: 500, y: 300, vy: 3, r: 3, phase: 0 };
    const changed = stepFlowBubbles([b], frame({ delta: 2, animTime: 1 }), 0, 36);
    expect(b.y).toBeCloseTo(294, 10);
    expect(b.x).toBeCloseTo(500 + Math.sin(2) * 6, 10);
    expect(changed).toBe(true);
  });

  it("switches a bubble off 2 px below the water surface", () => {
    const stays = { active: true, x: 0, baseX: 500, y: 122.5, vy: 0.5, r: 3, phase: 0 };
    const goes = { active: true, x: 0, baseX: 500, y: 121.5, vy: 0.5, r: 3, phase: 0 };
    stepFlowBubbles([stays, goes], frame({}, { waterSurfaceY: 120, waterRatio: 0.8 }), 0, 36);
    expect(stays.active).toBe(true);
    expect(goes.active).toBe(false);
  });

  it("switches every bubble off in a dead tank and starts none", () => {
    const bubbles = [{ active: true, x: 0, baseX: 0, y: 300, vy: 1, r: 3, phase: 0 }, ...pool(3)];
    stepFlowBubbles(bubbles, frame({}, { isDead: true }), 1, 36, constant(0.5));
    expect(bubbles.every((b) => !b.active)).toBe(true);
  });

  it("starts none in an empty tank", () => {
    const bubbles = pool();
    stepFlowBubbles(bubbles, frame({}, { waterRatio: 0 }), 1, 36, constant(0.5));
    expect(bubbles.every((b) => !b.active)).toBe(true);
  });

  it("reports no change when nothing was moving", () => {
    expect(stepFlowBubbles(pool(), frame(), 0, 36)).toBe(false);
  });
});

describe("stepRisingBubbles() and stepBoilingBubbles()", () => {
  it("rising bubbles drift up and restart 15 px above the bottom once past the surface", () => {
    const b = { x: 1, y: 100, vy: 2, r: 3 };
    const wrap = { x: 1, y: 16, vy: 2, r: 3 };
    expect(stepRisingBubbles([b, wrap], frame({ delta: 1.5 }))).toBe(true);
    expect(b.y).toBeCloseTo(97, 10);
    expect(wrap.y).toBe(550);
  });

  it.each([
    ["dead", { isDead: true }],
    ["empty", { waterRatio: 0 }],
  ])("rising bubbles stand still in a %s tank", (_name, tankOver) => {
    const b = { x: 1, y: 100, vy: 2, r: 3 };
    expect(stepRisingBubbles([b], frame({}, tankOver))).toBe(false);
    expect(b.y).toBe(100);
  });

  it("reports no change for an empty list", () => {
    expect(stepRisingBubbles([], frame())).toBe(false);
    expect(stepBoilingBubbles([], frame({}, { isBoiling: true }))).toBe(false);
  });

  it("boiling bubbles only move while boiling", () => {
    const b = { x: 100, y: 300, vy: 3, vx: 1, r: 5 };
    expect(stepBoilingBubbles([b], frame())).toBe(false);
    expect(b).toMatchObject({ x: 100, y: 300 });
    expect(stepBoilingBubbles([b], frame({ delta: 2 }, { isBoiling: true }))).toBe(true);
    expect(b).toMatchObject({ x: 102, y: 294 });
  });

  it("boiling bubbles stop in an empty tank", () => {
    expect(stepBoilingBubbles([{ x: 1, y: 300, vy: 1, vx: 0, r: 5 }], frame({}, { isBoiling: true, waterRatio: 0 }))).toBe(false);
  });

  it("boiling bubbles restart at a random column when they reach the surface", () => {
    const b = { x: 100, y: 16, vy: 3, vx: 0, r: 5 };
    stepBoilingBubbles([b], frame({}, { isBoiling: true }), constant(0.5));
    expect(b.y).toBe(550);
    expect(b.x).toBeCloseTo(10 + 0.5 * 1004, 10);
  });
});

// ---------------------------------------------------------------------------
describe("stepFish()", () => {
  it("swims by vx * dir * speed * delta", () => {
    const f = fish({ x: 500, vx: 2, dir: -1 });
    stepFish(f, frame({ delta: 1.5 }, { speedMultiplier: 2 }), []);
    expect(f.x).toBeCloseTo(500 - 2 * 2 * 1.5, 10);
  });

  it("moves vertically by vy * speed * delta", () => {
    const f = fish({ y: 300, vy: 0.5 });
    stepFish(f, frame({ delta: 2 }, { speedMultiplier: 1.5 }), []);
    expect(f.y).toBeCloseTo(300 + 0.5 * 1.5 * 2, 10);
  });

  it("turns around at the walls", () => {
    const right = fish({ x: 909, vx: 5, dir: 1 });
    stepFish(right, frame(), []);
    expect(right).toMatchObject({ x: 910, dir: -1 });
    const left = fish({ x: 111, vx: 5, dir: -1 });
    stepFish(left, frame(), []);
    expect(left).toMatchObject({ x: 110, dir: 1 });
  });

  it("bounces off the floor and the ceiling", () => {
    const low = fish({ y: 519, vy: 5 });
    stepFish(low, frame(), []);
    expect(low.y).toBe(520);
    expect(low.vy).toBeLessThan(0);
    const high = fish({ y: 61, vy: -5 });
    stepFish(high, frame(), []);
    expect(high.y).toBe(60);
    expect(high.vy).toBeGreaterThan(0);
  });

  it("stays 35 px under the water surface", () => {
    const f = fish({ y: 100, vy: 0 });
    stepFish(f, frame({}, { waterSurfaceY: 300, waterRatio: 0.5 }), []);
    expect(f.y).toBe(335);
  });

  it("a saltwater clownfish lives in a narrow zone; every other fish does not", () => {
    const clown = fish({ species: 0, x: 379, vx: 5, dir: 1 });
    stepFish(clown, frame({ themeKey: "saltwater" }), []);
    expect(clown.x).toBe(380);
    const other = fish({ species: 2, x: 379, vx: 5, dir: 1 });
    stepFish(other, frame({ themeKey: "saltwater" }), []);
    expect(other.x).toBeGreaterThan(380);
    const freshwaterSpecies0 = fish({ species: 0, x: 379, vx: 5, dir: 1 });
    stepFish(freshwaterSpecies0, frame({ themeKey: "freshwater" }), []);
    expect(freshwaterSpecies0.x).toBeGreaterThan(380);
  });

  it("a clownfish stays in the lowest 160 px of the tank", () => {
    const clown = fish({ species: 0, y: 100, vy: 0 });
    stepFish(clown, frame({ themeKey: "saltwater" }), []);
    expect(clown.y).toBe(565 - 160);
  });

  it("sinks and fades when dead, and stops on the bottom", () => {
    const f = fish({ y: 300, deathProgress: 0.5 });
    stepFish(f, frame({ delta: 2, deltaMs: 900 }, { isDead: true }), []);
    expect(f.y).toBeCloseTo(302.4, 10);
    expect(f.deathProgress).toBeCloseTo(0.7, 10);
    const bottom = fish({ y: 534 });
    stepFish(bottom, frame({ delta: 2 }, { isDead: true }), []);
    expect(bottom.y).toBe(535);
  });

  it("does not swim at all when dead", () => {
    const f = fish({ x: 500, vx: 5 });
    stepFish(f, frame({}, { isDead: true }), []);
    expect(f.x).toBe(500);
  });

  it("comes back to life with no death progress", () => {
    const f = fish({ deathProgress: 0.9 });
    stepFish(f, frame(), []);
    expect(f.deathProgress).toBe(0);
  });

  describe("fish food", () => {
    it("chases the nearest flake, faster", () => {
      const f = fish({ x: 300, y: 300, vx: 1, dir: -1 });
      stepFish(f, frame(), [flake({ x: 100, y: 300 }), flake({ x: 450, y: 300 })]);
      expect(f.dir).toBe(1);
      expect(f._seeking).toBe(true);
      expect(f.x).toBeCloseTo(300 + 1 * 1 * 1.8, 10);
    });

    it("steers vertically toward the flake, at most 1.1 per frame", () => {
      const f = fish({ x: 300, y: 300 });
      stepFish(f, frame(), [flake({ x: 320, y: 500 })]);
      expect(f.vy).toBeCloseTo(1.1, 10);
      const g = fish({ x: 300, y: 300 });
      stepFish(g, frame(), [flake({ x: 320, y: 310 })]);
      expect(g.vy).toBeCloseTo(0.2, 10);
    });

    it("keeps its heading when the flake is within 6 px horizontally", () => {
      const f = fish({ x: 300, dir: -1 });
      stepFish(f, frame(), [flake({ x: 303, y: 320 })]);
      expect(f.dir).toBe(-1);
    });

    it("ignores flakes that are out of range", () => {
      const f = fish({ x: 300, y: 300 });
      stepFish(f, frame(), [flake({ x: 700, y: 300 })]);
      expect(f._seeking).toBeUndefined();
    });

    it("is startled as soon as its fear exceeds 0.05, and not before", () => {
      const scared = fish({ x: 300, y: 300, dir: -1, scare: 0.06 });
      stepFish(scared, frame(), [flake({ x: 400, y: 300 })]);
      expect(scared._seeking).toBeUndefined();
      const calm = fish({ x: 300, y: 300, dir: -1, scare: 0.05 });
      stepFish(calm, frame(), [flake({ x: 400, y: 300 })]);
      expect(calm._seeking).toBe(true);
    });

    it("ignores food while startled", () => {
      const f = fish({ x: 300, dir: -1, scare: 0.8 });
      stepFish(f, frame(), [flake({ x: 400, y: 300 })]);
      expect(f._seeking).toBeUndefined();
      expect(f.dir).toBe(-1);
    });

    it("gives its own swimming speed back once the food is gone", () => {
      const f = fish({ x: 300, y: 300, vy: 0.4 });
      stepFish(f, frame(), [flake({ x: 400, y: 100 })]);
      expect(f._seeking).toBe(true);
      stepFish(f, frame(), []);
      expect(f._seeking).toBe(false);
      expect(f.vy).toBeCloseTo(0.4, 10);
    });

    it("stops seeking even if its remembered speed is missing", () => {
      const f = fish({ vy: 0.7, _seeking: true });
      stepFish(f, frame(), []);
      expect(f._seeking).toBe(false);
      expect(f.vy).toBe(0.7);
    });

    it("eats a flake that reaches its mouth, and only that one", () => {
      const f = fish({ x: 400, y: 300, vx: 0, dir: 1, scale: 2 });
      const near = flake({ x: 400 + 22 * 2, y: 300 });
      const far = flake({ x: 700, y: 300 });
      stepFish(f, frame(), [near, far]);
      expect(near.eaten).toBe(true);
      expect(far.eaten).toBe(false);
    });

    it("its mouth is on the side it faces", () => {
      // Startled, so that it ignores the food and keeps its heading.
      const f = fish({ x: 400, y: 300, vx: 0, dir: -1, scale: 1.4, scare: 0.8 });
      const behind = flake({ x: 400 + 22 * 1.4, y: 300 });
      const ahead = flake({ x: 400 - 22 * 1.4, y: 300 });
      stepFish(f, frame(), [behind, ahead]);
      expect(ahead.eaten).toBe(true);
      expect(behind.eaten).toBe(false);
    });

    it("uses a default size for a fish without a scale", () => {
      const f = fish({ x: 400, y: 300, vx: 0, dir: 1 });
      delete f.scale;
      const target = flake({ x: 400 + 22 * 1.4, y: 300 });
      stepFish(f, frame(), [target]);
      expect(target.eaten).toBe(true);
    });
  });

  describe("startled by a knock", () => {
    it("dashes, then the impulse decays by 7 % per frame", () => {
      const f = fish({ x: 500, vx: 0, kickX: 8, kickY: 0, scare: 1 });
      stepFish(f, frame(), []);
      expect(f.x).toBeCloseTo(508, 10);
      expect(f.kickX).toBeCloseTo(8 * 0.93, 10);
      expect(f.scare).toBeCloseTo(Math.min(1, (8 * 0.93) / 8), 10);
    });

    it("an impulse with only a vertical component does not produce NaN (regression found by the type checker)", () => {
      const f = fish({ x: 500, y: 300, vx: 0 });
      delete f.kickX;
      f.kickY = 4;
      stepFish(f, frame(), []);
      expect(Number.isFinite(f.x)).toBe(true);
      expect(f.x).toBe(500);
      expect(f.y).toBeCloseTo(304, 10);
      expect(f.kickX).toBe(0);
    });

    it("an impulse with only a horizontal component works too", () => {
      const f = fish({ x: 500, y: 300, vx: 0 });
      delete f.kickY;
      f.kickX = 4;
      stepFish(f, frame(), []);
      expect(f.x).toBeCloseTo(504, 10);
      expect(f.y).toBe(300);
    });

    it("a fish that never had any fear or impulse defined behaves like a calm one", () => {
      const f = fish({ x: 300, y: 300, dir: -1 });
      delete f.scare;
      stepFish(f, frame(), [flake({ x: 400, y: 300 })]);
      expect(f._seeking).toBe(true);
    });

    it("calms down completely once the impulse is below 0.15", () => {
      const f = fish({ kickX: 0.1, kickY: 0.05, scare: 0.2 });
      stepFish(f, frame(), []);
      expect(f).toMatchObject({ kickX: 0, kickY: 0, scare: 0 });
    });

    it("the impulse decay follows the time step", () => {
      const slow = fish({ vx: 0, kickX: 8, kickY: 0 });
      stepFish(slow, frame({ delta: 2 }), []);
      expect(slow.kickX).toBeCloseTo(8 * Math.pow(0.93, 2), 10);
    });
  });
});

// ---------------------------------------------------------------------------
describe("stepSnail()", () => {
  it("a bottom snail crawls and turns around at both ends", () => {
    const s = { type: "bottom", x: 500, y: 550, vx: 0.5, vy: 0, dir: -1 };
    stepSnail(s, frame({ delta: 2 }));
    expect(s.x).toBeCloseTo(499, 10);
    const right = { type: "bottom", x: 919.9, y: 550, vx: 1, vy: 0, dir: 1 };
    stepSnail(right, frame());
    expect(right).toMatchObject({ x: 920, dir: -1 });
    const left = { type: "bottom", x: 100.1, y: 550, vx: 1, vy: 0, dir: -1 };
    stepSnail(left, frame());
    expect(left).toMatchObject({ x: 100, dir: 1 });
  });

  it.each([
    [565, 555],
    [600, 590],
    [1200, 1190],
    [2048, 2038],
  ])("a bottom snail sits on the sand of a tank whose bottom is at %s: y = %s (10 px above it)", (tankBottom, expected) => {
    // From wherever it was: a snail that was hidden below the glass, or floating in a taller tank.
    for (const startY of [0, 590, 5000]) {
      const s = { type: "bottom", x: 500, y: startY, vx: 0.1, vy: 0, dir: 1 };
      stepSnail(s, frame({}, { tankBottom }));
      expect(s.y).toBe(expected);
    }
  });

  it("a bottom snail keeps crawling sideways while it is pinned to the sand", () => {
    const s = { type: "bottom", x: 500, y: 0, vx: 0.5, vy: 0, dir: 1 };
    stepSnail(s, frame({ delta: 2 }));
    expect(s.x).toBeCloseTo(501, 10);
    expect(s.y).toBe(555);
  });

  it("the glass snails do not get pinned to the sand", () => {
    const s = { type: "glass_left", x: 18, y: 200, vx: 0, vy: 0.1, dir: 1 };
    stepSnail(s, frame());
    expect(s.y).toBeCloseTo(200.1, 10);
  });

  it.each(["glass_left", "glass_right"])("a %s snail turns around at the top and the bottom of its track", (type) => {
    // The top of the track is 50 (tank top + 35); crossing it is strict.
    const top = { type, x: 18, y: 50.5, vx: 0, vy: -1, dir: 1 };
    stepSnail(top, frame());
    expect(top).toMatchObject({ y: 50, vy: 1 });
    const bottom = { type, x: 18, y: 539.5, vx: 0, vy: 1, dir: 1 };
    stepSnail(bottom, frame());
    expect(bottom).toMatchObject({ y: 540, vy: -1 });
  });

  describe("a glass snail and the water level", () => {
    const glass = (over = {}) => ({ type: "glass_left", x: 18, y: 100, vx: 0, vy: 0, dir: 1, ...over });
    const lowered = { waterSurfaceY: 300, waterRatio: 0.5 }; // the snail may graze from y = 325 down

    it("is not carried down with the water: left above it, it stays where it is and crawls down", () => {
      const s = glass();
      stepSnail(s, frame({}, lowered));
      expect(s.y).toBeCloseTo(100 + SNAIL_REJOIN_SPEED, 10);
      expect(s.y).toBeLessThan(110);
    });

    it("crawls down faster than it grazes, at its own pace when that is even faster", () => {
      const slow = glass({ vy: 0.06 });
      stepSnail(slow, frame({}, lowered));
      expect(slow.y).toBeCloseTo(100 + SNAIL_REJOIN_SPEED, 10);
      const quick = glass({ vy: 0.5 });
      stepSnail(quick, frame({}, lowered));
      expect(quick.y).toBeCloseTo(100.5, 10);
    });

    it("turns towards the water even when it was heading up the glass", () => {
      const s = glass({ vy: -0.07 });
      stepSnail(s, frame({}, lowered));
      expect(s.vy).toBeCloseTo(0.07, 10);
      expect(s.y).toBeGreaterThan(100);
    });

    it("crawls further in a longer step", () => {
      const s = glass();
      stepSnail(s, frame({ delta: 3 }, lowered));
      expect(s.y).toBeCloseTo(100 + 3 * SNAIL_REJOIN_SPEED, 10);
    });

    it("stops at the water and goes on grazing there", () => {
      const s = glass({ y: 324.9, vy: 0.07 });
      stepSnail(s, frame({}, lowered));
      expect(s.y).toBe(325);
      stepSnail(s, frame({}, lowered));
      expect(s.y).toBeCloseTo(325.07, 10);
    });

    it("takes a while to get back into the water, not a single step", () => {
      const s = glass();
      let steps = 0;
      while (s.y < 325 && steps < 5000) {
        stepSnail(s, frame({}, lowered));
        steps++;
      }
      expect(steps).toBeGreaterThan(100);
      expect(s.y).toBe(325);
    });

    it("is left alone when it is already in the water", () => {
      const s = glass({ y: 400, vy: 0.05 });
      stepSnail(s, frame({}, lowered));
      expect(s.y).toBeCloseTo(400.05, 10);
    });

    it("works the same on the right-hand glass", () => {
      const s = glass({ type: "glass_right" });
      stepSnail(s, frame({}, lowered));
      expect(s.y).toBeCloseTo(100 + SNAIL_REJOIN_SPEED, 10);
    });

    it("the crawl goes back up in the same way when the tank fills again: it just grazes", () => {
      const s = glass({ y: 500, vy: 0.05 });
      stepSnail(s, frame({}, { waterSurfaceY: 50, waterRatio: 1 }));
      expect(s.y).toBeCloseTo(500.05, 10);
    });
  });

  it("a snail of an unknown type does not move", () => {
    const s = { type: "flying", x: 300, y: 300, vx: 1, vy: 1, dir: 1 };
    stepSnail(s, frame());
    expect(s).toMatchObject({ x: 300, y: 300 });
  });

  it("sinks when dead and rests 10 px above the bottom", () => {
    const s = { type: "bottom", x: 300, y: 300, vx: 1, vy: 0, dir: 1 };
    stepSnail(s, frame({ delta: 2 }, { isDead: true }));
    expect(s).toMatchObject({ x: 300, y: 303 });
    const low = { type: "bottom", x: 300, y: 554, vx: 1, vy: 0, dir: 1 };
    stepSnail(low, frame({ delta: 2 }, { isDead: true }));
    expect(low.y).toBe(555);
  });
});

// ---------------------------------------------------------------------------
describe("separateFish()", () => {
  const fish = (over = {}) => ({ species: 0, x: 500, y: 300, vx: 1, vy: 0.4, dir: 1, scale: 1.4, deathProgress: 0, ...over });
  const gap = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  it("pushes two fish that are on top of each other apart, and keeps pushing while they overlap", () => {
    const a = fish({ x: 500, y: 300 });
    const b = fish({ x: 510, y: 304 });
    const before = gap(a, b);
    expect(separateFish([a, b], frame())).toBe(true);
    expect(gap(a, b)).toBeGreaterThan(before);
    for (let i = 0; i < 300; i++) separateFish([a, b], frame());
    // Their ellipses (about 25 by 16 units per unit of scale, shrunk to 0.85) no longer overlap.
    const size = a.scale + b.scale;
    expect(Math.hypot((a.x - b.x) / (FISH_SPACING.rx * FISH_SPACING.factor * size), (a.y - b.y) / (FISH_SPACING.ry * FISH_SPACING.factor * size))).toBeGreaterThanOrEqual(0.999);
  });

  it("pushes each of the two by the same amount, in opposite directions", () => {
    const a = fish({ x: 500, y: 300 });
    const b = fish({ x: 520, y: 300 });
    separateFish([a, b], frame());
    expect(a.x - 500).toBeCloseTo(-(b.x - 520), 10);
    expect(a.x).toBeLessThan(500);
    expect(b.x).toBeGreaterThan(520);
    expect(a.y).toBe(300);
    expect(b.y).toBe(300);
  });

  it("pushes along the line between them, so fish stacked one above the other part vertically", () => {
    const a = fish({ x: 500, y: 300 });
    const b = fish({ x: 500, y: 310 });
    separateFish([a, b], frame());
    expect(a.y).toBeLessThan(300);
    expect(b.y).toBeGreaterThan(310);
    expect(a.x).toBe(500);
  });

  it("leaves fish that keep their distance exactly where they are", () => {
    const a = fish({ x: 300, y: 200 });
    const b = fish({ x: 700, y: 400 });
    expect(separateFish([a, b], frame())).toBe(false);
    expect([a.x, a.y, b.x, b.y]).toEqual([300, 200, 700, 400]);
  });

  it("gives a big fish more room than a small one", () => {
    // Seventy units apart: enough for two small fish, not for a big one and a normal one.
    const small = [fish({ x: 500, y: 300, scale: 1.2 }), fish({ x: 570, y: 300, scale: 1.2 })];
    expect(separateFish(small, frame())).toBe(false);
    const big = [fish({ x: 500, y: 300, scale: 2.4 }), fish({ x: 570, y: 300, scale: 1.4 })];
    expect(separateFish(big, frame())).toBe(true);
  });

  it("pushes a fish from its own spot when two are at exactly the same place: one each way, sideways", () => {
    const a = fish({ x: 500, y: 300 });
    const b = fish({ x: 500, y: 300 });
    separateFish([a, b], frame());
    expect(a.x).toBeGreaterThan(500);
    expect(b.x).toBeLessThan(500);
    expect(a.y).toBe(300);
  });

  it("pushes at most 1.4 units per frame each, and more in a longer frame", () => {
    const a = fish({ x: 500, y: 300 });
    const b = fish({ x: 500, y: 300 });
    separateFish([a, b], frame({ delta: 1 }));
    expect(Math.abs(a.x - 500)).toBeLessThanOrEqual(FISH_SPACING.push + 1e-9);
    const c = fish({ x: 500, y: 300 });
    const d = fish({ x: 500, y: 300 });
    separateFish([c, d], frame({ delta: 3 }));
    expect(Math.abs(c.x - 500)).toBeCloseTo(3 * FISH_SPACING.push, 10);
  });

  it("does nothing in a dead tank", () => {
    const a = fish({ x: 500, y: 300 });
    const b = fish({ x: 505, y: 300 });
    expect(separateFish([a, b], frame({}, { isDead: true }))).toBe(false);
    expect([a.x, b.x]).toEqual([500, 505]);
  });

  it("keeps every fish in the water and inside the walls, even when they are crowded against them", () => {
    const fishes = Array.from({ length: 6 }, (_, i) => fish({ x: 112 + i, y: 62 + i }));
    for (let i = 0; i < 200; i++) separateFish(fishes, frame());
    for (const f of fishes) {
      expect(f.x).toBeGreaterThanOrEqual(110);
      expect(f.x).toBeLessThanOrEqual(910);
      expect(f.y).toBeGreaterThanOrEqual(15 + 45);
      expect(f.y).toBeLessThanOrEqual(565 - 45);
    }
  });

  it("keeps the clownfish near their anemone", () => {
    const pair = [fish({ species: 0, x: 200, y: 450 }), fish({ species: 0, x: 205, y: 452 })];
    for (let i = 0; i < 200; i++) separateFish(pair, frame({ themeKey: "saltwater" }));
    for (const f of pair) {
      expect(f.x).toBeGreaterThanOrEqual(160);
      expect(f.x).toBeLessThanOrEqual(380);
      expect(f.y).toBeGreaterThanOrEqual(565 - 160);
    }
  });

  it("spreads a whole tank of ten fish that start in a heap, without moving them far", () => {
    const heap = Array.from({ length: 10 }, (_, i) => fish({ x: 500 + (i % 3) * 8, y: 300 + (i % 4) * 6, scale: 1.4 }));
    for (let i = 0; i < 400; i++) separateFish(heap, frame());
    let closest = Infinity;
    for (let i = 0; i < heap.length; i++) for (let j = i + 1; j < heap.length; j++) closest = Math.min(closest, gap(heap[i], heap[j]));
    expect(closest).toBeGreaterThan(30);
  });

  it("does not change what the fish are, only where they are", () => {
    const a = fish({ x: 500, y: 300, dir: -1, vx: 1.3, vy: -0.4 });
    const b = fish({ x: 510, y: 300 });
    separateFish([a, b], frame());
    expect([a.dir, a.vx, a.vy, a.species, a.scale]).toEqual([-1, 1.3, -0.4, 0, 1.4]);
  });

  it("works with no fish and with a single one", () => {
    expect(separateFish([], frame())).toBe(false);
    expect(separateFish([fish()], frame())).toBe(false);
  });

  it("a fish without a size counts as a normal one (1.4)", () => {
    const a = fish({ x: 500, y: 300, scale: undefined });
    const b = fish({ x: 510, y: 300, scale: undefined });
    expect(separateFish([a, b], frame())).toBe(true);
  });
});

describe("stepAncistrus()", () => {
  const anc = (over = {}) => ({ x: 400, y: 340, targetX: 400, targetY: 340, heading: 0, state: "idle", idleUntil: 0, deathProgress: 0, ...over });
  // The tank of these tests: top 15, bottom 565, water surface at 15: it may go anywhere in x 90..934, y 85..455.

  it("schedules its first move from the clock and the random source", () => {
    const a = anc();
    stepAncistrus(a, frame({ timestamp: 1000 }), constant(0.5));
    expect(a.idleUntil).toBeCloseTo(1000 + 1000 + 0.5 * 2000, 10);
    expect(a.state).toBe("idle");
  });

  it("starts moving once its idle time has passed, on a trip in a random direction", () => {
    const a = anc({ idleUntil: 500 });
    // angle = 0.25 turn: straight to the right; trip = 140 + 0.5 * 280 = 280.
    stepAncistrus(a, frame({ timestamp: 1000 }), scripted(0.25, 0.5));
    expect(a.state).toBe("moving");
    expect(a.targetX).toBeCloseTo(400 + 280, 6);
    expect(a.targetY).toBeCloseTo(340, 6);
  });

  it("can set off in every direction: up, right, down, left and the diagonals", () => {
    const go = (turn) => {
      const a = anc({ y: 250, idleUntil: 500 });
      stepAncistrus(a, frame({ timestamp: 1000 }), scripted(turn, 0));
      return [Math.round(a.targetX - 400), Math.round(a.targetY - 250)];
    };
    expect(go(0)).toEqual([0, -140]);
    expect(go(0.25)).toEqual([140, 0]);
    expect(go(0.5)).toEqual([0, 140]);
    expect(go(0.75)).toEqual([-140, 0]);
    expect(go(0.125)).toEqual([99, -99]);
    expect(go(0.625)).toEqual([-99, 99]);
  });

  it("every trip is at least 140 long, unless a wall stops it", () => {
    for (const turn of [0.1, 0.3, 0.6, 0.9]) {
      const a = anc({ idleUntil: 500 });
      stepAncistrus(a, frame({ timestamp: 1000 }), scripted(turn, 0));
      expect(Math.hypot(a.targetX - a.x, a.targetY - a.y)).toBeGreaterThanOrEqual(140 - 1e-9);
    }
  });

  it("stays inside its area: a trip towards a wall turns into one along it, in the water and between the walls", () => {
    const tank = { tankBottom: 565, waterSurfaceY: 15 };
    for (const [x, y, turn] of [[100, 90, 0.875], [900, 440, 0.375], [95, 300, 0.75], [930, 100, 0.25]]) {
      const a = anc({ x, y, idleUntil: 500 });
      stepAncistrus(a, frame({ timestamp: 1000 }), scripted(turn, 1));
      expect(a.state).toBe("moving");
      expect(a.targetX).toBeGreaterThanOrEqual(90);
      expect(a.targetX).toBeLessThanOrEqual(934);
      // Far enough to be worth the trip, and where its body is in the water.
      expect(Math.hypot(a.targetX - x, a.targetY - y)).toBeGreaterThanOrEqual(60);
      const heading = (Math.atan2(a.targetX - x, -(a.targetY - y)) * 180) / Math.PI;
      const range = ancistrusYRange(heading, tank);
      // (the heading is worked out from the target, which is itself kept in range: within a unit)
      expect(a.targetY).toBeGreaterThanOrEqual(range.minY - 1);
      expect(a.targetY).toBeLessThanOrEqual(range.maxY + 1);
    }
  });

  it("keeps resting before its idle time has passed", () => {
    const a = anc({ idleUntil: 5000 });
    stepAncistrus(a, frame({ timestamp: 1000 }), constant(0.5));
    expect(a.state).toBe("idle");
  });

  it("glides 0.8 * speed * delta per frame straight to its target, whatever the direction", () => {
    const right = anc({ state: "moving", x: 200, y: 200, targetX: 600, targetY: 200, idleUntil: 1e9 });
    stepAncistrus(right, frame({ delta: 2 }), constant(0.5));
    expect(right.x).toBeCloseTo(200 + 0.8 * 2, 10);
    expect(right.y).toBeCloseTo(200, 10);
    const diagonal = anc({ state: "moving", x: 300, y: 300, targetX: 400, targetY: 400, idleUntil: 1e9 });
    stepAncistrus(diagonal, frame({ delta: 1, userSpeed: 2 }), constant(0.5));
    expect(diagonal.x).toBeCloseTo(300 + (0.8 * 2) / Math.SQRT2, 10);
    expect(diagonal.y).toBeCloseTo(300 + (0.8 * 2) / Math.SQRT2, 10);
    const up = anc({ state: "moving", x: 300, y: 400, targetX: 300, targetY: 100, idleUntil: 1e9 });
    stepAncistrus(up, frame({ delta: 2 }), constant(0.5));
    expect(up.y).toBeCloseTo(400 - 0.8 * 2, 10);
  });

  it("turns its head towards where it is going, at most 3 degrees per frame, the short way round", () => {
    const toRight = anc({ state: "moving", x: 200, y: 200, targetX: 600, targetY: 200, idleUntil: 1e9 });
    stepAncistrus(toRight, frame(), constant(0.5));
    expect(toRight.heading).toBeCloseTo(3, 10);
    const toLeft = anc({ state: "moving", x: 600, y: 200, targetX: 200, targetY: 200, idleUntil: 1e9 });
    stepAncistrus(toLeft, frame(), constant(0.5));
    expect(toLeft.heading).toBeCloseTo(-3, 10);
    const wrap = anc({ state: "moving", heading: 350, x: 200, y: 200, targetX: 600, targetY: 200, idleUntil: 1e9 });
    stepAncistrus(wrap, frame(), constant(0.5));
    expect(wrap.heading).toBeCloseTo(353, 10);
    const longer = anc({ state: "moving", x: 200, y: 200, targetX: 600, targetY: 200, idleUntil: 1e9 });
    stepAncistrus(longer, frame({ delta: 2 }), constant(0.5));
    expect(longer.heading).toBeCloseTo(6, 10);
  });

  it("ends up facing its target after a few frames, whichever way that is", () => {
    for (const [tx, ty, heading] of [[600, 200, 90], [200, 200, 0], [200, 500, 180], [-1, 0, 0]]) {
      if (tx < 0) continue;
      const a = anc({ state: "moving", x: 200, y: 200, targetX: tx, targetY: ty, idleUntil: 1e9 });
      for (let i = 0; i < 80; i++) stepAncistrus(a, frame(), constant(0.5));
      const normalised = ((a.heading % 360) + 360) % 360;
      const off = Math.min(Math.abs(normalised - heading), 360 - Math.abs(normalised - heading));
      expect(off, `${tx},${ty}`).toBeLessThan(6);
    }
  });

  it("a heading it does not have yet counts as facing up", () => {
    const a = anc({ heading: undefined, state: "moving", x: 200, y: 200, targetX: 200, targetY: 100, idleUntil: 1e9 });
    stepAncistrus(a, frame(), constant(0.5));
    expect(a.heading).toBeCloseTo(0, 10);
  });

  it("never overshoots its target and rests again once within 1.5 px", () => {
    const a = anc({ state: "moving", x: 300, y: 300, targetX: 300.5, targetY: 300.5, idleUntil: 1e9 });
    stepAncistrus(a, frame({ timestamp: 2000 }), constant(0.25));
    expect(a.x).toBe(300.5);
    expect(a.y).toBe(300.5);
    expect(a.state).toBe("idle");
    expect(a.idleUntil).toBeCloseTo(2000 + 1200 + 0.25 * 2000, 10);
  });

  it("stands still when it is already on its target", () => {
    const a = anc({ state: "moving", x: 300, y: 300, targetX: 300, targetY: 300, idleUntil: 1e9 });
    stepAncistrus(a, frame(), constant(0.5));
    expect(a).toMatchObject({ x: 300, y: 300, state: "idle" });
  });

  it("does not use Math.random when a random source is given", () => {
    const spy = vi.spyOn(Math, "random");
    stepAncistrus(anc(), frame(), constant(0.5));
    expect(spy).not.toHaveBeenCalled();
  });

  it("sinks and fades when dead, resting 35 px above the bottom", () => {
    const a = anc({ y: 300 });
    stepAncistrus(a, frame({ delta: 2, deltaMs: 900 }, { isDead: true }), constant(0.5));
    expect(a.y).toBeCloseTo(302.4, 10);
    expect(a.deathProgress).toBeCloseTo(0.2, 10);
    const low = anc({ y: 529 });
    stepAncistrus(low, frame({ delta: 2 }, { isDead: true }), constant(0.5));
    expect(low.y).toBe(530);
  });

  it("does not schedule anything when dead", () => {
    const a = anc();
    stepAncistrus(a, frame({}, { isDead: true }), constant(0.5));
    expect(a.idleUntil).toBe(0);
  });

  it("moves in all directions over time, not only up and down (a walk of many trips)", () => {
    const a = anc({ x: 500, y: 300 });
    let t = 1000;
    const xs = new Set();
    const random = seededRandom(7);
    for (let i = 0; i < 6000; i++) {
      stepAncistrus(a, frame({ timestamp: t }), random);
      t += 16.66;
      xs.add(Math.round(a.x / 50));
    }
    expect(xs.size).toBeGreaterThan(5);
    expect(a.x).toBeGreaterThanOrEqual(90);
    expect(a.x).toBeLessThanOrEqual(934);
  });
});

// ---------------------------------------------------------------------------
describe("stepCrawler() (shrimp, goby and a lane on the flat rock)", () => {
  const crawler = (over = {}) => ({ x: 800, y: 0, targetX: 800, state: "idle", idleUntil: 0, dir: -1, deathProgress: 0, ...over });

  it.each([
    ["shrimp", SHRIMP_SPEC],
    ["ledge crawler", LEDGE_SPEC],
  ])("the %s has a coherent specification", (_name, spec) => {
    expect(spec.minX).toBeLessThan(spec.maxX);
    expect(spec.speed).toBeGreaterThan(0);
    expect(spec.floorOffset).toBeGreaterThan(0);
    expect(spec.firstIdle[0]).toBeGreaterThan(0);
    expect(spec.nextIdle[0]).toBeGreaterThan(0);
  });

  it("the shrimp walks on the sand left of the pile of rock; the route of the crab goes from the grotto up to the flat rock", () => {
    expect(SHRIMP_SPEC.maxX).toBeLessThan(REEF_PILE.x0);
    expect(CRAB_ROUTE[0].x).toBeLessThan(SHRIMP_SPEC.minX);
    const last = CRAB_ROUTE[CRAB_ROUTE.length - 1];
    expect(last.x).toBeLessThanOrEqual(REEF_PILE.x1);
  });

  it("the crab ends its route on the flat rock, at three quarters of the height of the pile", () => {
    expect(REEF_PILE.ledge / REEF_PILE.height).toBeCloseTo(0.75, 1);
    const [a, b] = CRAB_ROUTE.slice(-2);
    expect([a.h, b.h]).toEqual([REEF_PILE.ledge, REEF_PILE.ledge]);
    expect(a.x).toBeGreaterThanOrEqual(REEF_PILE.ledgeFrom);
    expect(b.x).toBeLessThanOrEqual(REEF_PILE.ledgeTo);
  });

  it("the goby stays where it is: its lane is a single point", () => {
    expect(GOBY_SPEC.minX).toBe(GOBY_SPEC.maxX);
    const goby = { x: 530, y: 0, targetX: 530, state: "idle", idleUntil: 0, dir: 1, deathProgress: 0 };
    for (let t = 1000; t < 30000; t += 500) stepCrawler(goby, frame({ timestamp: t }), GOBY_SPEC, constant(0.5));
    expect(goby.x).toBe(530);
    expect(goby.y).toBe(565 - GOBY_SPEC.floorOffset);
  });

  it.each([
    ["shrimp", SHRIMP_SPEC, 25],
    ["ledge crawler", LEDGE_SPEC, REEF_PILE.ledge + 30],
    ["goby", GOBY_SPEC, 14],
  ])("the %s keeps the height of its place (the sand, or the flat rock of the pile)", (_name, spec, offset) => {
    const c = crawler();
    stepCrawler(c, frame(), spec, constant(0.5));
    expect(c.y).toBe(565 - offset);
  });

  it.each([
    ["shrimp", SHRIMP_SPEC],
    ["ledge crawler", LEDGE_SPEC],
  ])("the %s schedules its first walk from the clock and the random source", (_name, spec) => {
    const c = crawler();
    stepCrawler(c, frame({ timestamp: 1000 }), spec, constant(0.5));
    expect(c.idleUntil).toBeCloseTo(1000 + spec.firstIdle[0] + 0.5 * spec.firstIdle[1], 10);
  });

  it.each([
    ["shrimp", SHRIMP_SPEC],
    ["ledge crawler", LEDGE_SPEC],
  ])("the %s picks a spot inside its lane when it sets off", (_name, spec) => {
    const c = crawler({ idleUntil: 10 });
    stepCrawler(c, frame({ timestamp: 1000 }), spec, constant(0.25));
    expect(c.state).toBe("moving");
    expect(c.targetX).toBeCloseTo(spec.minX + 0.25 * (spec.maxX - spec.minX), 10);
  });

  it.each([
    ["shrimp", SHRIMP_SPEC],
    ["ledge crawler", LEDGE_SPEC],
  ])("the %s faces where it walks and steps speed * delta", (_name, spec) => {
    const right = crawler({ state: "moving", x: 500, targetX: 900, idleUntil: 1e9 });
    stepCrawler(right, frame({ delta: 2, userSpeed: 1.5 }), spec, constant(0.5));
    expect(right.dir).toBe(1);
    expect(right.x).toBeCloseTo(500 + spec.speed * 1.5 * 2, 10);
    const left = crawler({ state: "moving", x: 500, targetX: 100, idleUntil: 1e9 });
    stepCrawler(left, frame({ delta: 2, userSpeed: 1.5 }), spec, constant(0.5));
    expect(left.dir).toBe(-1);
    expect(left.x).toBeCloseTo(500 - spec.speed * 1.5 * 2, 10);
  });

  it.each([
    ["shrimp", SHRIMP_SPEC],
    ["ledge crawler", LEDGE_SPEC],
  ])("the %s stops on arrival and schedules its next pause", (_name, spec) => {
    const c = crawler({ state: "moving", x: 500, targetX: 500.4, idleUntil: 1e9 });
    stepCrawler(c, frame({ timestamp: 3000 }), spec, constant(0.5));
    expect(c.x).toBe(500.4);
    expect(c.state).toBe("idle");
    expect(c.idleUntil).toBeCloseTo(3000 + spec.nextIdle[0] + 0.5 * spec.nextIdle[1], 10);
  });

  it.each([
    ["shrimp", SHRIMP_SPEC],
    ["ledge crawler", LEDGE_SPEC],
  ])("the %s stays where it is and only fades when dead", (_name, spec) => {
    const c = crawler({ x: 333, y: 7 });
    stepCrawler(c, frame({ deltaMs: 900 }, { isDead: true }), spec, constant(0.5));
    expect(c).toMatchObject({ x: 333, y: 7 });
    expect(c.deathProgress).toBeCloseTo(0.2, 10);
  });

  it("comes back to life with no death progress", () => {
    const c = crawler({ deathProgress: 0.6 });
    stepCrawler(c, frame(), LEDGE_SPEC, constant(0.5));
    expect(c.deathProgress).toBe(0);
  });
});

// ---------------------------------------------------------------------------
describe("clock and randomness are injected", () => {
  it("no step function reads the wall clock", () => {
    const spy = vi.spyOn(Date, "now");
    const f = frame();
    stepFood([flake()], f);
    stepFlowBubbles([{ active: false }], f, 1, 36, constant(0.5));
    stepFish(fish(), f, []);
    stepSnail({ type: "bottom", x: 300, y: 500, vx: 1, vy: 0, dir: 1 }, f);
    stepAncistrus({ y: 300, state: "idle", idleUntil: 0 }, f, constant(0.5));
    stepCrawler({ x: 800, state: "idle", idleUntil: 0 }, f, SHRIMP_SPEC, constant(0.5));
    expect(spy).not.toHaveBeenCalled();
  });

  it("the same input always gives the same output", () => {
    const run = () => {
      const bubbles = Array.from({ length: 8 }, () => ({ active: false, x: 0, baseX: 0, y: 0, vy: 0, r: 0, phase: 0 }));
      const rand = scripted(0.1, 0.9, 0.4, 0.7, 0.2, 0.6);
      stepFlowBubbles(bubbles, frame(), 0.7, 36, rand);
      return JSON.stringify(bubbles);
    };
    expect(run()).toBe(run());
  });

  it("defaults to Math.random when no source is passed", () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0.5);
    const a = { x: 400, y: 300, targetX: 400, targetY: 300, state: "idle", idleUntil: 0 };
    stepAncistrus(a, frame());
    expect(spy).toHaveBeenCalled();
    expect(a.idleUntil).toBeCloseTo(1000 + 1000 + 1000, 10);
  });
});
