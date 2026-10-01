import { svg } from "lit";
import { computeGaugeState, formatNumber, formatBudget } from "../pure.js";

// Both gauge styles of fullscreen mode live here. They sit in the two top
// corners of the picture: water temperature on the left (only when a
// temperature is known) and consumed volume on the right.
//
//  - "thermometer": a glass thermometer for the temperature, and the volume as
//    a large number over a thin bar that fills up to the budget.
//  - "arc": two open arcs (270 degrees) with a marker dot at the current value.

// The numbers of the thermometer style carry a light outline (stroke + paint-order)
// so they stay readable over the water, the sky and the creatures alike.
const INK = "#0f172a";
const FONT = "system-ui, sans-serif";

// Thermometer geometry (viewBox units).
const TUBE_X = 62;
const TUBE_TOP = 30;
const TUBE_HEIGHT = 92;
const TUBE_HALF_WIDTH = 9;
const SCALE_TOP = 38; // y of the top of the scale (maximum temperature)
const SCALE_BOTTOM = 114; // y of the bottom of the scale (minimum temperature)
// A bulb about one and a half times as wide as the tube, like a real thermometer.
const BULB_RADIUS = 12;
const BULB_Y = TUBE_TOP + TUBE_HEIGHT - 1 + BULB_RADIUS;

// Volume bar geometry.
const BAR_RIGHT = 992;
const BAR_WIDTH = 170;

// Open arc geometry.
const ARC_RADIUS = 62;
const ARC_STROKE = 10;
const ARC_SPAN = 270; // degrees
const ARC_START = 135; // degrees, measured clockwise from 3 o'clock
const ARC_CY = 102;

/**
 * Glass thermometer: the liquid takes the colour of the current zone, and
 * three fixed notches on the right of the tube mark where the comfort zone,
 * the boiling effect and the deadly temperature begin.
 * @param {number} currentTemp
 * @param {ReturnType<typeof computeGaugeState>} gauge
 * @param {string} lang
 */
function renderThermometer(currentTemp, gauge, lang) {
  const y = (/** @type {number} */ fraction) => SCALE_BOTTOM - fraction * (SCALE_BOTTOM - SCALE_TOP);
  const liquidY = y(gauge.tempFraction);
  return svg`
    <g pointer-events="none">
      <rect x="${TUBE_X - TUBE_HALF_WIDTH}" y="${TUBE_TOP}" width="${TUBE_HALF_WIDTH * 2}" height="${TUBE_HEIGHT}" rx="${TUBE_HALF_WIDTH}" fill="#ffffff" fill-opacity="0.9" stroke="${INK}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${TUBE_X}" cy="${BULB_Y}" r="${BULB_RADIUS}" fill="#ffffff" fill-opacity="0.9" stroke="${INK}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${TUBE_X}" cy="${BULB_Y}" r="${BULB_RADIUS - 3.5}" fill="${gauge.tempColor}" />
      <rect x="${TUBE_X - 4.5}" y="${liquidY}" width="9" height="${BULB_Y - liquidY}" fill="${gauge.tempColor}" />
      ${gauge.ticks.map(
        (fraction) =>
          svg`<line x1="${TUBE_X - TUBE_HALF_WIDTH}" y1="${y(fraction)}" x2="${TUBE_X - TUBE_HALF_WIDTH - 8}" y2="${y(fraction)}" stroke="${INK}" stroke-opacity="0.45" stroke-width="2" />`
      )}
      ${gauge.marks.map(
        (mark) =>
          svg`<line x1="${TUBE_X + TUBE_HALF_WIDTH}" y1="${y(mark.fraction)}" x2="${TUBE_X + TUBE_HALF_WIDTH + 12}" y2="${y(mark.fraction)}" stroke="${mark.color}" stroke-width="3.5" stroke-linecap="round" />`
      )}
      <text x="106" y="96" font-family="${FONT}" font-size="54" font-weight="800" fill="${INK}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${formatNumber(currentTemp, lang)}°</text>
    </g>
  `;
}

/**
 * The class that makes the volume blink: once the last threshold of the
 * showerhead is passed, unless the device asks for reduced motion.
 * @param {ReturnType<typeof computeGaugeState>} gauge
 * @param {boolean} animate
 */
function blinkClass(gauge, animate) {
  return gauge.volBlink && animate ? "threshold-blink" : "";
}

/**
 * The consumed volume as a large number over a thin bar that fills up to the
 * budget. With `showBudget` the budget is written after the number.
 * @param {number} currentVolume
 * @param {number} targetBudget
 * @param {boolean} showBudget
 * @param {ReturnType<typeof computeGaugeState>} gauge
 * @param {string} lang
 * @param {boolean} animate  whether the bar may blink (once the last threshold is passed)
 */
function renderVolumeBar(currentVolume, targetBudget, showBudget, gauge, lang, animate) {
  const unit = showBudget
    ? svg`<tspan dx="12" font-size="30" font-weight="700">/ ${formatBudget(targetBudget, lang)}</tspan><tspan dx="6" font-size="28" font-weight="800">L</tspan>`
    : svg`<tspan dx="6" font-size="28" font-weight="800">L</tspan>`;
  return svg`
    <g pointer-events="none">
      <text x="${BAR_RIGHT}" y="86" text-anchor="end" font-family="${FONT}" font-size="58" font-weight="800" fill="${INK}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${formatNumber(currentVolume, lang)}${unit}</text>
      <rect x="${BAR_RIGHT - BAR_WIDTH}" y="104" width="${BAR_WIDTH}" height="9" rx="4.5" fill="${INK}" fill-opacity="0.18" />
      <rect class="${blinkClass(gauge, animate)}" x="${BAR_RIGHT - BAR_WIDTH}" y="104" width="${(gauge.volFraction * BAR_WIDTH).toFixed(1)}" height="9" rx="4.5" fill="${gauge.volColor}" />
    </g>
  `;
}

