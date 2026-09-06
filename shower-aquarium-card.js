import { LitElement, html, css, svg } from "./lit-element-bundle.min.js";

const CARD_VERSION = "0.2.4-svg-direct";

const TRANSLATIONS = {
  en: {
    label_consumed: "Consumed",
    label_remaining: "Remaining",
    label_target: "Target",
    label_temperature: "Temperature",
    field_entity: "Shower volume entity",
    field_temp_entity: "Water temperature entity (optional)",
    field_title: "Card title (leave empty to hide)",
    field_theme: "Aquarium biotope",
    field_fish_count: "Number of fishes",
    field_target_budget_entity: "Target entity (max water volume)",
    field_target_budget: "Shower target budget (L)",
    field_survival_volume: "Survival volume for animals",
    field_temp_boil: "Boiling temperature threshold (°C)",
    field_temp_deadly: "Deadly temperature threshold (°C)",
    field_algae_enabled: "Enable dirty algae accumulation",
    field_algae_delay: "Algae accumulation delay (hours)",
    field_algae_age: "Algae age",
    field_fish_speed: "Fish speed",
    field_fullscreen: "Fullscreen mode",
    helper_fullscreen: "Tablet, Nest Hub...",
    field_aspect_ratio_width: "Ratio - Width (e.g. 1024, 16, 4)",
    field_aspect_ratio_height: "Ratio - Height (e.g. 600, 9, 3)",
    theme_freshwater: "Freshwater (Tropical)",
    theme_saltwater: "Saltwater (Reef)",
    theme_coldwater: "Coldwater (Goldfish)",
  },
  fr: {
    label_consumed: "Consommé",
    label_remaining: "Restant",
    label_target: "Objectif",
    label_temperature: "Température",
    field_entity: "Entité de volume de douche",
    field_temp_entity: "Entité température de l'eau (optionnel)",
    field_title: "Titre de la carte (laisser vide pour masquer)",
    field_theme: "Biotope de l'aquarium",
    field_fish_count: "Nombre de poissons",
    field_target_budget_entity: "Entité d'objectif (volume d'eau max)",
    field_target_budget: "Objectif de la douche (L)",
    field_survival_volume: "Volume de survie des animaux",
    field_temp_boil: "Seuil d'ébullition (°C)",
    field_temp_deadly: "Seuil mortel de température (°C)",
    field_algae_enabled: "Activer l'accumulation d'algues",
    field_algae_delay: "Délai d'apparition des algues (heures)",
    field_algae_age: "Âge des algues",
    field_fish_speed: "Vitesse des poissons",
    field_fullscreen: "Mode plein écran",
    helper_fullscreen: "Tablette, Nest Hub...",
    field_aspect_ratio_width: "Ratio - Largeur (ex : 1024, 16, 4)",
    field_aspect_ratio_height: "Ratio - Hauteur (ex : 600, 9, 3)",
    theme_freshwater: "Eau douce (Tropical)",
    theme_saltwater: "Eau de mer (Récif)",
    theme_coldwater: "Eau froide (Poissons rouges)",
  },
};

const THEME_PRESETS = {
  freshwater: {
    waterTop: "#38bdf8",
    waterBottom: "#0284c7",
    sandColor: "#fde68a",
    background: "#f0fdfa",
    palette: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#84cc16"],
  },
  saltwater: {
    waterTop: "#06b6d4",
    waterBottom: "#0e7490",
    sandColor: "#fef08a",
    background: "#ecfeff",
    palette: ["#f97316", "#eab308", "#3b82f6", "#a855f7", "#ec4899", "#14b8a6", "#06b6d4", "#f43f5e", "#84cc16", "#6366f1"],
  },
  coldwater: {
    waterTop: "#67e8f9",
    waterBottom: "#0891b2",
    sandColor: "#cbd5e1",
    background: "#f8fafc",
    palette: ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fbbf24", "#d97706", "#b45309", "#78350f", "#ffffff", "#94a3b8"],
  },
};

