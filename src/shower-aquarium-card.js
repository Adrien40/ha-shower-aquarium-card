import { LitElement, html } from "lit";
import { CARD_VERSION, REPOSITORY_URL } from "./version.js";
import { CONFIG_DEFAULTS } from "./defaults.js";
import { cardStyles } from "./styles.js";
import { resolveLang, translate } from "./translations.js";
import "./card-editor.js";
import { renderWaterSurface } from "./render/water.js";
import { renderThemeDecoration, renderAlgae } from "./render/decor.js";
import { renderFishShape } from "./render/fish.js";
import { renderAncistrus, renderShrimp, renderCrab } from "./render/creatures.js";
import {
  renderFlowBubbles,
  renderFood,
  renderRipples,
} from "./render/effects.js";
import { renderCostLabel, renderFpsBadge } from "./render/hud.js";
import { renderGoby } from "./render/goby.js";
import { renderTankSvg } from "./render/scene.js";
import { renderMetricsGrid } from "./render/metrics.js";
import { createInitialScene } from "./scene.js";
import {
  createFrame,
  advanceDeath,
  smoothFlowIntensity,
  pruneRipples,
  stepFood,
  stepFlowBubbles,
  stepRisingBubbles,
  stepBoilingBubbles,
  stepFish,
  separateFish,
  stepSnail,
  stepAncistrus,
  stepCrawler,
  startleAncistrus,
  startleCrawler,
  SHRIMP_SPEC,
  CRAB_SPEC,
  GOBY_SPEC,
} from "./physics.js";
import {
  getTheme,
  computeCanvasHeight,
  computeCachedMetrics,
  generateDefaultFishes,
  computeTankState,
  createFlowTracker,
  trackFlow,
  flowTarget,
  isShowerOver,
  classifyTap,
  computeScareKick,
  createFlakes,
  getAnimationProfile,
  shouldRenderFrame,
  maxPhysicsDelta,
  estimateEnergyKwh,
  computeShowerCost,
  stripLegacyConfigKeys,
  metricsSignature,
  normalizeConfig,
  fillTemplate,
  detectHydraoEntities,
  formatNumber,
  isMotionAllowed,
  CANVAS_WIDTH,
  SENSOR_LOST_DELAY_MS,
  settleSteps,
  SETTLE_STEP_MS,
} from "./pure.js";

/** @typedef {import("./types.js").CardConfig} CardConfig */
/** @typedef {import("./types.js").CachedMetrics} CachedMetrics */
/** @typedef {import("./types.js").Hass} Hass */
/** @typedef {import("./types.js").Fish} Fish */
/** @typedef {import("./types.js").Flake} Flake */
/** @typedef {import("./types.js").Ripple} Ripple */
/** @typedef {import("./types.js").TankState} TankState */

// Looked up at call time (not captured) so tests can replace Math.random.
const randomSource = () => Math.random();

export class AquariumShowerCard extends LitElement {
  static get properties() {
    return {
      // Not reactive on purpose: Home Assistant replaces `hass` on every state
      // change of the whole installation. The hass setter requests a redraw
      // itself, and only when a displayed value changed.
      _hass: { type: Object, hasChanged: () => false },
      // Set by Home Assistant while the card is shown in the editor's preview.
      preview: { type: Boolean },
      _config: { type: Object },
      _fishes: { type: Array },
      _snails: { type: Array },
      _ancistrus: { type: Object },
      _shrimp: { type: Object },
      _crab: { type: Object },
      _goby: { type: Object },
      _bubbles: { type: Array },
      _boilingBubbles: { type: Array },
      _flowBubbles: { type: Array },
      _food: { type: Array },
      _ripples: { type: Array },
      _fpsInfo: { type: String },
      _announcement: { type: String },
    };
  }

  static async getConfigElement() {
    return document.createElement("shower-aquarium-card-editor");
  }

  /**
   * @param {unknown} hass
   * @param {string[]} entities
   * @returns {Record<string, unknown>}
   */
  static getStubConfig(hass, entities) {
    const hydrao = detectHydraoEntities(/** @type {any} */ (hass), entities);
    const defaultEntity =
      hydrao.entity ||
      entities.find((e) => e.includes("shower") || e.includes("hydrao")) ||
      entities[0] ||
      "";
    const tempEntity =
      hydrao.temperature_entity ||
      entities.find(
        (e) =>
          e.includes("temperature") &&
          (e.includes("shower") || e.includes("hydrao"))
      ) ||
      "";
    const d = CONFIG_DEFAULTS;
    return {
      entity: defaultEntity,
      temperature_entity: tempEntity,
      ...(hydrao.comfort_temp_entity ? { comfort_temp_entity: hydrao.comfort_temp_entity } : {}),
      title: d.title,
      theme: d.theme,
      aspect_ratio_width: d.aspect_ratio_width,
      aspect_ratio_height: d.aspect_ratio_height,
      fish_count: d.fish_count,
      target_budget: d.target_budget,
      survival_volume: d.survival_volume,
      temp_boiling_threshold: d.temp_boiling_threshold,
      temp_deadly_threshold: d.temp_deadly_threshold,
      algae_enabled: d.algae_enabled,
      algae_delay_hours: d.algae_delay_hours,
      algae_age: d.algae_age,
      fish_speed_multiplier: d.fish_speed_multiplier,
      fullscreen: d.fullscreen,
    };
  }

