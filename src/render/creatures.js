import { svg } from "lit";
import { creatureStyle, shadingAllowed } from "./skin.js";
import { ancistrusRedrawn, shrimpRedrawn, crabRedrawn } from "./redrawn.js";

/** @typedef {import("./skin.js").CreatureStyle} CreatureStyle */

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

  const style = creatureStyle(ctx);
  const shading = shadingAllowed(ctx);

  return svg`
    <g transform="translate(${anc.x}, ${anc.y}) rotate(${isDead ? 0 : (anc.heading ?? 0).toFixed(1)}) scale(1.5,${isDead ? -1.5 : 1.5})">
      <g opacity="${bodyOpacity}">
        ${ancistrusRedrawn(style, shading, mouthPulse)}
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
      ${shrimpRedrawn(creatureStyle(ctx), shadingAllowed(ctx))}
    </g>
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
      ${crabRedrawn(creatureStyle(ctx), shadingAllowed(ctx))}
    </g>
  `;
}
