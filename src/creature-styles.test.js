// @vitest-environment happy-dom
//
// The three looks of the living things (flat, cartoon, realistic): the shapes
// of the fish, the bottom dwellers, the snails and the decor, in every biotope.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "lit";
import "./shower-aquarium-card.js";
import { CREATURE_STYLES, OUTLINE, E, C, P, L, sh, shapeEl, skinned, creatureStyle, shadingAllowed } from "./render/skin.js";
import { symmetric } from "./render/redrawn.js";
import { fishSpec, FISH_SPECIES_COUNT } from "./render/fish-specs.js";
import { drawFish, renderFishShape } from "./render/fish.js";
import { renderSnails, SNAIL_KINDS } from "./render/snails.js";
import { chunkPath, ledgePath } from "./render/saltwater.js";
import { REEF_PILE } from "./reef-layout.js";
import { CRAB_ROUTE } from "./reef-layout.js";
import { freshwaterDecor } from "./render/freshwater.js";
import { coldwaterDecor } from "./render/coldwater.js";
import { ANIMATION_PROFILES, CREATURE_STYLE_NAMES, normalizeConfig, getAnimationProfile } from "./pure.js";

const THEMES = ["freshwater", "saltwater", "coldwater"];
const SPECIES = { freshwater: [0, 1, 2, 3, 4, 5], saltwater: [0, 1, 2, 3, 4, 5, 6], coldwater: [0, 1, 2, 3, 4, 5] };

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  window.requestAnimationFrame = () => 1;
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const host = () => document.createElement("div");
const markup = (template) => {
  const el = host();
  render(template, el);
  return el.innerHTML;
};
const fishOf = (species, extra = {}) => ({ species, color: "#3b82f6", scale: 1.4, phase: 0, x: 0, y: 0, vx: 1, vy: 0, dir: 1, ...extra });

function mountCard(config = {}, volume = 12) {
  const Card = customElements.get("shower-aquarium-card");
  const el = new Card();
  el.setConfig({ entity: "sensor.v", fish_count: 6, ...config });
  el.hass = { language: "en", states: { "sensor.v": { state: String(volume), last_changed: new Date().toISOString() } } };
  document.body.appendChild(el);
  return el.updateComplete.then(() => el);
}
const svgOf = (el) => el.shadowRoot.querySelector("svg").outerHTML;
// The outline of the cartoon look: a stroke (the same slate is also used as a fill by the neon and the Ancistrus).
const OUTLINE_STROKE = `stroke="${OUTLINE}"`;

describe("the looks, and how they are chosen", () => {
  it("are flat, cartoon and realistic, the same everywhere they are listed", () => {
    expect(CREATURE_STYLES).toEqual(["flat", "cartoon", "realistic"]);
    expect(CREATURE_STYLE_NAMES).toEqual(CREATURE_STYLES);
  });

  it("the card uses the flat look when nothing is chosen", () => {
    expect(creatureStyle({})).toBe("flat");
    expect(creatureStyle({ _config: {} })).toBe("flat");
    expect(creatureStyle({ _config: { creature_style: "cartoon" } })).toBe("cartoon");
  });

  it("an unknown look is corrected with a warning", () => {
    const { config, warnings } = normalizeConfig({ entity: "sensor.x", creature_style: "pixel" });
    expect(config.creature_style).toBe("flat");
    expect(warnings).toHaveLength(1);
    expect(normalizeConfig({ entity: "sensor.x", creature_style: "cartoon" }).warnings).toEqual([]);
  });

  it("the soft shading is left out by the light animation profile only", () => {
    expect(ANIMATION_PROFILES.max.shading).toBe(true);
    expect(ANIMATION_PROFILES.balanced.shading).toBe(true);
    expect(ANIMATION_PROFILES.light.shading).toBe(false);
    expect(shadingAllowed({ _profile: getAnimationProfile("light") })).toBe(false);
    expect(shadingAllowed({ _profile: getAnimationProfile("max") })).toBe(true);
  });
});

