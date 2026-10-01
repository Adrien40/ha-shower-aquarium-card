import { svg } from "lit";
import { saltwaterDecor } from "./saltwater.js";
import { coldwaterDecor } from "./coldwater.js";
import { freshwaterDecor } from "./freshwater.js";
import { creatureStyle, shadingAllowed } from "./skin.js";

/**
 * Bottom decoration of the tank, chosen by biotope.
 * @param {import("../types.js").RenderHost} ctx the card element
 * @param {string} themeKey
 * @param {boolean} isFullscreen
 * @param {number} [deathProgress]
 */
export function renderThemeDecoration(ctx, themeKey, isFullscreen, deathProgress = 0) {
  const bottomY = isFullscreen ? ctx._getCanvasHeight() : ctx._getCanvasHeight() - 35;
  // Living decor (plants, corals, anemone) fades to a dull, withered look
  // as the tank dies; rocks and sand are left untouched.
  // The light profile fades the decor instead of using CSS filters, which
  // are costly on weak displays.
  const lifeStyle = ctx._profile.deathFilter
    ? `filter: grayscale(${(deathProgress * 0.85).toFixed(2)}) sepia(${(deathProgress * 0.5).toFixed(2)}) brightness(${(1 - deathProgress * 0.45).toFixed(2)});`
    : `opacity: ${(1 - deathProgress * 0.6).toFixed(2)};`;

  if (themeKey === "saltwater") return saltwaterDecor(ctx, bottomY, lifeStyle, deathProgress);
  if (themeKey === "coldwater") return coldwaterDecor(bottomY, creatureStyle(ctx), shadingAllowed(ctx));
  return freshwaterDecor(bottomY, lifeStyle, creatureStyle(ctx), shadingAllowed(ctx), deathProgress);
}

// Where the tufts of hair algae grow along the bottom: x, height they can
// reach, intensity at which they start to grow, and which way they lean.
/** @type {[number, number, number, number][]} */
const ALGAE_TUFTS = [
  [70, 70, 0.1, -1],
  [150, 95, 0.25, 1],
  [260, 60, 0.05, 1],
  [380, 110, 0.4, -1],
  [470, 65, 0.15, 1],
  [560, 90, 0.3, -1],
  [650, 120, 0.5, 1],
  [740, 70, 0.1, -1],
  [830, 100, 0.35, 1],
  [920, 80, 0.2, -1],
  [985, 60, 0.6, -1],
  [40, 55, 0.7, 1],
];
/** @type {[number, number, number, string][]} */
const TUFT_STRANDS = [
  [-6, 1, 0.15, "#3f6212"],
  [-2, 0.8, 0.35, "#4d7c0f"],
  [3, 0.65, -0.1, "#365314"],
  [7, 0.5, 0.25, "#65a30d"],
];

/** A wavy, always the same, irregular edge: -0.55 .. 0.55 around 0. */
const wave = (/** @type {number} */ t, /** @type {number} */ a, /** @type {number} */ b) => Math.sin(t / a) * 0.35 + Math.sin(t / b + 1.3) * 0.2;

/** @param {number[][]} points */
const toPath = (points) => `M${points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L")} Z`;

/**
 * The shapes of the algae for one level of growth and one size of tank: the
 * outlines of the three films and the strands of the tufts, as path data. They
 * only change with the hour, not with the frame, so they are worked out once and
 * kept (a dashboard can show several tanks of different sizes, hence a few entries).
 *
 * @typedef {object} AlgaeGeometry
 * @property {string} bottom
 * @property {string} leftWall
 * @property {string} rightWall
 * @property {{ d: string, color: string }[]} strands
 */

/** How many shapes are kept at most. */
export const ALGAE_CACHE_LIMIT = 8;
/** @type {Map<string, AlgaeGeometry>} */
const algaeCache = new Map();

/**
 * @param {number} intensity  0..1, rounded to a thousandth by the caller
 * @param {number} left
 * @param {number} right
 * @param {number} topY
 * @param {number} bottomY
 * @returns {AlgaeGeometry}
 */
