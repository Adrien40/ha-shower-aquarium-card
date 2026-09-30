// The state the card starts from, before the first frame is played.
import { describe, it, expect } from "vitest";
import { createInitialScene } from "./scene.js";
import { REEF_PILE } from "./reef-layout.js";

describe("createInitialScene", () => {
  it("places the three snails on the floor and on both glass walls", () => {
    const { snails } = createInitialScene();
    expect(snails.map((s) => s.type)).toEqual(["bottom", "glass_left", "glass_right"]);
  });

  it("starts the Ancistrus, the shrimp and the crab idle and alive", () => {
    const { ancistrus, shrimp, crab } = createInitialScene();
    for (const creature of [ancistrus, shrimp, crab]) {
      expect(creature.state).toBe("idle");
      expect(creature.deathProgress).toBe(0);
    }
  });

  it("puts the crab on the flat rock of the pile of live rock, at three quarters of its height", () => {
    const { crab } = createInitialScene();
    expect(crab.x).toBeGreaterThanOrEqual(REEF_PILE.ledgeFrom);
    expect(crab.x).toBeLessThanOrEqual(REEF_PILE.ledgeTo);
    expect(crab.y).toBe(565 - (REEF_PILE.ledge + 30));
    expect(crab.targetX).toBe(crab.x);
  });

  it("starts the goby idle and alive, at its burrow in the sand", () => {
    const { goby } = createInitialScene();
    expect(goby).toMatchObject({ x: 530, y: 551, state: "idle", deathProgress: 0, dir: 1 });
  });

  it("has 5 rising bubbles, 24 boiling bubbles and 36 unused flow bubbles", () => {
    const { bubbles, boilingBubbles, flowBubbles } = createInitialScene();
    expect(bubbles).toHaveLength(5);
    expect(boilingBubbles).toHaveLength(24);
    expect(flowBubbles).toHaveLength(36);
    expect(flowBubbles.every((b) => b.active === false)).toBe(true);
  });

  it("draws the boiling bubbles from the given random source, inside the tank", () => {
    const low = createInitialScene(() => 0).boilingBubbles[0];
    const high = createInitialScene(() => 0.999999).boilingBubbles[0];
    expect(low).toEqual({ x: 10, y: 30, vy: 2.5, vx: -0.75, r: 4 });
    expect(high.x).toBeCloseTo(1014, 0);
    expect(high.y).toBeCloseTo(570, 0);
  });

  it("uses Math.random when no source is given (tests can replace it)", () => {
    const original = Math.random;
    Math.random = () => 0;
    try {
      expect(createInitialScene().boilingBubbles[0].x).toBe(10);
    } finally {
      Math.random = original;
    }
  });

  it("gives every call its own objects", () => {
    const first = createInitialScene();
    const second = createInitialScene();
    first.snails[0].x = 999;
    expect(second.snails[0].x).toBe(340);
  });
});
