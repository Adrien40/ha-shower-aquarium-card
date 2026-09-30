// The creatures and effects that exist before the first frame is played: where
// the snails, the Ancistrus, the shrimp, the crab and the goby start, and the
// bubbles of the tank. The card copies them into its state at construction time.

/** @typedef {import("./types.js").Snail} Snail */
/** @typedef {import("./types.js").Ancistrus} Ancistrus */
/** @typedef {import("./types.js").Crawler} Crawler */
import { REEF_PILE } from "./reef-layout.js";

/** @typedef {import("./types.js").Bubble} Bubble */
/** @typedef {import("./types.js").BoilingBubble} BoilingBubble */
/** @typedef {import("./types.js").FlowBubble} FlowBubble */

/**
 * @param {() => number} [random]  source of numbers in [0, 1), looked up at call time so tests can replace Math.random
 * @returns {{ snails: Snail[], ancistrus: Ancistrus, shrimp: Crawler, crab: Crawler, goby: Crawler, bubbles: Bubble[], boilingBubbles: BoilingBubble[], flowBubbles: FlowBubble[] }}
 */
export function createInitialScene(random = () => Math.random()) {
  return {
    snails: [
      { x: 340, y: 590, vx: 0.08, vy: 0, dir: 1, type: "bottom", color: "#854d0e" },
      { x: 18, y: 340, vx: 0, vy: 0.07, dir: 1, type: "glass_left", color: "#a16207" },
      { x: 1006, y: 220, vx: 0, vy: -0.06, dir: -1, type: "glass_right", color: "#78350f" },
    ],
    ancistrus: {
      x: 70,
      y: 340,
      targetX: 70,
      targetY: 340,
      heading: 0,
      state: "idle",
      idleUntil: 0,
      deathProgress: 0,
    },
    shrimp: {
      x: 840,
      y: 550,
      targetX: 840,
      state: "idle",
      idleUntil: 0,
      dir: -1,
      deathProgress: 0,
    },
    // The crab starts on the flat rock of the pile of live rock (at three
    // quarters of its height); the goby at its burrow in the sand.
    crab: {
      x: (REEF_PILE.ledgeFrom + REEF_PILE.ledgeTo) / 2,
      y: 565 - (REEF_PILE.ledge + 30),
      targetX: (REEF_PILE.ledgeFrom + REEF_PILE.ledgeTo) / 2,
      state: "idle",
      idleUntil: 0,
      dir: 1,
      deathProgress: 0,
    },
    goby: {
      x: 530,
      y: 551,
      targetX: 530,
      state: "idle",
      idleUntil: 0,
      dir: 1,
      deathProgress: 0,
    },
    bubbles: [
      { x: 180, y: 560, vy: 0.9, r: 4.5 },
      { x: 210, y: 580, vy: 1.1, r: 3.5 },
      { x: 512, y: 570, vy: 0.8, r: 5.0 },
      { x: 820, y: 580, vy: 1.0, r: 4.0 },
      { x: 845, y: 550, vy: 1.2, r: 3.0 },
    ],
    boilingBubbles: Array.from({ length: 24 }, () => ({
      x: 10 + random() * 1004,
      y: 30 + random() * 540,
      vy: 2.5 + random() * 3.5,
      vx: (random() - 0.5) * 1.5,
      r: 4 + random() * 8,
    })),
    flowBubbles: Array.from({ length: 36 }, () => ({
      active: false,
      x: 512,
      baseX: 512,
      y: 0,
      vy: 2,
      r: 3,
      phase: 0,
    })),
  };
}
