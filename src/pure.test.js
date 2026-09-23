import { describe, it, expect } from "vitest";
import {
  THEME_PRESETS,
  getTheme,
  computeCanvasHeight,
  computeCachedMetrics,
  assignSpecies,
  generateDefaultFishes,
  computeTankState,
  computeGaugeState,
} from "./pure.js";

describe("getTheme", () => {
  it("returns the matching preset for a known theme key", () => {
    expect(getTheme("saltwater")).toBe(THEME_PRESETS.saltwater);
  });

  it("falls back to freshwater for an unknown or missing theme key", () => {
    expect(getTheme("nope")).toBe(THEME_PRESETS.freshwater);
    expect(getTheme(undefined)).toBe(THEME_PRESETS.freshwater);
  });
});

describe("computeCanvasHeight", () => {
  it("uses the configured aspect ratio (1024x600 -> ~600)", () => {
    expect(computeCanvasHeight({ aspect_ratio_width: 1024, aspect_ratio_height: 600 })).toBe(600);
  });

  it("defaults to 1024x600 when config is missing or the fields are absent", () => {
    expect(computeCanvasHeight({})).toBe(600);
    expect(computeCanvasHeight(undefined)).toBe(600);
  });

  it("clamps to a minimum of 400, even for a very wide/short ratio", () => {
    expect(computeCanvasHeight({ aspect_ratio_width: 4000, aspect_ratio_height: 1 })).toBe(400);
  });

  it("clamps to a maximum of 2048, even for a very tall ratio", () => {
    expect(computeCanvasHeight({ aspect_ratio_width: 1, aspect_ratio_height: 4000 })).toBe(2048);
  });

  it("falls back to the default ratio for non-numeric width/height", () => {
    expect(computeCanvasHeight({ aspect_ratio_width: "abc", aspect_ratio_height: "xyz" })).toBe(600);
  });
});

describe("computeCachedMetrics", () => {
  it("returns all zeros (and the configured defaults) when hass or config is missing", () => {
    expect(computeCachedMetrics(null, { target_budget: 50, survival_volume: 10 })).toEqual({
      consumedVolume: 0,
      hoursSinceLastShower: 0,
      temperature: 0,
      targetBudget: 50,
      survivalVolume: 10,
    });
    expect(computeCachedMetrics({ states: {} }, null)).toEqual({
      consumedVolume: 0,
      hoursSinceLastShower: 0,
      temperature: 0,
      targetBudget: 50,
      survivalVolume: 10,
    });
  });

  it("reads the consumed volume from the configured entity's state", () => {
    const hass = { states: { "sensor.shower": { state: "23.5" } } };
    const metrics = computeCachedMetrics(hass, { entity: "sensor.shower" });
    expect(metrics.consumedVolume).toBe(23.5);
  });

  it("clamps a negative volume reading to 0, and a non-numeric one to 0 (not NaN)", () => {
    const hassNegative = { states: { "sensor.shower": { state: "-5" } } };
    expect(computeCachedMetrics(hassNegative, { entity: "sensor.shower" }).consumedVolume).toBe(0);

    const hassUnavailable = { states: { "sensor.shower": { state: "unavailable" } } };
    expect(computeCachedMetrics(hassUnavailable, { entity: "sensor.shower" }).consumedVolume).toBe(0);
  });

  it("computes hoursSinceLastShower from last_changed", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const hass = { states: { "sensor.shower": { state: "10", last_changed: twoHoursAgo } } };
    const metrics = computeCachedMetrics(hass, { entity: "sensor.shower" });
    expect(metrics.hoursSinceLastShower).toBeGreaterThan(1.9);
    expect(metrics.hoursSinceLastShower).toBeLessThan(2.1);
  });

  it("reads the water temperature from temperature_entity when provided", () => {
    const hass = { states: { "sensor.temp": { state: "38.2" } } };
    const metrics = computeCachedMetrics(hass, { temperature_entity: "sensor.temp" });
    expect(metrics.temperature).toBe(38.2);
  });

  it("temperature reading is 0 (not NaN) when temperature_entity's state is non-numeric", () => {
    const hass = { states: { "sensor.temp": { state: "unavailable" } } };
    const metrics = computeCachedMetrics(hass, { temperature_entity: "sensor.temp" });
    expect(metrics.temperature).toBe(0);
  });

  it("target_budget_entity overrides the static target_budget config value", () => {
    const hass = { states: { "input_number.target": { state: "75" } } };
    const metrics = computeCachedMetrics(hass, { target_budget_entity: "input_number.target", target_budget: 50 });
    expect(metrics.targetBudget).toBe(75);
  });

  it("falls back to the static target_budget when target_budget_entity's state is non-numeric", () => {
    const hass = { states: { "input_number.target": { state: "unknown" } } };
    const metrics = computeCachedMetrics(hass, { target_budget_entity: "input_number.target", target_budget: 50 });
    expect(metrics.targetBudget).toBe(50);
  });

  it("survivalVolume always comes from config, never from an entity (there is no such entity option)", () => {
    const metrics = computeCachedMetrics({ states: {} }, { survival_volume: 15 });
    expect(metrics.survivalVolume).toBe(15);
  });
});

