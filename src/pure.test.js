import { describe, it, expect } from "vitest";
import {
  THEME_PRESETS,
  getTheme,
  computeCanvasHeight,
  computeCachedMetrics,
  assignSpecies,
  generateDefaultFishes,
  BLUE_TANG_SIZE_FACTOR,
  CLOWNFISH_SCALES,
  DISCUS_SIZE_FACTOR,
  DISCUS_SPEED_FACTOR,
  computeTankState,
  computeGaugeState,
  temperatureScale,
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
    expect(computeCachedMetrics(null, { target_budget: 50, survival_volume: 5 })).toEqual({
      consumedVolume: 0,
      hoursSinceLastShower: 0,
      temperature: 0,
      targetBudget: 50,
      survivalVolume: 5,
      comfortMin: 33,
      sensorMissing: false,
      lastReading: null,
    });
    expect(computeCachedMetrics({ states: {} }, null)).toEqual({
      consumedVolume: 0,
      hoursSinceLastShower: 0,
      temperature: 0,
      targetBudget: 50,
      survivalVolume: 5,
      comfortMin: 33,
      sensorMissing: false,
      lastReading: null,
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

  describe("a volume sensor without a usable value", () => {
    const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
    const config = { entity: "sensor.shower" };
    const hassWith = (state, lastChanged) => ({ states: { "sensor.shower": { state, last_changed: lastChanged } } });
    const good = () => computeCachedMetrics(hassWith("23", hoursAgo(5)), config);

    it("has no reading yet when the very first state is unusable (volume 0, no algae clock)", () => {
      const metrics = computeCachedMetrics(hassWith("unavailable", hoursAgo(0)), config);
      expect(metrics.consumedVolume).toBe(0);
      expect(metrics.hoursSinceLastShower).toBe(0);
      expect(metrics.lastReading).toBeNull();
      expect(metrics.sensorMissing).toBe(true);
    });

    it("flags the sensor as missing while it has no usable value, and not otherwise", () => {
      expect(good().sensorMissing).toBe(false);
      expect(computeCachedMetrics(hassWith("unavailable", hoursAgo(0)), config, good()).sensorMissing).toBe(true);
      expect(computeCachedMetrics({ states: {} }, config, good()).sensorMissing).toBe(true);
      expect(computeCachedMetrics(hassWith("unknown", hoursAgo(0)), config).sensorMissing).toBe(true);
    });

    it.each(["unavailable", "unknown", "", "abc"])("keeps the last reading when the state becomes %j", (state) => {
      const metrics = computeCachedMetrics(hassWith(state, hoursAgo(0)), config, good());
      expect(metrics.consumedVolume).toBe(23);
      expect(metrics.hoursSinceLastShower).toBeGreaterThan(4.9);
      expect(metrics.hoursSinceLastShower).toBeLessThan(5.1);
    });

    it("keeps the last reading when the entity disappears from hass.states", () => {
      const metrics = computeCachedMetrics({ states: {} }, config, good());
      expect(metrics.consumedVolume).toBe(23);
      expect(metrics.lastReading?.volume).toBe(23);
    });

    it("keeps the reading through several unusable states in a row", () => {
      const first = computeCachedMetrics(hassWith("unavailable", hoursAgo(0)), config, good());
      const second = computeCachedMetrics(hassWith("unknown", hoursAgo(0)), config, first);
      expect(second.consumedVolume).toBe(23);
      expect(second.hoursSinceLastShower).toBeGreaterThan(4.9);
    });

    it("keeps the older time when the sensor comes back with the same value", () => {
      const metrics = computeCachedMetrics(hassWith("23", hoursAgo(0)), config, good());
      expect(metrics.consumedVolume).toBe(23);
      expect(metrics.hoursSinceLastShower).toBeGreaterThan(4.9);
    });

    it("takes the new time when the sensor comes back with another value", () => {
      const metrics = computeCachedMetrics(hassWith("40", hoursAgo(0)), config, good());
      expect(metrics.consumedVolume).toBe(40);
      expect(metrics.hoursSinceLastShower).toBeLessThan(0.1);
    });

    it("takes the new time when the previous reading had no usable time", () => {
      const before = computeCachedMetrics({ states: { "sensor.shower": { state: "23" } } }, config);
      expect(before.lastReading).toEqual({ volume: 23, changedMs: null });
      const metrics = computeCachedMetrics(hassWith("23", hoursAgo(1)), config, before);
      expect(metrics.hoursSinceLastShower).toBeGreaterThan(0.9);
      expect(metrics.hoursSinceLastShower).toBeLessThan(1.1);
    });

    it("counts no hours when last_changed is missing or not a date (never NaN)", () => {
      const missing = computeCachedMetrics({ states: { "sensor.shower": { state: "23" } } }, config);
      const broken = computeCachedMetrics(hassWith("23", "not a date"), config);
      expect(missing.hoursSinceLastShower).toBe(0);
      expect(broken.hoursSinceLastShower).toBe(0);
      expect(broken.lastReading).toEqual({ volume: 23, changedMs: null });
    });

    it("still reads the temperature and the budget while the volume sensor is broken", () => {
      const hass = {
        states: {
          "sensor.shower": { state: "unavailable" },
          "sensor.temp": { state: "38" },
          "input_number.target": { state: "80" },
        },
      };
      const metrics = computeCachedMetrics(
        hass,
        { ...config, temperature_entity: "sensor.temp", target_budget_entity: "input_number.target" },
        good()
      );
      expect(metrics.consumedVolume).toBe(23);
      expect(metrics.temperature).toBe(38);
      expect(metrics.targetBudget).toBe(80);
    });
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

  it.each(["0", "-20", "-0.5"])("ignores a target_budget_entity value of %s and keeps the static target_budget", (state) => {
    const hass = { states: { "input_number.target": { state } } };
    const metrics = computeCachedMetrics(hass, { target_budget_entity: "input_number.target", target_budget: 50 });
    expect(metrics.targetBudget).toBe(50);
  });

  describe("comfort temperature", () => {
    const config = { comfort_temp_entity: "sensor.comfort", comfort_temp_min: 32 };
    const hass = (state) => ({ states: { "sensor.comfort": { state } } });

    it("defaults to 33 (the default of Hydrao Custom) and follows comfort_temp_min", () => {
      expect(computeCachedMetrics({ states: {} }, {}).comfortMin).toBe(33);
      expect(computeCachedMetrics({ states: {} }, { comfort_temp_min: 31 }).comfortMin).toBe(31);
    });

    it("comes from comfort_temp_entity when it holds a usable value", () => {
      expect(computeCachedMetrics(hass("36.5"), config).comfortMin).toBe(36.5);
    });

    it.each(["unavailable", "unknown", "0", "-3", "40", "52"])("keeps comfort_temp_min when the entity says %j", (state) => {
      expect(computeCachedMetrics(hass(state), config).comfortMin).toBe(32);
    });

    it("keeps comfort_temp_min when the entity does not exist", () => {
      expect(computeCachedMetrics({ states: {} }, config).comfortMin).toBe(32);
    });

    it("compares the entity with the configured boiling threshold", () => {
      expect(computeCachedMetrics(hass("36"), { ...config, temp_boiling_threshold: 35 }).comfortMin).toBe(32);
      expect(computeCachedMetrics(hass("41"), { ...config, temp_boiling_threshold: 50 }).comfortMin).toBe(41);
    });
  });

  it("the default reserve of water is 5 litres", () => {
    expect(computeCachedMetrics({ states: {} }, {}).survivalVolume).toBe(5);
    expect(computeCachedMetrics({ states: {} }, { survival_volume: 0 }).survivalVolume).toBe(5);
  });

  it("survivalVolume always comes from config, never from an entity (there is no such entity option)", () => {
    const metrics = computeCachedMetrics({ states: {} }, { survival_volume: 15 });
    expect(metrics.survivalVolume).toBe(15);
  });
});

describe("assignSpecies", () => {
  it("saltwater: indices 0-1 are species 0 (the clownfish pair), index 2 the blue tang, index 3 the butterflyfish", () => {
    expect([0, 1, 2, 3].map((i) => assignSpecies(i, "saltwater"))).toEqual([0, 0, 1, 3]);
  });

  it("saltwater: after that, a single yellow tang (never more than one), then royal grammas, chromis and an anthias", () => {
    expect([4, 5, 6, 7, 8, 9].map((i) => assignSpecies(i, "saltwater"))).toEqual([4, 2, 5, 6, 2, 5]);
  });

  it("saltwater: there is at most one yellow tang, however many fish there are", () => {
    for (let count = 1; count <= 10; count++) {
      const species = Array.from({ length: count }, (_, i) => assignSpecies(i, "saltwater"));
      expect(species.filter((s) => s === 4).length, `${count} fish`).toBeLessThanOrEqual(1);
    }
    expect(Array.from({ length: 10 }, (_, i) => assignSpecies(i, "saltwater")).filter((s) => s === 4)).toHaveLength(1);
  });

  it("saltwater: even with ten fish the reef keeps every species, and no species is more than twice there", () => {
    const ten = Array.from({ length: 10 }, (_, i) => assignSpecies(i, "saltwater"));
    expect(new Set(ten).size).toBe(7);
    for (const s of new Set(ten)) expect(ten.filter((x) => x === s).length).toBeLessThanOrEqual(2);
  });

  it("coldwater: cycles through 6 kinds of goldfish (index % 6)", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7].map((i) => assignSpecies(i, "coldwater"))).toEqual([0, 1, 2, 3, 4, 5, 0, 1]);
  });

  it("freshwater (and any other/unknown theme): cycles through 6 species (index % 6)", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7].map((i) => assignSpecies(i, "freshwater"))).toEqual([0, 1, 2, 3, 4, 5, 0, 1]);
    expect(assignSpecies(6, "some-future-theme")).toBe(0);
  });

  it("ten fish show every species of their biotope, and never one that does not exist", () => {
    for (const theme of ["freshwater", "saltwater", "coldwater"]) {
      const species = new Set(Array.from({ length: 10 }, (_, i) => assignSpecies(i, theme)));
      expect(species.size, theme).toBe(FISH_SPECIES_COUNT[theme]);
      expect(Math.max(...species), theme).toBeLessThan(FISH_SPECIES_COUNT[theme]);
    }
  });

  it("the angelfish is not doubled in a small tank: only one of the first six freshwater fish", () => {
    expect(Array.from({ length: 6 }, (_, i) => assignSpecies(i, "freshwater")).filter((s) => s === 0)).toHaveLength(1);
  });
});

