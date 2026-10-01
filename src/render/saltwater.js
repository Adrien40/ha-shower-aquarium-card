import { svg } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { skinned, shapeEl, sh, C, E, OUTLINE, creatureStyle, shadingAllowed, wilt } from "./skin.js";
import { REEF_PILE } from "../reef-layout.js";

/**
 * @param {import("../types.js").RenderHost} ctx the card element (reads its ambient clock)
 * @param {number} [deathProgress]
 */
export function renderAnemoneTentacles(ctx, deathProgress = 0) {
  // Fat round-tipped tentacles (cartoon), thin ones with a white glow at the tip (realistic).
  const look = creatureStyle(ctx);
  const widthFactor = look === "cartoon" ? 1.4 : look === "realistic" ? 0.65 : 1;
  const tipFactor = look === "cartoon" ? 1.5 : look === "realistic" ? 0.7 : 1;
  const layers = [
    { count: 11, baseR: 20, lenMin: 60, lenMax: 95, spread: 160, width: 5, color: "#a21caf", tip: "#f0abfc", speed: 0.55 },
    { count: 16, baseR: 22, lenMin: 50, lenMax: 88, spread: 190, width: 6.5, color: "#c026d3", tip: "#f5d0fe", speed: 0.68 },
  ];
  /** @type {import("lit").SVGTemplateResult[]} */
  const parts = [];
  layers.forEach((layer, li) => {
    for (let i = 0; i < layer.count; i++) {
      const t = i / (layer.count - 1);
      const baseAngle = -90 - layer.spread / 2 + t * layer.spread;
      const length =
        (layer.lenMin + (layer.lenMax - layer.lenMin) * (0.5 + 0.5 * Math.sin(t * Math.PI))) *
        (1 - 0.3 * deathProgress);
      const phase = li * 10 + i * 0.7;
      const sway = Math.sin(ctx._ambientTime * layer.speed + phase) * 9 * (1 - deathProgress);
      const rad = (baseAngle * Math.PI) / 180;
      const bx = Math.cos(rad) * layer.baseR;
      const by = Math.sin(rad) * layer.baseR;
      const wobble = ((i * 37) % 17) - 8;
      // Dead, the tentacles go limp: they hang outward and down (the ones on the left to the left, the others to the right).
      const side = baseAngle < -90 ? -1 : 1;
      const limp = side * (118 + (i % 4) * 7);
      const standing = baseAngle + 90 + sway;
      const rotateDeg = standing + (limp - standing) * deathProgress;
      parts.push(svg`
        <g transform="translate(${bx.toFixed(1)}, ${by.toFixed(1)}) rotate(${rotateDeg.toFixed(1)})">
          <path d="M 0,0 Q ${wobble.toFixed(1)},${(-length * 0.55).toFixed(1)} 0,${(-length).toFixed(1)}" stroke="${layer.color}" stroke-width="${(layer.width * widthFactor).toFixed(1)}" stroke-linecap="round" fill="none" opacity="0.9" />
          <circle cx="0" cy="${(-length).toFixed(1)}" r="${(layer.width * 0.9 * tipFactor).toFixed(1)}" fill="${look === "realistic" ? "#ffffff" : layer.tip}" />
        </g>
      `);
    }
  });
  return parts;
}

/**
 * An angular chunk of rock: a polygon of eight corners round an ellipse, their
 * distance and their angle varied with the seed so no two chunks look alike
 * (always the same for the same seed). `top` is the lit upper face.
 * @param {number} cx @param {number} cy @param {number} rx @param {number} ry @param {number} seed
 * @returns {{ body: string, top: string }}
 */
export function chunkPath(cx, cy, rx, ry, seed) {
  const n = 8;
  const corners = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + 0.18 * Math.sin(seed * 1.3 + i * 2.1);
    const r = 1 + 0.2 * Math.sin(seed * 2.3 + i * 2.7) + 0.1 * Math.sin(seed * 1.1 + i * 5.1);
    return { a, x: cx + Math.cos(a) * rx * r, y: cy + Math.sin(a) * ry * r };
  });
  const polygon = (/** @type {{ x: number, y: number }[]} */ points) => `M${points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L")} Z`;
  // The corners of the upper half, in order round the chunk, make the lit face.
  const upper = corners.filter((c) => Math.sin(c.a) < 0.15);
  return { body: polygon(corners), top: polygon(upper) };
}

/**
 * The flat rock of the pile of live rock, whose top is exactly at the height
 * the crab walks at: a slab with a level top and cut corners.
 * @param {number} b  the bottom of the tank
 */
export function ledgePath(b) {
  const top = b - REEF_PILE.ledge;
  const [l, r] = [REEF_PILE.ledgeFrom - 30, REEF_PILE.ledgeTo + 52];
  return `M${l + 10},${top} L${r - 10},${top} L${r},${top + 12} L${r - 6},${top + 30} L${l + 8},${top + 30} L${l},${top + 12} Z`;
}