describe("assignSpecies", () => {
  it("saltwater: indices 0-1 are species 0 (the clownfish pair)", () => {
    expect(assignSpecies(0, "saltwater")).toBe(0);
    expect(assignSpecies(1, "saltwater")).toBe(0);
  });

  it("saltwater: index 2 is species 1, index 3 is species 3, everything else is species 2", () => {
    expect(assignSpecies(2, "saltwater")).toBe(1);
    expect(assignSpecies(3, "saltwater")).toBe(3);
    expect(assignSpecies(4, "saltwater")).toBe(2);
    expect(assignSpecies(9, "saltwater")).toBe(2);
  });

  it("coldwater: cycles through 3 species (index % 3)", () => {
    expect([0, 1, 2, 3, 4, 5].map((i) => assignSpecies(i, "coldwater"))).toEqual([0, 1, 2, 0, 1, 2]);
  });

  it("freshwater (and any other/unknown theme): cycles through 4 species (index % 4)", () => {
    expect([0, 1, 2, 3, 4, 5].map((i) => assignSpecies(i, "freshwater"))).toEqual([0, 1, 2, 3, 0, 1]);
    expect(assignSpecies(4, "some-future-theme")).toBe(0);
  });
});

describe("generateDefaultFishes", () => {
  it("clamps the count to between 1 and 10", () => {
    // Note: 0 is falsy in JS, so `Number(count) || 4` treats a count of 0
    // the same as a missing count -- it falls back to 4, it does not clamp
    // to 1. This matches the original code's behavior faithfully; a
    // negative count is what actually exercises the clamp to 1.
    expect(generateDefaultFishes(0, "freshwater")).toHaveLength(4);
    expect(generateDefaultFishes(-3, "freshwater")).toHaveLength(1);
    expect(generateDefaultFishes(50, "freshwater")).toHaveLength(10);
  });

  it("falls back to 4 fish for a non-numeric count", () => {
    expect(generateDefaultFishes("abc", "freshwater")).toHaveLength(4);
  });

  it("each fish's species matches assignSpecies(index, themeKey), not a hardcoded scheme", () => {
    const fishes = generateDefaultFishes(6, "coldwater");
    fishes.forEach((fish, index) => {
      expect(fish.species).toBe(assignSpecies(index, "coldwater"));
    });
  });

  it("colors cycle through the theme's own palette, not a fixed color list", () => {
    const fishes = generateDefaultFishes(3, "saltwater");
    fishes.forEach((fish, index) => {
      expect(fish.color).toBe(THEME_PRESETS.saltwater.palette[index % THEME_PRESETS.saltwater.palette.length]);
    });
  });

  it("saltwater clownfish (species 0) get fixed anemone-side positions, not the jittered general layout", () => {
    const fishes = generateDefaultFishes(4, "saltwater");
    // Indices 0 and 1 are species 0 (clownfish) per assignSpecies.
    expect(fishes[0].species).toBe(0);
    expect(fishes[0].x).toBe(190);
    expect(fishes[0].y).toBe(470);
    expect(fishes[1].x).toBe(330); // 190 + 1*140
  });

  it("every fish starts with deathProgress: 0 (alive)", () => {
    generateDefaultFishes(5, "freshwater").forEach((fish) => expect(fish.deathProgress).toBe(0));
  });
});

