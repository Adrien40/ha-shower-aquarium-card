// @vitest-environment happy-dom
//
// Golden master of the whole per-frame simulation. Every scenario runs the
// card for a few hundred frames with a seeded random generator and a fake
// clock, then compares a snapshot of every creature, bubble and flake with
// the recorded one. It exists to prove that a refactoring of the physics did
// not change behaviour by a single pixel.
//
// When a behaviour change is intended, regenerate the recording with:
//   npm run golden:update
// and review the diff of src/golden/physics.json.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import "./shower-aquarium-card.js";

const GOLDEN_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "golden/physics.json");
const UPDATE = process.env.UPDATE_GOLDEN === "1";
const T0 = 1_700_000_000_000;

/** Small seeded generator (mulberry32) so runs are reproducible. */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (value) => (typeof value === "number" ? Math.round(value * 1e6) / 1e6 : value);
const roundAll = (object) =>
  Object.fromEntries(Object.entries(object).map(([k, v]) => [k, Array.isArray(v) ? v.map(round) : round(v)]));

function snapshot(el) {
  return {
    deathProgress: round(el._deathProgress),
    flowIntensity: round(el._flowIntensity),
    energy: round(el._energyKwh),
    fishes: el._fishes.map(roundAll),
    snails: el._snails.map(roundAll),
    ancistrus: roundAll(el._ancistrus),
    shrimp: roundAll(el._shrimp),
    crab: roundAll(el._crab),
    bubbles: el._bubbles.map(roundAll),
    boilingBubbles: el._boilingBubbles.map(roundAll),
    flowBubbles: el._flowBubbles.map(roundAll),
    food: el._food.map(roundAll),
    ripples: el._ripples.length,
    flow: roundAll({ ...el._flow }),
  };
}

/** FNV-1a hash of a string, as 8 hex digits: a compact fingerprint of a state. */
function fingerprint(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

const TRACE_EVERY = 20;

const hassWith = (volume, temp) => ({
  language: "en",
  states: {
    "sensor.shower_volume": { state: String(volume), last_changed: new Date(T0).toISOString() },
    "sensor.shower_temp": { state: String(temp), last_changed: new Date(T0).toISOString() },
  },
});

/**
 * @param {object} spec  config, volume, temp, frames, stepMs and optional
 *   `before(el)` / `atFrame: { [frame]: (el) => void }` hooks.
 */
function runScenario(spec) {
  const random = seeded(spec.seed ?? 1234);
  vi.spyOn(Math, "random").mockImplementation(random);
  vi.setSystemTime(T0);

  const Card = customElements.get("shower-aquarium-card");
  const el = new Card();
  el.setConfig({ entity: "sensor.shower_volume", temperature_entity: "sensor.shower_temp", fish_count: 6, ...spec.config });
  el.hass = hassWith(spec.volume ?? 5, spec.temp ?? 30);
  spec.before?.(el);

  // A fingerprint of the full state every TRACE_EVERY frames catches a
  // difference that happens in the middle of a run and disappears by the end
  // (eaten food, a finished shower...).
  const trace = [];
  const stepMs = spec.stepMs ?? 16.66;
  for (let frame = 0; frame < spec.frames; frame++) {
    vi.setSystemTime(T0 + Math.round(frame * stepMs));
    spec.atFrame?.[frame]?.(el);
    el._updatePhysics(1000 + frame * stepMs);
    if (frame % TRACE_EVERY === 0) trace.push(fingerprint(JSON.stringify(snapshot(el))));
  }
  return { trace, final: snapshot(el) };
}

const flakes = (x, y) =>
  Array.from({ length: 6 }, (_, i) => ({ x: x + i * 12, y: y + i, vy: 0.6, phase: i, r: 4, color: "#f59e0b", landedAt: 0, eaten: false }));

const SCENARIOS = {
  "freshwater, calm, 60 fps": { config: { theme: "freshwater" }, frames: 400 },
  "saltwater, calm, 60 fps": { config: { theme: "saltwater" }, frames: 400 },
  "coldwater, calm, 60 fps": { config: { theme: "coldwater" }, frames: 400 },
  "freshwater, boiling": { config: { theme: "freshwater" }, temp: 41, frames: 300 },
  "saltwater, dead by heat": { config: { theme: "saltwater" }, temp: 50, frames: 400 },
  "coldwater, drained tank": { config: { theme: "coldwater" }, volume: 60, frames: 200 },
  "freshwater, over budget": { config: { theme: "freshwater" }, volume: 55, frames: 300 },
  "freshwater, water level drops": {
    config: { theme: "freshwater" },
    frames: 300,
    atFrame: { 50: (el) => (el.hass = hassWith(40, 30)) },
  },
  "freshwater, fish food": {
    config: { theme: "freshwater" },
    frames: 400,
    atFrame: { 10: (el) => (el._food = flakes(400, 40)), 200: (el) => (el._food = flakes(700, 40)) },
  },
  "saltwater, knock on the glass": {
    config: { theme: "saltwater" },
    frames: 200,
    atFrame: {
      20: (el) =>
        el._fishes.forEach((f) => {
          f.kickX = 6;
          f.kickY = -2;
          f.scare = 0.75;
        }),
    },
  },
  "freshwater, shower running then finished": {
    config: { theme: "freshwater" },
    volume: 2,
    frames: 1000,
    atFrame: {
      5: (el) => (el.hass = hassWith(3, 32)),
      60: (el) => (el.hass = hassWith(6, 34)),
      120: (el) => (el.hass = hassWith(9, 34)),
    },
  },
  "freshwater, balanced profile (30 fps)": { config: { theme: "freshwater", animation_quality: "balanced" }, frames: 300, stepMs: 33.3 },
  "saltwater, light profile (20 fps)": { config: { theme: "saltwater", animation_quality: "light" }, frames: 300, stepMs: 50 },
  "fullscreen, coldwater": { config: { theme: "coldwater", fullscreen: true }, frames: 300 },
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  window.requestAnimationFrame = () => 1;
  window.cancelAnimationFrame = () => {};
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const recorded = existsSync(GOLDEN_PATH) ? JSON.parse(readFileSync(GOLDEN_PATH, "utf8")) : {};

describe("physics golden master", () => {
  it("has a recording for every scenario", () => {
    if (UPDATE) return;
    expect(Object.keys(recorded).sort()).toEqual(Object.keys(SCENARIOS).sort());
  });

  it.each(Object.keys(SCENARIOS))("%s", (name) => {
    const actual = JSON.parse(JSON.stringify(runScenario(SCENARIOS[name])));
    if (UPDATE) {
      recorded[name] = actual;
      writeFileSync(GOLDEN_PATH, JSON.stringify(recorded, null, 1) + "\n");
      return;
    }
    expect(actual).toEqual(recorded[name]);
  });

  it("is deterministic: two runs of the same scenario give the same snapshot", () => {
    const spec = SCENARIOS["saltwater, calm, 60 fps"];
    expect(runScenario(spec)).toEqual(runScenario(spec));
  });

  it("a different seed gives a different tank", () => {
    const spec = SCENARIOS["freshwater, calm, 60 fps"];
    expect(runScenario({ ...spec, seed: 1 })).not.toEqual(runScenario({ ...spec, seed: 2 }));
  });
});
