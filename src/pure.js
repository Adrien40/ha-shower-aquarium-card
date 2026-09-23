// Pure, DOM-free helpers extracted from shower-aquarium-card.js. Kept
// separate so the card's actual decision logic (death/boiling/stress
// thresholds, canvas sizing, fish generation) can be unit tested without
// mounting a LitElement or driving requestAnimationFrame.

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
      "#b45309",
      "#78350f",
      "#ffffff",
      "#94a3b8",
    ],
  },
};

export function getTheme(themeKey) {
  return THEME_PRESETS[themeKey] || THEME_PRESETS.freshwater;
}

/**
 * The SVG viewBox height, derived from the configured aspect ratio and
 * clamped to a sane range so an extreme or malformed ratio can't produce
 * a degenerate (near-zero or huge) canvas.
 */
export function computeCanvasHeight(config) {
  const rWidth = Number(config?.aspect_ratio_width) || 1024;
  const rHeight = Number(config?.aspect_ratio_height) || 600;
  return Math.max(400, Math.min(2048, Math.round(1024 * (rHeight / rWidth))));
}

/**
 * Reads the configured entities off hass.states and returns the metrics
 * the rest of the card needs, with every value defaulted/clamped so a
 * missing, unknown, or non-numeric sensor state never produces NaN
 * downstream (which would silently freeze the animation and gauges).
 */
export function computeCachedMetrics(hass, config) {
  const metrics = {
    consumedVolume: 0,
    hoursSinceLastShower: 0,
    temperature: 0,
    targetBudget: Number(config?.target_budget) || 50,
    survivalVolume: Number(config?.survival_volume) || 10,
  };

  if (!hass || !config) {
    return metrics;
  }

  if (config.entity && hass.states[config.entity]) {
    const stateObj = hass.states[config.entity];
    const val = parseFloat(stateObj.state);
    metrics.consumedVolume = isNaN(val) ? 0 : Math.max(0, val);

    if (stateObj.last_changed) {
      const lastTime = new Date(stateObj.last_changed).getTime();
      metrics.hoursSinceLastShower = Math.max(0, (Date.now() - lastTime) / (1000 * 60 * 60));
    }
  }

  if (config.temperature_entity && hass.states[config.temperature_entity]) {
    const t = parseFloat(hass.states[config.temperature_entity].state);
    metrics.temperature = isNaN(t) ? 0 : t;
  }

  if (config.target_budget_entity && hass.states[config.target_budget_entity]) {
    const tVal = parseFloat(hass.states[config.target_budget_entity].state);
    if (!isNaN(tVal)) {
      metrics.targetBudget = tVal;
    }
  }

  return metrics;
}

/**
 * Which of a theme's 4 species slot a fish at this index gets. Saltwater
 * is hand-tuned (indices 0-1 are the clownfish pair, always shown first;
 * see the isClownfish special-casing in generateDefaultFishes and the
 * physics/render code that keeps them near the anemone) rather than a
 * flat index % speciesCount like the other two themes.
 */
export function assignSpecies(index, themeKey) {
  if (themeKey === "saltwater") {
    if (index < 2) return 0;
    if (index === 2) return 1;
    if (index === 3) return 3;
    return 2;
  }
  if (themeKey === "coldwater") {
    return index % 3;
  }
  return index % 4;
}

const FISH_SIZE_PRESETS = [1.35, 1.65, 1.2, 1.85, 1.45, 1.6, 1.25, 1.75, 1.3, 1.5];

/**
 * Builds the initial fish array for a fresh config (theme change or fish
 * count change). Uses Math.random() for position/speed jitter -- by
 * design, not a bug to eliminate: the point is a tank that doesn't look
 * identically laid out every time. Tests assert on structure/ranges/species
 * assignment, not exact coordinates.
 */