describe("the shape helpers", () => {
  it("write ellipses, circles, polygons and lines as paths", () => {
    expect(E(0, 0, 4, 2)).toBe("M-4,0 A4,2 0 1,0 4,0 A4,2 0 1,0 -4,0 Z");
    expect(C(1, 1, 3)).toBe(E(1, 1, 3, 3));
    expect(P("0,0 5,0 5,5")).toBe("M0,0 L5,0 L5,5 Z");
    expect(L(0, 1, 2, 3)).toBe("M0,1 L2,3");
  });

  it("a shape has no fill of its own unless it is given one", () => {
    expect(sh("M0,0", "#fff", { op: 0.5 })).toEqual({ d: "M0,0", fill: "#fff", op: 0.5 });
    expect(markup(shapeEl(sh("M0,0 L1,1")))).toContain('fill="none"');
  });

  it("the outline only goes to shapes that have no stroke of their own", () => {
    expect(markup(shapeEl(sh("M0,0", "#fff"), true))).toContain(`stroke="${OUTLINE}"`);
    expect(markup(shapeEl(sh("M0,0", "#fff"), false))).not.toContain("stroke=");
    expect(markup(shapeEl(sh("M0,0", "#fff", { stroke: "#f00", sw: 3 }), true))).toContain('stroke="#f00"');
  });

  it("skinned() gives the plain shape, the outlined one, or the shaded one", () => {
    expect(markup(skinned("flat", true, "M0,0", "#fff"))).not.toContain("url(#shade)");
    expect(markup(skinned("cartoon", true, "M0,0", "#fff"))).toContain(OUTLINE);
    expect(markup(skinned("realistic", true, "M0,0", "#fff", { op: 0.5 }))).toContain("url(#shade)");
    expect(markup(skinned("realistic", false, "M0,0", "#fff"))).not.toContain("url(#shade)");
  });
});