  constructor() {
    super();
    this._animationFrameId = null;
    this.preview = false;
    this._deathProgress = 0;
    this._flow = createFlowTracker();
    this._flowIntensity = 0;
    /** @type {Flake[]} */
    this._food = [];
    /** @type {Ripple[]} */
    this._ripples = [];
    this._fpsInfo = "";
    // Text read out by screen readers after a keyboard action; the flag makes two
    // identical announcements in a row still differ, so both are read.
    this._announcement = "";
    this._announceFlip = false;
    this._rafCount = 0;
    this._tickCount = 0;
    this._fpsWindowStart = 0;
    /** @type {CardConfig | undefined} */
    this._config = undefined;
    /** @type {Hass | undefined} */
    this._hass = undefined;
    // Size (px) of the area the card fills in fullscreen mode; null until measured.
    /** @type {{ width: number, height: number } | null} */
    this._viewport = null;
    /** @type {ResizeObserver | null} */
    this._resizeObserver = null;
    this._energyKwh = 0;
    // Result of the last computeCachedMetrics(): lets a broken volume sensor keep its last reading.
    /** @type {CachedMetrics | null} */
    this._metrics = null;
    // When the volume sensor lost its value (epoch ms), or null while it has one.
    /** @type {number | null} */
    this._sensorLostSince = null;
    /** @type {ReturnType<typeof setTimeout> | null} */
    this._sensorTimer = null;
    this._metricsSignature = "";
    this._onScreen = true;
    this._pageVisible = typeof document === "undefined" || document.visibilityState !== "hidden";
    this._prefersReducedMotion = false;
    this._intersectionObserver = null;
    this._motionQuery = null;
    this._onVisibilityChange = () => {
      this._pageVisible = document.visibilityState !== "hidden";
      this._syncAnimation();
    };
    this._onMotionPreferenceChange = (/** @type {{ matches: boolean }} */ event) => {
      this._prefersReducedMotion = Boolean(event.matches);
      this._syncAnimation();
    };
    this._lastTimestamp = 0;
    this._lastFrameTs = 0;
    this._animTime = 0;
    this._ambientTime = 0;
    this._lastAmbientTs = 0;
    this._cachedConsumedVolume = 0;
    this._cachedTemperature = 0;
    /** @type {number} */
    this._cachedTargetBudget = CONFIG_DEFAULTS.target_budget;
    /** @type {number} */
    this._cachedSurvivalVolume = CONFIG_DEFAULTS.survival_volume;
    /** @type {number} */
    this._cachedComfortMin = CONFIG_DEFAULTS.comfort_temp_min;
    // Last temperature above 0 seen while some water was consumed: the fullscreen
    // thermometer keeps showing it when the temperature sensor falls back to 0
    // between two showers. It only feeds the display, never the state of the tank.
    this._lastTemperature = 0;
    this._cachedHoursSinceLastShower = 0;

    this._fishes = generateDefaultFishes(4, "freshwater");
    const scene = createInitialScene();
    this._snails = scene.snails;
    this._ancistrus = scene.ancistrus;
    this._shrimp = scene.shrimp;
    this._crab = scene.crab;
    this._goby = scene.goby;
    this._bubbles = scene.bubbles;
    this._boilingBubbles = scene.boilingBubbles;
    this._flowBubbles = scene.flowBubbles;
  }

  static get styles() {
    return cardStyles;
  }

  /**
   * @param {string} key
   * @returns {string}
   */
  _t(key) {
    return translate(resolveLang(this._hass), key);
  }

  _getCanvasHeight() {
    return computeCanvasHeight(this._config, this._viewport);
  }

