// @vitest-environment happy-dom
//
// Configuration validation (normalizeConfig), the text alternative of the
// picture, and the sizing rules for the sections view.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { normalizeConfig, fillTemplate, formatNumber } from "./pure.js";
import enTranslations from "../translations/en.json";
import frTranslations from "../translations/fr.json";

let realRaf;
beforeEach(() => {
  realRaf = window.requestAnimationFrame;
  window.requestAnimationFrame = () => 1;
});
afterEach(() => {
  window.requestAnimationFrame = realRaf;
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const Card = () => customElements.get("shower-aquarium-card");
const norm = (config) => normalizeConfig({ entity: "sensor.x", ...config });

// ---------------------------------------------------------------------------
describe("normalizeConfig(): numbers", () => {
  it("leaves a valid configuration untouched and reports nothing", () => {
    const input = { entity: "sensor.x", theme: "coldwater", fish_count: 5, target_budget: 60, fish_speed_multiplier: 1.5 };
    const { config, warnings } = normalizeConfig(input);
    expect(config).toEqual(input);
    expect(warnings).toEqual([]);
  });

  it("never mutates its input", () => {
    const input = Object.freeze({ entity: "sensor.x", target_budget: -1 });
    expect(() => normalizeConfig(input)).not.toThrow();
    expect(input.target_budget).toBe(-1);
  });

  it("drops absent and null options so setConfig can apply the defaults", () => {
    const { config, warnings } = norm({ target_budget: null, theme: null, animation_quality: null, title: undefined });
    for (const key of ["target_budget", "theme", "animation_quality", "title"]) expect(config).not.toHaveProperty(key);
    expect(warnings).toEqual([]);
  });

  it("an empty YAML value does not override the default", () => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.x", theme: null, target_budget: null, fish_count: null });
    expect(el._config).toMatchObject({ theme: "freshwater", target_budget: 50, fish_count: 4 });
    expect(el._fishes).toHaveLength(4);
  });

  it.each([
    ["target_budget", -5, 50],
    ["target_budget", 0, 50],
    ["target_budget", "abc", 50],
    ["target_budget", "", 50],
    ["target_budget", Infinity, 50],
    ["survival_volume", 0, 5],
    ["temp_boiling_threshold", -3, 40],
    ["algae_delay_hours", 0, 12],
    ["aspect_ratio_width", 0, 1024],
    ["aspect_ratio_height", -600, 600],
    ["fish_count", 0, 4],
    ["fish_count", "many", 4],
    ["fish_speed_multiplier", 0, 1.2],
    ["fish_speed_multiplier", -2, 1.2],
    ["algae_age", -1, 0],
    ["water_price_per_m3", -1, 4.5],
    ["energy_price_per_kwh", "free", 0.25],
    ["cold_water_temp", "cold", 15],
  ])("%s = %j falls back to %s with a warning", (key, value, fallback) => {
    const { config, warnings } = norm({ [key]: value });
    expect(config[key]).toBe(fallback);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain(key);
    expect(warnings[0]).toContain(String(fallback));
  });

  it.each([
    ["fish_count", 99, 10],
    ["fish_count", 4.6, 5],
    ["fish_speed_multiplier", 9, 3],
    ["fish_speed_multiplier", 0.05, 0.2],
  ])("%s = %s is pulled into range as %s", (key, value, expected) => {
    expect(norm({ [key]: value }).config[key]).toBe(expected);
  });

  it("accepts zero where zero is meaningful", () => {
    const { config, warnings } = norm({ algae_age: 0, water_price_per_m3: 0, energy_price_per_kwh: 0 });
    expect(config).toMatchObject({ algae_age: 0, water_price_per_m3: 0, energy_price_per_kwh: 0 });
    expect(warnings).toEqual([]);
  });

  it("accepts a negative cold water temperature (a very cold country)", () => {
    expect(norm({ cold_water_temp: -5 }).config.cold_water_temp).toBe(-5);
  });

  it("turns numeric text from YAML into a number, without a warning", () => {
    const { config, warnings } = norm({ target_budget: "80", temp_deadly_threshold: "46" });
    expect(config.target_budget).toBe(80);
    expect(config.temp_deadly_threshold).toBe(46);
    expect(warnings).toEqual([]);
  });
});

describe("normalizeConfig(): choices", () => {
  it.each(["", "lake", 3, {}])("an unknown theme %j becomes freshwater", (theme) => {
    const { config, warnings } = norm({ theme });
    expect(config.theme).toBe("freshwater");
    expect(warnings).toHaveLength(1);
  });

  it.each(["freshwater", "saltwater", "coldwater"])("keeps the valid theme %s", (theme) => {
    expect(norm({ theme })).toMatchObject({ config: { theme }, warnings: [] });
  });

  it.each(["", "turbo", 1])("an unknown animation_quality %j becomes max", (animation_quality) => {
    expect(norm({ animation_quality }).config.animation_quality).toBe("max");
  });

  it.each(["max", "balanced", "light"])("keeps the valid animation_quality %s", (quality) => {
    expect(norm({ animation_quality: quality }).warnings).toEqual([]);
  });

  it.each(["", "round", 1])("an unknown gauge_style %j becomes thermometer", (gauge_style) => {
    const { config, warnings } = norm({ gauge_style });
    expect(config.gauge_style).toBe("thermometer");
    expect(warnings).toHaveLength(1);
  });

  it.each(["thermometer", "arc"])("keeps the valid gauge_style %s", (gauge_style) => {
    expect(norm({ gauge_style })).toMatchObject({ config: { gauge_style }, warnings: [] });
  });

  it.each([0, -5, "abc"])("a comfort_temp_min of %j falls back to 33", (comfort_temp_min) => {
    const { config, warnings } = norm({ comfort_temp_min });
    expect(config.comfort_temp_min).toBe(33);
    expect(warnings).toHaveLength(1);
  });

  it("keeps a comfort_temp_min below the boiling threshold", () => {
    expect(norm({ comfort_temp_min: 36 })).toMatchObject({ config: { comfort_temp_min: 36 }, warnings: [] });
  });

  it("puts a comfort_temp_min that reaches the boiling threshold just below it", () => {
    const { config, warnings } = norm({ comfort_temp_min: 42, temp_boiling_threshold: 40, temp_deadly_threshold: 45 });
    expect(config.comfort_temp_min).toBe(39);
    expect(warnings).toHaveLength(1);
  });

  it("a low boiling threshold also pulls the default comfort minimum down", () => {
    const { config } = norm({ temp_boiling_threshold: 30, temp_deadly_threshold: 45 });
    expect(config.comfort_temp_min).toBe(29);
  });

  it("ignores a title that is not text", () => {
    const { config, warnings } = norm({ title: 42 });
    expect(config.title).toBe("");
    expect(warnings).toHaveLength(1);
  });

  it("keeps a text title", () => {
    expect(norm({ title: "Bathroom" }).config.title).toBe("Bathroom");
  });
});

describe("normalizeConfig(): temperature thresholds", () => {
  it("puts the deadly temperature above the boiling one", () => {
    const { config, warnings } = norm({ temp_boiling_threshold: 50, temp_deadly_threshold: 45 });
    expect(config.temp_deadly_threshold).toBe(51);
    expect(warnings.some((w) => w.includes("temp_deadly_threshold"))).toBe(true);
  });

  it("also corrects equal thresholds", () => {
    expect(norm({ temp_boiling_threshold: 45, temp_deadly_threshold: 45 }).config.temp_deadly_threshold).toBe(46);
  });

  it("compares a lone deadly threshold with the default boiling threshold", () => {
    expect(norm({ temp_deadly_threshold: 38 }).config.temp_deadly_threshold).toBe(41);
  });

  it("compares a lone boiling threshold with the default deadly threshold", () => {
    const { config } = norm({ temp_boiling_threshold: 47 });
    expect(config.temp_deadly_threshold).toBe(48);
  });

  it("leaves a coherent pair alone", () => {
    const { config, warnings } = norm({ temp_boiling_threshold: 38, temp_deadly_threshold: 44 });
    expect(config).toMatchObject({ temp_boiling_threshold: 38, temp_deadly_threshold: 44 });
    expect(warnings).toEqual([]);
  });

  it("adds nothing when neither threshold is set", () => {
    expect(norm({}).config.temp_deadly_threshold).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
describe("setConfig() validation", () => {
  it.each([[undefined], [null], [{}], [{ entity: "" }], [{ entity: "   " }], [{ entity: 42 }], [{ entity: ["a"] }]])(
    "rejects %j",
    (config) => {
      const el = new (Card())();
      expect(() => el.setConfig(config)).toThrow(/valid entity/i);
    }
  );

  it("applies the corrections and warns once per correction", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const el = new (Card())();
    el.setConfig({ entity: "sensor.x", theme: "lake", target_budget: -1 });
    expect(el._config.theme).toBe("freshwater");
    expect(el._config.target_budget).toBe(50);
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.mock.calls[0][0]).toContain("[shower-aquarium-card]");
  });

  it("stays silent for a valid configuration", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    new (Card())().setConfig({ entity: "sensor.x", theme: "saltwater", fish_count: 6 });
    expect(warn).not.toHaveBeenCalled();
  });

  it("the physics receives coherent thresholds even from a contradictory configuration", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const el = new (Card())();
    el.setConfig({ entity: "sensor.x", temp_boiling_threshold: 50, temp_deadly_threshold: 40 });
    expect(el._config.temp_deadly_threshold).toBeGreaterThan(el._config.temp_boiling_threshold);
  });
});

// ---------------------------------------------------------------------------
describe("fillTemplate() and formatNumber()", () => {
  it("fills every placeholder", () => {
    expect(fillTemplate("{a} of {b}", { a: 1, b: 2 })).toBe("1 of 2");
  });

  it("fills a placeholder used several times", () => {
    expect(fillTemplate("{a}{a}", { a: "x" })).toBe("xx");
  });

  it("leaves unknown placeholders visible", () => {
    expect(fillTemplate("{a} {missing}", { a: 1 })).toBe("1 {missing}");
  });

  it("accepts a template without placeholders", () => {
    expect(fillTemplate("plain", { a: 1 })).toBe("plain");
  });

  it("formats with the requested number of decimals and language", () => {
    expect(formatNumber(12, "en")).toBe("12.0");
    expect(formatNumber(12.34, "en", 0)).toBe("12");
    expect(formatNumber(12.34, "fr")).toBe("12,3");
  });

  it("falls back to toFixed for an invalid locale", () => {
    expect(formatNumber(1.25, "not a locale!!", 1)).toBe("1.3");
  });
});

// ---------------------------------------------------------------------------
async function mount(config = {}, volume = 12, temp, language = "en") {
  const el = new (Card())();
  el.setConfig({ entity: "sensor.shower_volume", temperature_entity: "sensor.shower_temp", ...config });
  const states = { "sensor.shower_volume": { state: String(volume), last_changed: new Date().toISOString() } };
  if (temp !== undefined) states["sensor.shower_temp"] = { state: String(temp), last_changed: new Date().toISOString() };
  el.hass = { language, states };
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const label = (el) => el.shadowRoot.querySelector("svg").getAttribute("aria-label");

describe("text alternative of the picture", () => {
  it("marks the picture as an image with a label", async () => {
    const el = await mount({}, 12);
    const svg = el.shadowRoot.querySelector("svg");
    expect(svg.getAttribute("role")).toBe("img");
    expect(label(el)).toBeTruthy();
  });

  it("describes the volume without a temperature when none is known", async () => {
    const el = await mount({ target_budget: 50 }, 12);
    expect(label(el)).toBe("Shower aquarium: 12.0 L used out of 50 L.");
  });

  it("adds the temperature when it is known", async () => {
    const el = await mount({ target_budget: 50 }, 12, 38.5);
    expect(label(el)).toBe("Shower aquarium: 12.0 L used out of 50 L, water at 38.5 \u00b0C.");
  });

  it("says when the target volume is exceeded", async () => {
    const el = await mount({ target_budget: 50, survival_volume: 10 }, 55, 30);
    expect(label(el)).toContain(enTranslations.aria_over_budget);
    expect(label(el)).not.toContain(enTranslations.aria_dead);
  });

  it("says when the animals have died (too hot)", async () => {
    const el = await mount({}, 5, 50);
    expect(label(el)).toContain(enTranslations.aria_dead);
  });

  it("says when the animals have died (empty tank) and not also over budget", async () => {
    const el = await mount({ target_budget: 50, survival_volume: 10 }, 70, 30);
    expect(label(el)).toContain(enTranslations.aria_dead);
    expect(label(el)).not.toContain(enTranslations.aria_over_budget);
  });

  it("is written in the language of the user, with its number format", async () => {
    const el = await mount({ target_budget: 50 }, 12.5, undefined, "fr");
    expect(label(el)).toBe("Aquarium de douche : 12,5 L utilis\u00e9s sur 50 L.");
    expect(label(el)).toContain(frTranslations.aria_summary.split(":")[0]);
  });

  it("follows the data", async () => {
    const el = await mount({ target_budget: 50 }, 12);
    el.hass = { language: "en", states: { "sensor.shower_volume": { state: "20", last_changed: new Date().toISOString() } } };
    await el.updateComplete;
    expect(label(el)).toContain("20.0 L");
  });

  it.each(["aria_summary", "aria_summary_temperature"])("%s keeps its placeholders in both languages", (key) => {
    for (const dict of [enTranslations, frTranslations]) {
      expect(dict[key]).toContain("{consumed}");
      expect(dict[key]).toContain("{target}");
    }
    expect(enTranslations.aria_summary_temperature).toContain("{temperature}");
    expect(frTranslations.aria_summary_temperature).toContain("{temperature}");
  });
});

// ---------------------------------------------------------------------------
describe("getGridOptions() (sections view)", () => {
  it("takes the full width by default and never less than half a section", () => {
    const el = new (Card())();
    el.setConfig({ entity: "sensor.x" });
    expect(el.getGridOptions()).toEqual({ columns: 12, min_columns: 6 });
  });

  it("leaves the height to the content in normal mode", () => {
    const el = new (Card())();
    el.setConfig({ entity: "sensor.x" });
    expect(el.getGridOptions()).not.toHaveProperty("rows");
  });

  it("declares rows in fullscreen mode, where the card fills its slot", () => {
    const el = new (Card())();
    el.setConfig({ entity: "sensor.x", fullscreen: true });
    expect(el.getGridOptions()).toEqual({ columns: 12, min_columns: 6, rows: 8, min_rows: 4 });
  });

  it("works before a configuration is set", () => {
    expect(new (Card())().getGridOptions()).toEqual({ columns: 12, min_columns: 6 });
  });

  it("keeps a valid minimum below the default", () => {
    const options = new (Card())().getGridOptions();
    expect(options.min_columns).toBeLessThanOrEqual(options.columns);
  });
});