describe("the fish", () => {
  const all = THEMES.flatMap((theme) => SPECIES[theme].map((species) => [theme, species]));

  it.each(all)("%s, species %i, has every part the looks draw", (theme, species) => {
    const spec = fishSpec(theme, fishOf(species));
    expect(spec.body.d).toBeTruthy();
    expect(spec.tail.shapes.length).toBeGreaterThan(0);
    expect(spec.tail.rays.length).toBeGreaterThan(1);
    expect(spec.eye.r).toBeGreaterThan(0);
    expect(spec.area).toHaveLength(4);
    expect(Array.isArray(spec.fins) && Array.isArray(spec.marks) && Array.isArray(spec.over)).toBe(true);
  });

  it("every biotope has a fish spec for each of its species, and they all look different", () => {
    for (const theme of THEMES) {
      expect(FISH_SPECIES_COUNT[theme]).toBe(SPECIES[theme].length);
      const looks = SPECIES[theme].map((species) => {
        const spec = fishSpec(theme, fishOf(species));
        return JSON.stringify([spec.body.d, spec.tail.shapes.map((s) => s.d), spec.marks.map((m) => m.d), spec.fins.map((f) => f.d)]);
      });
      expect(new Set(looks).size, theme).toBe(looks.length);
    }
  });

  it("the species that repeat in a full tank do not repeat by size alone: every biotope has at least six designs", () => {
    for (const theme of THEMES) expect(FISH_SPECIES_COUNT[theme]).toBeGreaterThanOrEqual(6);
  });

  it("a fish without a usable species is drawn as the first species of its biotope", () => {
    for (const theme of THEMES) {
      const first = fishSpec(theme, fishOf(0)).body.d;
      for (const species of [undefined, NaN, "x", null]) expect(fishSpec(theme, fishOf(species)).body.d, `${theme} ${species}`).toBe(first);
      expect(fishSpec(theme, fishOf(-1)).body.d).toBe(fishSpec(theme, fishOf(1)).body.d);
      expect(fishSpec(theme, fishOf(1.9)).body.d).toBe(fishSpec(theme, fishOf(1)).body.d);
    }
  });

  it("the species numbers wrap round instead of failing", () => {
    for (const theme of THEMES) {
      expect(fishSpec(theme, fishOf(FISH_SPECIES_COUNT[theme])).body.d).toBe(fishSpec(theme, fishOf(0)).body.d);
    }
  });

  it("the goldfish differ by shape and by colour, not only by size: hump, hood, black body, calico", () => {
    const bodies = SPECIES.coldwater.map((species) => fishSpec("coldwater", fishOf(species)).body);
    expect(new Set(bodies.map((b) => b.d)).size).toBe(6);
    expect(fishSpec("coldwater", fishOf(3)).over.length).toBe(4);
    expect(fishSpec("coldwater", fishOf(4)).body.fill).toBe("#111827");
    expect(fishSpec("coldwater", fishOf(5)).marks.length).toBeGreaterThan(3);
  });

  it("the reef fish that are not the clownfish or the tang have natural colours of their own, not a palette colour", () => {
    for (const species of [2, 4, 5, 6]) {
      const one = fishSpec("saltwater", fishOf(species, { color: "#ff00ff" }));
      const other = fishSpec("saltwater", fishOf(species, { color: "#00ff00" }));
      expect(one.body.fill).toBe(other.body.fill);
      expect(JSON.stringify(one)).not.toContain("#ff00ff");
    }
  });

  it("the discus, the guppy, the rasbora and the gourami keep their own colours, the angelfish takes the fish colour", () => {
    for (const species of [1, 2, 3, 4, 5]) {
      expect(JSON.stringify(fishSpec("freshwater", fishOf(species, { color: "#ff00ff" })))).not.toContain("#ff00ff");
    }
    expect(fishSpec("freshwater", fishOf(0, { color: "#ff00ff" })).body.fill).toBe("#ff00ff");
  });

  it("the clownfish is the only one with a pectoral fin that waves", () => {
    expect(fishSpec("saltwater", fishOf(0)).pec).not.toBeNull();
    expect(fishSpec("saltwater", fishOf(3)).pec).toBeNull();
    expect(fishSpec("freshwater", fishOf(0)).pec).toBeNull();
  });

  it("a fish without a colour gets a blue one", () => {
    expect(fishSpec("freshwater", fishOf(0, { color: undefined })).body.fill).toBe("#3b82f6");
  });

  it("an unknown biotope is drawn like a freshwater one", () => {
    expect(fishSpec("lake", fishOf(0)).body.d).toBe(fishSpec("freshwater", fishOf(0)).body.d);
  });

  it.each(all.flatMap(([theme, species]) => CREATURE_STYLES.map((style) => [theme, species, style])))("%s %i draws in the %s look", (theme, species, style) => {
    const html = markup(drawFish(style, true, fishSpec(theme, fishOf(species)), 5, 3));
    expect(html.length).toBeGreaterThan(300);
    expect(html).not.toContain("NaN");
    expect(html).not.toContain("undefined");
  });

  it("the flat look adds a belly light and a gill line, and no outline or shading", () => {
    const html = markup(drawFish("flat", true, fishSpec("freshwater", fishOf(2)), 0, 0));
    expect(html).toContain('opacity="0.14"');
    expect(html).not.toContain(OUTLINE);
    expect(html).not.toContain("url(#shade)");
  });

  it("the cartoon look outlines every shape and gives big eyes, cheeks and a smile", () => {
    const html = markup(drawFish("cartoon", true, fishSpec("freshwater", fishOf(2)), 0, 0));
    expect(html).toContain(OUTLINE);
    expect(html).toContain("#fb7185");
    expect(html).not.toContain("url(#shade)");
    const eye = fishSpec("freshwater", fishOf(2)).eye;
    expect(html).toContain(`r="${eye.r * 2.1}"`);
  });

  it("the cartoon look leaves the fin rays out", () => {
    const flat = markup(drawFish("flat", true, fishSpec("freshwater", fishOf(2)), 0, 0));
    const cartoon = markup(drawFish("cartoon", true, fishSpec("freshwater", fishOf(2)), 0, 0));
    expect(flat.match(/stroke-opacity/g) || []).toHaveLength(0);
    expect(flat).toContain('opacity="0.16"');
    expect(cartoon).not.toContain('opacity="0.16"');
  });

  it("the realistic look shades the body, draws scales and a shine, and stronger fin rays", () => {
    const html = markup(drawFish("realistic", true, fishSpec("freshwater", fishOf(2)), 0, 0));
    expect(html).toContain("url(#shade)");
    expect(html).toContain("q3,2.4 6,0");
    expect(html).toContain('opacity="0.3"');
    expect(html).toContain('opacity="0.32"');
  });

  it("the realistic look draws no shading, but keeps the scales, when shading is not allowed", () => {
    const html = markup(drawFish("realistic", false, fishSpec("freshwater", fishOf(2)), 0, 0));
    expect(html).not.toContain("url(#shade)");
    expect(html).toContain("q3,2.4 6,0");
  });

  it("the realistic eye keeps a species eye colour and lights a plain one", () => {
    const angel = markup(drawFish("realistic", true, fishSpec("freshwater", fishOf(0)), 0, 0));
    const plain = markup(drawFish("realistic", true, fishSpec("freshwater", fishOf(3)), 0, 0));
    expect(angel).toContain("#ef4444");
    expect(plain).toContain("#fef3c7");
  });

  it("the tail and the fin wave with the wag", () => {
    const html = markup(drawFish("flat", true, fishSpec("saltwater", fishOf(0)), 7, 9));
    expect(html).toContain("rotate(7)");
    expect(html).toContain("rotate(9)");
  });

  it("the tail of a fat goldfish wags a little less than its wag", () => {
    expect(markup(drawFish("flat", true, fishSpec("coldwater", fishOf(2)), 10, 0))).toContain("rotate(8)");
  });

  it("the scales stay on the body: a fish with a small area gets a few, a big one many", () => {
    const count = (theme, species) => (markup(drawFish("realistic", true, fishSpec(theme, fishOf(species)), 0, 0)).match(/q3,2\.4 6,0/g) || []).length;
    expect(count("freshwater", 1)).toBeGreaterThan(0);
    expect(count("coldwater", 2)).toBeGreaterThan(count("freshwater", 0));
  });
});

