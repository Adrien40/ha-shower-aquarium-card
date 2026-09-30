import { svg } from "lit";
import { skinned, shapeEl, sh, C, OUTLINE } from "./skin.js";

/**
 * Aquatic plants of the freshwater tank.
 * @param {number} bottomY
 * @param {string} lifeStyle CSS applied to living decor as the tank dies
 * @param {import("./skin.js").CreatureStyle} style
 * @param {boolean} shading
 */
export function freshwaterDecor(bottomY, lifeStyle, style, shading) {
  const b = bottomY;
  /**
   * @param {string} d
   * @param {string} fill
   * @param {number} [op]
   */
  const k = (d, fill, op) => skinned(style, shading, d, fill, op === undefined ? {} : { op });
  // Central veins of the leaves and the blades (flat look only).
  const vein = (/** @type {string} */ d, /** @type {number} */ op) => (style === "flat" ? shapeEl(sh(d, undefined, { stroke: "#052e16", sw: 1.5, op, lc: "round" })) : "");
  return svg`
    <g id="freshwater-plants" style="${lifeStyle}">
      ${k(`M 45 ${b} Q 65 ${b - 75}, 115 ${b - 60} Q 155 ${b - 85}, 200 ${b - 50} Q 240 ${b - 70}, 285 ${b} Z`, "#15803d")}
      ${k(`M 75 ${b} Q 95 ${b - 60}, 135 ${b - 55} Q 170 ${b - 75}, 210 ${b - 40} Q 250 ${b - 50}, 270 ${b} Z`, "#22c55e", 0.85)}
      ${k(C(110, b - 55, 11), "#4ade80", 0.7)}
      ${k(C(170, b - 63, 12), "#4ade80", 0.7)}
      <path d="M 120 ${b} Q 140 ${b - 105}, 160 ${b - 155} Q 165 ${b - 205}, 145 ${b - 265}" stroke="${style === "cartoon" ? OUTLINE : "#14532d"}" stroke-width="${style === "cartoon" ? 10 : 8}" fill="none" stroke-linecap="round" />
      ${style === "cartoon" ? svg`<path d="M 120 ${b} Q 140 ${b - 105}, 160 ${b - 155} Q 165 ${b - 205}, 145 ${b - 265}" stroke="#14532d" stroke-width="6" fill="none" stroke-linecap="round" />` : ""}
      ${k(`M 145 ${b - 265} Q 105 ${b - 305}, 85 ${b - 280} C 70 ${b - 250}, 110 ${b - 220}, 145 ${b - 265} Z`, "#166534")}
      ${k(`M 145 ${b - 265} Q 185 ${b - 315}, 215 ${b - 295} C 230 ${b - 270}, 190 ${b - 230}, 145 ${b - 265} Z`, "#15803d")}
      ${vein(`M 145 ${b - 265} Q 110 ${b - 278}, 90 ${b - 276}`, 0.4)}
      ${vein(`M 145 ${b - 265} Q 185 ${b - 285}, 212 ${b - 291}`, 0.4)}
      ${k(`M 880 ${b} Q 920 ${b - 195}, 870 ${b - 355} Q 845 ${b - 195}, 860 ${b} Z`, "#16a34a", 0.9)}
      ${k(`M 920 ${b} Q 960 ${b - 215}, 930 ${b - 375} Q 895 ${b - 205}, 900 ${b} Z`, "#22c55e", 0.8)}
      ${vein(`M 870 ${b} Q 885 ${b - 190}, 870 ${b - 350}`, 0.3)}
      ${vein(`M 910 ${b} Q 940 ${b - 205}, 930 ${b - 370}`, 0.3)}
    </g>
  `;
}
