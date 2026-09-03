import { LitElement, html, css, svg } from "./lit-element-bundle.min.js";

const CARD_VERSION = "0.1.9";

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
      _fishes: { type: Array },
      _snails: { type: Array },
      _ancistrusList: { type: Array },
      _shrimp: { type: Object },
      _crab: { type: Object },
      _bubbles: { type: Array },
      _boilingBubbles: { type: Array },
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
    this._ancistrusList = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      x: 55 + i * 100,
      y: 315 + (i % 2) * 45,
      targetY: 315 + (i % 2) * 45,
      state: "idle",
      idleUntil: 0,
      deathProgress: 0,
    }));
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
      { x: 180, y: 560, vy: 0.9, r: 4.5 },
      { x: 210, y: 580, vy: 1.1, r: 3.5 },
      { x: 512, y: 570, vy: 0.8, r: 5.0 },
      { x: 820, y: 580, vy: 1.0, r: 4.0 },
      { x: 845, y: 550, vy: 1.2, r: 3.0 },
    ];
    this._boilingBubbles = Array.from({ length: 24 }, () => ({
      x: 10 + Math.random() * 1004,
      y: 30 + Math.random() * 540,
      vy: 2.5 + Math.random() * 3.5,
      vx: (Math.random() - 0.5) * 1.5,
      r: 4 + Math.random() * 8,
    }));
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
        const now = Date.now();
        this._cachedHoursSinceLastShower = Math.max(
          0,
          (now - lastTime) / (1000 * 60 * 60)
        );
      } else {
        this._cachedHoursSinceLastShower = 0;
      }
    } else {
      this._cachedConsumedVolume = 0;
      this._cachedHoursSinceLastShower = 0;
    }

    if (
      this._config.temperature_entity &&
      this._hass.states[this._config.temperature_entity]
    ) {
      const t = parseFloat(
        this._hass.states[this._config.temperature_entity].state
      );
      this._cachedTemperature = isNaN(t) ? 0 : t;
    } else {
      this._cachedTemperature = 0;
    }

    if (
      this._config.target_budget_entity &&
      this._hass.states[this._config.target_budget_entity]
    ) {
      const tVal = parseFloat(
        this._hass.states[this._config.target_budget_entity].state
      );
      this._cachedTargetBudget = isNaN(tVal)
        ? Number(this._config.target_budget) || 50
        : tVal;
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
      const jitterX = Math.random() * 50 - 25;
      const jitterY = Math.random() * 50 - 25;
      return {
        species,
        color: theme.palette[index % theme.palette.length],
        scale: sizePresets[index % sizePresets.length],
        phase: Math.random() * 6.28,
        x: isClownfish
          ? 190 + index * 140
          : 120 + (index * 760) / Math.max(1, n - 1) + jitterX,
        y: isClownfish ? 470 : 160 + (index % 3) * 90 + jitterY,
        vx: baseVx * (0.8 + Math.random() * 0.4),
        vy: 0.45 * (Math.random() < 0.5 ? 1 : -1) * (0.7 + Math.random() * 0.5),
        dir: Math.random() < 0.5 ? 1 : -1,
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

    const themeKey = this._config.theme || "freshwater";
    const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.freshwater;

    if (config.fishes && Array.isArray(config.fishes) && config.fishes.length > 0) {
      const sizePresets = [1.35, 1.65, 1.20, 1.85, 1.45, 1.60, 1.25, 1.75, 1.30, 1.50];
      this._fishes = config.fishes.map((fish, index) => {
        const species = this._assignSpecies(index, themeKey);
        const isClownfish = themeKey === "saltwater" && species === 0;
        return {
          species,
          color: fish.color || theme.palette[index % theme.palette.length],
          scale: fish.scale || sizePresets[index % sizePresets.length],
          phase: Math.random() * 6.28,
          x: isClownfish ? 190 + index * 140 : 140 + index * 150 + (Math.random() * 40 - 20),
          y: isClownfish ? 470 : 180 + (index % 2) * 90 + (Math.random() * 40 - 20),
          vx: (1.3 + (index % 3) * 0.15) * (0.8 + Math.random() * 0.4),
          vy: 0.45 * (Math.random() < 0.5 ? 1 : -1) * (0.7 + Math.random() * 0.5),
          dir: Math.random() < 0.5 ? 1 : -1,
          deathProgress: 0,
        };
      });
    } else {
      const count = Number(this._config.fish_count) || 4;
      this._fishes = this._generateDefaultFishes(count, themeKey);
    }

    this._updateCachedMetrics();
    this.requestUpdate();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateCachedMetrics();
  }

  connectedCallback() {
    super.connectedCallback();
    this._startAnimation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
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
    if (!this._lastTimestamp) {
      this._lastTimestamp = timestamp;
    }
    const deltaMs = timestamp - this._lastTimestamp;
    const delta = Math.min(deltaMs / 16.66, 2.0);
    this._lastTimestamp = timestamp;
    this._animTime = timestamp * 0.0035;

    const currentVolume = this._cachedConsumedVolume;
    const targetBudget = this._cachedTargetBudget;
    const survivalVolume = this._cachedSurvivalVolume;
    const totalVolume = targetBudget + survivalVolume;
    const currentTemp = this._cachedTemperature;

    const boilTemp = Number(this._config.temp_boiling_threshold) || 40;
    const deadlyTemp = Number(this._config.temp_deadly_threshold) || 45;

    const remainingVolumeInTank = Math.max(0, totalVolume - currentVolume);
    const waterRatio = remainingVolumeInTank / totalVolume;

    const isFullscreen = Boolean(this._config.fullscreen);
    const tankTop = isFullscreen ? 0 : 15;
    const tankBottom = isFullscreen ? 600 : this._getCanvasHeight() - 35;
    const tankHeight = tankBottom - tankTop;
    const waterSurfaceY = tankBottom - waterRatio * tankHeight;

    const isHeatDead = currentTemp >= deadlyTemp && currentTemp > 0;
    const isWaterDead = remainingVolumeInTank <= 0;
    const isDead = isHeatDead || isWaterDead;

    const isBoiling = currentTemp >= boilTemp && currentTemp > 0;
    const userSpeed = Number(this._config.fish_speed_multiplier) || 1.2;
    const isStressed = (currentVolume > targetBudget || isBoiling) && !isDead;
    const speedMultiplier = (isStressed ? 2.0 : 1.0) * userSpeed;

    const deathStep = (deltaMs || 16.66) / 10000;
    const themeKey = this._config.theme || "freshwater";
    let stateChanged = false;

    if (this._fishes && this._fishes.length > 0) {
      this._fishes.forEach((fish) => {
        if (isDead) {
          fish.deathProgress = Math.min(1.0, (fish.deathProgress || 0) + deathStep);
          fish.y = Math.min(tankBottom - 30, fish.y + 1.2 * delta);
          stateChanged = true;
          return;
        }

        fish.deathProgress = 0;
        const isClownfish = themeKey === "saltwater" && fish.species === 0;
        const minY = isClownfish
          ? Math.max(tankTop + 45, waterSurfaceY + 35, tankBottom - 160)
          : Math.max(tankTop + 45, waterSurfaceY + 35);
        const maxY = tankBottom - 45;
        const minX = isClownfish ? 160 : 110;
        const maxX = isClownfish ? 380 : 910;

        fish.x += fish.vx * fish.dir * speedMultiplier * delta;
        fish.y += fish.vy * speedMultiplier * delta;

        if (fish.x < minX) {
          fish.x = minX;
          fish.dir = 1;
        } else if (fish.x > maxX) {
          fish.x = maxX;
          fish.dir = -1;
        }

        if (fish.y < minY) {
          fish.y = minY;
          fish.vy = Math.abs(fish.vy);
        } else if (fish.y > maxY) {
          fish.y = maxY;
          fish.vy = -Math.abs(fish.vy);
        }

        stateChanged = true;
      });
    }

    if (this._snails && this._snails.length > 0) {
      this._snails.forEach((snail) => {
        if (isDead) {
          snail.y = Math.min(tankBottom - 10, snail.y + 1.5 * delta);
          stateChanged = true;
          return;
        }

        if (snail.type === "bottom") {
          snail.x += snail.vx * snail.dir * delta;
          if (snail.x < 100) {
            snail.x = 100;
            snail.dir = 1;
          } else if (snail.x > 920) {
            snail.x = 920;
            snail.dir = -1;
          }
        } else if (snail.type === "glass_left" || snail.type === "glass_right") {
          const minY = Math.max(tankTop + 35, waterSurfaceY + 25);
          snail.y += snail.vy * delta;
          if (snail.y < minY) {
            snail.y = minY;
            snail.vy = Math.abs(snail.vy);
          } else if (snail.y > tankBottom - 25) {
            snail.y = tankBottom - 25;
            snail.vy = -Math.abs(snail.vy);
          }
        }
        stateChanged = true;
      });
    }

    if (this._ancistrusList && this._ancistrusList.length > 0) {
      this._ancistrusList.forEach((anc) => {
        if (isDead) {
          anc.deathProgress = Math.min(1.0, (anc.deathProgress || 0) + deathStep);
          anc.y = Math.min(tankBottom - 25, anc.y + 1.2 * delta);
          stateChanged = true;
        } else {
          anc.deathProgress = 0;
          const minVY = Math.max(tankTop + 50, waterSurfaceY + 60);
          const maxVY = tankBottom - 95;

          if (!anc.idleUntil) {
            anc.idleUntil = timestamp + 2500 + Math.random() * 4000;
          }

          if (anc.state === "moving") {
            const dy = anc.targetY - anc.y;
            const step = Math.sign(dy) * Math.min(Math.abs(dy), 0.5 * userSpeed * delta);
            anc.y += step;
            if (Math.abs(anc.targetY - anc.y) < 1.5) {
              anc.state = "idle";
              anc.idleUntil = timestamp + 3500 + Math.random() * 5000;
            }
          } else if (timestamp >= anc.idleUntil) {
            anc.state = "moving";
            anc.targetY = minVY + Math.random() * (maxVY - minVY);
          }
          stateChanged = true;
        }
      });
    }

    if (this._shrimp) {
      if (isDead) {
        this._shrimp.deathProgress = Math.min(1.0, (this._shrimp.deathProgress || 0) + deathStep);
        stateChanged = true;
      } else {
        this._shrimp.deathProgress = 0;
        this._shrimp.y = tankBottom - 25;
        const minSX = 740;
        const maxSX = 940;

        if (!this._shrimp.idleUntil) {
          this._shrimp.idleUntil = timestamp + 1200 + Math.random() * 2000;
        }

        if (this._shrimp.state === "moving") {
          const dx = this._shrimp.targetX - this._shrimp.x;
          this._shrimp.dir = dx < 0 ? -1 : 1;
          const step = Math.sign(dx) * Math.min(Math.abs(dx), 0.9 * userSpeed * delta);
          this._shrimp.x += step;
          if (Math.abs(this._shrimp.targetX - this._shrimp.x) < 1.5) {
            this._shrimp.state = "idle";
            this._shrimp.idleUntil = timestamp + 1500 + Math.random() * 2500;
          }
        } else if (timestamp >= this._shrimp.idleUntil) {
          this._shrimp.state = "moving";
          this._shrimp.targetX = minSX + Math.random() * (maxSX - minSX);
        }

        stateChanged = true;
      }
    }

    if (this._crab) {
      if (isDead) {
        this._crab.deathProgress = Math.min(1.0, (this._crab.deathProgress || 0) + deathStep);
        stateChanged = true;
      } else {
        this._crab.deathProgress = 0;
        this._crab.y = tankBottom - 20;
        const minCX = 240;
        const maxCX = 460;

        if (!this._crab.idleUntil) {
          this._crab.idleUntil = timestamp + 2000 + Math.random() * 3000;
        }

        if (this._crab.state === "moving") {
          const dx = this._crab.targetX - this._crab.x;
          this._crab.dir = dx < 0 ? -1 : 1;
          const step = Math.sign(dx) * Math.min(Math.abs(dx), 0.7 * userSpeed * delta);
          this._crab.x += step;
          if (Math.abs(this._crab.targetX - this._crab.x) < 1.5) {
            this._crab.state = "idle";
            this._crab.idleUntil = timestamp + 2500 + Math.random() * 3500;
          }
        } else if (timestamp >= this._crab.idleUntil) {
          this._crab.state = "moving";
          this._crab.targetX = minCX + Math.random() * (maxCX - minCX);
        }

        stateChanged = true;
      }
    }

    if (waterRatio > 0 && !isDead && this._bubbles) {
      this._bubbles.forEach((b) => {
        b.y -= b.vy * delta;
        if (b.y < waterSurfaceY) {
          b.y = tankBottom - 15;
        }
        stateChanged = true;
      });
    }

    if (isBoiling && waterRatio > 0 && this._boilingBubbles) {
      this._boilingBubbles.forEach((b) => {
        b.y -= b.vy * delta;
        b.x += b.vx * delta;
        if (b.y < waterSurfaceY) {
          b.y = tankBottom - 15;
          b.x = 10 + Math.random() * 1004;
        }
        stateChanged = true;
      });
    }

    if (stateChanged) {
      this.requestUpdate();
    }
  }

  _renderWaterSurface(x1, x2, y) {
    const amp = 3.5;
    const wavelen = 90;
    const phase = this._animTime * 1.6;
    const step = 16;

    const topPts = [];
    const botPts = [];
    for (let x = x1; x < x2; x += step) {
      topPts.push([x, y + Math.sin(x / wavelen + phase) * amp]);
      botPts.push([x, y + 4 + Math.sin(x / wavelen + phase + 0.6) * amp * 0.7]);
    }
    topPts.push([x2, y + Math.sin(x2 / wavelen + phase) * amp]);
    botPts.push([x2, y + 4 + Math.sin(x2 / wavelen + phase + 0.6) * amp * 0.7]);

    const fmt = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
    const topLine = topPts.map(fmt).join(" L ");
    const bottomLineRev = botPts
      .slice()
      .reverse()
      .map(fmt)
      .join(" L ");

    return svg`
      <path d="M ${topLine} L ${bottomLineRev} Z" fill="#ffffff" opacity="0.25" />
      <path d="M ${topLine}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85" stroke-linecap="round" />
    `;
  }

  _renderAnemoneTentacles() {
    const layers = [
      { count: 11, baseR: 20, lenMin: 60, lenMax: 95, spread: 160, width: 5, color: "#a21caf", tip: "#f0abfc", speed: 0.55 },
      { count: 16, baseR: 22, lenMin: 50, lenMax: 88, spread: 190, width: 6.5, color: "#c026d3", tip: "#f5d0fe", speed: 0.68 },
    ];
    const parts = [];
    layers.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        const t = i / (layer.count - 1);
        const baseAngle = -90 - layer.spread / 2 + t * layer.spread;
        const length =
          layer.lenMin + (layer.lenMax - layer.lenMin) * (0.5 + 0.5 * Math.sin(t * Math.PI));
        const phase = li * 10 + i * 0.7;
        const sway = Math.sin(this._animTime * layer.speed + phase) * 9;
        const rad = (baseAngle * Math.PI) / 180;
        const bx = Math.cos(rad) * layer.baseR;
        const by = Math.sin(rad) * layer.baseR;
        const wobble = ((i * 37) % 17) - 8;
        const rotateDeg = baseAngle + 90 + sway;
        parts.push(svg`
          <g transform="translate(${bx.toFixed(1)}, ${by.toFixed(1)}) rotate(${rotateDeg.toFixed(1)})">
            <path d="M 0,0 Q ${wobble.toFixed(1)},${(-length * 0.55).toFixed(1)} 0,${(-length).toFixed(1)}" stroke="${layer.color}" stroke-width="${layer.width}" stroke-linecap="round" fill="none" opacity="0.9" />
            <circle cx="0" cy="${(-length).toFixed(1)}" r="${(layer.width * 0.9).toFixed(1)}" fill="${layer.tip}" />
          </g>
        `);
      }
    });
    return parts;
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
            <path d="M 0 0 Q 35 -140, 60 -195 Q 55 -115, 25 0 Z" fill="#a855f7" opacity="0.95" />
            <path d="M 25 0 Q 75 -115, 100 -170 Q 80 -90, 55 0 Z" fill="#c084fc" opacity="0.85" />
            <circle cx="0" cy="-20" r="60" fill="#7e22ce" opacity="0.75" />
          </g>
          <g transform="translate(190, ${bottomY - 70})">
            <path d="M 0,-42 C 6,-42 12,-18 16,-12 C 22,-8 44,-10 44,-4 C 44,2 26,10 22,16 C 18,22 28,42 22,46 C 16,50 8,30 0,26 C -8,30 -16,50 -22,46 C -28,42 -18,22 -22,16 C -26,10 -44,2 -44,-4 C -44,-10 -22,-8 -16,-12 C -12,-18 -6,-42 0,-42 Z" fill="#1d4ed8" stroke="#1e40af" stroke-width="2" />
            <path d="M 0,-34 L 0,18 M -35,-4 L 35,-4 M -18,36 L 18,36" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" opacity="0.75" />
            <circle cx="0" cy="0" r="5" fill="#60a5fa" />
          </g>
          <g id="live-rock" transform="translate(750, ${bottomY})">
            <path d="M -25.5,-18.0 Q -25.5,-18.0 -30.2,-12.4 Q -34.9,-6.8 -43.4,-1.7 Q -52.0,3.3 -60.8,-1.6 Q -69.6,-6.4 -74.3,-12.2 Q -79.0,-18.0 -75.4,-24.5 Q -71.7,-30.9 -61.9,-32.5 Q -52.0,-34.1 -40.9,-33.3 Q -29.8,-32.6 -27.6,-25.3 Z" fill="#8b6a9c" />
            <path d="M 60.3,-38.0 Q 60.3,-38.0 57.1,-25.7 Q 53.9,-13.4 42.9,-0.9 Q 31.9,11.5 11.6,8.1 Q -8.7,4.7 -24.7,0.1 Q -40.8,-4.6 -51.6,-14.8 Q -62.4,-25.0 -55.7,-36.6 Q -49.0,-48.2 -44.9,-59.8 Q -40.9,-71.5 -25.2,-78.1 Q -9.5,-84.7 10.3,-84.7 Q 30.0,-84.6 35.1,-70.5 Q 40.3,-56.4 50.3,-47.2 Z" fill="#6d5280" />
            <path d="M 77.8,-68.0 Q 77.8,-68.0 72.3,-56.4 Q 66.8,-44.7 60.1,-28.3 Q 53.4,-11.9 39.7,-16.8 Q 25.9,-21.6 23.7,-38.9 Q 21.5,-56.1 11.9,-72.6 Q 2.4,-89.2 12.7,-105.2 Q 23.0,-121.2 37.9,-120.4 Q 52.8,-119.6 64.2,-110.3 Q 75.5,-101.0 76.6,-84.5 Z" fill="#7a5d8f" />
          </g>
          <g id="live-rock-2" transform="translate(420, ${bottomY})">
            <path d="M 41.8,-26.0 Q 41.8,-26.0 37.1,-16.4 Q 32.4,-6.8 19.8,-2.1 Q 7.2,2.6 -3.0,-3.6 Q -13.2,-9.9 -23.4,-13.6 Q -33.5,-17.4 -32.1,-25.6 Q -30.6,-33.9 -24.0,-40.5 Q -17.3,-47.1 -6.3,-46.0 Q 4.7,-44.9 13.2,-41.9 Q 21.7,-38.9 31.8,-32.4 Z" fill="#6d5280" />
          </g>
          <g id="anemone" transform="translate(260, ${bottomY - 17}) scale(1.4, 1.4)">
            ${this._renderAnemoneTentacles()}
            <ellipse cx="0" cy="-16" rx="30" ry="11" fill="#86198f" opacity="0.9" />
            <path d="M -22,-5 C -26,3 -23,12 -15,17 C -7,21 7,21 15,17 C 23,12 26,3 22,-5 C 14,-14 -14,-14 -22,-5 Z" fill="#701a75" />
            <ellipse cx="0" cy="16" rx="26" ry="9" fill="#4a044e" opacity="0.75" />
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
          <ellipse cx="300" cy="${bottomY - 10}" rx="26" ry="10" fill="#94a3b8" opacity="0.85" />
          <ellipse cx="600" cy="${bottomY - 8}" rx="22" ry="9" fill="#94a3b8" opacity="0.8" />
          <ellipse cx="660" cy="${bottomY - 14}" rx="34" ry="14" fill="#475569" opacity="0.9" />
          <path d="M 110 ${bottomY - 25} Q 85 ${bottomY - 195}, 125 ${bottomY - 295} Q 155 ${bottomY - 185}, 135 ${bottomY - 25} Z" fill="#0d9488" opacity="0.9" />
          <path d="M 145 ${bottomY - 25} Q 180 ${bottomY - 175}, 150 ${bottomY - 265} Q 125 ${bottomY - 155}, 155 ${bottomY - 25} Z" fill="#14b8a6" opacity="0.75" />
          <path d="M 620 ${bottomY - 14} Q 610 ${bottomY - 110}, 640 ${bottomY - 170} Q 660 ${bottomY - 100}, 645 ${bottomY - 14} Z" fill="#0d9488" opacity="0.85" />
          <path d="M 655 ${bottomY - 14} Q 680 ${bottomY - 90}, 660 ${bottomY - 150} Q 635 ${bottomY - 85}, 650 ${bottomY - 14} Z" fill="#14b8a6" opacity="0.7" />
          <path d="M 780 ${bottomY - 15} Q 800 ${bottomY - 60}, 830 ${bottomY - 55} Q 850 ${bottomY - 50}, 845 ${bottomY - 30} Q 815 ${bottomY - 35}, 795 ${bottomY - 20} Z" fill="#78716c" opacity="0.9" />
        </g>
      `;
    }

    return svg`
      <g id="freshwater-plants">
        <path d="M 45 ${bottomY} Q 65 ${bottomY - 75}, 115 ${bottomY - 60} Q 155 ${bottomY - 85}, 200 ${bottomY - 50} Q 240 ${bottomY - 70}, 285 ${bottomY} Z" fill="#15803d" />
        <path d="M 75 ${bottomY} Q 95 ${bottomY - 60}, 135 ${bottomY - 55} Q 170 ${bottomY - 75}, 210 ${bottomY - 40} Q 250 ${bottomY - 50}, 270 ${bottomY} Z" fill="#22c55e" opacity="0.85" />
        <circle cx="110" cy="${bottomY - 55}" r="11" fill="#4ade80" opacity="0.7" />
        <circle cx="170" cy="${bottomY - 63}" r="12" fill="#4ade80" opacity="0.7" />
        <circle cx="225" cy="${bottomY - 45}" r="10" fill="#86efac" opacity="0.6" />
        <path d="M 120 ${bottomY} Q 140 ${bottomY - 105}, 160 ${bottomY - 155} Q 165 ${bottomY - 205}, 145 ${bottomY - 265}" stroke="#14532d" stroke-width="8" fill="none" stroke-linecap="round" />
        <path d="M 145 ${bottomY - 265} Q 105 ${bottomY - 305}, 85 ${bottomY - 280} C 70 ${bottomY - 250}, 110 ${bottomY - 220}, 145 ${bottomY - 265} Z" fill="#166534" />
        <path d="M 145 ${bottomY - 265} Q 185 ${bottomY - 315}, 215 ${bottomY - 295} C 230 ${bottomY - 270}, 190 ${bottomY - 230}, 145 ${bottomY - 265} Z" fill="#15803d" />
        <path d="M 155 ${bottomY - 215} Q 105 ${bottomY - 230}, 80 ${bottomY - 205} C 65 ${bottomY - 175}, 115 ${bottomY - 155}, 155 ${bottomY - 215} Z" fill="#166534" />
        <path d="M 160 ${bottomY - 175} Q 210 ${bottomY - 205}, 240 ${bottomY - 175} C 248 ${bottomY - 150}, 200 ${bottomY - 130}, 160 ${bottomY - 175} Z" fill="#15803d" />
        <path d="M 140 ${bottomY - 125} Q 90 ${bottomY - 125}, 70 ${bottomY - 100} C 65 ${bottomY - 75}, 110 ${bottomY - 70}, 140 ${bottomY - 125} Z" fill="#14532d" />
        <path d="M 880 ${bottomY} Q 920 ${bottomY - 195}, 870 ${bottomY - 355} Q 845 ${bottomY - 195}, 860 ${bottomY} Z" fill="#16a34a" opacity="0.9" />
        <path d="M 920 ${bottomY} Q 960 ${bottomY - 215}, 930 ${bottomY - 375} Q 895 ${bottomY - 205}, 900 ${bottomY} Z" fill="#22c55e" opacity="0.8" />
        <path d="M 845 ${bottomY} Q 810 ${bottomY - 175}, 845 ${bottomY - 275} Q 870 ${bottomY - 165}, 865 ${bottomY} Z" fill="#15803d" opacity="0.85" />
      </g>
    `;
  }

  _renderFishShape(fish, themeKey, isDead) {
    const isFlipped = fish.dir === -1;
    const p = fish.deathProgress || 0;
    const s = fish.scale || 1.4;
    const bodyOpacity = (1.0 - p).toFixed(2);
    const skeletonOpacity = p.toFixed(2);

    const tailWag = isDead
      ? 0
      : Math.sin(this._animTime * (3.5 * fish.vx) + fish.phase) * 14;
    const finWag = isDead
      ? 0
      : Math.sin(this._animTime * (4.5 * fish.vx) + fish.phase) * 10;

    let bodySvg = svg``;

    if (themeKey === "saltwater") {
      if (fish.species === 0) {
        bodySvg = svg`
          <g transform="translate(-20, 0) rotate(${tailWag})">
            <path d="M 0,0 C -12,-14 -18,-9 -20,0 C -18,9 -12,14 0,0 Z" fill="#ea580c" stroke="#0f172a" stroke-width="1.4" />
          </g>
          <ellipse cx="0" cy="0" rx="24" ry="15" fill="#f97316" />
          <path d="M 14,-12 Q 16,0, 14,12 L 9,12 Q 11,0, 9,-12 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
          <path d="M -2,-15 Q 0,0, -2,15 L -7,15 Q -5,0, -7,-15 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
          <path d="M -16,-11 Q -15,0, -16,11 L -20,11 Q -19,0, -20,-11 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
          ${isDead
            ? svg`<line x1="12" y1="-6" x2="18" y2="0" stroke="#ffffff" stroke-width="2" />`
            : svg`<circle cx="15" cy="-4" r="3.2" fill="#ffffff" /><circle cx="16" cy="-4" r="1.6" fill="#0f172a" />`}
          <g transform="translate(3, 3) rotate(${finWag})">
            <ellipse cx="0" cy="6" rx="6" ry="10" fill="#f97316" opacity="0.9" stroke="#0f172a" stroke-width="1" />
          </g>
        `;
      } else if (fish.species === 1) {
        bodySvg = svg`
          <g transform="translate(-25, 0) rotate(${tailWag})">
            <polygon points="0,-2 -20,-13 -13,-2 -20,9 0,2" fill="#f59e0b" />
            <polygon points="0,-2 -17,-10 -12,-2 -17,7 0,1" fill="#fde047" opacity="0.85" />
          </g>
          <path d="M 0,-20 C 14,-20 24,-10 25,0 C 24,10 14,20 0,20 C -16,19 -26,10 -26,0 C -26,-10 -16,-19 0,-20 Z" fill="url(#tangBodyGrad)" />
          <path d="M -19,-10 C -5,-17 9,-15 14,-5 C 10,1 7,9 11,15 C 1,16 -11,12 -18,3 C -21,-1 -21,-6 -19,-10 Z" fill="#0f172a" opacity="0.88" />
          <circle cx="19" cy="2" r="1.5" fill="#facc15" opacity="0.8" />
          ${isDead
            ? svg`<line x1="15" y1="-8" x2="21" y2="-4" stroke="#ffffff" stroke-width="1.8" />`
            : svg`<circle cx="18" cy="-6" r="2.8" fill="#0f172a" /><circle cx="18.6" cy="-6.6" r="0.9" fill="#93c5fd" />`}
        `;
      } else if (fish.species === 3) {
        bodySvg = svg`
          <g transform="translate(-22, 0) rotate(${tailWag})">
            <path d="M 0,0 L -12,-9 L -8,0 L -12,9 Z" fill="#fbbf24" opacity="0.9" />
          </g>
          <ellipse cx="0" cy="0" rx="23" ry="20" fill="url(#butterflyBodyGrad)" />
          <path d="M -14,-16 L -8,17" stroke="#ea580c" stroke-width="1.3" opacity="0.55" />
          <path d="M -6,-19 L 0,19" stroke="#ea580c" stroke-width="1.3" opacity="0.55" />
          <path d="M 2,-19 L 7,19" stroke="#ea580c" stroke-width="1.3" opacity="0.55" />
          <path d="M 10,-17 L 14,16" stroke="#ea580c" stroke-width="1.3" opacity="0.5" />
          <path d="M 18,-3 Q 26,-1 27,0 Q 26,1 18,3 Z" fill="#fbbf24" />
          <circle cx="-15" cy="0" r="3" fill="#1f2937" opacity="0.8" />
          <circle cx="-15" cy="0" r="1.6" fill="#fbbf24" opacity="0.9" />
          ${isDead
            ? svg`<line x1="10" y1="-8" x2="15" y2="-3" stroke="#ffffff" stroke-width="1.4" />`
            : svg`<circle cx="12.5" cy="-4" r="2.6" fill="#0f172a" /><circle cx="13.2" cy="-4.6" r="0.8" fill="#e2e8f0" />`}
        `;
      } else {
        bodySvg = svg`
          <g transform="translate(-20, 0) rotate(${tailWag})">
            <polygon points="0,0 -22,-14 -17,0 -22,14" fill="${fish.color}" />
          </g>
          <polygon points="2,-28 -8,-10 8,-10" fill="${fish.color}" opacity="0.9" />
          <polygon points="0,28 -6,10 6,10" fill="${fish.color}" opacity="0.9" />
          <ellipse cx="0" cy="0" rx="24" ry="19" fill="${fish.color}" />
          <path d="M -6,-14 L -6,14" stroke="#ffffff" stroke-width="3.5" />
          <path d="M 6,-16 L 6,16" stroke="#ffffff" stroke-width="3.5" />
          ${isDead
            ? svg`<line x1="13" y1="-7" x2="19" y2="-1" stroke="#ffffff" stroke-width="2" />`
            : svg`<circle cx="15" cy="-5" r="3.2" fill="#ffffff" /><circle cx="16" cy="-5" r="1.5" fill="#0f172a" />`}
        `;
      }
    } else if (themeKey === "coldwater") {
      if (fish.species === 0) {
        bodySvg = svg`
          <g transform="translate(-14, 0) rotate(${tailWag * 1.1})">
            <path d="M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z" fill="${fish.color}" opacity="0.88" />
          </g>
          <circle cx="10" cy="0" r="19" fill="${fish.color}" />
          <ellipse cx="6" cy="-6" rx="12" ry="7" fill="#ffffff" opacity="0.4" />
          ${isDead
            ? svg`<line x1="18" y1="-5" x2="24" y2="1" stroke="#ffffff" stroke-width="2" />`
            : svg`<circle cx="21" cy="-2" r="3.6" fill="#ffffff" /><circle cx="22.2" cy="-2" r="1.8" fill="#0f172a" />`}
        `;
      } else if (fish.species === 1) {
        bodySvg = svg`
          <g transform="translate(-16, 0) rotate(${tailWag})">
            <path d="M 0,0 L -48,-19 L -30,-1 Z" fill="${fish.color}" opacity="0.92" />
            <path d="M 0,0 L -48,19 L -30,1 Z" fill="${fish.color}" opacity="0.8" />
          </g>
          <path d="M -14,0 C -14,-11 -6,-19 8,-19 C 20,-19 27,-11 27,0 C 27,10 20,17 8,17 C -6,17 -14,10 -14,0 Z" fill="${fish.color}" />
          ${isDead
            ? svg`<line x1="17" y1="-6" x2="23" y2="0" stroke="#ffffff" stroke-width="1.8" />`
            : svg`<circle cx="20" cy="-3" r="3" fill="#ffffff" /><circle cx="21" cy="-3" r="1.5" fill="#0f172a" />`}
        `;
      } else {
        bodySvg = svg`
          <g transform="translate(-14,0) rotate(${tailWag * 0.8})">
            <path d="M 0,0 C -9,-12 -23,-12 -30,-2 C -22,2 -22,2 -30,6 C -23,14 -9,12 0,0 Z" fill="${fish.color}" opacity="0.88" />
          </g>
          <circle cx="4" cy="2" r="22" fill="${fish.color}" />
          ${isDead
            ? svg`<line x1="16" y1="-3" x2="22" y2="1" stroke="#ffffff" stroke-width="1.8" />`
            : svg`<circle cx="20" cy="-1" r="3" fill="#ffffff" /><circle cx="21.2" cy="-1" r="1.5" fill="#0f172a" />`}
        `;
      }
    } else {
      if (fish.species === 0) {
        bodySvg = svg`
          <polygon points="5,-42 -10,-12 10,-12" fill="${fish.color}" opacity="0.9" />
          <polygon points="0,42 -8,12 8,12" fill="${fish.color}" opacity="0.9" />
          <line x1="8" y1="10" x2="20" y2="48" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
          <g transform="translate(-22, 0) rotate(${tailWag})">
            <polygon points="0,0 -20,-14 -15,0 -20,14" fill="${fish.color}" />
          </g>
          <polygon points="-20,0 5,-17 24,0 5,17" fill="${fish.color}" />
          <line x1="3" y1="-17" x2="3" y2="17" stroke="#0f172a" stroke-width="3" />
          ${isDead
            ? svg`<line x1="14" y1="-5" x2="19" y2="0" stroke="#ffffff" stroke-width="2" />`
            : svg`<circle cx="16" cy="-3" r="3.0" fill="#ef4444" /><circle cx="17" cy="-3" r="1.4" fill="#0f172a" />`}
        `;
      } else if (fish.species === 1) {
        bodySvg = svg`
          <g transform="translate(-20, 0) rotate(${tailWag})">
            <polygon points="0,0 -14,-7 -12,0 -14,7" fill="rgba(255,255,255,0.7)" />
          </g>
          <ellipse cx="0" cy="0" rx="22" ry="9" fill="#1e293b" />
          <path d="M 15,-2 L -17,-2" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" />
          <path d="M 0,3 L -17,3" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" />
          ${isDead
            ? svg`<line x1="12" y1="-4" x2="17" y2="0" stroke="#ffffff" stroke-width="1.5" />`
            : svg`<circle cx="14" cy="-2" r="2.2" fill="#38bdf8" /><circle cx="15" cy="-2" r="0.9" fill="#0f172a" />`}
        `;
      } else {
        bodySvg = svg`
          <g transform="translate(-22, 0) rotate(${tailWag})">
            <polygon points="0,0 -19,-12 -16,0 -19,12" fill="${fish.color}" />
          </g>
          <ellipse cx="0" cy="0" rx="22" ry="14" fill="${fish.color}" />
          ${isDead
            ? svg`<line x1="12" y1="-6" x2="18" y2="0" stroke="#ffffff" stroke-width="2" />`
            : svg`<circle cx="14" cy="-4" r="3.2" fill="#ffffff" /><circle cx="15" cy="-4" r="1.5" fill="#0f172a" />`}
        `;
      }
    }

    return svg`
      <g transform="scale(${isFlipped ? -s : s}, ${s})">
        <g opacity="${bodyOpacity}">${bodySvg}</g>
        ${p > 0
          ? svg`
              <g opacity="${skeletonOpacity}">
                <line x1="-28" y1="0" x2="16" y2="0" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round" />
                <path d="M 12 -10 C 26 -10 28 0 26 10 C 18 10 14 6 12 0 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1" />
                <circle cx="18" cy="-2" r="2.8" fill="#0f172a" />
              </g>
            `
          : ""}
      </g>
    `;
  }

  _renderAncistrusChoice(anc, isDead) {
    const p = anc.deathProgress || 0;
    const bodyOpacity = (1.0 - p).toFixed(2);
    const mouthPulse = isDead ? 1 : (1 + Math.sin(this._animTime * 1.6 + anc.id) * 0.07).toFixed(3);

    const bristlesMap = {
      1: svg`
        <path d="M -11,-4 Q -16,-15 -11,-18 Q -7,-14 -5,-4" stroke="#0f172a" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <path d="M -6,-6 Q -8,-20 -3,-19 Q -1,-15 -2,-6" stroke="#0f172a" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <path d="M 0,-7 Q 0,-22 3,-22 Q 4,-16 2,-7" stroke="#0f172a" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <path d="M 6,-6 Q 8,-20 3,-19 Q 1,-15 2,-6" stroke="#0f172a" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <path d="M 11,-4 Q 16,-15 11,-18 Q 7,-14 5,-4" stroke="#0f172a" stroke-width="1.3" fill="none" stroke-linecap="round" />
      `,
      2: svg`
        <path d="M -9,-5 Q -14,-14 -11,-18 M -13,-14 Q -18,-18 -15,-22" stroke="#0a0a0a" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M -4,-7 Q -5,-18 -1,-22 M -4,-16 Q -7,-22 -3,-26" stroke="#0a0a0a" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M 4,-7 Q 5,-18 1,-22 M 4,-16 Q 7,-22 3,-26" stroke="#0a0a0a" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M 9,-5 Q 14,-14 11,-18 M 13,-14 Q 18,-18 15,-22" stroke="#0a0a0a" stroke-width="1.2" fill="none" stroke-linecap="round" />
      `,
      3: svg`
        <path d="M -10,-5 Q -14,-16 -9,-18" stroke="#0f172a" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <circle cx="-9" cy="-18" r="0.9" fill="#ffffff" />
        <path d="M -5,-7 Q -6,-21 -2,-21" stroke="#0f172a" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <circle cx="-2" cy="-21" r="0.9" fill="#ffffff" />
        <path d="M 0,-8 Q 0,-23 3,-23" stroke="#0f172a" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <circle cx="3" cy="-23" r="0.9" fill="#ffffff" />
        <path d="M 5,-7 Q 6,-21 2,-21" stroke="#0f172a" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <circle cx="2" cy="-21" r="0.9" fill="#ffffff" />
        <path d="M 10,-5 Q 14,-16 9,-18" stroke="#0f172a" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <circle cx="9" cy="-18" r="0.9" fill="#ffffff" />
      `,
      4: svg`
        <path d="M -11,-3 Q -24,-6 -26,-12" stroke="#09090b" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <path d="M -6,-6 Q -10,-19 -4,-21" stroke="#09090b" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <path d="M 0,-7 Q 0,-22 4,-22" stroke="#09090b" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <path d="M 6,-6 Q 10,-19 4,-21" stroke="#09090b" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <path d="M 11,-3 Q 24,-6 26,-12" stroke="#09090b" stroke-width="1.3" fill="none" stroke-linecap="round" />
      `,
      5: svg`
        <line x1="-10" y1="-4" x2="-14" y2="-12" stroke="#000000" stroke-width="1.4" stroke-linecap="round" />
        <line x1="-7" y1="-5" x2="-9" y2="-16" stroke="#000000" stroke-width="1.4" stroke-linecap="round" />
        <line x1="-3" y1="-7" x2="-4" y2="-19" stroke="#000000" stroke-width="1.4" stroke-linecap="round" />
        <line x1="0" y1="-8" x2="0" y2="-20" stroke="#000000" stroke-width="1.4" stroke-linecap="round" />
        <line x1="3" y1="-7" x2="4" y2="-19" stroke="#000000" stroke-width="1.4" stroke-linecap="round" />
        <line x1="7" y1="-5" x2="9" y2="-16" stroke="#000000" stroke-width="1.4" stroke-linecap="round" />
        <line x1="10" y1="-4" x2="14" y2="-12" stroke="#000000" stroke-width="1.4" stroke-linecap="round" />
      `,
      6: svg`
        <path d="M -9,-4 Q -15,-12 -11,-16 M -12,-11 Q -19,-14 -16,-19 M -10,-14 Q -12,-20 -7,-22" stroke="#0c0a09" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M 0,-7 Q 0,-18 4,-21 M 1,-14 Q -4,-18 -1,-24 M 2,-14 Q 7,-19 5,-25" stroke="#0c0a09" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M 9,-4 Q 15,-12 11,-16 M 12,-11 Q 19,-14 16,-19 M 10,-14 Q 12,-20 7,-22" stroke="#0c0a09" stroke-width="1.2" fill="none" stroke-linecap="round" />
      `,
      7: svg`
        <path d="M -11,-4 Q -16,-13 -13,-17" stroke="#111827" stroke-width="1.1" fill="none" stroke-linecap="round" />
        <path d="M -7,-6 Q -9,-17 -6,-20" stroke="#111827" stroke-width="1.1" fill="none" stroke-linecap="round" />
        <path d="M -3,-7 Q -3,-20 0,-23" stroke="#111827" stroke-width="1.1" fill="none" stroke-linecap="round" />
        <path d="M 3,-7 Q 3,-20 0,-23" stroke="#111827" stroke-width="1.1" fill="none" stroke-linecap="round" />
        <path d="M 7,-6 Q 9,-17 6,-20" stroke="#111827" stroke-width="1.1" fill="none" stroke-linecap="round" />
        <path d="M 11,-4 Q 16,-13 13,-17" stroke="#111827" stroke-width="1.1" fill="none" stroke-linecap="round" />
      `,
      8: svg`
        <path d="M -10,-4 C -16,-8 -16,-17 -11,-16" stroke="#020617" stroke-width="1.4" fill="none" stroke-linecap="round" />
        <path d="M -5,-6 C -9,-12 -8,-21 -3,-20" stroke="#020617" stroke-width="1.4" fill="none" stroke-linecap="round" />
        <path d="M 0,-7 C -2,-14 2,-23 5,-20" stroke="#020617" stroke-width="1.4" fill="none" stroke-linecap="round" />
        <path d="M 5,-6 C 9,-12 8,-21 3,-20" stroke="#020617" stroke-width="1.4" fill="none" stroke-linecap="round" />
        <path d="M 10,-4 C 16,-8 16,-17 11,-16" stroke="#020617" stroke-width="1.4" fill="none" stroke-linecap="round" />
      `,
      9: svg`
        <path d="M -11,-3 Q -15,-10 -11,-13" stroke="#0f172a" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M -13,-7 Q -18,-15 -14,-18" stroke="#0f172a" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M -5,-5 Q -7,-13 -3,-16" stroke="#0f172a" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M -6,-9 Q -8,-18 -3,-22" stroke="#0f172a" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M 5,-5 Q 7,-13 3,-16" stroke="#0f172a" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M 6,-9 Q 8,-18 3,-22" stroke="#0f172a" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M 11,-3 Q 15,-10 11,-13" stroke="#0f172a" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <path d="M 13,-7 Q 18,-15 14,-18" stroke="#0f172a" stroke-width="1.2" fill="none" stroke-linecap="round" />
      `,
      10: svg`
        <path d="M -12,-3 Q -18,-9 -14,-14 Q -9,-11 -7,-4" stroke="#09090b" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <path d="M -7,-6 Q -12,-18 -6,-20 Q -2,-15 -3,-6" stroke="#09090b" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <path d="M 2,-7 Q 0,-21 5,-23 Q 7,-16 4,-7" stroke="#09090b" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <path d="M 9,-5 Q 16,-12 12,-17 Q 8,-13 6,-5" stroke="#09090b" stroke-width="1.3" fill="none" stroke-linecap="round" />
      `,
    };

    const dotsMap = {
      1: svg`
        <circle cx="-5" cy="18" r="0.8" fill="#ffffff" />
        <circle cx="5" cy="18" r="0.8" fill="#ffffff" />
        <circle cx="0" cy="28" r="0.8" fill="#ffffff" />
        <circle cx="-4" cy="40" r="0.7" fill="#ffffff" />
        <circle cx="4" cy="40" r="0.7" fill="#ffffff" />
        <circle cx="0" cy="54" r="0.7" fill="#ffffff" />
      `,
      2: svg`
        <circle cx="-6" cy="14" r="0.7" fill="#ffffff" />
        <circle cx="6" cy="14" r="0.7" fill="#ffffff" />
        <circle cx="-3" cy="24" r="0.8" fill="#ffffff" />
        <circle cx="3" cy="24" r="0.8" fill="#ffffff" />
        <circle cx="-5" cy="35" r="0.7" fill="#ffffff" />
        <circle cx="5" cy="35" r="0.7" fill="#ffffff" />
        <circle cx="0" cy="46" r="0.8" fill="#ffffff" />
        <circle cx="-3" cy="58" r="0.6" fill="#ffffff" />
        <circle cx="3" cy="58" r="0.6" fill="#ffffff" />
      `,
      3: svg`
        <circle cx="-4" cy="16" r="0.8" fill="#ffffff" />
        <circle cx="4" cy="16" r="0.8" fill="#ffffff" />
        <circle cx="-5" cy="28" r="0.8" fill="#ffffff" />
        <circle cx="5" cy="28" r="0.8" fill="#ffffff" />
        <circle cx="-4" cy="42" r="0.7" fill="#ffffff" />
        <circle cx="4" cy="42" r="0.7" fill="#ffffff" />
        <circle cx="-3" cy="56" r="0.7" fill="#ffffff" />
        <circle cx="3" cy="56" r="0.7" fill="#ffffff" />
      `,
      4: svg`
        <circle cx="0" cy="14" r="1.1" fill="#ffffff" />
        <circle cx="-5" cy="24" r="0.9" fill="#ffffff" />
        <circle cx="5" cy="24" r="0.9" fill="#ffffff" />
        <circle cx="0" cy="34" r="1.0" fill="#ffffff" />
        <circle cx="-4" cy="46" r="0.8" fill="#ffffff" />
        <circle cx="4" cy="46" r="0.8" fill="#ffffff" />
        <circle cx="0" cy="58" r="0.9" fill="#ffffff" />
      `,
      5: svg`
        <circle cx="-6" cy="16" r="0.7" fill="#ffffff" />
        <circle cx="0" cy="18" r="0.7" fill="#ffffff" />
        <circle cx="6" cy="16" r="0.7" fill="#ffffff" />
        <circle cx="-5" cy="30" r="0.7" fill="#ffffff" />
        <circle cx="5" cy="30" r="0.7" fill="#ffffff" />
        <circle cx="0" cy="40" r="0.7" fill="#ffffff" />
        <circle cx="-4" cy="52" r="0.6" fill="#ffffff" />
        <circle cx="4" cy="52" r="0.6" fill="#ffffff" />
      `,
      6: svg`
        <circle cx="-5" cy="15" r="0.8" fill="#ffffff" />
        <circle cx="4" cy="18" r="0.8" fill="#ffffff" />
        <circle cx="-2" cy="27" r="0.8" fill="#ffffff" />
        <circle cx="5" cy="33" r="0.7" fill="#ffffff" />
        <circle cx="-4" cy="42" r="0.7" fill="#ffffff" />
        <circle cx="1" cy="49" r="0.8" fill="#ffffff" />
        <circle cx="-2" cy="59" r="0.7" fill="#ffffff" />
      `,
      7: svg`
        <circle cx="-7" cy="14" r="0.6" fill="#ffffff" />
        <circle cx="-2" cy="16" r="0.6" fill="#ffffff" />
        <circle cx="3" cy="15" r="0.6" fill="#ffffff" />
        <circle cx="7" cy="17" r="0.6" fill="#ffffff" />
        <circle cx="-5" cy="26" r="0.6" fill="#ffffff" />
        <circle cx="0" cy="28" r="0.6" fill="#ffffff" />
        <circle cx="5" cy="27" r="0.6" fill="#ffffff" />
        <circle cx="-4" cy="39" r="0.6" fill="#ffffff" />
        <circle cx="3" cy="41" r="0.6" fill="#ffffff" />
        <circle cx="-2" cy="52" r="0.5" fill="#ffffff" />
        <circle cx="2" cy="54" r="0.5" fill="#ffffff" />
      `,
      8: svg`
        <circle cx="-5" cy="17" r="0.9" fill="#ffffff" />
        <circle cx="5" cy="17" r="0.9" fill="#ffffff" />
        <circle cx="0" cy="30" r="1.0" fill="#ffffff" />
        <circle cx="-4" cy="44" r="0.8" fill="#ffffff" />
        <circle cx="4" cy="44" r="0.8" fill="#ffffff" />
        <circle cx="0" cy="60" r="0.8" fill="#ffffff" />
      `,
      9: svg`
        <circle cx="-6" cy="15" r="0.7" fill="#ffffff" />
        <circle cx="6" cy="15" r="0.7" fill="#ffffff" />
        <circle cx="-3" cy="22" r="0.7" fill="#ffffff" />
        <circle cx="3" cy="22" r="0.7" fill="#ffffff" />
        <circle cx="-5" cy="32" r="0.7" fill="#ffffff" />
        <circle cx="5" cy="32" r="0.7" fill="#ffffff" />
        <circle cx="-2" cy="42" r="0.7" fill="#ffffff" />
        <circle cx="2" cy="42" r="0.7" fill="#ffffff" />
        <circle cx="0" cy="54" r="0.6" fill="#ffffff" />
      `,
      10: svg`
        <circle cx="-4" cy="15" r="0.8" fill="#ffffff" />
        <circle cx="5" cy="18" r="0.8" fill="#ffffff" />
        <circle cx="0" cy="25" r="0.8" fill="#ffffff" />
        <circle cx="-5" cy="36" r="0.8" fill="#ffffff" />
        <circle cx="4" cy="40" r="0.7" fill="#ffffff" />
        <circle cx="-1" cy="50" r="0.7" fill="#ffffff" />
        <circle cx="3" cy="60" r="0.6" fill="#ffffff" />
      `,
    };

    const finSeamsMap = {
      1: svg``,
      2: svg`
        <path d="M -26,26 C -20,26 -14,20 -9,14" stroke="#ffffff" stroke-width="1.1" fill="none" opacity="0.85" />
        <path d="M 26,26 C 20,26 14,20 9,14" stroke="#ffffff" stroke-width="1.1" fill="none" opacity="0.85" />
        <path d="M -4,74 L 0,79 L 4,74" stroke="#ffffff" stroke-width="1.1" fill="none" opacity="0.85" />
      `,
      3: svg`
        <line x1="-12" y1="6" x2="-26" y2="26" stroke="#475569" stroke-width="0.7" />
        <line x1="12" y1="6" x2="26" y2="26" stroke="#475569" stroke-width="0.7" />
      `,
      4: svg`
        <path d="M -15,44 C -12,44 -7,42 -7,42" stroke="#ffffff" stroke-width="0.8" fill="none" opacity="0.7" />
        <path d="M 15,44 C 12,44 7,42 7,42" stroke="#ffffff" stroke-width="0.8" fill="none" opacity="0.7" />
      `,
      5: svg``,
      6: svg`
        <path d="M -26,26 Q -18,24 -9,14" stroke="#d4d4d8" stroke-width="0.9" fill="none" opacity="0.8" />
        <path d="M 26,26 Q 18,24 9,14" stroke="#d4d4d8" stroke-width="0.9" fill="none" opacity="0.8" />
      `,
      7: svg``,
      8: svg`
        <circle cx="-18" cy="20" r="0.7" fill="#ffffff" />
        <circle cx="18" cy="20" r="0.7" fill="#ffffff" />
      `,
      9: svg`
        <path d="M -4,74 L 0,80 L 4,74" stroke="#facc15" stroke-width="0.9" fill="none" opacity="0.85" />
      `,
      10: svg``,
    };

    return svg`
      <g transform="translate(${anc.x}, ${anc.y}) scale(0.82, 0.82)">
        <!-- Number badge bubble above Ancistrus -->
        <g transform="translate(0, -38)">
          <circle cx="0" cy="0" r="11" fill="#0284c7" stroke="#ffffff" stroke-width="2" />
          <text x="0" y="4" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">${anc.id}</text>
        </g>

        <!-- Body group -->
        <g opacity="${bodyOpacity}">
          <!-- Compact flowing pectoral fins (Ancistrus 2 base) -->
          <path d="M -12,6 C -24,10 -30,18 -26,26 C -20,26 -14,20 -9,14 Z" fill="#182026" stroke="#0a0f14" stroke-width="0.8" />
          <path d="M 12,6 C 24,10 30,18 26,26 C 20,26 14,20 9,14 Z" fill="#182026" stroke="#0a0f14" stroke-width="0.8" />
          ${finSeamsMap[anc.id] || svg``}

          <!-- Pelvic fins -->
          <path d="M -7,30 C -15,36 -15,44 -7,42 Z" fill="#182026" stroke="#0a0f14" stroke-width="0.6" />
          <path d="M 7,30 C 15,36 15,44 7,42 Z" fill="#182026" stroke="#0a0f14" stroke-width="0.6" />

          <!-- Streamlined body (Ancistrus 2 base, color 1) -->
          <path d="M -12,0 C -16,16 -15,34 -9,52 L -3,74 L 3,74 L 9,52 C 15,34 16,16 12,0 C 9,-8 -9,-8 -12,0 Z" fill="#1e293b" stroke="#0a0f14" stroke-width="1.1" />

          <!-- White micro-dots -->
          ${dotsMap[anc.id] || svg``}

          <!-- Snout bristles / poils (Ancistrus 1 tentacle base) -->
          ${bristlesMap[anc.id] || svg``}

          <!-- Recessed sucker mouth inside body -->
          <g transform="translate(0, 3) scale(${mouthPulse}, ${mouthPulse})">
            <ellipse cx="0" cy="0" rx="7.4" ry="5.6" fill="#334155" stroke="#0a0f14" stroke-width="0.9" />
            <ellipse cx="0" cy="0" rx="4.8" ry="3.6" fill="#0f172a" />
            <ellipse cx="0" cy="0" rx="2.2" ry="1.5" fill="#475569" />
          </g>
        </g>

        ${p > 0
          ? svg`
              <g opacity="${p.toFixed(2)}">
                <line x1="0" y1="-20" x2="0" y2="70" stroke="#f1f5f9" stroke-width="2" stroke-linecap="round" />
                <circle cx="0" cy="-10" r="4" fill="#f1f5f9" />
              </g>
            `
          : ""}
      </g>
    `;
  }

  _renderShrimp(isDead) {
    if (!this._shrimp) return svg``;
    const s = this._shrimp;
    const p = s.deathProgress || 0;
    const bodyOpacity = (1.0 - p).toFixed(2);
    const flip = s.dir === -1 ? -1 : 1;

    return svg`
      <g transform="translate(${s.x}, ${s.y}) scale(${flip * 1.5}, 1.5)" opacity="${bodyOpacity}">
        <path d="M -6,10 L -8,16" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
        <path d="M 0,12 L -1,18" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
        <path d="M 6,13 L 6,19" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
        <path d="M 12,12 L 13,18" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
        <path d="M 20,14 L 32,6 L 34,14 L 32,23 L 20,18 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="0.7" />
        <path d="M -30,-10 C -20,-16 -6,-16 4,-10 C 12,-6 16,-2 20,6 C 23,11 23,15 19,16 C 8,17 -2,15 -10,10 C -18,5 -24,-2 -30,-10 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="0.9" />
        <circle cx="-22" cy="-8" r="1.5" fill="#fef2f2" />
        <circle cx="-14" cy="-11" r="1.4" fill="#fef2f2" />
        <circle cx="-6" cy="-10" r="1.5" fill="#fef2f2" />
        <circle cx="1" cy="-7" r="1.3" fill="#fef2f2" />
        <path d="M -30,-9 Q -40,-10 -46,-4 Q -40,0 -32,-4 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="0.7" />
        <path d="M -30,-11 Q -60,-24 -88,-30" stroke="#fef9c3" stroke-width="1.1" fill="none" stroke-linecap="round" />
        <path d="M -28,-8 Q -54,-12 -80,-10" stroke="#fef9c3" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.85" />
        ${isDead
          ? svg`<line x1="-29" y1="-15" x2="-25" y2="-11" stroke="#ffffff" stroke-width="1" />`
          : svg`<circle cx="-27" cy="-13" r="1.9" fill="#0f172a" /><circle cx="-27.6" cy="-13.6" r="0.6" fill="#f1f5f9" />`}
      </g>
    `;
  }

  _renderCrab(isDead) {
    if (!this._crab) return svg``;
    const c = this._crab;
    const p = c.deathProgress || 0;
    const bodyOpacity = (1.0 - p).toFixed(2);
    const flip = c.dir === -1 ? -1 : 1;

    return svg`
      <g transform="translate(${c.x}, ${c.y}) scale(${flip * 1.4}, 1.4)" opacity="${bodyOpacity}">
        <path d="M -14,-2 L -26,-10 L -34,-8" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M -15,4 L -28,4 L -36,9" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M -13,10 L -24,16 L -30,24" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M -8,14 L -16,24 L -20,32" stroke="#7c2d12" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <path d="M 14,-2 L 26,-10 L 34,-8" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M 15,4 L 28,4 L 36,9" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M 13,10 L 24,16 L 30,24" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M 8,14 L 16,24 L 20,32" stroke="#7c2d12" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <path d="M -12,-8 L -22,-18 Q -30,-22 -34,-16 Q -28,-12 -20,-10 Z" fill="#ea580c" stroke="#9a3412" stroke-width="1" />
        <path d="M 12,-8 L 22,-18 Q 30,-22 34,-16 Q 28,-12 20,-10 Z" fill="#ea580c" stroke="#9a3412" stroke-width="1" />
        <path d="M -20,-10 C -24,-2 -24,8 -18,14 C -10,19 10,19 18,14 C 24,8 24,-2 20,-10 C 14,-16 -14,-16 -20,-10 Z" fill="#dc2626" stroke="#ea580c" stroke-width="1.2" />
        <ellipse cx="0" cy="-2" rx="15" ry="10" fill="#f87171" opacity="0.35" />
        <path d="M -6,-13 L -7,-19" stroke="#9a3412" stroke-width="1.4" stroke-linecap="round" />
        <path d="M 6,-13 L 7,-19" stroke="#9a3412" stroke-width="1.4" stroke-linecap="round" />
        ${isDead
          ? svg`<line x1="-9" y1="-21" x2="-5" y2="-19" stroke="#ffffff" stroke-width="1" /><line x1="5" y1="-21" x2="9" y2="-19" stroke="#ffffff" stroke-width="1" />`
          : svg`<circle cx="-7.2" cy="-20" r="2" fill="#0f172a" /><circle cx="7.2" cy="-20" r="2" fill="#0f172a" />`}
      </g>
    `;
  }

  _renderStatusPanel(currentTemp, currentVolume, isFullscreen, targetBudget, isWarning, isCritical, isBoiling, isHeatDead) {
    if (!isFullscreen) return svg``;

    const r = 68;
    const circ = 2 * Math.PI * r;
    const strokeW = 7;

    // Shifted further towards edges: left at x=90, right at x=934
    const volCx = 934;
    const volCy = 85;
    const volFraction = Math.max(0, Math.min(1, currentVolume / Math.max(1, targetBudget)));
    const volColor = isCritical ? "#ef4444" : isWarning ? "#f59e0b" : "#38bdf8";
    const volArc = (volFraction * circ).toFixed(1);

    const tempCx = 90;
    const tempCy = 85;
    const showTemp = currentTemp > 0;
    const tempFraction = Math.max(0, Math.min(1, currentTemp / 45));
    const tempColor = isHeatDead ? "#ef4444" : isBoiling ? "#f59e0b" : "#facc15";
    const tempArc = (tempFraction * circ).toFixed(1);

    return svg`
      <!-- Left HUD: Temperature (transparent background circle, x2.5 font size) -->
      ${showTemp
        ? svg`
            <g transform="translate(${tempCx}, ${tempCy})">
              <circle r="${r}" fill="none" />
              <circle r="${r}" fill="none" stroke="#ffffff" stroke-width="${strokeW}" opacity="0.25" />
              <circle
                r="${r}"
                fill="none"
                stroke="${tempColor}"
                stroke-width="${strokeW}"
                stroke-linecap="round"
                stroke-dasharray="${tempArc} ${circ.toFixed(1)}"
                transform="rotate(-90)"
              />
              <text y="7" font-family="system-ui, sans-serif" font-size="44" font-weight="800" fill="#ffffff" text-anchor="middle">${currentTemp.toFixed(1)}°</text>
              <text y="28" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" opacity="0.85" text-anchor="middle" letter-spacing="1.2">TEMP</text>
            </g>
          `
        : ""}

      <!-- Right HUD: Litres (transparent background circle, x2.5 font size) -->
      <g transform="translate(${volCx}, ${volCy})">
        <circle r="${r}" fill="none" />
        <circle r="${r}" fill="none" stroke="#ffffff" stroke-width="${strokeW}" opacity="0.25" />
        <circle
          r="${r}"
          fill="none"
          stroke="${volColor}"
          stroke-width="${strokeW}"
          stroke-linecap="round"
          stroke-dasharray="${volArc} ${circ.toFixed(1)}"
          transform="rotate(-90)"
        />
        <text y="7" font-family="system-ui, sans-serif" font-size="44" font-weight="800" fill="#ffffff" text-anchor="middle">${currentVolume.toFixed(1)}</text>
        <text y="28" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" opacity="0.85" text-anchor="middle" letter-spacing="1.2">LITRES</text>
      </g>
    `;
  }

  _renderAlgae(hours, isFullscreen) {
    const delay = Number(this._config.algae_delay_hours) || 12;
    const algaeAge = Number(this._config.algae_age) || 0;
    const effectiveHours = algaeAge > 0 ? algaeAge : hours;

    if (!this._config.algae_enabled || effectiveHours < delay) {
      return svg``;
    }

    const intensity = Math.min(1.0, (effectiveHours - delay) / 36);
    const baseOpacity = (0.2 + intensity * 0.78).toFixed(2);
    const topY = isFullscreen ? 0 : 14;
    const bottomY = isFullscreen ? 600 : this._getCanvasHeight() - 35;

    return svg`
      <g id="algae-layer" opacity="${baseOpacity}">
        <rect x="0" y="${topY}" width="1024" height="${bottomY - topY}" fill="url(#algaeDots)" />
      </g>
    `;
  }

  render() {
    if (!this._config || !this._hass) return html``;

    const currentVolume = this._cachedConsumedVolume;
    const currentTemp = this._cachedTemperature;
    const targetBudget = this._cachedTargetBudget;
    const survivalVolume = this._cachedSurvivalVolume;
    const totalVolume = targetBudget + survivalVolume;

    const boilTemp = Number(this._config.temp_boiling_threshold) || 40;
    const deadlyTemp = Number(this._config.temp_deadly_threshold) || 45;

    const remainingVolumeInTank = Math.max(0, totalVolume - currentVolume);
    const displayedRemaining = Math.max(0, targetBudget - currentVolume);
    const waterRatio = Math.max(0, Math.min(1, remainingVolumeInTank / totalVolume));

    const isFullscreen = Boolean(this._config.fullscreen);
    const canvasH = this._getCanvasHeight();
    const canvasBottom = canvasH - 35;
    const tankTop = isFullscreen ? 0 : 15;
    const tankBottom = isFullscreen ? 600 : canvasBottom;
    const tankHeight = tankBottom - tankTop;
    const waterSurfaceY = tankBottom - waterRatio * tankHeight;

    const isHeatDead = currentTemp >= deadlyTemp && currentTemp > 0;
    const isWaterDead = remainingVolumeInTank <= 0;
    const isDead = isHeatDead || isWaterDead;

    const isBoiling = currentTemp >= boilTemp && currentTemp > 0;
    const isCritical = currentVolume > targetBudget && !isDead;
    const isWarning = currentVolume > targetBudget * 0.7 && !isCritical && !isDead;

    const themeKey = this._config.theme || "freshwater";
    const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.freshwater;

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
    const rWidth = Number(this._config.aspect_ratio_width) || 1024;
    const rHeight = Number(this._config.aspect_ratio_height) || 600;

    const algaeAge = Number(this._config.algae_age) || 0;
    const effectiveAlgaeHours = algaeAge > 0 ? algaeAge : this._cachedHoursSinceLastShower;

    return html`
      <ha-card>
        ${!isFullscreen && hasTitle
          ? html`<div class="card-header"><span class="card-title">${this._config.title}</span></div>`
          : ""}

        <div class="aquarium-container">
          <svg
            viewBox="0 0 1024 ${isFullscreen ? 600 : canvasH}"
            preserveAspectRatio="${isFullscreen ? "none" : "xMidYMid meet"}"
            style="${isFullscreen
              ? "width: 100%; height: 100%;"
              : `aspect-ratio: ${rWidth} / ${rHeight};`}"
          >
            <defs>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
                <stop offset="10%" stop-color="#ffffff" stop-opacity="0.02" />
                <stop offset="90%" stop-color="#ffffff" stop-opacity="0.02" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18" />
              </linearGradient>

              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${waterColorStart}" stop-opacity="${isBoiling ? "0.5" : "0.25"}" />
                <stop offset="100%" stop-color="${waterColorEnd}" stop-opacity="${isBoiling ? "0.75" : "0.45"}" />
              </linearGradient>

              <linearGradient id="tangBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#1e3a8a" />
                <stop offset="55%" stop-color="#2563eb" />
                <stop offset="100%" stop-color="#60a5fa" />
              </linearGradient>

              <linearGradient id="butterflyBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#fef08a" />
                <stop offset="55%" stop-color="#fbbf24" />
                <stop offset="100%" stop-color="#f97316" />
              </linearGradient>

              <pattern id="algaeDots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="2.5" cy="3" r="1.4" fill="#2d4a1d" opacity="0.95" />
                <circle cx="8.5" cy="6" r="1.8" fill="#1e3312" opacity="0.98" />
                <circle cx="5" cy="10" r="1.3" fill="#365314" opacity="0.9" />
                <circle cx="10" cy="11" r="1.5" fill="#1b2e10" opacity="0.95" />
              </pattern>

              <clipPath id="innerTankClip">
                ${isFullscreen
                  ? svg`<rect x="0" y="0" width="1024" height="600" />`
                  : svg`<rect x="12" y="14" width="1000" height="${canvasBottom - 14}" rx="18" ry="18" />`}
              </clipPath>
            </defs>

            <g clip-path="url(#innerTankClip)">
              <rect
                x="${isFullscreen ? 0 : 12}"
                y="${isFullscreen ? 0 : 14}"
                width="${isFullscreen ? 1024 : 1000}"
                height="${isFullscreen ? 600 : canvasBottom - 14}"
                fill="${theme.background}"
              />

              <path
                d="M ${isFullscreen ? 0 : 12} ${tankBottom - 60} Q 280 ${tankBottom - 85}, 512 ${tankBottom - 55} T ${isFullscreen ? 1024 : 1012} ${tankBottom - 60} L ${isFullscreen ? 1024 : 1012} ${tankBottom} L ${isFullscreen ? 0 : 12} ${tankBottom} Z"
                fill="${theme.sandColor}"
              />

              ${this._renderThemeDecoration(themeKey, isFullscreen)}

              <g>
                ${this._snails.map((snail, sIdx) => {
                  const rotation =
                    snail.type === "glass_left"
                      ? 90
                      : snail.type === "glass_right"
                      ? -90
                      : 0;
                  const baseScale = themeKey === "saltwater" ? (sIdx % 2 === 0 ? 2.5 : 3.0) : 1.8;
                  return svg`
                    <g transform="translate(${snail.x}, ${snail.y}) rotate(${rotation}) scale(${snail.dir * baseScale}, ${baseScale})">
                      <circle cx="-3" cy="-4" r="5.5" fill="${snail.color}" />
                      <path d="M -3,-4 A 3 3 0 0 1 -1,-2" stroke="#ffffff" stroke-width="0.8" fill="none" />
                      <ellipse cx="2" cy="-1.5" rx="5" ry="2.2" fill="#d97706" />
                      <line x1="5" y1="-2.5" x2="7.5" y2="-5.5" stroke="#d97706" stroke-width="0.8" />
                      <circle cx="7.5" cy="-5.5" r="0.6" fill="#111827" />
                    </g>
                  `;
                })}
              </g>

              ${waterRatio > 0
                ? svg`
                    <g>
                      <rect
                        x="${isFullscreen ? 0 : 12}"
                        y="${waterSurfaceY - 5}"
                        width="${isFullscreen ? 1024 : 1000}"
                        height="${tankBottom - waterSurfaceY + 5}"
                        fill="url(#waterGrad)"
                      />
                      ${this._renderWaterSurface(
                        isFullscreen ? 0 : 12,
                        isFullscreen ? 1024 : 1012,
                        waterSurfaceY
                      )}
                    </g>
                  `
                : ""}

              ${waterRatio > 0 && !isDead
                ? svg`
                    <g>
                      ${this._bubbles.map(
                        (b) => svg`
                          <circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="#ffffff" opacity="0.6" stroke="rgba(255,255,255,0.8)" stroke-width="0.8" />
                        `
                      )}
                    </g>
                  `
                : ""}

              ${isBoiling && waterRatio > 0
                ? svg`
                    <g>
                      ${this._boilingBubbles.map(
                        (b) => svg`
                          <circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="#fef08a" opacity="0.75" stroke="#ffffff" stroke-width="1.2" />
                        `
                      )}
                    </g>
                  `
                : ""}

              <g>
                ${(this._fishes || []).map((fish) => {
                  const rotation = isDead ? 180 : 0;
                  return svg`
                    <g transform="translate(${fish.x}, ${fish.y}) rotate(${rotation})">
                      ${this._renderFishShape(fish, themeKey, isDead)}
                    </g>
                  `;
                })}
              </g>

              ${themeKey === "freshwater"
                ? (this._ancistrusList || []).map((anc) => this._renderAncistrusChoice(anc, isDead))
                : ""}
              ${themeKey === "saltwater" ? this._renderShrimp(isDead) : ""}
              ${themeKey === "saltwater" ? this._renderCrab(isDead) : ""}
              ${this._renderAlgae(effectiveAlgaeHours, isFullscreen)}
              ${this._renderStatusPanel(
                currentTemp,
                currentVolume,
                isFullscreen,
                targetBudget,
                isWarning,
                isCritical,
                isBoiling,
                isHeatDead
              )}
            </g>

            ${!isFullscreen
              ? svg`
                  <rect x="12" y="14" width="1000" height="${canvasBottom - 14}" rx="18" ry="18" fill="url(#glassGrad)" stroke="#94a3b8" stroke-width="3" />
                  <rect x="4" y="${canvasBottom}" width="1016" height="14" rx="4" ry="4" fill="#1e293b" />
                `
              : ""}
          </svg>
        </div>

        ${!isFullscreen
          ? html`
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
                ${currentTemp > 0
                  ? html`
                      <div class="metric-box">
                        <div
                          class="metric-value"
                          style="color: ${currentTemp >= deadlyTemp
                            ? "#ef4444"
                            : currentTemp >= boilTemp
                            ? "#f59e0b"
                            : "inherit"};"
                        >
                          ${currentTemp.toFixed(1)} <span class="metric-unit">°C</span>
                        </div>
                        <div class="metric-label">${this._t("label_temperature")}</div>
                      </div>
                    `
                  : ""}
              </div>
            `
          : ""}
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
