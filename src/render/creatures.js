import { svg } from "lit";
import { shapeEl, sh, C, E, OUTLINE, creatureStyle, shadingAllowed, bottomDesign } from "./skin.js";
import { ancistrusRedrawn, shrimpRedrawn, crabRedrawn } from "./redrawn.js";

/** @typedef {import("./skin.js").CreatureStyle} CreatureStyle */

/**
 * Big shiny eyes, the eyes of the cartoon look.
 * @param {number} x
 * @param {number} y
 * @param {number} r  radius of the white
 */
function cartoonEye(x, y, r) {
  return svg`
    ${shapeEl(sh(C(x, y, r), "#ffffff", { stroke: OUTLINE, sw: 1.2 }))}
    ${shapeEl(sh(C(x + r * 0.15, y + r * 0.1, r * 0.58), "#111827", { stroke: "none" }))}
    ${shapeEl(sh(C(x + r * 0.32, y - r * 0.3, r * 0.24), "#ffffff", { stroke: "none" }))}
  `;
}

/**
 * What the chosen look adds to the Ancistrus (seen from below).
 * @param {CreatureStyle} style
 * @param {boolean} shading
 */
function ancistrusLook(style, shading) {
  const body = "M -12,0 C -15,16 -14,34 -9,52 L -3,74 L 3,74 L 9,52 C 14,34 15,16 12,0 C 9,-8 -9,-8 -12,0 Z";
  if (style === "cartoon") {
    return svg`
      ${cartoonEye(-8, -1, 3.6)}${cartoonEye(8, -1, 3.6)}
      ${shapeEl(sh(E(-11, 9, 3, 1.8), "#fb7185", { op: 0.6, stroke: "none" }))}
      ${shapeEl(sh(E(11, 9, 3, 1.8), "#fb7185", { op: 0.6, stroke: "none" }))}
    `;
  }
  if (style === "realistic") {
    return svg`
      ${shading ? svg`<path d="${body}" fill="url(#shade)" />` : ""}
      ${shapeEl(sh(E(0, 26, 4, 14), "#ffffff", { op: 0.1, stroke: "none" }))}
    `;
  }
  return svg`${shapeEl(sh("M -6,10 Q -8,40 -4,66 M 6,10 Q 8,40 4,66", undefined, { stroke: "#94a3b8", sw: 0.8, op: 0.3, lc: "round" }))}`;
}

const SHRIMP_BODY = "M -30,-10 C -20,-16 -6,-16 4,-10 C 12,-6 16,-2 20,6 C 23,11 23,15 19,16 C 8,17 -2,15 -10,10 C -18,5 -24,-2 -30,-10 Z";

/**
 * What the chosen look adds to the shrimp.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 */
function shrimpLook(style, shading) {
  if (style === "cartoon") {
    return svg`
      ${shapeEl(sh(SHRIMP_BODY, undefined, { stroke: OUTLINE, sw: 1.5 }))}
      ${cartoonEye(-25, -11, 4.6)}
      ${shapeEl(sh(E(-22, -2, 3.4, 2), "#fb7185", { op: 0.75, stroke: "none" }))}
    `;
  }
  if (style === "realistic") {
    return svg`
      ${shading ? svg`<path d="${SHRIMP_BODY}" fill="url(#shade)" />` : ""}
      ${shapeEl(sh(E(-8, -12, 10, 1.6), "#ffffff", { op: 0.35, stroke: "none" }))}
    `;
  }
  return svg`${shapeEl(sh("M -16,-13 L -13,9 M -6,-13 L -3,11 M 4,-9 L 8,14 M 12,-3 L 16,14", undefined, { stroke: "#7f1d1d", sw: 0.9, op: 0.3, lc: "round" }))}`;
}

const CRAB_BODY = "M -20,-10 C -24,-2 -24,8 -18,14 C -10,19 10,19 18,14 C 24,8 24,-2 20,-10 C 14,-16 -14,-16 -20,-10 Z";

/**
 * What the chosen look adds to the crab.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 */