/** @type {[number, number, number, number, number, string][]} [cx, height above the bottom, rx, ry, seed, colour] of the chunks of the pile, from the bottom to the top. */
const PILE = [
  [802, 16, 36, 18, 1, "#7d5c8f"],
  [862, 30, 58, 32, 2, "#8b6a9c"],
  [950, 34, 66, 36, 3, "#6d5280"],
  [1000, 46, 34, 48, 4, "#7d5c8f"],
  [832, 80, 46, 32, 5, "#6d5280"],
  [906, 94, 54, 34, 6, "#8b6a9c"],
  [978, 106, 40, 40, 7, "#7d5c8f"],
  [920, 146, 64, 30, 8, "#6d5280"],
];
/** @type {[number, number, number, number, number, string][]} The chunks above the flat rock. */
const PILE_TOP = [
  [958, 216, 34, 30, 9, "#8b6a9c"],
  [998, 198, 24, 36, 10, "#7d5c8f"],
  [930, 228, 26, 26, 11, "#6d5280"],
];
/** @typedef {[number, number, number, number, number, string]} Chunk  [cx, height above the bottom, rx, ry, seed, colour] */

/** @type {Chunk[]} More live rock, lying on the sand between the other things of the reef. */
const SCATTERED_ROCKS = [
  [572, 8, 22, 9, 43, "#6d5280"],
  [716, 11, 32, 13, 44, "#8b6a9c"],
  [740, 24, 18, 12, 45, "#7d5c8f"],
  [610, 6, 12, 6, 46, "#6d5280"],
  [506, 6, 10, 5, 47, "#8b6a9c"],
];

/**
 * One chunk of rock in the chosen look: the dark body, and (except in the
 * cartoon look) its lit upper face and a few pits.
 * @param {import("./skin.js").CreatureStyle} style
 * @param {boolean} shading
 * @param {number} b  the bottom of the tank
 * @param {Chunk} piece
 */
function rock(style, shading, b, [x, up, rx, ry, seed, fill]) {
  const y = b - up;
  const { body, top } = chunkPath(x, y, rx, ry, seed);
  return svg`
    ${skinned(style, shading, body, fill)}
    ${style === "cartoon" ? "" : shapeEl(sh(top, "#ffffff", { op: 0.15, stroke: "none" }))}
    ${style === "flat" ? [[-0.3, 0.1], [0.25, 0.3], [-0.05, 0.45]].map(([px, py]) => shapeEl(sh(C(x + px * rx, y + py * ry, Math.max(1.4, rx * 0.06)), "#3b2a4a", { op: 0.35, stroke: "none" }))) : ""}
  `;
}

/**
 * Reef decor: coral, live rock, anemone.
 * @param {import("../types.js").RenderHost} ctx the card element
 * @param {number} bottomY
 * @param {string} lifeStyle CSS applied to living decor as the tank dies
 * @param {number} deathProgress
 */
