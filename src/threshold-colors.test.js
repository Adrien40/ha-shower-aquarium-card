// @vitest-environment happy-dom
//
// The four coloured thresholds of a Hydrao showerhead: the volume takes the colour
// of the threshold it has reached. A colour is active as long as its threshold
// is not passed; once the fourth is passed, its colour blinks.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { parseThresholdColor, readThresholdTiers, thresholdTier, computeCachedMetrics, computeGaugeState, metricsSignature } from "./pure.js";
import { CONFIG_DEFAULTS } from "./defaults.js";
import { cardStyles } from "./styles.js";
import { CARD_EDITOR_SCHEMA, FIELD_LABEL_KEYS, HELPER_KEYS } from "./card-editor.js";
import enTranslations from "../translations/en.json";
import frTranslations from "../translations/fr.json";

beforeEach(() => {
  window.requestAnimationFrame = () => 1;
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

// The default colours of the showerhead: green, blue, pink, red.
const COLORS = ["#00ff00", "#0000ff", "#ff00b4", "#ff0000"];
const LIMITS = [10, 20, 30, 40];
const sensor = (limit, hex) => ({ state: String(limit), attributes: hex ? { color_hex: hex.toUpperCase() } : {} });
const states = (over = {}) => ({
  "sensor.t1": sensor(10, COLORS[0]),
  "sensor.t2": sensor(20, COLORS[1]),
  "sensor.t3": sensor(30, COLORS[2]),
  "sensor.t4": sensor(40, COLORS[3]),
  ...over,
});
const CONFIG = { threshold_1_entity: "sensor.t1", threshold_2_entity: "sensor.t2", threshold_3_entity: "sensor.t3", target_budget_entity: "sensor.t4" };
const TIERS = LIMITS.map((limit, i) => ({ limit, color: COLORS[i] }));

describe("parseThresholdColor()", () => {
  it.each([
    [{ color_hex: "#00FF00" }, "#00ff00"],
    [{ color_hex: " #FF00B4 " }, "#ff00b4"],
    [{ color_rgb: "255, 0, 180" }, "#ff00b4"],
    [{ color_rgb: [0, 0, 255] }, "#0000ff"],
    [{ color_rgb: ["1", "2", "3"] }, "#010203"],
    [{ color_hex: "#00FF00", color_rgb: "1, 2, 3" }, "#00ff00"],
    [{ color_hex: "green", color_rgb: "255, 0, 0" }, "#ff0000"],
  ])("%j is %s", (attributes, expected) => {
    expect(parseThresholdColor(attributes)).toBe(expected);
  });

  it.each([[undefined], [{}], [{ color_hex: "#12" }], [{ color_hex: 255 }], [{ color_rgb: "1, 2" }], [{ color_rgb: "1, 2, 300" }], [{ color_rgb: "a, b, c" }], [{ color_rgb: "1.5, 2, 3" }], [{ color_rgb: ["", 2, 3] }], [{ color_rgb: 42 }], [{ color_rgb: "-1, 2, 3" }]])("%j has no colour", (attributes) => {
    expect(parseThresholdColor(attributes)).toBeNull();
  });
});

describe("readThresholdTiers()", () => {
  it("reads the litres and the colour of the four thresholds", () => {
    expect(readThresholdTiers({ states: states() }, CONFIG)).toEqual(TIERS);
  });

  it("takes the fourth from the target entity", () => {
    const tiers = readThresholdTiers({ states: states({ "sensor.other": sensor(50, "#123456") }) }, { ...CONFIG, target_budget_entity: "sensor.other" });
    expect(tiers[3]).toEqual({ limit: 50, color: "#123456" });
  });

  it.each([
    ["no entity at all", {}],
    ["a threshold entity missing from the configuration", { ...CONFIG, threshold_2_entity: undefined }],
    ["the target entity missing", { ...CONFIG, target_budget_entity: undefined }],
    ["an entity that does not exist", { ...CONFIG, threshold_3_entity: "sensor.nope" }],
  ])("is null with %s", (_name, config) => {
    expect(readThresholdTiers({ states: states() }, config)).toBeNull();
  });

  it.each([
    ["a threshold that is unavailable", { "sensor.t2": sensor("unavailable", COLORS[1]) }],
    ["a threshold at zero", { "sensor.t1": sensor(0, COLORS[0]) }],
    ["a threshold without a colour", { "sensor.t3": sensor(30, null) }],
    ["a threshold that does not go up", { "sensor.t2": sensor(10, COLORS[1]) }],
    ["a threshold that goes down", { "sensor.t4": sensor(25, COLORS[3]) }],
  ])("is null with %s", (_name, over) => {
    expect(readThresholdTiers({ states: states(over) }, CONFIG)).toBeNull();
  });
});

describe("thresholdTier()", () => {
  it("has the colour of the first threshold that is not passed yet", () => {
    expect(thresholdTier(0, TIERS)).toEqual({ color: COLORS[0], blinking: false, index: 0 });
    expect(thresholdTier(9.9, TIERS)).toMatchObject({ index: 0, blinking: false });
    expect(thresholdTier(15, TIERS)).toMatchObject({ color: COLORS[1], index: 1, blinking: false });
    expect(thresholdTier(25, TIERS)).toMatchObject({ color: COLORS[2], index: 2 });
    expect(thresholdTier(35, TIERS)).toMatchObject({ color: COLORS[3], index: 3, blinking: false });
  });

  it("a threshold is active until it is passed: right on it, it is still the same colour", () => {
    expect(thresholdTier(10, TIERS)).toMatchObject({ index: 0 });
    expect(thresholdTier(10.01, TIERS)).toMatchObject({ index: 1 });
    expect(thresholdTier(20, TIERS)).toMatchObject({ index: 1 });
    expect(thresholdTier(30, TIERS)).toMatchObject({ index: 2 });
    expect(thresholdTier(40, TIERS)).toMatchObject({ index: 3, blinking: false });
  });

  it("past the fourth threshold, its colour blinks", () => {
    expect(thresholdTier(40.01, TIERS)).toEqual({ color: COLORS[3], blinking: true, index: 3 });
    expect(thresholdTier(500, TIERS)).toMatchObject({ color: COLORS[3], blinking: true });
  });

  it("is null without thresholds", () => {
    expect(thresholdTier(12, null)).toBeNull();
    expect(thresholdTier(12, undefined)).toBeNull();
    expect(thresholdTier(12, [])).toBeNull();
  });
});

describe("the metrics", () => {
  const hass = (over = {}) => ({ states: { "sensor.v": { state: "12" }, ...states(over) } });
  const config = { entity: "sensor.v", ...CONFIG };

  it("carry the thresholds, and none without them", () => {
    expect(computeCachedMetrics(hass(), config).tiers).toEqual(TIERS);
    expect(computeCachedMetrics(hass(), { entity: "sensor.v" }).tiers).toBeNull();
  });

  it("the target budget is the fourth threshold, as before", () => {
    expect(computeCachedMetrics(hass(), config).targetBudget).toBe(40);
  });

  it("are off with use_threshold_colors: false", () => {
    expect(computeCachedMetrics(hass(), { ...config, use_threshold_colors: false }).tiers).toBeNull();
    expect(computeCachedMetrics(hass(), { ...config, use_threshold_colors: true }).tiers).toEqual(TIERS);
  });

  it("keep the last thresholds when the sensors cannot be read for a while", () => {
    const first = computeCachedMetrics(hass(), config);
    const gone = computeCachedMetrics(hass({ "sensor.t2": { state: "unavailable", attributes: {} } }), config, first);
    expect(gone.tiers).toEqual(TIERS);
    expect(computeCachedMetrics(hass({ "sensor.t2": { state: "unavailable", attributes: {} } }), config, null).tiers).toBeNull();
  });

  it("follow the colours the showerhead is given afterwards", () => {
    const first = computeCachedMetrics(hass(), config);
    const next = computeCachedMetrics(hass({ "sensor.t1": sensor(12, "#ffff00") }), config, first);
    expect(next.tiers[0]).toEqual({ limit: 12, color: "#ffff00" });
  });

  it("are part of what makes the card draw again", () => {
    const a = metricsSignature(computeCachedMetrics(hass(), config), "en");
    const b = metricsSignature(computeCachedMetrics(hass({ "sensor.t1": sensor(10, "#ffff00") }), config), "en");
    const c = metricsSignature(computeCachedMetrics(hass(), { entity: "sensor.v" }), "en");
    expect(new Set([a, b, c]).size).toBe(3);
  });
});

describe("computeGaugeState()", () => {
  const input = { currentTemp: 36, currentVolume: 25, targetBudget: 40, comfortMin: 33, deadlyTemp: 45, boilTemp: 40 };

  it("keeps its usual colours without thresholds", () => {
    expect(computeGaugeState(input)).toMatchObject({ volColor: "#0284c7", volBlink: false });
    expect(computeGaugeState({ ...input, currentVolume: 30 }).volColor).toBe("#f59e0b");
    expect(computeGaugeState({ ...input, currentVolume: 41 }).volColor).toBe("#ef4444");
  });

  it("takes the colour of the threshold reached, and blinks past the last one", () => {
    expect(computeGaugeState({ ...input, tier: thresholdTier(25, TIERS) })).toMatchObject({ volColor: COLORS[2], volBlink: false });
    expect(computeGaugeState({ ...input, currentVolume: 41, tier: thresholdTier(41, TIERS) })).toMatchObject({ volColor: COLORS[3], volBlink: true });
  });

  it("changes nothing for the temperature, the fill or the budget", () => {
    const [a, b] = [computeGaugeState(input), computeGaugeState({ ...input, tier: thresholdTier(25, TIERS) })];
    expect([b.tempColor, b.tempFraction, b.volFraction]).toEqual([a.tempColor, a.tempFraction, a.volFraction]);
  });
});

describe("the option", () => {
  it("is on by default, and the thresholds are plain entity options", () => {
    expect(CONFIG_DEFAULTS.use_threshold_colors).toBe(true);
    const fields = CARD_EDITOR_SCHEMA.flatMap((f) => (f.type === "expandable" ? f.schema : [f]));
    expect(fields.find((f) => f.name === "use_threshold_colors")).toMatchObject({ default: true, selector: { boolean: {} } });
    for (const name of ["threshold_1_entity", "threshold_2_entity", "threshold_3_entity"]) {
      expect(fields.find((f) => f.name === name).selector).toEqual({ entity: { domain: "sensor" } });
      for (const t of [enTranslations, frTranslations]) expect(t[FIELD_LABEL_KEYS[name]], name).toBeTruthy();
    }
    for (const t of [enTranslations, frTranslations]) {
      expect(t[HELPER_KEYS.use_threshold_colors]).toBeTruthy();
      expect(t[HELPER_KEYS.threshold_1_entity]).toBeTruthy();
    }
  });

  it("has a name in French and in English", () => {
    expect(frTranslations.field_use_threshold_colors).toContain("seuils");
    expect(enTranslations.field_use_threshold_colors).toContain("thresholds");
  });
});

describe("the blinking", () => {
  it("is a CSS animation of the opacity, about once a second", () => {
    expect(cardStyles.cssText).toMatch(/\.threshold-blink\s*\{[^}]*animation:\s*threshold-blink 1s/);
    expect(cardStyles.cssText).toMatch(/@keyframes threshold-blink[\s\S]*opacity:\s*0\.15/);
  });
});

describe("in the card", () => {
  const mount = async (config = {}, volume = 25, over = {}, { preview = false } = {}) => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.preview = preview;
    el.setConfig({ entity: "sensor.v", temperature_entity: "sensor.temp", fullscreen: true, ...CONFIG, ...config });
    el.hass = { language: "en", states: { "sensor.v": { state: String(volume), last_changed: new Date().toISOString() }, "sensor.temp": { state: "36", last_changed: new Date().toISOString() }, ...states(over) } };
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  };
  const bar = (el) => el.shadowRoot.querySelector('rect[rx="4.5"][fill]:not([fill-opacity])');
  const barOf = (el) => [...el.shadowRoot.querySelectorAll('rect[height="9"]')].pop();

  it("the bar of the volume has the colour of the threshold reached", async () => {
    for (const [volume, color] of [[5, COLORS[0]], [15, COLORS[1]], [25, COLORS[2]], [35, COLORS[3]]]) {
      const el = await mount({}, volume);
      expect(barOf(el).getAttribute("fill"), `${volume} L`).toBe(color);
      expect(barOf(el).getAttribute("class")).toBe("");
    }
  });

  it("the bar blinks once the last threshold is passed", async () => {
    const el = await mount({}, 45);
    expect(barOf(el).getAttribute("fill")).toBe(COLORS[3]);
    expect(barOf(el).getAttribute("class")).toBe("threshold-blink");
  });

  it("does not blink when the device asks for reduced motion (the colour stays)", async () => {
    window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
    const el = await mount({}, 45);
    expect(barOf(el).getAttribute("fill")).toBe(COLORS[3]);
    expect(barOf(el).getAttribute("class")).toBe("");
    window.matchMedia = undefined;
  });

  it("still blinks when the card is told to ignore the reduced-motion setting", async () => {
    window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
    const el = await mount({ respect_reduced_motion: false }, 45);
    expect(barOf(el).getAttribute("class")).toBe("threshold-blink");
    window.matchMedia = undefined;
  });

  it("the arcs take the colour too, and blink the arc and its marker", async () => {
    const calm = await mount({ gauge_style: "arc" }, 25);
    const volumeArc = (el) => [...el.shadowRoot.querySelectorAll("circle[stroke-dasharray]")].pop();
    expect(volumeArc(calm).getAttribute("stroke")).toBe(COLORS[2]);
    expect(volumeArc(calm).getAttribute("class")).toBe("");
    const over = await mount({ gauge_style: "arc" }, 45);
    expect(volumeArc(over).getAttribute("class")).toBe("threshold-blink");
    expect(over.shadowRoot.querySelectorAll("circle.threshold-blink")).toHaveLength(2);
    expect(calm.shadowRoot.querySelectorAll("circle.threshold-blink")).toHaveLength(0);
  });

  it("the Consumed tile takes the colour as well (normal mode), and blinks", async () => {
    const el = await mount({ fullscreen: false }, 25);
    const tile = el.shadowRoot.querySelector(".metric-value");
    expect(tile.getAttribute("style")).toContain(COLORS[2]);
    expect(tile.className).not.toContain("threshold-blink");
    const over = await mount({ fullscreen: false }, 45);
    expect(over.shadowRoot.querySelector(".metric-value").className).toContain("threshold-blink");
    // The other tiles keep their colours.
    expect(over.shadowRoot.querySelectorAll(".metric-value")[1].getAttribute("style")).toBeFalsy();
  });

  it("the Consumed tile has no threshold colour while it reads 0.0 L, and takes it as soon as it reads more", async () => {
    const tile = async (volume) => (await mount({ fullscreen: false }, volume)).shadowRoot.querySelector(".metric-value");
    for (const volume of [0, 0.01, 0.049]) {
      const t = await tile(volume);
      expect(t.textContent.trim().startsWith("0.0"), `${volume}`).toBe(true);
      expect(t.getAttribute("style"), `${volume}`).toBeFalsy();
      expect(t.className).not.toContain("threshold-blink");
    }
    for (const volume of [0.05, 0.1, 1]) expect((await tile(volume)).getAttribute("style"), `${volume}`).toContain(COLORS[0]);
  });

  it("the volume gauge still has the colour of the first threshold at 0 L (it is hidden then, but shown in the editor preview)", async () => {
    const el = await mount({}, 0, {}, { preview: true });
    expect(barOf(el).getAttribute("fill")).toBe(COLORS[0]);
  });

  it("the gauge outside fullscreen mode follows too", async () => {
    const el = await mount({ fullscreen: false, show_gauges: true }, 15);
    expect(barOf(el).getAttribute("fill")).toBe(COLORS[1]);
  });

  it("is switched off with use_threshold_colors: false: the usual colours, nothing blinks", async () => {
    const el = await mount({ use_threshold_colors: false }, 45);
    expect(barOf(el).getAttribute("fill")).toBe("#ef4444");
    expect(barOf(el).getAttribute("class")).toBe("");
    const tile = await mount({ use_threshold_colors: false, fullscreen: false }, 45);
    expect(tile.shadowRoot.querySelector(".metric-value").getAttribute("style")).toBeFalsy();
  });

  it("is on by default: a card configured without the option uses the thresholds", async () => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.v", fullscreen: true, ...CONFIG });
    expect(el._config.use_threshold_colors).toBe(true);
  });

  it("falls back to the usual colours when the thresholds are missing or unreadable", async () => {
    const el = await mount({ threshold_2_entity: "sensor.nope" }, 25);
    expect(barOf(el).getAttribute("fill")).toBe("#0284c7");
    const none = await mount({ threshold_1_entity: undefined, threshold_2_entity: undefined, threshold_3_entity: undefined, target_budget_entity: undefined }, 25);
    expect(barOf(none).getAttribute("fill")).toBe("#0284c7");
  });

  it("shows the colour of the first threshold in the preview of the editor at 0 L", async () => {
    const el = await mount({}, 0, {}, { preview: true });
    expect(barOf(el).getAttribute("fill")).toBe(COLORS[0]);
  });

  it("changes colour when the showerhead is given other colours", async () => {
    const el = await mount({}, 5);
    expect(barOf(el).getAttribute("fill")).toBe(COLORS[0]);
    el.hass = { ...el._hass, states: { ...el._hass.states, "sensor.t1": sensor(10, "#ffff00") } };
    await el.updateComplete;
    expect(barOf(el).getAttribute("fill")).toBe("#ffff00");
  });

  it("does not change the colour of the water, of the thermometer or of the budget", async () => {
    const el = await mount({}, 45);
    expect(el.shadowRoot.innerHTML).toContain("#ef4444");
    expect(el.shadowRoot.querySelector('rect[rx="9"]')).not.toBeNull();
    expect(bar(el)).not.toBeUndefined();
  });

  it("the starting configuration of a new card has the thresholds of the showerhead", () => {
    const ids = ["sensor.hydrao_x_shower_volume", "sensor.hydrao_x_threshold_1", "sensor.hydrao_x_threshold_2", "sensor.hydrao_x_threshold_3", "sensor.hydrao_x_threshold_4"];
    const stub = customElements.get("shower-aquarium-card").getStubConfig({}, ids);
    expect(stub).toMatchObject({ threshold_1_entity: ids[1], threshold_2_entity: ids[2], threshold_3_entity: ids[3], target_budget_entity: ids[4] });
    const without = customElements.get("shower-aquarium-card").getStubConfig({}, [ids[0]]);
    for (const key of ["threshold_1_entity", "threshold_2_entity", "threshold_3_entity"]) expect(without).not.toHaveProperty(key);
  });
});