describe("a fish in the card", () => {
  const card = async (style) => mountCard({ creature_style: style });

  it.each(CREATURE_STYLES)("the %s look reaches the picture", async (style) => {
    const html = svgOf(await card(style));
    expect(html.includes(OUTLINE_STROKE)).toBe(style === "cartoon");
    expect(html.includes('fill="url(#shade)"')).toBe(style === "realistic");
  });

  it("the light animation quality keeps the realistic look without its shading", async () => {
    const el = await mountCard({ creature_style: "realistic", animation_quality: "light" });
    const html = svgOf(el);
    expect(html).not.toContain('fill="url(#shade)"');
    expect(html).toContain("q3,2.4 6,0");
  });

  it("the shading gradient is defined in the picture", async () => {
    expect(svgOf(await card("flat"))).toContain('id="shade"');
  });

  it("a dead fish is still drawn upside down with its skeleton, in any look", () => {
    for (const style of CREATURE_STYLES) {
      const ctx = { _animTime: 0, _config: { creature_style: style }, _profile: getAnimationProfile("max") };
      const html = markup(renderFishShape(ctx, fishOf(2, { deathProgress: 1 }), "freshwater", true));
      expect(html).toContain("scale(1.4, -1.4)");
      expect(html).toContain("Fish Spine");
    }
  });
});

describe("the snails", () => {
  const snails = [
    { x: 10, y: 20, vx: 0, vy: 0, dir: 1, type: "bottom", color: "#854d0e" },
    { x: 5, y: 40, vx: 0, vy: 0, dir: -1, type: "glass_left", color: "#a16207" },
    { x: 90, y: 40, vx: 0, vy: 0, dir: 1, type: "glass_right", color: "#78350f" },
  ];
  const one = (index, style, shading = true, dead = false) => markup(renderSnails([{ ...snails[index], type: "bottom" }, ...snails.slice(1)].slice(0, index + 1).slice(index), "freshwater", dead, style, shading));

  it.each(CREATURE_STYLES.flatMap((style) => [true, false].map((dead) => [style, dead])))("%s look, dead: %s", (style, dead) => {
    const html = markup(renderSnails(snails, "freshwater", dead, style, true));
    for (const color of ["#854d0e", "#a16207", "#78350f"]) expect(html).toContain(color);
    for (const foot of ["#a8a29e", "#dc2626", "#d97706"]) expect(html.includes(foot)).toBe(!dead);
    expect(html).not.toContain("NaN");
  });

  it("there are three kinds of snail, one after the other", () => {
    expect(SNAIL_KINDS).toEqual(["turret", "ramshorn", "round"]);
  });

  it("each snail of the tank is another kind: a turret cone, a ramshorn coil, a round pond snail", () => {
    const html = markup(renderSnails(snails, "freshwater", false, "flat", true));
    expect(html).toContain("M -9,-0.5 C -9,-4 -6,-8 -3,-12");
    expect(html).toContain("a 1,1 0 0 1 2,0 a 2,2 0 0 1 -4,0");
    expect(html).toContain("A5.5,5.5");
  });

  it("a fourth snail starts the kinds over", () => {
    const four = [...snails, { ...snails[0], x: 50 }];
    expect((markup(renderSnails(four, "freshwater", false, "flat", true)).match(/M -9,-0\.5 C/g) || []).length).toBe(2);
    expect(one(0, "flat")).toContain("M -9,-0.5");
  });

  it("the look changes every kind: whorls (flat), an outline and a big eye (cartoon), shading (realistic)", () => {
    const flat = markup(renderSnails(snails, "freshwater", false, "flat", true));
    const cartoon = markup(renderSnails(snails, "freshwater", false, "cartoon", true));
    const real = markup(renderSnails(snails, "freshwater", false, "realistic", true));
    expect(flat).toContain('stroke="#ffffff"');
    expect(flat).not.toContain(OUTLINE_STROKE);
    expect(cartoon).toContain(OUTLINE_STROKE);
    expect(cartoon).toContain("A1.5,1.5");
    expect(cartoon).not.toContain("M -8.4,-3 Q");
    expect(real).toContain("url(#shade)");
    expect(real).toContain('stroke="#000000"');
    expect(markup(renderSnails(snails, "freshwater", false, "realistic", false))).not.toContain("url(#shade)");
  });

  it("are bigger in a reef tank", () => {
    expect(markup(renderSnails(snails, "saltwater", false, "flat", true))).toContain("scale(3.5,3.5)");
  });

  it("a snail without a colour gets a brown shell", () => {
    expect(markup(renderSnails([{ ...snails[0], color: undefined }], "freshwater", false, "flat", true))).toContain("#854d0e");
  });
});

