import { html } from "lit";
import { formatBudget, formatEuro, formatNumber } from "../pure.js";

/** @typedef {import("../types.js").MetricsView} MetricsView */

/** Below this many litres the tile reads 0.0, whatever the number of decimals. */
const NOTHING_CONSUMED = 0.05;

/**
 * The tiles under the picture in the normal mode: consumed, remaining, target,
 * and (when there is one) the temperature and the estimated cost.
 *
 * @param {MetricsView} view
 */
export function renderMetricsGrid(view) {
  const { currentVolume, displayedRemaining, targetBudget, currentTemp, tempTileColor, animate, cost, lang, t } = view;
  // Nothing consumed (the tile reads 0.0): no colour yet, the first threshold is not "reached".
  const volumeTier = currentVolume < NOTHING_CONSUMED ? null : view.volumeTier;
  return html`
    <div class="metrics-grid">
      <div class="metric-box">
        <div class="metric-value ${volumeTier?.blinking && animate ? "threshold-blink" : ""}" style="${volumeTier ? `color: ${volumeTier.color};` : ""}">${formatNumber(currentVolume, lang)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${t("label_consumed")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${formatNumber(displayedRemaining, lang)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${t("label_remaining")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${formatBudget(targetBudget, lang)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${t("label_target")}</div>
      </div>
      ${currentTemp > 0
        ? html`
            <div class="metric-box">
              <div
                class="metric-value"
                style="color: ${tempTileColor};"
              >
                ${formatNumber(currentTemp, lang)} <span class="metric-unit">°C</span>
              </div>
              <div class="metric-label">${t("label_temperature")}</div>
            </div>
          `
        : ""}
      ${cost
        ? html`
            <div class="metric-box">
              <div class="metric-value">${formatEuro(cost.total, lang)}</div>
              <div class="metric-label">${t("label_cost")}</div>
            </div>
          `
        : ""}
    </div>
  `;
}
