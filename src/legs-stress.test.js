// @vitest-environment happy-dom
//
// The crab and the shrimp move their legs when they walk, and a knock on the
// glass makes white dots of stress appear on the fish and on the other animals,
// fading out after a few seconds.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { createFrame, stepCrawler, stepCrab, markStressed, stressLevel, stepFish, stepAncistrus, STRESS_MS, WALK, SHRIMP_SPEC } from "./physics.js";
import { renderStressDots, stressDotCount, STRESS_DOTS } from "./render/stress.js";
import { shrimpRedrawn, crabRedrawn } from "./render/redrawn.js";
import { drawFish } from "./render/fish.js";
import { fishSpec } from "./render/fish-specs.js";
import { createInitialScene } from "./scene.js";
import { render } from "lit";

beforeEach(() => {
  window.requestAnimationFrame = () => 1;
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const NOW = 5_000_000;
const frame = (over = {}, tankOver = {}) =>
  createFrame({
    timestamp: 1000,
    deltaMs: 16.66,
    delta: 1,
    nowMs: NOW,
    animTime: 0,
    userSpeed: 1,
    themeKey: "saltwater",
    tank: { tankTop: 15, tankBottom: 565, waterSurfaceY: 15, waterRatio: 1, isDead: false, isBoiling: false, speedMultiplier: 1, ...tankOver },
    ...over,
  });
const constant = (v) => () => v;
const markup = (template) => template.strings.join("") + JSON.stringify(template.values);
const flat = (template) => JSON.stringify(template);

describe("the stress of an animal", () => {
  it("starts at the strength of the knock and fades out linearly in a few seconds", () => {
    const fish = {};
    markStressed(fish, NOW);
    expect(fish.stressUntil).toBe(NOW + STRESS_MS);
    expect(stressLevel(fish, NOW)).toBe(1);
    expect(stressLevel(fish, NOW + STRESS_MS / 2)).toBeCloseTo(0.5, 6);
    expect(stressLevel(fish, NOW + STRESS_MS)).toBe(0);
    expect(fish.stress).toBe(0);
    expect(stressLevel(fish, NOW + STRESS_MS * 3)).toBe(0);
  });

  it("a fish far from the knock is less stressed; the strength is kept between 0 and 1", () => {
    const [far, mad, calm] = [{}, {}, {}];
    markStressed(far, NOW, 0.5);
    markStressed(mad, NOW, 7);
    markStressed(calm, NOW, -3);
    expect(stressLevel(far, NOW)).toBe(0.5);
    expect(stressLevel(mad, NOW)).toBe(1);
    expect(stressLevel(calm, NOW)).toBe(0);
  });

  it("an animal that was never knocked has no stress", () => {
    expect(stressLevel({}, NOW)).toBe(0);
    expect(stressLevel({ stressUntil: NOW + 1000 }, NOW)).toBeCloseTo(1000 / STRESS_MS, 6);
  });

  it("a new knock starts over", () => {
    const c = {};
    markStressed(c, NOW, 0.3);
    markStressed(c, NOW + 1000, 1);
    expect(c.stressUntil).toBe(NOW + 1000 + STRESS_MS);
    expect(stressLevel(c, NOW + 1000)).toBe(1);
  });

  it("every kind of animal works its stress out each frame", () => {
    const scene = createInitialScene();
    const fish = { species: 0, x: 400, y: 300, vx: 1, vy: 0, dir: 1, phase: 0, deathProgress: 0 };
    const crawler = { ...scene.shrimp, idleUntil: NOW + 1e9 };
    const crab = { ...scene.crab, idleUntil: NOW + 1e9 };
    const anc = { ...scene.ancistrus, idleUntil: NOW + 1e9 };
    for (const c of [fish, crawler, crab, anc]) markStressed(c, NOW - STRESS_MS - 1);
    stepFish(fish, frame(), []);
    stepCrawler(crawler, frame(), SHRIMP_SPEC, constant(0.5));
    stepCrab(crab, frame(), constant(0.5));
    stepAncistrus(anc, frame(), constant(0.5));
    for (const c of [fish, crawler, crab, anc]) expect(c.stress).toBe(0);
    for (const c of [fish, crawler, crab, anc]) markStressed(c, NOW - STRESS_MS / 2 + 100);
    stepFish(fish, frame(), []);
    stepCrawler(crawler, frame(), SHRIMP_SPEC, constant(0.5));
    stepCrab(crab, frame(), constant(0.5));
    stepAncistrus(anc, frame(), constant(0.5));
    for (const c of [fish, crawler, crab, anc]) expect(c.stress).toBeGreaterThan(0.45);
  });
});

describe("the white dots", () => {
  it("none when calm, more of them the more stressed, never more than the maximum", () => {
    expect(stressDotCount(0)).toBe(0);
    expect(stressDotCount(-1)).toBe(0);
    expect(stressDotCount(NaN)).toBe(0);
    expect(stressDotCount(0.01)).toBe(1);
    expect(stressDotCount(0.5)).toBe(Math.ceil(0.5 * STRESS_DOTS));
    expect(stressDotCount(1)).toBe(STRESS_DOTS);
    expect(stressDotCount(5)).toBe(STRESS_DOTS);
  });

  it("draws one white circle per dot, inside the ellipse of the body", () => {
    const area = [10, 20, 30, 8];
    const html = markup(renderStressDots(1, area, 0));
    const circles = [...html.matchAll(/<circle/g)];
    // The template holds one circle per dot (the values are in the JSON part).
    expect(flat(renderStressDots(1, area, 0)).match(/#ffffff/g) || []).toBeTruthy();
    expect(circles.length + (JSON.stringify(renderStressDots(1, area, 0).values).match(/"strings"/g) || []).length).toBeGreaterThan(0);
    const dots = renderStressDots(1, area, 0).values[0];
    expect(dots).toHaveLength(STRESS_DOTS);
    for (const dot of dots) {
      const v = dot.values;
      const [x, y] = [Number(v[0]), Number(v[1])];
      expect(((x - 10) / 30) ** 2 + ((y - 20) / 8) ** 2).toBeLessThanOrEqual(1);
    }
  });

  it("is always laid out the same way for the same stress, and twinkles with the clock", () => {
    const a = JSON.stringify(renderStressDots(0.6, [0, 0, 20, 8], 1).values);
    const b = JSON.stringify(renderStressDots(0.6, [0, 0, 20, 8], 1).values);
    const later = JSON.stringify(renderStressDots(0.6, [0, 0, 20, 8], 1.4).values);
    expect(a).toBe(b);
    expect(later).not.toBe(a);
  });

  it("draws nothing at all when there is no stress", () => {
    expect(renderStressDots(0, [0, 0, 20, 8], 0).strings.join("").trim()).toBe("");
  });

  it("the outer dots go first as the stress fades", () => {
    const four = renderStressDots(4 / STRESS_DOTS, [0, 0, 20, 8], 0).values[0];
    const eight = renderStressDots(8 / STRESS_DOTS, [0, 0, 20, 8], 0).values[0];
    expect(four).toHaveLength(4);
    expect(eight).toHaveLength(8);
    expect(JSON.stringify(eight.slice(0, 4).map((d) => d.values.slice(0, 3)))).toBe(JSON.stringify(four.map((d) => d.values.slice(0, 3))));
  });

  it("are drawn over the body of a fish, in every look, and only when it is stressed", () => {
    for (const style of ["flat", "cartoon", "realistic"]) {
      const spec = fishSpec("freshwater", { species: 2, color: "#3b82f6" });
      expect(flat(drawFish(style, true, spec, 0, 0))).not.toContain("stress-dots");
      expect(flat(drawFish(style, true, spec, 0, 0, 0.8, 1))).toContain("stress-dots");
    }
  });
});

describe("the legs", () => {
  it("the legs of a walking creature follow the distance walked, at a rate that has a limit", () => {
    const c = { ...createInitialScene().shrimp, state: "moving", x: 600, targetX: 700, idleUntil: NOW + 1e9 };
    stepCrawler(c, frame(), SHRIMP_SPEC, constant(0.5));
    expect(c.walk).toBeCloseTo(SHRIMP_SPEC.speed * WALK.rate, 6);
    const fast = { ...createInitialScene().shrimp, state: "moving", x: 600, targetX: 700, idleUntil: NOW + 1e9, fleeUntil: NOW + 5000 };
    stepCrawler(fast, frame(), SHRIMP_SPEC, constant(0.5));
    expect(fast.walk).toBeCloseTo(Math.min(WALK.maxStep, SHRIMP_SPEC.speed * 6 * WALK.rate), 6);
    expect(fast.walk).toBeGreaterThan(c.walk);
  });

  it("the swing opens while it walks and closes when it stops", () => {
    const c = { ...createInitialScene().shrimp, state: "moving", x: 600, targetX: 10_000, idleUntil: NOW + 1e9 };
    for (let i = 0; i < 40; i++) stepCrawler(c, frame(), SHRIMP_SPEC, constant(0.5));
    expect(c.stride).toBeGreaterThan(0.95);
    c.state = "idle";
    c.idleUntil = NOW + 1e9;
    for (let i = 0; i < 60; i++) stepCrawler(c, frame(), SHRIMP_SPEC, constant(0.5));
    expect(c.stride).toBeLessThan(0.01);
    const before = c.walk;
    stepCrawler(c, frame(), SHRIMP_SPEC, constant(0.5));
    expect(c.walk).toBe(before);
  });

  it("the crab moves its legs along its route and rests them when it hides or stops", () => {
    const c = { ...createInitialScene().crab, s: 100, goalS: 400, state: "moving", idleUntil: NOW + 1e9 };
    for (let i = 0; i < 40; i++) stepCrab(c, frame(), constant(0.5));
    expect(c.walk).toBeGreaterThan(5);
    expect(c.stride).toBeGreaterThan(0.95);
    c.state = "idle";
    c.idleUntil = NOW + 1e9;
    for (let i = 0; i < 60; i++) stepCrab(c, frame(), constant(0.5));
    expect(c.stride).toBeLessThan(0.01);
  });

  it("the legs of the shrimp swing from their hips, and are the same at rest", () => {
    const rest = markup(shrimpRedrawn("flat", true, { phase: 1, stride: 0, time: 0 }));
    const resting = markup(shrimpRedrawn("flat", true));
    expect(rest).toBe(resting);
    const a = markup(shrimpRedrawn("flat", true, { phase: 0, stride: 1, time: 0 }));
    const b = markup(shrimpRedrawn("flat", true, { phase: 1.5, stride: 1, time: 0 }));
    expect(a).not.toBe(b);
    expect(a).toContain("rotate(");
  });

  it("the swimmerets under the abdomen flutter, even at rest", () => {
    expect(markup(shrimpRedrawn("flat", true, { time: 0 }))).not.toBe(markup(shrimpRedrawn("flat", true, { time: 0.5 })));
  });

  it("the legs of the crab move in opposition on its two sides, and its claws sway", () => {
    const html = (gait) => flat(crabRedrawn("flat", true, gait));
    expect(html({ phase: 0, stride: 0 })).toBe(html());
    expect(html({ phase: 0.7, stride: 1 })).not.toBe(html({ phase: 2.2, stride: 1 }));
    // Drawn into a real element, to read the angles it gives to its legs and claws.
    const angles = (gait) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      render(crabRedrawn("flat", true, gait), g);
      return [...g.querySelectorAll("g[transform^='rotate']")].map((el) => Number(el.getAttribute("transform").match(/rotate\(([-0-9.]+)/)[1]));
    };
    const walking = angles({ phase: 0.7, stride: 1 });
    // Four legs and a claw on each side.
    expect(walking).toHaveLength(10);
    const [left, right] = [walking.slice(0, 5), walking.slice(5)];
    expect(Math.max(...walking)).toBeGreaterThan(5);
    expect(Math.min(...walking)).toBeLessThan(-5);
    expect(Math.max(...walking.map(Math.abs))).toBeLessThanOrEqual(13);
    // The same leg on the other side swings the other way.
    expect(Math.sign(left[0])).toBe(-Math.sign(right[0]));
    expect(angles({ phase: 0.7, stride: 0 }).every((a) => a === 0)).toBe(true);
  });

  it("the legs are drawn in the three looks", () => {
    for (const style of ["flat", "cartoon", "realistic"]) {
      expect(flat(crabRedrawn(style, true, { phase: 1, stride: 1 }))).toContain("rotate(");
      expect(flat(shrimpRedrawn(style, true, { phase: 1, stride: 1 }))).toContain("rotate(");
    }
  });
});

describe("in the card", () => {
  const mount = async (config = {}) => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.v", theme: "saltwater", ...config });
    el.hass = { language: "en", states: { "sensor.v": { state: "12", last_changed: new Date().toISOString() } } };
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  };

  it("a knock stresses every animal that runs, and the fish near it more than the ones far away", async () => {
    const el = await mount();
    el._fishes.forEach((f, i) => Object.assign(f, { x: i === 0 ? 300 : 900, y: 300 }));
    el._crab.x = 400;
    el._knockAt(300, 300, el._tankState());
    const now = Date.now();
    expect(el._fishes[0].stressUntil).toBeGreaterThan(now);
    expect(el._fishes[0].stressPower).toBeGreaterThan(0.9);
    expect(el._fishes[1].stressUntil).toBeUndefined();
    for (const key of ["_ancistrus", "_shrimp", "_crab", "_goby"]) expect(el[key].stressUntil, key).toBeGreaterThan(now);
  });

  it("an animal too far from the knock is not stressed", async () => {
    const el = await mount();
    el._shrimp.x = 5000;
    el._goby.x = 5000;
    el._knockAt(100, 300, el._tankState());
    expect(el._shrimp.stressUntil).toBeUndefined();
    expect(el._goby.stressUntil).toBeUndefined();
  });

  it("the white dots are on the picture after a knock, and gone a few seconds later", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(1_700_000_000_000);
    const el = await mount();
    el._knockAt(500, 300, el._tankState());
    el._updatePhysics(1000);
    el._updatePhysics(1016);
    await el.updateComplete;
    const during = el.shadowRoot.querySelectorAll(".stress-dots").length;
    expect(during).toBeGreaterThanOrEqual(el._fishes.length);
    vi.setSystemTime(1_700_000_000_000 + STRESS_MS + 500);
    el._updatePhysics(5000);
    el._updatePhysics(5016);
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll(".stress-dots")).toHaveLength(0);
    vi.useRealTimers();
  });

  it("a dead animal shows no dots and keeps its legs still", async () => {
    const el = await mount();
    el._knockAt(500, 300, el._tankState());
    for (const key of ["_ancistrus", "_shrimp", "_crab", "_goby"]) el[key].stress = 1;
    el._crab.stride = 1;
    el._shrimp.stride = 1;
    el._fishes.forEach((f) => (f.stress = 1));
    el._cachedTemperature = 60;
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll(".stress-dots")).toHaveLength(0);
    expect(flat(el._renderCrab(true))).not.toContain("rotate(13");
    el._shrimp.walk = 1;
    expect(markup(el._renderShrimp(true))).toBe(markup(el._renderShrimp(true)));
    el._ancistrus.stress = 1;
    expect(markup(el._renderAncistrus(true))).not.toContain("stress-dots");
  });

  it("the Ancistrus of the freshwater tank shows the dots too", async () => {
    const el = await mount({ theme: "freshwater" });
    el._ancistrus.stress = 1;
    expect(markup(el._renderAncistrus(false))).toContain("stress-dots");
  });
});
