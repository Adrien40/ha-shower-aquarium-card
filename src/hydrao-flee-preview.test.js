// @vitest-environment happy-dom
//
// Hydrao Custom auto-detection, the creatures running away from a knock on the
// glass, and the gauges shown in the editor preview even without consumption.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { detectHydraoEntities } from "./pure.js";
import { startleAncistrus, startleCrawler, stepAncistrus, stepCrawler, createFrame, SHRIMP_SPEC, GOBY_SPEC, FLEE } from "./physics.js";

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
    "sensor.hydrao_ab12_wasted_shower_volume",
    "sensor.hydrao_ab12_threshold_3",
    "sensor.hydrao_ab12_threshold_4",
    "number.hydrao_ab12_minimum_comfort_temperature",
    "sensor.room_temperature",
  ];

  it("finds the entities from the registry, whatever the language of their ids", () => {
    const hass = {
      entities: {
        "sensor.douche_vol": { platform: "hydrao_custom", translation_key: "shower_volume_raw" },
        "sensor.douche_confort": { platform: "hydrao_custom", translation_key: "comfort_shower_volume" },
        "sensor.douche_temp": { platform: "hydrao_custom", translation_key: "temperature" },
        "sensor.other_temp": { platform: "other", translation_key: "temperature" },
        "number.douche_confort_min": { platform: "hydrao_custom", translation_key: "comfort_temperature" },
        "sensor.douche_palier": { platform: "hydrao_custom", translation_key: "threshold_4" },
      },
    };
    expect(detectHydraoEntities(hass, Object.keys(hass.entities))).toEqual({
      entity: "sensor.douche_confort",
      temperature_entity: "sensor.douche_temp",
      comfort_temp_entity: "number.douche_confort_min",
      target_budget_entity: "sensor.douche_palier",
    });
  });

  it("takes the comfort shower volume, not the shower volume, and the threshold 4 as the target", () => {
    expect(detectHydraoEntities(null, ids)).toEqual({
      entity: "sensor.hydrao_ab12_comfort_shower_volume",
      temperature_entity: "sensor.hydrao_ab12_temperature",
      comfort_temp_entity: "number.hydrao_ab12_minimum_comfort_temperature",
      target_budget_entity: "sensor.hydrao_ab12_threshold_4",
    });
  });

  it("never takes the cumulative or the wasted volume, nor another threshold", () => {
    const some = ids.filter((id) => !id.includes("comfort_shower") && !id.includes("threshold_4") && !id.endsWith("_shower_volume"));
    const out = detectHydraoEntities(null, some);
    expect(out.entity).toBe("");
    expect(out.target_budget_entity).toBe("");
  });

  it("falls back to the shower volume when the device has no comfort volume", () => {
    const out = detectHydraoEntities(null, ids.filter((id) => !id.includes("comfort_shower")));
    expect(out.entity).toBe("sensor.hydrao_ab12_shower_volume");
  });

  it("falls back to the french ids", () => {
    const fr = [
      "sensor.hydrao_ab12_volume_douche",
      "sensor.hydrao_ab12_volume_douche_confort",
      "sensor.hydrao_ab12_seuil_4",
      "sensor.hydrao_ab12_temperature",
      "number.hydrao_ab12_temperature_de_confort_minimum",
    ];
    const out = detectHydraoEntities({}, fr);
    expect(out.entity).toBe("sensor.hydrao_ab12_volume_douche_confort");
    expect(out.target_budget_entity).toBe("sensor.hydrao_ab12_seuil_4");
    expect(out.comfort_temp_entity).toBe("number.hydrao_ab12_temperature_de_confort_minimum");
    expect(detectHydraoEntities({}, fr.filter((id) => !id.includes("confort_douche") && !id.endsWith("douche_confort"))).entity).toBe("sensor.hydrao_ab12_volume_douche");
  });

  it("returns empty strings when nothing fits", () => {
    expect(detectHydraoEntities(undefined, [])).toEqual({ entity: "", temperature_entity: "", comfort_temp_entity: "", target_budget_entity: "" });
  });

  it("feeds the starting configuration of the card, with the target entity when there is one", () => {
    const stub = Card().getStubConfig({}, ids);
    expect(stub.entity).toBe("sensor.hydrao_ab12_comfort_shower_volume");
    expect(stub.temperature_entity).toBe("sensor.hydrao_ab12_temperature");
    expect(stub.comfort_temp_entity).toBe("number.hydrao_ab12_minimum_comfort_temperature");
    expect(stub.target_budget_entity).toBe("sensor.hydrao_ab12_threshold_4");
    expect(Card().getStubConfig({}, ["sensor.other"])).not.toHaveProperty("target_budget_entity");
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

  it.each([["shrimp", SHRIMP_SPEC, 650], ["goby", GOBY_SPEC, 530]])("the %s runs away from the knock, then calms down", (_n, spec, x) => {
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
    el._knockAt(500, 560, el._tankState());
    expect(el._crab.fleeUntil).toBeGreaterThan(Date.now());
    expect(el._shrimp.state).toBe("moving");
    expect(el._shrimp.targetX).toBeGreaterThan(el._shrimp.x);
  });
});