describe("the discus", () => {
  const discus = (n = 10) => generateDefaultFishes(n, "freshwater").filter((f) => f.species === 2);

  it("is one and a half times the size its preset says", () => {
    const [first, second] = discus();
    expect(first.scale).toBeCloseTo(1.2 * 1.5, 10);
    expect(second.scale).toBeCloseTo(1.3 * 1.5, 10);
    expect(DISCUS_SIZE_FACTOR).toBe(1.5);
  });

  it("moves more slowly than the other fish: 0.6 of their speed", () => {
    expect(DISCUS_SPEED_FACTOR).toBe(0.6);
    for (let run = 0; run < 20; run++) {
      const fishes = generateDefaultFishes(10, "freshwater");
      const others = fishes.filter((f) => f.species !== 2);
      const calm = fishes.filter((f) => f.species === 2);
      const slowestOther = Math.min(...others.map((f) => f.vx));
      const fastestDiscus = Math.max(...calm.map((f) => f.vx));
      expect(fastestDiscus).toBeLessThan(slowestOther);
      for (const f of calm) expect(Math.abs(f.vy)).toBeLessThanOrEqual(0.45 * 1.2 * 0.6 + 1e-9);
    }
  });

  it("is only a discus in the freshwater tank: the same species number is another fish elsewhere", () => {
    expect(generateDefaultFishes(10, "coldwater").find((f) => f.species === 2).scale).toBeCloseTo(1.2, 10);
    expect(generateDefaultFishes(10, "saltwater").find((f) => f.species === 2).scale).toBeLessThan(2);
  });

  it("swims at a calm speed, in a range of its own", () => {
    for (const f of discus()) {
      expect(f.vx).toBeGreaterThan(0.6 * 0.8 * 1.1);
      expect(f.vx).toBeLessThan(0.6 * 1.2 * 1.4);
    }
  });
});

