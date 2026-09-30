// Property-based tests of the extracted simulation: instead of hand-picked
// states, fast-check generates hundreds of random tanks, creatures and time
// steps, and each property states an invariant that must hold for all of them.
// A failing run prints a seed and a minimal counter-example.
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  createFrame,
  advanceDeath,
  smoothFlowIntensity,
  pruneRipples,
  stepFood,
  stepFlowBubbles,
  stepRisingBubbles,
  stepBoilingBubbles,
  stepFish,
  stepSnail,
  stepAncistrus,
  stepCrawler,
  SHRIMP_SPEC,
  CRAB_SPEC,
} from "./physics.js";
import { RIPPLE_DURATION_MS } from "./pure.js";

const RUNS = { numRuns: 200 };
const EPS = 1e-9;

const num = (min, max) => fc.double({ min, max, noNaN: true, noDefaultInfinity: true });
const THEMES = ["freshwater", "saltwater", "coldwater"];
const TANK_TOP = 15;
const TANK_BOTTOM = 565;

/** Small seeded generator so that a counter-example can be replayed. */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const frameArb = (over = {}) =>
  fc
    .record({
      delta: num(0.05, 3),
      deltaMs: num(1, 100),
      timestamp: num(0, 1e6),
      nowMs: num(1e9, 2e9),
      animTime: num(0, 5000),
      theme: fc.constantFrom(...THEMES),
      ratio: num(0, 1),
      speed: num(0.2, 6),
      userSpeed: num(0.2, 3),
      isBoiling: fc.boolean(),
      isDead: fc.boolean(),
    })
    .map((r) => {
      const dead = over.isDead ?? r.isDead;
      const ratio = over.waterRatio ?? r.ratio;
      return createFrame({
        timestamp: r.timestamp,
        deltaMs: r.deltaMs,
        delta: r.delta,
        nowMs: r.nowMs,
        animTime: r.animTime,
        userSpeed: r.userSpeed,
        themeKey: over.themeKey ?? r.theme,
        tank: {
          tankTop: TANK_TOP,
          tankBottom: TANK_BOTTOM,
          waterRatio: ratio,
          waterSurfaceY: TANK_BOTTOM - ratio * (TANK_BOTTOM - TANK_TOP),
          isDead: dead,
          isBoiling: r.isBoiling,
          speedMultiplier: r.speed,
        },
      });
    });

const framesArb = (over) => fc.array(frameArb(over), { minLength: 1, maxLength: 40 });

const fishArb = fc.record({
  species: fc.integer({ min: 0, max: 3 }),
  x: num(-200, 1300),
  y: num(-200, 900),
  vx: num(0.1, 3),
  vy: num(-1.5, 1.5),
  dir: fc.constantFrom(-1, 1),
  scale: num(1.1, 2),
  scare: num(0, 1),
  deathProgress: fc.constant(0),
  kickX: num(-12, 12),
  kickY: num(-8, 8),
});

const flakeArb = fc.record({
  x: num(0, 1024),
  y: num(0, 535),
  vy: num(0.2, 1.2),
  phase: num(0, 7),
  r: num(3, 6),
  landedAt: fc.constantFrom(0, 0, 1_500_000_000),
  eaten: fc.boolean(),
});

const finite = (...values) => values.every((v) => Number.isFinite(v));