const CARD_EDITOR_SCHEMA = [
  { name: "entity", required: true, selector: { entity: { domain: "sensor" } } },
  { name: "temperature_entity", selector: { entity: { domain: "sensor" } } },
  { name: "title", selector: { text: {} } },
  {
    name: "theme",
    default: "freshwater",
    selector: {
      select: {
        options: [
          { value: "freshwater", label: "Eau douce (Tropical)" },
          { value: "saltwater", label: "Eau de mer (Récif)" },
          { value: "coldwater", label: "Eau froide (Poissons rouges)" },
        ],
      },
    },
  },
  { name: "fish_count", default: 4, selector: { number: { min: 1, max: 10, mode: "slider" } } },
  { name: "target_budget_entity", selector: { entity: { domain: ["input_number", "number", "sensor"] } } },
  { name: "target_budget", default: 50, selector: { number: { min: 1, max: 500, unit_of_measurement: "L", mode: "box" } } },
  { name: "survival_volume", default: 10, selector: { number: { min: 1, max: 100, unit_of_measurement: "L", mode: "box" } } },
  { name: "temp_boiling_threshold", default: 40, selector: { number: { min: 25, max: 60, unit_of_measurement: "°C", mode: "box" } } },
  { name: "temp_deadly_threshold", default: 45, selector: { number: { min: 30, max: 70, unit_of_measurement: "°C", mode: "box" } } },
  { name: "algae_enabled", default: true, selector: { boolean: {} } },
  { name: "algae_delay_hours", default: 12, selector: { number: { min: 1, max: 48, unit_of_measurement: "h", mode: "box" } } },
  { name: "algae_age", default: 0, selector: { number: { min: 0, max: 48, unit_of_measurement: "h", mode: "slider" } } },
  { name: "fish_speed_multiplier", default: 1.2, selector: { number: { min: 0.2, max: 3.0, step: 0.1, mode: "slider" } } },
  { name: "fullscreen", default: false, selector: { boolean: {} } },
  { name: "aspect_ratio_width", default: 1024, selector: { number: { min: 1, max: 4000, mode: "box" } } },
  { name: "aspect_ratio_height", default: 600, selector: { number: { min: 1, max: 4000, mode: "box" } } },
];

class AquariumShowerCardEditor extends LitElement {
  static get properties() {
    return { hass: { type: Object }, _config: { type: Object } };
  }
  setConfig(config) {
    this._config = { ...config };
  }
  _computeLabel(schema) {
    const lang = this.hass?.language === "fr" ? "fr" : "en";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    const map = {
      entity: dict.field_entity,
      temperature_entity: dict.field_temp_entity,
      title: dict.field_title,
      theme: dict.field_theme,
      fish_count: dict.field_fish_count,
      target_budget_entity: dict.field_target_budget_entity,
      target_budget: dict.field_target_budget,
      survival_volume: dict.field_survival_volume,
      temp_boiling_threshold: dict.field_temp_boil,
      temp_deadly_threshold: dict.field_temp_deadly,
      algae_enabled: dict.field_algae_enabled,
      algae_delay_hours: dict.field_algae_delay,
      algae_age: dict.field_algae_age,
      fish_speed_multiplier: dict.field_fish_speed,
      fullscreen: dict.field_fullscreen,
      aspect_ratio_width: dict.field_aspect_ratio_width,
      aspect_ratio_height: dict.field_aspect_ratio_height,
    };
    return map[schema.name] || schema.name;
  }
  _computeHelper(schema) {
    const lang = this.hass?.language === "fr" ? "fr" : "en";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return schema.name === "fullscreen" ? dict.helper_fullscreen : "";
  }
  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: { ...ev.detail.value } }, bubbles: true, composed: true }));
  }
  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${CARD_EDITOR_SCHEMA}
        .computeLabel=${(s) => this._computeLabel(s)}
        .computeHelper=${(s) => this._computeHelper(s)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
}
customElements.define("shower-aquarium-card-editor", AquariumShowerCardEditor);