function crabLook(style, shading) {
  if (style === "cartoon") {
    return svg`
      ${shapeEl(sh(CRAB_BODY, undefined, { stroke: OUTLINE, sw: 1.6 }))}
      ${cartoonEye(-7, -19, 4.6)}${cartoonEye(7, -19, 4.6)}
      ${shapeEl(sh("M -5,6 Q 0,11 5,6", undefined, { stroke: OUTLINE, sw: 1.4, lc: "round" }))}
      ${shapeEl(sh(E(-12, 4, 3.2, 2), "#fb7185", { op: 0.75, stroke: "none" }))}
      ${shapeEl(sh(E(12, 4, 3.2, 2), "#fb7185", { op: 0.75, stroke: "none" }))}
    `;
  }
  if (style === "realistic") {
    return svg`
      ${shading ? svg`<path d="${CRAB_BODY}" fill="url(#shade)" />` : ""}
      ${shapeEl(sh("M -12,-6 Q 0,-12 12,-6 M -14,2 Q 0,-4 14,2", undefined, { stroke: "#7f1d1d", sw: 0.9, op: 0.35, lc: "round" }))}
      ${shapeEl(sh(E(-6, -7, 9, 2), "#ffffff", { op: 0.3, stroke: "none" }))}
    `;
  }
  return svg`
    ${[[-8, 0, 1.6], [8, 2, 1.6], [0, 8, 1.6], [5, -6, 1.2]].map(([x, y, r]) => shapeEl(sh(C(x, y, r), "#fca5a5", { op: 0.8, stroke: "none" })))}
    ${shapeEl(sh("M 0,-12 L 0,12", undefined, { stroke: "#7f1d1d", sw: 0.8, op: 0.25 }))}
  `;
}

/**
 * The classic drawing of the Ancistrus (the one it had before it was redrawn).
 * @param {CreatureStyle} style
 * @param {boolean} shading
 * @param {number} mouthPulse
 */
function classicAncistrus(style, shading, mouthPulse) {
  const finColor = "#182026";
  const bodyColor = "#1e293b";
  const borderColor = "#0a0f14";
  const spineColor = "#475569";
  return svg`
        <!-- Left Pectoral Fin with spine ray -->
        <path d="M -12,6 C -24,10 -30,18 -26,26 C -20,26 -14,20 -9,14 Z" fill="${finColor}" stroke="${borderColor}" stroke-width="0.8" />
        <line x1="-12" y1="8" x2="-24" y2="24" stroke="${spineColor}" stroke-width="1.4" stroke-linecap="round" />

        <!-- Right Pectoral Fin with spine ray -->
        <path d="M 12,6 C 24,10 30,18 26,26 C 20,26 14,20 9,14 Z" fill="${finColor}" stroke="${borderColor}" stroke-width="0.8" />
        <line x1="12" y1="8" x2="24" y2="24" stroke="${spineColor}" stroke-width="1.4" stroke-linecap="round" />

        <!-- Pelvic Fins -->
        <path d="M -7,30 C -15,36 -15,44 -7,42 Z" fill="${finColor}" stroke="${borderColor}" stroke-width="0.6" />
        <path d="M 7,30 C 15,36 15,44 7,42 Z" fill="${finColor}" stroke="${borderColor}" stroke-width="0.6" />

        <!-- Streamlined Body (Model 5 base) -->
        <path d="M -12,0 C -15,16 -14,34 -9,52 L -3,74 L 3,74 L 9,52 C 14,34 15,16 12,0 C 9,-8 -9,-8 -12,0 Z" fill="${bodyColor}" stroke="${borderColor}" stroke-width="1.1" />

        <!-- White micro-dots on body -->
        <circle cx="0" cy="20" r="1.0" fill="#ffffff" opacity="0.9" />
        <circle cx="-4" cy="30" r="0.8" fill="#ffffff" opacity="0.8" />
        <circle cx="4" cy="30" r="0.8" fill="#ffffff" opacity="0.8" />
        <circle cx="0" cy="42" r="0.8" fill="#ffffff" opacity="0.8" />
        <circle cx="-3" cy="54" r="0.7" fill="#ffffff" opacity="0.7" />
        <circle cx="3" cy="54" r="0.7" fill="#ffffff" opacity="0.7" />

        <!-- Straight brush bristles / tentacles on snout (Model 5) -->
        <line x1="-10" y1="-5" x2="-14" y2="-17" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="-7" y1="-6" x2="-9" y2="-21" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="-3" y1="-7" x2="-4" y2="-24" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="0" y1="-8" x2="0" y2="-25" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="3" y1="-7" x2="4" y2="-24" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="7" y1="-6" x2="9" y2="-21" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="10" y1="-5" x2="14" y2="-17" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />

        <!-- Recessed Sucker Mouth inside body -->
        <g transform="translate(0, 3) scale(${mouthPulse},${mouthPulse})">
          <ellipse cx="0" cy="0" rx="7.4" ry="5.6" fill="#334155" stroke="${borderColor}" stroke-width="0.9" />
          <ellipse cx="0" cy="0" rx="4.8" ry="3.6" fill="#0f172a" />
          <ellipse cx="0" cy="0" rx="2.2" ry="1.5" fill="#475569" />
        </g>
        ${ancistrusLook(style, shading)}
  `;
}