describe("edge cases of the flee", () => {
  const tank = { tankTop: 0, tankBottom: 600, waterSurfaceY: 40 };

  it("a knock right on the Ancistrus sends it in a random direction", () => {
    const anc = { x: 400, y: 300, targetX: 400, targetY: 300, state: "idle", idleUntil: 0 };
    expect(startleAncistrus(anc, 400, 300, 0, tank, () => 0.25)).toBe(true);
    expect(Math.hypot(anc.targetX - 400, anc.targetY - 300)).toBeGreaterThan(100);
  });

  it("a crawler knocked exactly from above runs the way it faces; at the end of its lane it turns back", () => {
    const c = { x: 600, y: 560, targetX: 600, state: "idle", idleUntil: 0, dir: -1 };
    startleCrawler(c, 600, 560, 0, SHRIMP_SPEC);
    expect(c.targetX).toBeLessThan(600);
    // The shrimp runs farther than it walks; at the end of that run it turns back.
    const edge = { x: SHRIMP_SPEC.fleeMaxX, y: 560, targetX: SHRIMP_SPEC.fleeMaxX, state: "idle", idleUntil: 0, dir: 1 };
    startleCrawler(edge, SHRIMP_SPEC.fleeMaxX - 50, 560, 0, SHRIMP_SPEC);
    expect(edge.targetX).toBeLessThan(SHRIMP_SPEC.fleeMaxX);
  });

  it("the Ancistrus rests longer after a flee, once it has arrived", () => {
    const frame = (nowMs) => createFrame({
      timestamp: nowMs, deltaMs: 16, delta: 1, nowMs, animTime: 0, userSpeed: 1, themeKey: "saltwater",
      tank: { ...tank, waterRatio: 1, isDead: false, isBoiling: false, speedMultiplier: 1 },
    });
    const anc = { x: 400, y: 300, targetX: 400, targetY: 300, heading: 0, state: "moving", idleUntil: 0, fleeUntil: 5000 };
    stepAncistrus(anc, frame(1000), () => 0);
    expect(anc.state).toBe("idle");
    expect(anc.idleUntil).toBe(1000 + 2500);
  });
});

describe("the editor preview is recognised from its ancestors", () => {
  it.each(["hui-card-preview", "hui-dialog-edit-card"])("inside %s", async (tag) => {
    const host = document.createElement(tag);
    const root = host.attachShadow({ mode: "open" });
    const el = new (Card())();
    root.appendChild(el);
    document.body.appendChild(host);
    expect(el._isEditorPreview()).toBe(true);
  });

  it("not on a plain dashboard", () => {
    const el = new (Card())();
    document.body.appendChild(el);
    expect(el._isEditorPreview()).toBe(false);
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
