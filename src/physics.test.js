// @vitest-environment happy-dom
//
// _updatePhysics() is the per-frame animation tick: it mutates fish,
// snails, ancistrus, shrimp, crab and bubble state in place based on
// isDead/isBoiling/speedMultiplier (from pure.js's computeTankState,
// already unit tested on its own) and Math.random()-driven idle timing.
// Nothing in components.test.js exercises it -- the rAF loop is stubbed
// there specifically to avoid driving frames. These tests call it
// directly, on an unconnected (not appended to the DOM) card instance, so
// connectedCallback's real requestAnimationFrame loop never engages.
import { describe, it, expect, vi, afterEach } from "vitest";
import "./shower-aquarium-card.js";

function makeCard(config = {}) {
  const Card = customElements.get("shower-aquarium-card");
  const el = new Card();
  el.setConfig({
    entity: "sensor.shower_volume",
    theme: "freshwater",
    fish_count: 3,
    target_budget: 50,
    survival_volume: 10,
    temp_boiling_threshold: 40,
    temp_deadly_threshold: 45,
    ...config,
  });
  el._hass = { states: {} };
  // Bypass computeCachedMetrics/hass entirely: set the cached fields
  // _updatePhysics actually reads directly, so each test controls
  // temperature/volume precisely without needing a fake sensor state.
  el._cachedConsumedVolume = 0;
  el._cachedTemperature = 20;
  el._cachedTargetBudget = Number(config.target_budget ?? 50);
  el._cachedSurvivalVolume = Number(config.survival_volume ?? 10);
  return el;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("_updatePhysics(): fish movement", () => {
  it("moves a fish by vx/vy scaled by dir, speedMultiplier and delta", () => {
    const el = makeCard();
    const fish = { species: 0, x: 500, y: 300, vx: 2, vy: 1, dir: 1, deathProgress: 0 };
    el._fishes = [fish];
    el._updatePhysics(1000);
    el._updatePhysics(1016.66); // one full 16.66ms tick -> delta ~= 1

    // Moved right (dir 1) and down (vy positive), roughly by vx/vy over
    // one tick; exact sub-pixel amount depends on speedMultiplier
    // (fish_speed_multiplier default 1.2), so assert direction/magnitude
    // rather than a brittle exact value.
    expect(fish.x).toBeGreaterThan(500);
    expect(fish.y).toBeGreaterThan(300);
  });

  it("bounces off the right wall: clamps x to maxX and flips dir to -1", () => {
    const el = makeCard();
    const fish = { species: 0, x: 905, y: 300, vx: 20, vy: 0, dir: 1, deathProgress: 0 };
    el._fishes = [fish];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(fish.x).toBe(910); // maxX for a non-clownfish
    expect(fish.dir).toBe(-1);
  });

  it("bounces off the left wall: clamps x to minX and flips dir to 1", () => {
    const el = makeCard();
    const fish = { species: 0, x: 115, y: 300, vx: 20, vy: 0, dir: -1, deathProgress: 0 };
    el._fishes = [fish];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(fish.x).toBe(110);
    expect(fish.dir).toBe(1);
  });

  it("bounces off the tank floor: clamps y to maxY and flips vy negative", () => {
    const el = makeCard();
    const fish = { species: 0, x: 500, y: 520, vx: 0, vy: 20, dir: 1, deathProgress: 0 };
    el._fishes = [fish];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(fish.y).toBeLessThan(521); // clamped to maxY (tankBottom - 45)
    expect(fish.vy).toBeLessThan(0);
  });

  it("a saltwater clownfish (species 0) is bounded much narrower (x: 160-380) than a regular fish (110-910)", () => {
    const el = makeCard({ theme: "saltwater" });
    const clownfish = { species: 0, x: 350, y: 300, vx: 20, vy: 0, dir: 1, deathProgress: 0 };
    el._fishes = [clownfish];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(clownfish.x).toBe(380);
  });

  it("a non-clownfish saltwater species (e.g. species 2) keeps the wide regular bounds", () => {
    const el = makeCard({ theme: "saltwater" });
    const fish = { species: 2, x: 905, y: 300, vx: 20, vy: 0, dir: 1, deathProgress: 0 };
    el._fishes = [fish];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(fish.x).toBe(910);
  });

  it("when isDead (deadly temperature), fish stop swimming, sink, and deathProgress climbs toward 1", () => {
    const el = makeCard();
    el._cachedTemperature = 50; // >= temp_deadly_threshold (45)
    const fish = { species: 0, x: 500, y: 300, vx: 2, vy: 1, dir: 1, deathProgress: 0 };
    el._fishes = [fish];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(fish.deathProgress).toBeGreaterThan(0);
    expect(fish.y).toBeGreaterThan(300); // sinking
    expect(fish.x).toBe(500); // no horizontal movement once dead
  });

  it("deathProgress is clamped at 1.0, never climbs past it however many frames pass", () => {
    const el = makeCard();
    el._cachedTemperature = 50;
    const fish = { species: 0, x: 500, y: 300, vx: 0, vy: 0, dir: 1, deathProgress: 0.999 };
    el._fishes = [fish];
    el._updatePhysics(1000);
    el._updatePhysics(6000); // a huge delta, clamped internally to 2.0x
    expect(fish.deathProgress).toBe(1);
  });

  it("no fishes array (e.g. cleared) doesn't throw", () => {
    const el = makeCard();
    el._fishes = [];
    expect(() => el._updatePhysics(1000)).not.toThrow();
  });
});

describe("_updatePhysics(): snails", () => {
  it("a 'bottom' snail bounces between x 100 and 920, flipping dir", () => {
    const el = makeCard();
    el._snails = [{ type: "bottom", x: 918, y: 590, vx: 10, vy: 0, dir: 1 }];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._snails[0].x).toBe(920);
    expect(el._snails[0].dir).toBe(-1);
  });

  it("a 'bottom' snail also bounces off the left edge (x: 100), flipping dir back to 1", () => {
    const el = makeCard();
    el._snails = [{ type: "bottom", x: 102, y: 590, vx: 10, vy: 0, dir: -1 }];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._snails[0].x).toBe(100);
    expect(el._snails[0].dir).toBe(1);
  });

  it("a 'glass_left' snail bounces off the top/bottom of its vertical track, flipping vy", () => {
    const el = makeCard();
    el._snails = [{ type: "glass_left", x: 18, y: 560, vx: 0, vy: 10, dir: 1 }];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._snails[0].y).toBeLessThanOrEqual(el._getCanvasHeight() - 35 - 25);
    expect(el._snails[0].vy).toBeLessThan(0);
  });

  it("a 'glass_right' snail also bounces off the top of its track, flipping vy positive", () => {
    const el = makeCard();
    el._snails = [{ type: "glass_right", x: 1006, y: 20, vx: 0, vy: -10, dir: -1 }];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._snails[0].vy).toBeGreaterThan(0);
  });

  it("dead snails sink toward the floor instead of following their normal track", () => {
    const el = makeCard();
    el._cachedTemperature = 50;
    el._snails = [{ type: "bottom", x: 500, y: 300, vx: 10, vy: 0, dir: 1 }];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._snails[0].y).toBeGreaterThan(300);
    expect(el._snails[0].x).toBe(500); // no horizontal movement once dead
  });
});