  // Refreshes the cached values and returns true when something the card
  // displays changed since the previous call.
  _updateCachedMetrics() {
    if (!this._hass || !this._config) return false;
    const metrics = computeCachedMetrics(this._hass, this._config, this._metrics);
    this._metrics = metrics;
    this._cachedConsumedVolume = metrics.consumedVolume;
    this._cachedHoursSinceLastShower = metrics.hoursSinceLastShower;
    this._cachedTemperature = metrics.temperature;
    this._cachedTargetBudget = metrics.targetBudget;
    this._cachedSurvivalVolume = metrics.survivalVolume;
    this._cachedComfortMin = metrics.comfortMin;
    if (metrics.consumedVolume <= 0) this._lastTemperature = 0;
    else if (metrics.temperature > 0) this._lastTemperature = metrics.temperature;
    this._trackSensor(metrics.sensorMissing);
    const signature = metricsSignature(metrics, resolveLang(this._hass));
    const changed = signature !== this._metricsSignature;
    this._metricsSignature = signature;
    return changed;
  }

  // Remembers since when the volume sensor has no usable value, and wakes the
  // card up when the delay is over (with motion disabled nothing else would).
  /**
   * @param {boolean} missing
   */
  _trackSensor(missing) {
    if (!missing) {
      this._sensorLostSince = null;
      this._clearSensorTimer();
      return;
    }
    if (this._sensorLostSince === null) this._sensorLostSince = Date.now();
    this._scheduleSensorTimer();
  }

  _scheduleSensorTimer() {
    if (this._sensorTimer !== null || this._sensorLostSince === null || !this.isConnected) return;
    const wait = Math.max(0, SENSOR_LOST_DELAY_MS - (Date.now() - this._sensorLostSince));
    this._sensorTimer = setTimeout(() => {
      this._sensorTimer = null;
      this.requestUpdate();
    }, wait);
  }

  _clearSensorTimer() {
    if (this._sensorTimer === null) return;
    clearTimeout(this._sensorTimer);
    this._sensorTimer = null;
  }

  // True once the volume sensor has been without a usable value for the whole delay.
  get _sensorLost() {
    return this._sensorLostSince !== null && Date.now() - this._sensorLostSince >= SENSOR_LOST_DELAY_MS;
  }

  /**
   * @param {Record<string, any>} config
   */
  setConfig(config) {
    if (!config || typeof config.entity !== "string" || !config.entity.trim()) {
      throw new Error("Please define a valid entity.");
    }
    const { config: cleaned, warnings } = normalizeConfig(stripLegacyConfigKeys(config));
    warnings.forEach((warning) => console.warn(`[shower-aquarium-card] ${warning}`));
    this._config = /** @type {CardConfig} */ ({ ...CONFIG_DEFAULTS, ...cleaned });

    if (this._config.fullscreen) {
      this.setAttribute("fullscreen", "");
    } else {
      this.removeAttribute("fullscreen");
    }

    this._fishes = generateDefaultFishes(this._config.fish_count, this._config.theme);

    this._flow = createFlowTracker();
    this._food = [];

    // The last reading belongs to the previous configuration (maybe another sensor).
    this._metrics = null;
    this._lastTemperature = 0;
    this._sensorLostSince = null;
    this._clearSensorTimer();
    this._updateCachedMetrics();
    this._syncAnimation();
    this.requestUpdate();
  }

  /**
   * @param {Hass} hass
   */
  set hass(hass) {
    this._hass = hass;
    const changed = this._updateCachedMetrics();
    this._trackFlow();
    if (changed) this._onDataChanged();
  }

  // True when the card is on screen and its tab is in the foreground.
  get _visible() {
    return this._onScreen && this._pageVisible;
  }

  // True unless the user asked the system for reduced motion (and did not
  // opt out with respect_reduced_motion: false).
  get _motionAllowed() {
    return isMotionAllowed(this._prefersReducedMotion, this._config?.respect_reduced_motion);
  }

  // Nothing to draw while the card is hidden; it is redrawn on the way back
  // (see _syncAnimation).
  shouldUpdate() {
    return this._visible;
  }

  // The area the card fills changed. Only fullscreen mode cares: there the
  // drawing takes the shape of the screen instead of being stretched to it.
  // Creatures are put back into the resized tank like after a change of data.
  /**
   * @param {number} width  width of the area, in pixels
   * @param {number} height  height of the area, in pixels
   */
  _onResize(width, height) {
    if (!this._config?.fullscreen) return;
    const before = this._getCanvasHeight();
    this._viewport = { width, height };
    if (this._getCanvasHeight() === before) return;
    this._onDataChanged();
  }

  // A displayed value changed: draw it. With motion disabled there is no
  // animation loop, so the still scene is settled to the new water level first.
  _onDataChanged() {
    if (this._visible && !this._motionAllowed) this._settleScene();
    this.requestUpdate();
  }

