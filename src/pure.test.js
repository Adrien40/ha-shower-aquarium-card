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

import {
  createFlowTracker,
  trackFlow,
  flowTarget,
  isShowerOver,
  qualifiesForCelebration,
  flowBubbleCount,
  classifyTap,
  computeScareKick,
  pickFoodTarget,
  createFlakes,
  celebrationScale,
  celebrationOpacity,
  FLOW_ACTIVE_WINDOW_MS,
} from "./pure.js";

describe("flow tracking", () => {
  it("ignores the very first sample (no phantom shower on load)", () => {
    const s = trackFlow(createFlowTracker(), 36, 1000);
    expect(s.lastVolume).toBe(36);
    expect(s.showerActive).toBe(false);
    expect(flowTarget(s, 1500)).toBe(0);
  });

  it("starts a shower on the first increase with a medium intensity", () => {
    let s = trackFlow(createFlowTracker(), 0, 0);
    s = trackFlow(s, 1, 1000);
    expect(s.showerActive).toBe(true);
    expect(flowTarget(s, 1500)).toBe(0.5);
  });

  it("infers a higher intensity from a faster volume growth", () => {
    let s = trackFlow(createFlowTracker(), 0, 0);
    s = trackFlow(s, 1, 1000);
    s = trackFlow(s, 2, 4000); // 1 L in 3 s = 20 L/min -> capped at 1
    expect(flowTarget(s, 4100)).toBe(1);
    s = trackFlow(s, 2.5, 10000); // 0.5 L in 6 s = 5 L/min -> 0.5
    expect(flowTarget(s, 10100)).toBeCloseTo(0.5, 5);
  });

  it("drops to zero after the activity window and reports the shower as over", () => {
    let s = trackFlow(createFlowTracker(), 0, 0);
    s = trackFlow(s, 1, 1000);
    expect(isShowerOver(s, 1000 + FLOW_ACTIVE_WINDOW_MS - 1)).toBe(false);
    expect(flowTarget(s, 1000 + FLOW_ACTIVE_WINDOW_MS)).toBe(0);
    expect(isShowerOver(s, 1000 + FLOW_ACTIVE_WINDOW_MS)).toBe(true);
  });

  it("resets when the counter goes back down", () => {
    let s = trackFlow(createFlowTracker(), 0, 0);
    s = trackFlow(s, 20, 1000);
    s = trackFlow(s, 0, 2000);
    expect(s.showerActive).toBe(false);
    expect(s.lastVolume).toBe(0);
  });

  it("only celebrates a living tank that stayed within budget", () => {
    expect(qualifiesForCelebration(20, 36, false)).toBe(true);
    expect(qualifiesForCelebration(36, 36, false)).toBe(true);
    expect(qualifiesForCelebration(37, 36, false)).toBe(false);
    expect(qualifiesForCelebration(0, 36, false)).toBe(false);
    expect(qualifiesForCelebration(20, 36, true)).toBe(false);
  });

  it("scales the bubble stream with the intensity", () => {
    expect(flowBubbleCount(0)).toBe(0);
    expect(flowBubbleCount(0.01)).toBe(0);
    expect(flowBubbleCount(0.5)).toBeGreaterThan(flowBubbleCount(0.25));
    expect(flowBubbleCount(1)).toBe(36);
  });
});

