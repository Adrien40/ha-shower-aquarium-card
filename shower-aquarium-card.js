import {
  LitElement,
  html,
  css,
  svg,
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

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
    field_aspect_ratio: "Aquarium aspect ratio",
    field_fish_count: "Number of fishes",
    field_target_budget_entity: "Target entity (sensor / input_number)",
    field_target_budget: "Shower target budget (L)",
    field_survival_volume: "Survival reserve (L)",
    field_temp_boil: "Boiling temperature threshold (°C)",
    field_temp_deadly: "Deadly temperature threshold (°C)",
    field_algae_enabled: "Enable 24h dirty algae accumulation",
    field_fullscreen: "Fullscreen mode",
    helper_fullscreen: "Tablet, Nest Hub...",
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
    field_aspect_ratio: "Format / Ratio de l'aquarium",
    field_fish_count: "Nombre de poissons",
    field_target_budget_entity: "Entité d'objectif (sensor / input_number)",
    field_target_budget: "Objectif de la douche (L)",
    field_survival_volume: "Volume de survie (L)",
    field_temp_boil: "Seuil d'ébullition (°C)",
    field_temp_deadly: "Seuil mortel de température (°C)",
    field_algae_enabled: "Activer l'accumulation d'algues après 24h sans douche",
    field_fullscreen: "Mode plein écran",
    helper_fullscreen: "Tablette, Nest Hub...",
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
    palette: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"],
  },
  saltwater: {
    waterTop: "#06b6d4",
    waterBottom: "#0e7490",
    sandColor: "#fef08a",
    background: "#ecfeff",
    palette: ["#f97316", "#eab308", "#3b82f6", "#a855f7", "#ec4899", "#14b8a6"],
  },
  coldwater: {
    waterTop: "#67e8f9",
    waterBottom: "#0891b2",
    sandColor: "#cbd5e1",
    background: "#f8fafc",
    palette: ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#ffffff", "#e2e8f0"],
  },
};

