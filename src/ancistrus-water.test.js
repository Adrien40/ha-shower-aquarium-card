// The Ancistrus must never be out of the water. Only the very end of its tail
// may come out of it a little, and it is brought back in when the water level
// goes down or when its heading would take its body out.
import { describe, it, expect } from "vitest";
import { createFrame, stepAncistrus, startleAncistrus, ancistrusYRange, ANCISTRUS_WATER } from "./physics.js";

const NOW = 1_000_000;
const tankOf = (waterSurfaceY, over = {}) => ({ tankTop: 15, tankBottom: 565, waterSurfaceY, waterRatio: (565 - waterSurfaceY) / 550, isDead: false, isBoiling: false, speedMultiplier: 1, ...over });
const frame = (waterSurfaceY = 15, over = {}, tankOver = {}) =>
  createFrame({ timestamp: 1000, deltaMs: 16.66, delta: 1, nowMs: NOW, animTime: 0, userSpeed: 1, themeKey: "freshwater", tank: tankOf(waterSurfaceY, tankOver), ...over });
const constant = (v) => () => v;
const scripted = (...values) => {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
};
const anc = (over = {}) => ({ x: 400, y: 340, targetX: 400, targetY: 340, heading: 0, state: "idle", idleUntil: 0, deathProgress: 0, ...over });

describe("ancistrusYRange()", () => {
  it("is a range of heights, with the lowest at least the margin under the surface for a body standing up", () => {
    const { minY, maxY } = ancistrusYRange(0, { tankBottom: 565, waterSurfaceY: 100 });
    // Head up: the tentacles above the centre by 21 * 1.5, the tail below it.
    expect(minY).toBeCloseTo(100 + ANCISTRUS_WATER.surfaceMargin + 21 * 1.5, 6);
    expect(maxY).toBeLessThan(565);
    expect(minY).toBeLessThan(maxY);
  });

  it("lets the tip of the tail come out of the water, and nothing else", () => {
    // Head down: the long tail points up and it is the tail that limits.
    const { minY } = ancistrusYRange(180, { tankBottom: 565, waterSurfaceY: 100 });
    const tailTop = minY - 1.5 * 89;
    expect(tailTop).toBeCloseTo(100 - ANCISTRUS_WATER.tailOut, 3);
    const bodyTop = minY - 1.5 * 72;
    expect(bodyTop).toBeGreaterThanOrEqual(100 + ANCISTRUS_WATER.surfaceMargin - 1e-6 - 0 * 1);
  });

  it("lying sideways it needs less height than standing up", () => {
    const tank = { tankBottom: 565, waterSurfaceY: 15 };
    const up = ancistrusYRange(0, tank);
    const side = ancistrusYRange(90, tank);
    expect(side.maxY - side.minY).toBeGreaterThan(up.maxY - up.minY);
  });

  it("has no room at all when there is hardly any water", () => {
    const { minY, maxY } = ancistrusYRange(0, { tankBottom: 565, waterSurfaceY: 540 });
    expect(minY).toBeGreaterThan(maxY);
  });
});

describe("stepAncistrus() keeps it in the water", () => {
  it("brings it back down, at a set speed per frame, when the water level has dropped under it", () => {
    const a = anc({ y: 100 });
    stepAncistrus(a, frame(300), constant(0.5));
    expect(a.y).toBeCloseTo(100 + ANCISTRUS_WATER.rescue, 6);
    stepAncistrus(a, frame(300, { delta: 2 }), constant(0.5));
    expect(a.y).toBeCloseTo(100 + 3 * ANCISTRUS_WATER.rescue, 6);
  });

  it("does not move it more than it needs to when it is nearly in the water", () => {
    const { minY } = ancistrusYRange(0, { tankBottom: 565, waterSurfaceY: 200 });
    const a = anc({ y: minY - 1, idleUntil: 1e9 });
    stepAncistrus(a, frame(200), constant(0.5));
    expect(a.y).toBeCloseTo(minY, 6);
  });

  it("brings it up when it is too low for its heading", () => {
    const a = anc({ y: 560, idleUntil: 1e9 });
    stepAncistrus(a, frame(15), constant(0.5));
    expect(a.y).toBeLessThan(560);
  });

  it("with no room at all it stays in the middle of what there is and does not start a trip", () => {
    const a = anc({ y: 400, idleUntil: 500 });
    stepAncistrus(a, frame(540), constant(0.5));
    expect(a.state).toBe("idle");
    expect(a.idleUntil).toBe(1000 + 1500);
  });

  it("whatever it does for a long time, its body stays in the water and its tail at most the margin above it", () => {
    let seed = 11;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (const surface of [15, 200, 380]) {
      const a = anc({ x: 70, y: 340 });
      let worst = 0;
      for (let i = 0; i < 20000; i++) {
        stepAncistrus(a, frame(surface, { timestamp: 1000 + i * 16.66 }), rand);
        const range = ancistrusYRange(a.heading, { tankBottom: 565, waterSurfaceY: surface });
        if (i > 200) worst = Math.max(worst, a.y - range.maxY, range.minY - a.y);
      }
      expect(worst).toBeLessThan(5);
    }
  });
});

describe("startleAncistrus() with walls and the surface around", () => {
  it("runs along the wall when the knock is on the other side of it", () => {
    const tank = { tankTop: 15, tankBottom: 565, waterSurfaceY: 15 };
    const a = anc({ x: 100, y: 340 });
    expect(startleAncistrus(a, 400, 340, NOW, tank, constant(0.5))).toBe(true);
    expect(a.targetX).toBeGreaterThanOrEqual(90);
    expect(Math.hypot(a.targetX - 100, a.targetY - 340)).toBeGreaterThan(100);
    expect(a.state).toBe("moving");
    expect(a.fleeUntil).toBeGreaterThan(NOW);
  });

  it("with no water to swim in, it only shakes where it is", () => {
    const tank = { tankTop: 15, tankBottom: 565, waterSurfaceY: 540 };
    const a = anc({ x: 300, y: 400 });
    expect(startleAncistrus(a, 250, 400, NOW, tank, constant(0.5))).toBe(true);
    expect([a.targetX, a.targetY]).toEqual([300, 400]);
    expect(a.state).toBe("moving");
  });

  it("from a knock right on it, it takes a random way that is open", () => {
    const tank = { tankTop: 15, tankBottom: 565, waterSurfaceY: 15 };
    const a = anc({ x: 400, y: 340 });
    startleAncistrus(a, 400, 340, NOW, tank, scripted(0.25));
    expect(Math.hypot(a.targetX - 400, a.targetY - 340)).toBeGreaterThan(100);
  });
});
