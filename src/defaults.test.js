// @vitest-environment happy-dom
// The defaults are written once (defaults.js). These tests make sure everything
// that needs them really reads them from there.
import { describe, it, expect } from "vitest";
import "./shower-aquarium-card.js";
import { CONFIG_DEFAULTS } from "./defaults.js";
import { editorFields } from "./card-editor.js";
import { normalizeConfig, computeCachedMetrics, computeCanvasHeight, DEFAULT_COMFORT_TEMP, DEFAULT_SURVIVAL_VOLUME } from "./pure.js";

const Card = () => customElements.get("shower-aquarium-card");

describe("CONFIG_DEFAULTS", () => {
  it("cannot be changed by accident", () => {
    expect(Object.isFrozen(CONFIG_DEFAULTS)).toBe(true);
  });

  it("has an editor field for every default, and no default is missing for a field that has one", () => {
    // The title has a default (no title) but no default in the form: an empty text box says it.
    const fields = editorFields().filter((f) => f.default !== undefined).map((f) => f.name).sort();
    expect(fields).toEqual(Object.keys(CONFIG_DEFAULTS).filter((key) => key !== "title").sort());
  });

  it("is what the editor shows as the default of each field", () => {
    for (const field of editorFields()) {
      if (field.default === undefined) continue;
      expect(field.default, field.name).toBe(CONFIG_DEFAULTS[field.name]);
    }
  });

  it("is what a card without options starts from", () => {
    const el = new (Card())();
    el.setConfig({ entity: "sensor.x" });
    expect(el._config).toEqual({ entity: "sensor.x", ...CONFIG_DEFAULTS });
  });

  it("has no switch for the cost in fullscreen any more: one show_cost does both", () => {
    expect(CONFIG_DEFAULTS).not.toHaveProperty("cost_in_fullscreen");
  });

  it("is what the card picker starts from", () => {
    const stub = Card().getStubConfig({}, ["sensor.hydrao_shower_volume"]);
    for (const [key, value] of Object.entries(stub)) {
      if (key in CONFIG_DEFAULTS) expect(value, key).toBe(CONFIG_DEFAULTS[key]);
    }
  });

  it("is what an invalid number falls back to, for every numeric option", () => {
    const numeric = Object.entries(CONFIG_DEFAULTS).filter(([, v]) => typeof v === "number");
    expect(numeric.length).toBeGreaterThan(8);
    for (const [key, value] of numeric) {
      if (key === "comfort_temp_min") continue; // pulled below the boiling threshold when it does not fit
      const { config } = normalizeConfig({ entity: "sensor.x", [key]: "not a number" });
      expect(config[key], key).toBe(value);
    }
  });

  it("is what the calculations use when the options are missing", () => {
    expect(computeCachedMetrics({ states: {} }, {}).targetBudget).toBe(CONFIG_DEFAULTS.target_budget);
    expect(computeCachedMetrics({ states: {} }, {}).survivalVolume).toBe(CONFIG_DEFAULTS.survival_volume);
    expect(computeCachedMetrics({ states: {} }, {}).comfortMin).toBe(CONFIG_DEFAULTS.comfort_temp_min);
    expect(DEFAULT_SURVIVAL_VOLUME).toBe(CONFIG_DEFAULTS.survival_volume);
    expect(DEFAULT_COMFORT_TEMP).toBe(CONFIG_DEFAULTS.comfort_temp_min);
    const ratio = CONFIG_DEFAULTS.aspect_ratio_height / CONFIG_DEFAULTS.aspect_ratio_width;
    expect(computeCanvasHeight({})).toBe(Math.round(1024 * ratio));
  });
});
