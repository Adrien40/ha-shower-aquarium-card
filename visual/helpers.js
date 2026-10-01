// Helpers of the visual regression tests: run the card into a known state,
// take the SVG it really renders, rasterize it with resvg (a deterministic
// renderer with an embedded font, so the pictures do not depend on the
// machine) and compare it pixel by pixel with a recorded baseline.
import { vi } from "vitest";
import { Resvg } from "@resvg/resvg-js";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createFlakes } from "../src/pure.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const BASELINE_DIR = join(root, "visual/baseline");
export const OUTPUT_DIR = join(root, "visual/__output__");
export const UPDATE = process.env.UPDATE_VISUAL === "1";

/** Width of every picture, in pixels. */
export const WIDTH = 640;
/** Share of the whole picture allowed to differ (absorbs anti-aliasing noise between platforms). */
export const MAX_DIFF_RATIO = 0.001;
/**
 * The picture is also cut into TILE_COLUMNS x TILE_ROWS tiles, and no tile may
 * have more than this share of different pixels. A small local change (one
 * fish, one colour) is lost in a global ratio but stands out in its tile.
 */
export const MAX_TILE_RATIO = 0.02;
export const TILE_COLUMNS = 16;
export const TILE_ROWS = 10;
/** pixelmatch colour sensitivity (0 = strict, 1 = lenient); 0.03 still sees a 20 % change of a white overlay, but ignores differences of a couple of colour levels. */
const PIXEL_THRESHOLD = 0.03;

const T0 = 1_700_000_000_000;
const FRAME_MS = 16.66;

const FONT_DIR = join(root, "node_modules/dejavu-fonts-ttf/ttf");

/** Small seeded generator (mulberry32) so a scenario always draws the same tank. */
export function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const hassWith = (volume, temp, extraStates = {}) => ({
  language: "en",
  states: {
    "sensor.shower_volume": { state: String(volume), last_changed: new Date(T0).toISOString() },
    "sensor.shower_temp": { state: String(temp), last_changed: new Date(T0).toISOString() },
    ...extraStates,
  },
});

/** The four coloured thresholds of a Hydrao showerhead (green, blue, pink, red), as its sensors give them. */
export const THRESHOLD_STATES = Object.fromEntries(
  [[10, "#00FF00"], [20, "#0000FF"], [30, "#FF00B4"], [40, "#FF0000"]].map(([litres, hex], i) => [
    `sensor.threshold_${i + 1}`,
    { state: String(litres), last_changed: new Date(T0).toISOString(), attributes: { color_hex: hex, color_rgb: "" } },
  ])
);
/** The options that point the card at them (the fourth threshold is the target entity). */
export const THRESHOLD_CONFIG = { threshold_1_entity: "sensor.threshold_1", threshold_2_entity: "sensor.threshold_2", threshold_3_entity: "sensor.threshold_3", target_budget_entity: "sensor.threshold_4" };

/** A scenario step: the volume sensor is gone and has been for more than a minute. */
export function withSensorLost(el) {
  el.hass = {
    language: "en",
    states: {
      "sensor.shower_volume": { state: "unavailable", last_changed: new Date().toISOString() },
      "sensor.shower_temp": { state: "34", last_changed: new Date(T0).toISOString() },
    },
  };
  vi.setSystemTime(Date.now() + 61_000);
}

/**
 * Builds a card, plays `spec.frames` frames of simulation (seeded random,
 * fake clock) and returns the card after its next render.
 *
 * @param {object} spec  config, volume, temp, frames, seed, atFrame, after
 */
export async function buildCard(spec) {
  const random = seeded(spec.seed ?? 4242);
  vi.spyOn(Math, "random").mockImplementation(random);
  vi.setSystemTime(T0);

  const el = new (customElements.get("shower-aquarium-card"))();
  el.setConfig({ entity: "sensor.shower_volume", temperature_entity: "sensor.shower_temp", fish_count: 10, ...spec.config });
  el.hass = hassWith(spec.volume ?? 12, spec.temp ?? 34, spec.extraStates);
  document.body.appendChild(el);
  // A fullscreen scenario can give the shape of the screen it is shown on.
  if (spec.viewport) el._onResize(spec.viewport.width, spec.viewport.height);

  const frames = spec.frames ?? 240;
  for (let frame = 0; frame < frames; frame++) {
    vi.setSystemTime(T0 + Math.round(frame * FRAME_MS));
    spec.atFrame?.[frame]?.(el);
    el._updatePhysics(1000 + frame * FRAME_MS);
  }
  spec.after?.(el, random);
  el.requestUpdate();
  await el.updateComplete;
  return el;
}