describe("computeTankState", () => {
  const baseConfig = { target_budget: 50, survival_volume: 10, temp_boiling_threshold: 40, temp_deadly_threshold: 45 };
  const baseMetrics = { consumedVolume: 0, temperature: 20, targetBudget: 50, survivalVolume: 10 };

  it("healthy tank: not dead, not boiling, not stressed, normal speed", () => {
    const state = computeTankState({ config: baseConfig, metrics: baseMetrics, canvasHeight: 600 });
    expect(state.isDead).toBe(false);
    expect(state.isBoiling).toBe(false);
    expect(state.speedMultiplier).toBeCloseTo(1.2, 5); // default fish_speed_multiplier
  });

  it("falls back to the default 40°C/45°C thresholds when config doesn't provide them", () => {
    const state = computeTankState({
      config: { target_budget: 50, survival_volume: 10 }, // no temp_boiling_threshold/temp_deadly_threshold
      metrics: baseMetrics,
      canvasHeight: 600,
    });
    expect(state.boilTemp).toBe(40);
    expect(state.deadlyTemp).toBe(45);
  });

  it("isDead via temperature: true once temperature reaches temp_deadly_threshold", () => {
    const state = computeTankState({
      config: baseConfig,
      metrics: { ...baseMetrics, temperature: 45 },
      canvasHeight: 600,
    });
    expect(state.isHeatDead).toBe(true);
    expect(state.isDead).toBe(true);
  });

  it("isDead via temperature: false just under the threshold", () => {
    const state = computeTankState({
      config: baseConfig,
      metrics: { ...baseMetrics, temperature: 44.9 },
      canvasHeight: 600,
    });
    expect(state.isHeatDead).toBe(false);
    expect(state.isDead).toBe(false);
  });

  it("isDead via water depletion: true once consumedVolume drains the tank (target + survival)", () => {
    const state = computeTankState({
      config: baseConfig,
      metrics: { ...baseMetrics, consumedVolume: 60 }, // 50 target + 10 survival = 60
      canvasHeight: 600,
    });
    expect(state.isWaterDead).toBe(true);
    expect(state.isDead).toBe(true);
  });

  it("a temperature of exactly 0 never counts as heat-dead or boiling (treated as 'no reading', not freezing)", () => {
    const state = computeTankState({ config: baseConfig, metrics: { ...baseMetrics, temperature: 0 }, canvasHeight: 600 });
    expect(state.isHeatDead).toBe(false);
    expect(state.isBoiling).toBe(false);
  });

  it("isBoiling: true at/above temp_boiling_threshold (and below deadly)", () => {
    const state = computeTankState({ config: baseConfig, metrics: { ...baseMetrics, temperature: 40 }, canvasHeight: 600 });
    expect(state.isBoiling).toBe(true);
    expect(state.isDead).toBe(false);
  });

  it("isCritical: consumed volume over budget, but not dead", () => {
    const state = computeTankState({ config: baseConfig, metrics: { ...baseMetrics, consumedVolume: 51 }, canvasHeight: 600 });
    expect(state.isCritical).toBe(true);
    expect(state.isWarning).toBe(false);
  });

  it("isWarning: over 70% of budget but not yet critical", () => {
    const state = computeTankState({ config: baseConfig, metrics: { ...baseMetrics, consumedVolume: 36 }, canvasHeight: 600 }); // 72% of 50
    expect(state.isWarning).toBe(true);
    expect(state.isCritical).toBe(false);
  });

  it("speedMultiplier doubles (x2) when stressed (over budget or boiling), scaled by fish_speed_multiplier", () => {
    const stressed = computeTankState({
      config: { ...baseConfig, fish_speed_multiplier: 1 },
      metrics: { ...baseMetrics, consumedVolume: 51 },
      canvasHeight: 600,
    });
    expect(stressed.speedMultiplier).toBeCloseTo(2.0, 5);
  });

  it("a dead tank is never also 'stressed' for speed purposes -- death stops movement, it doesn't speed it up", () => {
    const state = computeTankState({
      config: { ...baseConfig, fish_speed_multiplier: 1 },
      metrics: { ...baseMetrics, temperature: 45, consumedVolume: 51 }, // both dead AND over budget
      canvasHeight: 600,
    });
    expect(state.isDead).toBe(true);
    expect(state.speedMultiplier).toBeCloseTo(1.0, 5);
  });

  it("fullscreen mode uses a fixed 600px tank bottom, ignoring canvasHeight", () => {
    const state = computeTankState({
      config: { ...baseConfig, fullscreen: true },
      metrics: baseMetrics,
      canvasHeight: 1200,
    });
    expect(state.tankTop).toBe(0);
    expect(state.tankBottom).toBe(600);
  });

  it("non-fullscreen mode derives the tank bottom from canvasHeight (canvasHeight - 35)", () => {
    const state = computeTankState({ config: baseConfig, metrics: baseMetrics, canvasHeight: 600 });
    expect(state.tankTop).toBe(15);
    expect(state.tankBottom).toBe(565);
  });

  it("a full tank (0 consumed) has waterRatio 1 and the surface at the very top of the tank", () => {
    const state = computeTankState({ config: baseConfig, metrics: baseMetrics, canvasHeight: 600 });
    expect(state.waterRatio).toBeCloseTo(1, 5);
    expect(state.waterSurfaceY).toBeCloseTo(state.tankTop, 5);
  });

  it("a drained tank (isWaterDead) has waterRatio 0 and the surface at the tank bottom", () => {
    const state = computeTankState({ config: baseConfig, metrics: { ...baseMetrics, consumedVolume: 60 }, canvasHeight: 600 });
    expect(state.waterRatio).toBe(0);
    expect(state.waterSurfaceY).toBeCloseTo(state.tankBottom, 5);
  });

  it("a zero total capacity (target_budget and survival_volume both 0) doesn't divide by zero -- waterRatio is 0, not NaN or Infinity", () => {
    const state = computeTankState({
      config: { ...baseConfig, target_budget: 0, survival_volume: 0 },
      metrics: { ...baseMetrics, targetBudget: 0, survivalVolume: 0 },
      canvasHeight: 600,
    });
    expect(state.waterRatio).toBe(0);
    expect(Number.isFinite(state.waterSurfaceY)).toBe(true);
  });
});