/**
 * Bottom-dwelling ancistrus (plecostomus).
 * @param {import("../types.js").RenderHost} ctx the card element
 * @param {boolean} isDead
 */
export function renderAncistrus(ctx, isDead) {
  if (!ctx._ancistrus) return svg``;
  const anc = ctx._ancistrus;
  const p = anc.deathProgress || 0;
  const bodyOpacity = (1.0 - p).toFixed(2);
  const mouthPulse = isDead ? 1 : Number((1 + Math.sin(ctx._ambientTime * 1.6) * 0.07).toFixed(3));

  const redrawn = bottomDesign(ctx) === "redrawn";
  const style = creatureStyle(ctx);
  const shading = shadingAllowed(ctx);

  return svg`
    <g transform="translate(${anc.x}, ${anc.y}) rotate(${isDead ? 0 : (anc.heading ?? 0).toFixed(1)}) scale(1.5,${isDead ? -1.5 : 1.5})">
      <g opacity="${bodyOpacity}">
        ${redrawn ? ancistrusRedrawn(style, shading, mouthPulse) : classicAncistrus(style, shading, mouthPulse)}
      </g>

      ${p > 0
        ? svg`
            <g opacity="${p.toFixed(2)}">
              <!-- Main Ancistrus Spine -->
              <line x1="0" y1="-15" x2="0" y2="70" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round" />
              <!-- Ancistrus ribs -->
              <path d="M -12,10 L 0,16 L 12,10 M -14,24 L 0,30 L 14,24 M -12,38 L 0,44 L 12,38 M -9,52 L 0,56 L 9,52 M -6,64 L 0,66 L 6,64" stroke="#f1f5f9" stroke-width="1.8" stroke-linecap="round" fill="none" />
              <!-- Sucker disc bone -->
              <ellipse cx="0" cy="-6" rx="8" ry="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1" />
              <circle cx="-3" cy="-7" r="1.5" fill="#0f172a" />
              <circle cx="3" cy="-7" r="1.5" fill="#0f172a" />
            </g>
          `
        : ""}
    </g>
  `;
}

/**
 * The classic drawing of the shrimp.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 */
function classicShrimp(style, shading) {
  return svg`
      <path d="M -6,10 L -8,16" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
      <path d="M 0,12 L -1,18" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
      <path d="M 6,13 L 6,19" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
      <path d="M 12,12 L 13,18" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
      <path d="M 20,14 L 32,6 L 34,14 L 32,23 L 20,18 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="0.7" />
      <path d="M -30,-10 C -20,-16 -6,-16 4,-10 C 12,-6 16,-2 20,6 C 23,11 23,15 19,16 C 8,17 -2,15 -10,10 C -18,5 -24,-2 -30,-10 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="0.9" />
      <circle cx="-22" cy="-8" r="1.5" fill="#fef2f2" />
      <circle cx="-14" cy="-11" r="1.4" fill="#fef2f2" />
      <circle cx="-6" cy="-10" r="1.5" fill="#fef2f2" />
      <circle cx="1" cy="-7" r="1.3" fill="#fef2f2" />
      <path d="M -30,-9 Q -40,-10 -46,-4 Q -40,0 -32,-4 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="0.7" />
      <path d="M -30,-11 Q -60,-24 -88,-30" stroke="#fef9c3" stroke-width="1.1" fill="none" stroke-linecap="round" />
      <path d="M -28,-8 Q -54,-12 -80,-10" stroke="#fef9c3" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.85" />
      <circle cx="-27" cy="-13" r="1.9" fill="#0f172a" /><circle cx="-27.6" cy="-13.6" r="0.6" fill="#f1f5f9" />
      ${shrimpLook(style, shading)}
  `;
}

