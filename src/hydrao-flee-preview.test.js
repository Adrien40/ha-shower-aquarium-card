// @vitest-environment happy-dom
//
// Hydrao Custom auto-detection, the creatures running away from a knock on the
// glass, and the gauges shown in the editor preview even without consumption.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { detectHydraoEntities } from "./pure.js";
import { startleAncistrus, startleCrawler, stepAncistrus, stepCrawler, createFrame, SHRIMP_SPEC, CRAB_SPEC, GOBY_SPEC, FLEE } from "./physics.js";

const Card = () => customElements.get("shower-aquarium-card");

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  window.requestAnimationFrame = () => 1;
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("detectHydraoEntities()", () => {
  const ids = [
    "sensor.hydrao_ab12_total_cumulative_shower_volume",
    "sensor.hydrao_ab12_shower_volume",
    "sensor.hydrao_ab12_temperature",
    "sensor.hydrao_ab12_comfort_shower_volume",
    "number.hydrao_ab12_minimum_comfort_temperature",
    "sensor.room_temperature",
  ];

  it("finds the entities from the registry, whatever the language of their ids", () => {
    const hass = {
      entities: {
        "sensor.douche_vol": { platform: "hydrao_custom", translation_key: "shower_volume_raw" },
        "sensor.douche_temp": { platform: "hydrao_custom", translation_key: "temperature" },
        "sensor.other_temp": { platform: "other", translation_key: "temperature" },
        "number.douche_confort": { platform: "hydrao_custom", translation_key: "comfort_temperature" },
      },
    };
    expect(detectHydraoEntities(hass, Object.keys(hass.entities))).toEqual({
      entity: "sensor.douche_vol",
      temperature_entity: "sensor.douche_temp",
      comfort_temp_entity: "number.douche_confort",
    });
  });

  it("falls back to the english ids, without taking the cumulative or comfort volumes", () => {
    expect(detectHydraoEntities(null, ids)).toEqual({
      entity: "sensor.hydrao_ab12_shower_volume",
      temperature_entity: "sensor.hydrao_ab12_temperature",
      comfort_temp_entity: "number.hydrao_ab12_minimum_comfort_temperature",
    });
  });

  it("falls back to the french ids", () => {
    const fr = ["sensor.hydrao_ab12_volume_douche", "sensor.hydrao_ab12_temperature", "number.hydrao_ab12_temperature_de_confort_minimum"];
    const out = detectHydraoEntities({}, fr);
    expect(out.entity).toBe("sensor.hydrao_ab12_volume_douche");
    expect(out.comfort_temp_entity).toBe("number.hydrao_ab12_temperature_de_confort_minimum");
  });

  it("returns empty strings when nothing fits", () => {
    expect(detectHydraoEntities(undefined, [])).toEqual({ entity: "", temperature_entity: "", comfort_temp_entity: "" });
  });

  it("feeds the starting configuration of the card", () => {
    const stub = Card().getStubConfig({}, ids);
    expect(stub.entity).toBe("sensor.hydrao_ab12_shower_volume");
    expect(stub.temperature_entity).toBe("sensor.hydrao_ab12_temperature");
    expect(stub.comfort_temp_entity).toBe("number.hydrao_ab12_minimum_comfort_temperature");
  });
});

describe("a knock on the glass makes the bottom dwellers run", () => {
  const tank = { tankTop: 0, tankBottom: 600, waterSurfaceY: 40 };
  const frameAt = (nowMs, timestamp = nowMs) =>
    createFrame({
      timestamp, deltaMs: 16, delta: 1, nowMs, animTime: 0, userSpeed: 1, themeKey: "saltwater",
      tank: { ...tank, waterRatio: 1, isDead: false, isBoiling: false, speedMultiplier: 1 },
    });

  it("the Ancistrus darts away much faster than it glides", () => {
    const calm = { x: 400, y: 300, targetX: 700, targetY: 300, heading: 0, state: "moving", idleUntil: 1e9 };
    const scared = { ...calm };
    expect(startleAncistrus(scared, 300, 300, 1000, tank, () => 0.5)).toBe(true);
    stepAncistrus(calm, frameAt(1000), () => 0.5);
    stepAncistrus(scared, frameAt(1000), () => 0.5);
    expect(Math.hypot(scared.x - 400, scared.y - 300)).toBeGreaterThan(Math.hypot(calm.x - 400, calm.y - 300) * (FLEE.ancistrusFactor - 1));
    expect(scared.targetX).toBeGreaterThan(400);
  });

  it("ignores a knock that is too far away", () => {
    const anc = { x: 100, y: 300, targetX: 100, targetY: 300, state: "idle", idleUntil: 0 };
    expect(startleAncistrus(anc, 100 + FLEE.radius + 50, 300, 0, tank)).toBe(false);
    expect(anc.state).toBe("idle");
  });

  it.each([["shrimp", SHRIMP_SPEC, 650], ["crab", CRAB_SPEC, (CRAB_SPEC.minX + CRAB_SPEC.maxX) / 2], ["goby", GOBY_SPEC, 530]])("the %s runs away from the knock, then calms down", (_n, spec, x) => {
    const c = { x, y: 560, targetX: x, state: "idle", idleUntil: 1e9, dir: 1 };
    expect(startleCrawler(c, x - 60, 560, 1000, spec)).toBe(true);
    expect(c.state).toBe("moving");
    expect(c.targetX).toBeGreaterThan(x);
    const before = c.x;
    stepCrawler(c, frameAt(1000), spec, () => 0.5);
    const fast = c.x - before;
    const normal = { x, y: 560, targetX: x + 100, state: "moving", idleUntil: 1e9, dir: 1 };
    stepCrawler(normal, frameAt(1000), spec, () => 0.5);
    expect(fast).toBeGreaterThan((normal.x - x) * 3);
    // After the flee window, the speed is back to normal.
    const later = { ...c, x, targetX: x + 100 };
    stepCrawler(later, frameAt(1000 + FLEE.durationMs + 10), spec, () => 0.5);
    expect(later.x - x).toBeCloseTo(normal.x - x, 5);
  });

  it("tapping the glass of the card startles them", async () => {
    const el = new (Card())();
    el.setConfig({ entity: "sensor.v", theme: "saltwater" });
    el.hass = { language: "en", states: { "sensor.v": { state: "10", last_changed: new Date().toISOString() } } };
    document.body.appendChild(el);
    await el.updateComplete;
    el._crab.x = 600; el._crab.y = 560; el._shrimp.x = 640; el._shrimp.y = 560;
    el._knockAt(500, 560);
    expect(el._crab.fleeUntil).toBeGreaterThan(Date.now());
    expect(el._shrimp.state).toBe("moving");
    expect(el._shrimp.targetX).toBeGreaterThan(el._shrimp.x);
  });
});

describe("the gauges in the editor preview", () => {
  const mount = async (preview, volume) => {
    const el = new (Card())();
    el.setConfig({ entity: "sensor.v", fullscreen: true });
    el.preview = preview;
    el.hass = { language: "en", states: { "sensor.v": { state: String(volume), last_changed: new Date().toISOString() } } };
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  };
  const hasGauges = (el) => el.shadowRoot.innerHTML.includes("font-size=\"58\"");

  it("stay hidden at 0 L on a dashboard", async () => {
    expect(hasGauges(await mount(false, 0))).toBe(false);
  });

  it("are shown at 0 L while the card is being set up", async () => {
    expect(hasGauges(await mount(true, 0))).toBe(true);
  });

  it("are shown once water flows, preview or not", async () => {
    expect(hasGauges(await mount(false, 12))).toBe(true);
  });
});
