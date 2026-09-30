// @vitest-environment happy-dom
//
// Fallbacks and defensive branches: malformed configuration, missing fields
// and creatures, so the card degrades to sensible defaults instead of
// throwing or drawing NaN.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { renderSensorBadge } from "./render/hud.js";

const CONFIG = { entity: "sensor.shower_volume", fish_count: 3 };

let realRaf;
beforeEach(() => {
  // Several tests pass invalid options on purpose; the corrections are logged.
  vi.spyOn(console, "warn").mockImplementation(() => {});
  realRaf = window.requestAnimationFrame;
  window.requestAnimationFrame = () => 1;
});
afterEach(() => {
  window.requestAnimationFrame = realRaf;
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const Card = () => customElements.get("shower-aquarium-card");

function makeCard(config = {}) {
  const el = new (Card())();
  el.setConfig({ ...CONFIG, ...config });
  el._hass = { language: "en", states: {} };
  el._cachedConsumedVolume = 0;
  el._cachedTemperature = 20;
  return el;
}

async function mount(config = {}, volume = 5) {
  const el = new (Card())();
  el.setConfig({ ...CONFIG, ...config });
  el.hass = {
    language: "en",
    states: { "sensor.shower_volume": { state: String(volume), last_changed: new Date().toISOString() } },
  };
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("getStubConfig()", () => {
  it("does not pick a temperature sensor that is unrelated to the shower", () => {
    const stub = Card().getStubConfig({}, ["sensor.room_temperature"]);
    expect(stub.temperature_entity).toBe("");
  });

  it("recognises a hydrao temperature sensor", () => {
    const stub = Card().getStubConfig({}, ["sensor.hydrao_temperature"]);
    expect(stub.temperature_entity).toBe("sensor.hydrao_temperature");
  });
});

describe("setConfig() fallbacks", () => {
  it("an empty theme falls back to freshwater", () => {
    const el = new (Card())();
    el.setConfig({ ...CONFIG, theme: "" });
    expect(el._fishes.length).toBe(3);
    expect(el._fishes.every((f) => f.species >= 0 && f.species < 4)).toBe(true);
  });

  it.each([["abc"], [0], [null], [undefined]])("fish_count %s falls back to 4 fish", (count) => {
    const el = new (Card())();
    el.setConfig({ entity: "sensor.x", fish_count: count });
    expect(el._fishes).toHaveLength(4);
  });

  it("clamps fish_count to 10", () => {
    const el = new (Card())();
    el.setConfig({ entity: "sensor.x", fish_count: 99 });
    expect(el._fishes).toHaveLength(10);
  });

  it("does not modify the configuration object it was given", () => {
    const config = Object.freeze({ entity: "sensor.x", night_entity: "sun.sun" });
    const el = new (Card())();
    expect(() => el.setConfig(config)).not.toThrow();
    expect(config.night_entity).toBe("sun.sun");
  });

  it("resets the flow tracker and the food on every new configuration", () => {
    const el = makeCard();
    el._food = [{ x: 1, y: 1 }];
    el._flow = { lastVolume: 9, lastIncreaseAt: 5, target: 1, showerActive: true };
    el.setConfig({ ...CONFIG });
    expect(el._food).toEqual([]);
    expect(el._flow.lastVolume).toBeNull();
  });
});

describe("_updatePhysics() fallbacks", () => {
  it("a zero fish_speed_multiplier falls back to the default speed instead of freezing the fish", () => {
    const el = makeCard({ fish_speed_multiplier: 0 });
    const fish = { species: 0, x: 500, y: 300, vx: 2, vy: 0, dir: 1, deathProgress: 0 };
    el._fishes = [fish];
    el._updatePhysics(1000);
    el._updatePhysics(1016.66);
    expect(fish.x).toBeGreaterThan(500);
  });

  it("an empty theme in the live config behaves like freshwater", () => {
    const el = makeCard();
    el._config.theme = "";
    const fish = { species: 0, x: 500, y: 300, vx: 2, vy: 0, dir: 1, deathProgress: 0 };
    el._fishes = [fish];
    expect(() => {
      el._updatePhysics(1000);
      el._updatePhysics(1016.66);
    }).not.toThrow();
    expect(fish.x).toBeGreaterThan(500);
  });

  it("a fish without a scale eats at the default mouth position", () => {
    const el = makeCard();
    const fish = { species: 0, x: 400, y: 300, vx: 0, vy: 0, dir: 1, scare: 0, deathProgress: 0 };
    const flake = { x: 400 + 22 * 1.4, y: 300, vy: 0, phase: 0, r: 4, color: "#fff", landedAt: 0, eaten: false };
    el._fishes = [fish];
    el._food = [flake];
    el._updatePhysics(1000);
    expect(flake.eaten).toBe(true);
  });

  it.each([
    ["shrimp", 740],
    ["crab", 240],
  ])("%s walks left when its target is on the left and right when on the right", (name, lane) => {
    const key = name === "shrimp" ? "_shrimp" : "_crab";
    const el = makeCard({ theme: "saltwater" });
    const creature = el[key];
    Object.assign(creature, { state: "moving", x: lane + 100, targetX: lane, idleUntil: 1e9, dir: 1 });
    el._updatePhysics(1000);
    el._updatePhysics(1016.66);
    expect(creature.dir).toBe(-1);
    Object.assign(creature, { state: "moving", x: lane, targetX: lane + 100 });
    el._updatePhysics(1033);
    expect(creature.dir).toBe(1);
  });
});

describe("render() fallbacks", () => {
  it("draws a fish that has no scale with the default 1.4 scale", async () => {
    const el = await mount({ theme: "freshwater" });
    const fish = { species: 2, color: "#3b82f6", x: 400, y: 300, vx: 1, vy: 0, dir: 1, phase: 0, deathProgress: 0 };
    const out = JSON.stringify(el._renderFishShape(fish, "freshwater", false).values);
    expect(out).toContain("1.4");
  });

  it("mirrors a fish that swims left", async () => {
    const el = await mount();
    const fish = { species: 2, color: "#3b82f6", scale: 1.5, x: 1, y: 1, vx: 1, vy: 0, dir: -1, phase: 0, deathProgress: 0 };
    expect(JSON.stringify(el._renderFishShape(fish, "freshwater", false).values)).toContain("-1.5");
  });

  it("draws shrimp and crab mirrored when they walk left", async () => {
    const el = await mount({ theme: "saltwater" });
    el._shrimp.dir = -1;
    el._crab.dir = -1;
    expect(JSON.stringify(el._renderShrimp(false).values)).toContain("-1.5");
    expect(JSON.stringify(el._renderCrab(false).values)).toContain("-1.4");
    el._shrimp.dir = 1;
    el._crab.dir = 1;
    expect(JSON.stringify(el._renderShrimp(false).values)).not.toContain("-1.5,");
  });

  it("renders when the fish list has been cleared", async () => {
    const el = await mount();
    el._fishes = null;
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });

  it("an empty theme renders as freshwater", async () => {
    const el = await mount();
    el._config = { ...el._config, theme: "" };
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot.innerHTML).toContain("freshwater-plants");
  });

  it("aspect ratios of zero fall back to 1024 x 600", async () => {
    const el = await mount({ aspect_ratio_width: 0, aspect_ratio_height: 0 });
    expect(el.shadowRoot.querySelector("svg").getAttribute("style")).toContain("1024");
    expect(el.shadowRoot.querySelector("svg").getAttribute("style")).toContain("600");
  });

  it("an algae delay of zero falls back to 12 hours", async () => {
    const early = await mount({ algae_enabled: true, algae_delay_hours: 0, algae_age: 11 });
    expect(early.shadowRoot.querySelector("#algae-layer")).toBeNull();
    const late = await mount({ algae_enabled: true, algae_delay_hours: 0, algae_age: 13 });
    expect(late.shadowRoot.querySelector("#algae-layer")).not.toBeNull();
  });

  it("algae fill the whole fullscreen canvas", async () => {
    const el = await mount({ fullscreen: true, algae_enabled: true, algae_age: 40 });
    const rect = el.shadowRoot.querySelector("#algae-layer rect");
    expect(rect.getAttribute("y")).toBe("0");
    expect(rect.getAttribute("height")).toBe("600");
  });

  it("algae stay inside the glass in normal mode", async () => {
    const el = await mount({ algae_enabled: true, algae_age: 40 });
    const rect = el.shadowRoot.querySelector("#algae-layer rect");
    expect(rect.getAttribute("y")).toBe("14");
  });

  it("algae grow more opaque with age", async () => {
    const young = await mount({ algae_enabled: true, algae_delay_hours: 12, algae_age: 13 });
    const old = await mount({ algae_enabled: true, algae_delay_hours: 12, algae_age: 48 });
    const opacity = (el) => Number(el.shadowRoot.querySelector("#algae-layer").getAttribute("opacity"));
    expect(opacity(old)).toBeGreaterThan(opacity(young));
    expect(opacity(old)).toBeLessThanOrEqual(0.98);
  });

  it("draws the rising stream of flow bubbles", async () => {
    const el = await mount();
    Object.assign(el._flowBubbles[0], { active: true, x: 500, y: 300, r: 3 });
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot.innerHTML).toContain('fill-opacity="0.22"');
  });

  it("_renderSensorBadge draws nothing while the sensor is fine", () => {
    const el = makeCard();
    expect(renderSensorBadge(el, false, false).strings.join("").trim()).toBe("");
  });

  it("the sensor badge is translated and sits under the row of numbers in fullscreen", () => {
    const el = makeCard();
    el.hass = { language: "fr", states: {} };
    const normal = renderSensorBadge(el, true, false);
    const fullscreen = renderSensorBadge(el, true, true);
    expect(JSON.stringify(normal.values)).toContain("Capteur indisponible");
    expect(normal.values[0]).toBe(24);
    expect(fullscreen.values[0]).toBe(112);
  });

  it("the sensor badge goes under the FPS badge when show_fps is on in the normal mode, and stays put in fullscreen", () => {
    const el = makeCard({ show_fps: true });
    expect(renderSensorBadge(el, true, false).values[0]).toBe(62);
    expect(renderSensorBadge(el, true, true).values[0]).toBe(112);
  });

  it("_renderCostLabel() draws nothing without a cost", () => {
    const el = makeCard();
    expect(el._renderCostLabel(null).strings.join("").trim()).toBe("");
  });

  it("_renderCostLabel() shows the formatted total", () => {
    const el = makeCard();
    const out = JSON.stringify(el._renderCostLabel({ total: 1.5 }).values);
    expect(out).toContain("1.50");
  });
});

describe("_updatePhysics() bookkeeping", () => {
  it("the ancistrus keeps moving while it has not reached its target", () => {
    const el = makeCard();
    Object.assign(el._ancistrus, { state: "moving", y: 200, targetY: 500, idleUntil: 1e9 });
    el._updatePhysics(1000);
    el._updatePhysics(1016.66);
    expect(el._ancistrus.state).toBe("moving");
    expect(el._ancistrus.y).toBeGreaterThan(200);
    expect(el._ancistrus.y).toBeLessThan(500);
  });

  it("does not request a re-render on a frame where nothing moved", () => {
    const el = makeCard();
    el._fishes = [];
    el._snails = [];
    el._ancistrus = null;
    el._shrimp = null;
    el._crab = null;
    el._goby = null;
    el._bubbles = [];
    el._food = [];
    el._ripples = [];
    const spy = vi.spyOn(el, "requestUpdate");
    el._updatePhysics(1000);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("module evaluation", () => {
  it("evaluating the card module a second time does not define the element twice", async () => {
    const before = customElements.get("shower-aquarium-card");
    vi.resetModules();
    await expect(import("./shower-aquarium-card.js")).resolves.toBeDefined();
    expect(customElements.get("shower-aquarium-card")).toBe(before);
  });
});

describe("fish and snail corner cases", () => {
  const flake = (x, y) => ({ x, y, vy: 0, phase: 0, r: 4, color: "#fff", landedAt: 0, eaten: false });

  it("a fish keeps its heading when the flake is almost straight ahead (within 6 px)", () => {
    const el = makeCard();
    const fish = { species: 0, x: 400, y: 300, vx: 0, vy: 0, dir: -1, scale: 1.4, scare: 0, deathProgress: 0 };
    el._fishes = [fish];
    el._food = [flake(403, 320)];
    el._updatePhysics(1000);
    expect(fish._seeking).toBe(true);
    expect(fish.dir).toBe(-1);
  });

  it("stops seeking cleanly even if its remembered swimming speed is missing", () => {
    const el = makeCard();
    const fish = { species: 0, x: 400, y: 300, vx: 0, vy: 0.7, dir: 1, scale: 1.4, scare: 0, deathProgress: 0, _seeking: true };
    el._fishes = [fish];
    el._food = [];
    el._updatePhysics(1000);
    expect(fish._seeking).toBe(false);
    expect(fish.vy).toBe(0.7);
  });

  it("a snail of an unknown type is left where it is", () => {
    const el = makeCard();
    const snail = { x: 300, y: 300, vx: 1, vy: 1, dir: 1, type: "flying", color: "#000" };
    el._snails = [snail];
    el._updatePhysics(1000);
    el._updatePhysics(1016.66);
    expect(snail.x).toBe(300);
    expect(snail.y).toBe(300);
  });

  it("a knock straight above a fish startles it without turning it around", () => {
    const el = makeCard();
    el._hass = { language: "en", states: {} };
    const fish = { x: 500, y: 300, dir: 1, scare: 0, deathProgress: 0 };
    el._fishes = [fish];
    el._eventToSvgPoint = () => ({ x: 500, y: 250 });
    el._onTankTap({});
    expect(fish.scare).toBeGreaterThan(0);
    expect(fish.dir).toBe(1);
  });
});


describe("a card that setConfig() has not configured yet", () => {
  const bare = () => {
    const el = new (Card())();
    el._hass = { language: "en", states: {} };
    return el;
  };

  it("has no tank state and nothing interactive", () => {
    const el = bare();
    expect(el._tankState()).toBeNull();
    expect(el._interactiveTank()).toBeNull();
  });

  it("draws no algae and skips the physics step instead of throwing", () => {
    const el = bare();
    expect(() => el._renderAlgae(48, false)).not.toThrow();
    expect(() => el._updatePhysics(1000)).not.toThrow();
  });
});
