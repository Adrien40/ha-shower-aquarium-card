// Pure, DOM-free helpers extracted from shower-aquarium-card.js. Kept
// separate so the card's actual decision logic (death/boiling/stress
// thresholds, canvas sizing, fish generation) can be unit tested without
// mounting a LitElement or driving requestAnimationFrame.

import { CONFIG_DEFAULTS } from "./defaults.js";

/** @typedef {import("./types.js").ThemePreset} ThemePreset */
/** @typedef {import("./types.js").AnimationProfile} AnimationProfile */
/** @typedef {import("./types.js").CardConfig} CardConfig */
/** @typedef {import("./types.js").Hass} Hass */
/** @typedef {import("./types.js").TankMetrics} TankMetrics */
/** @typedef {import("./types.js").CachedMetrics} CachedMetrics */
/** @typedef {import("./types.js").LastReading} LastReading */
/** @typedef {import("./types.js").TankState} TankState */
/** @typedef {import("./types.js").ThresholdTier} ThresholdTier */
/** @typedef {import("./types.js").VolumeTier} VolumeTier */
/** @typedef {import("./types.js").FlowTracker} FlowTracker */
/** @typedef {import("./types.js").Fish} Fish */
/** @typedef {import("./types.js").Flake} Flake */
/** @typedef {Record<string, any>} RawConfig */

/** @type {Record<string, ThemePreset>} */
export const THEME_PRESETS = {
  freshwater: {
    waterTop: "#38bdf8",
    waterBottom: "#0284c7",
    sandColor: "#fde68a",
    background: "#f0fdfa",
    palette: [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#f97316",
      "#14b8a6",
      "#84cc16",
    ],
  },
  saltwater: {
    waterTop: "#06b6d4",
    waterBottom: "#0e7490",
    sandColor: "#fef08a",
    background: "#ecfeff",
    palette: [
      "#f97316",
      "#eab308",
      "#3b82f6",
      "#a855f7",
      "#ec4899",
      "#14b8a6",
      "#06b6d4",
      "#f43f5e",
      "#84cc16",
      "#6366f1",
    ],
  },
  coldwater: {
    waterTop: "#67e8f9",
    waterBottom: "#0891b2",
    sandColor: "#cbd5e1",
    background: "#f8fafc",
    palette: [
      "#ea580c",
      "#f97316",
      "#fb923c",
      "#fdba74",
      "#fbbf24",
      "#d97706",
      "#dc2626",
      "#f59e0b",
      "#fef3c7",
      "#cbd5e1",
    ],
  },
};

/**
 * @param {string} themeKey
 * @returns {ThemePreset}
 */
export function getTheme(themeKey) {
  return THEME_PRESETS[themeKey] || THEME_PRESETS.freshwater;
}

/** The looks of the living things (see render/skin.js). */
export const CREATURE_STYLE_NAMES = ["flat", "cartoon", "realistic"];

/**
 * Config keys that belonged to features that have since been removed
 * (night mode, the classic drawing of the Ancistrus, the shrimp and the crab). They are dropped on load so saved dashboards keep working
 * and the visual editor stops writing them back.
 */
export const LEGACY_CONFIG_KEYS = ["night_entity", "night_lux_threshold", "cost_in_fullscreen", "bottom_design"];

/**
 * Returns a shallow copy of `config` without any LEGACY_CONFIG_KEYS.
 *
 * @param {RawConfig} config
 * @returns {RawConfig}
 */
export function stripLegacyConfigKeys(config) {
  const clean = { ...config };
  for (const key of LEGACY_CONFIG_KEYS) delete clean[key];
  return clean;
}

/** The biotopes, in the order a swipe goes through them. */
export const BIOTOPES = ["freshwater", "saltwater", "coldwater"];

/**
 * The biotope `step` places after `current` in the list (wrapping round), 1 for
 * the next one and -1 for the previous one. An unknown biotope counts as the first.
 *
 * @param {string} current
 * @param {number} step
 * @returns {string}
 */
export function nextBiotope(current, step) {
  const index = Math.max(0, BIOTOPES.indexOf(current));
  return BIOTOPES[(index + step + BIOTOPES.length * 2) % BIOTOPES.length];
}

/** What counts as a swipe: how far (screen pixels) and how fast (ms) the finger goes, and how horizontal the move is. */
export const SWIPE = { minDistance: 60, maxDurationMs: 900, horizontalRatio: 1.6 };

/**
 * Whether a move of the finger from a first to a last point is a swipe to the
 * left (1: the next biotope), to the right (-1: the previous one) or neither
 * (0). It must be long enough, quick enough and clearly more horizontal than
 * vertical, so a tap, a slow drag or a scroll of the page is not taken for one.
 *
 * @param {number} dx
 * @param {number} dy
 * @param {number} elapsedMs
 * @returns {-1 | 0 | 1}
 */
export function classifySwipe(dx, dy, elapsedMs) {
  if (elapsedMs > SWIPE.maxDurationMs || Math.abs(dx) < SWIPE.minDistance) return 0;
  if (Math.abs(dx) < Math.abs(dy) * SWIPE.horizontalRatio) return 0;
  return dx < 0 ? 1 : -1;
}

/** Width of the drawing (SVG viewBox), in drawing units. The height follows the shape of the screen. */
export const CANVAS_WIDTH = 1024;

// Lowest temperature (°C) of the thermometer scale.
export const GAUGE_TEMP_MIN = 10;

// Minimum comfortable water temperature (°C) when nothing else is configured.
export const DEFAULT_COMFORT_TEMP = CONFIG_DEFAULTS.comfort_temp_min;

// Water (litres) that stays in the tank once the target budget is used up.
export const DEFAULT_SURVIVAL_VOLUME = CONFIG_DEFAULTS.survival_volume;

// How long the volume sensor must stay without a usable value before the card
// says so (Home Assistant needs a moment to bring its sensors up at start-up).
export const SENSOR_LOST_DELAY_MS = 60_000;
/** Lowest and highest viewBox height, so an extreme shape cannot produce a degenerate canvas. */
export const MIN_CANVAS_HEIGHT = 400;
export const MAX_CANVAS_HEIGHT = 2048;
/** Fullscreen has no frame, so it can be flatter (up to about 3.4:1, an ultra-wide monitor). */
export const MIN_FULLSCREEN_HEIGHT = 300;
/** Height of the fullscreen drawing until the real size of the screen is known. */
export const DEFAULT_FULLSCREEN_HEIGHT = 600;