describe("the Ancistrus turns to face where it goes", () => {
  const drawn = async (config = {}) => mountCard({ ...config });

  it("the whole animal turns with its heading", async () => {
    const el = await mountCard({});
    el._ancistrus.heading = 90;
    expect(markup(el._renderAncistrus(false))).toContain("rotate(90.0) scale(1.5,1.5)");
    el._ancistrus.heading = -135.26;
    expect(markup(el._renderAncistrus(false))).toContain("rotate(-135.3) scale(1.5,1.5)");
  });

  it("faces up when it has no heading yet, and is drawn upright when dead", async () => {
    const el = await drawn();
    el._ancistrus.heading = undefined;
    expect(markup(el._renderAncistrus(false))).toContain("rotate(0.0) scale(1.5,1.5)");
    el._ancistrus.heading = 90;
    expect(markup(el._renderAncistrus(true))).toContain("rotate(0) scale(1.5,-1.5)");
  });

  it("really roams the tank in the card: after some time it has moved and turned", async () => {
    const el = await drawn();
    const start = { x: el._ancistrus.x, y: el._ancistrus.y };
    let t = 1000;
    let turned = false;
    let sideways = false;
    for (let i = 0; i < 3000; i++) {
      el._updatePhysics(t);
      t += 16.66;
      if (Math.abs(el._ancistrus.heading) > 20) turned = true;
      if (Math.abs(el._ancistrus.x - start.x) > 150) sideways = true;
    }
    expect(turned).toBe(true);
    expect(sideways).toBe(true);
    expect(el._ancistrus.x).toBeGreaterThanOrEqual(90);
    expect(el._ancistrus.x).toBeLessThanOrEqual(934);
  });
});

describe("the fish keep their distance in the card", () => {
  it("ten fish put in a heap are spread out after a few seconds of swimming", async () => {
    const el = await mountCard({ theme: "freshwater", fish_count: 10 });
    for (const fish of el._fishes) {
      fish.x = 500;
      fish.y = 300;
    }
    let t = 1000;
    for (let i = 0; i < 400; i++) {
      el._updatePhysics(t);
      t += 16.66;
    }
    let closest = Infinity;
    for (let i = 0; i < el._fishes.length; i++) {
      for (let j = i + 1; j < el._fishes.length; j++) closest = Math.min(closest, Math.hypot(el._fishes[i].x - el._fishes[j].x, el._fishes[i].y - el._fishes[j].y));
    }
    expect(closest).toBeGreaterThan(15);
  });
});