describe("_updatePhysics(): ancistrus (idle/moving state machine)", () => {
  it("starts idle with an idleUntil timestamp assigned on the first tick", () => {
    const el = makeCard();
    el._ancistrus = { x: 70, y: 340, targetY: 340, state: "idle", idleUntil: 0, deathProgress: 0 };
    el._updatePhysics(1000);
    expect(el._ancistrus.idleUntil).toBeGreaterThan(1000);
  });

  it("transitions from idle to moving once the current timestamp passes idleUntil, picking a new targetY", () => {
    const el = makeCard();
    el._ancistrus = { x: 70, y: 340, targetY: 340, state: "idle", idleUntil: 1000, deathProgress: 0 };
    el._updatePhysics(1500); // already past idleUntil
    expect(el._ancistrus.state).toBe("moving");
    expect(el._ancistrus.targetY).toBeGreaterThan(0);
  });

  it("while moving, steps toward targetY and settles back to idle once within 1.5px", () => {
    const el = makeCard();
    el._ancistrus = { x: 70, y: 300, targetY: 301, state: "moving", idleUntil: 99999, deathProgress: 0 };
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._ancistrus.state).toBe("idle");
  });

  it("when dead, stops the state machine, sinks, and accumulates deathProgress", () => {
    const el = makeCard();
    el._cachedTemperature = 50;
    el._ancistrus = { x: 70, y: 300, targetY: 300, state: "idle", idleUntil: 99999, deathProgress: 0 };
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._ancistrus.deathProgress).toBeGreaterThan(0);
    expect(el._ancistrus.y).toBeGreaterThan(300);
  });

  it("a missing _ancistrus (e.g. cleared) doesn't throw", () => {
    const el = makeCard();
    el._ancistrus = null;
    expect(() => el._updatePhysics(1000)).not.toThrow();
  });
});