  // Motion disabled: no loop runs, so put the creatures where they belong for
  // the current water level (and finish any death animation) in one go.
  _settleScene() {
    const tank = this._tankState();
    if (!tank) return;
    const { isDead } = tank;
    this._food = [];
    this._ripples = [];
    this._lastTimestamp = 0;
    const steps = settleSteps(isDead);
    for (let i = 0; i < steps; i++) this._updatePhysics(1000 + i * SETTLE_STEP_MS);
    this._lastTimestamp = 0;
  }

  // Runs the animation loop only while it can be seen and is allowed;
  // otherwise stops it and draws one still frame.
  _syncAnimation() {
    if (!this.isConnected) {
      this._stopAnimation();
      return;
    }
    if (this._visible && this._motionAllowed) {
      this._startAnimation();
      this.requestUpdate();
      return;
    }
    // Reaching this point while visible means motion is not allowed.
    this._stopAnimation();
    if (this._visible) {
      this._settleScene();
      this.requestUpdate();
    }
  }

  // Feeds the cumulative-volume sensor into the flow tracker. Skipped while
  // the entity is missing/unavailable so a reconnect is not mistaken for a
  // shower.
  _trackFlow() {
    if (!this._hass || !this._config) return;
    const raw = this._hass.states?.[this._config.entity]?.state;
    if (raw === undefined || isNaN(parseFloat(raw))) return;
    const volume = this._cachedConsumedVolume;
    const previous = this._flow.lastVolume;
    const coldTemp = this._config.cold_water_temp;
    // Heating energy is accumulated litre by litre at the temperature
    // measured when the water flowed, so it survives temperature changes.
    if (previous === null || volume < previous - 1e-6) {
      this._energyKwh = estimateEnergyKwh(volume, this._cachedTemperature, coldTemp);
    } else if (volume > previous + 1e-6) {
      this._energyKwh += estimateEnergyKwh(volume - previous, this._cachedTemperature, coldTemp);
    }
    this._flow = trackFlow(this._flow, volume, Date.now());
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this._onVisibilityChange);
    this._pageVisible = document.visibilityState !== "hidden";
    if (typeof IntersectionObserver === "function") {
      this._intersectionObserver = new IntersectionObserver((entries) => {
        const last = entries[entries.length - 1];
        if (!last || last.isIntersecting === this._onScreen) return;
        this._onScreen = last.isIntersecting;
        this._syncAnimation();
      });
      this._intersectionObserver.observe(this);
    }
    if (typeof ResizeObserver === "function") {
      this._resizeObserver = new ResizeObserver((entries) => {
        const last = entries[entries.length - 1];
        if (last) this._onResize(last.contentRect.width, last.contentRect.height);
      });
      this._resizeObserver.observe(this);
    }
    if (typeof window.matchMedia === "function") {
      this._motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this._prefersReducedMotion = Boolean(this._motionQuery.matches);
      this._motionQuery.addEventListener?.("change", this._onMotionPreferenceChange);
    }
    this._scheduleSensorTimer();
    this._syncAnimation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearSensorTimer();
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
    this._intersectionObserver?.disconnect();
    this._intersectionObserver = null;
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._motionQuery?.removeEventListener?.("change", this._onMotionPreferenceChange);
    this._motionQuery = null;
    this._stopAnimation();
  }

  // Debug overlay (show_fps): once per second, how many display frames the
  // browser actually delivered and how many simulation ticks were drawn.
  /**
   * @param {number} timestamp
   */
  _sampleFps(timestamp) {
    if (!this._fpsWindowStart) this._fpsWindowStart = timestamp;
    const elapsed = timestamp - this._fpsWindowStart;
    if (elapsed < 1000) return;
    const raf = Math.round((this._rafCount * 1000) / elapsed);
    const ticks = Math.round((this._tickCount * 1000) / elapsed);
    const quality = this._config?.animation_quality || "max";
    this._fpsInfo = `v${CARD_VERSION} · ${quality} · display ${raf}/s · drawn ${ticks}/s`;
    this._rafCount = 0;
    this._tickCount = 0;
    this._fpsWindowStart = timestamp;
    this.requestUpdate();
  }

  // Animation quality profile (frame cap + which effects are simplified).
  get _profile() {
    return getAnimationProfile(this._config?.animation_quality);
  }

  _startAnimation() {
    if (!this._animationFrameId) {
      // A restart (after being hidden) must not see the hidden time as one
      // huge frame, nor mix it into the FPS measurement.
      this._lastTimestamp = 0;
      this._lastFrameTs = 0;
      this._fpsWindowStart = 0;
      this._rafCount = 0;
      this._tickCount = 0;
      const loop = (/** @type {number} */ timestamp) => {
        this._rafCount++;
        if (shouldRenderFrame(timestamp, this._lastFrameTs, this._profile.fps)) {
          this._lastFrameTs = timestamp;
          this._tickCount++;
          this._updatePhysics(timestamp);
        }
        if (this._config?.show_fps) this._sampleFps(timestamp);
        this._animationFrameId = requestAnimationFrame(loop);
      };
      this._animationFrameId = requestAnimationFrame(loop);
    }
  }

  _stopAnimation() {
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }

  /**
   * @param {number} timestamp
   */
  _updatePhysics(timestamp) {
    const config = this._config;
    if (!config) return;
    if (!this._lastTimestamp) {
      this._lastTimestamp = timestamp;
    }
    const deltaMs = timestamp - this._lastTimestamp;
    const profile = this._profile;
    const delta = Math.min(deltaMs / 16.66, maxPhysicsDelta(profile.fps));
    this._lastTimestamp = timestamp;
    this._animTime = timestamp * 0.0035;
    // Slowly-moving ambient elements use a clock that ticks less often in
    // the light profile, so they are repainted less often.
    if (!profile.ambientHz || timestamp - this._lastAmbientTs >= 1000 / profile.ambientHz) {
      this._ambientTime = this._animTime;
      this._lastAmbientTs = timestamp;
    }

    const metrics = {
      consumedVolume: this._cachedConsumedVolume,
      temperature: this._cachedTemperature,
      targetBudget: this._cachedTargetBudget,
      survivalVolume: this._cachedSurvivalVolume,
    };
    const nowMs = Date.now();
    const frame = createFrame({
      timestamp,
      deltaMs,
      delta,
      nowMs,
      animTime: this._animTime,
      tank: computeTankState({
        config,
        metrics,
        canvasHeight: this._getCanvasHeight(),
      }),
      userSpeed: config.fish_speed_multiplier,
      themeKey: config.theme || "freshwater",
    });
    const { isDead } = frame;
    let stateChanged = false;

    this._deathProgress = advanceDeath(this._deathProgress, isDead, frame.deathStep);

    // --- Water flow: smoothed intensity + end-of-shower detection ---------
    const motion = this._motionAllowed;
    const flowGoal = isDead || !motion ? 0 : flowTarget(this._flow, nowMs);
    this._flowIntensity = smoothFlowIntensity(this._flowIntensity, flowGoal, delta);

    if (isShowerOver(this._flow, nowMs)) {
      this._flow = { ...this._flow, showerActive: false };
    }

    // --- Shock waves on the glass ----------------------------------------
    if (this._ripples.length > 0) {
      this._ripples = pruneRipples(this._ripples, nowMs);
      stateChanged = true;
    }

    // --- Fish food, bubbles ----------------------------------------------
    const food = stepFood(this._food, frame);
    // Assigning a reactive property, even to the same value, notifies Lit.
    if (food.food !== this._food) this._food = food.food;
    if (food.changed) stateChanged = true;

    if (stepFlowBubbles(this._flowBubbles, frame, this._flowIntensity, profile.flowBubbles, randomSource)) {
      stateChanged = true;
    }
    if (this._flowIntensity > 0) stateChanged = true;

    // --- Creatures --------------------------------------------------------
    if (this._fishes && this._fishes.length > 0) {
      this._fishes.forEach((fish) => stepFish(fish, frame, this._food));
      separateFish(this._fishes, frame);
      stateChanged = true;
    }
    if (this._snails && this._snails.length > 0) {
      this._snails.forEach((snail) => stepSnail(snail, frame));
      stateChanged = true;
    }
    if (this._ancistrus) {
      stepAncistrus(this._ancistrus, frame, randomSource);
      stateChanged = true;
    }
    if (this._shrimp) {
      stepCrawler(this._shrimp, frame, SHRIMP_SPEC, randomSource);
      stateChanged = true;
    }
    if (this._crab) {
      stepCrawler(this._crab, frame, CRAB_SPEC, randomSource);
      stateChanged = true;
    }
    if (this._goby) {
      stepCrawler(this._goby, frame, GOBY_SPEC, randomSource);
      stateChanged = true;
    }

    if (this._bubbles && stepRisingBubbles(this._bubbles, frame)) stateChanged = true;
    if (this._boilingBubbles && stepBoilingBubbles(this._boilingBubbles, frame, randomSource)) {
      stateChanged = true;
    }

    if (stateChanged) {
      this.requestUpdate();
    }
  }

  /**
   * @param {number} x1
   * @param {number} x2
   * @param {number} y
   */
  _renderWaterSurface(x1, x2, y) {
    return renderWaterSurface(this, x1, x2, y);
  }

  /**
   * @param {string} themeKey
   * @param {boolean} isFullscreen
   * @param {number} [deathProgress]
   */
  _renderThemeDecoration(themeKey, isFullscreen, deathProgress = 0) {
    return renderThemeDecoration(this, themeKey, isFullscreen, deathProgress);
  }

  /**
   * @param {Fish} fish
   * @param {string} themeKey
   * @param {boolean} isDead
   */
  _renderFishShape(fish, themeKey, isDead) {
    return renderFishShape(this, fish, themeKey, isDead);
  }

  /**
   * @param {boolean} isDead
   */
  _renderAncistrus(isDead) {
    return renderAncistrus(this, isDead);
  }

  /**
   * @param {boolean} isDead
   */
  _renderShrimp(isDead) {
    return renderShrimp(this, isDead);
  }

  /**
   * @param {boolean} isDead
   */
  _renderGoby(isDead) {
    return renderGoby(this, isDead);
  }

  /**
   * @param {boolean} isDead
   */
  _renderCrab(isDead) {
    return renderCrab(this, isDead);
  }

  /**
   * @param {number} hours
   * @param {boolean} isFullscreen
   */
  _renderAlgae(hours, isFullscreen) {
    return renderAlgae(this, hours, isFullscreen);
  }

  // Converts a pointer event to SVG viewBox coordinates.
  /**
   * @param {MouseEvent} e
   * @returns {{ x: number, y: number } | null}
   */
  _eventToSvgPoint(e) {
    const svgEl = /** @type {SVGSVGElement} */ (e.currentTarget);
    const ctm = svgEl.getScreenCTM ? svgEl.getScreenCTM() : null;
    if (!ctm) return null;
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }

  // True while the card is shown in the preview of Home Assistant's card editor.
  // Home Assistant sets `preview`; the ancestors are checked too, in case a
  // version of Home Assistant does not pass it down.
  _isEditorPreview() {
    if (this.preview) return true;
    /** @type {Node | null} */
    let node = this;
    while (node) {
      const el = /** @type {Element} */ (node);
      const tag = el.tagName ? el.tagName.toLowerCase() : "";
      if (tag === "hui-card-preview" || tag === "hui-dialog-edit-card" || tag === "hui-dialog-suggest-card") return true;
      node = el.parentNode || /** @type {ShadowRoot} */ (node).host || null;
    }
    return false;
  }

  // The state of the tank right now, from the cached sensor values.
  /**
   * @returns {TankState | null}
   */
  _tankState() {
    if (!this._config) return null;
    return computeTankState({
      config: this._config,
      metrics: {
        consumedVolume: this._cachedConsumedVolume,
        temperature: this._cachedTemperature,
        targetBudget: this._cachedTargetBudget,
        survivalVolume: this._cachedSurvivalVolume,
      },
      canvasHeight: this._getCanvasHeight(),
    });
  }

  // The tank, when the user can interact with it: not with motion disabled
  // (nothing would ever remove the food or the ripples), and not when the
  // animals are dead or the water is gone. Otherwise null.
  /**
   * @returns {TankState | null}
   */
  _interactiveTank() {
    if (!this._hass || !this._motionAllowed) return null;
    const tank = this._tankState();
    if (!tank) return null;
    return tank.isDead || tank.waterRatio <= 0 ? null : tank;
  }

  // Fish food sinking from the surface, around column x.
  /**
   * @param {number} x
   * @param {number} waterSurfaceY
   */
  _dropFood(x, waterSurfaceY) {
    const column = Math.max(80, Math.min(944, x));
    this._food = [...this._food, ...createFlakes(column, waterSurfaceY + 2)].slice(-30);
  }

  // A knock on the glass at (x, y): a ripple, and the nearby fish dart away. The
  // Ancistrus, the shrimp, the crab and the goby run off too, much faster than
  // they usually move.
  /**
   * @param {number} x
   * @param {number} y
   * @param {TankState} tank
   */
  _knockAt(x, y, tank) {
    const now = Date.now();
    this._ripples = [...this._ripples, { x, y, born: now }];
    (this._fishes || []).forEach((fish) => {
      const kick = computeScareKick(fish.x, fish.y, x, y);
      if (!kick) return;
      fish.kickX = kick.kx;
      fish.kickY = kick.ky;
      fish.scare = kick.scare;
      if (Math.abs(kick.kx) > 0.5) fish.dir = kick.kx < 0 ? -1 : 1;
    });
    if (this._ancistrus) startleAncistrus(this._ancistrus, x, y, now, tank, randomSource);
    if (this._shrimp) startleCrawler(this._shrimp, x, y, now, SHRIMP_SPEC);
    if (this._crab) startleCrawler(this._crab, x, y, now, CRAB_SPEC);
    if (this._goby) startleCrawler(this._goby, x, y, now, GOBY_SPEC);
  }

  // Tap near the surface drops food; tap in the water knocks on the glass.
  /**
   * @param {MouseEvent} e
   */
  _onTankTap(e) {
    const tank = this._interactiveTank();
    if (!tank) return;
    const point = this._eventToSvgPoint(e);
    if (!point) return;

    if (classifyTap(point.y, tank.waterSurfaceY) === "feed") {
      this._dropFood(point.x, tank.waterSurfaceY);
    } else {
      this._knockAt(point.x, point.y, tank);
    }
    this.requestUpdate();
  }

  // Keyboard and screen reader access to the same two actions: real buttons.
  _onFeedButton() {
    const tank = this._interactiveTank();
    if (!tank) return;
    this._dropFood(CANVAS_WIDTH / 2, tank.waterSurfaceY);
    this._announce("aria_food_dropped");
    this.requestUpdate();
  }

  _onKnockButton() {
    const tank = this._interactiveTank();
    if (!tank) return;
    this._knockAt(CANVAS_WIDTH / 2, (tank.waterSurfaceY + tank.tankBottom) / 2, tank);
    this._announce("aria_knocked");
    this.requestUpdate();
  }

  // Tells screen readers what a keyboard action did.
  /**
   * @param {string} key  translation key of the message
   */
  _announce(key) {
    this._announceFlip = !this._announceFlip;
    this._announcement = this._t(key) + (this._announceFlip ? "\u00a0" : "");
  }

  _renderFlowBubbles() {
    return renderFlowBubbles(this);
  }

  _renderFood() {
    return renderFood(this);
  }

  _renderRipples() {
    return renderRipples(this);
  }

  /**
   * @param {{ total: number } | null} cost
   */
  _renderCostLabel(cost) {
    return renderCostLabel(this, cost);
  }

  // Text alternative of the picture, for screen readers.
  /**
   * @param {{ currentVolume: number, currentTemp: number, targetBudget: number, isDead: boolean, isCritical: boolean, sensorLost?: boolean }} state
   * @returns {string}
   */
  _ariaLabel({ currentVolume, currentTemp, targetBudget, isDead, isCritical, sensorLost = false }) {
    const lang = resolveLang(this._hass);
    const values = {
      consumed: formatNumber(currentVolume, lang),
      target: formatNumber(targetBudget, lang, 0),
      temperature: formatNumber(currentTemp, lang),
    };
    const parts = [fillTemplate(this._t(currentTemp > 0 ? "aria_summary_temperature" : "aria_summary"), values)];
    if (isDead) parts.push(this._t("aria_dead"));
    else if (isCritical) parts.push(this._t("aria_over_budget"));
    if (sensorLost) parts.push(`${this._t("label_sensor_unavailable")}.`);
    return parts.join(" ");
  }

  _renderFpsBadge() {
    return renderFpsBadge(this);
  }

  render() {
    if (!this._config || !this._hass) return html``;

    const isFullscreen = Boolean(this._config.fullscreen);
    const canvasH = this._getCanvasHeight();
    const canvasBottom = canvasH - 35;
    const metrics = {
      consumedVolume: this._cachedConsumedVolume,
      temperature: this._cachedTemperature,
      targetBudget: this._cachedTargetBudget,
      survivalVolume: this._cachedSurvivalVolume,
    };
    const {
      currentVolume,
      currentTemp,
      targetBudget,
      boilTemp,
      deadlyTemp,
      waterRatio,
      tankBottom,
      waterSurfaceY,
      isDead,
      isBoiling,
      isCritical,
      isWarning,
    } = computeTankState({ config: this._config, metrics, canvasHeight: canvasH });
    const canInteract = this._motionAllowed && !isDead && waterRatio > 0;
    const lang = resolveLang(this._hass);
    const sensorLost = this._sensorLost;
    const ariaLabel = this._ariaLabel({ currentVolume, currentTemp, targetBudget, isDead, isCritical, sensorLost });

    const displayedRemaining = Math.max(0, targetBudget - currentVolume);

    const themeKey = this._config.theme || "freshwater";
    const theme = getTheme(themeKey);

    const waterColorStart = isBoiling || isCritical
      ? "#ef4444"
      : isWarning
      ? "#38bdf8"
      : theme.waterTop;
    const waterColorEnd = isBoiling || isCritical
      ? "#991b1b"
      : isWarning
      ? "#0284c7"
      : theme.waterBottom;

    const hasTitle = Boolean(this._config.title && this._config.title.trim().length > 0);
    const rWidth = this._config.aspect_ratio_width;
    const rHeight = this._config.aspect_ratio_height;

    const algaeAge = Number(this._config.algae_age) || 0;
    const effectiveAlgaeHours = algaeAge > 0 ? algaeAge : this._cachedHoursSinceLastShower;

    const tempTileColor = currentTemp >= deadlyTemp
      ? "#ef4444"
      : currentTemp >= boilTemp
      ? "#f59e0b"
      : "var(--primary-text-color, #111827)";

    const cost = this._config.show_cost
      ? computeShowerCost({
          volumeL: currentVolume,
          energyKwh: this._energyKwh,
          waterPricePerM3: this._config.water_price_per_m3,
          energyPricePerKwh: this._config.energy_price_per_kwh,
        })
      : null;
    return html`
      <ha-card>
        ${!isFullscreen && hasTitle
          ? html`<div class="card-header"><span class="card-title">${this._config.title}</span></div>`
          : ""}

        <div class="aquarium-container">
          ${renderTankSvg(this, {
            isFullscreen,
            canvasH,
            canvasBottom,
            ariaLabel,
            aspectWidth: rWidth,
            aspectHeight: rHeight,
            themeKey,
            theme,
            waterColorStart,
            waterColorEnd,
            isBoiling,
            isDead,
            waterRatio,
            waterSurfaceY,
            tankBottom,
            effectiveAlgaeHours,
            // The gauges hide while nothing flows, except when the card is being
            // set up: the editor's preview shows them so they can be judged.
            showReadings: currentVolume > 0 || this._isEditorPreview(),
            forceTemp: currentVolume <= 0 && this._isEditorPreview(),
            displayedTemp: currentTemp > 0 ? currentTemp : this._lastTemperature,
            currentVolume,
            targetBudget,
            comfortMin: this._cachedComfortMin,
            deadlyTemp,
            boilTemp,
            gaugeStyle: this._config.gauge_style,
            showBudget: this._config.show_budget,
            cost,
            lang,
            sensorLost,
          })}

          <!-- The same two actions as a tap on the tank, for the keyboard and screen readers. -->
          <div class="keyboard-actions" role="group" aria-label="${this._t("aria_actions")}">
            <button type="button" class="kb-button" ?disabled=${!canInteract} @click=${() => this._onFeedButton()}>
              ${this._t("action_feed")}
            </button>
            <button type="button" class="kb-button" ?disabled=${!canInteract} @click=${() => this._onKnockButton()}>
              ${this._t("action_knock")}
            </button>
          </div>
          <div class="sr-only" role="status" aria-live="polite">${this._announcement}</div>
        </div>

        ${!isFullscreen
          ? renderMetricsGrid({
              currentVolume,
              displayedRemaining,
              targetBudget,
              currentTemp,
              tempTileColor,
              cost,
              lang,
              t: (/** @type {string} */ key) => this._t(key),
            })
          : ""}
      </ha-card>
    `;
  }

  getCardSize() {
    return 6;
  }

  // Sections view: full width by default, never narrower than half a section.
  // The height follows the content (the SVG keeps its aspect ratio), so rows
  // are only declared in fullscreen mode, where the card fills its slot.
  getGridOptions() {
    const options = /** @type {{ columns: number, min_columns: number, rows?: number, min_rows?: number }} */ ({
      columns: 12,
      min_columns: 6,
    });
    if (this._config?.fullscreen) {
      options.rows = 8;
      options.min_rows = 4;
    }
    return options;
  }
}

