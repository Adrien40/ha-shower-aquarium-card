// @vitest-environment happy-dom
//
// Visual regression: the SVG the card draws, rasterized deterministically and
// compared with recorded pictures. It catches what the value-based tests
// cannot see: a colour, a shape or a position that changed.
//
// After an INTENDED change of the drawing, record the new pictures with
//   npm run visual:update
// and review the changed PNG files in visual/baseline/ before committing them.
// On a failure the actual and diff pictures are written to visual/__output__/.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "../src/shower-aquarium-card.js";
import {
  UPDATE,
  MAX_DIFF_RATIO,
  MAX_TILE_RATIO,
  isDifferent,
  buildCard,
  svgMarkup,
  rasterize,
  comparePng,
  readBaseline,
  writeBaseline,
  saveFailure,
  distinctColours,
} from "./helpers.js";
import { SCENARIOS } from "./scenarios.js";

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.useFakeTimers({ toFake: ["Date"] });
  window.requestAnimationFrame = () => 1;
  window.cancelAnimationFrame = () => {};
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const render = async (spec) => rasterize(svgMarkup(await buildCard(spec), spec.viewport), spec.viewport?.width);

describe("visual regression", () => {
  it.each(Object.keys(SCENARIOS))("%s", async (name) => {
    const actual = await render(SCENARIOS[name]);
    if (UPDATE) {
      writeBaseline(name, actual);
      return;
    }
    const expected = readBaseline(name);
    expect(expected, `no baseline for "${name}": run npm run visual:update`).not.toBeNull();
    const result = comparePng(actual, expected);
    if (isDifferent(result)) {
      const where = saveFailure(name, actual, result.diff);
      expect.fail(
        result.sizeMismatch
          ? `"${name}": the picture size changed (see ${where})`
          : `"${name}": ${(result.ratio * 100).toFixed(2)} % of the pixels differ (limit ${(MAX_DIFF_RATIO * 100).toFixed(2)} %), ` +
              `worst tile ${(result.worstTileRatio * 100).toFixed(1)} % (limit ${(MAX_TILE_RATIO * 100).toFixed(1)} %). Actual and diff: ${where}`
      );
    }
    expect(isDifferent(result)).toBe(false);
  });
});

describe("the visual test itself is trustworthy", () => {
  it("has a baseline for every scenario and no orphan baseline", async () => {
    if (UPDATE) return;
    const { readdirSync } = await import("node:fs");
    const { BASELINE_DIR } = await import("./helpers.js");
    const files = readdirSync(BASELINE_DIR).filter((f) => f.endsWith(".png")).map((f) => f.replace(/\.png$/, ""));
    expect(files.sort()).toEqual(Object.keys(SCENARIOS).sort());
  });

  it("rendering is deterministic: the same scenario gives the very same bytes twice", async () => {
    const spec = SCENARIOS["saltwater-calm"];
    const first = await render(spec);
    document.body.innerHTML = "";
    const second = await render(spec);
    expect(Buffer.compare(first, second)).toBe(0);
  });

  it("no picture is blank: each one has plenty of colours", async () => {
    for (const name of ["freshwater-calm", "saltwater-fullscreen-cost", "coldwater-drained"]) {
      expect(distinctColours(await render(SCENARIOS[name])), name).toBeGreaterThan(500);
    }
  });

  it("different biotopes look different", async () => {
    const fresh = await render(SCENARIOS["freshwater-calm"]);
    const salt = await render(SCENARIOS["saltwater-calm"]);
    const cold = await render(SCENARIOS["coldwater-calm"]);
    expect(comparePng(fresh, salt).ratio).toBeGreaterThan(MAX_DIFF_RATIO * 10);
    expect(comparePng(fresh, cold).ratio).toBeGreaterThan(MAX_DIFF_RATIO * 10);
    expect(comparePng(salt, cold).ratio).toBeGreaterThan(MAX_DIFF_RATIO * 10);
  });

  it("a dead tank does not look like a living one", async () => {
    const alive = await render(SCENARIOS["freshwater-calm"]);
    const dead = await render(SCENARIOS["freshwater-dead-by-heat"]);
    expect(comparePng(alive, dead).ratio).toBeGreaterThan(MAX_DIFF_RATIO * 10);
  });

  it("the gauges and the drawn effects are visible in the pictures", async () => {
    const plain = await render(SCENARIOS["freshwater-calm"]);
    expect(isDifferent(comparePng(plain, await render(SCENARIOS["saltwater-knock-on-the-glass"])))).toBe(true);
  });

  describe("the comparison is sensitive enough to catch real regressions", () => {
    const spec = SCENARIOS["freshwater-calm"];

    it("catches a changed colour (the sand)", async () => {
      const el = await buildCard(spec);
      const original = svgMarkup(el);
      const recoloured = original.replace(/fill="#fde68a"/g, 'fill="#ff0000"');
      expect(recoloured).not.toBe(original);
      expect(isDifferent(comparePng(rasterize(recoloured), rasterize(original)))).toBe(true);
    });

    it("catches a change confined to one small object (a fish that gets thinner)", async () => {
      const original = svgMarkup(await buildCard(spec));
      const thinner = original.replace('A21,14 0 1,0 21,0 A21,14 0 1,0 -21,0 Z" fill="#3b82f6"', 'A21,9 0 1,0 21,0 A21,9 0 1,0 -21,0 Z" fill="#3b82f6"');
      expect(thinner).not.toBe(original);
      const result = comparePng(rasterize(thinner), rasterize(original));
      // Small in the whole picture, obvious in its tile.
      expect(result.ratio).toBeLessThan(0.01);
      expect(isDifferent(result)).toBe(true);
    });

    it("catches a faint change of a thin translucent band (the water surface)", async () => {
      const original = svgMarkup(await buildCard(spec));
      const fainter = original.replace('fill="#ffffff" opacity="0.25"', 'fill="#ffffff" opacity="0.05"');
      expect(fainter).not.toBe(original);
      expect(isDifferent(comparePng(rasterize(fainter), rasterize(original)))).toBe(true);
    });

    it("catches fish that swim somewhere else", async () => {
      const a = await render({ ...spec, seed: 1 });
      const b = await render({ ...spec, seed: 2 });
      expect(isDifferent(comparePng(a, b))).toBe(true);
    });

    it("catches a missing element (no decoration)", async () => {
      const original = svgMarkup(await buildCard(spec));
      const withoutPlants = original.replace(/<g id="freshwater-plants"[\s\S]*?<\/g>/, "");
      expect(withoutPlants).not.toBe(original);
      expect(isDifferent(comparePng(rasterize(withoutPlants), rasterize(original)))).toBe(true);
    });

    it("does not complain about a size mismatch as a match", () => {
      const png = rasterize('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="red"/></svg>', 20);
      const bigger = rasterize('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="red"/></svg>', 40);
      expect(comparePng(png, bigger)).toMatchObject({ ratio: 1, sizeMismatch: true });
    });

    it("two identical pictures have a ratio of exactly 0", async () => {
      const png = await render(spec);
      expect(comparePng(png, png).ratio).toBe(0);
    });
  });
});
