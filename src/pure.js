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