class AquariumShowerCard extends LitElement {
  static get properties() {
    return {
      _hass: { type: Object },
      _config: { type: Object },
    };
  }

  static async getConfigElement() {
    return document.createElement("shower-aquarium-card-editor");
  }

  static getStubConfig(hass, entities) {
    const defaultEntity = entities.find((e) => e.includes("shower") || e.includes("hydrao")) || entities[0] || "";
    const tempEntity = entities.find((e) => e.includes("temperature") && (e.includes("shower") || e.includes("hydrao"))) || "";
    return {
      entity: defaultEntity,
      temperature_entity: tempEntity,
      title: "",
      theme: "freshwater",
      aspect_ratio_width: 1024,
      aspect_ratio_height: 600,
      fish_count: 4,
      target_budget: 50,
      survival_volume: 10,
      temp_boiling_threshold: 40,
      temp_deadly_threshold: 45,
      algae_enabled: true,
      algae_delay_hours: 12,
      algae_age: 0,
      fish_speed_multiplier: 1.2,
      fullscreen: false,
    };
  }

  constructor() {
    super();
    this._animationFrameId = null;
    this._lastTimestamp = 0;
    this._animTime = 0;
    this._domNodesCached = false;
    this._cachedConsumedVolume = 0;
    this._cachedTemperature = 0;
    this._cachedTargetBudget = 50;
    this._cachedSurvivalVolume = 10;
    this._cachedHoursSinceLastShower = 0;

    this._fishes = this._generateDefaultFishes(4, "freshwater");
    this._snails = [
      { x: 340, y: 590, vx: 0.08, vy: 0, dir: 1, type: "bottom", color: "#854d0e" },
      { x: 18, y: 340, vx: 0, vy: 0.07, dir: 1, type: "glass_left", color: "#a16207" },
      { x: 1006, y: 220, vx: 0, vy: -0.06, dir: -1, type: "glass_right", color: "#78350f" },
    ];
    this._ancistrus = { x: 70, y: 340, targetY: 340, state: "idle", idleUntil: 0, deathProgress: 0 };
    this._shrimp = { x: 840, y: 550, targetX: 840, state: "idle", idleUntil: 0, dir: -1, deathProgress: 0 };
    this._crab = { x: 350, y: 555, targetX: 350, state: "idle", idleUntil: 0, dir: 1, deathProgress: 0 };
    this._bubbles = [
      { x: 180, y: 560, vy: 0.9, r: 4.5 },
      { x: 210, y: 580, vy: 1.1, r: 3.5 },
      { x: 512, y: 570, vy: 0.8, r: 5.0 },
      { x: 820, y: 580, vy: 1.0, r: 4.0 },
      { x: 845, y: 550, vy: 1.2, r: 3.0 },
    ];
  }

  static get styles() {
    return css`
      :host { display: block; width: 100%; box-sizing: border-box; }
      ha-card {
        padding: 4px 6px;
        background: var(--card-background-color, #ffffff);
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
      }
      :host([fullscreen]) {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        margin: 0; padding: 0;
        z-index: 1;
      }
      :host([fullscreen]) ha-card {
        padding: 0; margin: 0;
        border-radius: 0; box-shadow: none;
        height: 100%; width: 100%;
        border: none; background: transparent;
        justify-content: center; align-items: center;
      }
      .card-header { display: flex; justify-content: flex-start; align-items: center; margin-bottom: 4px; padding: 0 4px; }
      .card-title { font-size: 1.15rem; font-weight: 700; color: var(--primary-text-color, #1f2937); }
      .aquarium-container { position: relative; width: 100%; display: flex; align-items: center; justify-content: center; }
      :host([fullscreen]) .aquarium-container { width: 100%; height: 100%; flex: 1; max-width: 100%; padding: 0; margin: 0; }
      svg { display: block; width: 100%; height: auto; max-height: calc(100vh - 100px); }
      :host([fullscreen]) svg { width: 100%; height: 100%; max-height: 100%; aspect-ratio: auto !important; }
      .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(75px, 1fr)); gap: 6px; margin-top: 6px; text-align: center; }
      .metric-box { background-color: var(--secondary-background-color, #f3f4f6); padding: 6px 4px; border-radius: 8px; }
      .metric-value { font-size: 1.15rem; font-weight: 700; color: var(--primary-text-color, #111827); }
      .metric-unit { font-size: 0.75rem; font-weight: 500; color: var(--secondary-text-color, #6b7280); }
      .metric-label { font-size: 0.75rem; color: var(--secondary-text-color, #6b7280); margin-top: 1px; }
    `;
  }