// ---------------------------------------------------------------------------
describe("fish never leave their tank, whatever the state", () => {
  it("stay between the walls and between the ceiling and the floor after every step", () => {
    fc.assert(
      fc.property(fishArb, framesArb({ isDead: false }), fc.array(flakeArb, { maxLength: 12 }), (fish, frames, food) => {
        for (const f of frames) {
          stepFish(fish, f, food);
          const clown = f.themeKey === "saltwater" && fish.species === 0;
          const minX = clown ? 160 : 110;
          const maxX = clown ? 380 : 910;
          const minY = Math.max(f.tankTop + 45, f.waterSurfaceY + 35, clown ? f.tankBottom - 160 : -Infinity);
          const maxY = f.tankBottom - 45;
          if (!finite(fish.x, fish.y, fish.vy)) return false;
          if (fish.x < minX - EPS || fish.x > maxX + EPS) return false;
          if (fish.y < Math.min(minY, maxY) - EPS || fish.y > Math.max(minY, maxY) + EPS) return false;
          if (fish.deathProgress !== 0) return false;
        }
        return true;
      }),
      RUNS
    );
  });

  it("only ever face left or right", () => {
    fc.assert(
      fc.property(fishArb, framesArb({ isDead: false }), (fish, frames) => {
        frames.forEach((f) => stepFish(fish, f, []));
        return fish.dir === 1 || fish.dir === -1;
      }),
      RUNS
    );
  });

  it("a fish that was knocked always calms down: the impulse and the fear both end at exactly 0", () => {
    fc.assert(
      fc.property(fishArb, num(1, 12), num(-8, 8), (base, kickX, kickY) => {
        const fish = { ...base, kickX, kickY, scare: 1 };
        const f = createFrame({
          timestamp: 0, deltaMs: 16.66, delta: 1, nowMs: 0, animTime: 0, userSpeed: 1, themeKey: "freshwater",
          tank: { tankTop: TANK_TOP, tankBottom: TANK_BOTTOM, waterRatio: 1, waterSurfaceY: TANK_TOP, isDead: false, isBoiling: false, speedMultiplier: 1 },
        });
        for (let i = 0; i < 400; i++) stepFish(fish, f, []);
        return fish.kickX === 0 && fish.kickY === 0 && fish.scare === 0;
      }),
      RUNS
    );
  });

  it("a dead fish only sinks: death progress grows to 1, it never rises, never goes past the bottom, never swims sideways", () => {
    fc.assert(
      fc.property(fishArb, framesArb({ isDead: true }), (fish, frames) => {
        fish.y = Math.min(fish.y, TANK_BOTTOM - 30);
        let previousProgress = 0;
        let previousY = fish.y;
        const x = fish.x;
        for (const f of frames) {
          stepFish(fish, f, []);
          if (fish.deathProgress < previousProgress - EPS || fish.deathProgress > 1) return false;
          if (fish.y < previousY - EPS || fish.y > TANK_BOTTOM - 30 + EPS) return false;
          if (fish.x !== x) return false;
          previousProgress = fish.deathProgress;
          previousY = fish.y;
        }
        return true;
      }),
      RUNS
    );
  });
});

// ---------------------------------------------------------------------------
describe("fish food", () => {
  it("never rises above the water, never sinks below the sand, never multiplies", () => {
    fc.assert(
      fc.property(fc.array(flakeArb.map((f) => ({ ...f, landedAt: 0, eaten: false })), { maxLength: 30 }), framesArb({ isDead: false, waterRatio: 0.6 }), (food, frames) => {
        let current = food;
        for (const f of frames) {
          const before = current.length;
          const { food: next } = stepFood(current, f);
          if (next.length > before) return false;
          for (const flake of next) {
            if (!finite(flake.x, flake.y)) return false;
            if (flake.y < f.waterSurfaceY - EPS || flake.y > f.tankBottom - 30 + EPS) return false;
            if (flake.eaten) return false;
          }
          current = next;
        }
        return true;
      }),
      RUNS
    );
  });

  it("a flake that has landed keeps its position until it disappears", () => {
    fc.assert(
      fc.property(num(0, 1000), framesArb({ isDead: false, waterRatio: 1 }), (x, frames) => {
        const flake = { x, y: 535, vy: 1, phase: 0, r: 4, landedAt: 1, eaten: false };
        for (const f of frames) {
          stepFood([flake], f);
          if (flake.x !== x || flake.y !== 535) return false;
        }
        return true;
      }),
      RUNS
    );
  });

  it("disappears entirely in a dead or empty tank", () => {
    fc.assert(
      fc.property(fc.array(flakeArb, { maxLength: 10 }), frameArb({ isDead: true }), (food, f) => stepFood(food, f).food.length === 0),
      RUNS
    );
    fc.assert(
      fc.property(fc.array(flakeArb, { maxLength: 10 }), frameArb({ isDead: false, waterRatio: 0 }), (food, f) => stepFood(food, f).food.length === 0),
      RUNS
    );
  });
});