export function generateDefaultFishes(count, themeKey) {
  const theme = getTheme(themeKey);
  const n = Math.min(10, Math.max(1, Number(count) || 4));

  return Array.from({ length: n }, (_, index) => {
    const species = assignSpecies(index, themeKey);
    const isClownfish = themeKey === "saltwater" && species === 0;
    const baseVx = 1.38 - (FISH_SIZE_PRESETS[index % FISH_SIZE_PRESETS.length] - 1.2) * 0.2;
    const jitterX = Math.random() * 50 - 25;
    const jitterY = Math.random() * 50 - 25;
    return {
      species,
      color: theme.palette[index % theme.palette.length],
      scale: FISH_SIZE_PRESETS[index % FISH_SIZE_PRESETS.length],
      phase: Math.random() * 6.28,
      x: isClownfish ? 190 + index * 140 : 120 + (index * 760) / Math.max(1, n - 1) + jitterX,
      y: isClownfish ? 470 : 160 + (index % 3) * 90 + jitterY,
      vx: baseVx * (0.8 + Math.random() * 0.4),
      vy: 0.45 * (Math.random() < 0.5 ? 1 : -1) * (0.7 + Math.random() * 0.5),
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
 */
export function computeTankState({ config, metrics, canvasHeight }) {
  const targetBudget = metrics.targetBudget;
  const survivalVolume = metrics.survivalVolume;
  const totalVolume = targetBudget + survivalVolume;
  const currentVolume = metrics.consumedVolume;
  const currentTemp = metrics.temperature;

  const boilTemp = Number(config?.temp_boiling_threshold) || 40;
  const deadlyTemp = Number(config?.temp_deadly_threshold) || 45;

  const remainingVolumeInTank = Math.max(0, totalVolume - currentVolume);
  const waterRatio = totalVolume > 0 ? Math.max(0, Math.min(1, remainingVolumeInTank / totalVolume)) : 0;

  const isFullscreen = Boolean(config?.fullscreen);
  const tankTop = isFullscreen ? 0 : 15;
  const tankBottom = isFullscreen ? 600 : canvasHeight - 35;
  const tankHeight = tankBottom - tankTop;
  const waterSurfaceY = tankBottom - waterRatio * tankHeight;

  const isHeatDead = currentTemp >= deadlyTemp && currentTemp > 0;
  const isWaterDead = remainingVolumeInTank <= 0;
  const isDead = isHeatDead || isWaterDead;

  const isBoiling = currentTemp >= boilTemp && currentTemp > 0;
  const isCritical = currentVolume > targetBudget && !isDead;
  const isWarning = currentVolume > targetBudget * 0.7 && !isCritical && !isDead;

  const userSpeed = Number(config?.fish_speed_multiplier) || 1.2;
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
 * Color + fill-fraction for the two status-panel gauges. Split out of
 * _renderStatusPanel because the 3-tier color ramp (normal -> warning ~38°C
 * -> boiling -> deadly, and normal -> 70% of budget -> over budget) is
 * exactly the kind of off-by-one-threshold logic worth pinning down with
 * tests independent of the SVG markup around it.
 */
export function computeGaugeState({ currentTemp, currentVolume, targetBudget, deadlyTemp, boilTemp }) {
  const tempFraction = Math.max(0, Math.min(1, currentTemp / 45));
  const tempColor =
    currentTemp >= deadlyTemp ? "#ef4444" : currentTemp >= boilTemp ? "#f97316" : currentTemp >= 38 ? "#f59e0b" : "#0284c7";

  const volFraction = Math.max(0, Math.min(1, currentVolume / Math.max(1, targetBudget)));
  const volColor = currentVolume > targetBudget ? "#ef4444" : currentVolume > targetBudget * 0.7 ? "#f59e0b" : "#0284c7";

  return { tempFraction, tempColor, volFraction, volColor };
}

// ---------------------------------------------------------------------------
// Interactivity, water flow and end-of-shower celebration helpers.
// Everything below is pure (no DOM, no timers) so it can be unit-tested; the
// card only feeds it the clock and applies the results.
// ---------------------------------------------------------------------------

/** How long (ms) without any volume increase before the water counts as stopped. */
export const FLOW_ACTIVE_WINDOW_MS = 8000;
/** Duration (ms) of the end-of-shower celebration. */
export const CELEBRATION_DURATION_MS = 7000;
/** Duration (ms) of the shock wave drawn on the glass. */
export const RIPPLE_DURATION_MS = 900;

export function createFlowTracker() {
  return { lastVolume: null, lastIncreaseAt: 0, target: 0, showerActive: false };
}

/**
 * Feeds a new consumed-volume sample into the flow tracker and returns the
 * next tracker state. The card only knows the cumulative volume, so the flow
 * is inferred from how fast that volume grows between two increases.
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

/** Target flow intensity (0..1) for the current instant. */
export function flowTarget(state, now) {
  if (!state.lastIncreaseAt) return 0;
  return now - state.lastIncreaseAt < FLOW_ACTIVE_WINDOW_MS ? state.target : 0;
}

/** True once a running shower has gone quiet for the whole activity window. */
export function isShowerOver(state, now) {
  return (
    state.showerActive &&
    state.lastIncreaseAt > 0 &&
    now - state.lastIncreaseAt >= FLOW_ACTIVE_WINDOW_MS
  );
}

export function qualifiesForCelebration(volume, targetBudget, isDead) {
  return !isDead && volume > 0 && volume <= targetBudget;
}

/** Number of bubbles in the rising stream for a given flow intensity. */
export function flowBubbleCount(intensity, max = 36) {
  if (!(intensity > 0.02)) return 0;
  return Math.min(max, Math.round(4 + intensity * (max - 4)));
}

/**
 * A tap near the water surface drops food; a tap deeper in the tank knocks on
 * the glass.
 */
export function classifyTap(y, waterSurfaceY, margin = 45) {
  return y <= waterSurfaceY + margin ? "feed" : "knock";
}

/** Startle impulse for a fish at (fx, fy) when the glass is knocked at (tx, ty). */
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

/** Closest food flake within range of a fish, or null. */
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

export function createFlakes(x, y, count = 6, rand = Math.random) {
  const palette = ["#f59e0b", "#fbbf24", "#fb923c", "#facc15"];
  return Array.from({ length: count }, () => ({
    x: x + (rand() - 0.5) * 70,
    y: y + rand() * 12,
    vy: 0.45 + rand() * 0.4,
    phase: rand() * Math.PI * 2,
    r: 3.4 + rand() * 2,
    color: palette[Math.floor(rand() * palette.length)],
    landedAt: 0,
    eaten: false,
  }));
}

export function createCelebrationParticles(count = 42, rand = Math.random) {
  const palette = ["#fde047", "#fbbf24", "#f59e0b", "#fcd34d"];
  return Array.from({ length: count }, () => ({
    x: 60 + rand() * 904,
    r: 3 + rand() * 6,
    speed: 70 + rand() * 110, // px per second
    delay: rand() * 2.6, // seconds
    phase: rand() * Math.PI * 2,
    color: palette[Math.floor(rand() * palette.length)],
  }));
}

/** Overshooting "pop" curve used for the trophy: 0 -> ~1.15 -> 1. */
export function celebrationScale(ageMs) {
  const t = Math.max(0, Math.min(1, ageMs / 900));
  const c1 = 2.2;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/** Opacity of the celebration overlay: full, then fading over the last 1.4 s. */
export function celebrationOpacity(ageMs) {
  const fadeStart = CELEBRATION_DURATION_MS - 1400;
  if (ageMs <= fadeStart) return 1;
  return Math.max(0, 1 - (ageMs - fadeStart) / 1400);
}

// ---------------------------------------------------------------------------
// Night mode and cost estimation helpers.
// ---------------------------------------------------------------------------

/**
 * Whether the configured "night" entity says it is dark:
 *  - sun.*                              -> below_horizon
 *  - binary_sensor / input_boolean / switch -> on
 *  - sensor (illuminance in lx)         -> value below the threshold
 */
export function isNightFromEntity(entityId, stateObj, luxThreshold = 20) {
  if (!entityId || !stateObj || stateObj.state === undefined) return false;
  const domain = String(entityId).split(".")[0];
  const state = String(stateObj.state);
  if (domain === "sun") return state === "below_horizon";
  if (domain === "binary_sensor" || domain === "input_boolean" || domain === "switch") {
    return state === "on";
  }
  if (domain === "sensor") {
    const lux = parseFloat(state);
    return !isNaN(lux) && lux < luxThreshold;
  }
  return false;
}

const WATER_HEAT_KWH_PER_L_PER_K = 4.186 / 3600; // 1 L of water, 1 K, in kWh

/** Energy (kWh) needed to heat `volumeL` litres from `coldC` to `tempC`. */
export function estimateEnergyKwh(volumeL, tempC, coldC = 15) {
  if (!(volumeL > 0) || !(tempC > coldC)) return 0;
  return volumeL * (tempC - coldC) * WATER_HEAT_KWH_PER_L_PER_K;
}

export function computeShowerCost({ volumeL, energyKwh, waterPricePerM3, energyPricePerKwh }) {
  const water = Math.max(0, volumeL || 0) * (Number(waterPricePerM3) || 0) / 1000;
  const energy = Math.max(0, energyKwh || 0) * (Number(energyPricePerKwh) || 0);
  return { water, energy, total: water + energy };
}

export function formatEuro(amount, lang = "fr") {
  try {
    return new Intl.NumberFormat(lang, { style: "currency", currency: "EUR" }).format(amount);
  } catch {
    return `${amount.toFixed(2)} €`;
  }
}