  _t(key) {
    const lang = this._hass?.language === "fr" ? "fr" : "en";
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  }

  _getCanvasHeight() {
    const rWidth = Number(this._config.aspect_ratio_width) || 1024;
    const rHeight = Number(this._config.aspect_ratio_height) || 600;
    return Math.max(400, Math.min(2048, Math.round(1024 * (rHeight / rWidth))));
  }

  _updateCachedMetrics() {
    if (!this._hass || !this._config) return;
    if (this._config.entity && this._hass.states[this._config.entity]) {
      const stateObj = this._hass.states[this._config.entity];
      const val = parseFloat(stateObj.state);
      this._cachedConsumedVolume = isNaN(val) ? 0 : Math.max(0, val);
      this._cachedHoursSinceLastShower = stateObj.last_changed ? Math.max(0, (Date.now() - new Date(stateObj.last_changed).getTime()) / 3600000) : 0;
    } else {
      this._cachedConsumedVolume = 0;
      this._cachedHoursSinceLastShower = 0;
    }

    if (this._config.temperature_entity && this._hass.states[this._config.temperature_entity]) {
      const t = parseFloat(this._hass.states[this._config.temperature_entity].state);
      this._cachedTemperature = isNaN(t) ? 0 : t;
    } else {
      this._cachedTemperature = 0;
    }

    if (this._config.target_budget_entity && this._hass.states[this._config.target_budget_entity]) {
      const tVal = parseFloat(this._hass.states[this._config.target_budget_entity].state);
      this._cachedTargetBudget = isNaN(tVal) ? Number(this._config.target_budget) || 50 : tVal;
    } else {
      this._cachedTargetBudget = Number(this._config.target_budget) || 50;
    }
    this._cachedSurvivalVolume = Number(this._config.survival_volume) || 10;
  }

  _generateDefaultFishes(count, themeKey) {
    const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.freshwater;
    const n = Math.min(10, Math.max(1, Number(count) || 4));
    return Array.from({ length: n }, (_, i) => ({
      species: i % 3,
      color: theme.palette[i % theme.palette.length],
      scale: 1.4,
      x: 140 + (i * 700) / Math.max(1, n - 1),
      y: 200 + (i % 3) * 70,
      vx: 1.2 + Math.random() * 0.4,
      vy: 0.4 * (i % 2 === 0 ? 1 : -1),
      dir: i % 2 === 0 ? 1 : -1,
      deathProgress: 0,
    }));
  }

  setConfig(config) {
    if (!config.entity) throw new Error("Please define a valid entity.");
    this._config = {
      title: "",
      theme: "freshwater",
      aspect_ratio_width: 1024,
      aspect_ratio_height: 600,
      fish_count: 4,
      target_budget: 50,
      survival_volume: 10,
      temp_boiling_threshold: 40,
      temp_deadly_threshold: 45,
      algae_enabled: true,
      algae_delay_hours: 12,
      algae_age: 0,
      fish_speed_multiplier: 1.2,
      fullscreen: false,
      ...config,
    };
    if (this._config.fullscreen) this.setAttribute("fullscreen", "");
    else this.removeAttribute("fullscreen");
    this._fishes = this._generateDefaultFishes(this._config.fish_count, this._config.theme);
    this._updateCachedMetrics();
    this._domNodesCached = false;
    this.requestUpdate();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateCachedMetrics();
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    this._startAnimation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
  }

  firstUpdated() {
    this._cacheDomNodes();
  }

