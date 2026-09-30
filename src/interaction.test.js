// @vitest-environment happy-dom
//
// Behaviour tests for everything that reacts to Home Assistant data or to the
// user: flow/energy tracking, fish food, knocking on the glass, the
// animation loop, the FPS overlay and the
// gauges. Time is controlled with fake Date so nothing depends on the clock.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "lit";
import "./shower-aquarium-card.js";
import {
  SENSOR_LOST_DELAY_MS,
  RIPPLE_DURATION_MS,
  estimateEnergyKwh,
  createFlakes,
} from "./pure.js";
import { CARD_VERSION } from "./version.js";

const T0 = 1_700_000_000_000;
const KWH_PER_L_PER_K = 4.186 / 3600;

let realRaf;
let realCaf;

beforeEach(() => {
  // A few tests pass invalid options on purpose; the corrections are logged.
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(T0);
  realRaf = window.requestAnimationFrame;
  realCaf = window.cancelAnimationFrame;
  let id = 0;
  window.requestAnimationFrame = () => ++id;
  window.cancelAnimationFrame = () => {};
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  window.requestAnimationFrame = realRaf;
  window.cancelAnimationFrame = realCaf;
  document.body.innerHTML = "";
});

const BASE_CONFIG = {
  entity: "sensor.shower_volume",
  temperature_entity: "sensor.shower_temp",
  theme: "freshwater",
  fish_count: 3,
  target_budget: 50,
  survival_volume: 10,
};

function hassWith(volume, temp, extra = {}) {
  const states = {
    "sensor.shower_volume": { state: String(volume), last_changed: new Date().toISOString() },
    ...extra,
  };
  if (temp !== undefined) {
    states["sensor.shower_temp"] = { state: String(temp), last_changed: new Date().toISOString() };
  }
  return { language: "en", states };
}

/** A card that is configured but not attached to the DOM (no animation loop). */
function makeCard(config = {}) {
  const Card = customElements.get("shower-aquarium-card");
  const el = new Card();
  el.setConfig({ ...BASE_CONFIG, ...config });
  return el;
}

function feed(el, volume, temp) {
  el.hass = hassWith(volume, temp);
}