const clampCanvasHeight = (/** @type {number} */ height, min = MIN_CANVAS_HEIGHT) => Math.max(min, Math.min(MAX_CANVAS_HEIGHT, Math.round(height)));

/**
 * The SVG viewBox height. In the normal mode it comes from the configured
 * aspect ratio. In fullscreen mode it follows the real shape of the screen, so
 * the drawing fills it without being stretched: a portrait tablet gets a tall
 * tank and an ultra-wide monitor a flat one. Until the size of the screen is
 * known (or when it is unusable) fullscreen uses DEFAULT_FULLSCREEN_HEIGHT.
 * The result is clamped so an extreme or malformed ratio can't produce a
 * degenerate (near-zero or huge) canvas.
 *
 * @param {Partial<CardConfig> | null | undefined} config
 * @param {{ width: number, height: number } | null} [viewport]  size of the screen area, in pixels
 * @returns {number}
 */
export function computeCanvasHeight(config, viewport) {
  if (config?.fullscreen) {
    const width = Number(viewport?.width);
    const height = Number(viewport?.height);
    if (width > 0 && height > 0 && Number.isFinite(width) && Number.isFinite(height)) {
      return clampCanvasHeight((CANVAS_WIDTH * height) / width, MIN_FULLSCREEN_HEIGHT);
    }
    return DEFAULT_FULLSCREEN_HEIGHT;
  }
  const rWidth = Number(config?.aspect_ratio_width) || CONFIG_DEFAULTS.aspect_ratio_width;
  const rHeight = Number(config?.aspect_ratio_height) || CONFIG_DEFAULTS.aspect_ratio_height;
  return clampCanvasHeight(CANVAS_WIDTH * (rHeight / rWidth));
}

/**
 * Reads the configured entities off hass.states and returns the metrics
 * the rest of the card needs, with every value defaulted/clamped so a
 * missing, unknown, or non-numeric sensor state never produces NaN
 * downstream (which would silently freeze the animation and gauges).
 *
 * When the volume sensor has no usable value (unavailable, unknown, gone),
 * the last usable reading from `previous` is kept: a broken sensor must not
 * look like "nobody showered", and the algae clock must not restart.
 *
 * @param {Hass | null | undefined} hass
 * @param {Partial<CardConfig> | null | undefined} config
 * @param {CachedMetrics | null} [previous]  result of the previous call for the same configuration
 * @returns {CachedMetrics}
 */
export function computeCachedMetrics(hass, config, previous = null) {
  /** @type {CachedMetrics} */
  const metrics = {
    consumedVolume: 0,
    hoursSinceLastShower: 0,
    temperature: 0,
    targetBudget: Number(config?.target_budget) || CONFIG_DEFAULTS.target_budget,
    survivalVolume: Number(config?.survival_volume) || DEFAULT_SURVIVAL_VOLUME,
    comfortMin: Number(config?.comfort_temp_min) || DEFAULT_COMFORT_TEMP,
    sensorMissing: false,
    lastReading: null,
    tiers: null,
  };

  if (!hass || !config) {
    return metrics;
  }

  const stateObj = config.entity ? hass.states[config.entity] : undefined;
  const volume = stateObj ? parseFloat(stateObj.state) : NaN;
  const kept = previous?.lastReading ?? null;
  metrics.sensorMissing = !(stateObj && !isNaN(volume));
  /** @type {LastReading | null} */
  let reading = kept;
  if (stateObj && !isNaN(volume)) {
    const value = Math.max(0, volume);
    const lastChanged = stateObj.last_changed ? new Date(stateObj.last_changed).getTime() : NaN;
    // A sensor coming back from "unavailable" gets a fresh last_changed although
    // no water flowed: when the value is the one seen before, keep the older time.
    const sameAsBefore = kept !== null && kept.volume === value && kept.changedMs !== null;
    reading = {
      volume: value,
      changedMs: sameAsBefore ? kept.changedMs : Number.isFinite(lastChanged) ? lastChanged : null,
    };
  }
  if (reading) {
    metrics.consumedVolume = reading.volume;
    metrics.lastReading = reading;
    if (reading.changedMs !== null) {
      metrics.hoursSinceLastShower = Math.max(0, (Date.now() - reading.changedMs) / (1000 * 60 * 60));
    }
  }

  if (config.temperature_entity && hass.states[config.temperature_entity]) {
    const t = parseFloat(hass.states[config.temperature_entity].state);
    metrics.temperature = isNaN(t) ? 0 : t;
  }

  if (config.target_budget_entity && hass.states[config.target_budget_entity]) {
    const tVal = parseFloat(hass.states[config.target_budget_entity].state);
    // Same rule as the target_budget option: a budget must be above zero.
    if (tVal > 0) {
      metrics.targetBudget = tVal;
    }
  }

  // The minimum comfort temperature can come from an entity (the Hydrao
  // showerhead reports one). It is only trusted while it stays below the
  // boiling threshold; otherwise the configured value is kept.
  if (config.comfort_temp_entity && hass.states[config.comfort_temp_entity]) {
    const comfort = parseFloat(hass.states[config.comfort_temp_entity].state);
    const boiling = Number(config.temp_boiling_threshold) || CONFIG_DEFAULTS.temp_boiling_threshold;
    if (comfort > 0 && comfort < boiling) {
      metrics.comfortMin = comfort;
    }
  }

  // The four coloured thresholds of the showerhead. A showerhead that talks only while water runs keeps
  // its last thresholds: when they cannot be read for a moment, the last ones are kept.
  metrics.tiers = config.use_threshold_colors === false ? null : readThresholdTiers(hass, config) ?? previous?.tiers ?? null;

  return metrics;
}

/**
 * The colour of a threshold as the Hydrao Custom integration gives it, in the
 * attributes of the threshold sensor: `color_hex` ("#00FF00"), else `color_rgb`
 * ("0, 255, 0", or a list of three numbers). Null when there is none.
 *
 * @param {Record<string, unknown> | undefined} attributes
 * @returns {string | null}
 */
