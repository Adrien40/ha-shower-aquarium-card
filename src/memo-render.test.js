// @vitest-environment happy-dom
//
// What does not change from one frame to the next is built once and kept (the
// shape of the fish, the rocks, the plants, the fixed parts of the animals, the
// tentacles and the water surface between two ticks of the ambient clock). The
// card draws up to 60 times a second: on a weak display such as the Google Nest
// Hub 2, building the same drawing again and again was most of its work.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { memo, memoSize, memoClear, MEMO_MAX } from "./render/skin.js";
import { fishSpec } from "./render/fish-specs.js";
import { drawFish } from "./render/fish.js";
import { renderAnemoneTentacles, chunkPath } from "./render/saltwater.js";
import { renderWaterSurface } from "./render/water.js";
import { freshwaterDecor } from "./render/freshwater.js";
import { coldwaterDecor } from "./render/coldwater.js";
import { ancistrusRedrawn, shrimpRedrawn, crabRedrawn } from "./render/redrawn.js";
import { ANIMATION_PROFILES, getAnimationProfile } from "./pure.js";

beforeEach(() => {
  window.requestAnimationFrame = () => 1;
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const markup = (template) => template.strings.join("") + JSON.stringify(template.values);

describe("memo()", () => {
  it("builds a value once for a key and gives the same one afterwards", () => {
    memoClear();
    const build = vi.fn(() => ({ made: true }));
    const a = memo("k", build);
    const b = memo("k", build);
    expect(a).toBe(b);
    expect(build).toHaveBeenCalledTimes(1);
    expect(memo("other", () => 7)).toBe(7);
    expect(memoSize()).toBe(2);
  });

  it("keeps a value that is falsy (it is not built again)", () => {
    memoClear();
    const build = vi.fn(() => 0);
    expect(memo("zero", build)).toBe(0);
    expect(memo("zero", build)).toBe(0);
    expect(build).toHaveBeenCalledTimes(1);
  });

  it("forgets the oldest ones when there are too many, and never keeps more than the limit", () => {
    memoClear();
    for (let i = 0; i < MEMO_MAX + 50; i++) memo(`key-${i}`, () => i);
    expect(memoSize()).toBe(MEMO_MAX);
    const build = vi.fn(() => "again");
    memo("key-0", build);
    expect(build).toHaveBeenCalledTimes(1);
    const recent = vi.fn(() => "new");
    memo(`key-${MEMO_MAX + 49}`, recent);
    expect(recent).not.toHaveBeenCalled();
  });
});

describe("the fish", () => {
  it("the description of a fish is made once for each kind of fish", () => {
    const fish = { species: 2, color: "#3b82f6" };
    expect(fishSpec("freshwater", fish)).toBe(fishSpec("freshwater", { ...fish, x: 5, y: 9 }));
    expect(fishSpec("freshwater", fish)).not.toBe(fishSpec("freshwater", { species: 2, color: "#ef4444" }));
    expect(fishSpec("freshwater", fish)).not.toBe(fishSpec("saltwater", fish));
    expect(fishSpec("freshwater", fish)).not.toBe(fishSpec("freshwater", { species: 3, color: "#3b82f6" }));
  });

  it("an unknown biotope is the freshwater one, and a species number wraps round", () => {
    const fish = { species: 1, color: "#3b82f6" };
    expect(fishSpec("lake", fish)).toBe(fishSpec("freshwater", fish));
    expect(fishSpec("freshwater", { species: 1 + 6, color: "#3b82f6" })).toBe(fishSpec("freshwater", fish));
    expect(fishSpec("freshwater", { species: "x" })).toBe(fishSpec("freshwater", { species: 0, color: "#3b82f6" }));
  });

  it.each(["flat", "cartoon", "realistic"])("the fixed parts of a fish are given again in the %s look, only the angles change", (style) => {
    const spec = fishSpec("freshwater", { species: 2, color: "#3b82f6" });
    const a = drawFish(style, true, spec, 3, 2);
    const b = drawFish(style, true, spec, -9, 7);
    // The fins, the tail, the body and the eye are the very same drawings.
    const same = a.values.filter((v, i) => v && v._$litType$ && v === b.values[i]);
    expect(same.length).toBeGreaterThanOrEqual(4);
    expect(markup(a)).not.toBe(markup(b));
  });

  it("the look and the shading each have their own drawing", () => {
    const spec = fishSpec("freshwater", { species: 2, color: "#3b82f6" });
    const body = (style, shading) => drawFish(style, shading, spec, 0, 0).values.filter((v) => v && v._$litType$)[2];
    expect(body("flat", true)).not.toBe(body("cartoon", true));
    expect(body("realistic", true)).not.toBe(body("realistic", false));
    expect(body("flat", true)).toBe(body("flat", true));
  });

  it("a fish without a pectoral fin is drawn without one", () => {
    const spec = { ...fishSpec("freshwater", { species: 2, color: "#3b82f6" }), pec: null };
    expect(markup(drawFish("flat", true, spec, 0, 0))).not.toContain("rotate(0)\">");
  });

  it("the scales of the realistic look are worked out once for a body", () => {
    const spec = fishSpec("freshwater", { species: 2, color: "#3b82f6" });
    const out = (style) => markup(drawFish(style, true, spec, 0, 0));
    expect((out("realistic").match(/q3,2\.4 6,0/g) || []).length).toBeGreaterThan(5);
    expect(out("realistic")).toContain("q3,2.4 6,0");
  });
});

describe("the reef", () => {
  it("the shape of a chunk of rock is worked out once", () => {
    expect(chunkPath(100, 50, 40, 20, 3)).toBe(chunkPath(100, 50, 40, 20, 3));
    expect(chunkPath(100, 50, 40, 20, 3)).not.toBe(chunkPath(100, 50, 40, 20, 4));
  });

  const ctx = (over = {}) => ({ _ambientTime: 1, _config: { creature_style: "flat" }, _profile: ANIMATION_PROFILES.max, ...over });

  it("the tentacles are given again until the ambient clock ticks, the tank dies or the look changes", () => {
    const c = ctx();
    const first = renderAnemoneTentacles(c, 0);
    expect(renderAnemoneTentacles(c, 0)).toBe(first);
    c._ambientTime = 1.5;
    const next = renderAnemoneTentacles(c, 0);
    expect(next).not.toBe(first);
    expect(renderAnemoneTentacles(c, 0.4)).not.toBe(next);
    c._config = { creature_style: "cartoon" };
    expect(renderAnemoneTentacles(c, 0.4)).not.toBe(next);
  });

  it("each card has its own tentacles", () => {
    const [a, b] = [ctx(), ctx({ _ambientTime: 2 })];
    const ta = renderAnemoneTentacles(a, 0);
    renderAnemoneTentacles(b, 0);
    expect(renderAnemoneTentacles(a, 0)).toBe(ta);
  });

  it("the light profile draws fewer tentacles, and never fewer than two on a layer", () => {
    expect(renderAnemoneTentacles(ctx(), 0)).toHaveLength(27);
    expect(renderAnemoneTentacles(ctx({ _profile: ANIMATION_PROFILES.light }), 0)).toHaveLength(7 + 10);
    expect(renderAnemoneTentacles(ctx({ _profile: { tentacles: 0.01 }, _ambientTime: 3 }), 0)).toHaveLength(4);
  });

  it("a card without a profile (a test, an old host) draws all of them", () => {
    expect(renderAnemoneTentacles({ _ambientTime: 9, _config: {} }, 0)).toHaveLength(27);
  });

  it("the profiles say how many tentacles: all, except the light one", () => {
    for (const name of ["max", "balanced"]) expect(getAnimationProfile(name).tentacles).toBe(1);
    expect(getAnimationProfile("light").tentacles).toBeLessThan(1);
    expect(getAnimationProfile("light").tentacles).toBeGreaterThan(0.3);
  });
});

describe("the water surface", () => {
  const ctx = (over = {}) => ({ _flowIntensity: 0, _animTime: 1, _ambientTime: 1, _profile: ANIMATION_PROFILES.max, ...over });

  it("is given again while the clock it follows has not moved", () => {
    const c = ctx();
    const strip = renderWaterSurface(c, 12, 1012, 100);
    expect(renderWaterSurface(c, 12, 1012, 100)).toBe(strip);
    // Calm water follows the ambient clock, not the animation one.
    c._animTime = 5;
    expect(renderWaterSurface(c, 12, 1012, 100)).toBe(strip);
    c._ambientTime = 1.2;
    expect(renderWaterSurface(c, 12, 1012, 100)).not.toBe(strip);
  });

  it("follows the animation clock while water runs", () => {
    const c = ctx({ _flowIntensity: 0.6 });
    const strip = renderWaterSurface(c, 12, 1012, 100);
    c._ambientTime = 3;
    expect(renderWaterSurface(c, 12, 1012, 100)).toBe(strip);
    c._animTime = 2;
    expect(renderWaterSurface(c, 12, 1012, 100)).not.toBe(strip);
  });

  it("changes with the height of the water, the width of the tank, the flow and the profile", () => {
    const c = ctx();
    const strip = renderWaterSurface(c, 12, 1012, 100);
    expect(renderWaterSurface(c, 12, 1012, 140)).not.toBe(strip);
    expect(renderWaterSurface(c, 0, 1024, 140)).not.toBe(strip);
    c._flowIntensity = 0.2;
    expect(renderWaterSurface(c, 12, 1012, 100)).not.toBe(strip);
    c._flowIntensity = 0;
    c._profile = ANIMATION_PROFILES.light;
    expect(renderWaterSurface(c, 12, 1012, 100)).not.toBe(strip);
  });

  it("a card with no flow yet (undefined) is calm", () => {
    const c = { _animTime: 1, _ambientTime: 1, _profile: ANIMATION_PROFILES.max };
    expect(renderWaterSurface(c, 12, 1012, 100)).toBe(renderWaterSurface(c, 12, 1012, 100));
  });
});

describe("the plants and the pebbles", () => {
  it("are given again for the same tank and drawn again when the tank dies or changes", () => {
    const plants = freshwaterDecor(565, "", "flat", true, 0);
    expect(freshwaterDecor(565, "", "flat", true, 0)).toBe(plants);
    expect(freshwaterDecor(565, "", "flat", true)).toBe(plants);
    expect(freshwaterDecor(565, "", "flat", true, 0.5)).not.toBe(plants);
    expect(freshwaterDecor(565, "", "flat", true, 0.5)).toBe(freshwaterDecor(565, "", "flat", true, 0.5));
    expect(freshwaterDecor(565, "opacity: 0.5;", "flat", true, 0)).not.toBe(plants);
    expect(freshwaterDecor(700, "", "flat", true, 0)).not.toBe(plants);
    expect(freshwaterDecor(565, "", "cartoon", true, 0)).not.toBe(plants);
  });

  it("the pebbles never change for the same tank", () => {
    const pebbles = coldwaterDecor(565, "flat", true);
    expect(coldwaterDecor(565, "flat", true)).toBe(pebbles);
    expect(coldwaterDecor(565, "flat", false)).not.toBe(pebbles);
    expect(coldwaterDecor(600, "flat", true)).not.toBe(pebbles);
  });
});

describe("the animals", () => {
  it("the Ancistrus gives its fixed parts again, only the breathing of the mouth changes", () => {
    const a = ancistrusRedrawn("flat", true, 1);
    const b = ancistrusRedrawn("flat", true, 1.06);
    // The values are: what comes before the mouth, the two sizes of the mouth, the mouth, what comes after it.
    expect(a.values[0]).toBe(b.values[0]);
    expect(a.values[3]).toBe(b.values[3]);
    expect(a.values[4]).toBe(b.values[4]);
    expect([a.values[1], a.values[2]]).toEqual([1, 1]);
    expect([b.values[1], b.values[2]]).toEqual([1.06, 1.06]);
    expect(ancistrusRedrawn("cartoon", true, 1).values[0]).not.toBe(a.values[0]);
  });

  it("the shrimp gives its body again, only the legs and the swimmerets are drawn each time", () => {
    const body = (gait) => shrimpRedrawn("flat", true, gait).values.at(-1);
    expect(body({ phase: 0, stride: 0, time: 0 })).toBe(body({ phase: 3, stride: 1, time: 2 }));
    expect(body({})).not.toBe(shrimpRedrawn("cartoon", true, {}).values.at(-1));
  });

  it("the crab gives its body again, and the legs of each side move on their own", () => {
    const body = (gait) => crabRedrawn("flat", true, gait).values.at(-1);
    expect(body({ phase: 0, stride: 0 })).toBe(body({ phase: 3, stride: 1 }));
    expect(markup(crabRedrawn("flat", true, { phase: 0.4, stride: 1 }))).not.toBe(markup(crabRedrawn("flat", true, { phase: 2.4, stride: 1 })));
    // The claw is shared by the two sides.
    const claws = crabRedrawn("flat", true, {}).values.filter((v) => v && v._$litType$);
    expect(claws.length).toBeGreaterThanOrEqual(1);
  });
});

describe("a whole card", () => {
  const mount = async (config) => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.v", temperature_entity: "sensor.t", fish_count: 6, ...config });
    el.hass = { language: "en", states: { "sensor.v": { state: "12", last_changed: new Date().toISOString() }, "sensor.t": { state: "34", last_changed: new Date().toISOString() } } };
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  };

  it.each(["freshwater", "saltwater", "coldwater"])("draws the same %s tank frame after frame without making more things to keep", async (theme) => {
    const el = await mount({ theme, animation_quality: "light" });
    for (let i = 0; i < 5; i++) el._updatePhysics(1000 + i * 50);
    const kept = memoSize();
    for (let i = 5; i < 60; i++) {
      el._updatePhysics(1000 + i * 50);
      el.render();
    }
    expect(memoSize()).toBe(kept);
  });

  it("many sizes of fullscreen card do not fill the memory without limit", async () => {
    const el = await mount({ theme: "saltwater", fullscreen: true });
    for (let h = 300; h < 300 + MEMO_MAX; h += 3) {
      el._viewport = { width: 1024, height: h };
      el.render();
    }
    expect(memoSize()).toBeLessThanOrEqual(MEMO_MAX);
  });

  it("the light profile draws fewer tentacles than the others in the reef", async () => {
    const count = async (animation_quality) => {
      const el = await mount({ theme: "saltwater", animation_quality });
      return el.shadowRoot.querySelectorAll('#anemone path[stroke-linecap="round"][opacity="0.9"]').length;
    };
    expect(await count("max")).toBe(27);
    expect(await count("balanced")).toBe(27);
    expect(await count("light")).toBe(17);
  });

  it("two cards in the same dashboard share what is the same without disturbing each other", async () => {
    const a = await mount({ theme: "freshwater" });
    const b = await mount({ theme: "freshwater", creature_style: "cartoon" });
    a._updatePhysics(1000);
    b._updatePhysics(1000);
    a.requestUpdate();
    b.requestUpdate();
    await Promise.all([a.updateComplete, b.updateComplete]);
    expect(a.shadowRoot.innerHTML).not.toBe(b.shadowRoot.innerHTML);
    expect(a.shadowRoot.querySelectorAll("path").length).toBeGreaterThan(10);
  });
});