describe("tap interactions", () => {
  it("feeds near the surface and knocks deeper in the tank", () => {
    expect(classifyTap(100, 120)).toBe("feed");
    expect(classifyTap(160, 120)).toBe("feed");
    expect(classifyTap(300, 120)).toBe("knock");
  });

  it("pushes fish away from the knock, harder when closer", () => {
    const near = computeScareKick(500, 300, 450, 300);
    const far = computeScareKick(700, 300, 450, 300);
    expect(near.kx).toBeGreaterThan(0);
    expect(near.scare).toBeGreaterThan(far.scare);
    expect(Math.hypot(near.kx, near.ky)).toBeGreaterThan(Math.hypot(far.kx, far.ky));
    expect(computeScareKick(900, 300, 450, 300)).toBeNull();
  });

  it("handles a knock exactly on a fish without dividing by zero", () => {
    const k = computeScareKick(400, 300, 400, 300, 280, () => 0.25);
    expect(Number.isFinite(k.kx)).toBe(true);
    expect(Number.isFinite(k.ky)).toBe(true);
  });

  it("picks the closest uneaten flake within range", () => {
    const flakes = [
      { x: 300, y: 200, eaten: false },
      { x: 120, y: 210, eaten: true },
      { x: 700, y: 200, eaten: false },
    ];
    expect(pickFoodTarget(100, 200, flakes)).toBe(flakes[0]);
    expect(pickFoodTarget(100, 200, [flakes[1]])).toBeNull();
    expect(pickFoodTarget(100, 200, [flakes[2]])).toBeNull();
  });

  it("drops the requested number of flakes around the tap", () => {
    const flakes = createFlakes(500, 100, 5, () => 0.5);
    expect(flakes).toHaveLength(5);
    flakes.forEach((f) => {
      expect(f.eaten).toBe(false);
      expect(Math.abs(f.x - 500)).toBeLessThanOrEqual(35);
    });
  });
});

describe("celebration curves", () => {
  it("pops from 0, overshoots, then settles at 1", () => {
    expect(celebrationScale(0)).toBeCloseTo(0, 5);
    const peak = Math.max(...[100, 200, 300, 400, 500, 600].map(celebrationScale));
    expect(peak).toBeGreaterThan(1);
    expect(celebrationScale(900)).toBeCloseTo(1, 5);
    expect(celebrationScale(5000)).toBeCloseTo(1, 5);
  });

  it("stays opaque then fades out at the end", () => {
    expect(celebrationOpacity(1000)).toBe(1);
    expect(celebrationOpacity(7000)).toBe(0);
    expect(celebrationOpacity(6300)).toBeGreaterThan(0);
    expect(celebrationOpacity(6300)).toBeLessThan(1);
  });
});

import {
  isNightFromEntity,
  estimateEnergyKwh,
  computeShowerCost,
  formatEuro,
} from "./pure.js";

describe("night detection", () => {
  it("uses sun.sun below_horizon", () => {
    expect(isNightFromEntity("sun.sun", { state: "below_horizon" })).toBe(true);
    expect(isNightFromEntity("sun.sun", { state: "above_horizon" })).toBe(false);
  });

  it("treats an 'on' binary sensor / boolean as night", () => {
    expect(isNightFromEntity("binary_sensor.night", { state: "on" })).toBe(true);
    expect(isNightFromEntity("input_boolean.night", { state: "off" })).toBe(false);
  });

  it("compares an illuminance sensor to the threshold", () => {
    expect(isNightFromEntity("sensor.lux", { state: "5" }, 20)).toBe(true);
    expect(isNightFromEntity("sensor.lux", { state: "300" }, 20)).toBe(false);
    expect(isNightFromEntity("sensor.lux", { state: "unavailable" }, 20)).toBe(false);
  });

  it("is off without an entity or state", () => {
    expect(isNightFromEntity("", { state: "on" })).toBe(false);
    expect(isNightFromEntity("sun.sun", undefined)).toBe(false);
  });
});

describe("cost estimation", () => {
  it("computes heating energy from volume and temperature rise", () => {
    // 100 L heated by 30 K = 100 * 30 * 4.186 / 3600 kWh
    expect(estimateEnergyKwh(100, 45, 15)).toBeCloseTo(3.4883, 3);
    expect(estimateEnergyKwh(50, 15, 15)).toBe(0);
    expect(estimateEnergyKwh(0, 40, 15)).toBe(0);
  });

  it("adds water and energy costs", () => {
    const c = computeShowerCost({
      volumeL: 50,
      energyKwh: 2,
      waterPricePerM3: 4,
      energyPricePerKwh: 0.25,
    });
    expect(c.water).toBeCloseTo(0.2, 5);
    expect(c.energy).toBeCloseTo(0.5, 5);
    expect(c.total).toBeCloseTo(0.7, 5);
  });

  it("formats euros for the given language", () => {
    expect(formatEuro(0.7, "fr")).toContain("0,70");
    expect(formatEuro(0.7, "en")).toContain("0.70");
  });
});