describe("the bottom dwellers", () => {
  const html = (template) => markup(template);
  const combos = CREATURE_STYLES.flatMap((style) => [true, false].map((shading) => [style, shading]));

  it.each(combos)("%s look, shading: %s", async (style, shading) => {
    const el = await mountCard({ creature_style: style, theme: "saltwater", animation_quality: shading ? "max" : "light" });
    const drawings = [html(el._renderAncistrus(false)), html(el._renderShrimp(false)), html(el._renderCrab(false))];
    for (const drawing of drawings) {
      expect(drawing.length).toBeGreaterThan(400);
      expect(drawing).not.toContain("NaN");
      expect(drawing).not.toContain("undefined");
      expect(drawing.includes(OUTLINE_STROKE)).toBe(style === "cartoon");
      expect(drawing.includes("url(#shade)")).toBe(style === "realistic" && shading);
    }
  });

  it("the removed bottom_design option is ignored: only the redrawn drawing exists", async () => {
    const el = await mountCard({ bottom_design: "classic" });
    expect(html(el._renderAncistrus(false))).not.toContain("Streamlined Body");
    expect(html(el._renderCrab(false))).not.toContain("M -14,-2 L -26,-10 L -34,-8");
    expect(el._config.bottom_design).toBeUndefined();
  });

  it("the cartoon look gives them big eyes and cheeks", async () => {
    {
      const el = await mountCard({ creature_style: "cartoon" });
      expect(html(el._renderCrab(false))).toContain("#fb7185");
      expect(html(el._renderShrimp(false))).toContain("#fb7185");
      expect(html(el._renderAncistrus(false))).toContain("#fb7185");
    }
  });

  it("the flat look adds small details", async () => {
    const redrawn = await mountCard({ creature_style: "flat" });
    expect(html(redrawn._renderCrab(false))).toContain("#fca5a5");
    expect(html(redrawn._renderShrimp(false))).toContain("#fef2f2");
    expect(html(redrawn._renderAncistrus(false))).toContain("#475569");
  });

  it("the redrawn Ancistrus is dark slate grey, like the classic one, not brown", async () => {
    const el = await mountCard({});
    const drawing = html(el._renderAncistrus(false));
    for (const grey of ["#1e293b", "#182026", "#475569"]) expect(drawing).toContain(grey);
    expect(drawing).not.toContain("#6f6353");
    expect(drawing).not.toContain("#3a3128");
  });

  it("the redrawn shrimp has a gentle arch and a tail fan pointing back and down, not curled under", async () => {
    const el = await mountCard({ theme: "saltwater" });
    el._shrimp.dir = 1;
    const drawing = html(el._renderShrimp(false));
    expect(drawing).toContain("translate(41.1 8.9) rotate(45)");
    // The five plates of the abdomen, from the tail to the head.
    expect((drawing.match(/<g transform="rotate\(-?\d+ /g) || []).length).toBe(5);
  });

  it("the redrawn Ancistrus breathes: its mouth follows the pulse, and stays still when dead", async () => {
    const el = await mountCard({});
    el._ambientTime = 1;
    expect(html(el._renderAncistrus(false))).toMatch(/translate\(0, 3\) scale\(1\.0[0-9]+,1\.0[0-9]+\)/);
    expect(html(el._renderAncistrus(true))).toContain("translate(0, 3) scale(1,1)");
  });

  it("the redrawn Ancistrus keeps its skeleton when dead", async () => {
    const el = await mountCard({});
    el._ancistrus.deathProgress = 1;
    expect(html(el._renderAncistrus(true))).toContain("Main Ancistrus Spine");
  });

  it("a redrawn shrimp and crab still face the way they walk", async () => {
    const el = await mountCard({ theme: "saltwater" });
    el._shrimp.dir = -1;
    el._crab.dir = -1;
    expect(html(el._renderShrimp(false))).toContain("scale(-1.5, 1.5)");
    expect(html(el._renderCrab(false))).toContain("scale(-1.4, 1.4)");
    el._shrimp.dir = 1;
    expect(html(el._renderShrimp(false))).toContain("scale(1.5, 1.5)");
  });
});

describe("symmetric()", () => {
  it("mirrors the right half of an outline to the left, back to the start", () => {
    expect(symmetric([0, 0], [[4, 0, 4, 4, 0, 8]])).toBe("M0,0 C4,0,4,4,0,8 C-4,4 -4,0 0,0 Z");
  });

  it("walks back over every segment, in reverse order", () => {
    const d = symmetric([0, 0], [[3, 0, 5, 2, 6, 4], [6, 6, 3, 8, 0, 8]]);
    expect(d).toBe("M0,0 C3,0,5,2,6,4 C6,6,3,8,0,8 C-3,8 -6,6 -6,4 C-5,2 -3,0 0,0 Z");
  });
});

describe("the goby", () => {
  const goby = async (config = {}) => mountCard({ theme: "saltwater", ...config });

  it("is only in the reef tank", async () => {
    for (const theme of ["freshwater", "coldwater"]) {
      const el = await mountCard({ theme });
      expect(svgOf(el)).not.toContain("#d8b45f");
    }
    expect(svgOf(await goby())).toContain("#d8b45f");
  });

  it.each(CREATURE_STYLES.flatMap((style) => [true, false].map((shading) => [style, shading])))("is drawn in the %s look, shading: %s", async (style, shading) => {
    const el = await goby({ creature_style: style, animation_quality: shading ? "max" : "light" });
    const drawing = markup(el._renderGoby(false));
    expect(drawing.length).toBeGreaterThan(500);
    expect(drawing).not.toContain("NaN");
    expect(drawing).not.toContain("undefined");
    expect(drawing.includes(OUTLINE_STROKE)).toBe(style === "cartoon");
    expect(drawing.includes("url(#shade)")).toBe(style === "realistic" && shading);
  });

  it("sits at its burrow in the sand: a mound, a dark hole, a yellow body", async () => {
    const drawing = markup((await goby())._renderGoby(false));
    for (const part of ["#d8b45f", "#5b4423", "#fde047", "#fef9c3", "#38bdf8"]) expect(drawing).toContain(part);
    expect(drawing).toContain("translate(530, 551)");
  });

  it("the cartoon look gives it a big eye, cheeks and a smile; the others a small eye", async () => {
    const cartoon = markup((await goby({ creature_style: "cartoon" }))._renderGoby(false));
    expect(cartoon).toContain("#fb7185");
    expect(cartoon).not.toContain("#38bdf8");
    const flat = markup((await goby({ creature_style: "flat" }))._renderGoby(false));
    expect(flat).not.toContain("#fb7185");
    expect(flat).toContain('stroke="#a16207"');
  });

  it("breathes and sways its tall fin with the ambient clock, and stays still when dead", async () => {
    const el = await goby();
    el._ambientTime = 1;
    expect(markup(el._renderGoby(false))).toMatch(/rotate\(-?[0-9.]*[1-9][0-9.]* 2 -10\)/);
    expect(markup(el._renderGoby(true))).toContain("rotate(0.00 2 -10)");
  });

  it("is drawn upside down and fading when the tank is dead", async () => {
    const el = await goby();
    el._goby.deathProgress = 0.5;
    const dead = markup(el._renderGoby(true));
    expect(dead).toContain("scale(1.3, -1.3)");
    expect(dead).toContain('opacity="0.50"');
    expect(markup(el._renderGoby(false))).toContain("scale(1.3, 1.3)");
  });

  it("is drawn as nothing when it is gone", async () => {
    const el = await goby();
    el._goby = null;
    expect(markup(el._renderGoby(false)).replace(/<!--[\s\S]*?-->/g, "").trim()).toBe("");
  });

  it("is part of the picture of the reef", async () => {
    expect(svgOf(await goby())).toContain("translate(530, 551) scale(1.3, 1.3)");
  });
});

describe("the pile of live rock", () => {
  it("is drawn in the right-hand corner of the reef, and only there", async () => {
    const reef = await mountCard({ theme: "saltwater" });
    const group = reef.shadowRoot.querySelector("#live-rock");
    expect(group).not.toBeNull();
    expect(group.querySelectorAll("path").length).toBeGreaterThanOrEqual(25);
    const other = await mountCard({ theme: "freshwater" });
    expect(other.shadowRoot.querySelector("#live-rock")).toBeNull();
  });

  it("has a flat rock whose top is exactly at the height the crab walks at", () => {
    const b = 565;
    const d = ledgePath(b);
    const top = b - REEF_PILE.ledge;
    // The level top, from one cut corner to the other.
    expect(d).toContain(`M${REEF_PILE.ledgeFrom - 30 + 10},${top}`);
    expect(d).toContain(`L${REEF_PILE.ledgeTo + 52 - 10},${top}`);
    // The end of the route of the crab is on that top (its body is drawn 30 units above its feet).
    expect(b - CRAB_ROUTE[CRAB_ROUTE.length - 1].h).toBe(top);
  });

  it("the crab walks over the whole flat rock, which is wider than its lane", () => {
    const [from, to] = CRAB_ROUTE.slice(-2).map((stop) => stop.x);
    expect(REEF_PILE.ledgeFrom - 30).toBeLessThan(from);
    expect(REEF_PILE.ledgeTo + 52).toBeGreaterThan(to);
  });

  it("is tall: over 250 units high, so the pile rises well above the sand", () => {
    expect(REEF_PILE.height).toBeGreaterThanOrEqual(250);
  });

  it("is three quarters as high as its highest rock", () => {
    expect(REEF_PILE.ledge / REEF_PILE.height).toBeGreaterThan(0.7);
    expect(REEF_PILE.ledge / REEF_PILE.height).toBeLessThan(0.8);
    expect(REEF_PILE.x1).toBeLessThanOrEqual(1024);
  });

  it("follows the bottom of the tank: in fullscreen the whole pile moves with it", async () => {
    const el = await mountCard({ theme: "saltwater", fullscreen: true });
    el._viewport = { width: 300, height: 600 };
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot.innerHTML).toContain(`${2048 - REEF_PILE.ledge}`);
  });

  it("chunkPath() is a closed polygon of eight corners with a lit upper face, the same for the same seed and different for another", () => {
    const chunk = chunkPath(100, 50, 40, 20, 3);
    expect(chunk.body).toMatch(/^M[-0-9.,]+( L[-0-9.,]+){7} Z$/);
    expect(chunk.top).toMatch(/^M[-0-9.,]+( L[-0-9.,]+){3,} Z$/);
    expect(chunkPath(100, 50, 40, 20, 3)).toEqual(chunk);
    expect(chunkPath(100, 50, 40, 20, 4).body).not.toBe(chunk.body);
    expect(chunk.body).not.toContain("NaN");
  });

  it("every chunk of the reef has a lit face made of at least three corners", () => {
    for (let seed = 1; seed <= 14; seed++) {
      const { top } = chunkPath(500, 300, 40, 25, seed);
      expect(top.split(" L").length, `seed ${seed}`).toBeGreaterThanOrEqual(3);
    }
  });

  it("the flat look adds a light line along the flat top, the other looks do not", async () => {
    const light = async (style) => (svgOf(await mountCard({ theme: "saltwater", creature_style: style })).match(/stroke-opacity="0.35"|opacity="0.35"/g) || []).length;
    expect(await light("flat")).toBeGreaterThan(await light("cartoon"));
  });

  it("the purple coral has made room for it, on the left of the pile", async () => {
    const html = svgOf(await mountCard({ theme: "saltwater" }));
    expect(html).toContain("translate(690, 565)");
    expect(html).not.toContain("translate(830, 565)");
  });
});

describe("the telescope goldfish", () => {
  it("the black moor has huge bulging eyes: much bigger than the eye of any other goldfish", () => {
    const moor = fishSpec("coldwater", fishOf(4));
    const others = [0, 1, 2, 3, 5].map((s) => fishSpec("coldwater", fishOf(s)));
    expect(moor.eye.r).toBeGreaterThanOrEqual(6);
    for (const other of others) expect(moor.eye.r).toBeGreaterThanOrEqual(other.eye.r * 1.6);
  });

  it("its eyes stick out of the head as a big dark bulge, wider than the eye", () => {
    const moor = fishSpec("coldwater", fishOf(4));
    expect(moor.over).toHaveLength(1);
    expect(moor.over[0].d).toContain("A10.5,9");
    expect(moor.eye.x).toBeGreaterThan(22);
  });

  it("the eye keeps its golden iris in the three looks, and grows in the cartoon look", () => {
    for (const style of CREATURE_STYLES) {
      const html = markup(drawFish(style, true, fishSpec("coldwater", fishOf(4)), 0, 0));
      expect(html.includes("#f59e0b") || style === "cartoon", style).toBe(true);
    }
    expect(markup(drawFish("cartoon", true, fishSpec("coldwater", fishOf(4)), 0, 0))).toContain(`r="${6 * 2.1}"`);
  });
});

describe("the decor", () => {
  it.each(CREATURE_STYLES)("the freshwater plants are drawn in the %s look", (style) => {
    const html = markup(freshwaterDecor(565, "opacity: 1;", style, true));
    expect(html).toContain('id="freshwater-plants"');
    expect(html.includes(OUTLINE_STROKE)).toBe(style === "cartoon");
    expect(html.includes("url(#shade)")).toBe(style === "realistic");
    expect(html.includes('stroke="#052e16"')).toBe(style === "flat");
  });

  it("the cartoon plant stem has an outline", () => {
    expect(markup(freshwaterDecor(565, "", "cartoon", true))).toContain('stroke-width="10"');
    expect(markup(freshwaterDecor(565, "", "flat", true))).toContain('stroke-width="8"');
  });

  it.each(CREATURE_STYLES)("the pebbles are drawn in the %s look", (style) => {
    const html = markup(coldwaterDecor(565, style, true));
    expect(html).toContain('id="coldwater-decor"');
    expect(html.match(/<path/g)).toHaveLength(style === "realistic" ? 21 : 14);
    expect(html.includes("url(#shade)")).toBe(style === "realistic");
  });

  it.each(CREATURE_STYLES)("the reef is drawn in the %s look, with the anemone", async (style) => {
    const el = await mountCard({ creature_style: style, theme: "saltwater" });
    const html = svgOf(el);
    for (const id of ["reef-decor", "live-rock", "live-rock-2", 'id="anemone"']) expect(html).toContain(id);
    expect(html.includes("url(#shade)")).toBe(style === "realistic");
  });

  it("only the cartoon anemone has a face", async () => {
    const face = async (style) => (svgOf(await mountCard({ creature_style: style, theme: "saltwater" })).match(/M -6,10 Q 0,16 6,10/g) || []).length;
    expect(await face("cartoon")).toBe(1);
    expect(await face("flat")).toBe(0);
    expect(await face("realistic")).toBe(0);
  });

  it("the anemone tentacles are fat and round-tipped (cartoon), thin with a white tip (realistic)", async () => {
    const widths = async (style) => {
      const el = await mountCard({ creature_style: style, theme: "saltwater" });
      const tentacles = [...el.shadowRoot.querySelectorAll('#anemone path[stroke-linecap="round"][opacity="0.9"]')];
      return [...new Set(tentacles.map((p) => Number(p.getAttribute("stroke-width"))))].sort((a, b) => a - b);
    };
    expect(await widths("flat")).toEqual([5, 6.5]);
    expect(await widths("cartoon")).toEqual([7, 9.1]);
    expect(await widths("realistic")).toEqual([3.3, 4.2]);
    const tips = async (style) => {
      const el = await mountCard({ creature_style: style, theme: "saltwater" });
      return [...el.shadowRoot.querySelectorAll("#anemone circle")].map((c) => c.getAttribute("fill"));
    };
    expect((await tips("realistic")).every((fill) => fill === "#ffffff")).toBe(true);
    expect((await tips("flat")).includes("#f0abfc")).toBe(true);
  });

  it("only the flat corals get polyps and the rocks pits", async () => {
    const dots = async (style) => (svgOf(await mountCard({ creature_style: style, theme: "saltwater" })).match(/#ffe4e6/g) || []).length;
    expect(await dots("flat")).toBe(9);
    expect(await dots("cartoon")).toBe(0);
    expect(await dots("realistic")).toBe(0);
  });

  it("the decor fades with the tank in any look", () => {
    for (const style of CREATURE_STYLES) {
      expect(markup(freshwaterDecor(565, "filter: grayscale(0.5);", style, true))).toContain("filter: grayscale(0.5);");
    }
  });
});
