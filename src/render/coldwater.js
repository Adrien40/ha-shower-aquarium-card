import { svg } from "lit";
import { skinned, shapeEl, sh, E } from "./skin.js";

/** @type {[number, number, number, number, string, number][]} [cx, y above the bottom, rx, ry, fill, opacity] of the pebbles */
const PEBBLES = [
  [140, 25, 70, 26, "#475569", 1],
  [250, 17, 50, 20, "#64748b", 1],
  [860, 20, 75, 28, "#334155", 1],
  [760, 15, 46, 18, "#64748b", 1],
  [300, 10, 26, 10, "#94a3b8", 0.85],
  [600, 8, 22, 9, "#94a3b8", 0.8],
  [660, 14, 34, 14, "#475569", 0.9],
];

/**
 * Pebbles at the bottom of the cold-water tank.
 * @param {number} bottomY
 * @param {import("./skin.js").CreatureStyle} style
 * @param {boolean} shading
 */
export function coldwaterDecor(bottomY, style, shading) {
  return svg`
    <g id="coldwater-decor">
      ${PEBBLES.map(([cx, up, rx, ry, fill, op]) => {
        const cy = bottomY - up;
        return svg`
          ${skinned(style, shading, E(cx, cy, rx, ry), fill, { op })}
          ${shapeEl(sh(E(cx - rx * 0.3, cy - ry * 0.4, rx * 0.35, ry * 0.22), "#ffffff", { op: 0.22 }))}
        `;
      })}
    </g>
  `;
}