// ---------------------------------------------------------------------------
describe("creatures on the ground and on the glass", () => {
  it("a bottom snail never leaves its track", () => {
    fc.assert(
      fc.property(num(100, 920), num(0.02, 0.2), fc.constantFrom(-1, 1), framesArb({ isDead: false }), (x, vx, dir, frames) => {
        const snail = { type: "bottom", x, y: 550, vx, vy: 0, dir };
        for (const f of frames) {
          stepSnail(snail, f);
          if (snail.x < 100 - EPS || snail.x > 920 + EPS || !finite(snail.x)) return false;
          if (snail.y !== f.tankBottom - 10) return false; // always on the sand, whatever the tank height
        }
        return true;
      }),
      RUNS
    );
  });

  it("a glass snail stays within its vertical track, or above the water heading down to it", () => {
    fc.assert(
      fc.property(fc.constantFrom("glass_left", "glass_right"), num(40, 540), num(0.02, 0.2), fc.constantFrom(-1, 1), framesArb({ isDead: false }), (type, y, speed, sign, frames) => {
        const snail = { type, x: 18, y, vx: 0, vy: speed * sign, dir: 1 };
        for (const f of frames) {
          const before = snail.y;
          stepSnail(snail, f);
          const minY = Math.max(f.tankTop + 35, f.waterSurfaceY + 25);
          const maxY = f.tankBottom - 25;
          if (!finite(snail.y)) return false;
          if (before < minY) {
            // Above the water: it only goes down, never past the water it is heading for.
            if (snail.y < before - EPS || snail.y > Math.max(before, minY) + EPS) return false;
          } else if (snail.y < Math.min(minY, maxY) - EPS || snail.y > Math.max(minY, maxY) + EPS) {
            return false;
          }
        }
        return true;
      }),
      RUNS
    );
  });

  it.each([
    ["shrimp", SHRIMP_SPEC],
    ["crab", CRAB_SPEC],
  ])("the %s never leaves its lane and always walks on the sand", (_name, spec) => {
    fc.assert(
      fc.property(fc.integer(), num(spec.minX, spec.maxX), framesArb({ isDead: false }), (seed, x, frames) => {
        const rand = seeded(seed);
        const c = { x, y: 0, targetX: x, state: "idle", idleUntil: 0, dir: 1, deathProgress: 0 };
        for (const f of frames) {
          stepCrawler(c, f, spec, rand);
          if (!finite(c.x, c.y)) return false;
          if (c.x < spec.minX - EPS || c.x > spec.maxX + EPS) return false;
          if (c.y !== f.tankBottom - spec.floorOffset) return false;
          if (c.dir !== 1 && c.dir !== -1) return false;
        }
        return true;
      }),
      RUNS
    );
  });

  it.each([
    ["shrimp", SHRIMP_SPEC],
    ["crab", CRAB_SPEC],
  ])("a walking %s gets closer to its target and never overshoots it", (_name, spec) => {
    fc.assert(
      fc.property(num(spec.minX, spec.maxX), num(spec.minX, spec.maxX), framesArb({ isDead: false }), (x, target, frames) => {
        const c = { x, y: 0, targetX: target, state: "moving", idleUntil: 1e12, dir: 1, deathProgress: 0 };
        for (const f of frames) {
          const before = Math.abs(c.targetX - c.x);
          const wasMoving = c.state === "moving";
          stepCrawler(c, f, spec, () => 0.5);
          if (wasMoving && Math.abs(c.targetX - c.x) > before + EPS) return false;
        }
        return true;
      }),
      RUNS
    );
  });

  it("the ancistrus keeps a finite height and glides toward its target without overshooting", () => {
    fc.assert(
      fc.property(fc.integer(), num(100, 450), framesArb({ isDead: false }), (seed, y, frames) => {
        const rand = seeded(seed);
        const a = { x: 70, y, targetY: y, state: "idle", idleUntil: 0, deathProgress: 0 };
        for (const f of frames) {
          const before = Math.abs(a.targetY - a.y);
          const wasMoving = a.state === "moving";
          stepAncistrus(a, f, rand);
          if (!finite(a.y, a.targetY)) return false;
          if (wasMoving && Math.abs(a.targetY - a.y) > before + EPS) return false;
        }
        return true;
      }),
      RUNS
    );
  });

  it("dead crawlers and the dead ancistrus only fade: progress grows to 1, never decreases", () => {
    fc.assert(
      fc.property(framesArb({ isDead: true }), (frames) => {
        const shrimp = { x: 800, y: 540, state: "idle", idleUntil: 0, deathProgress: 0 };
        const anc = { x: 70, y: 300, state: "idle", idleUntil: 0, deathProgress: 0 };
        let previous = 0;
        for (const f of frames) {
          stepCrawler(shrimp, f, SHRIMP_SPEC, () => 0.5);
          stepAncistrus(anc, f, () => 0.5);
          if (shrimp.deathProgress < previous - EPS || shrimp.deathProgress > 1) return false;
          if (anc.deathProgress > 1 || anc.y > f.tankBottom - 35 + EPS) return false;
          previous = shrimp.deathProgress;
        }
        return true;
      }),
      RUNS
    );
  });
});