// Guards against customElements.define() throwing if this module is ever
// evaluated twice (e.g. HA re-registering resources after a dashboard
// reload without a full page refresh).
if (!customElements.get("shower-aquarium-card")) {
  customElements.define("shower-aquarium-card", AquariumShowerCard);
}

console.info(
  `%c SHOWER-AQUARIUM-CARD %c v${CARD_VERSION} `,
  "color: white; background: #0284c7; font-weight: 700; border-radius: 3px 0 0 3px; padding: 2px 6px;",
  "color: #0284c7; background: #e0f2fe; font-weight: 700; border-radius: 0 3px 3px 0; padding: 2px 6px;"
);

/** @typedef {{ type: string, name: string, preview?: boolean, description?: string, documentationURL?: string }} CustomCardEntry */
const cardRegistry = /** @type {Window & { customCards?: CustomCardEntry[] }} */ (window);
cardRegistry.customCards = cardRegistry.customCards || [];
const existingIndex = cardRegistry.customCards.findIndex((c) => c.type === "shower-aquarium-card");
const cardDefinition = {
  type: "shower-aquarium-card",
  name: "Shower Aquarium Card",
  preview: true,
  description: `An animated aquarium dashboard card reflecting shower water usage. (v${CARD_VERSION})`,
  // Adds a help link in the card editor of Home Assistant.
  documentationURL: `${REPOSITORY_URL}#readme`,
};
if (existingIndex !== -1) {
  cardRegistry.customCards[existingIndex] = cardDefinition;
} else {
  cardRegistry.customCards.push(cardDefinition);
}
