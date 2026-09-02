import { LitElement, html, css, svg } from "./lit-element-bundle.min.js";

// Shower Aquarium Card
// Version tracked via Git tags / GitHub Releases (see CARD_VERSION below and the repo's Releases page)
const CARD_VERSION = "0.1.5";

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
      _ancistrus: { type: Object },
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
    this._ancistrus = {
      x: 65,
      y: 350,
      targetY: 350,
      state: "idle",
      idleUntil: 0,
      dir: 1,
      deathProgress: 0,
    };
    this._shrimp = {
      x: 760,
      y: 0,
      targetX: 760,
      state: "idle",
      idleUntil: 0,
      dir: -1,
      deathProgress: 0,
    };
    this._crab = {
      x: 700,
      y: 0,
      targetX: 700,
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
      if (index < 2) return 0; // clownfish, capped at 2 (territorial around the anemone)
      if (index === 2) return 1; // tang, capped at 1
      if (index === 3) return 3; // butterflyfish, capped at 1
      return 2; // remaining fish are generic reef fish, varied colors
    }
    if (themeKey === "coldwater") {
      return index % 3; // fantail / comet / lionhead
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

    if (this._ancistrus) {
      if (isDead) {
        this._ancistrus.deathProgress = Math.min(1.0, (this._ancistrus.deathProgress || 0) + deathStep);
        this._ancistrus.y = Math.min(tankBottom - 18, this._ancistrus.y + 1.2 * delta);
        stateChanged = true;
      } else {
        this._ancistrus.deathProgress = 0;
        const minVY = Math.max(tankTop + 40, waterSurfaceY + 50);
        const maxVY = tankBottom - 85;

        if (!this._ancistrus.idleUntil) {
          this._ancistrus.idleUntil = timestamp + 3000 + Math.random() * 4000;
        }

        if (this._ancistrus.state === "moving") {
          const dy = this._ancistrus.targetY - this._ancistrus.y;
          const step = Math.sign(dy) * Math.min(Math.abs(dy), 0.5 * userSpeed * delta);
          this._ancistrus.y += step;
          if (Math.abs(this._ancistrus.targetY - this._ancistrus.y) < 1.5) {
            this._ancistrus.state = "idle";
            this._ancistrus.idleUntil = timestamp + 4000 + Math.random() * 5000;
          }
        } else if (timestamp >= this._ancistrus.idleUntil) {
          this._ancistrus.state = "moving";
          this._ancistrus.targetY = minVY + Math.random() * (maxVY - minVY);
        }

        this._ancistrus.x = 65;
        stateChanged = true;
      }
    }

    if (this._shrimp) {
      if (isDead) {
        this._shrimp.deathProgress = Math.min(1.0, (this._shrimp.deathProgress || 0) + deathStep);
        stateChanged = true;
      } else {
        this._shrimp.deathProgress = 0;
        this._shrimp.y = tankBottom - 25;
        const minSX = 760;
        const maxSX = 900;

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
        const minCX = 580;
        const maxCX = 690;

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
            <circle cx="-46.1" cy="-27.7" r="3.4" fill="#5f4a72" opacity="0.7" />
            <circle cx="-16.3" cy="-53.1" r="2.6" fill="#e879a8" opacity="0.9" />
            <circle cx="23.1" cy="-58.6" r="2.7" fill="#9d7bab" opacity="0.71" />
            <circle cx="35.6" cy="-34.2" r="2.1" fill="#7e5a8c" opacity="0.84" />
            <circle cx="-41.6" cy="-17.6" r="4.3" fill="#7e5a8c" opacity="0.59" />
            <circle cx="10.6" cy="-41.0" r="2.9" fill="#c084bc" opacity="0.67" />
            <circle cx="-17.2" cy="-42.3" r="3.8" fill="#5f4a72" opacity="0.53" />
            <circle cx="-27.4" cy="-10.7" r="4.1" fill="#7e5a8c" opacity="0.55" />
            <circle cx="-2.6" cy="-43.4" r="3.2" fill="#c084bc" opacity="0.57" />
            <circle cx="-28.6" cy="-44.3" r="2.4" fill="#9d7bab" opacity="0.67" />
            <circle cx="-21.0" cy="-27.3" r="4.8" fill="#7e5a8c" opacity="0.61" />
            <circle cx="46.9" cy="-42.9" r="2.7" fill="#7e5a8c" opacity="0.58" />
            <circle cx="-39.4" cy="-20.5" r="3.7" fill="#7e5a8c" opacity="0.52" />
            <circle cx="18.4" cy="-24.3" r="1.8" fill="#e879a8" opacity="0.63" />
            <circle cx="-3.7" cy="-31.0" r="2.1" fill="#e879a8" opacity="0.75" />
            <circle cx="26.8" cy="-36.5" r="3.7" fill="#9d7bab" opacity="0.88" />
            <circle cx="-36.5" cy="-35.9" r="4.4" fill="#9d7bab" opacity="0.75" />
            <circle cx="-7.5" cy="-27.4" r="3.6" fill="#9d7bab" opacity="0.56" />
            <circle cx="-24.6" cy="-52.7" r="3.9" fill="#c084bc" opacity="0.85" />
            <circle cx="-23.4" cy="-48.1" r="2.1" fill="#7e5a8c" opacity="0.7" />
            <circle cx="-1.5" cy="-12.7" r="3.0" fill="#c084bc" opacity="0.83" />
            <circle cx="-19.2" cy="-45.5" r="2.3" fill="#7e5a8c" opacity="0.55" />
            <circle cx="-40.2" cy="-35.0" r="3.6" fill="#7e5a8c" opacity="0.61" />
            <circle cx="16.5" cy="-43.4" r="1.8" fill="#5f4a72" opacity="0.66" />
            <circle cx="0.1" cy="-31.5" r="2.6" fill="#e879a8" opacity="0.73" />
            <circle cx="18.0" cy="-26.9" r="4.5" fill="#5f4a72" opacity="0.76" />
            <circle cx="-13.4" cy="-57.7" r="2.2" fill="#7e5a8c" opacity="0.87" />
            <circle cx="-26.0" cy="-35.6" r="2.7" fill="#7e5a8c" opacity="0.51" />
            <circle cx="-21.2" cy="-51.9" r="4.0" fill="#5f4a72" opacity="0.55" />
            <circle cx="27.8" cy="-30.3" r="2.9" fill="#7e5a8c" opacity="0.86" />
            <circle cx="-3.5" cy="-62.3" r="4.2" fill="#5f4a72" opacity="0.64" />
            <circle cx="-20.7" cy="-65.3" r="4.4" fill="#c084bc" opacity="0.88" />
            <circle cx="32.6" cy="-34.4" r="1.8" fill="#c084bc" opacity="0.65" />
            <circle cx="12.7" cy="-37.4" r="2.1" fill="#7e5a8c" opacity="0.9" />
            <circle cx="32.1" cy="-55.1" r="3.0" fill="#e879a8" opacity="0.68" />
            <circle cx="-34.2" cy="-33.4" r="3.4" fill="#e879a8" opacity="0.51" />
            <circle cx="-25.9" cy="-48.9" r="2.5" fill="#7e5a8c" opacity="0.7" />
            <circle cx="-40.0" cy="-57.9" r="2.6" fill="#7e5a8c" opacity="0.65" />
            <circle cx="23.9" cy="-20.9" r="3.4" fill="#5f4a72" opacity="0.76" />
            <circle cx="-48.5" cy="-27.5" r="2.8" fill="#5f4a72" opacity="0.58" />
            <path d="M 77.8,-68.0 Q 77.8,-68.0 72.3,-56.4 Q 66.8,-44.7 60.1,-28.3 Q 53.4,-11.9 39.7,-16.8 Q 25.9,-21.6 23.7,-38.9 Q 21.5,-56.1 11.9,-72.6 Q 2.4,-89.2 12.7,-105.2 Q 23.0,-121.2 37.9,-120.4 Q 52.8,-119.6 64.2,-110.3 Q 75.5,-101.0 76.6,-84.5 Z" fill="#7a5d8f" />
            <circle cx="20.8" cy="-55.6" r="4.5" fill="#9d7bab" opacity="0.65" />
            <circle cx="33.7" cy="-75.5" r="2.2" fill="#c084bc" opacity="0.64" />
            <circle cx="51.2" cy="-72.2" r="2.0" fill="#5f4a72" opacity="0.83" />
            <circle cx="60.0" cy="-55.2" r="4.6" fill="#c084bc" opacity="0.65" />
            <circle cx="22.2" cy="-71.2" r="3.9" fill="#e879a8" opacity="0.68" />
            <circle cx="51.6" cy="-65.0" r="4.4" fill="#7e5a8c" opacity="0.77" />
            <circle cx="43.0" cy="-52.1" r="3.7" fill="#e879a8" opacity="0.51" />
            <circle cx="57.8" cy="-53.5" r="1.9" fill="#5f4a72" opacity="0.59" />
            <circle cx="50.2" cy="-62.5" r="3.7" fill="#c084bc" opacity="0.54" />
            <circle cx="23.4" cy="-73.4" r="2.9" fill="#7e5a8c" opacity="0.77" />
            <circle cx="51.8" cy="-49.2" r="2.3" fill="#7e5a8c" opacity="0.8" />
            <circle cx="39.8" cy="-69.5" r="2.5" fill="#5f4a72" opacity="0.72" />
            <circle cx="64.2" cy="-74.7" r="4.8" fill="#9d7bab" opacity="0.66" />
            <circle cx="53.9" cy="-99.4" r="2.1" fill="#c084bc" opacity="0.55" />
            <circle cx="24.2" cy="-61.0" r="4.5" fill="#c084bc" opacity="0.72" />
            <circle cx="34.9" cy="-84.9" r="4.3" fill="#5f4a72" opacity="0.69" />
            <circle cx="39.6" cy="-77.6" r="4.0" fill="#7e5a8c" opacity="0.59" />
            <circle cx="72.4" cy="-88.4" r="4.7" fill="#e879a8" opacity="0.89" />
            <circle cx="57.5" cy="-73.6" r="4.0" fill="#7e5a8c" opacity="0.64" />
            <circle cx="61.3" cy="-58.7" r="3.5" fill="#5f4a72" opacity="0.69" />
            <circle cx="73.4" cy="-62.7" r="2.0" fill="#7e5a8c" opacity="0.57" />
            <circle cx="32.1" cy="-43.0" r="2.2" fill="#9d7bab" opacity="0.9" />
            <circle cx="62.0" cy="-80.3" r="3.8" fill="#c084bc" opacity="0.88" />
            <circle cx="14.3" cy="-66.4" r="2.1" fill="#9d7bab" opacity="0.68" />
            <circle cx="19.5" cy="-78.9" r="3.5" fill="#9d7bab" opacity="0.71" />
            <circle cx="57.6" cy="-86.6" r="2.7" fill="#c084bc" opacity="0.88" />
          </g>
          <g id="live-rock-2" transform="translate(420, ${bottomY})">
            <path d="M 41.8,-26.0 Q 41.8,-26.0 37.1,-16.4 Q 32.4,-6.8 19.8,-2.1 Q 7.2,2.6 -3.0,-3.6 Q -13.2,-9.9 -23.4,-13.6 Q -33.5,-17.4 -32.1,-25.6 Q -30.6,-33.9 -24.0,-40.5 Q -17.3,-47.1 -6.3,-46.0 Q 4.7,-44.9 13.2,-41.9 Q 21.7,-38.9 31.8,-32.4 Z" fill="#6d5280" />
            <circle cx="-10.2" cy="-23.9" r="2.8" fill="#7e5a8c" opacity="0.54" />
            <circle cx="18.0" cy="-27.2" r="1.7" fill="#c084bc" opacity="0.64" />
            <circle cx="23.9" cy="-20.9" r="3.1" fill="#9d7bab" opacity="0.75" />
            <circle cx="14.4" cy="-27.5" r="3.6" fill="#5f4a72" opacity="0.89" />
            <circle cx="-6.0" cy="-9.0" r="3.1" fill="#c084bc" opacity="0.57" />
            <circle cx="-25.7" cy="-24.5" r="3.4" fill="#9d7bab" opacity="0.57" />
            <circle cx="5.9" cy="-19.1" r="3.7" fill="#9d7bab" opacity="0.73" />
            <circle cx="14.1" cy="-21.5" r="3.1" fill="#e879a8" opacity="0.61" />
            <circle cx="-6.7" cy="-28.4" r="3.9" fill="#e879a8" opacity="0.62" />
            <circle cx="3.4" cy="-36.8" r="2.3" fill="#7e5a8c" opacity="0.75" />
            <circle cx="19.0" cy="-16.0" r="2.9" fill="#5f4a72" opacity="0.72" />
            <circle cx="18.0" cy="-31.7" r="4.1" fill="#9d7bab" opacity="0.68" />
            <circle cx="21.1" cy="-23.4" r="2.6" fill="#9d7bab" opacity="0.82" />
            <circle cx="-11.8" cy="-41.9" r="3.7" fill="#7e5a8c" opacity="0.72" />
            <circle cx="24.6" cy="-27.0" r="2.5" fill="#c084bc" opacity="0.7" />
            <circle cx="11.7" cy="-24.4" r="3.0" fill="#c084bc" opacity="0.88" />
            <circle cx="1.7" cy="-21.7" r="3.0" fill="#9d7bab" opacity="0.78" />
            <circle cx="-10.6" cy="-28.3" r="1.9" fill="#9d7bab" opacity="0.86" />
            <circle cx="-13.2" cy="-23.3" r="3.9" fill="#9d7bab" opacity="0.86" />
            <circle cx="-6.1" cy="-34.3" r="3.4" fill="#9d7bab" opacity="0.72" />
            <circle cx="-11.5" cy="-22.7" r="3.8" fill="#e879a8" opacity="0.72" />
            <circle cx="3.7" cy="-30.0" r="3.2" fill="#5f4a72" opacity="0.89" />
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
        <g transform="translate(225, ${bottomY - 40}) scale(1.3)">
          <ellipse cx="0" cy="0" rx="11" ry="5" fill="#ef4444" />
          <path d="M -10,0 Q -17,-4, -20,0 Q -17,4, -10,0 Z" fill="#dc2626" />
          <line x1="10" y1="-2" x2="22" y2="-10" stroke="#fca5a5" stroke-width="1" />
        </g>
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
          <path d="M -3,-19 Q 3,-24 9,-21 Q 5,-17 3,-13 Z" fill="#1e3a8a" opacity="0.7" />
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
          <path d="M -6,-19 Q 4,-25 12,-20 Q 6,-16 2,-12 Z" fill="#f97316" opacity="0.9" stroke="#c2410c" stroke-width="0.6" />
          <path d="M -4,18 Q 4,25 12,20 Q 6,15 2,11 Z" fill="#f97316" opacity="0.9" stroke="#c2410c" stroke-width="0.6" />
          <path d="M 18,-3 Q 26,-1 27,0 Q 26,1 18,3 Z" fill="#fbbf24" />
          <path d="M 10,-16 L 16,-15 L 15,16 L 9,16 Z" fill="#1f2937" opacity="0.85" />
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
            <path d="M 0,4 C -9,1 -21,1 -31,6 C -23,9 -19,13 -18,18 C -25,23 -31,30 -33,38 C -24,35 -18,29 -12,24 C -11,31 -8,39 -1,44 C 3,35 3,26 2,17 C 8,22 14,25 22,25 C 14,19 6,11 0,4 Z" fill="${fish.color}" opacity="0.98" />
          </g>
          <circle cx="10" cy="0" r="19" fill="${fish.color}" />
          <ellipse cx="6" cy="-6" rx="12" ry="7" fill="#ffffff" opacity="0.4" />
          <path d="M 2,-16 Q 8,-24 16,-21 Q 10,-16 8,-11 Z" fill="${fish.color}" opacity="0.85" />
          ${isDead
            ? svg`<line x1="18" y1="-5" x2="24" y2="1" stroke="#ffffff" stroke-width="2" />`
            : svg`<circle cx="21" cy="-2" r="3.6" fill="#ffffff" /><circle cx="22.2" cy="-2" r="1.8" fill="#0f172a" />`}
        `;
      } else if (fish.species === 1) {
        bodySvg = svg`
          <g transform="translate(-16, 0) rotate(${tailWag})">
            <path d="M 0,0 L -48,-19 L -30,-1 Z" fill="${fish.color}" opacity="0.92" />
            <path d="M 0,0 L -48,19 L -30,1 Z" fill="${fish.color}" opacity="0.8" />
            <path d="M -22,-9 L -34,-11 L -24,-2 Z" fill="${fish.color}" opacity="0.7" />
          </g>
          <path d="M -14,0 C -14,-11 -6,-19 8,-19 C 20,-19 27,-11 27,0 C 27,10 20,17 8,17 C -6,17 -14,10 -14,0 Z" fill="${fish.color}" />
          <ellipse cx="4" cy="-6" rx="12" ry="6" fill="#ffffff" opacity="0.35" />
          <path d="M -2,-19 Q 4,-27 13,-24 Q 7,-19 5,-14 Z" fill="${fish.color}" opacity="0.85" />
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
          <ellipse cx="0" cy="-4" rx="14" ry="8" fill="#ffffff" opacity="0.35" />
          <circle cx="16" cy="-8" r="8.5" fill="${fish.color}" opacity="0.95" />
          <circle cx="22" cy="0" r="6.5" fill="${fish.color}" opacity="0.85" />
          <circle cx="15" cy="7" r="5.5" fill="${fish.color}" opacity="0.75" />
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
          <line x1="-10" y1="-12" x2="-10" y2="12" stroke="#0f172a" stroke-width="2.5" />
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
                <line x1="7" y1="-14" x2="3" y2="14" stroke="#f1f5f9" stroke-width="2.2" stroke-linecap="round" />
                <line x1="-1" y1="-16" x2="-5" y2="16" stroke="#f1f5f9" stroke-width="2.2" stroke-linecap="round" />
                <line x1="-9" y1="-13" x2="-13" y2="13" stroke="#f1f5f9" stroke-width="1.8" stroke-linecap="round" />
                <line x1="-17" y1="-10" x2="-20" y2="10" stroke="#f1f5f9" stroke-width="1.5" stroke-linecap="round" />
                <line x1="-28" y1="0" x2="-44" y2="-14" stroke="#f1f5f9" stroke-width="2" stroke-linecap="round" />
                <line x1="-28" y1="0" x2="-46" y2="0" stroke="#f1f5f9" stroke-width="1.8" stroke-linecap="round" />
                <line x1="-28" y1="0" x2="-44" y2="14" stroke="#f1f5f9" stroke-width="2" stroke-linecap="round" />
              </g>
            `
          : ""}
      </g>
    `;
  }

  _renderAncistrus(isDead) {
    if (!this._ancistrus) return svg``;
    const anc = this._ancistrus;
    const p = anc.deathProgress || 0;
    const bodyOpacity = (1.0 - p).toFixed(2);
    const skeletonOpacity = p.toFixed(2);
    const mouthPulse = isDead ? 1 : (1 + Math.sin(this._animTime * 5) * 0.12).toFixed(3);

    return svg`
      <g transform="translate(${anc.x}, ${anc.y}) scale(0.99, 0.99)">
        <g opacity="${bodyOpacity}">
          <path d="M -6,55 C -8,63 -6,71 -2,76 L 2,76 C 6,71 8,63 6,55 Z" fill="#3f3524" stroke="#2a2417" stroke-width="0.8" />
          <rect x="-5" y="59" width="4" height="4" fill="#5c4d33" opacity="0.7" />
          <rect x="1" y="64" width="4" height="4" fill="#5c4d33" opacity="0.7" />
          <rect x="-4" y="69" width="3.5" height="4" fill="#5c4d33" opacity="0.6" />

          <path d="M -8,34 L -22,50 L -20,56 L -6,44 Z" fill="#4b3f28" opacity="0.9" stroke="#2a2417" stroke-width="0.6" />
          <path d="M -19,51 L -18,42 M -17,53 L -15,43 M -14,54 L -11,45" stroke="#6b5b3a" stroke-width="0.5" opacity="0.8" />
          <path d="M 8,34 L 22,50 L 20,56 L 6,44 Z" fill="#4b3f28" opacity="0.9" stroke="#2a2417" stroke-width="0.6" />
          <path d="M 19,51 L 18,42 M 17,53 L 15,43 M 14,54 L 11,45" stroke="#6b5b3a" stroke-width="0.5" opacity="0.8" />

          <path d="M -14,8 L -38,20 L -34,28 L -12,18 Z" fill="#4b3f28" stroke="#2a2417" stroke-width="0.7" />
          <path d="M -34,22 L -16,12 M -31,25 L -14,15 M -28,27 L -13,17" stroke="#6b5b3a" stroke-width="0.6" opacity="0.85" />
          <path d="M 14,8 L 38,20 L 34,28 L 12,18 Z" fill="#4b3f28" stroke="#2a2417" stroke-width="0.7" />
          <path d="M 34,22 L 16,12 M 31,25 L 14,15 M 28,27 L 13,17" stroke="#6b5b3a" stroke-width="0.6" opacity="0.85" />

          <path d="M -13,40 C -17,24 -16,5 -10,-10 C -5,-20 5,-20 10,-10 C 16,5 17,24 13,40 C 12,46 9,51 6,55 L -6,55 C -9,51 -12,46 -13,40 Z" fill="#4a3f28" stroke="#2a2417" stroke-width="1" />
          <ellipse cx="-4" cy="8" rx="2" ry="1.6" fill="#2a2417" opacity="0.5" />
          <ellipse cx="5" cy="-2" rx="2.2" ry="1.7" fill="#2a2417" opacity="0.5" />
          <ellipse cx="-2" cy="-10" rx="1.8" ry="1.4" fill="#2a2417" opacity="0.5" />
          <ellipse cx="6" cy="16" rx="2" ry="1.6" fill="#2a2417" opacity="0.4" />
          <ellipse cx="-6" cy="24" rx="1.9" ry="1.5" fill="#2a2417" opacity="0.4" />
          <ellipse cx="0" cy="34" rx="2.1" ry="1.6" fill="#2a2417" opacity="0.4" />
          <ellipse cx="-3" cy="45" rx="1.8" ry="1.4" fill="#2a2417" opacity="0.35" />

          <path d="M -14,-10 C -18,-18 -14,-26 -4,-29 C 2,-31 6,-31 10,-29 C 18,-26 20,-18 15,-10 C 10,-4 -8,-4 -14,-10 Z" fill="#3f3524" stroke="#2a2417" stroke-width="1" />

          ${isDead
            ? svg`<line x1="-8" y1="-21" x2="-4" y2="-19" stroke="#ffffff" stroke-width="1" /><line x1="4" y1="-21" x2="8" y2="-19" stroke="#ffffff" stroke-width="1" />`
            : svg`
                <circle cx="-6" cy="-20" r="1.8" fill="#0f172a" stroke="#92400e" stroke-width="0.4" />
                <circle cx="7" cy="-20" r="1.8" fill="#0f172a" stroke="#92400e" stroke-width="0.4" />
                <circle cx="-5.6" cy="-20.5" r="0.5" fill="#fef9c3" />
                <circle cx="7.4" cy="-20.5" r="0.5" fill="#fef9c3" />
              `}

          <g transform="translate(0.5,-16) scale(${mouthPulse},${mouthPulse}) translate(-0.5,16)">
            <ellipse cx="0.5" cy="-16" rx="7.5" ry="6" fill="#1c1917" stroke="#0f0d0c" stroke-width="0.8" />
            <ellipse cx="0.5" cy="-16" rx="5.2" ry="4.2" fill="#3f3524" />
            <ellipse cx="0.5" cy="-16" rx="2.6" ry="2" fill="#1c1917" />
          </g>
        </g>
        ${p > 0
          ? svg`
              <g opacity="${skeletonOpacity}">
                <line x1="0" y1="-29" x2="0" y2="68" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round" />
                <circle cx="0" cy="-22" r="5" fill="#f1f5f9" />
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
        <path d="M -28,-9 C -18,-13 -4,-13 4,-8 C 10,-5 14,-1 17,5" stroke="#ef4444" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6" />
        <circle cx="-22" cy="-8" r="1.5" fill="#fef2f2" />
        <circle cx="-14" cy="-11" r="1.4" fill="#fef2f2" />
        <circle cx="-6" cy="-10" r="1.5" fill="#fef2f2" />
        <circle cx="1" cy="-7" r="1.3" fill="#fef2f2" />
        <circle cx="-18" cy="-2" r="1.3" fill="#fef2f2" />
        <circle cx="-9" cy="-2" r="1.4" fill="#fef2f2" />
        <circle cx="0" cy="0" r="1.3" fill="#fef2f2" />
        <circle cx="7" cy="2" r="1.3" fill="#fef2f2" />
        <circle cx="-14" cy="5" r="1.2" fill="#fef2f2" />
        <circle cx="-5" cy="7" r="1.2" fill="#fef2f2" />
        <circle cx="13" cy="8" r="1.1" fill="#fef2f2" />
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
        <circle cx="-8" cy="0" r="1.6" fill="#7c2d12" opacity="0.4" />
        <circle cx="6" cy="-4" r="1.4" fill="#7c2d12" opacity="0.4" />
        <circle cx="2" cy="6" r="1.5" fill="#7c2d12" opacity="0.4" />
        <circle cx="-4" cy="8" r="1.2" fill="#7c2d12" opacity="0.3" />
        <path d="M -6,-13 L -7,-19" stroke="#9a3412" stroke-width="1.4" stroke-linecap="round" />
        <path d="M 6,-13 L 7,-19" stroke="#9a3412" stroke-width="1.4" stroke-linecap="round" />
        ${isDead
          ? svg`<line x1="-9" y1="-21" x2="-5" y2="-19" stroke="#ffffff" stroke-width="1" /><line x1="5" y1="-21" x2="9" y2="-19" stroke="#ffffff" stroke-width="1" />`
          : svg`
              <circle cx="-7.2" cy="-20" r="2" fill="#0f172a" />
              <circle cx="7.2" cy="-20" r="2" fill="#0f172a" />
              <circle cx="-7.8" cy="-20.6" r="0.6" fill="#fecaca" />
              <circle cx="6.6" cy="-20.6" r="0.6" fill="#fecaca" />
            `}
      </g>
    `;
  }

  _renderStatusPanel(currentTemp, currentVolume, isFullscreen, canvasH) {
    const showTemp = currentTemp > 0;
    const lineCount = showTemp ? 2 : 1;
    const panelH = lineCount === 2 ? 56 : 34;
    const panelW = 150;
    const topMargin = isFullscreen ? 16 : 28;
    const x = (isFullscreen ? 1024 : 1012) - panelW - 16;
    const y = topMargin;
    const volLine = showTemp ? 38 : 17;

    return svg`
      <g transform="translate(${x}, ${y})">
        <rect x="0" y="0" width="${panelW}" height="${panelH}" rx="7" fill="#111827" stroke="#4b5563" stroke-width="2" />
        <circle cx="8" cy="8" r="2" fill="#374151" />
        <circle cx="${panelW - 8}" cy="8" r="2" fill="#374151" />
        <rect x="7" y="7" width="${panelW - 14}" height="${panelH - 14}" rx="3" fill="#0a0f1a" />

        ${showTemp
          ? svg`
              <rect x="15" y="14" width="5" height="16" rx="2.5" fill="#4ade80" opacity="0.9" />
              <circle cx="17.5" cy="31" r="4" fill="#4ade80" opacity="0.9" />
              <text x="27" y="27" font-family="monospace" font-size="13" font-weight="700" fill="#4ade80">${currentTemp.toFixed(1)}°C</text>
            `
          : ""}

        <path d="M 17.5,${volLine} C 21,${volLine + 4} 21,${volLine + 8} 17.5,${volLine + 10} C 14,${volLine + 8} 14,${volLine + 4} 17.5,${volLine} Z" fill="#4ade80" opacity="0.9" />
        <text x="27" y="${volLine + 8}" font-family="monospace" font-size="13" font-weight="700" fill="#4ade80">${currentVolume.toFixed(1)} L</text>
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
                ${this._snails.map((snail) => {
                  const rotation =
                    snail.type === "glass_left"
                      ? 90
                      : snail.type === "glass_right"
                      ? -90
                      : 0;
                  return svg`
                    <g transform="translate(${snail.x}, ${snail.y}) rotate(${rotation}) scale(${snail.dir * 1.8}, 1.8)">
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

              ${themeKey === "freshwater" ? this._renderAncistrus(isDead) : ""}
              ${themeKey === "saltwater" ? this._renderShrimp(isDead) : ""}
              ${themeKey === "saltwater" ? this._renderCrab(isDead) : ""}
              ${this._renderAlgae(effectiveAlgaeHours, isFullscreen)}
              ${this._renderStatusPanel(currentTemp, currentVolume, isFullscreen, canvasH)}
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
