import { svg } from "lit";

/**
 * Animated water-surface strip (the wavy white line at the top of the water).
 * @param {import("../types.js").RenderHost} ctx the card element (reads its animation state)
 * @param {number} x1
 * @param {number} x2
 * @param {number} y
 */
export function renderWaterSurface(ctx, x1, x2, y) {
  // The strip only changes with the clock and the flow: while the water is calm it moves with the
  // ambient clock (which ticks less often in the light profile), so the same strip is given again.
  const key = `${x1}|${x2}|${y}|${ctx._flowIntensity || 0}|${(ctx._flowIntensity || 0) > 0.05 ? ctx._animTime : ctx._ambientTime}|${ctx._profile.richSurface}`;
  const known = LAST_SURFACE.get(ctx);
  if (known && known.key === key) return known.strip;
  const strip = waterSurfaceStrip(ctx, x1, x2, y);
  LAST_SURFACE.set(ctx, { key, strip });
  return strip;
}

/** The last strip drawn for each card. @type {WeakMap<object, { key: string, strip: import("lit").SVGTemplateResult }>} */
const LAST_SURFACE = new WeakMap();

/**
 * @param {import("../types.js").RenderHost} ctx
 * @param {number} x1
 * @param {number} x2
 * @param {number} y
 */
function waterSurfaceStrip(ctx, x1, x2, y) {
  // Calm ripple at rest; livelier, choppier surface while water is running.
  const flow = ctx._flowIntensity || 0;
  const amp = 3.5 + flow * 6.5;
  const wavelen = 90 - flow * 35;
  const surfaceClock = flow > 0.05 ? ctx._animTime : ctx._ambientTime;
  const phase = surfaceClock * (1.6 + flow * 2.4);
  const rich = ctx._profile.richSurface;
  const step = rich ? 16 : 28;
  const chop = (/** @type {number} */ x) => (rich ? Math.sin(x / 17 + phase * 2.3) * flow * 2.4 : 0);

  const topPts = [];
  const botPts = [];
  for (let x = x1; x < x2; x += step) {
    topPts.push([x, y + Math.sin(x / wavelen + phase) * amp + chop(x)]);
    botPts.push([x, y + 4 + Math.sin(x / wavelen + phase + 0.6) * amp * 0.7]);
  }
  topPts.push([x2, y + Math.sin(x2 / wavelen + phase) * amp + chop(x2)]);
  botPts.push([x2, y + 4 + Math.sin(x2 / wavelen + phase + 0.6) * amp * 0.7]);

  const fmt = (/** @type {number[]} */ p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const topLine = topPts.map(fmt).join(" L ");
  const bottomLineRev = botPts
    .slice()
    .reverse()
    .map(fmt)
    .join(" L ");

  return svg`
    <path d="M ${topLine} L ${bottomLineRev} Z" fill="#ffffff" opacity="0.25" />
    <path d="M ${topLine}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85" stroke-linecap="round" />
  `;
}