describe("_updatePhysics(): shrimp and crab (idle/moving state machines)", () => {
  it("shrimp: transitions to moving after idleUntil, picks a targetX in its lane (740-940), and updates dir", () => {
    const el = makeCard();
    el._shrimp = { x: 840, y: 550, targetX: 840, state: "idle", idleUntil: 1000, dir: -1 };
    el._updatePhysics(1500);
    expect(el._shrimp.state).toBe("moving");
    expect(el._shrimp.targetX).toBeGreaterThanOrEqual(740);
    expect(el._shrimp.targetX).toBeLessThanOrEqual(940);
  });

  it("shrimp: while already moving, steps toward targetX each frame", () => {
    const el = makeCard();
    el._shrimp = { x: 800, y: 550, targetX: 900, state: "moving", idleUntil: 99999, dir: 1 };
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._shrimp.x).toBeGreaterThan(800);
    expect(el._shrimp.dir).toBe(1);
  });

  it("shrimp: settles back to idle once within 1.5px of its target", () => {
    const el = makeCard();
    el._shrimp = { x: 899.5, y: 550, targetX: 900, state: "moving", idleUntil: 99999, dir: 1 };
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._shrimp.state).toBe("idle");
  });

  it("shrimp: y is pinned to the tank floor every frame while alive", () => {
    const el = makeCard();
    el._shrimp = { x: 840, y: 1, targetX: 840, state: "idle", idleUntil: 99999, dir: -1 };
    el._updatePhysics(1000);
    expect(el._shrimp.y).toBe(el._getCanvasHeight() - 35 - 25);
  });

  it("shrimp: when dead, only deathProgress advances (no position changes)", () => {
    const el = makeCard();
    el._cachedTemperature = 50;
    el._shrimp = { x: 840, y: 550, targetX: 840, state: "idle", idleUntil: 99999, dir: -1, deathProgress: 0 };
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._shrimp.deathProgress).toBeGreaterThan(0);
    expect(el._shrimp.x).toBe(840);
  });

  it("crab: transitions to moving after idleUntil, picks a targetX in its lane (240-460)", () => {
    const el = makeCard();
    el._crab = { x: 350, y: 555, targetX: 350, state: "idle", idleUntil: 1000, dir: 1 };
    el._updatePhysics(1500);
    expect(el._crab.state).toBe("moving");
    expect(el._crab.targetX).toBeGreaterThanOrEqual(240);
    expect(el._crab.targetX).toBeLessThanOrEqual(460);
  });

  it("crab: while already moving, steps toward targetX each frame", () => {
    const el = makeCard();
    el._crab = { x: 260, y: 555, targetX: 440, state: "moving", idleUntil: 99999, dir: 1 };
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._crab.x).toBeGreaterThan(260);
  });

  it("crab: settles back to idle once within 1.5px of its target", () => {
    const el = makeCard();
    el._crab = { x: 439.5, y: 555, targetX: 440, state: "moving", idleUntil: 99999, dir: 1 };
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._crab.state).toBe("idle");
  });

  it("crab: when dead, only deathProgress advances", () => {
    const el = makeCard();
    el._cachedTemperature = 50;
    el._crab = { x: 350, y: 555, targetX: 350, state: "idle", idleUntil: 99999, dir: 1, deathProgress: 0 };
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._crab.deathProgress).toBeGreaterThan(0);
    expect(el._crab.x).toBe(350);
  });

  it("missing shrimp/crab (e.g. cleared) doesn't throw", () => {
    const el = makeCard();
    el._shrimp = null;
    el._crab = null;
    expect(() => el._updatePhysics(1000)).not.toThrow();
  });
});

describe("_updatePhysics(): bubbles", () => {
  it("rise bubbles drift upward and reset to the tank floor once past the water surface", () => {
    const el = makeCard();
    el._bubbles = [{ x: 200, y: 1, vy: 5, r: 4 }];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._bubbles[0].y).toBeGreaterThan(0); // reset near the floor, not still near 0
  });

  it("rise bubbles are frozen once the tank is dead (isDead)", () => {
    const el = makeCard();
    el._cachedTemperature = 50;
    el._bubbles = [{ x: 200, y: 300, vy: 5, r: 4 }];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._bubbles[0].y).toBe(300);
  });

  it("boiling bubbles only move while isBoiling -- frozen at a normal temperature", () => {
    const el = makeCard();
    el._cachedTemperature = 20; // well under temp_boiling_threshold (40)
    el._boilingBubbles = [{ x: 500, y: 300, vy: 5, vx: 1, r: 4 }];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._boilingBubbles[0].y).toBe(300);
  });

  it("boiling bubbles rise and drift once isBoiling is true", () => {
    const el = makeCard();
    el._cachedTemperature = 41; // >= temp_boiling_threshold (40)
    el._boilingBubbles = [{ x: 500, y: 300, vy: 5, vx: 1, r: 4 }];
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._boilingBubbles[0].y).toBeLessThan(300);
  });

  it("boiling bubbles reset to the tank floor (and a random x) once they rise past the water surface", () => {
    const el = makeCard();
    el._cachedTemperature = 41;
    el._boilingBubbles = [{ x: 500, y: 1, vy: 5, vx: 1, r: 4 }]; // already at the very top
    el._updatePhysics(1000);
    el._updatePhysics(1050);
    expect(el._boilingBubbles[0].y).toBeGreaterThan(100); // reset near the floor
  });
});