  updated() {
    this._cacheDomNodes();
  }

  _cacheDomNodes() {
    const root = this.shadowRoot;
    if (!root) return;
    this._domFish = this._fishes.map((_, i) => root.querySelector(`#fish-item-${i}`));
    this._domSnails = this._snails.map((_, i) => root.querySelector(`#snail-item-${i}`));
    this._domAncistrus = root.querySelector("#ancistrus-item");
    this._domShrimp = root.querySelector("#shrimp-item");
    this._domCrab = root.querySelector("#crab-item");
    this._domBubbles = this._bubbles.map((_, i) => root.querySelector(`#bubble-item-${i}`));
    this._domWaterRect = root.querySelector("#water-rect");
    this._domWaterSurface = root.querySelector("#water-surface");
    this._domNodesCached = true;
  }

  _startAnimation() {
    if (!this._animationFrameId) {
      const loop = (timestamp) => {
        this._updatePhysics(timestamp);
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

  _updatePhysics(timestamp) {
    if (!this._lastTimestamp) this._lastTimestamp = timestamp;
    const deltaMs = timestamp - this._lastTimestamp;
    if (deltaMs < 31) return; // 30 FPS cap
    const delta = Math.min(deltaMs / 16.66, 2.5);
    this._lastTimestamp = timestamp;
    this._animTime = timestamp * 0.0035;

    if (!this._domNodesCached) return;

    const currentVolume = this._cachedConsumedVolume;
    const targetBudget = this._cachedTargetBudget;
    const survivalVolume = this._cachedSurvivalVolume;
    const totalVolume = targetBudget + survivalVolume;
    const remainingVolume = Math.max(0, totalVolume - currentVolume);
    const waterRatio = remainingVolume / totalVolume;

    const isFullscreen = Boolean(this._config.fullscreen);
    const tankTop = isFullscreen ? 0 : 15;
    const tankBottom = isFullscreen ? 600 : this._getCanvasHeight() - 35;
    const tankHeight = tankBottom - tankTop;
    const waterSurfaceY = tankBottom - waterRatio * tankHeight;

    const currentTemp = this._cachedTemperature;
    const isDead = (currentTemp >= Number(this._config.temp_deadly_threshold) && currentTemp > 0) || remainingVolume <= 0;
    const userSpeed = Number(this._config.fish_speed_multiplier) || 1.2;

    // Mutate Water Surface directly
    if (this._domWaterRect) {
      this._domWaterRect.setAttribute("y", `${waterSurfaceY}`);
      this._domWaterRect.setAttribute("height", `${Math.max(0, tankBottom - waterSurfaceY)}`);
    }
    if (this._domWaterSurface) {
      const waveOffset = Math.sin(this._animTime * 1.5) * 4;
      this._domWaterSurface.setAttribute("d", `M 0 ${waterSurfaceY + waveOffset} Q 512 ${waterSurfaceY - waveOffset} 1024 ${waterSurfaceY + waveOffset}`);
    }

    // Mutate Fishes directly
    this._fishes.forEach((fish, i) => {
      const el = this._domFish[i];
      if (!el) return;
      if (!isDead) {
        fish.x += fish.vx * fish.dir * userSpeed * delta;
        fish.y += fish.vy * userSpeed * delta;
        if (fish.x < 120) { fish.x = 120; fish.dir = 1; }
        else if (fish.x > 900) { fish.x = 900; fish.dir = -1; }
        const minY = Math.max(tankTop + 45, waterSurfaceY + 35);
        if (fish.y < minY) { fish.y = minY; fish.vy = Math.abs(fish.vy); }
        else if (fish.y > tankBottom - 45) { fish.y = tankBottom - 45; fish.vy = -Math.abs(fish.vy); }
      }
      el.setAttribute("transform", `translate(${fish.x.toFixed(1)}, ${fish.y.toFixed(1)}) scale(${fish.dir * fish.scale}, ${fish.scale})`);
    });

    // Mutate Ancistrus directly
    if (this._domAncistrus) {
      const anc = this._ancistrus;
      if (!isDead) {
        const minVY = Math.max(tankTop + 60, waterSurfaceY + 70);
        const maxVY = tankBottom - 120;
        if (timestamp >= anc.idleUntil) {
          anc.targetY = minVY + Math.random() * (maxVY - minVY);
          anc.idleUntil = timestamp + 3500 + Math.random() * 4000;
        }
        anc.y += Math.sign(anc.targetY - anc.y) * Math.min(Math.abs(anc.targetY - anc.y), 0.7 * userSpeed * delta);
      }
      this._domAncistrus.setAttribute("transform", `translate(${anc.x}, ${anc.y.toFixed(1)}) scale(1.5, 1.5)`);
    }

    // Mutate Snails directly
    this._snails.forEach((snail, i) => {
      const el = this._domSnails[i];
      if (!el) return;
      if (snail.type === "bottom") {
        snail.x += snail.vx * snail.dir * delta;
        if (snail.x < 100) { snail.x = 100; snail.dir = 1; }
        else if (snail.x > 920) { snail.x = 920; snail.dir = -1; }
      } else {
        snail.y += snail.vy * delta;
        const minY = Math.max(tankTop + 35, waterSurfaceY + 25);
        if (snail.y < minY) { snail.y = minY; snail.vy = Math.abs(snail.vy); }
        else if (snail.y > tankBottom - 25) { snail.y = tankBottom - 25; snail.vy = -Math.abs(snail.vy); }
      }
      el.setAttribute("transform", `translate(${snail.x.toFixed(1)}, ${snail.y.toFixed(1)})`);
    });

    // Mutate Bubbles directly
    this._bubbles.forEach((b, i) => {
      const el = this._domBubbles[i];
      if (!el) return;
      b.y -= b.vy * delta;
      if (b.y < waterSurfaceY) b.y = tankBottom - 15;
      el.setAttribute("cy", `${b.y.toFixed(1)}`);
    });
  }

  render() {
    if (!this._config || !this._hass) return html``;
    const isFullscreen = Boolean(this._config.fullscreen);
    const canvasH = this._getCanvasHeight();
    const currentVolume = this._cachedConsumedVolume;
    const currentTemp = this._cachedTemperature;
    const targetBudget = this._cachedTargetBudget;
    const themeKey = this._config.theme || "freshwater";
    const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.freshwater;

    const r = 74;
    const circ = 2 * Math.PI * r;
    const volFraction = Math.max(0, Math.min(1, currentVolume / Math.max(1, targetBudget)));
    const volArc = (volFraction * circ).toFixed(1);
    const tempFraction = Math.max(0, Math.min(1, currentTemp / 45));
    const tempArc = (tempFraction * circ).toFixed(1);

    return html`
      <ha-card>
        <div class="aquarium-container">
          <svg viewBox="0 0 1024 ${isFullscreen ? 600 : canvasH}">
            <rect width="1024" height="100%" fill="${theme.background}" />
            <path d="M 0 540 Q 280 515, 512 545 T 1024 540 L 1024 600 L 0 600 Z" fill="${theme.sandColor}" />

            <!-- Direct mutated water elements -->
            <rect id="water-rect" x="0" y="200" width="1024" height="400" fill="${theme.waterBottom}" opacity="0.45" />
            <path id="water-surface" d="M 0 200 L 1024 200" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8" />

            <!-- Ambient Bubbles -->
            <g>
              ${this._bubbles.map((b, i) => svg`<circle id="bubble-item-${i}" cx="${b.x}" cy="${b.y}" r="${b.r}" fill="#ffffff" opacity="0.6" />`)}
            </g>

            <!-- Fishes -->
            <g id="fish-layer">
              ${this._fishes.map((f, i) => svg`
                <g id="fish-item-${i}">
                  <ellipse cx="0" cy="0" rx="24" ry="15" fill="${f.color}" />
                  <polygon points="-20,0 -34,-12 -28,0 -34,12" fill="${f.color}" />
                  <circle cx="15" cy="-4" r="3" fill="#ffffff" /><circle cx="16" cy="-4" r="1.5" fill="#0f172a" />
                </g>
              `)}
            </g>

            <!-- Ancistrus -->
            <g id="ancistrus-item">
              <path d="M -12,6 C -24,10 -30,18 -26,26 C -20,26 -14,20 -9,14 Z" fill="#182026" stroke="#0a0f14" stroke-width="0.8" />
              <line x1="-12" y1="8" x2="-24" y2="24" stroke="#475569" stroke-width="1.4" stroke-linecap="round" />
              <path d="M 12,6 C 24,10 30,18 26,26 C 20,26 14,20 9,14 Z" fill="#182026" stroke="#0a0f14" stroke-width="0.8" />
              <line x1="12" y1="8" x2="24" y2="24" stroke="#475569" stroke-width="1.4" stroke-linecap="round" />
              <path d="M -12,0 C -15,16 -14,34 -9,52 L -3,74 L 3,74 L 9,52 C 14,34 15,16 12,0 C 9,-8 -9,-8 -12,0 Z" fill="#1e293b" stroke="#0a0f14" stroke-width="1.1" />
              <g stroke="#0a0f14" stroke-width="1.4" stroke-linecap="round">
                <line x1="-10" y1="-5" x2="-14" y2="-17" /><line x1="-7" y1="-6" x2="-9" y2="-21" /><line x1="-3" y1="-7" x2="-4" y2="-24" />
                <line x1="0" y1="-8" x2="0" y2="-25" /><line x1="3" y1="-7" x2="4" y2="-24" /><line x1="7" y1="-6" x2="9" y2="-21" /><line x1="10" y1="-5" x2="14" y2="-17" />
              </g>
              <ellipse cx="0" cy="3" rx="7.4" ry="5.6" fill="#334155" stroke="#0a0f14" stroke-width="0.9" />
              <ellipse cx="0" cy="3" rx="4.8" ry="3.6" fill="#0f172a" />
            </g>

            <!-- Snails -->
            <g id="snail-layer">
              ${this._snails.map((s, i) => svg`
                <g id="snail-item-${i}">
                  <circle cx="-3" cy="-4" r="7" fill="${s.color}" />
                  <ellipse cx="2" cy="-1.5" rx="6" ry="3" fill="#d97706" />
                </g>
              `)}
            </g>

            <!-- HUD Gauges (Only updated on HASS state change) -->
            ${isFullscreen ? svg`
              <g transform="translate(94, 90)">
                <circle r="${r}" fill="#0f172a" opacity="0.16" />
                <circle r="${r}" fill="none" stroke="#ffffff" stroke-width="8" opacity="0.22" />
                <circle r="${r}" fill="none" stroke="#facc15" stroke-width="8" stroke-linecap="round" stroke-dasharray="${tempArc} ${circ.toFixed(1)}" transform="rotate(-90)" />
                <text y="10" font-family="system-ui, sans-serif" font-size="54" font-weight="900" fill="#ffffff" text-anchor="middle">${currentTemp.toFixed(1)}°</text>
                <text y="36" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff" opacity="0.9" text-anchor="middle" letter-spacing="1.2">TEMP</text>
              </g>
              <g transform="translate(930, 90)">
                <circle r="${r}" fill="#0f172a" opacity="0.16" />
                <circle r="${r}" fill="none" stroke="#ffffff" stroke-width="8" opacity="0.22" />
                <circle r="${r}" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" stroke-dasharray="${volArc} ${circ.toFixed(1)}" transform="rotate(-90)" />
                <text y="10" font-family="system-ui, sans-serif" font-size="54" font-weight="900" fill="#ffffff" text-anchor="middle">${currentVolume.toFixed(1)}</text>
                <text y="36" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff" opacity="0.9" text-anchor="middle" letter-spacing="1.2">LITRES</text>
              </g>
            ` : ""}
          </svg>
        </div>
      </ha-card>
    `;
  }
}
customElements.define("shower-aquarium-card", AquariumShowerCard);
