import { svg } from "lit";
import { skinned, shapeEl, sh, C, E, OUTLINE, creatureStyle, shadingAllowed } from "./skin.js";

/** @typedef {import("./skin.js").CreatureStyle} CreatureStyle */

/**
 * The goby (a yellow watchman goby) at the mouth of its burrow in the sand: a
 * long yellow body with pale bars and blue dots, a tall first dorsal fin that
 * sways, eyes on top of the head. It faces right, its tail toward the hole.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 * @param {number} sway  swing of the tall dorsal fin, in degrees
 * @param {number} breath  -1..1, the gill cover opening and closing
 */
function gobyDrawing(style, shading, sway, breath) {
  const cartoon = style === "cartoon";
  /**
   * @param {string} d
   * @param {string} fill
   * @param {number} [op]
   */
  const k = (d, fill, op) => skinned(style, shading, d, fill, { ...(cartoon ? {} : { stroke: "#a16207", sw: 0.7 }), ...(op === undefined ? {} : { op }) });
  /**
   * @param {string} d
   * @param {number} w
   * @param {string} color
   * @param {number} [op]
   */
  const line = (d, w, color, op) => shapeEl(sh(d, undefined, { stroke: color, sw: w, op, lc: "round" }));
  const body = "M -34,-1 C -26,-6 -12,-11 6,-12 C 16,-12.5 26,-10 31,-5 C 34,-2 33,1 29,3 C 22,5.5 6,6 -10,4.5 C -24,3 -32,2 -34,-1 Z";
  return svg`
    ${k(E(-44, 4, 20, 7), "#d8b45f", 0.95)}
    ${shapeEl(sh(E(-42, 2.4, 11, 3.6), "#5b4423", { stroke: "none" }))}
    ${k("M -34,-1 C -40,-7 -47,-7 -49,-1 C -47,5 -40,6 -34,-1 Z", "#fde68a")}
    ${k("M -28,-5 C -24,-13 -14,-15 -8,-11 L -10,-6 Z", "#fde047", 0.9)}
    <g transform="rotate(${sway.toFixed(2)} 2 -10)">
      ${k("M -6,-10 C -3,-26 8,-30 13,-23 C 12,-17 9,-12 7,-10 Z", "#fde047", 0.95)}
      ${cartoon ? "" : line("M -3,-13 C 0,-24 6,-27 11,-22", 1.1, "#38bdf8", 0.8)}
    </g>
    ${k(body, "#fde047")}
    ${shapeEl(sh(E(4, 3, 26, 3.4), "#fef9c3", { op: 0.8, stroke: "none" }))}
    ${cartoon ? "" : line("M -14,-9 L -15,4 M -2,-11 L -3,5 M 10,-11 L 9,5", 2.4, "#fffbeb", 0.55)}
    ${cartoon ? "" : [[22, -2, 1.1], [17, -6, 1], [26, -6, 0.9]].map(([x, y, r]) => shapeEl(sh(C(x, y, r), "#38bdf8", { stroke: "none" })))}
    ${k("M 15,0 C 22,4 21,11 14,11 C 12,6 12,2 15,0 Z", "#fde68a", 0.9)}
    ${line(`M 17,-8 Q 13,-2 16,4`, 1 + breath * 0.3, "#a16207", 0.35)}
    ${cartoon
      ? svg`
          ${shapeEl(sh(C(25, -11, 6), "#ffffff", { stroke: OUTLINE, sw: 1.3 }))}
          ${shapeEl(sh(C(26, -10.4, 3.5), "#111827", { stroke: "none" }))}
          ${shapeEl(sh(C(27.8, -12.6, 1.4), "#ffffff", { stroke: "none" }))}
          ${shapeEl(sh(E(22, 0, 3.4, 2), "#fb7185", { op: 0.75, stroke: "none" }))}
          ${line("M 32,0 Q 28,3.5 24,2", 1.3, OUTLINE, 1)}
        `
      : svg`
          ${shapeEl(sh(C(25, -10, 3.4), style === "realistic" ? "#fef3c7" : "#fffbeb", { stroke: "#111827", sw: 0.7, op: 1 }))}
          ${shapeEl(sh(C(25.6, -10, 1.8), "#0f172a", { stroke: "none" }))}
          ${shapeEl(sh(C(24.6, -11, 0.6), "#ffffff", { stroke: "none" }))}
          ${line("M 33,0 Q 29,2 26,1", 0.9, "#a16207", 0.8)}
        `}
    ${style === "realistic" ? shapeEl(sh(E(6, -8, 14, 1.6), "#ffffff", { op: 0.32, stroke: "none" })) : ""}
    ${style === "flat" ? line("M -20,-6 Q -8,-9 4,-8", 0.8, "#a16207", 0.3) : ""}
  `;
}

/**
 * The goby, at its burrow in the sand (reef tank).
 * @param {import("../types.js").RenderHost} ctx the card element
 * @param {boolean} isDead
 */
export function renderGoby(ctx, isDead) {
  if (!ctx._goby) return svg``;
  const g = ctx._goby;
  const p = g.deathProgress || 0;
  const bodyOpacity = (1.0 - p).toFixed(2);
  const sway = isDead ? 0 : Math.sin(ctx._ambientTime * 1.4) * 3;
  const breath = isDead ? 0 : Math.sin(ctx._ambientTime * 2.6);
  return svg`
    <g transform="translate(${g.x}, ${g.y}) scale(1.3, ${isDead ? -1.3 : 1.3})" opacity="${bodyOpacity}">
      ${gobyDrawing(creatureStyle(ctx), shadingAllowed(ctx), sway, breath)}
    </g>
  `;
}