export function parseThresholdColor(attributes) {
  const hex = attributes?.color_hex;
  if (typeof hex === "string" && /^#[0-9a-f]{6}$/i.test(hex.trim())) return hex.trim().toLowerCase();
  const rgb = attributes?.color_rgb;
  const parts = Array.isArray(rgb) ? rgb : typeof rgb === "string" ? rgb.split(",") : [];
  if (parts.length !== 3) return null;
  const channels = parts.map((p) => (typeof p === "string" && p.trim() === "" ? NaN : Number(p)));
  if (!channels.every((c) => Number.isInteger(c) && c >= 0 && c <= 255)) return null;
  return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * The four coloured thresholds of the showerhead, from their sensors: the
 * entities `threshold_1_entity` to `threshold_3_entity`, and the target entity
 * for the fourth. Each one gives its litres (its state) and its colour (an
 * attribute). Null unless all four are readable and go up from the first to the
 * last: with fewer, the colours of the tiers cannot be told apart.
 *
 * @param {Hass} hass
 * @param {Partial<CardConfig>} config
 * @returns {ThresholdTier[] | null}
 */
export function readThresholdTiers(hass, config) {
  const ids = [config.threshold_1_entity, config.threshold_2_entity, config.threshold_3_entity, config.target_budget_entity];
  /** @type {ThresholdTier[]} */
  const tiers = [];
  for (const id of ids) {
    const stateObj = id ? hass.states[id] : undefined;
    const limit = stateObj ? parseFloat(stateObj.state) : NaN;
    const color = stateObj ? parseThresholdColor(stateObj.attributes) : null;
    if (!(limit > 0) || !color) return null;
    tiers.push({ limit, color });
  }
  for (let i = 1; i < tiers.length; i++) if (!(tiers[i].limit > tiers[i - 1].limit)) return null;
  return tiers;
}

/**
 * The colour the volume has: the one of the first threshold that is not passed
 * yet (a threshold is active as long as the volume has not gone beyond it), and
 * once the last one is passed the colour of the last one, blinking.
 *
 * @param {number} volume
 * @param {ThresholdTier[] | null | undefined} tiers
 * @returns {VolumeTier | null}
 */
export function thresholdTier(volume, tiers) {
  if (!tiers || tiers.length === 0) return null;
  const index = tiers.findIndex((tier) => volume <= tier.limit);
  if (index === -1) return { color: tiers[tiers.length - 1].color, blinking: true, index: tiers.length - 1 };
  return { color: tiers[index].color, blinking: false, index };
}

/**
 * Which species the fish at this index is, by biotope. Every biotope has 6 or 7
 * species (see render/fish-specs.js) that follow one another. The reef starts
 * with the clownfish pair (species 0), then the blue tang, then the butterflyfish,
 * and goes on with the four other species one after the other.
 *
 * @param {number} index
 * @param {string} themeKey
 * @returns {number}
 */
export function assignSpecies(index, themeKey) {
  if (themeKey === "saltwater") {
    if (index < 2) return 0;
    if (index === 2) return 1;
    if (index === 3) return 3;
    return REEF_OTHER_SPECIES[(index - 4) % REEF_OTHER_SPECIES.length];
  }
  // Six species in the freshwater tank and six kinds of goldfish.
  return index % 6;
}

const FISH_SIZE_PRESETS = [1.35, 1.65, 1.2, 1.85, 1.45, 1.6, 1.25, 1.75, 1.3, 1.5];

/**
 * The species the reef goes on with after the blue tang and the butterflyfish:
 * a single yellow tang (never more than one), then royal grammas, chromis and an
 * anthias.
 */
const REEF_OTHER_SPECIES = [4, 2, 5, 6, 2, 5];

/** The size of the clownfish pair: the female is a little bigger than the male. */
export const CLOWNFISH_SCALES = { male: 1.4, female: 1.6 };

/** The discus is one and a half times its size preset, and moves at 0.6 of the usual speed: a big, calm fish. */
export const DISCUS_SIZE_FACTOR = 1.5;
export const DISCUS_SPEED_FACTOR = 0.6;

/** The blue tang of the reef is twice as big as its size preset says: it is the small one of the tank. */
export const BLUE_TANG_SIZE_FACTOR = 2;

/**
 * Builds the initial fish array for a fresh config (theme change or fish
 * count change). Uses Math.random() for position/speed jitter -- by
 * design, not a bug to eliminate: the point is a tank that doesn't look
 * identically laid out every time. Tests assert on structure/ranges/species
 * assignment, not exact coordinates.
 *
 * @param {number | string | null | undefined} count
 * @param {string} themeKey
 * @returns {Fish[]}
 */
export function generateDefaultFishes(count, themeKey) {
  const theme = getTheme(themeKey);
  const n = Math.min(10, Math.max(1, Number(count) || 4));

  return Array.from({ length: n }, (_, index) => {
    const species = assignSpecies(index, themeKey);
    const isClownfish = themeKey === "saltwater" && species === 0;
    const isDiscus = themeKey === "freshwater" && species === 2;
    const calm = isDiscus ? DISCUS_SPEED_FACTOR : 1;
    const baseVx = 1.38 - (FISH_SIZE_PRESETS[index % FISH_SIZE_PRESETS.length] - 1.2) * 0.2;
    const jitterX = Math.random() * 50 - 25;
    const jitterY = Math.random() * 50 - 25;
    return {
      species,
      color: theme.palette[index % theme.palette.length],
      scale: (isClownfish ? (index === 0 ? CLOWNFISH_SCALES.male : CLOWNFISH_SCALES.female) : FISH_SIZE_PRESETS[index % FISH_SIZE_PRESETS.length] * (themeKey === "saltwater" && species === 1 ? BLUE_TANG_SIZE_FACTOR : 1)) * (isDiscus ? DISCUS_SIZE_FACTOR : 1),
      phase: Math.random() * 6.28,
      x: isClownfish ? 190 + index * 140 : 120 + (index * 760) / Math.max(1, n - 1) + jitterX,
      y: isClownfish ? 470 : 160 + (index % 3) * 90 + jitterY,
      vx: baseVx * (0.8 + Math.random() * 0.4) * calm,
      vy: 0.45 * (Math.random() < 0.5 ? 1 : -1) * (0.7 + Math.random() * 0.5) * calm,
      dir: Math.random() < 0.5 ? 1 : -1,
      deathProgress: 0,
    };
  });
}

/**
 * The shared frame-state derivation that used to be computed twice --
 * once (slightly differently) in _updatePhysics for the animation tick,
 * and again in render() for the gauges/water color -- which is exactly
 * the kind of duplication that lets a threshold change silently apply in
 * one place and not the other. Both now call this.
 *
 * isDead is life-or-death for every creature in the tank (all movement
 * stops, death animations start), so its two triggers are load-bearing:
 * overheating past deadly_threshold, or the tank fully drained.
 *
 * @param {{ config?: Partial<CardConfig> | null, metrics: TankMetrics, canvasHeight: number }} input
 * @returns {TankState}
 */
export function computeTankState({ config, metrics, canvasHeight }) {
  const targetBudget = metrics.targetBudget;
  const survivalVolume = metrics.survivalVolume;
  const totalVolume = targetBudget + survivalVolume;
  const currentVolume = metrics.consumedVolume;
  const currentTemp = metrics.temperature;

  const boilTemp = Number(config?.temp_boiling_threshold) || CONFIG_DEFAULTS.temp_boiling_threshold;
  const deadlyTemp = Number(config?.temp_deadly_threshold) || CONFIG_DEFAULTS.temp_deadly_threshold;

  const remainingVolumeInTank = Math.max(0, totalVolume - currentVolume);
  const waterRatio = totalVolume > 0 ? Math.max(0, Math.min(1, remainingVolumeInTank / totalVolume)) : 0;

  const isFullscreen = Boolean(config?.fullscreen);
  const tankTop = isFullscreen ? 0 : 15;
  // Fullscreen has no frame: the tank reaches the bottom of the drawing.
  const tankBottom = isFullscreen ? canvasHeight : canvasHeight - 35;
  const tankHeight = tankBottom - tankTop;
  const waterSurfaceY = tankBottom - waterRatio * tankHeight;

  const isHeatDead = currentTemp >= deadlyTemp && currentTemp > 0;
  const isWaterDead = remainingVolumeInTank <= 0;
  const isDead = isHeatDead || isWaterDead;

  const isBoiling = currentTemp >= boilTemp && currentTemp > 0;
  const isCritical = currentVolume > targetBudget && !isDead;
  const isWarning = currentVolume > targetBudget * 0.7 && !isCritical && !isDead;

  const userSpeed = Number(config?.fish_speed_multiplier) || CONFIG_DEFAULTS.fish_speed_multiplier;
  const isStressed = (isCritical || isBoiling) && !isDead;
  const speedMultiplier = (isStressed ? 2.0 : 1.0) * userSpeed;

  return {
    targetBudget,
    survivalVolume,
    totalVolume,
    currentVolume,
    currentTemp,
    boilTemp,
    deadlyTemp,
    remainingVolumeInTank,
    waterRatio,
    tankTop,
    tankBottom,
    tankHeight,
    waterSurfaceY,
    isHeatDead,
    isWaterDead,
    isDead,
    isBoiling,
    isCritical,
    isWarning,
    speedMultiplier,
  };
}

/**
 * Temperature scale of the thermometer: from GAUGE_TEMP_MIN up to the deadly
 * threshold plus 5 degrees, rounded up to a multiple of 10, so the deadly mark
 * is always visible. The default thresholds give 10..50.
 *
 * @param {number} deadlyTemp
 * @returns {{ min: number, max: number, ticks: number[] }}
 */
export function temperatureScale(deadlyTemp) {
  const max = Math.max(GAUGE_TEMP_MIN + 10, Math.ceil((deadlyTemp + 5) / 10) * 10);
  const ticks = [];
  for (let t = GAUGE_TEMP_MIN + 10; t <= max; t += 10) ticks.push(t);
  return { min: GAUGE_TEMP_MIN, max, ticks };
}

/**
 * What the two gauges of the fullscreen mode show. Temperature: blue below
 * the comfort minimum, green while comfortable, orange from the boiling
 * threshold, red from the deadly one. Volume: blue, amber above 70 % of the
 * budget, red above the budget. With the coloured thresholds of the showerhead
 * (`tier`), the volume takes the colour of the threshold it has reached and
 * blinks once the last one is passed.
 *
 * @param {{ currentTemp: number, currentVolume: number, targetBudget: number, comfortMin: number, deadlyTemp: number, boilTemp: number, tier?: VolumeTier | null }} input
 */
export function computeGaugeState({ currentTemp, currentVolume, targetBudget, comfortMin, deadlyTemp, boilTemp, tier = null }) {
  const scale = temperatureScale(deadlyTemp);
  const toFraction = (/** @type {number} */ t) => Math.max(0, Math.min(1, (t - scale.min) / (scale.max - scale.min)));
  const tempFraction = toFraction(currentTemp);
  const tempColor =
    currentTemp >= deadlyTemp ? "#ef4444" : currentTemp >= boilTemp ? "#f97316" : currentTemp >= comfortMin ? "#16a34a" : "#0284c7";

  const volFraction = Math.max(0, Math.min(1, currentVolume / Math.max(1, targetBudget)));
  const volColor = tier ? tier.color : currentVolume > targetBudget ? "#ef4444" : currentVolume > targetBudget * 0.7 ? "#f59e0b" : "#0284c7";

  return {
    tempFraction,
    tempColor,
    volFraction,
    volColor,
    volBlink: Boolean(tier?.blinking),
    scale,
    marks: [
      { fraction: toFraction(comfortMin), color: "#16a34a" },
      { fraction: toFraction(boilTemp), color: "#f97316" },
      { fraction: toFraction(deadlyTemp), color: "#ef4444" },
    ],
    ticks: scale.ticks.map(toFraction),
  };
}

// ---------------------------------------------------------------------------
// Interactivity and water flow helpers.
// Everything below is pure (no DOM, no timers) so it can be unit-tested; the
// card only feeds it the clock and applies the results.
// ---------------------------------------------------------------------------

/** How long (ms) without any volume increase before the water counts as stopped. */
export const FLOW_ACTIVE_WINDOW_MS = 8000;
/** Duration (ms) of the shock wave drawn on the glass. */
export const RIPPLE_DURATION_MS = 900;

/**
 * @returns {FlowTracker}
 */
export function createFlowTracker() {
  return { lastVolume: null, lastIncreaseAt: 0, target: 0, showerActive: false };
}

/**
 * Feeds a new consumed-volume sample into the flow tracker and returns the
 * next tracker state. The card only knows the cumulative volume, so the flow
 * is inferred from how fast that volume grows between two increases.
 *
 * @param {FlowTracker} state
 * @param {number} volume
 * @param {number} now
 * @returns {FlowTracker}
 */
export function trackFlow(state, volume, now) {
  if (state.lastVolume === null) {
    return { ...state, lastVolume: volume };
  }
  if (volume < state.lastVolume - 1e-6) {
    // Counter reset (new shower): forget everything.
    return { ...createFlowTracker(), lastVolume: volume };
  }
  if (volume > state.lastVolume + 1e-6) {
    const dv = volume - state.lastVolume;
    const dt = (now - state.lastIncreaseAt) / 1000;
    const hasRate = state.lastIncreaseAt > 0 && dt > 0.2 && dt <= 15;
    const rate = hasRate ? dv / (dt / 60) : null; // L/min
    const target = rate === null ? 0.5 : Math.max(0.25, Math.min(1, rate / 10));
    return { lastVolume: volume, lastIncreaseAt: now, target, showerActive: true };
  }
  return state;
}

/**
 * Target flow intensity (0..1) for the current instant.
 *
 * @param {FlowTracker} state
 * @param {number} now
 * @returns {number}
 */
export function flowTarget(state, now) {
  if (!state.lastIncreaseAt) return 0;
  return now - state.lastIncreaseAt < FLOW_ACTIVE_WINDOW_MS ? state.target : 0;
}

/**
 * True once a running shower has gone quiet for the whole activity window.
 *
 * @param {FlowTracker} state
 * @param {number} now
 * @returns {boolean}
 */
export function isShowerOver(state, now) {
  return (
    state.showerActive &&
    state.lastIncreaseAt > 0 &&
    now - state.lastIncreaseAt >= FLOW_ACTIVE_WINDOW_MS
  );
}

/**
 * Number of bubbles in the rising stream for a given flow intensity.
 *
 * @param {number} intensity
 * @param {number} [max]
 * @returns {number}
 */
export function flowBubbleCount(intensity, max = 36) {
  if (!(intensity > 0.02)) return 0;
  return Math.min(max, Math.round(4 + intensity * (max - 4)));
}

/**
 * A tap near the water surface drops food; a tap deeper in the tank knocks on
 * the glass.
 *
 * @param {number} y
 * @param {number} waterSurfaceY
 * @param {number} [margin]
 * @returns {"feed" | "knock"}
 */
export function classifyTap(y, waterSurfaceY, margin = 45) {
  return y <= waterSurfaceY + margin ? "feed" : "knock";
}

/**
 * Startle impulse for a fish at (fx, fy) when the glass is knocked at (tx, ty).
 *
 * @param {number} fx
 * @param {number} fy
 * @param {number} tx
 * @param {number} ty
 * @param {number} [radius]
 * @param {() => number} [rand]
 * @returns {{ kx: number, ky: number, scare: number } | null}
 */
export function computeScareKick(fx, fy, tx, ty, radius = 280, rand = Math.random) {
  const dx = fx - tx;
  const dy = fy - ty;
  const dist = Math.hypot(dx, dy);
  if (dist > radius) return null;
  let ux;
  let uy;
  if (dist < 1) {
    const a = rand() * Math.PI * 2;
    ux = Math.cos(a);
    uy = Math.sin(a);
  } else {
    ux = dx / dist;
    uy = dy / dist;
  }
  const strength = 1 - dist / radius;
  const mag = 2 + 9 * strength;
  return { kx: ux * mag, ky: uy * mag * 0.6, scare: strength };
}

/**
 * Closest food flake within range of a fish, or null.
 *
 * @param {number} fx
 * @param {number} fy
 * @param {Flake[]} flakes
 * @param {number} [range]
 * @returns {Flake | null}
 */
export function pickFoodTarget(fx, fy, flakes, range = 360) {
  let best = null;
  let bestD = range;
  for (const f of flakes) {
    if (f.eaten) continue;
    const d = Math.hypot(f.x - fx, f.y - fy);
    if (d < bestD) {
      bestD = d;
      best = f;
    }
  }
  return best;
}

/** How the food is thrown: how many flakes, how far from the tap they start (units), and the sideways speed (units per frame) of the farthest one. */
export const FOOD_THROW = { count: 10, start: 40, speed: 3.4 };

/**
 * A pinch of fish food thrown from the tips of the fingers: the flakes start
 * close to the tap and fly sideways, the ones on the left to the left and the
 * ones on the right to the right (see stepFood(), where that speed fades), so
 * they are scattered along the surface before they sink.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} [count]
 * @param {() => number} [rand]
 * @returns {Flake[]}
 */
export function createFlakes(x, y, count = FOOD_THROW.count, rand = Math.random) {
  const palette = ["#f59e0b", "#fbbf24", "#fb923c", "#facc15"];
  return Array.from({ length: count }, () => {
    // -1 (the far left of the fan) to 1 (the far right).
    const side = (rand() - 0.5) * 2;
    return {
      x: x + side * FOOD_THROW.start,
      y: y + rand() * 12,
      vx: side * FOOD_THROW.speed + (rand() - 0.5) * 0.8,
      vy: 0.4 + rand() * 0.55,
      phase: rand() * Math.PI * 2,
      r: 3.4 + rand() * 2,
      color: palette[Math.floor(rand() * palette.length)],
      landedAt: 0,
      eaten: false,
    };
  });
}

// ---------------------------------------------------------------------------
// Cost estimation helpers.
// ---------------------------------------------------------------------------

const WATER_HEAT_KWH_PER_L_PER_K = 4.186 / 3600; // 1 L of water, 1 K, in kWh

/**
 * Energy (kWh) needed to heat `volumeL` litres from `coldC` to `tempC`.
 *
 * @param {number} volumeL
 * @param {number} tempC
 * @param {number} [coldC]
 * @returns {number}
 */
export function estimateEnergyKwh(volumeL, tempC, coldC = 15) {
  if (!(volumeL > 0) || !(tempC > coldC)) return 0;
  return volumeL * (tempC - coldC) * WATER_HEAT_KWH_PER_L_PER_K;
}

/**
 * @param {{ volumeL?: number, energyKwh?: number, waterPricePerM3?: number | string, energyPricePerKwh?: number | string }} input
 * @returns {{ water: number, energy: number, total: number }}
 */
export function computeShowerCost({ volumeL, energyKwh, waterPricePerM3, energyPricePerKwh }) {
  const water = Math.max(0, volumeL || 0) * (Number(waterPricePerM3) || 0) / 1000;
  const energy = Math.max(0, energyKwh || 0) * (Number(energyPricePerKwh) || 0);
  return { water, energy, total: water + energy };
}

/**
 * @param {number} amount
 * @param {string} [lang]
 * @returns {string}
 */
export function formatEuro(amount, lang = "fr") {
  try {
    return new Intl.NumberFormat(lang, { style: "currency", currency: "EUR" }).format(amount);
  } catch {
    return `${amount.toFixed(2)} €`;
  }
}

// ---------------------------------------------------------------------------
// Animation quality profiles (performance vs. visual richness).
// ---------------------------------------------------------------------------

/** @type {Record<string, AnimationProfile>} */
export const ANIMATION_PROFILES = {
  // Full experience; frame rate follows the display.
  max: {
    fps: 0,
    ambientHz: 0,
    antialias: true,
    flowBubbles: 36,
    richSurface: true,
    deathFilter: true,
    doubleRipple: true,
    shading: true,
    tentacles: 1,
  },
  balanced: {
    fps: 30,
    ambientHz: 0,
    antialias: true,
    flowBubbles: 24,
    richSurface: true,
    deathFilter: true,
    doubleRipple: true,
    shading: true,
    tentacles: 1,
  },
  // Targeted at weak displays such as the Google Nest Hub.
  light: {
    fps: 20,
    // Slow ambient motion (water surface, anemone) refreshes ~8x/s and the
    // edges are not anti-aliased: both cut the per-frame raster work that is
    // the bottleneck on weak displays.
    ambientHz: 8,
    antialias: false,
    flowBubbles: 12,
    richSurface: false,
    deathFilter: false,
    doubleRipple: false,
    // The realistic look leaves its soft shading out.
    shading: false,
    // The anemone has fewer tentacles: fewer shapes to move and to paint.
    tentacles: 0.6,
  },
};

/**
 * @param {string | undefined} quality
 * @returns {AnimationProfile}
 */
export function getAnimationProfile(quality) {
  return (quality && ANIMATION_PROFILES[quality]) || ANIMATION_PROFILES.max;
}

/**
 * Frame limiter: true when enough time has passed since the last rendered
 * frame. `fps` of 0 means "every display frame". A small tolerance absorbs
 * the jitter of 60 Hz timestamps so 20 fps really lands on every third frame.
 *
 * @param {number} timestamp
 * @param {number} lastFrameTs
 * @param {number} fps
 * @returns {boolean}
 */
export function shouldRenderFrame(timestamp, lastFrameTs, fps) {
  if (!fps || !lastFrameTs) return true;
  return timestamp - lastFrameTs >= 1000 / fps - 2;
}

/**
 * Upper bound for the physics time step (in 60 Hz frame units). It has to
 * grow with the frame interval, otherwise a 20 fps card would clamp its own
 * steps and make every animal swim slower.
 *
 * @param {number} fps
 * @returns {number}
 */
export function maxPhysicsDelta(fps) {
  if (!fps) return 2.0;
  return Math.max(2.0, ((1000 / fps) / 16.66) * 1.6);
}

// ---------------------------------------------------------------------------
// Power saving: when to animate, and when a redraw is worth it.
// ---------------------------------------------------------------------------

/**
 * Home Assistant hands the card a new `hass` object every time ANY entity of
 * the whole installation changes. The card only needs to redraw when one of
 * the values it displays changed, which this signature captures. The hours
 * since the last shower are floored because algae only change by the hour.
 *
 * @param {CachedMetrics} metrics
 * @param {string} lang
 * @returns {string}
 */
export function metricsSignature(metrics, lang) {
  return [
    metrics.consumedVolume,
    metrics.temperature,
    metrics.targetBudget,
    metrics.survivalVolume,
    metrics.comfortMin,
    metrics.sensorMissing ? 1 : 0,
    Math.floor(metrics.hoursSinceLastShower),
    metrics.tiers ? metrics.tiers.map((tier) => `${tier.limit}${tier.color}`).join(",") : "",
    lang,
  ].join("|");
}

/**
 * Gives the options that have a range the value the card really uses for them:
 * the number of fish (1 to 10) and the speed of the fish (0.2 to 3). A value
 * above the range is brought down to its top, one below it or not a number falls
 * back to the default, exactly like the card does when it reads its
 * configuration. The visual editor uses this so that what it shows and saves is
 * what the card uses, instead of an out-of-range 20. Options without a range,
 * and options that are not set, are left alone.
 *
 * @param {RawConfig} config
 * @returns {RawConfig}
 */
export function clampRangedOptions(config) {
  const clean = { ...config };
  for (const rule of NUMBER_RULES) {
    if (rule.max === undefined) continue;
    const raw = clean[rule.key];
    if (raw === undefined || raw === null) continue;
    clean[rule.key] = normalizeConfig({ [rule.key]: raw }).config[rule.key];
  }
  return clean;
}

/**
 * Whether continuous motion is allowed. The operating system setting
 * `prefers-reduced-motion` wins unless the user opted out with
 * `respect_reduced_motion: false`.
 *
 * @param {boolean} prefersReducedMotion
 * @param {boolean | undefined} [respectReducedMotion]
 * @returns {boolean}
 */
export function isMotionAllowed(prefersReducedMotion, respectReducedMotion = true) {
  if (respectReducedMotion === false) return true;
  return !prefersReducedMotion;
}

/** Duration (ms) of one simulation step used to settle a still scene. */
export const SETTLE_STEP_MS = 40;

/**
 * Number of simulation steps needed to draw a believable still frame when
 * motion is disabled. A living tank only has to be put back inside the
 * water (one step is enough); a dead tank needs many steps so the animals
 * actually finish sinking to the bottom.
 *
 * @param {boolean} isDead
 * @returns {number}
 */
export function settleSteps(isDead) {
  return isDead ? 120 : 2;
}

// ---------------------------------------------------------------------------
// Configuration validation.
// ---------------------------------------------------------------------------

// One entry per numeric option. `min` is the lowest acceptable value
// (`minExclusive` makes it strict); a value outside the limits falls back to
// `fallback`. `clampMin` / `max` instead pull a valid number into range.
const NUMBER_RULES = [
  { key: "fish_count", fallback: CONFIG_DEFAULTS.fish_count, min: 1, max: 10, integer: true },
  { key: "target_budget", fallback: CONFIG_DEFAULTS.target_budget, min: 0, minExclusive: true },
  { key: "survival_volume", fallback: CONFIG_DEFAULTS.survival_volume, min: 0, minExclusive: true },
  { key: "temp_boiling_threshold", fallback: CONFIG_DEFAULTS.temp_boiling_threshold, min: 0, minExclusive: true },
  { key: "temp_deadly_threshold", fallback: CONFIG_DEFAULTS.temp_deadly_threshold, min: 0, minExclusive: true },
  { key: "comfort_temp_min", fallback: CONFIG_DEFAULTS.comfort_temp_min, min: 0, minExclusive: true },
  { key: "algae_delay_hours", fallback: CONFIG_DEFAULTS.algae_delay_hours, min: 0, minExclusive: true },
  { key: "algae_age", fallback: CONFIG_DEFAULTS.algae_age, min: 0 },
  { key: "fish_speed_multiplier", fallback: CONFIG_DEFAULTS.fish_speed_multiplier, min: 0, minExclusive: true, clampMin: 0.2, max: 3 },
  { key: "aspect_ratio_width", fallback: CONFIG_DEFAULTS.aspect_ratio_width, min: 0, minExclusive: true },
  { key: "aspect_ratio_height", fallback: CONFIG_DEFAULTS.aspect_ratio_height, min: 0, minExclusive: true },
  { key: "water_price_per_m3", fallback: CONFIG_DEFAULTS.water_price_per_m3, min: 0 },
  { key: "energy_price_per_kwh", fallback: CONFIG_DEFAULTS.energy_price_per_kwh, min: 0 },
  { key: "cold_water_temp", fallback: CONFIG_DEFAULTS.cold_water_temp, min: -50 },
];

/**
 * Cleans a user configuration so the rest of the card can trust it: numbers
 * are real numbers inside sensible limits, the theme and the animation
 * quality exist, and the deadly temperature is above the boiling one. Keys
 * that are absent or null (an empty `theme:` in YAML) are dropped so that
 * setConfig() supplies their defaults. Returns the cleaned copy and a human
 * readable warning per correction.
 *
 * @param {RawConfig} config
 * @returns {{ config: RawConfig, warnings: string[] }}
 */
export function normalizeConfig(config) {
  const clean = { ...config };
  const warnings = [];
  for (const key of Object.keys(clean)) {
    if (clean[key] === null || clean[key] === undefined) delete clean[key];
  }

  for (const rule of NUMBER_RULES) {
    const raw = clean[rule.key];
    if (raw === undefined) continue;
    let value = typeof raw === "string" && raw.trim() === "" ? NaN : Number(raw);
    const valid = Number.isFinite(value) && (rule.minExclusive ? value > rule.min : value >= rule.min);
    if (!valid) {
      warnings.push(`${rule.key}: ${JSON.stringify(raw)} is not valid, using ${rule.fallback}`);
      clean[rule.key] = rule.fallback;
      continue;
    }
    if (rule.integer) value = Math.round(value);
    if (rule.clampMin !== undefined && value < rule.clampMin) value = rule.clampMin;
    if (rule.max !== undefined && value > rule.max) value = rule.max;
    if (value !== raw) {
      if (value !== Number(raw)) warnings.push(`${rule.key}: ${JSON.stringify(raw)} is out of range, using ${value}`);
      clean[rule.key] = value;
    }
  }

  if (clean.theme !== undefined && !THEME_PRESETS[clean.theme]) {
    warnings.push(`theme: ${JSON.stringify(clean.theme)} is unknown, using freshwater`);
    clean.theme = "freshwater";
  }
  if (clean.animation_quality !== undefined && !ANIMATION_PROFILES[clean.animation_quality]) {
    warnings.push(`animation_quality: ${JSON.stringify(clean.animation_quality)} is unknown, using max`);
    clean.animation_quality = "max";
  }
  if (clean.gauge_style !== undefined && clean.gauge_style !== "thermometer" && clean.gauge_style !== "arc") {
    warnings.push(`gauge_style: ${JSON.stringify(clean.gauge_style)} is unknown, using thermometer`);
    clean.gauge_style = "thermometer";
  }
  if (clean.creature_style !== undefined && !CREATURE_STYLE_NAMES.includes(clean.creature_style)) {
    warnings.push(`creature_style: ${JSON.stringify(clean.creature_style)} is unknown, using ${CONFIG_DEFAULTS.creature_style}`);
    clean.creature_style = CONFIG_DEFAULTS.creature_style;
  }
  if (clean.title !== undefined && typeof clean.title !== "string") {
    warnings.push("title: must be text, ignoring it");
    clean.title = "";
  }

  const boiling = clean.temp_boiling_threshold ?? CONFIG_DEFAULTS.temp_boiling_threshold;
  const deadly = clean.temp_deadly_threshold ?? CONFIG_DEFAULTS.temp_deadly_threshold;
  if (deadly <= boiling) {
    clean.temp_deadly_threshold = boiling + 1;
    warnings.push(`temp_deadly_threshold: ${deadly} must be above temp_boiling_threshold (${boiling}), using ${boiling + 1}`);
  }

  const comfort = clean.comfort_temp_min ?? DEFAULT_COMFORT_TEMP;
  const boilingLimit = clean.temp_boiling_threshold ?? CONFIG_DEFAULTS.temp_boiling_threshold;
  if (comfort >= boilingLimit) {
    clean.comfort_temp_min = Math.max(1, boilingLimit - 1);
    warnings.push(`comfort_temp_min: ${comfort} must be below temp_boiling_threshold (${boilingLimit}), using ${clean.comfort_temp_min}`);
  }

  return { config: clean, warnings };
}

// ---------------------------------------------------------------------------
// Accessibility text.
// ---------------------------------------------------------------------------

/**
 * Replaces every {name} in `template` by values[name] (unknown names stay).
 *
 * @param {string} template
 * @param {Record<string, unknown>} values
 * @returns {string}
 */
export function fillTemplate(template, values) {
  return String(template).replace(/\{(\w+)\}/g, (match, name) => (name in values ? String(values[name]) : match));
}

/**
 * A budget (or any target) as it is written on screen: whole numbers without
 * decimals, others with one decimal in the language of the user.
 *
 * @param {number} value
 * @param {string} [lang]
 * @returns {string}
 */
export function formatBudget(value, lang = "en") {
  return Number.isInteger(value) ? String(value) : formatNumber(value, lang, 1);
}

/**
 * A number with a fixed number of decimals, in the language of the user.
 *
 * @param {number} value
 * @param {string} [lang]
 * @param {number} [digits]
 * @returns {string}
 */
export function formatNumber(value, lang = "en", digits = 1) {
  try {
    return new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  } catch {
    return Number(value).toFixed(digits);
  }
}


// Hydrao Custom (the integration this card was made for) registers its entities
// under this platform, with one translation key per entity: shower_volume_raw
// (Shower Volume), shower_volume_comfort (Comfort Shower Volume), temperature,
// threshold_4 (Threshold 4) and, for the number entity, comfort_temperature.
const HYDRAO_PLATFORM = "hydrao_custom";

/**
 * Finds the Hydrao Custom entities the card needs, so a new card is filled in
 * without the user picking them.
 *
 * The entity registry (`hass.entities`) is used first: it names the platform and
 * the translation key of each entity, which does not depend on the language Home
 * Assistant had when the device was added. Without it, the id is matched on the
 * English and French names of the entities. Each field is "" when nothing fits.
 *
 * The volume is the "Comfort Shower Volume" (only the water that was hot enough),
 * or the plain "Shower Volume" when the device has no such entity. The target
 * budget is the "Threshold 4" entity, the last level of the showerhead; the
 * "Threshold 1" to "Threshold 3" give the other levels and their colours.
 *
 * @param {{ entities?: Record<string, { platform?: string, translation_key?: string }>, states?: Record<string, unknown> } | null | undefined} hass
 * @param {...(string[] | null | undefined)} entityIdLists  the lists of entity ids Home Assistant hands to the card picker
 * @returns {{ entity: string, temperature_entity: string, comfort_temp_entity: string, target_budget_entity: string, threshold_1_entity: string, threshold_2_entity: string, threshold_3_entity: string }}
 */
export function detectHydraoEntities(hass, ...entityIdLists) {
  const registry = hass && typeof hass.entities === "object" && hass.entities ? hass.entities : {};
  const states = hass && typeof hass.states === "object" && hass.states ? hass.states : {};
  // The card picker only offers the entities that are not on a dashboard yet; the Hydrao ones
  // may be there already. So everything Home Assistant knows is looked at, not only that list.
  const ids = [...new Set([...entityIdLists.flatMap((list) => (Array.isArray(list) ? list : [])), ...Object.keys(registry), ...Object.keys(states)])].sort();

  /**
   * @param {string} domain
   * @param {string[]} translationKeys  the keys the registry may know the entity by
   * @param {RegExp} idPattern  used when the registry does not know the entity
   * @param {RegExp} [exclude]  ids that look alike but are another entity
   * @returns {string}
   */
  const find = (domain, translationKeys, idPattern, exclude) => {
    const inDomain = ids.filter((id) => id.startsWith(`${domain}.`));
    const registered = inDomain.find((id) => registry[id]?.platform === HYDRAO_PLATFORM && translationKeys.includes(registry[id]?.translation_key ?? ""));
    if (registered) return registered;
    return inDomain.find((id) => id.includes("hydrao") && idPattern.test(id) && !(exclude && exclude.test(id))) || "";
  };

  // The cumulative, comfort and wasted volumes end like the shower volume does.
  const otherVolume = /(total|cumul|comfort|confort|wasted|perdu|gaspill)/;
  // The comfort temperature is a number entity, but its id also says "comfort".
  const comfortTemperature = /_minimum_comfort_temperature|_temperature_de_confort_minimum|_temperature_confort_minimum/;

  return {
    // "Comfort Shower Volume", else "Shower Volume": the volume of the current shower.
    // The cumulative, wasted and threshold volumes have other ids and are not taken.
    entity:
      find("sensor", ["shower_volume_comfort"], /_(comfort_shower_volume|shower_comfort_volume|volume_douche_confort|volume_confort_douche|douche_confort)(_\d+)?$/, /(total|cumul|wasted|perdu|gaspill)/) ||
      find("sensor", ["shower_volume_raw"], /_(shower_volume|volume_douche)(_\d+)?$/, otherVolume),
    temperature_entity: find("sensor", ["temperature"], /_temperature(_\d+)?$/),
    comfort_temp_entity: find("number", ["comfort_temperature"], /_(minimum_comfort_temperature|temperature_de_confort_minimum|temperature_confort_minimum)(_\d+)?$/),
    // "Threshold 4": the last level in litres of the showerhead.
    target_budget_entity: find("sensor", ["threshold_4"], /_(threshold|seuil)_4(_\d+)?$/, comfortTemperature),
    // "Threshold 1" to "Threshold 3": with the fourth, the coloured tiers of the showerhead.
    threshold_1_entity: find("sensor", ["threshold_1"], /_(threshold|seuil)_1(_\d+)?$/),
    threshold_2_entity: find("sensor", ["threshold_2"], /_(threshold|seuil)_2(_\d+)?$/),
    threshold_3_entity: find("sensor", ["threshold_3"], /_(threshold|seuil)_3(_\d+)?$/),
  };
}