export function saltwaterDecor(ctx, bottomY, lifeStyle, deathProgress) {
  const b = bottomY;
  const style = creatureStyle(ctx);
  const shading = shadingAllowed(ctx);
  /**
   * @param {string} d
   * @param {string} fill
   * @param {number} [op]
   */
  const k = (d, fill, op) => skinned(style, shading, d, fill, op === undefined ? {} : { op });
  // Polyps on the corals and pits in the rocks (flat look only).
  const dots = (/** @type {number[][]} */ points, /** @type {string} */ fill, /** @type {number} */ r, /** @type {number} */ op) =>
    style === "flat" ? points.map(([x, y]) => shapeEl(sh(C(x, y, r), fill, { op }))) : "";
  return svg`
    <g id="reef-decor">
      <g style="${lifeStyle}">
      <g transform="${ifDefined(wilt(88, b, -16, 0.6, deathProgress))}">
      ${k(`M 60 ${b} Q 40 ${b - 165}, 95 ${b - 225} Q 120 ${b - 275}, 85 ${b - 335} Q 135 ${b - 265}, 120 ${b - 195} Q 150 ${b - 135}, 115 ${b} Z`, "#f43f5e", 0.95)}
      ${dots([[88, b - 40], [80, b - 110], [98, b - 190], [105, b - 240], [92, b - 300]], "#ffe4e6", 3, 0.55)}
      </g>
      <g transform="${ifDefined(wilt(160, b, 14, 0.55, deathProgress))}">
      ${k(`M 115 ${b} Q 150 ${b - 155}, 190 ${b - 205} Q 215 ${b - 245}, 190 ${b - 295} Q 230 ${b - 235}, 205 ${b - 155} Q 180 ${b - 105}, 155 ${b} Z`, "#fb7185", 0.9)}
      ${dots([[135, b - 40], [160, b - 120], [185, b - 190], [196, b - 250]], "#ffe4e6", 3, 0.55)}
      </g>
      <g transform="translate(690, ${b})">
        <g transform="${ifDefined(wilt(-40, 0, 12, 0.55, deathProgress))}">
        ${k("M -80 0 Q -110 -90, -85 -160 Q -55 -90, -55 0 Z", "#c084fc", 0.85)}
        ${k("M -55 0 Q -70 -120, -35 -185 Q -15 -120, -25 0 Z", "#a855f7", 0.9)}
        ${k("M -25 0 Q -20 -135, 10 -205 Q 30 -130, 0 0 Z", "#d8b4fe", 0.85)}
        ${k(C(0, -20, 60), "#7e22ce", 0.75)}
        </g>
      </g>
      <g transform="translate(190, ${b - 70})">
        <g transform="${ifDefined(wilt(0, 46, 0, 0.4, deathProgress))}">
        ${skinned(style, shading, "M 0,-42 C 6,-42 12,-18 16,-12 C 22,-8 44,-10 44,-4 C 44,2 26,10 22,16 C 18,22 28,42 22,46 C 16,50 8,30 0,26 C -8,30 -16,50 -22,46 C -28,42 -18,22 -22,16 C -26,10 -44,2 -44,-4 C -44,-10 -22,-8 -16,-12 C -12,-18 -6,-42 0,-42 Z", "#1d4ed8", { stroke: "#1e40af", sw: 2 })}
        <path d="M 0,-34 L 0,18 M -35,-4 L 35,-4 M -18,36 L 18,36" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" opacity="0.75" />
        <circle cx="0" cy="0" r="5" fill="#60a5fa" />
        </g>
      </g>
      </g>
      <g id="live-rock">
        ${PILE.slice(0, 4).map((piece) => rock(style, shading, b, piece))}
        ${PILE.slice(4).map((piece) => rock(style, shading, b, piece))}
        ${shapeEl(sh(E(884, b - 52, 36, 22), "#0b0614", { stroke: "none", op: 1 }))}
        ${k(ledgePath(b), "#9a78ad")}
        ${style === "cartoon" ? "" : shapeEl(sh(`M ${REEF_PILE.ledgeFrom - 20},${b - REEF_PILE.ledge + 3} L ${REEF_PILE.ledgeTo + 44},${b - REEF_PILE.ledge + 3}`, undefined, { stroke: "#ffffff", sw: 1.6, op: 0.4, lc: "round" }))}
        ${PILE_TOP.map((piece) => rock(style, shading, b, piece))}
        ${style === "cartoon" ? "" : [[850, 44, 16, 7], [942, 108, 18, 8], [976, 152, 11, 6], [812, 74, 12, 6], [1002, 200, 9, 7]].map(([x, up, rx, ry]) => shapeEl(sh(E(x, b - up, rx, ry), "#e879f9", { op: 0.32, stroke: "none" })))}
        ${style === "flat" ? [[846, 66], [972, 158]].map(([x, up]) => svg`${shapeEl(sh(`M ${x},${b - up} L ${x},${b - up - 9}`, undefined, { stroke: "#fb923c", sw: 1.2, lc: "round" }))}${shapeEl(sh(C(x, b - up - 11, 3.2), "#fb923c", { stroke: "none" }))}`) : ""}
      </g>
      <g id="live-rock-scattered">
        ${SCATTERED_ROCKS.map((piece) => rock(style, shading, b, piece))}
      </g>
      <g id="anemone" style="${lifeStyle}" transform="translate(260, ${b - 17}) scale(1.4, 1.4)">
        <g transform="${ifDefined(wilt(0, 22, 0, 0.3, deathProgress))}">
        ${renderAnemoneTentacles(ctx, deathProgress)}
        ${k(E(0, -16, 30, 11), "#86198f", 0.9)}
        ${k("M -22,-5 C -26,3 -23,12 -15,17 C -7,21 7,21 15,17 C 23,12 26,3 22,-5 C 14,-14 -14,-14 -22,-5 Z", "#701a75")}
        ${k(E(0, 16, 26, 9), "#4a044e", 0.75)}
        ${style === "cartoon"
          ? svg`
              ${shapeEl(sh(C(-8, 3, 3.6), "#ffffff", { stroke: OUTLINE, sw: 1.2 }))}
              ${shapeEl(sh(C(8, 3, 3.6), "#ffffff", { stroke: OUTLINE, sw: 1.2 }))}
              ${shapeEl(sh(C(-7.4, 3.4, 2), "#111827", { stroke: "none" }))}
              ${shapeEl(sh(C(8.6, 3.4, 2), "#111827", { stroke: "none" }))}
              ${shapeEl(sh("M -6,10 Q 0,16 6,10", undefined, { stroke: OUTLINE, sw: 1.5, lc: "round" }))}
              ${shapeEl(sh(E(-14, 8, 3.4, 2), "#fb7185", { op: 0.75, stroke: "none" }))}
              ${shapeEl(sh(E(14, 8, 3.4, 2), "#fb7185", { op: 0.75, stroke: "none" }))}
            `
          : ""}
        </g>
      </g>
    </g>
  `;
}