export function algaeGeometry(intensity, left, right, topY, bottomY) {
  const key = `${intensity}|${left}|${right}|${topY}|${bottomY}`;
  const known = algaeCache.get(key);
  if (known) return known;

  const height = bottomY - topY;

  // Film along the bottom, with a ragged upper edge.
  const filmHeight = height * (0.04 + 0.16 * intensity);
  /** @type {number[][]} */
  const bottom = [[left, bottomY]];
  for (let x = left; x <= right; x += 8) bottom.push([x, bottomY - filmHeight * (1 + wave(x, 37, 13))]);
  bottom.push([right, bottomY]);

  // Film along the side walls.
  const filmWidth = 8 + 62 * intensity;
  /** @type {number[][]} */
  const leftWall = [[left, topY]];
  /** @type {number[][]} */
  const rightWall = [[right, topY]];
  for (let y = topY; y <= bottomY; y += 8) {
    leftWall.push([left + filmWidth * (1 + wave(y, 41, 17)), y]);
    rightWall.push([right - filmWidth * (1 + wave(y + 90, 41, 17)), y]);
  }
  leftWall.push([left, bottomY]);
  rightWall.push([right, bottomY]);

  /** @type {{ d: string, color: string }[]} */
  const strands = [];
  for (const [x, reach, start, lean] of ALGAE_TUFTS) {
    const growth = Math.min(1, (intensity - start) / 0.4);
    if (growth <= 0) continue;
    const tuftHeight = Math.min(reach * growth, height * 0.3);
    for (const [offset, factor, bend, color] of TUFT_STRANDS) {
      const baseX = x + offset;
      const tipX = baseX + lean * tuftHeight * (0.2 + bend);
      const tipY = bottomY - tuftHeight * factor;
      // The strand bows against its lean, then swings over to it at the tip.
      const controlX = baseX + (tipX - baseX) * 0.3 - lean * 5;
      const controlY = bottomY - tuftHeight * factor * 0.55;
      strands.push({ d: `M${baseX},${bottomY} Q${controlX.toFixed(1)},${controlY.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)}`, color });
    }
  }

  /** @type {AlgaeGeometry} */
  const geometry = { bottom: toPath(bottom), leftWall: toPath(leftWall), rightWall: toPath(rightWall), strands };
  if (algaeCache.size >= ALGAE_CACHE_LIMIT) algaeCache.delete(/** @type {string} */ (algaeCache.keys().next().value));
  algaeCache.set(key, geometry);
  return geometry;
}

/**
 * Green algae that grow on the glass over time: a film that creeps up from the
 * bottom and along the two side walls (with the micro-dot texture), a few
 * scattered spots elsewhere, and tufts of hair algae along the bottom. The
 * longer since the last shower, the thicker it gets.
 * @param {import("../types.js").RenderHost} ctx the card element
 * @param {number} hours
 * @param {boolean} isFullscreen
 */
export function renderAlgae(ctx, hours, isFullscreen) {
  const config = ctx._config;
  if (!config) return svg``;
  const delay = config.algae_delay_hours;
  const algaeAge = Number(config.algae_age) || 0;
  const effectiveHours = algaeAge > 0 ? algaeAge : hours;

  if (!config.algae_enabled || effectiveHours < delay) {
    return svg``;
  }

  const intensity = Math.round(Math.min(1.0, (effectiveHours - delay) / 36) * 1000) / 1000;
  const baseOpacity = (0.2 + intensity * 0.78).toFixed(2);
  const topY = isFullscreen ? 0 : 14;
  const bottomY = isFullscreen ? ctx._getCanvasHeight() : ctx._getCanvasHeight() - 35;
  const shapes = algaeGeometry(intensity, isFullscreen ? 0 : 12, isFullscreen ? 1024 : 1012, topY, bottomY);

  return svg`
    <g id="algae-layer" opacity="${baseOpacity}">
      <rect x="0" y="${topY}" width="1024" height="${bottomY - topY}" fill="url(#algaeDots)" opacity="${(0.15 + intensity * 0.2).toFixed(2)}" />
      <path d="${shapes.bottom}" fill="#4d7c0f" fill-opacity="0.32" />
      <path d="${shapes.bottom}" fill="url(#algaeDots)" />
      <path d="${shapes.leftWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${shapes.leftWall}" fill="url(#algaeDots)" opacity="0.8" />
      <path d="${shapes.rightWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${shapes.rightWall}" fill="url(#algaeDots)" opacity="0.8" />
      ${shapes.strands.map((strand) => svg`<path d="${strand.d}" fill="none" stroke="${strand.color}" stroke-width="2.6" stroke-linecap="round" />`)}
    </g>
  `;
}