/**
 * The SVG markup of the tank, ready for a standalone renderer. With `size`,
 * the SVG gets that width and height, like the browser gives a fullscreen SVG
 * the size of the screen: this is what would reveal a stretched drawing.
 */
export function svgMarkup(el, size) {
  const svg = el.shadowRoot.querySelector("svg");
  const sized = size ? ` width="${size.width}" height="${size.height}"` : "";
  return svg.outerHTML.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"${sized}`);
}

/** Rasterizes SVG markup to a PNG buffer with the embedded font. */
export function rasterize(markup, width = WIDTH) {
  const resvg = new Resvg(markup, {
    fitTo: { mode: "width", value: width },
    font: {
      loadSystemFonts: false,
      fontFiles: [join(FONT_DIR, "DejaVuSans.ttf"), join(FONT_DIR, "DejaVuSans-Bold.ttf"), join(FONT_DIR, "DejaVuSansMono.ttf")],
      defaultFontFamily: "DejaVu Sans",
      sansSerifFamily: "DejaVu Sans",
      monospaceFamily: "DejaVu Sans Mono",
    },
  });
  return resvg.render().asPng();
}

/**
 * Compares two PNG buffers. Returns the share of different pixels over the
 * whole picture (`ratio`), the worst share in any single tile
 * (`worstTileRatio`) and a diff picture.
 */
export function comparePng(actualBuffer, expectedBuffer) {
  const actual = PNG.sync.read(actualBuffer);
  const expected = PNG.sync.read(expectedBuffer);
  if (actual.width !== expected.width || actual.height !== expected.height) {
    return { ratio: 1, worstTileRatio: 1, diff: null, sizeMismatch: true };
  }
  const { width, height } = actual;
  const diff = new PNG({ width, height });
  const count = pixelmatch(actual.data, expected.data, diff.data, width, height, {
    threshold: PIXEL_THRESHOLD,
    diffColor: [255, 0, 0],
    aaColor: [255, 255, 0],
  });

  // pixelmatch paints every counted pixel pure red in the diff picture.
  const tileW = Math.ceil(width / TILE_COLUMNS);
  const tileH = Math.ceil(height / TILE_ROWS);
  const perTile = new Array(TILE_COLUMNS * TILE_ROWS).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (diff.data[i] === 255 && diff.data[i + 1] === 0 && diff.data[i + 2] === 0) {
        perTile[Math.floor(y / tileH) * TILE_COLUMNS + Math.floor(x / tileW)]++;
      }
    }
  }
  const worstTileRatio = Math.max(...perTile) / (tileW * tileH);
  return { ratio: count / (width * height), worstTileRatio, diff: PNG.sync.write(diff), sizeMismatch: false };
}

/** True when two compared pictures differ more than the limits allow. */
export function isDifferent(result) {
  return result.ratio > MAX_DIFF_RATIO || result.worstTileRatio > MAX_TILE_RATIO;
}

export const baselinePath = (name) => join(BASELINE_DIR, `${name}.png`);

export function writeBaseline(name, png) {
  mkdirSync(BASELINE_DIR, { recursive: true });
  writeFileSync(baselinePath(name), png);
}

export function readBaseline(name) {
  return existsSync(baselinePath(name)) ? readFileSync(baselinePath(name)) : null;
}

/** Keeps the actual and the diff picture of a failing scenario for inspection. */
export function saveFailure(name, actual, diff) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, `${name}.actual.png`), actual);
  if (diff) writeFileSync(join(OUTPUT_DIR, `${name}.diff.png`), diff);
  return join(OUTPUT_DIR, `${name}.actual.png`);
}

/** Number of distinct colours in a PNG (a blank picture has very few). */
export function distinctColours(pngBuffer) {
  const { data } = PNG.sync.read(pngBuffer);
  const seen = new Set();
  for (let i = 0; i < data.length; i += 4) seen.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
  return seen.size;
}

// Scenario hooks ------------------------------------------------------------

export const withFlakes = (el, rand) => {
  el._food = createFlakes(560, 230, 6, rand);
};

export const withRipples = (el) => {
  el._ripples = [
    { x: 620, y: 360, born: Date.now() - 260 },
    { x: 300, y: 250, born: Date.now() - 620 },
  ];
};