describe("computeGaugeState", () => {
  const base = { currentTemp: 20, currentVolume: 10, targetBudget: 50, deadlyTemp: 45, boilTemp: 40 };

  it("normal temperature: blue gauge, fraction proportional to 45°C max", () => {
    const { tempColor, tempFraction } = computeGaugeState(base);
    expect(tempColor).toBe("#0284c7");
    expect(tempFraction).toBeCloseTo(20 / 45, 5);
  });

  it("temperature >= 38 but under boiling: amber", () => {
    expect(computeGaugeState({ ...base, currentTemp: 38 }).tempColor).toBe("#f59e0b");
  });

  it("temperature >= boiling threshold but under deadly: orange", () => {
    expect(computeGaugeState({ ...base, currentTemp: 40 }).tempColor).toBe("#f97316");
  });

  it("temperature >= deadly threshold: red", () => {
    expect(computeGaugeState({ ...base, currentTemp: 45 }).tempColor).toBe("#ef4444");
  });

  it("temperature fraction is capped at 1 even far above 45°C", () => {
    expect(computeGaugeState({ ...base, currentTemp: 90 }).tempFraction).toBe(1);
  });

  it("volume under 70% of budget: blue", () => {
    expect(computeGaugeState({ ...base, currentVolume: 20 }).volColor).toBe("#0284c7"); // 40%
  });

  it("volume over 70% of budget but under it: amber", () => {
    expect(computeGaugeState({ ...base, currentVolume: 40 }).volColor).toBe("#f59e0b"); // 80%
  });

  it("volume over budget: red", () => {
    expect(computeGaugeState({ ...base, currentVolume: 60 }).volColor).toBe("#ef4444");
  });

  it("volume fraction never divides by zero for a 0 target budget (falls back to dividing by 1)", () => {
    expect(() => computeGaugeState({ ...base, targetBudget: 0 })).not.toThrow();
    expect(computeGaugeState({ ...base, targetBudget: 0, currentVolume: 0 }).volFraction).toBe(0);
  });
});