/** A card mounted in the DOM and rendered once. */
async function mountCard(config = {}, volume = 12, temp) {
  const el = makeCard(config);
  feed(el, volume, temp);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const circleCount = (el) => el.shadowRoot.querySelectorAll("circle").length;
const ellipseCount = (el) => el.shadowRoot.querySelectorAll("ellipse").length;

// ---------------------------------------------------------------------------
describe("hass setter and _trackFlow()", () => {
  it("does not throw when hass arrives before the config", () => {
    const Card = customElements.get("shower-aquarium-card");
    const el = new Card();
    expect(() => {
      el.hass = hassWith(5);
    }).not.toThrow();
  });

  it("records the first sample without starting a shower", () => {
    const el = makeCard();
    feed(el, 10);
    expect(el._flow.lastVolume).toBe(10);
    expect(el._flow.showerActive).toBe(false);
  });

  it("marks a shower active as soon as the volume grows", () => {
    const el = makeCard();
    feed(el, 10);
    vi.setSystemTime(T0 + 2000);
    feed(el, 11);
    expect(el._flow.showerActive).toBe(true);
    expect(el._flow.lastIncreaseAt).toBe(T0 + 2000);
  });

  it("computes the heating energy of the very first sample from volume and temperature", () => {
    const el = makeCard();
    feed(el, 10, 40);
    expect(el._energyKwh).toBeCloseTo(10 * 25 * KWH_PER_L_PER_K, 6);
  });

  it("accumulates energy litre by litre at the temperature measured when the water flowed", () => {
    const el = makeCard();
    feed(el, 10, 40);
    feed(el, 20, 30);
    expect(el._energyKwh).toBeCloseTo((10 * 25 + 10 * 15) * KWH_PER_L_PER_K, 6);
  });

  it("does not add energy while the volume stays the same", () => {
    const el = makeCard();
    feed(el, 10, 40);
    const before = el._energyKwh;
    feed(el, 10, 45);
    expect(el._energyKwh).toBe(before);
  });

  it("restarts the energy count when the volume counter is reset (new shower)", () => {
    const el = makeCard();
    feed(el, 30, 40);
    feed(el, 5, 40);
    expect(el._energyKwh).toBeCloseTo(estimateEnergyKwh(5, 40, 15), 6);
    expect(el._flow.lastVolume).toBe(5);
  });

  it("uses cold_water_temp from the config", () => {
    const el = makeCard({ cold_water_temp: 5 });
    feed(el, 10, 40);
    expect(el._energyKwh).toBeCloseTo(10 * 35 * KWH_PER_L_PER_K, 6);
  });

  it("falls back to 15 degrees when cold_water_temp is not a number", () => {
    const el = makeCard({ cold_water_temp: "abc" });
    feed(el, 10, 40);
    expect(el._energyKwh).toBeCloseTo(10 * 25 * KWH_PER_L_PER_K, 6);
  });

  it("adds no energy when the water is not hotter than the cold water", () => {
    const el = makeCard();
    feed(el, 10, 10);
    expect(el._energyKwh).toBe(0);
  });

  it("ignores an unavailable sensor so a reconnect is not mistaken for a shower", () => {
    const el = makeCard();
    feed(el, 10, 40);
    const energy = el._energyKwh;
    el.hass = hassWith("unavailable", 40);
    expect(el._flow.lastVolume).toBe(10);
    expect(el._flow.showerActive).toBe(false);
    expect(el._energyKwh).toBe(energy);
  });

  it("keeps showing the last volume while the sensor is unavailable", () => {
    const el = makeCard();
    feed(el, 30, 20);
    el.hass = hassWith("unavailable", 20);
    expect(el._cachedConsumedVolume).toBe(30);
    el.hass = { language: "en", states: {} };
    expect(el._cachedConsumedVolume).toBe(30);
  });

  it("forgets the last volume when the card is given another configuration", () => {
    const el = makeCard();
    feed(el, 30, 20);
    el.setConfig({ ...BASE_CONFIG, entity: "sensor.other_volume" });
    expect(el._cachedConsumedVolume).toBe(0);
  });

  it("ignores a missing entity", () => {
    const el = makeCard();
    el.hass = { language: "en", states: {} };
    expect(el._flow.lastVolume).toBeNull();
  });

  it("clamps a negative volume to zero", () => {
    const el = makeCard();
    feed(el, -4);
    expect(el._cachedConsumedVolume).toBe(0);
  });
});

// ---------------------------------------------------------------------------
describe("_updatePhysics(): water flow", () => {
  it("raises the flow intensity and starts the bubble stream while water runs", () => {
    const el = makeCard();
    feed(el, 5);
    vi.setSystemTime(T0 + 1000);
    feed(el, 6);
    for (let i = 0; i < 12; i++) el._updatePhysics(1000 + i * 30);
    expect(el._flowIntensity).toBeGreaterThan(0.05);
    expect(el._flowBubbles.filter((b) => b.active).length).toBeGreaterThan(0);
  });

  it("brings the flow intensity back to exactly zero once the water has stopped", () => {
    const el = makeCard();
    el._flowIntensity = 0.004;
    el._flow = { lastVolume: 5, lastIncreaseAt: T0 - 60_000, target: 0.5, showerActive: false };
    el._updatePhysics(1000);
    expect(el._flowIntensity).toBe(0);
  });

  it("makes bubbles rise and switch off above the water surface", () => {
    const el = makeCard();
    const bubble = el._flowBubbles[0];
    Object.assign(bubble, { active: true, y: 20, vy: 5, baseX: 500, x: 500, phase: 0 });
    el._flowIntensity = 0.5;
    el._flow = { lastVolume: 5, lastIncreaseAt: T0, target: 0.5, showerActive: true };
    el._updatePhysics(1000);
    el._updatePhysics(1100);
    expect(bubble.active).toBe(false);
  });

  it("switches every flow bubble off and drops the flow when the tank is dead", () => {
    const el = makeCard();
    el._flowBubbles.forEach((b) => Object.assign(b, { active: true, y: 300, vy: 1, baseX: 500 }));
    el._flowIntensity = 0.8;
    el._cachedTemperature = 50;
    el._updatePhysics(1000);
    el._updatePhysics(1100);
    expect(el._flowBubbles.every((b) => !b.active)).toBe(true);
    expect(el._flowIntensity).toBeLessThan(0.8);
  });

  it("does not start any bubble when the tank is empty", () => {
    const el = makeCard();
    el._cachedConsumedVolume = 100;
    el._flowIntensity = 1;
    el._updatePhysics(1000);
    expect(el._flowBubbles.every((b) => !b.active)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
describe("_updatePhysics(): end of shower", () => {
  it("marks the shower as over once the flow has stopped", () => {
    const el = makeCard();
    el._cachedConsumedVolume = 10;
    el._flow = { lastVolume: 10, lastIncreaseAt: T0 - 9000, target: 0.5, showerActive: true };
    el._updatePhysics(1000);
    expect(el._flow.showerActive).toBe(false);
  });

  it("marks the shower as over whatever the volume or the tank state", () => {
    const el = makeCard();
    el._cachedConsumedVolume = 55;
    el._cachedTemperature = 50;
    el._flow = { lastVolume: 55, lastIncreaseAt: T0 - 9000, target: 0.5, showerActive: true };
    el._updatePhysics(1000);
    expect(el._flow.showerActive).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe("_updatePhysics(): ripples", () => {
  it("removes ripples older than RIPPLE_DURATION_MS and keeps fresh ones", () => {
    const el = makeCard();
    el._ripples = [
      { x: 1, y: 1, born: T0 - RIPPLE_DURATION_MS - 1 },
      { x: 2, y: 2, born: T0 - 10 },
    ];
    el._updatePhysics(1000);
    expect(el._ripples).toHaveLength(1);
    expect(el._ripples[0].x).toBe(2);
  });
});

// ---------------------------------------------------------------------------
describe("_updatePhysics(): fish food", () => {
  const flake = (over = {}) => ({ x: 500, y: 100, vy: 1, phase: 0, r: 4, color: "#f59e0b", landedAt: 0, eaten: false, ...over });

  it("makes flakes sink", () => {
    const el = makeCard();
    el._fishes = [];
    const f = flake();
    el._food = [f];
    el._updatePhysics(1000);
    el._updatePhysics(1016.66);
    expect(f.y).toBeGreaterThan(100);
  });

  it("never lets a flake rise above the water surface", () => {
    const el = makeCard();
    el._fishes = [];
    el._cachedConsumedVolume = 30; // surface well below y = 0
    const f = flake({ y: 5 });
    el._food = [f];
    el._updatePhysics(1000);
    el._updatePhysics(1016.66);
    expect(f.y).toBeGreaterThan(5);
  });

  it("lands a flake on the sand and stamps the landing time", () => {
    const el = makeCard();
    el._fishes = [];
    const f = flake({ y: 534.9, vy: 5 });
    el._food = [f];
    el._updatePhysics(1000);
    el._updatePhysics(1016.66);
    expect(f.y).toBe(535);
    expect(f.landedAt).toBe(T0);
  });

  it("does not move a flake that has already landed", () => {
    const el = makeCard();
    el._fishes = [];
    const f = flake({ y: 535, landedAt: T0 - 100 });
    el._food = [f];
    el._updatePhysics(1000);
    el._updatePhysics(1016.66);
    expect(f.y).toBe(535);
  });

  it("removes a flake 6 seconds after it landed, not before", () => {
    const el = makeCard();
    el._fishes = [];
    el._food = [flake({ y: 535, landedAt: T0 - 5900 })];
    el._updatePhysics(1000);
    expect(el._food).toHaveLength(1);
    el._food = [flake({ y: 535, landedAt: T0 - 6100 })];
    el._updatePhysics(1016);
    expect(el._food).toHaveLength(0);
  });

  it("removes eaten flakes", () => {
    const el = makeCard();
    el._fishes = [];
    el._food = [flake({ eaten: true }), flake()];
    el._updatePhysics(1000);
    expect(el._food).toHaveLength(1);
    expect(el._food[0].eaten).toBe(false);
  });

  it("clears all food when the tank is dead", () => {
    const el = makeCard();
    el._food = [flake()];
    el._cachedTemperature = 50;
    el._updatePhysics(1000);
    expect(el._food).toEqual([]);
  });

  it("clears all food when the tank is empty", () => {
    const el = makeCard();
    el._food = [flake()];
    el._cachedConsumedVolume = 60;
    el._updatePhysics(1000);
    expect(el._food).toEqual([]);
  });

  it("sends a fish toward the nearest flake and speeds it up", () => {
    const el = makeCard();
    const fish = { species: 0, x: 300, y: 300, vx: 1, vy: 0.4, dir: -1, scale: 1.4, scare: 0, deathProgress: 0 };
    el._fishes = [fish];
    // Two flakes in range: the nearer one is on the right.
    el._food = [flake({ x: 100, y: 300 }), flake({ x: 450, y: 300 })];
    el._updatePhysics(1000);
    el._updatePhysics(1016.66);
    expect(fish.dir).toBe(1);
    expect(fish._seeking).toBe(true);
    expect(fish.x).toBeGreaterThan(300);
  });

  it("turns a fish left when the flake is on its left", () => {
    const el = makeCard();
    const fish = { species: 0, x: 600, y: 300, vx: 1, vy: 0.4, dir: 1, scale: 1.4, scare: 0, deathProgress: 0 };
    el._fishes = [fish];
    el._food = [flake({ x: 400, y: 300 })];
    el._updatePhysics(1000);
    el._updatePhysics(1016.66);
    expect(fish.dir).toBe(-1);
  });

  it("restores the normal vertical speed once no flake is left to chase", () => {
    const el = makeCard();
    const fish = { species: 0, x: 300, y: 300, vx: 1, vy: 0.4, dir: 1, scale: 1.4, scare: 0, deathProgress: 0 };
    el._fishes = [fish];
    el._food = [flake({ x: 500, y: 100 })];
    el._updatePhysics(1000);
    expect(fish._seeking).toBe(true);
    el._food = [];
    el._updatePhysics(1016.66);
    expect(fish._seeking).toBe(false);
    expect(fish.vy).toBeCloseTo(0.4, 5);
  });

  it("ignores food while the fish is startled", () => {
    const el = makeCard();
    const fish = { species: 0, x: 300, y: 300, vx: 1, vy: 0.4, dir: -1, scale: 1.4, scare: 0.8, deathProgress: 0 };
    el._fishes = [fish];
    el._food = [flake({ x: 450, y: 300 })];
    el._updatePhysics(1000);
    expect(fish._seeking).toBeFalsy();
    expect(fish.dir).toBe(-1); // keeps swimming its own way
  });

  it("eats a flake that reaches its mouth", () => {
    const el = makeCard();
    const fish = { species: 0, x: 400, y: 300, vx: 0, vy: 0, dir: 1, scale: 1.4, scare: 0, deathProgress: 0 };
    el._fishes = [fish];
    const near = flake({ x: 400 + 22 * 1.4, y: 300 });
    const far = flake({ x: 800, y: 300 });
    el._food = [near, far];
    el._updatePhysics(1000);
    expect(near.eaten).toBe(true);
    expect(far.eaten).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe("_updatePhysics(): startled fish", () => {
  it("dashes away, then the impulse decays and the fish calms down", () => {
    const el = makeCard();
    const fish = { species: 0, x: 500, y: 300, vx: 0, vy: 0, dir: 1, scale: 1.4, scare: 1, kickX: 8, kickY: 0, deathProgress: 0 };
    el._fishes = [fish];
    el._updatePhysics(1000);
    el._updatePhysics(1016.66);
    expect(fish.x).toBeGreaterThan(500);
    expect(fish.scare).toBeGreaterThan(0);
    expect(fish.kickX).toBeLessThan(8);
    for (let i = 0; i < 120; i++) el._updatePhysics(1033 + i * 16.66);
    expect(fish.kickX).toBe(0);
    expect(fish.kickY).toBe(0);
    expect(fish.scare).toBe(0);
  });
});

// ---------------------------------------------------------------------------
describe("_eventToSvgPoint()", () => {
  const svgTarget = (ctm) => ({
    getScreenCTM: () => ctm,
    createSVGPoint: () => ({
      x: 0,
      y: 0,
      matrixTransform(m) {
        return { x: m.apply(this.x), y: m.apply(this.y) };
      },
    }),
  });

  it("converts client coordinates through the inverse screen matrix", () => {
    const el = makeCard();
    const ctm = { inverse: () => ({ apply: (v) => v / 2 }) };
    expect(el._eventToSvgPoint({ currentTarget: svgTarget(ctm), clientX: 200, clientY: 100 })).toEqual({ x: 100, y: 50 });
  });

  it("returns null when the element has no screen matrix", () => {
    const el = makeCard();
    expect(el._eventToSvgPoint({ currentTarget: svgTarget(null), clientX: 1, clientY: 1 })).toBeNull();
  });

  it("returns null when getScreenCTM does not exist", () => {
    const el = makeCard();
    expect(el._eventToSvgPoint({ currentTarget: {}, clientX: 1, clientY: 1 })).toBeNull();
  });
});

// ---------------------------------------------------------------------------
describe("_onTankTap()", () => {
  const tap = (el, x, y) => {
    el._eventToSvgPoint = () => ({ x, y });
    el._onTankTap({});
  };

  it("does nothing before the card has a config and hass", () => {
    const Card = customElements.get("shower-aquarium-card");
    const el = new Card();
    expect(() => el._onTankTap({})).not.toThrow();
    expect(el._food).toEqual([]);
  });

  it("does nothing when the click cannot be converted to SVG coordinates", () => {
    const el = makeCard();
    feed(el, 0);
    el._eventToSvgPoint = () => null;
    el._onTankTap({});
    expect(el._food).toEqual([]);
    expect(el._ripples).toEqual([]);
  });

  it("does nothing when the tank is dead", () => {
    const el = makeCard();
    feed(el, 0, 50);
    tap(el, 500, 300);
    expect(el._ripples).toEqual([]);
    expect(el._food).toEqual([]);
  });

  it("does nothing when the tank is empty", () => {
    const el = makeCard();
    feed(el, 60);
    tap(el, 500, 300);
    expect(el._ripples).toEqual([]);
  });

  it("drops fish food when tapping near the surface", () => {
    const el = makeCard();
    feed(el, 0);
    tap(el, 500, 20);
    expect(el._food).toHaveLength(6);
    expect(el._ripples).toEqual([]);
  });

  it("keeps dropped food inside the tank horizontally", () => {
    const el = makeCard();
    feed(el, 0);
    tap(el, 0, 20);
    const left = Math.min(...el._food.map((f) => f.x));
    el._food = [];
    tap(el, 1024, 20);
    const right = Math.max(...el._food.map((f) => f.x));
    expect(left).toBeGreaterThan(80 - 40);
    expect(right).toBeLessThan(944 + 40);
  });

  it("keeps at most 30 flakes in the water", () => {
    const el = makeCard();
    feed(el, 0);
    for (let i = 0; i < 10; i++) tap(el, 500, 20);
    expect(el._food).toHaveLength(30);
  });

  it("knocks on the glass when tapping deeper in the water: a ripple is drawn", () => {
    const el = makeCard();
    feed(el, 0);
    tap(el, 500, 300);
    expect(el._ripples).toHaveLength(1);
    expect(el._ripples[0]).toMatchObject({ x: 500, y: 300, born: T0 });
    expect(el._food).toEqual([]);
  });

  it("startles fish inside the radius and leaves distant fish alone", () => {
    const el = makeCard();
    feed(el, 0);
    const near = { x: 450, y: 300, dir: 1, scare: 0, deathProgress: 0 };
    const far = { x: 950, y: 100, dir: 1, scale: 1.4, scare: 0, deathProgress: 0 };
    el._fishes = [near, far];
    tap(el, 500, 300);
    expect(near.kickX).toBeLessThan(0);
    expect(near.scare).toBeGreaterThan(0);
    expect(near.dir).toBe(-1);
    expect(far.kickX).toBeUndefined();
    expect(far.scare).toBe(0);
  });

  it("turns a startled fish away from the knock", () => {
    const el = makeCard();
    feed(el, 0);
    const fish = { x: 550, y: 300, dir: -1, scare: 0, deathProgress: 0 };
    el._fishes = [fish];
    tap(el, 500, 300);
    expect(fish.dir).toBe(1);
  });

  it("works when the fish list has been cleared", () => {
    const el = makeCard();
    feed(el, 0);
    el._fishes = null;
    expect(() => tap(el, 500, 300)).not.toThrow();
  });

  it("requests a re-render", () => {
    const el = makeCard();
    feed(el, 0);
    const spy = vi.spyOn(el, "requestUpdate");
    tap(el, 500, 300);
    expect(spy).toHaveBeenCalled();
  });

  it("a real click on the rendered SVG reaches _onTankTap()", async () => {
    const el = await mountCard({}, 0);
    const spy = vi.spyOn(el, "_onTankTap").mockImplementation(() => {});
    el.shadowRoot.querySelector("svg").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
describe("animation loop", () => {
  function captureRaf() {
    const queue = [];
    window.requestAnimationFrame = (cb) => {
      queue.push(cb);
      return queue.length;
    };
    window.cancelAnimationFrame = vi.fn();
    return { queue, run: (ts) => queue.shift()(ts) };
  }

  it("starts a single loop even if connected twice", () => {
    const { queue } = captureRaf();
    const el = makeCard();
    el._startAnimation();
    el._startAnimation();
    expect(queue).toHaveLength(1);
  });

  it("cancels the pending frame and can restart after disconnect", () => {
    const raf = captureRaf();
    const el = makeCard();
    document.body.appendChild(el);
    expect(el._animationFrameId).toBe(1);
    el.remove();
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(el._animationFrameId).toBeNull();
    document.body.appendChild(el);
    expect(raf.queue.length).toBeGreaterThan(0);
    expect(el._animationFrameId).not.toBeNull();
  });

  it("stopping when nothing is running is harmless", () => {
    window.cancelAnimationFrame = vi.fn();
    const el = makeCard();
    expect(() => el._stopAnimation()).not.toThrow();
    expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
  });

  it("draws every display frame in the max profile", () => {
    const { run } = captureRaf();
    const el = makeCard({ animation_quality: "max" });
    const spy = vi.spyOn(el, "_updatePhysics").mockImplementation(() => {});
    el._startAnimation();
    [1000, 1010, 1020].forEach(run);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it("skips display frames to honour the 20 fps cap of the light profile", () => {
    const { run } = captureRaf();
    const el = makeCard({ animation_quality: "light" });
    const spy = vi.spyOn(el, "_updatePhysics").mockImplementation(() => {});
    el._startAnimation();
    [1000, 1010, 1060].forEach(run);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(el._rafCount).toBe(3);
    expect(el._tickCount).toBe(2);
  });

  it("an unknown animation_quality behaves like max", () => {
    const el = makeCard({ animation_quality: "turbo" });
    expect(el._profile.fps).toBe(0);
  });
});

// ---------------------------------------------------------------------------
describe("FPS debug overlay", () => {
  it("does not publish a measurement before one second has elapsed", () => {
    const el = makeCard({ show_fps: true });
    el._sampleFps(1000);
    el._sampleFps(1500);
    expect(el._fpsInfo).toBe("");
  });

  it("publishes display and drawn frame rates once per second, then restarts the window", () => {
    const el = makeCard({ show_fps: true, animation_quality: "balanced" });
    el._rafCount = 60;
    el._tickCount = 30;
    el._sampleFps(1000);
    el._rafCount = 60;
    el._tickCount = 30;
    const spy = vi.spyOn(el, "requestUpdate");
    el._sampleFps(2000);
    expect(el._fpsInfo).toContain(`v${CARD_VERSION}`);
    expect(el._fpsInfo).toContain("balanced");
    expect(el._fpsInfo).toContain("display 60/s");
    expect(el._fpsInfo).toContain("drawn 30/s");
    expect(el._rafCount).toBe(0);
    expect(el._tickCount).toBe(0);
    expect(spy).toHaveBeenCalled();
  });

  it("reports the max profile when no quality is configured", () => {
    const el = makeCard({ show_fps: true });
    el._config.animation_quality = "";
    el._sampleFps(1000);
    el._sampleFps(2000);
    expect(el._fpsInfo).toContain("max");
  });

  it("is sampled from the animation loop only when show_fps is on", () => {
    const queue = [];
    window.requestAnimationFrame = (cb) => queue.push(cb);
    const on = makeCard({ show_fps: true });
    const off = makeCard({ show_fps: false });
    const spyOn = vi.spyOn(on, "_sampleFps");
    const spyOff = vi.spyOn(off, "_sampleFps");
    vi.spyOn(on, "_updatePhysics").mockImplementation(() => {});
    vi.spyOn(off, "_updatePhysics").mockImplementation(() => {});
    on._startAnimation();
    off._startAnimation();
    queue[0](1000);
    queue[1](1000);
    expect(spyOn).toHaveBeenCalled();
    expect(spyOff).not.toHaveBeenCalled();
  });

  it("shows the badge in the SVG when enabled and a measurement exists", async () => {
    const el = await mountCard({ show_fps: true });
    el._fpsInfo = "v9.9.9 · max · display 60/s · drawn 60/s";
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("display 60/s");
  });

  it("hides the badge when disabled, even if a measurement exists", async () => {
    const el = await mountCard({ show_fps: false });
    el._fpsInfo = "v9.9.9 · max · display 60/s · drawn 60/s";
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot.textContent).not.toContain("display 60/s");
  });

  it("hides the badge when enabled but nothing has been measured yet", async () => {
    const el = await mountCard({ show_fps: true });
    expect(el.shadowRoot.textContent).not.toContain("display");
  });
});

// ---------------------------------------------------------------------------
describe("render(): transient effects", () => {
  it("draws flakes as ellipses", async () => {
    const el = await mountCard({}, 0);
    const before = ellipseCount(el);
    el._food = createFlakes(500, 100, 4, () => 0.5);
    el.requestUpdate();
    await el.updateComplete;
    expect(ellipseCount(el) - before).toBe(4);
  });

  it("draws one ring per ripple in the light profile and two in the max profile", async () => {
    const light = await mountCard({ animation_quality: "light" }, 0);
    const lightBefore = circleCount(light);
    light._ripples = [{ x: 100, y: 200, born: Date.now() }];
    light.requestUpdate();
    await light.updateComplete;
    expect(circleCount(light) - lightBefore).toBe(1);

    const max = await mountCard({ animation_quality: "max" }, 0);
    const maxBefore = circleCount(max);
    max._ripples = [{ x: 100, y: 200, born: Date.now() }];
    max.requestUpdate();
    await max.updateComplete;
    expect(circleCount(max) - maxBefore).toBe(2);
  });

  it("draws the water only while there is water left", async () => {
    const full = await mountCard({}, 12);
    expect(full.shadowRoot.innerHTML).toContain('fill="url(#waterGrad)"');
    const empty = await mountCard({}, 60);
    expect(empty.shadowRoot.innerHTML).not.toContain('fill="url(#waterGrad)"');
  });

  it("makes the surface choppier while water runs", () => {
    const el = makeCard();
    const calm = JSON.stringify(el._renderWaterSurface(0, 1024, 100).values);
    el._flowIntensity = 1;
    const choppy = JSON.stringify(el._renderWaterSurface(0, 1024, 100).values);
    expect(choppy).not.toBe(calm);
  });

  it("uses fewer surface points in the light profile", () => {
    const rich = makeCard({ animation_quality: "max" });
    const light = makeCard({ animation_quality: "light" });
    const points = (el) => el._renderWaterSurface(0, 1024, 100).values[0].split(" L ").length;
    expect(points(light)).toBeLessThan(points(rich));
  });
});

// ---------------------------------------------------------------------------
describe("sensor unavailable notice", () => {
  const lostStates = (state = "unavailable") => ({
    language: "en",
    states: { "sensor.shower_volume": { state, last_changed: new Date().toISOString() } },
  });
  const badgeText = (el) => el.shadowRoot.textContent;

  beforeEach(() => {
    vi.useRealTimers();
    vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] });
    vi.setSystemTime(T0);
  });

  it("stays hidden while the sensor is fine", async () => {
    const el = await mountCard({}, 12);
    expect(badgeText(el)).not.toContain("Sensor unavailable");
    expect(el._sensorLost).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not appear at once: Home Assistant may still be starting", async () => {
    const el = await mountCard({}, 12);
    el.hass = lostStates();
    await el.updateComplete;
    expect(el._sensorLost).toBe(false);
    expect(badgeText(el)).not.toContain("Sensor unavailable");
    vi.advanceTimersByTime(SENSOR_LOST_DELAY_MS - 1000);
    await el.updateComplete;
    expect(badgeText(el)).not.toContain("Sensor unavailable");
  });

  it("appears after one minute without a usable value, on its own", async () => {
    const el = await mountCard({}, 12);
    el.hass = lostStates();
    vi.advanceTimersByTime(SENSOR_LOST_DELAY_MS);
    await el.updateComplete;
    expect(el._sensorLost).toBe(true);
    expect(badgeText(el)).toContain("Sensor unavailable");
    expect(el.shadowRoot.querySelector("svg").getAttribute("aria-label")).toContain("Sensor unavailable.");
  });

  it("keeps the last volume on screen while it is shown", async () => {
    const el = await mountCard({ fullscreen: true }, 12, 38);
    el.hass = lostStates("unknown");
    vi.advanceTimersByTime(SENSOR_LOST_DELAY_MS);
    await el.updateComplete;
    expect(badgeText(el)).toContain("12.0");
    expect(badgeText(el)).toContain("Sensor unavailable");
  });

  it("is written in the language of Home Assistant", async () => {
    const el = await mountCard({}, 12);
    el.hass = { ...lostStates(), language: "fr" };
    vi.advanceTimersByTime(SENSOR_LOST_DELAY_MS);
    await el.updateComplete;
    expect(badgeText(el)).toContain("Capteur indisponible");
  });

  it("goes away as soon as the sensor has a value again, and the timer is cleared", async () => {
    const el = await mountCard({}, 12);
    el.hass = lostStates();
    vi.advanceTimersByTime(SENSOR_LOST_DELAY_MS);
    await el.updateComplete;
    expect(badgeText(el)).toContain("Sensor unavailable");
    el.hass = hassWith(15);
    await el.updateComplete;
    expect(el._sensorLostSince).toBeNull();
    expect(badgeText(el)).not.toContain("Sensor unavailable");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("recovering before the delay never shows it, and cancels the wait", async () => {
    const el = await mountCard({}, 12);
    el.hass = lostStates();
    expect(vi.getTimerCount()).toBe(1);
    el.hass = hassWith(12);
    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(SENSOR_LOST_DELAY_MS * 2);
    await el.updateComplete;
    expect(badgeText(el)).not.toContain("Sensor unavailable");
  });

  it("counts from the first unusable state, not from each new one", async () => {
    const el = await mountCard({}, 12);
    el.hass = lostStates();
    vi.advanceTimersByTime(40_000);
    el.hass = lostStates("unknown");
    expect(el._sensorLostSince).toBe(T0);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(20_000);
    await el.updateComplete;
    expect(el._sensorLost).toBe(true);
  });

  it("a card that is not on the page sets no timer", () => {
    const el = makeCard();
    el.hass = lostStates();
    expect(el._sensorLostSince).toBe(T0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("removing the card cancels the wait, and putting it back resumes it", async () => {
    const el = await mountCard({}, 12);
    el.hass = lostStates();
    expect(vi.getTimerCount()).toBe(1);
    el.remove();
    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(30_000);
    document.body.appendChild(el);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(30_000);
    await el.updateComplete;
    expect(el._sensorLost).toBe(true);
  });

  it("putting a fine card back on the page starts no timer", async () => {
    const el = await mountCard({}, 12);
    el.remove();
    document.body.appendChild(el);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("a new configuration forgets the loss", async () => {
    const el = await mountCard({}, 12);
    el.hass = lostStates();
    el.setConfig({ ...BASE_CONFIG, entity: "sensor.other_volume" });
    expect(el._sensorLostSince).toBe(T0);
    el.setConfig({ ...BASE_CONFIG });
    el.hass = hassWith(12);
    expect(el._sensorLostSince).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("a sensor that never existed is reported too", async () => {
    const el = await mountCard({ entity: "sensor.typo" }, 12);
    vi.advanceTimersByTime(SENSOR_LOST_DELAY_MS);
    await el.updateComplete;
    expect(badgeText(el)).toContain("Sensor unavailable");
  });

  it("sits under the FPS badge when show_fps is on (normal mode)", async () => {
    const el = await mountCard({ show_fps: true }, 12);
    el.hass = lostStates();
    vi.advanceTimersByTime(SENSOR_LOST_DELAY_MS);
    await el.updateComplete;
    expect(el.shadowRoot.innerHTML).toContain("translate(0, 62)");
  });
});

describe("fullscreen readings appear with the first litre", () => {
  const readings = (el) => el.shadowRoot.textContent.replace(/\s+/g, " ");
  const gaugeShapes = (el) => el.shadowRoot.querySelectorAll('rect[rx="9"], rect[height="9"], [stroke-dasharray]').length;

  it.each(["thermometer", "arc"])("%s style: no gauge and no cost while nothing was consumed", async (gauge_style) => {
    const el = await mountCard({ fullscreen: true, gauge_style, show_cost: true }, 0, 0);
    expect(gaugeShapes(el)).toBe(0);
    expect(readings(el)).not.toContain("0.0");
    expect(readings(el)).not.toContain("€");
    expect(readings(el)).not.toContain("°");
  });

  it.each(["thermometer", "arc"])("%s style: the gauges and the cost appear from the first litre", async (gauge_style) => {
    const el = await mountCard({ fullscreen: true, gauge_style, show_cost: true }, 0.5, 36);
    expect(gaugeShapes(el)).toBeGreaterThan(0);
    expect(readings(el)).toContain("0.5");
    expect(readings(el)).toContain("36.0°");
    expect(readings(el)).toContain("€");
  });

  it("a temperature without any consumption does not make the thermometer appear", async () => {
    const el = await mountCard({ fullscreen: true }, 0, 36);
    expect(gaugeShapes(el)).toBe(0);
    expect(el._lastTemperature).toBe(0);
  });

  it("the thermometer keeps the last temperature when the sensor falls back to 0 after the shower", async () => {
    const el = await mountCard({ fullscreen: true }, 12, 38.5);
    feed(el, 12, 0);
    await el.updateComplete;
    expect(readings(el)).toContain("38.5°");
    expect(readings(el)).toContain("12.0");
    expect(el._cachedTemperature).toBe(0);
  });

  it("the remembered temperature is only for the display: the tank still sees no temperature", async () => {
    const el = await mountCard({ fullscreen: true }, 12, 38.5);
    feed(el, 12, 0);
    await el.updateComplete;
    expect(el._tankState().currentTemp).toBe(0);
    expect(el.shadowRoot.querySelector("svg").getAttribute("aria-label")).not.toContain("38.5");
  });

  it("everything disappears again, and the memory is wiped, when the counter goes back to 0", async () => {
    const el = await mountCard({ fullscreen: true, show_cost: true }, 12, 38.5);
    feed(el, 0, 0);
    await el.updateComplete;
    expect(gaugeShapes(el)).toBe(0);
    expect(readings(el)).not.toContain("€");
    expect(el._lastTemperature).toBe(0);
    feed(el, 3, 0);
    await el.updateComplete;
    expect(readings(el)).toContain("3.0");
    expect(readings(el)).not.toContain("°");
  });

  it("without a temperature ever seen, only the volume is shown", async () => {
    const el = await mountCard({ fullscreen: true, temperature_entity: "" }, 12);
    expect(readings(el)).toContain("12.0");
    expect(readings(el)).not.toContain("°");
  });

  it("a new configuration forgets the remembered temperature", async () => {
    const el = await mountCard({ fullscreen: true }, 12, 38.5);
    expect(el._lastTemperature).toBe(38.5);
    el.setConfig({ ...BASE_CONFIG, fullscreen: true, entity: "sensor.other_volume" });
    expect(el._lastTemperature).toBe(0);
  });

  it("the normal mode is not affected: the tiles keep showing 0.0 L", async () => {
    const el = await mountCard({}, 0, 0);
    expect(readings(el)).toContain("0.0");
  });

  it("the sensor notice goes to the top when there is no row of numbers to sit under", async () => {
    vi.useRealTimers();
    vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] });
    vi.setSystemTime(T0);
    const el = await mountCard({ fullscreen: true }, 0, 0);
    el.hass = { language: "en", states: { "sensor.shower_volume": { state: "unavailable", last_changed: new Date().toISOString() } } };
    vi.advanceTimersByTime(SENSOR_LOST_DELAY_MS);
    await el.updateComplete;
    expect(el.shadowRoot.innerHTML).toContain("translate(0, 24)");
    expect(el.shadowRoot.innerHTML).not.toContain("translate(0, 112)");
  });
});

describe("render(): gauges and metric tiles", () => {
  it("shows the temperature and volume gauges in fullscreen", async () => {
    const el = await mountCard({ fullscreen: true }, 12, 38.5);
    const text = el.shadowRoot.textContent;
    expect(text).toContain("38.5°");
    expect(text).toContain("12.0");
  });

  it("hides the temperature gauge when no temperature is available", async () => {
    const el = await mountCard({ fullscreen: true, temperature_entity: "" }, 12);
    const text = el.shadowRoot.textContent;
    expect(text).not.toContain("°");
    expect(text).toContain("12.0");
  });

  describe("gauge styles in fullscreen", () => {
    it("the thermometer style is the default: glass tube, liquid, three notches, no arc", async () => {
      const el = await mountCard({ fullscreen: true }, 12, 38.5);
      const root = el.shadowRoot;
      expect(el._config.gauge_style).toBe("thermometer");
      expect(root.querySelector('rect[rx="9"]')).not.toBeNull();
      const notches = [...root.querySelectorAll('line[stroke-width="3.5"]')].map((l) => l.getAttribute("stroke"));
      expect(notches).toEqual(["#16a34a", "#f97316", "#ef4444"]);
      expect(root.querySelectorAll("[stroke-dasharray]")).toHaveLength(0);
    });

    it("the thermometer is not taller than 160 units, the height of a corner gauge", async () => {
      const el = await mountCard({ fullscreen: true }, 12, 38.5);
      const bulb = el.shadowRoot.querySelector('circle[cx="62"][r="17"]');
      const tube = el.shadowRoot.querySelector('rect[rx="9"]');
      expect(Number(bulb.getAttribute("cy")) + Number(bulb.getAttribute("r"))).toBeLessThanOrEqual(160);
      expect(Number(tube.getAttribute("y"))).toBeGreaterThanOrEqual(25);
    });

    it("the numbers of the thermometer style keep their light outline", async () => {
      const el = await mountCard({ fullscreen: true }, 12, 38.5);
      const outlined = [...el.shadowRoot.querySelectorAll('text[paint-order="stroke"]')].map((t) => t.textContent);
      expect(outlined.join(" ")).toContain("38.5°");
      expect(outlined.join(" ")).toContain("12.0");
    });

    it("the liquid follows the zone: blue when cold, green when comfortable, orange when hot, red when deadly", async () => {
      for (const [temp, colour] of [[20, "#0284c7"], [36, "#16a34a"], [41, "#f97316"], [47, "#ef4444"]]) {
        const el = await mountCard({ fullscreen: true }, 5, temp);
        expect(el.shadowRoot.querySelector('circle[r="13"]').getAttribute("fill"), `${temp} degrees`).toBe(colour);
      }
    });

    it("the comfort minimum can come from an entity", async () => {
      const el = makeCard({ fullscreen: true, comfort_temp_entity: "sensor.comfort" });
      el.hass = hassWith(5, 36, { "sensor.comfort": { state: "37" } });
      document.body.appendChild(el);
      await el.updateComplete;
      expect(el._cachedComfortMin).toBe(37);
      expect(el.shadowRoot.querySelector('circle[r="13"]').getAttribute("fill")).toBe("#0284c7");
    });

    it("the volume is a number over a bar filled up to the budget", async () => {
      const el = await mountCard({ fullscreen: true, target_budget: 50 }, 25, 38);
      expect(el.shadowRoot.textContent).toContain("25.0");
      const bars = el.shadowRoot.querySelectorAll('rect[height="9"]');
      expect(bars).toHaveLength(2);
      expect(bars[1].getAttribute("width")).toBe("85.0");
    });

    it("writes the budget after the volume only when show_budget is on", async () => {
      const off = await mountCard({ fullscreen: true, target_budget: 50 }, 18, 38);
      expect(off.shadowRoot.textContent.replace(/\s+/g, " ")).not.toContain("/ 50");
      const on = await mountCard({ fullscreen: true, target_budget: 50, show_budget: true }, 18, 38);
      expect(on.shadowRoot.textContent.replace(/\s+/g, " ")).toContain("/ 50");
      const decimal = await mountCard({ fullscreen: true, target_budget: 42.5, show_budget: true }, 18, 38);
      expect(decimal.shadowRoot.textContent.replace(/\s+/g, " ")).toContain("/ 42.5");
    });

    it("the arc style draws two open arcs with a marker dot and the same numbers", async () => {
      const el = await mountCard({ fullscreen: true, gauge_style: "arc" }, 12, 38.5);
      expect(el.shadowRoot.querySelectorAll("[stroke-dasharray]")).toHaveLength(4);
      expect(el.shadowRoot.querySelectorAll('circle[r="8"]')).toHaveLength(2);
      expect(el.shadowRoot.textContent).toContain("38.5°");
      expect(el.shadowRoot.textContent).toContain("12.0");
    });

    it("the arc style has the same three notches as the thermometer, on the temperature arc only", async () => {
      const el = await mountCard({ fullscreen: true, gauge_style: "arc" }, 12, 38.5);
      const notches = [...el.shadowRoot.querySelectorAll('line[stroke-width="3.5"]')].map((l) => l.getAttribute("stroke"));
      expect(notches).toEqual(["#16a34a", "#f97316", "#ef4444"]);
    });

    it("the notches of the arc follow the scale: each one sits further along the arc", async () => {
      const el = await mountCard({ fullscreen: true, gauge_style: "arc" }, 12, 38.5);
      const lines = [...el.shadowRoot.querySelectorAll('line[stroke-width="3.5"]')];
      const angle = (l) => (Math.atan2(Number(l.getAttribute("y1")), Number(l.getAttribute("x1"))) * 180) / Math.PI;
      const turn = (l) => (angle(l) + 360 - 135) % 360; // degrees along the arc, from its start
      const [comfort, boil, deadly] = lines.map(turn);
      expect(comfort).toBeCloseTo(0.575 * 270, 0);
      expect(boil).toBeCloseTo(0.75 * 270, 0);
      expect(deadly).toBeCloseTo(0.875 * 270, 0);
    });

    it("the arc style writes the budget under the volume when show_budget is on", async () => {
      const off = await mountCard({ fullscreen: true, gauge_style: "arc", target_budget: 50 }, 18, 38);
      expect(off.shadowRoot.textContent).not.toContain("/ 50");
      const on = await mountCard({ fullscreen: true, gauge_style: "arc", target_budget: 50, show_budget: true }, 18, 38);
      expect(on.shadowRoot.textContent).toContain("/ 50 L");
      expect(on.shadowRoot.textContent).toContain("18.0");
    });

    it("both styles hide the temperature gauge when no temperature is available", async () => {
      for (const gauge_style of ["thermometer", "arc"]) {
        const el = await mountCard({ fullscreen: true, gauge_style, temperature_entity: "" }, 12);
        expect(el.shadowRoot.textContent, gauge_style).not.toContain("°");
        expect(el.shadowRoot.textContent, gauge_style).toContain("12.0");
      }
    });

    it("writes the numbers with the decimal separator of the language", async () => {
      for (const gauge_style of ["thermometer", "arc"]) {
        const el = makeCard({ fullscreen: true, gauge_style, show_budget: true, target_budget: 42.5 });
        el.hass = { ...hassWith(12, 38.5), language: "fr" };
        document.body.appendChild(el);
        await el.updateComplete;
        const text = el.shadowRoot.textContent.replace(/\s+/g, " ");
        expect(text, gauge_style).toContain("38,5°");
        expect(text, gauge_style).toContain("12,0");
        expect(text, gauge_style).toContain("/ 42,5");
        expect(text, gauge_style).not.toContain("38.5");
      }
    });

    it("the arc style without the budget writes the volume with the separator too", async () => {
      const el = makeCard({ fullscreen: true, gauge_style: "arc" });
      el.hass = { ...hassWith(12, 38.5), language: "fr" };
      document.body.appendChild(el);
      await el.updateComplete;
      expect(el.shadowRoot.textContent).toContain("12,0");
    });

    it("an unknown gauge_style falls back to the thermometer", async () => {
      const el = await mountCard({ fullscreen: true, gauge_style: "round" }, 12, 38);
      expect(el._config.gauge_style).toBe("thermometer");
      expect(el.shadowRoot.querySelectorAll("[stroke-dasharray]")).toHaveLength(0);
    });
  });

  it("does not render the metric tiles in fullscreen", async () => {
    const el = await mountCard({ fullscreen: true }, 12, 30);
    expect(el.shadowRoot.querySelector(".metrics-grid")).toBeNull();
  });

  it("shows consumed, remaining and target tiles", async () => {
    const el = await mountCard({ target_budget: 50 }, 12);
    const tiles = [...el.shadowRoot.querySelectorAll(".metric-box")].map((t) => t.textContent.replace(/\s+/g, " ").trim());
    expect(tiles).toHaveLength(3);
    expect(tiles[0]).toContain("12.0");
    expect(tiles[0]).toContain("Consumed");
    expect(tiles[1]).toContain("38.0");
    expect(tiles[1]).toContain("Remaining");
    expect(tiles[2]).toContain("50");
    expect(tiles[2]).toContain("Target");
  });

  it("writes the tiles with the decimal separator of the language", async () => {
    const el = makeCard({ target_budget: 42.5 });
    el.hass = { ...hassWith(12, 38.5), language: "fr" };
    document.body.appendChild(el);
    await el.updateComplete;
    const tiles = [...el.shadowRoot.querySelectorAll(".metric-box")].map((t) => t.textContent.replace(/\s+/g, " ").trim());
    expect(tiles[0]).toContain("12,0");
    expect(tiles[1]).toContain("30,5");
    expect(tiles[2]).toContain("42,5");
    expect(tiles[3]).toContain("38,5");
  });

  it("never shows a negative remaining volume", async () => {
    const el = await mountCard({ target_budget: 50 }, 58);
    const remaining = el.shadowRoot.querySelectorAll(".metric-box")[1].textContent;
    expect(remaining).toContain("0.0");
    expect(remaining).not.toContain("-");
  });

  it("adds a temperature tile only when a temperature is known", async () => {
    const without = await mountCard({}, 12);
    expect(without.shadowRoot.querySelectorAll(".metric-box")).toHaveLength(3);
    const withTemp = await mountCard({}, 12, 36);
    expect(withTemp.shadowRoot.querySelectorAll(".metric-box")).toHaveLength(4);
    expect(withTemp.shadowRoot.textContent).toContain("Temperature");
  });

  it.each([
    [36, "var(--primary-text-color"],
    [41, "#f59e0b"],
    [46, "#ef4444"],
  ])("colours a %s°C temperature tile with %s", async (temp, colour) => {
    const el = await mountCard({}, 12, temp);
    const style = el.shadowRoot.querySelectorAll(".metric-box")[3].querySelector(".metric-value").getAttribute("style");
    expect(style).toContain(colour);
  });

  it("takes the target budget from target_budget_entity when it is available", async () => {
    const el = makeCard({ target_budget_entity: "input_number.budget" });
    el.hass = hassWith(12, undefined, { "input_number.budget": { state: "80" } });
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll(".metric-box")[2].textContent).toContain("80");
  });

  it("keeps the configured budget when target_budget_entity is unavailable", async () => {
    const el = makeCard({ target_budget_entity: "input_number.budget", target_budget: 42 });
    el.hass = hassWith(12, undefined, { "input_number.budget": { state: "unavailable" } });
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll(".metric-box")[2].textContent).toContain("42");
  });

  it.each(["0", "-10"])("keeps the configured budget when target_budget_entity says %s", async (state) => {
    const el = makeCard({ target_budget_entity: "input_number.budget", target_budget: 42 });
    el.hass = hassWith(12, undefined, { "input_number.budget": { state } });
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll(".metric-box")[2].textContent).toContain("42");
  });

  it("formats the cost with the Home Assistant language", async () => {
    const el = makeCard({ show_cost: true, water_price_per_m3: 5, energy_price_per_kwh: 0.2 });
    el.hass = { ...hassWith(100), language: "fr" };
    document.body.appendChild(el);
    await el.updateComplete;
    const cost = [...el.shadowRoot.querySelectorAll(".metric-box")].pop().textContent;
    expect(cost).toMatch(/0[,.]50/);
  });

  it("shows the title only outside fullscreen", async () => {
    const normal = await mountCard({ title: "Bathroom" }, 12);
    expect(normal.shadowRoot.querySelector(".card-title").textContent).toBe("Bathroom");
    const full = await mountCard({ title: "Bathroom", fullscreen: true }, 12);
    expect(full.shadowRoot.querySelector(".card-title")).toBeNull();
  });

  it("treats a whitespace-only title as no title", async () => {
    const el = await mountCard({ title: "   " }, 12);
    expect(el.shadowRoot.querySelector(".card-header")).toBeNull();
  });

  it("applies the configured aspect ratio to the SVG", async () => {
    const el = await mountCard({ aspect_ratio_width: 16, aspect_ratio_height: 9 }, 12);
    expect(el.shadowRoot.querySelector("svg").getAttribute("style")).toContain("16");
  });
});

// ---------------------------------------------------------------------------
describe("render(): every theme in every state", () => {
  const STATES = {
    normal: { volume: 5, temp: 30 },
    warning: { volume: 40, temp: 30 },
    critical: { volume: 52, temp: 30 },
    boiling: { volume: 5, temp: 41 },
    "dead by heat": { volume: 5, temp: 50 },
    drained: { volume: 70, temp: 30 },
  };
  const combos = [];
  for (const theme of ["freshwater", "saltwater", "coldwater"]) {
    for (const [state, v] of Object.entries(STATES)) {
      for (const fullscreen of [false, true]) combos.push([theme, state, fullscreen, v]);
    }
  }

  it.each(combos)("%s / %s / fullscreen=%s renders without NaN or undefined", async (theme, _state, fullscreen, v) => {
    const el = makeCard({ theme, fullscreen, fish_count: 10, show_cost: true });
    feed(el, v.volume, v.temp);
    document.body.appendChild(el);
    await el.updateComplete;
    // A couple of frames so death/boiling/flow state is populated too.
    for (let i = 0; i < 5; i++) el._updatePhysics(1000 + i * 40);
    el.requestUpdate();
    await el.updateComplete;
    const markup = el.shadowRoot.innerHTML;
    expect(markup).not.toMatch(/NaN/);
    expect(markup).not.toMatch(/undefined/);
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });

  it.each(["freshwater", "saltwater", "coldwater"])("%s renders each species with 10 fish", async (theme) => {
    const el = await mountCard({ theme, fish_count: 10 }, 5, 30);
    expect(el._fishes).toHaveLength(10);
    expect(el.shadowRoot.innerHTML).not.toMatch(/NaN/);
  });

  it("shows the ancistrus only in freshwater and shrimp/crab only in saltwater", () => {
    const fresh = makeCard({ theme: "freshwater" });
    const salt = makeCard({ theme: "saltwater" });
    const cold = makeCard({ theme: "coldwater" });
    feed(fresh, 5);
    feed(salt, 5);
    feed(cold, 5);
    // Any drawing of the Ancistrus puts a sucker mouth at the top of its body.
    const drawn = (el) => {
      const host = document.createElement("div");
      render(el.render(), host);
      return host.innerHTML.includes("translate(0, 3) scale(");
    };
    expect(drawn(fresh)).toBe(true);
    expect(drawn(salt)).toBe(false);
    expect(drawn(cold)).toBe(false);
  });

  it("removed creatures render as empty templates", () => {
    const el = makeCard();
    el._ancistrus = null;
    el._shrimp = null;
    el._crab = null;
    expect(el._renderAncistrus(false).strings.join("").trim()).toBe("");
    expect(el._renderShrimp(false).strings.join("").trim()).toBe("");
    expect(el._renderCrab(false).strings.join("").trim()).toBe("");
  });

  it("dead creatures are drawn upside down", () => {
    const el = makeCard({ theme: "saltwater" });
    const alive = JSON.stringify(el._renderCrab(false).values);
    const dead = JSON.stringify(el._renderCrab(true).values);
    expect(alive).not.toBe(dead);
    expect(dead).toContain("-1.4");
  });

  it("a stressed tank (boiling or over budget) makes fish swim faster", () => {
    const calm = makeCard();
    const stressed = makeCard();
    const mk = () => ({ species: 0, x: 500, y: 300, vx: 2, vy: 0, dir: 1, deathProgress: 0 });
    const a = mk();
    const b = mk();
    calm._fishes = [a];
    stressed._fishes = [b];
    stressed._cachedTemperature = 41;
    for (const el of [calm, stressed]) {
      el._updatePhysics(1000);
      el._updatePhysics(1016.66);
    }
    expect(b.x - 500).toBeGreaterThan((a.x - 500) * 1.9);
  });
});
