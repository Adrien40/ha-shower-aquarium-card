import { svg } from "lit";
import { shapeEl, sh, C, E, OUTLINE } from "./skin.js";

/** @typedef {import("./skin.js").CreatureStyle} CreatureStyle */

// Three kinds of snail, one after the other: a turret (a pointed cone shell,
// on the sand), a ramshorn (a flat coiled disc) and a round-shelled pond snail.
/** @typedef {"turret" | "ramshorn" | "round"} SnailKind */
/** @type {SnailKind[]} */
export const SNAIL_KINDS = ["turret", "ramshorn", "round"];

/** Colour of the foot and the head of each kind. */
const FOOT = { turret: "#a8a29e", ramshorn: "#dc2626", round: "#d97706" };

const TURRET_SHELL = "M -9,-0.5 C -9,-4 -6,-8 -3,-12 C 0,-8 2,-4 1.5,-0.5 Z";
const RAMSHORN_SPIRAL = "M -2.5,-4.5 a 1,1 0 0 1 2,0 a 2,2 0 0 1 -4,0 a 3,3 0 0 1 6,0 a 4,4 0 0 1 -8,0";

/**
 * The shell of one snail, in the chosen look.
 * @param {SnailKind} kind
 * @param {string} color
 * @param {CreatureStyle} style
 * @param {boolean} shading
 */
function shell(kind, color, style, shading) {
  const outline = style === "cartoon" ? { stroke: OUTLINE, sw: 0.5 } : {};
  const shade = (/** @type {string} */ d) => (style === "realistic" && shading ? svg`<path d="${d}" fill="url(#shade)" />` : "");
  const spiral = (/** @type {string} */ d, /** @type {string} */ stroke, /** @type {number} */ op) => (style === "cartoon" ? "" : shapeEl(sh(d, undefined, { stroke, sw: 0.5, op, lc: "round" })));
  const lines = style === "realistic" ? "#000000" : "#ffffff";
  const lineOpacity = style === "realistic" ? 0.28 : 0.5;
  if (kind === "turret") {
    return svg`
      ${shapeEl(sh(TURRET_SHELL, color, outline))}
      ${shade(TURRET_SHELL)}
      ${spiral("M -8.4,-3 Q -3.5,-1.2 1.2,-3 M -7.4,-6 Q -3.3,-4.4 0.2,-6 M -6,-9 Q -3.2,-7.8 -0.8,-9", lines, lineOpacity)}
    `;
  }
  if (kind === "ramshorn") {
    return svg`
      ${shapeEl(sh(C(-2.5, -4.5, 5), color, outline))}
      ${shade(C(-2.5, -4.5, 5))}
      ${spiral(RAMSHORN_SPIRAL, lines, lineOpacity + 0.15)}
    `;
  }
  return svg`
    ${shapeEl(sh(C(-3, -4, 5.5), color, outline))}
    ${shade(C(-3, -4, 5.5))}
    <path d="M -3,-4 A 3 3 0 0 1 -1,-2" stroke="#ffffff" stroke-width="0.8" fill="none" />
    ${style === "flat" ? spiral("M -6.5,-4 A 3.5,3.5 0 1 1 -3,-0.5 M -5,-4 A 2,2 0 1 1 -3,-2", "#ffffff", 0.5) : ""}
    ${style === "realistic" ? spiral("M -7,-4 A 4,4 0 1 1 -3,0 M -5.4,-4 A 2.4,2.4 0 1 1 -3,-1.6", "#000000", 0.28) : ""}
  `;
}

/**
 * The shell and the head of one snail, in the chosen look.
 * @param {import("../types.js").Snail} snail
 * @param {boolean} isDead
 * @param {CreatureStyle} style
 * @param {boolean} shading
 * @param {SnailKind} kind
 */
function snailBody(snail, isDead, style, shading, kind) {
  const outline = style === "cartoon" ? { stroke: OUTLINE, sw: 0.5 } : {};
  const foot = FOOT[kind];
  return svg`
    ${shell(kind, snail.color || "#854d0e", style, shading)}
    ${isDead
      ? ""
      : svg`
          ${shapeEl(sh(E(2, -1.5, 5, 2.2), foot, outline))}
          ${style === "realistic" && shading ? svg`<path d="${E(2, -1.5, 5, 2.2)}" fill="url(#shade)" />` : ""}
          <line x1="5" y1="-2.5" x2="7.5" y2="-5.5" stroke="${foot}" stroke-width="0.8" />
          ${style === "cartoon"
            ? svg`${shapeEl(sh(C(7.5, -5.7, 1.5), "#ffffff", { stroke: OUTLINE, sw: 0.5 }))}${shapeEl(sh(C(7.8, -5.6, 0.8), "#111827", { stroke: "none" }))}`
            : svg`<circle cx="7.5" cy="-5.5" r="0.6" fill="#111827" />`}
        `}
  `;
}

/**
 * The snails: one on the sand and two on the glass, each of another kind.
 * @param {import("../types.js").Snail[]} snails
 * @param {string} themeKey
 * @param {boolean} isDead
 * @param {CreatureStyle} style
 * @param {boolean} shading
 */
export function renderSnails(snails, themeKey, isDead, style, shading) {
  return svg`
    <g>
      ${snails.map((snail, sIdx) => {
        const rotation =
          snail.type === "glass_left"
            ? 90
            : snail.type === "glass_right"
            ? -90
            : 0;
        const baseScale = themeKey === "saltwater" ? (sIdx % 2 === 0 ? 3.5 : 4.2) : 1.8;
        return svg`
          <g transform="translate(${snail.x}, ${snail.y}) rotate(${isDead ? 0 : rotation}) scale(${snail.dir * baseScale},${baseScale})">
            ${snailBody(snail, isDead, style, shading, SNAIL_KINDS[sIdx % SNAIL_KINDS.length])}
          </g>
        `;
      })}
    </g>
  `;
}
