import { svg } from "lit";
import { resolveLang, translate } from "../translations.js";
import { formatEuro } from "../pure.js";

/**
 * Live shower cost for fullscreen mode: plain large text at the top of the
 * picture, between the two gauges and on the same line as their numbers, with
 * no frame. A light outline keeps it readable over the sky and the water.
 * @param {import("../types.js").RenderHost} ctx the card element (reads its language)
 * @param {{ total: number } | null} cost
 */
export function renderCostLabel(ctx, cost) {
  if (!cost) return svg``;
  const label = formatEuro(cost.total, resolveLang(ctx._hass));
  return svg`
    <g transform="translate(512, 96)" pointer-events="none">
      <text font-family="system-ui, sans-serif" font-size="54" font-weight="800" text-anchor="middle" fill="#0f172a" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${label}</text>
    </g>
  `;
}

/**
 * Small frame-rate readout at the top of the picture (show_fps option).
 * @param {import("../types.js").RenderHost} ctx the card element (reads its config and FPS text)
 */
export function renderFpsBadge(ctx) {
  if (!ctx._config?.show_fps || !ctx._fpsInfo) return svg``;
  return svg`
    <g pointer-events="none">
      <rect x="292" y="6" width="440" height="30" rx="8" fill="#000000" fill-opacity="0.72" />
      <text x="512" y="27" font-family="monospace" font-size="17" font-weight="700" fill="#ffffff" text-anchor="middle">${ctx._fpsInfo}</text>
    </g>
  `;
}

/**
 * A small notice at the top of the picture while the volume sensor has had no
 * usable value for a while: the card then keeps showing the last known volume.
 * When the row of numbers (temperature, cost, volume) is shown it sits under
 * it; otherwise it goes near the top, under the FPS badge when both are shown.
 * @param {import("../types.js").RenderHost} ctx the card element (reads its config and language)
 * @param {boolean} isLost
 * @param {boolean} underNumbers
 */
export function renderSensorBadge(ctx, isLost, underNumbers) {
  if (!isLost) return svg``;
  const y = underNumbers ? 112 : 24 + (ctx._config?.show_fps ? 38 : 0);
  const label = translate(resolveLang(ctx._hass), "label_sensor_unavailable");
  return svg`
    <g transform="translate(0, ${y})" pointer-events="none">
      <rect x="362" y="0" width="300" height="34" rx="17" fill="#000000" fill-opacity="0.72" />
      <path d="M383 25 L393 8 L403 25 Z" fill="#f59e0b" />
      <rect x="392" y="13" width="2" height="7" fill="#0f172a" />
      <circle cx="393" cy="22.4" r="1.3" fill="#0f172a" />
      <text x="416" y="23" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#ffffff">${label}</text>
    </g>
  `;
}