const CARD_EDITOR_SCHEMA = [
  {
    name: "entity",
    required: true,
    selector: { entity: { domain: "sensor" } },
  },
  {
    name: "temperature_entity",
    selector: { entity: { domain: "sensor" } },
  },
  {
    name: "title",
    selector: { text: {} },
  },
  {
    name: "theme",
    default: "freshwater",
    selector: {
      select: {
        options: [
          { value: "freshwater", label: "Freshwater (Tropical)" },
          { value: "saltwater", label: "Saltwater (Reef)" },
          { value: "coldwater", label: "Coldwater (Goldfish)" },
        ],
      },
    },
  },
  {
    name: "aspect_ratio",
    default: "1024/600",
    selector: {
      select: {
        options: [
          { value: "1024/600", label: "1024 x 600 (Tablet / Hub)" },
          { value: "16/9", label: "16 : 9 (Widescreen)" },
          { value: "16/10", label: "16 : 10" },
          { value: "4/3", label: "4 : 3 (Standard)" },
          { value: "21/9", label: "21 : 9 (Ultrawide)" },
        ],
      },
    },
  },
  {
    name: "fish_count",
    default: 4,
    selector: {
      number: {
        min: 1,
        max: 8,
        mode: "slider",
      },
    },
  },
  {
    name: "target_budget_entity",
    selector: {
      entity: {
        domain: ["input_number", "number", "sensor"],
      },
    },
  },
  {
    name: "target_budget",
    default: 50,
    selector: {
      number: {
        min: 1,
        max: 500,
        unit_of_measurement: "L",
        mode: "box",
      },
    },
  },
  {
    name: "survival_volume",
    default: 10,
    selector: {
      number: {
        min: 1,
        max: 100,
        unit_of_measurement: "L",
        mode: "box",
      },
    },
  },
  {
    name: "temp_boiling_threshold",
    default: 40,
    selector: {
      number: {
        min: 25,
        max: 60,
        unit_of_measurement: "°C",
        mode: "box",
      },
    },
  },
  {
    name: "temp_deadly_threshold",
    default: 45,
    selector: {
      number: {
        min: 30,
        max: 70,
        unit_of_measurement: "°C",
        mode: "box",
      },
    },
  },
  {
    name: "algae_enabled",
    default: true,
    selector: { boolean: {} },
  },
  {
    name: "fullscreen",
    default: false,
    selector: { boolean: {} },
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
      aspect_ratio: dict.field_aspect_ratio,
      fish_count: dict.field_fish_count,
      target_budget_entity: dict.field_target_budget_entity,
      target_budget: dict.field_target_budget,
      survival_volume: dict.field_survival_volume,
      temp_boiling_threshold: dict.field_temp_boil,
      temp_deadly_threshold: dict.field_temp_deadly,
      algae_enabled: dict.field_algae_enabled,
      fullscreen: dict.field_fullscreen,
    };
    return map[schema.name] || schema.name;
  }

  _computeHelper(schema) {
    const lang = this.hass?.language === "fr" ? "fr" : "en";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    if (schema.name === "fullscreen") {
      return dict.helper_fullscreen;
    }
    return "";
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }
    const newConfig = { ...ev.detail.value };
    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

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
      entities.find((e) => e.includes("temperature") && (e.includes("shower") || e.includes("hydrao"))) ||
      "";
    return {
      entity: defaultEntity,
      temperature_entity: tempEntity,
      title: "",
      theme: "freshwater",
      aspect_ratio: "1024/600",
      fish_count: 4,
      target_budget: 50,
      survival_volume: 10,
      temp_boiling_threshold: 40,
      temp_deadly_threshold: 45,
      algae_enabled: true,
      fullscreen: false,
    };
  }

  constructor() {
    super();
    this._animationFrameId = null;
    this._lastTimestamp = 0;
    this._cachedConsumedVolume = 0;
    this._cachedTemperature = 0;
    this._cachedTargetBudget = 50;
    this._cachedSurvivalVolume = 10;
    this._cachedHoursSinceLastShower = 0;
    this._fishes = this._generateDefaultFishes(4, "freshwater");
    this._snails = [
      { x: 180, y: 532, vx: 0.16, dir: 1, color: "#854d0e" },
      { x: 820, y: 532, vx: 0.12, dir: -1, color: "#a16207" },
    ];
    this._bubbles = [
      { x: 220, y: 500, vy: 1.2, r: 3.5 },
      { x: 235, y: 520, vy: 1.5, r: 2.5 },
      { x: 512, y: 510, vy: 1.1, r: 4.0 },
      { x: 780, y: 530, vy: 1.3, r: 3.0 },
      { x: 795, y: 490, vy: 1.6, r: 2.0 },
    ];
    this._boilingBubbles = Array.from({ length: 18 }, (_, i) => ({
      x: 60 + Math.random() * 900,
      y: 100 + Math.random() * 420,
      vy: 3.5 + Math.random() * 4.0,
      vx: (Math.random() - 0.5) * 1.5,
      r: 3 + Math.random() * 6,
    }));
  }

  static get styles() {
    return css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
      }
      ha-card {
        padding: 16px;
        background: var(--card-background-color, #ffffff);
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        height: 100%;
      }
      :host([fullscreen]) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        z-index: 1;
      }
      :host([fullscreen]) ha-card {
        padding: 0;
        margin: 0;
        border-radius: 0;
        box-shadow: none;
        height: 100vh;
        width: 100vw;
        border: none;
        background: #020617;
        justify-content: center;
        align-items: center;
      }
      .card-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
      }
      .card-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-text-color, #1f2937);
      }
      .aquarium-container {
        position: relative;
        width: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      :host([fullscreen]) .aquarium-container {
        width: 100vw;
        height: 100vh;
        max-width: 100%;
        padding: 0;
        margin: 0;
      }
      svg {
        width: 100%;
        height: 100%;
        max-height: calc(100vh - 120px);
        display: block;
      }
      :host([fullscreen]) svg {
        width: 100vw;
        height: 100vh;
        max-height: 100vh;
        aspect-ratio: auto !important;
      }
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 12px;
        margin-top: 10px;
        text-align: center;
      }
      .metric-box {
        background-color: var(--secondary-background-color, #f3f4f6);
        padding: 10px 6px;
        border-radius: 10px;
      }
      .metric-value {
        font-size: 1.35rem;
        font-weight: 700;
        color: var(--primary-text-color, #111827);
      }
      .metric-unit {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--secondary-text-color, #6b7280);
      }
      .metric-label {
        font-size: 0.8rem;
        color: var(--secondary-text-color, #6b7280);
        margin-top: 2px;
      }
    `;
  }

  _t(key) {
    const lang = this._hass?.language === "fr" ? "fr" : "en";
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
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
        this._cachedHoursSinceLastShower = Math.max(0, (now - lastTime) / (1000 * 60 * 60));
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
    const n = Math.min(8, Math.max(1, Number(count) || 4));
    return Array.from({ length: n }, (_, index) => ({
      color: theme.palette[index % theme.palette.length],
      x: 140 + (index * 740) / Math.max(1, n - 1),
      y: 260 + (index % 3) * 60,
      vx: 1.6 + (index % 3) * 0.4,
      vy: 0.7 * (index % 2 === 0 ? 1 : -1),
      dir: index % 2 === 0 ? 1 : -1,
    }));
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Please define a valid entity.");
    }
    this._config = {
      title: "",
      theme: "freshwater",
      aspect_ratio: "1024/600",
      fish_count: 4,
      target_budget: 50,
      survival_volume: 10,
      temp_boiling_threshold: 40,
      temp_deadly_threshold: 45,
      algae_enabled: true,
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
      this._fishes = config.fishes.map((fish, index) => ({
        color: fish.color || theme.palette[index % theme.palette.length],
        x: 160 + index * 180,
        y: 280 + (index % 2) * 80,
        vx: 1.6 + (index % 3) * 0.4,
        vy: 0.7 * (index % 2 === 0 ? 1 : -1),
        dir: index % 2 === 0 ? 1 : -1,
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
    const delta = Math.min((timestamp - this._lastTimestamp) / 16.66, 2.0);
    this._lastTimestamp = timestamp;

    const currentVolume = this._cachedConsumedVolume;
    const targetBudget = this._cachedTargetBudget;
    const survivalVolume = this._cachedSurvivalVolume;
    const totalVolume = targetBudget + survivalVolume;
    const currentTemp = this._cachedTemperature;

    const boilTemp = Number(this._config.temp_boiling_threshold) || 40;
    const deadlyTemp = Number(this._config.temp_deadly_threshold) || 45;

    const remainingVolumeInTank = Math.max(0, totalVolume - currentVolume);
    const waterRatio = remainingVolumeInTank / totalVolume;

    const tankTop = 70;
    const tankBottom = 525;
    const tankHeight = tankBottom - tankTop;
    const waterSurfaceY = tankBottom - waterRatio * tankHeight;

    const isHeatDead = currentTemp >= deadlyTemp && currentTemp > 0;
    const isWaterDead = remainingVolumeInTank <= 0;
    const isDead = isHeatDead || isWaterDead;

    const isBoiling = currentTemp >= boilTemp && currentTemp > 0;
    const isStressed = (currentVolume > targetBudget || isBoiling) && !isDead;
    const speedMultiplier = isStressed ? 2.2 : 1.0;

    let stateChanged = false;

    if (this._fishes && this._fishes.length > 0) {
      this._fishes.forEach((fish) => {
        if (isDead) {
          fish.y = Math.min(tankBottom - 20, fish.y + 1.2 * delta);
          stateChanged = true;
          return;
        }

        const minY = Math.max(tankTop + 30, waterSurfaceY + 30);
        const maxY = tankBottom - 30;

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
        snail.x += snail.vx * snail.dir * delta;
        if (snail.x < 90) {
          snail.x = 90;
          snail.dir = 1;
        } else if (snail.x > 930) {
          snail.x = 930;
          snail.dir = -1;
        }
        stateChanged = true;
      });
    }

    if (waterRatio > 0 && !isDead && this._bubbles) {
      this._bubbles.forEach((b) => {
        b.y -= b.vy * delta;
        if (b.y < waterSurfaceY) {
          b.y = 520;
        }
        stateChanged = true;
      });
    }

    if (isBoiling && waterRatio > 0 && this._boilingBubbles) {
      this._boilingBubbles.forEach((b) => {
        b.y -= b.vy * delta;
        b.x += b.vx * delta;
        if (b.y < waterSurfaceY) {
          b.y = tankBottom - 10;
          b.x = 60 + Math.random() * 900;
        }
        stateChanged = true;
      });
    }

    if (stateChanged) {
      this.requestUpdate();
    }
  }

  _renderThemeDecoration(themeKey) {
    if (themeKey === "saltwater") {
      return svg`
        <g>
          <path
            d="M 80 535 Q 70 410, 110 360 Q 130 320, 100 270 Q 140 330, 130 380 Q 150 430, 120 535 Z"
            fill="#f43f5e"
            opacity="0.95"
          />
          <path
            d="M 120 535 Q 150 420, 180 380 Q 200 350, 180 310 Q 210 360, 190 420 Q 170 460, 150 535 Z"
            fill="#fb7185"
            opacity="0.9"
          />
          <path
            d="M 890 535 Q 860 410, 900 330 Q 930 410, 910 535 Z"
            fill="#a855f7"
            opacity="0.95"
          />
          <path
            d="M 910 535 Q 940 430, 930 360 Q 910 450, 935 535 Z"
            fill="#c084fc"
            opacity="0.9"
          />
        </g>
      `;
    }

    if (themeKey === "coldwater") {
      return svg`
        <g>
          <ellipse cx="140" cy="515" rx="42" ry="18" fill="#475569" />
          <ellipse cx="210" cy="520" rx="32" ry="14" fill="#64748b" />
          <ellipse cx="880" cy="518" rx="48" ry="20" fill="#334155" />
          <ellipse cx="810" cy="522" rx="28" ry="12" fill="#64748b" />
          <path
            d="M 110 515 Q 90 390, 120 320 Q 145 400, 130 515 Z"
            fill="#0d9488"
            opacity="0.9"
          />
        </g>
      `;
    }

    return svg`
      <g>
        <path
          d="M 90 535 Q 70 390, 100 300 Q 130 390, 110 535 Z"
          fill="#10b981"
          opacity="0.95"
        />
        <path
          d="M 110 535 Q 140 410, 120 330 Q 100 420, 124 535 Z"
          fill="#059669"
          opacity="0.85"
        />
        <path
          d="M 900 535 Q 930 400, 890 310 Q 870 410, 885 535 Z"
          fill="#10b981"
          opacity="0.95"
        />
      </g>
    `;
  }

  _renderFishShape(fish, themeKey, isDead) {
    const isFlipped = fish.dir === -1;

    if (themeKey === "saltwater") {
      return svg`
        <g transform="scale(${isFlipped ? -1 : 1}, 1)">
          <polygon points="-30,0 -50,-20 -44,0 -50,20" fill="${fish.color}" />
          <polygon points="0,-28 -12,-8 12,-8" fill="${fish.color}" opacity="0.8" />
          <ellipse cx="0" cy="0" rx="30" ry="22" fill="${fish.color}" />
          <path d="M -8,-18 L -8,18" stroke="#ffffff" stroke-width="4.5" />
          <path d="M 8,-20 L 8,20" stroke="#ffffff" stroke-width="4.5" />
          ${isDead
            ? svg`
                <line x1="14" y1="-8" x2="22" y2="0" stroke="#ffffff" stroke-width="2.5" />
                <line x1="22" y1="-8" x2="14" y2="0" stroke="#ffffff" stroke-width="2.5" />
              `
            : svg`
                <circle cx="16" cy="-4" r="5" fill="#ffffff" />
                <circle cx="18" cy="-4" r="2.5" fill="#111827" />
              `}
        </g>
      `;
    }

    if (themeKey === "coldwater") {
      return svg`
        <g transform="scale(${isFlipped ? -1 : 1}, 1)">
          <path
            d="M -24,0 C -48,-24 -56,-8 -40,0 C -56,8 -48,24 -24,0 Z"
            fill="${fish.color}"
            opacity="0.8"
          />
          <ellipse cx="0" cy="0" rx="32" ry="22" fill="${fish.color}" />
          ${isDead
            ? svg`
                <line x1="14" y1="-8" x2="22" y2="0" stroke="#ffffff" stroke-width="2.5" />
                <line x1="22" y1="-8" x2="14" y2="0" stroke="#ffffff" stroke-width="2.5" />
              `
            : svg`
                <circle cx="18" cy="-4" r="5.5" fill="#ffffff" />
                <circle cx="20" cy="-4" r="2.8" fill="#111827" />
              `}
        </g>
      `;
    }

    return svg`
      <g transform="scale(${isFlipped ? -1 : 1}, 1)">
        <polygon points="-28,0 -48,-16 -44,0 -48,16" fill="${fish.color}" />
        <ellipse cx="0" cy="0" rx="28" ry="18" fill="${fish.color}" />
        ${isDead
          ? svg`
              <line x1="12" y1="-8" x2="20" y2="0" stroke="#ffffff" stroke-width="2.5" />
              <line x1="20" y1="-8" x2="12" y2="0" stroke="#ffffff" stroke-width="2.5" />
            `
          : svg`
              <circle cx="16" cy="-4" r="5" fill="#ffffff" />
              <circle cx="18" cy="-4" r="2.4" fill="#111827" />
            `}
      </g>
    `;
  }

  _renderAlgae(hours) {
    if (!this._config.algae_enabled || hours < 24) {
      return svg``;
    }

    const intensity = Math.min(1.0, (hours - 24) / 48); // Full dirty after 72h
    const baseOpacity = (0.25 + intensity * 0.55).toFixed(2);

    return svg`
      <g id="algae-layer" opacity="${baseOpacity}">
        <!-- Glass corner spots -->
        <path d="M 40 70 Q 120 110, 90 200 Q 50 160, 40 70 Z" fill="#365314" />
        <path d="M 984 70 Q 900 120, 930 210 Q 970 150, 984 70 Z" fill="#365314" />
        <path d="M 40 450 Q 140 400, 110 515 A 20 20 0 0 1 40 515 Z" fill="#283618" />
        <path d="M 984 450 Q 880 390, 910 515 A 20 20 0 0 0 984 515 Z" fill="#283618" />
        <!-- Smudges on glass surface -->
        <ellipse cx="300" cy="180" rx="80" ry="35" fill="#4d7c0f" opacity="0.4" />
        <ellipse cx="720" cy="220" rx="110" ry="45" fill="#3f6212" opacity="0.35" />
        <ellipse cx="512" cy="400" rx="140" ry="25" fill="#365314" opacity="0.5" />
      </g>
    `;
  }

  render() {
    if (!this._config || !this._hass) {
      return html``;
    }

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

    const tankTop = 70;
    const tankBottom = 525;
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
    const isFullscreen = Boolean(this._config.fullscreen);
    const customRatio = (this._config.aspect_ratio || "1024/600").replace(":", "/");

    return html`
      <ha-card>
        ${!isFullscreen && hasTitle
          ? html`
              <div class="card-header">
                <span class="card-title">${this._config.title}</span>
              </div>
            `
          : ""}

        <div class="aquarium-container">
          <svg
            viewBox="0 0 1024 600"
            preserveAspectRatio="xMidYMid meet"
            style="aspect-ratio: ${customRatio};"
          >
            <defs>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.20" />
                <stop offset="10%" stop-color="#ffffff" stop-opacity="0.03" />
                <stop offset="90%" stop-color="#ffffff" stop-opacity="0.03" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.20" />
              </linearGradient>

              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${waterColorStart}" stop-opacity="${isBoiling ? '0.5' : '0.25'}" />
                <stop offset="100%" stop-color="${waterColorEnd}" stop-opacity="${isBoiling ? '0.75' : '0.45'}" />
              </linearGradient>
            </defs>

            <!-- Aquarium background -->
            <rect
              x="40"
              y="70"
              width="944"
              height="465"
              rx="20"
              ry="20"
              fill="${theme.background}"
            />

            <!-- Sand floor -->
            <path
              d="M 40 480 Q 280 460, 512 490 T 984 480 L 984 515 A 20 20 0 0 1 964 535 L 60 535 A 20 20 0 0 1 40 515 Z"
              fill="${theme.sandColor}"
            />

            <!-- Theme decorations -->
            ${this._renderThemeDecoration(themeKey)}

            <!-- Snails crawling on the floor -->
            <g>
              ${this._snails.map(
                (snail) => svg`
                  <g transform="translate(${snail.x}, ${snail.y}) scale(${snail.dir * 1.8}, 1.8)">
                    <circle cx="-3" cy="-4" r="5.5" fill="${snail.color}" />
                    <path
                      d="M -3,-4 A 3 3 0 0 1 -1,-2"
                      stroke="#ffffff"
                      stroke-width="0.8"
                      fill="none"
                    />
                    <ellipse cx="2" cy="-1.5" rx="5" ry="2.2" fill="#d97706" />
                    <line x1="5" y1="-2.5" x2="7.5" y2="-5.5" stroke="#d97706" stroke-width="0.8" />
                    <circle cx="7.5" cy="-5.5" r="0.6" fill="#111827" />
                  </g>
                `
              )}
            </g>

            <!-- Dynamic water body -->
            ${waterRatio > 0
              ? svg`
                  <g>
                    <path
                      d="M 40 ${waterSurfaceY} L 984 ${waterSurfaceY} L 984 515 A 20 20 0 0 1 964 535 L 60 535 A 20 20 0 0 1 40 515 Z"
                      fill="url(#waterGrad)"
                    />
                    <line
                      x1="40"
                      y1="${waterSurfaceY}"
                      x2="984"
                      y2="${waterSurfaceY}"
                      stroke="#ffffff"
                      stroke-width="3"
                      stroke-opacity="0.85"
                    />
                  </g>
                `
              : ""}

            <!-- Standard rising air bubbles -->
            ${waterRatio > 0 && !isDead
              ? svg`
                  <g>
                    ${this._bubbles.map(
                      (b) => svg`
                        <circle
                          cx="${b.x}"
                          cy="${b.y}"
                          r="${b.r}"
                          fill="#ffffff"
                          opacity="0.6"
                          stroke="rgba(255,255,255,0.8)"
                          stroke-width="0.8"
                        />
                      `
                    )}
                  </g>
                `
              : ""}

            <!-- Violent Boiling Bubbles when Temp >= 40°C -->
            ${isBoiling && waterRatio > 0
              ? svg`
                  <g>
                    ${this._boilingBubbles.map(
                      (b) => svg`
                        <circle
                          cx="${b.x}"
                          cy="${b.y}"
                          r="${b.r}"
                          fill="#fef08a"
                          opacity="0.75"
                          stroke="#ffffff"
                          stroke-width="1.2"
                        />
                      `
                    )}
                  </g>
                `
              : ""}

            <!-- Fishes rendering (No text labels) -->
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

            <!-- 24-hour dirty algae layer on glass -->
            ${this._renderAlgae(this._cachedHoursSinceLastShower)}

            <!-- Outer glass tank border -->
            <rect
              x="40"
              y="70"
              width="944"
              height="465"
              rx="20"
              ry="20"
              fill="url(#glassGrad)"
              stroke="#94a3b8"
              stroke-width="3.5"
            />

            <!-- Stand base -->
            <rect
              x="25"
              y="535"
              width="974"
              height="18"
              rx="5"
              ry="5"
              fill="#1e293b"
            />
          </svg>
        </div>

        ${!isFullscreen
          ? html`
              <div class="metrics-grid">
                <div class="metric-box">
                  <div class="metric-value">
                    ${currentVolume.toFixed(1)} <span class="metric-unit">L</span>
                  </div>
                  <div class="metric-label">${this._t("label_consumed")}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-value">
                    ${displayedRemaining.toFixed(1)} <span class="metric-unit">L</span>
                  </div>
                  <div class="metric-label">${this._t("label_remaining")}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-value">
                    ${targetBudget} <span class="metric-unit">L</span>
                  </div>
                  <div class="metric-label">${this._t("label_target")}</div>
                </div>
                ${currentTemp > 0
                  ? html`
                      <div class="metric-box">
                        <div
                          class="metric-value"
                          style="color: ${currentTemp >= deadlyTemp
                            ? '#ef4444'
                            : currentTemp >= boilTemp
                            ? '#f59e0b'
                            : 'inherit'};"
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
window.customCards.push({
  type: "shower-aquarium-card",
  name: "Shower Aquarium Card",
  preview: true,
  description: "An animated aquarium dashboard card reflecting shower water usage.",
});
