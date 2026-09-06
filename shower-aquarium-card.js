import { LitElement, html, css, svg } from "./lit-element-bundle.min.js";

const CARD_VERSION = "0.2.6";

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
  {
    name: "fish_count",
    default: 4,
    selector: { number: { min: 1, max: 10, mode: "slider" } },
  },
  {
    name: "target_budget_entity",
    selector: { entity: { domain: ["input_number", "number", "sensor"] } },
  },
  {
    name: "target_budget",
    default: 50,
    selector: { number: { min: 1, max: 500, unit_of_measurement: "L", mode: "box" } },
  },
  {
    name: "survival_volume",
    default: 10,
    selector: { number: { min: 1, max: 100, unit_of_measurement: "L", mode: "box" } },
  },
  {
    name: "temp_boiling_threshold",
    default: 40,
    selector: { number: { min: 25, max: 60, unit_of_measurement: "°C", mode: "box" } },
  },
  {
    name: "temp_deadly_threshold",
    default: 45,
    selector: { number: { min: 30, max: 70, unit_of_measurement: "°C", mode: "box" } },
  },
  { name: "algae_enabled", default: true, selector: { boolean: {} } },
  {
    name: "algae_delay_hours",
    default: 12,
    selector: { number: { min: 1, max: 48, unit_of_measurement: "h", mode: "box" } },
  },
  {
    name: "algae_age",
    default: 0,
    selector: { number: { min: 0, max: 48, unit_of_measurement: "h", mode: "slider" } },
  },
  {
    name: "fish_speed_multiplier",
    default: 1.2,
    selector: { number: { min: 0.2, max: 3.0, step: 0.1, mode: "slider" } },
  },
  { name: "fullscreen", default: false, selector: { boolean: {} } },
  {
    name: "aspect_ratio_width",
    default: 1024,
    selector: { number: { min: 1, max: 4000, mode: "box" } },
  },
  {
    name: "aspect_ratio_height",
    default: 600,
    selector: { number: { min: 1, max: 4000, mode: "box" } },
  },
];

class AquariumShowerCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
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
    const newConfig = { ...ev.detail.value };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
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
    const defaultEntity =
      entities.find((e) => e.includes("shower") || e.includes("hydrao")) ||
      entities[0] ||
      "";
    const tempEntity =
      entities.find(
        (e) =>
          e.includes("temperature") &&
          (e.includes("shower") || e.includes("hydrao"))
      ) || "";
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
    this._ancistrus = {
      x: 70,
      y: 340,
      targetY: 340,
      state: "idle",
      idleUntil: 0,
      deathProgress: 0,
    };
    this._shrimp = {
      x: 840,
      y: 550,
      targetX: 840,
      state: "idle",
      idleUntil: 0,
      dir: -1,
      deathProgress: 0,
    };
    this._crab = {
      x: 350,
      y: 555,
      targetX: 350,
      state: "idle",
      idleUntil: 0,
      dir: 1,
      deathProgress: 0,
    };
    this._bubbles = [
      { x: 180, y: 560, vy: 1.0, r: 4.5 },
      { x: 210, y: 580, vy: 1.2, r: 3.5 },
      { x: 512, y: 570, vy: 0.9, r: 5.0 },
      { x: 820, y: 580, vy: 1.1, r: 4.0 },
      { x: 845, y: 550, vy: 1.3, r: 3.0 },
    ];
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }
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
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        z-index: 1;
      }
      :host([fullscreen]) ha-card {
        padding: 0;
        margin: 0;
        border-radius: 0;
        box-shadow: none;
        height: 100%;
        width: 100%;
        border: none;
        background: transparent;
        justify-content: center;
        align-items: center;
      }
      .card-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 4px;
        padding: 0 4px;
      }
      .card-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--primary-text-color, #1f2937);
      }
      .aquarium-container {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      :host([fullscreen]) .aquarium-container {
        width: 100%;
        height: 100%;
        flex: 1;
        max-width: 100%;
        padding: 0;
        margin: 0;
      }
      svg {
        display: block;
        width: 100%;
        height: auto;
        max-height: calc(100vh - 100px);
      }
      :host([fullscreen]) svg {
        width: 100%;
        height: 100%;
        max-height: 100%;
        aspect-ratio: auto !important;
      }

      /* Hardware-accelerated continuous CSS animations */
      @keyframes waveScroll {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-360px, 0, 0); }
      }
      @keyframes tailWagSlow {
        0%, 100% { transform: rotate(-8deg); }
        50% { transform: rotate(8deg); }
      }
      @keyframes finFlutter {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
      @keyframes suckerBreathe {
        0%, 100% { transform: scale(1, 1); }
        50% { transform: scale(1.08, 1.08); }
      }

      .css-wave-motion {
        animation: waveScroll 7s linear infinite;
        will-change: transform;
      }
      .css-tail-wag {
        transform-origin: 0px 0px;
        animation: tailWagSlow 0.7s ease-in-out infinite alternate;
      }
      .css-fin-flutter {
        transform-origin: 0px 0px;
        animation: finFlutter 0.45s ease-in-out infinite alternate;
      }
      .css-sucker-pulse {
        transform-origin: 0px 3px;
        animation: suckerBreathe 1.5s ease-in-out infinite;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
        gap: 6px;
        margin-top: 6px;
        text-align: center;
      }
      .metric-box {
        background-color: var(--secondary-background-color, #f3f4f6);
        padding: 6px 4px;
        border-radius: 8px;
      }
      .metric-value {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--primary-text-color, #111827);
      }
      .metric-unit {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--secondary-text-color, #6b7280);
      }
      .metric-label {
        font-size: 0.75rem;
        color: var(--secondary-text-color, #6b7280);
        margin-top: 1px;
      }
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

      if (stateObj.last_changed) {
        const lastTime = new Date(stateObj.last_changed).getTime();
        this._cachedHoursSinceLastShower = Math.max(0, (Date.now() - lastTime) / 3600000);
      } else {
        this._cachedHoursSinceLastShower = 0;
      }
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

  _assignSpecies(index, themeKey) {
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

  _generateDefaultFishes(count, themeKey) {
    const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.freshwater;
    const n = Math.min(10, Math.max(1, Number(count) || 4));
    const sizePresets = [1.35, 1.65, 1.20, 1.85, 1.45, 1.60, 1.25, 1.75, 1.30, 1.50];

    return Array.from({ length: n }, (_, index) => {
      const species = this._assignSpecies(index, themeKey);
      const isClownfish = themeKey === "saltwater" && species === 0;
      const baseVx = 1.38 - (sizePresets[index % sizePresets.length] - 1.2) * 0.2;
      return {
        species,
        color: theme.palette[index % theme.palette.length],
        scale: sizePresets[index % sizePresets.length],
        x: isClownfish ? 190 + index * 140 : 120 + (index * 760) / Math.max(1, n - 1),
        y: isClownfish ? 470 : 160 + (index % 3) * 90,
        vx: baseVx * (0.8 + Math.random() * 0.4),
        vy: 0.45 * (index % 2 === 0 ? 1 : -1),
        dir: index % 2 === 0 ? 1 : -1,
        deathProgress: 0,
      };
    });
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Please define a valid entity.");
    }
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

    if (this._config.fullscreen) {
      this.setAttribute("fullscreen", "");
    } else {
      this.removeAttribute("fullscreen");
    }

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
    this._domWaterGroup = root.querySelector("#water-dynamic-level");
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

    // Strict 30 FPS cap for low-power SoC (Amlogic A55 / Nest Hub 2)
    const deltaMs = timestamp - this._lastTimestamp;
    if (deltaMs < 31) return;

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
    const deadlyTemp = Number(this._config.temp_deadly_threshold) || 45;
    const isDead = (currentTemp >= deadlyTemp && currentTemp > 0) || remainingVolume <= 0;
    const userSpeed = Number(this._config.fish_speed_multiplier) || 1.2;

    // Mutate water vertical offset cleanly without path string triangulation
    if (this._domWaterGroup) {
      this._domWaterGroup.setAttribute("transform", `translate(0, ${waterSurfaceY.toFixed(1)})`);
    }

    // Direct mutation of fishes
    this._fishes.forEach((fish, i) => {
      const el = this._domFish[i];
      if (!el) return;

      if (!isDead) {
        fish.x += fish.vx * fish.dir * userSpeed * delta;
        fish.y += fish.vy * userSpeed * delta;

        if (fish.x < 110) { fish.x = 110; fish.dir = 1; }
        else if (fish.x > 910) { fish.x = 910; fish.dir = -1; }

        const minY = Math.max(tankTop + 45, waterSurfaceY + 35);
        if (fish.y < minY) { fish.y = minY; fish.vy = Math.abs(fish.vy); }
        else if (fish.y > tankBottom - 45) { fish.y = tankBottom - 45; fish.vy = -Math.abs(fish.vy); }
      }
      el.setAttribute("transform", `translate(${fish.x.toFixed(1)}, ${fish.y.toFixed(1)}) scale(${fish.dir * fish.scale}, ${fish.scale})`);
    });

    // Direct mutation of Ancistrus (scale 1.5x, vertical patroller)
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

    // Direct mutation of snails
    this._snails.forEach((snail, i) => {
      const el = this._domSnails[i];
      if (!el) return;

      if (!isDead) {
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
      }
      el.setAttribute("transform", `translate(${snail.x.toFixed(1)}, ${snail.y.toFixed(1)})`);
    });

    // Direct mutation of shrimp & crab
    if (this._domShrimp && !isDead) {
      const s = this._shrimp;
      if (timestamp >= s.idleUntil) {
        s.targetX = 740 + Math.random() * 200;
        s.idleUntil = timestamp + 2500 + Math.random() * 3000;
      }
      const dx = s.targetX - s.x;
      s.dir = dx < 0 ? -1 : 1;
      s.x += Math.sign(dx) * Math.min(Math.abs(dx), 0.8 * userSpeed * delta);
      this._domShrimp.setAttribute("transform", `translate(${s.x.toFixed(1)}, ${s.y}) scale(${s.dir * 1.5}, 1.5)`);
    }

    if (this._domCrab && !isDead) {
      const c = this._crab;
      if (timestamp >= c.idleUntil) {
        c.targetX = 240 + Math.random() * 220;
        c.idleUntil = timestamp + 3000 + Math.random() * 3500;
      }
      const dx = c.targetX - c.x;
      c.dir = dx < 0 ? -1 : 1;
      c.x += Math.sign(dx) * Math.min(Math.abs(dx), 0.6 * userSpeed * delta);
      this._domCrab.setAttribute("transform", `translate(${c.x.toFixed(1)}, ${c.y}) scale(${c.dir * 1.4}, 1.4)`);
    }

    // Direct mutation of bubbles
    this._bubbles.forEach((b, i) => {
      const el = this._domBubbles[i];
      if (!el) return;
      b.y -= b.vy * delta;
      if (b.y < waterSurfaceY) b.y = tankBottom - 15;
      el.setAttribute("cy", `${b.y.toFixed(1)}`);
    });
  }

  _renderThemeDecoration(themeKey, isFullscreen) {
    const bottomY = isFullscreen ? 600 : this._getCanvasHeight() - 35;

    if (themeKey === "saltwater") {
      return svg`
        <g id="reef-decor">
          <path d="M 60 ${bottomY} Q 40 ${bottomY - 165}, 95 ${bottomY - 225} Q 120 ${bottomY - 275}, 85 ${bottomY - 335} Q 135 ${bottomY - 265}, 120 ${bottomY - 195} Q 150 ${bottomY - 135}, 115 ${bottomY} Z" fill="#f43f5e" opacity="0.95" />
          <path d="M 115 ${bottomY} Q 150 ${bottomY - 155}, 190 ${bottomY - 205} Q 215 ${bottomY - 245}, 190 ${bottomY - 295} Q 230 ${bottomY - 235}, 205 ${bottomY - 155} Q 180 ${bottomY - 105}, 155 ${bottomY} Z" fill="#fb7185" opacity="0.9" />
          <g transform="translate(830, ${bottomY})">
            <path d="M -80 0 Q -110 -90, -85 -160 Q -55 -90, -55 0 Z" fill="#c084fc" opacity="0.85" />
            <path d="M -55 0 Q -70 -120, -35 -185 Q -15 -120, -25 0 Z" fill="#a855f7" opacity="0.9" />
            <path d="M -25 0 Q -20 -135, 10 -205 Q 30 -130, 0 0 Z" fill="#d8b4fe" opacity="0.85" />
            <circle cx="0" cy="-20" r="60" fill="#7e22ce" opacity="0.75" />
          </g>
          <g id="live-rock" transform="translate(750, ${bottomY})">
            <path d="M -25.5,-18.0 Q -25.5,-18.0 -30.2,-12.4 Q -34.9,-6.8 -43.4,-1.7 Q -52.0,3.3 -60.8,-1.6 Q -69.6,-6.4 -74.3,-12.2 Q -79.0,-18.0 -75.4,-24.5 Z" fill="#8b6a9c" />
            <path d="M 60.3,-38.0 Q 60.3,-38.0 57.1,-25.7 Q 53.9,-13.4 42.9,-0.9 Q 31.9,11.5 11.6,8.1 Q -8.7,4.7 -24.7,0.1 Q -40.8,-4.6 -51.6,-14.8 Z" fill="#6d5280" />
          </g>
        </g>
      `;
    }

    if (themeKey === "coldwater") {
      return svg`
        <g id="coldwater-decor">
          <ellipse cx="140" cy="${bottomY - 25}" rx="70" ry="26" fill="#475569" />
          <ellipse cx="250" cy="${bottomY - 17}" rx="50" ry="20" fill="#64748b" />
          <ellipse cx="860" cy="${bottomY - 20}" rx="75" ry="28" fill="#334155" />
          <ellipse cx="760" cy="${bottomY - 15}" rx="46" ry="18" fill="#64748b" />
        </g>
      `;
    }

    return svg`
      <g id="freshwater-plants">
        <path d="M 45 ${bottomY} Q 65 ${bottomY - 75}, 115 ${bottomY - 60} Q 155 ${bottomY - 85}, 200 ${bottomY - 50} Q 240 ${bottomY - 70}, 285 ${bottomY} Z" fill="#15803d" />
        <path d="M 75 ${bottomY} Q 95 ${bottomY - 60}, 135 ${bottomY - 55} Q 170 ${bottomY - 75}, 210 ${bottomY - 40} Q 250 ${bottomY - 50}, 270 ${bottomY} Z" fill="#22c55e" opacity="0.85" />
        <circle cx="110" cy="${bottomY - 55}" r="11" fill="#4ade80" opacity="0.7" />
        <circle cx="170" cy="${bottomY - 63}" r="12" fill="#4ade80" opacity="0.7" />
        <path d="M 120 ${bottomY} Q 140 ${bottomY - 105}, 160 ${bottomY - 155} Q 165 ${bottomY - 205}, 145 ${bottomY - 265}" stroke="#14532d" stroke-width="8" fill="none" stroke-linecap="round" />
        <path d="M 145 ${bottomY - 265} Q 105 ${bottomY - 305}, 85 ${bottomY - 280} C 70 ${bottomY - 250}, 110 ${bottomY - 220}, 145 ${bottomY - 265} Z" fill="#166534" />
        <path d="M 145 ${bottomY - 265} Q 185 ${bottomY - 315}, 215 ${bottomY - 295} C 230 ${bottomY - 270}, 190 ${bottomY - 230}, 145 ${bottomY - 265} Z" fill="#15803d" />
        <path d="M 880 ${bottomY} Q 920 ${bottomY - 195}, 870 ${bottomY - 355} Q 845 ${bottomY - 195}, 860 ${bottomY} Z" fill="#16a34a" opacity="0.9" />
        <path d="M 920 ${bottomY} Q 960 ${bottomY - 215}, 930 ${bottomY - 375} Q 895 ${bottomY - 205}, 900 ${bottomY} Z" fill="#22c55e" opacity="0.8" />
      </g>
    `;
  }

  _renderFishShape(fish, themeKey) {
    if (themeKey === "saltwater") {
      if (fish.species === 0) {
        return svg`
          <g class="css-tail-wag">
            <path d="M -20,0 C -32,-14 -38,-9 -40,0 C -38,9 -32,14 -20,0 Z" fill="#ea580c" stroke="#0f172a" stroke-width="1.4" />
          </g>
          <ellipse cx="0" cy="0" rx="24" ry="15" fill="#f97316" />
          <path d="M 14,-12 Q 16,0, 14,12 L 9,12 Q 11,0, 9,-12 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
          <path d="M -2,-15 Q 0,0, -2,15 L -7,15 Q -5,0, -7,-15 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
          <circle cx="15" cy="-4" r="3.2" fill="#ffffff" /><circle cx="16" cy="-4" r="1.6" fill="#0f172a" />
          <ellipse class="css-fin-flutter" cx="3" cy="6" rx="6" ry="10" fill="#f97316" opacity="0.9" stroke="#0f172a" stroke-width="1" />
        `;
      }
      return svg`
        <polygon class="css-tail-wag" points="-20,0 -42,-14 -37,0 -42,14" fill="${fish.color}" />
        <ellipse cx="0" cy="0" rx="24" ry="18" fill="${fish.color}" />
        <circle cx="15" cy="-5" r="3.2" fill="#ffffff" /><circle cx="16" cy="-5" r="1.5" fill="#0f172a" />
      `;
    }

    if (themeKey === "coldwater") {
      return svg`
        <g class="css-tail-wag">
          <path d="M -14,0 C -24,-15 -38,-15 -48,-2 C -40,2 -40,2 -48,6 C -41,17 -27,15 -14,0 Z" fill="${fish.color}" opacity="0.9" />
        </g>
        <circle cx="6" cy="0" r="20" fill="${fish.color}" />
        <ellipse cx="2" cy="-6" rx="12" ry="7" fill="#ffffff" opacity="0.4" />
        <circle cx="18" cy="-3" r="3.5" fill="#ffffff" /><circle cx="19.2" cy="-3" r="1.8" fill="#0f172a" />
      `;
    }

    // Freshwater: Angelfish & Neon
    if (fish.species === 0) {
      return svg`
        <polygon points="5,-42 -10,-12 10,-12" fill="${fish.color}" opacity="0.9" />
        <polygon points="0,42 -8,12 8,12" fill="${fish.color}" opacity="0.9" />
        <line x1="8" y1="10" x2="20" y2="48" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
        <polygon class="css-tail-wag" points="-20,0 -40,-14 -35,0 -40,14" fill="${fish.color}" />
        <polygon points="-20,0 5,-17 24,0 5,17" fill="${fish.color}" />
        <line x1="3" y1="-17" x2="3" y2="17" stroke="#0f172a" stroke-width="3" />
        <circle cx="16" cy="-3" r="3.0" fill="#ef4444" /><circle cx="17" cy="-3" r="1.4" fill="#0f172a" />
      `;
    }
    return svg`
      <polygon class="css-tail-wag" points="-20,0 -34,-7 -32,0 -34,7" fill="rgba(255,255,255,0.7)" />
      <ellipse cx="0" cy="0" rx="22" ry="9" fill="#1e293b" />
      <path d="M 15,-2 L -17,-2" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 0,3 L -17,3" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="14" cy="-2" r="2.2" fill="#38bdf8" /><circle cx="15" cy="-2" r="0.9" fill="#0f172a" />
    `;
  }

  _renderAncistrus() {
    const finColor = "#182026";
    const bodyColor = "#1e293b";
    const borderColor = "#0a0f14";
    const spineColor = "#475569";

    return svg`
      <g id="ancistrus-item">
        <!-- Left Pectoral Fin with spine ray -->
        <path d="M -12,6 C -24,10 -30,18 -26,26 C -20,26 -14,20 -9,14 Z" fill="${finColor}" stroke="${borderColor}" stroke-width="0.8" />
        <line x1="-12" y1="8" x2="-24" y2="24" stroke="${spineColor}" stroke-width="1.4" stroke-linecap="round" />

        <!-- Right Pectoral Fin with spine ray -->
        <path d="M 12,6 C 24,10 30,18 26,26 C 20,26 14,20 9,14 Z" fill="${finColor}" stroke="${borderColor}" stroke-width="0.8" />
        <line x1="12" y1="8" x2="24" y2="24" stroke="${spineColor}" stroke-width="1.4" stroke-linecap="round" />

        <!-- Pelvic Fins -->
        <path d="M -7,30 C -15,36 -15,44 -7,42 Z" fill="${finColor}" stroke="${borderColor}" stroke-width="0.6" />
        <path d="M 7,30 C 15,36 15,44 7,42 Z" fill="${finColor}" stroke="${borderColor}" stroke-width="0.6" />

        <!-- Streamlined Body (Model 5 base) -->
        <path d="M -12,0 C -15,16 -14,34 -9,52 L -3,74 L 3,74 L 9,52 C 14,34 15,16 12,0 C 9,-8 -9,-8 -12,0 Z" fill="${bodyColor}" stroke="${borderColor}" stroke-width="1.1" />

        <!-- White micro-dots on body -->
        <circle cx="0" cy="20" r="1.0" fill="#ffffff" opacity="0.9" />
        <circle cx="-4" cy="30" r="0.8" fill="#ffffff" opacity="0.8" />
        <circle cx="4" cy="30" r="0.8" fill="#ffffff" opacity="0.8" />
        <circle cx="0" cy="42" r="0.8" fill="#ffffff" opacity="0.8" />
        <circle cx="-3" cy="54" r="0.7" fill="#ffffff" opacity="0.7" />
        <circle cx="3" cy="54" r="0.7" fill="#ffffff" opacity="0.7" />

        <!-- Straight brush bristles / tentacles on snout (Model 5) -->
        <line x1="-10" y1="-5" x2="-14" y2="-17" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="-7" y1="-6" x2="-9" y2="-21" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="-3" y1="-7" x2="-4" y2="-24" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="0" y1="-8" x2="0" y2="-25" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="3" y1="-7" x2="4" y2="-24" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="7" y1="-6" x2="9" y2="-21" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="10" y1="-5" x2="14" y2="-17" stroke="${borderColor}" stroke-width="1.4" stroke-linecap="round" />

        <!-- Recessed Sucker Mouth with CSS breathing pulse -->
        <g class="css-sucker-pulse">
          <ellipse cx="0" cy="3" rx="7.4" ry="5.6" fill="#334155" stroke="${borderColor}" stroke-width="0.9" />
          <ellipse cx="0" cy="3" rx="4.8" ry="3.6" fill="#0f172a" />
          <ellipse cx="0" cy="3" rx="2.2" ry="1.5" fill="#475569" />
        </g>
      </g>
    `;
  }

  _renderShrimp() {
    return svg`
      <g id="shrimp-item">
        <path d="M 20,14 L 32,6 L 34,14 L 32,23 L 20,18 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="0.7" />
        <path d="M -30,-10 C -20,-16 -6,-16 4,-10 C 12,-6 16,-2 20,6 C 23,11 23,15 19,16 C 8,17 -2,15 -10,10 C -18,5 -24,-2 -30,-10 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="0.9" />
        <circle cx="-22" cy="-8" r="1.5" fill="#fef2f2" /><circle cx="-14" cy="-11" r="1.4" fill="#fef2f2" />
        <circle cx="-6" cy="-10" r="1.5" fill="#fef2f2" /><circle cx="1" cy="-7" r="1.3" fill="#fef2f2" />
        <path d="M -30,-11 Q -60,-24 -88,-30" stroke="#fef9c3" stroke-width="1.1" fill="none" stroke-linecap="round" />
        <circle cx="-27" cy="-13" r="1.9" fill="#0f172a" />
      </g>
    `;
  }

  _renderCrab() {
    return svg`
      <g id="crab-item">
        <path d="M -14,-2 L -26,-10 L -34,-8" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M -15,4 L -28,4 L -36,9" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M 14,-2 L 26,-10 L 34,-8" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M 15,4 L 28,4 L 36,9" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M -20,-10 C -24,-2 -24,8 -18,14 C -10,19 10,19 18,14 C 24,8 24,-2 20,-10 C 14,-16 -14,-16 -20,-10 Z" fill="#dc2626" stroke="#ea580c" stroke-width="1.2" />
        <circle cx="-7.2" cy="-18" r="2" fill="#0f172a" /><circle cx="7.2" cy="-18" r="2" fill="#0f172a" />
      </g>
    `;
  }

  render() {
    if (!this._config || !this._hass) return html``;

    const isFullscreen = Boolean(this._config.fullscreen);
    const canvasH = this._getCanvasHeight();
    const currentVolume = this._cachedConsumedVolume;
    const currentTemp = this._cachedTemperature;
    const targetBudget = this._cachedTargetBudget;
    const survivalVolume = this._cachedSurvivalVolume;
    const displayedRemaining = Math.max(0, targetBudget - currentVolume);
    const deadlyTemp = Number(this._config.temp_deadly_threshold) || 45;
    const boilTemp = Number(this._config.temp_boiling_threshold) || 40;

    const themeKey = this._config.theme || "freshwater";
    const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.freshwater;

    const r = 74;
    const circ = 2 * Math.PI * r;
    const volFraction = Math.max(0, Math.min(1, currentVolume / Math.max(1, targetBudget)));
    const volColor = currentVolume > targetBudget ? "#ef4444" : currentVolume > targetBudget * 0.7 ? "#f59e0b" : "#38bdf8";
    const volArc = (volFraction * circ).toFixed(1);

    const tempFraction = Math.max(0, Math.min(1, currentTemp / 45));
    const tempColor = currentTemp >= deadlyTemp ? "#ef4444" : currentTemp >= boilTemp ? "#f59e0b" : "#facc15";
    const tempArc = (tempFraction * circ).toFixed(1);

    const rWidth = Number(this._config.aspect_ratio_width) || 1024;
    const rHeight = Number(this._config.aspect_ratio_height) || 600;

    return html`
      <ha-card>
        <div class="aquarium-container">
          <svg
            viewBox="0 0 1024 ${isFullscreen ? 600 : canvasH}"
            preserveAspectRatio="${isFullscreen ? "none" : "xMidYMid meet"}"
            style="${isFullscreen ? "width: 100%; height: 100%;" : `aspect-ratio: ${rWidth} / ${rHeight};`}"
          >
            <!-- Background & Sand -->
            <rect width="1024" height="100%" fill="${theme.background}" />
            <path d="M 0 540 Q 280 515, 512 545 T 1024 540 L 1024 600 L 0 600 Z" fill="${theme.sandColor}" />

            ${this._renderThemeDecoration(themeKey, isFullscreen)}

            <!-- Snails Layer -->
            <g id="snail-layer">
              ${this._snails.map((snail, sIdx) => {
                const rotation = snail.type === "glass_left" ? 90 : snail.type === "glass_right" ? -90 : 0;
                const baseScale = themeKey === "saltwater" ? (sIdx % 2 === 0 ? 3.5 : 4.2) : 1.8;
                return svg`
                  <g id="snail-item-${sIdx}">
                    <g rotate="${rotation}" scale="${snail.dir * baseScale}, ${baseScale}">
                      <circle cx="-3" cy="-4" r="5.5" fill="${snail.color}" />
                      <ellipse cx="2" cy="-1.5" rx="5" ry="2.2" fill="#d97706" />
                      <line x1="5" y1="-2.5" x2="7.5" y2="-5.5" stroke="#d97706" stroke-width="0.8" />
                    </g>
                  </g>
                `;
              })}
            </g>

            <!-- Hardware-accelerated water body -->
            <g id="water-dynamic-level">
              <rect x="0" y="0" width="1024" height="600" fill="${theme.waterBottom}" opacity="0.45" />
              <!-- Continuous looping wave using CSS translate3d -->
              <g class="css-wave-motion">
                <path
                  d="M 0,0 Q 90,-8 180,0 T 360,0 T 540,0 T 720,0 T 900,0 T 1080,0 T 1260,0 T 1440,0"
                  stroke="#ffffff"
                  stroke-width="3"
                  fill="none"
                  opacity="0.8"
                />
              </g>
            </g>

            <!-- Bubbles Layer -->
            <g id="bubbles-layer">
              ${this._bubbles.map((b, i) => svg`
                <circle id="bubble-item-${i}" cx="${b.x}" cy="${b.y}" r="${b.r}" fill="#ffffff" opacity="0.6" />
              `)}
            </g>

            <!-- Fishes Layer -->
            <g id="fish-layer">
              ${this._fishes.map((f, i) => svg`
                <g id="fish-item-${i}">
                  ${this._renderFishShape(f, themeKey)}
                </g>
              `)}
            </g>

            <!-- Bottom dwellers -->
            ${themeKey === "freshwater" ? this._renderAncistrus() : ""}
            ${themeKey === "saltwater" ? this._renderShrimp() : ""}
            ${themeKey === "saltwater" ? this._renderCrab() : ""}

            <!-- HUD Fullscreen Gauges (Rendered statically, high-contrast, no heavy SVG filters) -->
            ${isFullscreen ? svg`
              <!-- Left Gauge: Temperature -->
              ${currentTemp > 0 ? svg`
                <g transform="translate(94, 90)">
                  <circle r="${r}" fill="#0f172a" opacity="0.16" />
                  <circle r="${r}" fill="none" stroke="#ffffff" stroke-width="8" opacity="0.22" />
                  <circle
                    r="${r}"
                    fill="none"
                    stroke="${tempColor}"
                    stroke-width="8"
                    stroke-linecap="round"
                    stroke-dasharray="${tempArc} ${circ.toFixed(1)}"
                    transform="rotate(-90)"
                  />
                  <text y="10" font-family="system-ui, sans-serif" font-size="54" font-weight="900" fill="#ffffff" text-anchor="middle">${currentTemp.toFixed(1)}°</text>
                  <text y="36" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff" opacity="0.9" text-anchor="middle" letter-spacing="1.2">TEMP</text>
                </g>
              ` : ""}

              <!-- Right Gauge: Consumed Litres -->
              <g transform="translate(930, 90)">
                <circle r="${r}" fill="#0f172a" opacity="0.16" />
                <circle r="${r}" fill="none" stroke="#ffffff" stroke-width="8" opacity="0.22" />
                <circle
                  r="${r}"
                  fill="none"
                  stroke="${volColor}"
                  stroke-width="8"
                  stroke-linecap="round"
                  stroke-dasharray="${volArc} ${circ.toFixed(1)}"
                  transform="rotate(-90)"
                />
                <text y="10" font-family="system-ui, sans-serif" font-size="54" font-weight="900" fill="#ffffff" text-anchor="middle">${currentVolume.toFixed(1)}</text>
                <text y="36" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff" opacity="0.9" text-anchor="middle" letter-spacing="1.2">LITRES</text>
              </g>
            ` : ""}
          </svg>
        </div>

        <!-- Normal Mode Bottom Tile Cards -->
        ${!isFullscreen ? html`
          <div class="metrics-grid">
            <div class="metric-box">
              <div class="metric-value">${currentVolume.toFixed(1)} <span class="metric-unit">L</span></div>
              <div class="metric-label">${this._t("label_consumed")}</div>
            </div>
            <div class="metric-box">
              <div class="metric-value">${displayedRemaining.toFixed(1)} <span class="metric-unit">L</span></div>
              <div class="metric-label">${this._t("label_remaining")}</div>
            </div>
            <div class="metric-box">
              <div class="metric-value">${targetBudget} <span class="metric-unit">L</span></div>
              <div class="metric-label">${this._t("label_target")}</div>
            </div>
            ${currentTemp > 0 ? html`
              <div class="metric-box">
                <div class="metric-value" style="color: ${tempColor};">
                  ${currentTemp.toFixed(1)} <span class="metric-unit">°C</span>
                </div>
                <div class="metric-label">${this._t("label_temperature")}</div>
              </div>
            ` : ""}
          </div>
        ` : ""}
      </ha-card>
    `;
  }

  getCardSize() {
    return 6;
  }
}

customElements.define("shower-aquarium-card", AquariumShowerCard);

console.info(
  `%c SHOWER-AQUARIUM-CARD %c v${CARD_VERSION} `,
  "color: white; background: #0284c7; font-weight: 700; border-radius: 3px 0 0 3px; padding: 2px 6px;",
  "color: #0284c7; background: #e0f2fe; font-weight: 700; border-radius: 0 3px 3px 0; padding: 2px 6px;"
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "shower-aquarium-card",
  name: "Shower Aquarium Card",
  preview: true,
  description: `An animated aquarium dashboard card reflecting shower water usage. (v${CARD_VERSION})`,
});
