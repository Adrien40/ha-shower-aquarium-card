import { LitElement, html, css, svg } from "./lit-element-bundle.min.js";

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
      vy: 0.12,
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

  _generateDefaultFishes(count, themeKey) {
    const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.freshwater;
    const n = Math.min(10, Math.max(1, Number(count) || 4));
    const sizePresets = [1.35, 1.65, 1.20, 1.85, 1.45, 1.60, 1.25, 1.75, 1.30, 1.50];

    return Array.from({ length: n }, (_, index) => ({
      species: index % 4,
      color: theme.palette[index % theme.palette.length],
      scale: sizePresets[index % sizePresets.length],
      phase: index * 0.9,
      x: 120 + (index * 760) / Math.max(1, n - 1),
      y: 160 + (index % 3) * 90,
      vx: 1.38 - (sizePresets[index % sizePresets.length] - 1.2) * 0.2,
      vy: 0.45 * (index % 2 === 0 ? 1 : -1),
      dir: index % 2 === 0 ? 1 : -1,
      deathProgress: 0,
    }));
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
      this._fishes = config.fishes.map((fish, index) => ({
        species: index % 4,
        color: fish.color || theme.palette[index % theme.palette.length],
        scale: fish.scale || sizePresets[index % sizePresets.length],
        phase: index * 0.9,
        x: 140 + index * 150,
        y: 180 + (index % 2) * 90,
        vx: 1.3 + (index % 3) * 0.15,
        vy: 0.45 * (index % 2 === 0 ? 1 : -1),
        dir: index % 2 === 0 ? 1 : -1,
        deathProgress: 0,
      }));
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
        const minY = Math.max(tankTop + 45, waterSurfaceY + 35);
        const maxY = tankBottom - 45;

        fish.x += fish.vx * fish.dir * speedMultiplier * delta;
        fish.y += fish.vy * speedMultiplier * delta;

        if (fish.x < 110) {
          fish.x = 110;
          fish.dir = 1;
        } else if (fish.x > 910) {
          fish.x = 910;
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
        const minVY = Math.max(tankTop + 60, waterSurfaceY + 50);
        const maxVY = tankBottom - 60;

        this._ancistrus.y += this._ancistrus.vy * this._ancistrus.dir * Math.min(userSpeed, 1.5) * delta;
        if (this._ancistrus.y < minVY) {
          this._ancistrus.y = minVY;
          this._ancistrus.dir = 1;
        } else if (this._ancistrus.y > maxVY) {
          this._ancistrus.y = maxVY;
          this._ancistrus.dir = -1;
        }
        this._ancistrus.x = 65;
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
          <g transform="translate(260, ${bottomY - 25}) scale(1.45)">
            <path d="M 14,-8 Q 38,-35, 70,-45" stroke="#ffffff" stroke-width="1.4" fill="none" />
            <path d="M 14,-5 Q 45,-20, 75,-24" stroke="#ffffff" stroke-width="1.4" fill="none" />
            <path d="M 14,-2 Q 45,-3, 72, 3" stroke="#ffffff" stroke-width="1.4" fill="none" />
            <ellipse cx="0" cy="-3" rx="18" ry="8" fill="#dc2626" />
            <path d="M -15,-3 Q -28,-8, -34,-3 Q -28,3, -15,3 Z" fill="#b91c1c" />
            <circle cx="2" cy="-6" r="1.4" fill="#ffffff" />
            <circle cx="7" cy="-3" r="1.4" fill="#ffffff" />
            <circle cx="0" cy="0" r="1.4" fill="#ffffff" />
            <path d="M -8,5 L -10,16 L -6,22" stroke="#ffffff" stroke-width="1.4" fill="none" />
            <path d="M 0,5 L 0,16 L 4,22" stroke="#ffffff" stroke-width="1.4" fill="none" />
            <path d="M 8,5 L 10,16 L 14,22" stroke="#ffffff" stroke-width="1.4" fill="none" />
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
          <path d="M 110 ${bottomY - 25} Q 85 ${bottomY - 195}, 125 ${bottomY - 295} Q 155 ${bottomY - 185}, 135 ${bottomY - 25} Z" fill="#0d9488" opacity="0.9" />
          <path d="M 145 ${bottomY - 25} Q 180 ${bottomY - 175}, 150 ${bottomY - 265} Q 125 ${bottomY - 155}, 155 ${bottomY - 25} Z" fill="#14b8a6" opacity="0.75" />
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
      if (fish.species === 0 || fish.species === 1) {
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
      } else if (fish.species === 2) {
        bodySvg = svg`
          <g transform="translate(-24, 0) rotate(${tailWag})">
            <polygon points="0,0 -19,-12 -14,0 -19,12" fill="#facc15" stroke="#0f172a" stroke-width="1.2" />
          </g>
          <ellipse cx="0" cy="0" rx="26" ry="18" fill="#2563eb" />
          <path d="M -18,-7 Q 6,-18, 14,-2 Q 6,2, -18,10 Z" fill="#0f172a" />
          ${isDead
            ? svg`<line x1="14" y1="-7" x2="20" y2="-1" stroke="#ffffff" stroke-width="2" />`
            : svg`<circle cx="17" cy="-5" r="3.2" fill="#ffffff" /><circle cx="18" cy="-5" r="1.5" fill="#0f172a" />`}
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
      bodySvg = svg`
        <g transform="translate(-20, 0) rotate(${tailWag * 1.3})">
          <path d="M 0,-3 C -22,-30 -42,-15 -30,0 C -42,15 -22,30 0,3 Z" fill="${fish.color}" opacity="0.75" />
          <path d="M 0,0 C -15,-22 -34,-8 -22,0 C -34,8 -15,22 0,0 Z" fill="#ffffff" opacity="0.6" />
        </g>
        <ellipse cx="2" cy="0" rx="25" ry="19" fill="${fish.color}" />
        ${isDead
          ? svg`<line x1="16" y1="-7" x2="22" y2="-1" stroke="#ffffff" stroke-width="2" />`
          : svg`<circle cx="18" cy="-5" r="4.0" fill="#ffffff" /><circle cx="19" cy="-5" r="1.9" fill="#0f172a" />`}
        <g transform="translate(8, 5) rotate(${finWag})">
          <ellipse cx="0" cy="6" rx="5" ry="11" fill="${fish.color}" opacity="0.8" />
        </g>
      `;
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

    return svg`
      <g transform="translate(${anc.x}, ${anc.y}) scale(1.6, 1.6)">
        <g opacity="${bodyOpacity}">
          <path d="M -10,-24 Q -14,-32 -8,-28 Q -4,-35 0,-28 Q 4,-35 8,-28 Q 14,-32 10,-24 Z" fill="#151b22" stroke="#facc15" stroke-width="0.5" />
          <ellipse cx="0" cy="-22" rx="9" ry="7.5" fill="#293542" stroke="#facc15" stroke-width="1.0" />
          <ellipse cx="0" cy="-22" rx="5" ry="4" fill="#111827" />
          <ellipse cx="0" cy="-22" rx="2" ry="1.5" fill="#facc15" />
          <path d="M -16,-16 C -20,-10 -22,0 -16,8 C -14,14 -12,22 -8,32 L 8,32 C 12,22 14,14 16,8 C 22,0 20,-10 16,-16 Z" fill="#182026" stroke="#0a0f14" stroke-width="0.8" />
          <path d="M -16,-4 L -32,-12 Q -26,-2 -16,4 Z" fill="#182026" stroke="#293542" stroke-width="0.6" />
          <path d="M 16,-4 L 32,-12 Q 26,-2 16,4 Z" fill="#182026" stroke="#293542" stroke-width="0.6" />
          <path d="M -10,14 L -22,24 Q -16,18 -8,18 Z" fill="#151b22" stroke="#293542" stroke-width="0.5" />
          <path d="M 10,14 L 22,24 Q 16,18 8,18 Z" fill="#151b22" stroke="#293542" stroke-width="0.5" />
          <path d="M -8,32 Q -4,45 -2,55 L 2,55 Q 4,45 8,32 Z" fill="#151b22" />
          <path d="M -2,55 Q 0,62 2,55" stroke="#ffffff" stroke-width="1.2" fill="none" />
          <circle cx="-6" cy="-4" r="0.8" fill="#ffffff" />
          <circle cx="6" cy="-4" r="0.8" fill="#ffffff" />
          <circle cx="-4" cy="4" r="0.8" fill="#ffffff" />
          <circle cx="4" cy="4" r="0.8" fill="#ffffff" />
          <circle cx="-3" cy="12" r="0.8" fill="#ffffff" />
          <circle cx="3" cy="12" r="0.8" fill="#ffffff" />
          ${isDead ? svg`<line x1="-4" y1="0" x2="4" y2="8" stroke="#ffffff" stroke-width="1.5" />` : svg``}
        </g>
        ${p > 0
          ? svg`
              <g opacity="${skeletonOpacity}">
                <line x1="0" y1="-20" x2="0" y2="40" stroke="#f1f5f9" stroke-width="2.5" />
                <circle cx="0" cy="0" r="4" fill="#f1f5f9" />
              </g>
            `
          : ""}
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
                        y="${waterSurfaceY}"
                        width="${isFullscreen ? 1024 : 1000}"
                        height="${tankBottom - waterSurfaceY}"
                        fill="url(#waterGrad)"
                      />
                      <line
                        x1="${isFullscreen ? 0 : 12}"
                        y1="${waterSurfaceY}"
                        x2="${isFullscreen ? 1024 : 1012}"
                        y2="${waterSurfaceY}"
                        stroke="#ffffff"
                        stroke-width="3"
                        stroke-opacity="0.85"
                      />
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
              ${this._renderAlgae(effectiveAlgaeHours, isFullscreen)}
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

window.customCards = window.customCards || [];
window.customNames = window.customNames || [];
window.customCards.push({
  type: "shower-aquarium-card",
  name: "Shower Aquarium Card",
  preview: true,
  description: "An animated aquarium dashboard card reflecting shower water usage.",
});