describe("_updatePhysics(): requestUpdate() and timing", () => {
  it("calls requestUpdate() when any creature state changed", () => {
    const el = makeCard();
    const spy = vi.spyOn(el, "requestUpdate");
    el._fishes = [{ species: 0, x: 500, y: 300, vx: 1, vy: 0, dir: 1, deathProgress: 0 }];
    el._updatePhysics(1000);
    expect(spy).toHaveBeenCalled();
  });

  it("the first call just anchors _lastTimestamp (no crash, no huge initial jump)", () => {
    const el = makeCard();
    const fish = { species: 0, x: 500, y: 300, vx: 1, vy: 0, dir: 1, deathProgress: 0 };
    el._fishes = [fish];
    el._updatePhysics(50000); // an arbitrary first timestamp, far from 0
    expect(el._lastTimestamp).toBe(50000);
    // No movement on the very first call: deltaMs is 0 against itself.
    expect(fish.x).toBe(500);
  });

  it("a huge frame gap (e.g. tab was backgrounded) is clamped to a 2.0x delta, not a huge jump", () => {
    const el = makeCard();
    const fish = { species: 0, x: 500, y: 300, vx: 10, vy: 0, dir: 1, deathProgress: 0 };
    el._fishes = [fish];
    el._updatePhysics(1000);
    el._updatePhysics(1000 + 60000); // a full minute gap
    // delta is clamped to 2.0, so movement this tick is at most vx * dir *
    // speedMultiplier * 2.0 -- bounded, not a 3600-frame-equivalent leap.
    expect(fish.x).toBeLessThan(500 + 10 * 3 * 2.0 + 1);
  });
});

describe("_startAnimation() / connectedCallback(): the rAF loop actually calls _updatePhysics", () => {
  it("connecting the card to the DOM drives at least one real animation frame through _updatePhysics", () => {
    // Unlike components.test.js's stub (a no-op, specifically to avoid
    // driving frames for its own unrelated tests), this one immediately
    // and synchronously invokes the frame callback once, so the loop
    // closure inside _startAnimation actually calls this._updatePhysics
    // at least once -- otherwise never exercised by any other test here,
    // which all call _updatePhysics directly instead of through the loop.
    const realRAF = window.requestAnimationFrame;
    const realCAF = window.cancelAnimationFrame;
    let callCount = 0;
    window.requestAnimationFrame = (cb) => {
      callCount += 1;
      if (callCount <= 2) cb(callCount * 16.66);
      return callCount;
    };
    window.cancelAnimationFrame = () => {};

    try {
      const el = makeCard();
      const spy = vi.spyOn(el, "_updatePhysics");
      document.body.appendChild(el);
      expect(spy).toHaveBeenCalled();
      document.body.removeChild(el);
    } finally {
      window.requestAnimationFrame = realRAF;
      window.cancelAnimationFrame = realCAF;
    }
  });
});

describe("_updatePhysics(): animation quality", () => {
  const swim = (quality, stepMs) => {
    const el = makeCard({ animation_quality: quality });
    const fish = { species: 0, x: 500, y: 300, vx: 2, vy: 0, dir: 1, deathProgress: 0 };
    el._fishes = [fish];
    el._updatePhysics(1000);
    el._updatePhysics(1000 + stepMs);
    return fish.x - 500;
  };

  it("keeps the swimming speed constant at 20 fps (time step is not clamped)", () => {
    // One 50 ms tick at 20 fps must travel about as far as three 16.66 ms
    // ticks at 60 fps, instead of being cut to two thirds of it.
    const light = swim("light", 50);
    const max60 = swim("max", 16.66) * 3;
    expect(light).toBeGreaterThan(max60 * 0.95);
    expect(light).toBeLessThan(max60 * 1.05);
  });

  it("still clamps huge gaps (suspended tab) in every profile", () => {
    expect(swim("light", 5000)).toBeLessThan(swim("light", 50) * 2);
    expect(swim("max", 5000)).toBeLessThan(swim("max", 16.66) * 3);
  });
});
