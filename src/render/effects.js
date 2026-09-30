import { svg } from "lit";
import { RIPPLE_DURATION_MS } from "../pure.js";

/**
 * Bubbles of the stream that rises while water runs.
 * @param {import("../types.js").RenderHost} ctx the card element (reads its bubble pool)
 */
export function renderFlowBubbles(ctx) {
  return svg`
    <g>
      ${ctx._flowBubbles
        .filter((b) => b.active)
        .map(
          (b) => svg`<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${b.r.toFixed(1)}" fill="#ffffff" fill-opacity="0.22" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.2" />`
        )}
    </g>
  `;
}

/**
 * Flakes of fish food, sinking or landed.
 * @param {import("../types.js").RenderHost} ctx the card element (reads its flakes)
 */
export function renderFood(ctx) {
  if (!ctx._food.length) return svg``;
  return svg`
    <g>
      ${ctx._food.map(
        (f) => svg`<ellipse cx="${f.x.toFixed(1)}" cy="${f.y.toFixed(1)}" rx="${f.r.toFixed(1)}" ry="${(f.r * 0.6).toFixed(1)}" fill="${f.color}" stroke="#b45309" stroke-width="0.6" />`
      )}
    </g>
  `;
}

/**
 * Ripples spreading from where the water was tapped.
 * @param {import("../types.js").RenderHost} ctx the card element (reads its ripples and profile)
 */
export function renderRipples(ctx) {
  if (!ctx._ripples.length) return svg``;
  const now = Date.now();
  return svg`
    <g>
      ${ctx._ripples.map((r) => {
        const t = Math.min(1, (now - r.born) / RIPPLE_DURATION_MS);
        const fade = (1 - t).toFixed(2);
        return svg`
          <circle cx="${r.x.toFixed(1)}" cy="${r.y.toFixed(1)}" r="${(14 + t * 150).toFixed(1)}" fill="none" stroke="#ffffff" stroke-width="${(5 - t * 3).toFixed(1)}" stroke-opacity="${fade}" />
          ${ctx._profile.doubleRipple
            ? svg`<circle cx="${r.x.toFixed(1)}" cy="${r.y.toFixed(1)}" r="${(6 + t * 90).toFixed(1)}" fill="#ffffff" fill-opacity="${(0.28 * (1 - t)).toFixed(2)}" />`
            : ""}
        `;
      })}
    </g>
  `;
}

/**
 * Small decorative bubbles rising from the sand.
 * @param {import("../types.js").Bubble[]} bubbles
 */
export function renderBubbles(bubbles) {
  return svg`
    <g>
      ${bubbles.map(
        (b) => svg`
          <circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="#ffffff" opacity="0.6" stroke="rgba(255,255,255,0.8)" stroke-width="0.8" />
        `
      )}
    </g>
  `;
}

/**
 * Large yellowish bubbles of a boiling tank.
 * @param {import("../types.js").BoilingBubble[]} bubbles
 */
export function renderBoilingBubbles(bubbles) {
  return svg`
    <g>
      ${bubbles.map(
        (b) => svg`
          <circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="#fef08a" opacity="0.75" stroke="#ffffff" stroke-width="1.2" />
        `
      )}
    </g>
  `;
}