// ---------------------------------------------------------------------------
describe("bubbles", () => {
  const pool = (n) => Array.from({ length: n }, () => ({ active: false, x: 512, baseX: 512, y: 0, vy: 2, r: 3, phase: 0 }));

  it("the flow stream never activates more bubbles than it has, and keeps every value finite", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 40 }), num(0, 1), fc.integer(), framesArb({ isDead: false, waterRatio: 0.7 }), (n, intensity, seed, frames) => {
        const rand = seeded(seed);
        const bubbles = pool(n);
        for (const f of frames) {
          stepFlowBubbles(bubbles, f, intensity, 36, rand);
          if (bubbles.filter((b) => b.active).length > n) return false;
          if (!bubbles.every((b) => finite(b.x, b.y, b.vy, b.r))) return false;
        }
        return true;
      }),
      RUNS
    );
  });

  it("the flow stream is silent without flow, in a dead tank and in an empty tank", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 40 }), fc.integer(), frameArb({ isDead: false, waterRatio: 0.7 }), (n, seed, f) => {
        const bubbles = pool(n);
        stepFlowBubbles(bubbles, f, 0, 36, seeded(seed));
        return bubbles.every((b) => !b.active);
      }),
      RUNS
    );
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 40 }), fc.integer(), frameArb({ isDead: true }), (n, seed, f) => {
        const bubbles = pool(n);
        stepFlowBubbles(bubbles, f, 1, 36, seeded(seed));
        return bubbles.every((b) => !b.active);
      }),
      RUNS
    );
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 40 }), fc.integer(), frameArb({ isDead: false, waterRatio: 0 }), (n, seed, f) => {
        const bubbles = pool(n);
        stepFlowBubbles(bubbles, f, 1, 36, seeded(seed));
        return bubbles.every((b) => !b.active);
      }),
      RUNS
    );
  });

  it("rising and boiling bubbles stay in the tank forever", () => {
    fc.assert(
      fc.property(fc.integer(), framesArb({ isDead: false, waterRatio: 0.8 }), (seed, frames) => {
        const rand = seeded(seed);
        const rising = [{ x: 180, y: 560, vy: 0.9, r: 4 }, { x: 512, y: 570, vy: 1.1, r: 4 }];
        const boiling = [{ x: 300, y: 300, vy: 3, vx: 0.7, r: 6 }];
        for (const f of frames) {
          stepRisingBubbles(rising, f);
          stepBoilingBubbles(boiling, f, rand);
          for (const b of [...rising, ...boiling]) {
            if (!finite(b.x, b.y)) return false;
            if (b.y > f.tankBottom + 20 || b.y < f.waterSurfaceY - 40) return false;
          }
        }
        return true;
      }),
      RUNS
    );
  });
});

// ---------------------------------------------------------------------------
describe("clocks and smoothing", () => {
  it("the flow intensity moves toward its goal without ever overshooting", () => {
    fc.assert(
      fc.property(num(0, 1), num(0, 1), num(0.01, 5), (current, goal, delta) => {
        const next = smoothFlowIntensity(current, goal, delta);
        return next >= -EPS && next <= 1 + EPS && Math.abs(next - goal) <= Math.abs(current - goal) + EPS;
      }),
      RUNS
    );
  });

  it("the flow intensity eventually settles at exactly the goal it is heading to (0)", () => {
    fc.assert(
      fc.property(num(0, 1), num(0.1, 3), (start, delta) => {
        let value = start;
        for (let i = 0; i < 2000; i++) value = smoothFlowIntensity(value, 0, delta);
        return value === 0;
      }),
      RUNS
    );
  });

  it("the death progress stays within 0..1, never decreases while dead and resets when alive", () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.boolean(), num(0.0001, 0.5)), { minLength: 1, maxLength: 60 }), (steps) => {
        let progress = 0;
        for (const [dead, step] of steps) {
          const next = advanceDeath(progress, dead, step);
          if (next < 0 || next > 1) return false;
          if (dead && next < progress - EPS) return false;
          if (!dead && next !== 0) return false;
          progress = next;
        }
        return true;
      }),
      RUNS
    );
  });

  it("pruneRipples keeps exactly the young ripples, in order", () => {
    fc.assert(
      fc.property(fc.array(num(0, 5000), { maxLength: 20 }), num(0, 5000), (ages, extra) => {
        const now = 1_000_000;
        const ripples = ages.map((age, i) => ({ id: i, born: now - age - extra }));
        const kept = pruneRipples(ripples, now);
        const expected = ripples.filter((r) => now - r.born < RIPPLE_DURATION_MS);
        return kept.length === expected.length && kept.every((r, i) => r === expected[i]);
      }),
      RUNS
    );
  });

  it("createFrame always yields a positive death step", () => {
    fc.assert(fc.property(frameArb(), (f) => f.deathStep > 0 && Number.isFinite(f.deathStep)), RUNS);
  });
});

// A last check that the property tests can actually fail: a deliberately
// wrong invariant must be rejected, otherwise the assertions above would be
// vacuous.
describe("the property tests are able to fail", () => {
  it("rejects a false invariant with a counter-example", () => {
    expect(() =>
      fc.assert(
        fc.property(fishArb, framesArb({ isDead: false }), (fish, frames) => {
          frames.forEach((f) => stepFish(fish, f, []));
          return fish.x > 500; // false for many fish
        }),
        { numRuns: 100 }
      )
    ).toThrow(/Property failed/);
  });
});