/**
 * Shrimp.
 * @param {import("../types.js").RenderHost} ctx the card element
 * @param {boolean} isDead
 */
export function renderShrimp(ctx, isDead) {
  if (!ctx._shrimp) return svg``;
  const s = ctx._shrimp;
  const p = s.deathProgress || 0;
  const bodyOpacity = (1.0 - p).toFixed(2);
  const flip = s.dir === -1 ? -1 : 1;

  return svg`
    <g transform="translate(${s.x}, ${s.y}) scale(${flip * 1.5}, ${isDead ? -1.5 : 1.5})" opacity="${bodyOpacity}">
      ${bottomDesign(ctx) === "redrawn" ? shrimpRedrawn(creatureStyle(ctx), shadingAllowed(ctx)) : classicShrimp(creatureStyle(ctx), shadingAllowed(ctx))}
    </g>
  `;
}

/**
 * The classic drawing of the crab.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 */
function classicCrab(style, shading) {
  return svg`
      <path d="M -14,-2 L -26,-10 L -34,-8" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <path d="M -15,4 L -28,4 L -36,9" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <path d="M -13,10 L -24,16 L -30,24" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <path d="M -8,14 L -16,24 L -20,32" stroke="#7c2d12" stroke-width="2.2" fill="none" stroke-linecap="round" />
      <path d="M 14,-2 L 26,-10 L 34,-8" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <path d="M 15,4 L 28,4 L 36,9" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <path d="M 13,10 L 24,16 L 30,24" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <path d="M 8,14 L 16,24 L 20,32" stroke="#7c2d12" stroke-width="2.2" fill="none" stroke-linecap="round" />
      <path d="M -12,-8 L -22,-18 Q -30,-22 -34,-16 Q -28,-12 -20,-10 Z" fill="#ea580c" stroke="#9a3412" stroke-width="1" />
      <path d="M 12,-8 L 22,-18 Q 30,-22 34,-16 Q 28,-12 20,-10 Z" fill="#ea580c" stroke="#9a3412" stroke-width="1" />
      <path d="M -20,-10 C -24,-2 -24,8 -18,14 C -10,19 10,19 18,14 C 24,8 24,-2 20,-10 C 14,-16 -14,-16 -20,-10 Z" fill="#dc2626" stroke="#ea580c" stroke-width="1.2" />
      <ellipse cx="0" cy="-2" rx="15" ry="10" fill="#f87171" opacity="0.35" />
      <path d="M -6,-13 L -7,-19" stroke="#9a3412" stroke-width="1.4" stroke-linecap="round" />
      <path d="M 6,-13 L 7,-19" stroke="#9a3412" stroke-width="1.4" stroke-linecap="round" />
      <circle cx="-7.2" cy="-20" r="2" fill="#0f172a" /><circle cx="7.2" cy="-20" r="2" fill="#0f172a" />
      ${crabLook(style, shading)}
  `;
}

/**
 * Crab.
 * @param {import("../types.js").RenderHost} ctx the card element
 * @param {boolean} isDead
 */
export function renderCrab(ctx, isDead) {
  if (!ctx._crab) return svg``;
  const c = ctx._crab;
  const p = c.deathProgress || 0;
  const bodyOpacity = (1.0 - p).toFixed(2);
  const flip = c.dir === -1 ? -1 : 1;

  return svg`
    <g transform="translate(${c.x}, ${c.y}) scale(${flip * 1.4}, ${isDead ? -1.4 : 1.4})" opacity="${bodyOpacity}">
      ${bottomDesign(ctx) === "redrawn" ? crabRedrawn(creatureStyle(ctx), shadingAllowed(ctx)) : classicCrab(creatureStyle(ctx), shadingAllowed(ctx))}
    </g>
  `;
}