/**
 * One open arc: a frosted disc, a track, the coloured arc, a marker dot at
 * the end of it, and the value in the middle.
 * @param {number} cx
 * @param {number} fraction  0..1 of the arc that is filled
 * @param {string} color
 * @param {ReturnType<typeof svg>} value  the text of the middle (already a template)
 * @param {{ fraction: number, color: string }[]} [marks]  notches outside the arc, where a zone begins
 * @param {string} [blink]  class that makes the arc and its marker blink
 */
function renderArc(cx, fraction, color, value, marks = [], blink = "") {
  const circumference = 2 * Math.PI * ARC_RADIUS;
  const span = (ARC_SPAN / 360) * circumference;
  const angle = ((ARC_START + fraction * ARC_SPAN) * Math.PI) / 180;
  const dotX = ARC_RADIUS * Math.cos(angle);
  const dotY = ARC_RADIUS * Math.sin(angle);
  return svg`
    <g transform="translate(${cx}, ${ARC_CY})" pointer-events="none">
      <circle r="${ARC_RADIUS + 26}" fill="rgba(255, 255, 255, 0.55)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" />
      <circle r="${ARC_RADIUS}" fill="none" stroke="rgba(15, 23, 42, 0.15)" stroke-width="${ARC_STROKE}" stroke-linecap="round" stroke-dasharray="${span.toFixed(1)} ${circumference.toFixed(1)}" transform="rotate(${ARC_START})" />
      <circle class="${blink}" r="${ARC_RADIUS}" fill="none" stroke="${color}" stroke-width="${ARC_STROKE}" stroke-linecap="round" stroke-dasharray="${(fraction * span).toFixed(1)} ${circumference.toFixed(1)}" transform="rotate(${ARC_START})" />
      ${marks.map((mark) => {
        const a = ((ARC_START + mark.fraction * ARC_SPAN) * Math.PI) / 180;
        const [cos, sin] = [Math.cos(a), Math.sin(a)];
        return svg`<line x1="${((ARC_RADIUS + 8) * cos).toFixed(1)}" y1="${((ARC_RADIUS + 8) * sin).toFixed(1)}" x2="${((ARC_RADIUS + 18) * cos).toFixed(1)}" y2="${((ARC_RADIUS + 18) * sin).toFixed(1)}" stroke="${mark.color}" stroke-width="3.5" stroke-linecap="round" />`;
      })}
      <circle class="${blink}" cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="8" fill="#ffffff" stroke="${color}" stroke-width="4" />
      ${value}
    </g>
  `;
}

/**
 * The two gauges of fullscreen mode.
 * @param {object} input
 * @param {string} input.style  "thermometer" or "arc"
 * @param {number} input.currentTemp
 * @param {number} input.currentVolume
 * @param {boolean} [input.forceTemp]  show the thermometer even without a temperature (editor preview)
 * @param {number} input.targetBudget
 * @param {number} input.comfortMin
 * @param {number} input.deadlyTemp
 * @param {number} input.boilTemp
 * @param {boolean} input.showBudget
 * @param {string} input.lang  language code, for the decimal separator
 * @param {import("../types.js").VolumeTier | null} [input.volumeTier]  the colour of the threshold reached (showerhead with coloured thresholds)
 * @param {boolean} [input.animate]  whether the volume may blink once the last threshold is passed
 */
export function renderStatusPanel({ style, currentTemp, currentVolume, targetBudget, comfortMin, deadlyTemp, boilTemp, showBudget, forceTemp = false, lang, volumeTier = null, animate = true }) {
  const gauge = computeGaugeState({ currentTemp, currentVolume, targetBudget, comfortMin, deadlyTemp, boilTemp, tier: volumeTier });
  const showTemp = currentTemp > 0 || forceTemp;

  if (style !== "arc") {
    return svg`
      ${showTemp ? renderThermometer(currentTemp, gauge, lang) : ""}
      ${renderVolumeBar(currentVolume, targetBudget, showBudget, gauge, lang, animate)}
    `;
  }

  const tempText = svg`<text y="13" font-family="${FONT}" font-size="34" font-weight="800" fill="${INK}" text-anchor="middle">${formatNumber(currentTemp, lang)}°</text>`;
  const volumeText = showBudget
    ? svg`
        <text y="4" font-family="${FONT}" font-size="34" font-weight="800" fill="${INK}" text-anchor="middle">${formatNumber(currentVolume, lang)}</text>
        <text y="30" font-family="${FONT}" font-size="20" font-weight="700" fill="${INK}" text-anchor="middle">/ ${formatBudget(targetBudget, lang)} L</text>
      `
    : svg`<text y="13" font-family="${FONT}" font-size="34" font-weight="800" fill="${INK}" text-anchor="middle">${formatNumber(currentVolume, lang)}<tspan dx="3" font-size="20" font-weight="800">L</tspan></text>`;
  return svg`
    ${showTemp ? renderArc(102, gauge.tempFraction, gauge.tempColor, tempText, gauge.marks) : ""}
    ${renderArc(922, gauge.volFraction, gauge.volColor, volumeText, [], blinkClass(gauge, animate))}
  `;
}