describe("the clownfish pair", () => {
  const clowns = () => generateDefaultFishes(10, "saltwater").filter((f) => f.species === 0);

  it("is a male and a female, and the female is a little bigger", () => {
    const [male, female] = clowns();
    expect(clowns()).toHaveLength(2);
    expect(male.scale).toBe(CLOWNFISH_SCALES.male);
    expect(female.scale).toBe(CLOWNFISH_SCALES.female);
    expect(female.scale / male.scale).toBeGreaterThan(1.08);
    expect(female.scale / male.scale).toBeLessThan(1.25);
  });

  it("keeps its size whatever the number of fish", () => {
    expect(generateDefaultFishes(2, "saltwater").map((f) => f.scale)).toEqual([CLOWNFISH_SCALES.male, CLOWNFISH_SCALES.female]);
    expect(generateDefaultFishes(1, "saltwater").map((f) => f.scale)).toEqual([CLOWNFISH_SCALES.male]);
  });

  it("swims as fast as before: only its size is set", () => {
    for (const fish of clowns()) {
      expect(fish.vx).toBeGreaterThan(1);
      expect(fish.vx).toBeLessThan(1.7);
    }
  });
});

describe("the blue tang", () => {
  const scales = (theme, count) => generateDefaultFishes(count, theme).map((f) => f.scale);

  it("is twice as big as the size preset says, in the reef tank only", () => {
    const reef = generateDefaultFishes(6, "saltwater");
    const tang = reef.find((f) => f.species === 1);
    expect(tang.scale).toBeCloseTo(1.2 * 2, 10);
    expect(reef.filter((f) => f.species !== 1).every((f) => f.scale < 2)).toBe(true);
  });

  it("leaves the size of every other fish as the preset says", () => {
    expect(scales("saltwater", 10).filter((_, i) => i !== 2)).toEqual([1.4, 1.6, 1.85, 1.45, 1.6, 1.25, 1.75, 1.3, 1.5]);
    // In the freshwater tank only the discus (species 2, at index 2 and 8) is bigger.
    expect(scales("freshwater", 10).filter((_, i) => i !== 2 && i !== 8)).toEqual([1.35, 1.65, 1.85, 1.45, 1.6, 1.25, 1.75, 1.5]);
    expect(scales("coldwater", 10)).toEqual([1.35, 1.65, 1.2, 1.85, 1.45, 1.6, 1.25, 1.75, 1.3, 1.5]);
  });

  it("swims as fast as before: only its size changed", () => {
    const tang = generateDefaultFishes(6, "saltwater").find((f) => f.species === 1);
    const speedOfPreset = 1.38 - (1.2 - 1.2) * 0.2;
    expect(tang.vx).toBeGreaterThanOrEqual(speedOfPreset * 0.8);
    expect(tang.vx).toBeLessThanOrEqual(speedOfPreset * 1.2);
  });

  it("is only there from the third fish on", () => {
    expect(generateDefaultFishes(2, "saltwater").some((f) => f.species === 1)).toBe(false);
    expect(generateDefaultFishes(3, "saltwater").some((f) => f.species === 1)).toBe(true);
  });

  it("the factor is 2", () => {
    expect(BLUE_TANG_SIZE_FACTOR).toBe(2);
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

  it("fullscreen mode has no frame: the tank spans the whole drawing, whatever its height", () => {
    for (const canvasHeight of [300, 600, 1200, 2048]) {
      const state = computeTankState({
        config: { ...baseConfig, fullscreen: true },
        metrics: baseMetrics,
        canvasHeight,
      });
      expect(state.tankTop).toBe(0);
      expect(state.tankBottom).toBe(canvasHeight);
      expect(state.tankHeight).toBe(canvasHeight);
    }
  });

  it("normal mode keeps its frame: 15 px above and 35 px below", () => {
    const state = computeTankState({ config: baseConfig, metrics: baseMetrics, canvasHeight: 800 });
    expect(state.tankTop).toBe(15);
    expect(state.tankBottom).toBe(765);
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

describe("temperatureScale", () => {
  it("runs from 10 to the deadly threshold plus 5, rounded up to a multiple of 10", () => {
    expect(temperatureScale(45)).toEqual({ min: 10, max: 50, ticks: [20, 30, 40, 50] });
    expect(temperatureScale(50)).toEqual({ min: 10, max: 60, ticks: [20, 30, 40, 50, 60] });
    expect(temperatureScale(70).max).toBe(80);
  });

  it("never gets narrower than 10 to 20", () => {
    expect(temperatureScale(1)).toEqual({ min: 10, max: 20, ticks: [20] });
  });
});

describe("computeGaugeState", () => {
  const base = { currentTemp: 20, currentVolume: 10, targetBudget: 50, comfortMin: 33, deadlyTemp: 45, boilTemp: 40 };

  it("below the comfort minimum: blue, fraction on the 10..50 scale", () => {
    const { tempColor, tempFraction } = computeGaugeState(base);
    expect(tempColor).toBe("#0284c7");
    expect(tempFraction).toBeCloseTo(10 / 40, 5);
  });

  it("from the comfort minimum up to the boiling threshold: green", () => {
    expect(computeGaugeState({ ...base, currentTemp: 34 }).tempColor).toBe("#16a34a");
    expect(computeGaugeState({ ...base, currentTemp: 39.9 }).tempColor).toBe("#16a34a");
  });

  it("the comfort minimum can be moved", () => {
    expect(computeGaugeState({ ...base, currentTemp: 30, comfortMin: 28 }).tempColor).toBe("#16a34a");
    expect(computeGaugeState({ ...base, currentTemp: 36, comfortMin: 37 }).tempColor).toBe("#0284c7");
  });

  it("from the boiling threshold up to the deadly one: orange", () => {
    expect(computeGaugeState({ ...base, currentTemp: 40 }).tempColor).toBe("#f97316");
  });

  it("from the deadly threshold: red", () => {
    expect(computeGaugeState({ ...base, currentTemp: 45 }).tempColor).toBe("#ef4444");
  });

  it("the fraction is capped at 1 far above the scale and at 0 below it", () => {
    expect(computeGaugeState({ ...base, currentTemp: 90 }).tempFraction).toBe(1);
    expect(computeGaugeState({ ...base, currentTemp: 5 }).tempFraction).toBe(0);
  });

  it("gives the ticks and the three marks as fractions of the scale", () => {
    const { ticks, marks, scale } = computeGaugeState(base);
    expect(scale.max).toBe(50);
    expect(ticks).toEqual([0.25, 0.5, 0.75, 1]);
    expect(marks.map((m) => m.color)).toEqual(["#16a34a", "#f97316", "#ef4444"]);
    expect(marks[0].fraction).toBeCloseTo(23 / 40, 5); // from 10 °C: the comfort mark is at 33 °C
    expect(marks[1].fraction).toBeCloseTo(30 / 40, 5);
    expect(marks[2].fraction).toBeCloseTo(35 / 40, 5);
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
  flowBubbleCount,
  classifyTap,
  computeScareKick,
  pickFoodTarget,
  createFlakes,
  FOOD_THROW,
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
      expect(f.x).toBe(500);
      expect(f.vx).toBeCloseTo(0, 9);
    });
  });

  it("throws a pinch of ten flakes by default, like from the tips of the fingers", () => {
    expect(createFlakes(500, 100, undefined, () => 0.5)).toHaveLength(FOOD_THROW.count);
    expect(FOOD_THROW.count).toBe(10);
  });

  it("throws the flakes on the left to the left and the ones on the right to the right", () => {
    const values = [0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    let i = 0;
    const flakes = createFlakes(500, 100, 2, () => values[i++ % values.length]);
    const [left, right] = flakes;
    expect(left.x).toBeCloseTo(500 - FOOD_THROW.start, 6);
    expect(left.vx).toBeLessThan(-FOOD_THROW.speed + 0.5);
    expect(right.x).toBeGreaterThan(500);
    expect(right.vx).toBeGreaterThan(0);
  });

  it("starts them within the reach of the fingers and gives each its own speed", () => {
    const flakes = createFlakes(512, 100, 200);
    for (const f of flakes) {
      expect(Math.abs(f.x - 512)).toBeLessThanOrEqual(FOOD_THROW.start);
      expect(Math.abs(f.vx)).toBeLessThanOrEqual(FOOD_THROW.speed + 0.4);
      expect(f.vy).toBeGreaterThanOrEqual(0.4);
      expect(f.vy).toBeLessThanOrEqual(0.95);
    }
    expect(new Set(flakes.map((f) => f.vx.toFixed(2))).size).toBeGreaterThan(100);
  });
});

import {
  estimateEnergyKwh,
  computeShowerCost,
  formatEuro,
} from "./pure.js";

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

import {
  getAnimationProfile,
  shouldRenderFrame,
  maxPhysicsDelta,
} from "./pure.js";

describe("animation quality profiles", () => {
  it("falls back to the maximum profile for unknown values", () => {
    expect(getAnimationProfile(undefined)).toBe(getAnimationProfile("max"));
    expect(getAnimationProfile("nope")).toBe(getAnimationProfile("max"));
  });

  it("caps frame rate at 30 (balanced) and 20 (light), uncapped for max", () => {
    expect(getAnimationProfile("max").fps).toBe(0);
    expect(getAnimationProfile("balanced").fps).toBe(30);
    expect(getAnimationProfile("light").fps).toBe(20);
  });

  it("gets lighter with each level", () => {
    const max = getAnimationProfile("max");
    const bal = getAnimationProfile("balanced");
    const light = getAnimationProfile("light");
    expect(max.flowBubbles).toBeGreaterThan(bal.flowBubbles);
    expect(bal.flowBubbles).toBeGreaterThan(light.flowBubbles);
    expect(light.deathFilter).toBe(false);
  });
});

describe("frame limiter", () => {
  it("renders every frame when uncapped or on the first frame", () => {
    expect(shouldRenderFrame(1000, 999, 0)).toBe(true);
    expect(shouldRenderFrame(1000, 0, 20)).toBe(true);
  });

  it("lands on every third 60 Hz frame at 20 fps", () => {
    let last = 1000;
    const rendered = [];
    for (let i = 1; i <= 12; i++) {
      const t = 1000 + i * 16.667;
      if (shouldRenderFrame(t, last, 20)) {
        rendered.push(i);
        last = t;
      }
    }
    expect(rendered).toEqual([3, 6, 9, 12]);
  });

  it("lets the physics step grow with the frame interval", () => {
    expect(maxPhysicsDelta(0)).toBe(2);
    expect(maxPhysicsDelta(60)).toBe(2);
    expect(maxPhysicsDelta(20)).toBeGreaterThan(3);
    expect(maxPhysicsDelta(30)).toBeGreaterThan(2);
  });
});

describe("light profile keeps the raster cost down", () => {
  it("refreshes ambient motion slowly and drops anti-aliasing only in light", () => {
    expect(getAnimationProfile("light").ambientHz).toBeGreaterThan(0);
    expect(getAnimationProfile("light").ambientHz).toBeLessThan(20);
    expect(getAnimationProfile("light").antialias).toBe(false);
    expect(getAnimationProfile("balanced").antialias).toBe(true);
    expect(getAnimationProfile("max").ambientHz).toBe(0);
  });
});

import { LEGACY_CONFIG_KEYS, stripLegacyConfigKeys } from "./pure.js";

describe("stripLegacyConfigKeys", () => {
  it("lists the options that were removed: the night mode and the separate fullscreen cost switch", () => {
    expect(LEGACY_CONFIG_KEYS).toEqual(["night_entity", "night_lux_threshold", "cost_in_fullscreen", "bottom_design"]);
  });

  it("removes legacy keys and keeps everything else", () => {
    const out = stripLegacyConfigKeys({ entity: "sensor.a", night_entity: "sun.sun", night_lux_threshold: 20, theme: "coldwater" });
    expect(out).toEqual({ entity: "sensor.a", theme: "coldwater" });
  });

  it("returns a copy and never mutates its input", () => {
    const input = { entity: "sensor.a", night_entity: "sun.sun" };
    const out = stripLegacyConfigKeys(input);
    expect(out).not.toBe(input);
    expect(input.night_entity).toBe("sun.sun");
  });

  it("accepts a config without any legacy key", () => {
    expect(stripLegacyConfigKeys({ entity: "sensor.a" })).toEqual({ entity: "sensor.a" });
  });

  it("accepts an empty config", () => {
    expect(stripLegacyConfigKeys({})).toEqual({});
  });
});

describe("formatEuro fallback and computeShowerCost defaults", () => {
  it("falls back to a plain 'x.xx EUR' string when the locale is invalid", () => {
    expect(formatEuro(1.234, "not a locale!!")).toBe("1.23 \u20ac");
  });

  it("formats in the requested language", () => {
    expect(formatEuro(1.5, "en")).toBe("\u20ac1.50");
    expect(formatEuro(1.5, "fr").replace(/\s/g, " ")).toBe("1,50 \u20ac");
  });

  it("treats missing volume, energy and prices as zero", () => {
    expect(computeShowerCost({})).toEqual({ water: 0, energy: 0, total: 0 });
  });

  it("never returns a negative cost", () => {
    const cost = computeShowerCost({ volumeL: -5, energyKwh: -1, waterPricePerM3: 4, energyPricePerKwh: 0.2 });
    expect(cost.total).toBe(0);
  });

  it("ignores non-numeric prices", () => {
    const cost = computeShowerCost({ volumeL: 100, energyKwh: 1, waterPricePerM3: "abc", energyPricePerKwh: undefined });
    expect(cost.total).toBe(0);
  });
});

describe("classifyTap boundaries", () => {
  it("a tap exactly at the margin below the surface still feeds the fish", () => {
    expect(classifyTap(100 + 45, 100)).toBe("feed");
  });

  it("a tap one pixel deeper knocks on the glass", () => {
    expect(classifyTap(100 + 45.01, 100)).toBe("knock");
  });

  it("a tap above the surface feeds the fish", () => {
    expect(classifyTap(10, 100)).toBe("feed");
  });

  it("honours a custom margin", () => {
    expect(classifyTap(120, 100, 20)).toBe("feed");
    expect(classifyTap(121, 100, 20)).toBe("knock");
  });
});

import { FISH_SPECIES_COUNT } from "./render/fish-specs.js";
import { metricsSignature, formatBudget, clampRangedOptions, normalizeConfig, isMotionAllowed, settleSteps, SETTLE_STEP_MS } from "./pure.js";

describe("formatBudget", () => {
  it("writes a whole number without decimals", () => {
    expect(formatBudget(50, "en")).toBe("50");
    expect(formatBudget(50, "fr")).toBe("50");
  });

  it("writes another number with one decimal, in the language of the user", () => {
    expect(formatBudget(42.5, "en")).toBe("42.5");
    expect(formatBudget(42.5, "fr")).toBe("42,5");
  });

  it("falls back to English", () => {
    expect(formatBudget(42.5)).toBe("42.5");
  });
});

describe("clampRangedOptions", () => {
  it("brings a number of fish above the range down to 10, and rounds it", () => {
    expect(clampRangedOptions({ fish_count: 20 }).fish_count).toBe(10);
    expect(clampRangedOptions({ fish_count: "20" }).fish_count).toBe(10);
    expect(clampRangedOptions({ fish_count: 3.7 }).fish_count).toBe(4);
  });

  it("gives back the default number of fish for a value below the range or not a number", () => {
    for (const fish_count of [0, -4, "many", ""]) {
      expect(clampRangedOptions({ fish_count }).fish_count, String(fish_count)).toBe(4);
    }
  });

  it("brings the speed of the fish into 0.2..3", () => {
    expect(clampRangedOptions({ fish_speed_multiplier: 5 }).fish_speed_multiplier).toBe(3);
    expect(clampRangedOptions({ fish_speed_multiplier: 0.05 }).fish_speed_multiplier).toBe(0.2);
    expect(clampRangedOptions({ fish_speed_multiplier: 0 }).fish_speed_multiplier).toBe(1.2);
  });

  it("leaves a value that is already in range as it is", () => {
    expect(clampRangedOptions({ fish_count: 6, fish_speed_multiplier: 1.7 })).toEqual({ fish_count: 6, fish_speed_multiplier: 1.7 });
  });

  it("leaves the options that are not set alone", () => {
    expect(clampRangedOptions({})).toEqual({});
    expect(clampRangedOptions({ fish_count: null, fish_speed_multiplier: undefined })).toEqual({ fish_count: null, fish_speed_multiplier: undefined });
  });

  it("does not touch the options without a range, however large", () => {
    const config = { entity: "sensor.x", target_budget: 800, survival_volume: 300, temp_boiling_threshold: 80 };
    expect(clampRangedOptions(config)).toEqual(config);
  });

  it("returns a copy and never changes its input", () => {
    const input = Object.freeze({ fish_count: 20 });
    expect(clampRangedOptions(input)).not.toBe(input);
    expect(input.fish_count).toBe(20);
  });

  it("gives exactly what the card uses when it reads the options", () => {
    for (const fish_count of [0, 3, 10, 25, "x"]) {
      expect(clampRangedOptions({ fish_count }).fish_count).toBe(normalizeConfig({ fish_count }).config.fish_count);
    }
    for (const fish_speed_multiplier of [0, 0.1, 1.2, 9]) {
      expect(clampRangedOptions({ fish_speed_multiplier }).fish_speed_multiplier).toBe(normalizeConfig({ fish_speed_multiplier }).config.fish_speed_multiplier);
    }
  });
});

describe("metricsSignature", () => {
  const base = { consumedVolume: 12, temperature: 30, targetBudget: 50, survivalVolume: 10, comfortMin: 33, sensorMissing: false, hoursSinceLastShower: 3.2 };

  it("is stable for identical metrics", () => {
    expect(metricsSignature(base, "en")).toBe(metricsSignature({ ...base }, "en"));
  });

  it.each([
    ["consumedVolume", 13],
    ["temperature", 31],
    ["targetBudget", 60],
    ["survivalVolume", 11],
    ["comfortMin", 36],
    ["sensorMissing", true],
    ["hoursSinceLastShower", 4.1],
  ])("changes when %s changes", (key, value) => {
    expect(metricsSignature({ ...base, [key]: value }, "en")).not.toBe(metricsSignature(base, "en"));
  });

  it("does not change while the hours since the last shower stay in the same hour", () => {
    expect(metricsSignature({ ...base, hoursSinceLastShower: 3.9 }, "en")).toBe(metricsSignature(base, "en"));
  });

  it("changes with the language", () => {
    expect(metricsSignature(base, "fr")).not.toBe(metricsSignature(base, "en"));
  });
});

describe("isMotionAllowed", () => {
  it("allows motion when the system does not ask for less", () => {
    expect(isMotionAllowed(false)).toBe(true);
    expect(isMotionAllowed(false, true)).toBe(true);
  });

  it("forbids motion when the system asks for reduced motion", () => {
    expect(isMotionAllowed(true)).toBe(false);
    expect(isMotionAllowed(true, true)).toBe(false);
  });

  it("lets the user opt out of the system setting", () => {
    expect(isMotionAllowed(true, false)).toBe(true);
  });

  it("treats a missing option as respecting the system setting", () => {
    expect(isMotionAllowed(true, undefined)).toBe(false);
  });
});

describe("settleSteps", () => {
  it("needs only a couple of steps for a living tank", () => {
    expect(settleSteps(false)).toBe(2);
  });

  it("needs enough steps for a dead tank to finish sinking (more than the 4.5 s death animation)", () => {
    expect(settleSteps(true) * SETTLE_STEP_MS).toBeGreaterThan(4500);
  });
});

import fc from "fast-check";
import {
  CANVAS_WIDTH,
  MIN_CANVAS_HEIGHT,
  MAX_CANVAS_HEIGHT,
  MIN_FULLSCREEN_HEIGHT,
  DEFAULT_FULLSCREEN_HEIGHT,
} from "./pure.js";

describe("computeCanvasHeight(): fullscreen follows the shape of the screen", () => {
  const fullscreen = { fullscreen: true };

  it("uses the default height until the screen has been measured", () => {
    expect(computeCanvasHeight(fullscreen)).toBe(DEFAULT_FULLSCREEN_HEIGHT);
    expect(computeCanvasHeight(fullscreen, null)).toBe(DEFAULT_FULLSCREEN_HEIGHT);
    expect(DEFAULT_FULLSCREEN_HEIGHT).toBe(600);
  });

  it.each([
    [1024, 600, 600],
    [1920, 1080, 576],
    [1280, 800, 640],
    [1024, 768, 768],
    [800, 1280, 1638],
    [2560, 1080, 432],
  ])("a %s x %s screen gets a %s high drawing", (width, height, expected) => {
    expect(computeCanvasHeight(fullscreen, { width, height })).toBe(expected);
  });

  it("a very tall (portrait) screen is limited to MAX_CANVAS_HEIGHT", () => {
    expect(computeCanvasHeight(fullscreen, { width: 300, height: 600 })).toBe(MAX_CANVAS_HEIGHT);
    expect(computeCanvasHeight(fullscreen, { width: 100, height: 5000 })).toBe(MAX_CANVAS_HEIGHT);
  });

  it("a very flat (ultra-wide) screen is limited to MIN_FULLSCREEN_HEIGHT, lower than the normal minimum", () => {
    expect(computeCanvasHeight(fullscreen, { width: 900, height: 300 })).toBe(341);
    expect(computeCanvasHeight(fullscreen, { width: 5000, height: 100 })).toBe(MIN_FULLSCREEN_HEIGHT);
    expect(MIN_FULLSCREEN_HEIGHT).toBeLessThan(MIN_CANVAS_HEIGHT);
  });

  it.each([
    [{ width: 0, height: 600 }],
    [{ width: 1024, height: 0 }],
    [{ width: -5, height: 600 }],
    [{ width: 1024, height: -5 }],
    [{ width: NaN, height: 600 }],
    [{ width: 1024, height: Infinity }],
    [{ width: "wide", height: "tall" }],
    [{}],
  ])("an unusable size %j falls back to the default height", (viewport) => {
    expect(computeCanvasHeight(fullscreen, viewport)).toBe(DEFAULT_FULLSCREEN_HEIGHT);
  });

  it("ignores the configured aspect ratio in fullscreen (the screen decides)", () => {
    const config = { fullscreen: true, aspect_ratio_width: 4, aspect_ratio_height: 3 };
    expect(computeCanvasHeight(config)).toBe(600);
    expect(computeCanvasHeight(config, { width: 1920, height: 1080 })).toBe(576);
  });

  it("the normal mode ignores the size of the screen", () => {
    const config = { aspect_ratio_width: 16, aspect_ratio_height: 9 };
    expect(computeCanvasHeight(config, { width: 300, height: 600 })).toBe(computeCanvasHeight(config));
    expect(computeCanvasHeight(config)).toBe(576);
  });

  it("the drawing is CANVAS_WIDTH wide", () => {
    expect(CANVAS_WIDTH).toBe(1024);
  });

  describe("properties (fast-check)", () => {
    const size = fc.double({ min: 1, max: 8000, noNaN: true, noDefaultInfinity: true });

    it("is always an integer inside the allowed range", () => {
      fc.assert(
        fc.property(size, size, (width, height) => {
          const h = computeCanvasHeight(fullscreen, { width, height });
          return Number.isInteger(h) && h >= MIN_FULLSCREEN_HEIGHT && h <= MAX_CANVAS_HEIGHT;
        }),
        { numRuns: 300 }
      );
    });

    it("the drawing has the shape of the screen, so nothing is stretched (within rounding and the limits)", () => {
      fc.assert(
        fc.property(size, size, (width, height) => {
          const h = computeCanvasHeight(fullscreen, { width, height });
          const wanted = (CANVAS_WIDTH * height) / width;
          if (wanted < MIN_FULLSCREEN_HEIGHT || wanted > MAX_CANVAS_HEIGHT) return true; // clamped: letterboxed
          return Math.abs(h - wanted) <= 0.5 + 1e-9;
        }),
        { numRuns: 300 }
      );
    });

    it("a taller screen never gives a shorter drawing", () => {
      fc.assert(
        fc.property(size, size, size, (width, h1, h2) => {
          const [low, high] = h1 <= h2 ? [h1, h2] : [h2, h1];
          return computeCanvasHeight(fullscreen, { width, height: low }) <= computeCanvasHeight(fullscreen, { width, height: high });
        }),
        { numRuns: 300 }
      );
    });

    it("scaling the screen (a hi-dpi display) does not change the drawing", () => {
      fc.assert(
        fc.property(size, size, fc.double({ min: 0.5, max: 4, noNaN: true }), (width, height, factor) => {
          const a = computeCanvasHeight(fullscreen, { width, height });
          const b = computeCanvasHeight(fullscreen, { width: width * factor, height: height * factor });
          return Math.abs(a - b) <= 1;
        }),
        { numRuns: 300 }
      );
    });
  });
});

describe("a pinch of food scatters from left to right once it is in the water", () => {
  it("the flakes of one throw end up spread over more than 120 units, on both sides of the tap", async () => {
    const { stepFood } = await import("./physics.js");
    const flakes = createFlakes(512, 100, FOOD_THROW.count, (() => { let s = 5; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })());
    const frame = { isDead: false, waterRatio: 1, delta: 1, animTime: 0, waterSurfaceY: 15, tankBottom: 20_000, nowMs: 0 };
    for (let i = 0; i < 300; i++) stepFood(flakes, frame);
    const xs = flakes.map((f) => f.x);
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(120);
    expect(Math.min(...xs)).toBeLessThan(512 - 30);
    expect(Math.max(...xs)).toBeGreaterThan(512 + 30);
  });
});
