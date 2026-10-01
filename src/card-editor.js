import { LitElement, html } from "lit";
import { resolveLang, translate } from "./translations.js";
import { stripLegacyConfigKeys, clampRangedOptions } from "./pure.js";
import { CONFIG_DEFAULTS } from "./defaults.js";

/** @typedef {import("./types.js").EditorField} EditorField */
/** @typedef {import("./types.js").Hass} Hass */
/** @typedef {Record<string, any>} RawConfig */

/** @type {EditorField[]} */
export const CARD_EDITOR_SCHEMA = [
  { name: "entity", required: true, selector: { entity: { domain: "sensor" } } },
  { name: "temperature_entity", selector: { entity: { domain: "sensor" } } },
  { name: "title", selector: { text: {} } },
  {
    name: "theme",
    default: CONFIG_DEFAULTS.theme,
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
    name: "target_budget_entity",
    selector: { entity: { domain: ["input_number", "number", "sensor"] } },
  },
  {
    name: "target_budget",
    default: CONFIG_DEFAULTS.target_budget,
    selector: { number: { min: 1, max: 500, unit_of_measurement: "L", mode: "box" } },
  },
  {
    type: "expandable",
    name: "section_aquarium",
    flatten: true,
    schema: [
      {
        name: "fish_count",
        default: CONFIG_DEFAULTS.fish_count,
        selector: { number: { min: 1, max: 10, mode: "slider" } },
      },
      {
        name: "fish_speed_multiplier",
        default: CONFIG_DEFAULTS.fish_speed_multiplier,
        selector: { number: { min: 0.2, max: 3.0, step: 0.1, mode: "slider" } },
      },
      { name: "algae_enabled", default: CONFIG_DEFAULTS.algae_enabled, selector: { boolean: {} } },
      {
        name: "algae_delay_hours",
        default: CONFIG_DEFAULTS.algae_delay_hours,
        selector: { number: { min: 1, max: 48, unit_of_measurement: "h", mode: "box" } },
      },
      {
        name: "algae_age",
        default: CONFIG_DEFAULTS.algae_age,
        selector: { number: { min: 0, max: 48, unit_of_measurement: "h", mode: "slider" } },
      },
    ],
  },
  {
    type: "expandable",
    name: "section_limits",
    flatten: true,
    schema: [
      {
        name: "survival_volume",
        default: CONFIG_DEFAULTS.survival_volume,
        selector: { number: { min: 1, max: 100, unit_of_measurement: "L", mode: "box" } },
      },
      { name: "comfort_temp_entity", selector: { entity: { domain: ["sensor", "number", "input_number"] } } },
      {
        name: "comfort_temp_min",
        default: CONFIG_DEFAULTS.comfort_temp_min,
        selector: { number: { min: 15, max: 45, unit_of_measurement: "°C", mode: "box" } },
      },
      {
        name: "temp_boiling_threshold",
        default: CONFIG_DEFAULTS.temp_boiling_threshold,
        selector: { number: { min: 25, max: 60, unit_of_measurement: "°C", mode: "box" } },
      },
      {
        name: "temp_deadly_threshold",
        default: CONFIG_DEFAULTS.temp_deadly_threshold,
        selector: { number: { min: 30, max: 70, unit_of_measurement: "°C", mode: "box" } },
      },
    ],
  },
  {
    type: "expandable",
    name: "section_cost",
    flatten: true,
    schema: [
      { name: "show_cost", default: CONFIG_DEFAULTS.show_cost, selector: { boolean: {} } },
      {
        name: "water_price_per_m3",
        default: CONFIG_DEFAULTS.water_price_per_m3,
        selector: { number: { min: 0, max: 30, step: 0.01, unit_of_measurement: "€/m³", mode: "box" } },
      },
      {
        name: "energy_price_per_kwh",
        default: CONFIG_DEFAULTS.energy_price_per_kwh,
        selector: { number: { min: 0, max: 2, step: 0.001, unit_of_measurement: "€/kWh", mode: "box" } },
      },
      {
        name: "cold_water_temp",
        default: CONFIG_DEFAULTS.cold_water_temp,
        selector: { number: { min: 0, max: 30, unit_of_measurement: "°C", mode: "box" } },
      },
    ],
  },
  {
    type: "expandable",
    name: "section_display",
    flatten: true,
    schema: [
      {
        name: "animation_quality",
        default: CONFIG_DEFAULTS.animation_quality,
        selector: {
          select: {
            options: [
              { value: "max", label: "Maximum" },
              { value: "balanced", label: "Balanced" },
              { value: "light", label: "Light (Google Nest Hub)" },
            ],
          },
        },
      },
      {
        name: "creature_style",
        default: CONFIG_DEFAULTS.creature_style,
        selector: {
          select: {
            options: [
              { value: "flat", label: "Flat and detailed" },
              { value: "cartoon", label: "Cartoon" },
              { value: "realistic", label: "Realistic" },
            ],
          },
        },
      },
      { name: "show_budget", default: CONFIG_DEFAULTS.show_budget, selector: { boolean: {} } },
      { name: "respect_reduced_motion", default: CONFIG_DEFAULTS.respect_reduced_motion, selector: { boolean: {} } },
      { name: "fullscreen", default: CONFIG_DEFAULTS.fullscreen, selector: { boolean: {} } },
      { name: "show_gauges", default: CONFIG_DEFAULTS.show_gauges, selector: { boolean: {} } },
      {
        name: "gauge_style",
        default: CONFIG_DEFAULTS.gauge_style,
        selector: {
          select: {
            options: [
              { value: "thermometer", label: "Thermometer and bar" },
              { value: "arc", label: "Open arcs" },
            ],
          },
        },
      },
      { name: "show_tiles", default: CONFIG_DEFAULTS.show_tiles, selector: { boolean: {} } },
      { name: "swipe_biotope", default: CONFIG_DEFAULTS.swipe_biotope, selector: { boolean: {} } },
      { name: "show_fps", default: CONFIG_DEFAULTS.show_fps, selector: { boolean: {} } },
      {
        name: "aspect_ratio_width",
        default: CONFIG_DEFAULTS.aspect_ratio_width,
        selector: { number: { min: 1, max: 4000, mode: "box" } },
      },
      {
        name: "aspect_ratio_height",
        default: CONFIG_DEFAULTS.aspect_ratio_height,
        selector: { number: { min: 1, max: 4000, mode: "box" } },
      },
    ],
  },
];

/**
 * The fields of the form, with the sections opened up: what the user can
 * actually configure, in display order.
 *
 * @param {EditorField[]} [schema]
 * @returns {EditorField[]}
 */
export function editorFields(schema = CARD_EDITOR_SCHEMA) {
  return schema.flatMap((field) => (field.type === "expandable" ? editorFields(/** @type {EditorField[]} */ (field.schema)) : [field]));
}

// section name -> translation key of its heading.
/** @type {Record<string, string>} */
export const SECTION_TITLE_KEYS = {
  section_aquarium: "section_aquarium",
  section_limits: "section_limits",
  section_cost: "section_cost",
  section_display: "section_display",
};

// schema field name -> translation key (exported so tests can check that
// every schema field has a label). Kept as a lookup table (rather
// than e.g. naming translation keys after the field) so CARD_EDITOR_SCHEMA
// above can stay in FFBB-style plain HA selectors, independent of this
// card's particular translation key names.
/** @type {Record<string, string>} */
export const FIELD_LABEL_KEYS = {
  entity: "field_entity",
  temperature_entity: "field_temp_entity",
  title: "field_title",
  theme: "field_theme",
  fish_count: "field_fish_count",
  target_budget_entity: "field_target_budget_entity",
  target_budget: "field_target_budget",
  survival_volume: "field_survival_volume",
  comfort_temp_entity: "field_comfort_temp_entity",
  comfort_temp_min: "field_comfort_temp",
  temp_boiling_threshold: "field_temp_boil",
  temp_deadly_threshold: "field_temp_deadly",
  algae_enabled: "field_algae_enabled",
  algae_delay_hours: "field_algae_delay",
  algae_age: "field_algae_age",
  fish_speed_multiplier: "field_fish_speed",
  show_cost: "field_show_cost",
  water_price_per_m3: "field_water_price",
  energy_price_per_kwh: "field_energy_price",
  cold_water_temp: "field_cold_water_temp",
  animation_quality: "field_animation_quality",
  respect_reduced_motion: "field_respect_reduced_motion",
  fullscreen: "field_fullscreen",
  show_fps: "field_show_fps",
  creature_style: "field_creature_style",
  gauge_style: "field_gauge_style",
  show_budget: "field_show_budget",
  swipe_biotope: "field_swipe_biotope",
  show_gauges: "field_show_gauges",
  show_tiles: "field_show_tiles",
  aspect_ratio_width: "field_aspect_ratio_width",
  aspect_ratio_height: "field_aspect_ratio_height",
};

// schema field name -> translation key of its helper text (fields without an
// entry get no helper).
/** @type {Record<string, string>} */
export const HELPER_KEYS = {
  fullscreen: "helper_fullscreen",
  creature_style: "helper_creature_style",
  target_budget: "helper_target_budget",
  fish_count: "helper_fish_count",
  fish_speed_multiplier: "helper_fish_speed",
  comfort_temp_entity: "helper_comfort_temp_entity",
  show_cost: "helper_show_cost",
  animation_quality: "helper_animation_quality",
  respect_reduced_motion: "helper_respect_reduced_motion",
  show_fps: "helper_show_fps",
  swipe_biotope: "helper_swipe_biotope",
  show_gauges: "helper_show_gauges",
  show_tiles: "helper_show_tiles",
  algae_age: "helper_algae_age",
};

// select field name -> { option value -> translation key }. The labels in
// CARD_EDITOR_SCHEMA are English placeholders only; _schema() replaces them
// with the translated text for the active language.
/** @type {Record<string, Record<string, string>>} */
export const OPTION_LABEL_KEYS = {
  theme: {
    freshwater: "theme_freshwater",
    saltwater: "theme_saltwater",
    coldwater: "theme_coldwater",
  },
  animation_quality: {
    max: "quality_max",
    balanced: "quality_balanced",
    light: "quality_light",
  },
  creature_style: {
    flat: "option_creature_flat",
    cartoon: "option_creature_cartoon",
    realistic: "option_creature_realistic",
  },
  gauge_style: {
    thermometer: "option_gauge_thermometer",
    arc: "option_gauge_arc",
  },
};

export class AquariumShowerCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
  }

  constructor() {
    super();
    /** @type {Hass | undefined} */
    this.hass = undefined;
    /** @type {RawConfig | undefined} */
    this._config = undefined;
  }

  /**
   * @param {RawConfig} config
   */
  setConfig(config) {
    this._config = stripLegacyConfigKeys(config);
  }

  _lang() {
    return resolveLang(this.hass);
  }

  /**
   * @param {{ name: string }} schema
   * @returns {string}
   */
  _computeLabel(schema) {
    const key = FIELD_LABEL_KEYS[schema.name] || SECTION_TITLE_KEYS[schema.name];
    return key ? translate(this._lang(), key) : schema.name;
  }

  /**
   * @param {{ name: string }} schema
   * @returns {string}
   */
  _computeHelper(schema) {
    const key = HELPER_KEYS[schema.name];
    return key ? translate(this._lang(), key) : "";
  }

  /**
   * @param {{ detail: { value: RawConfig } }} ev
   */
  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const newConfig = clampRangedOptions({ ...ev.detail.value });
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  // Schema with the section headings and the select-option labels translated
  // for the active language.
  /**
   * @returns {EditorField[]}
   */
  _schema() {
    const lang = this._lang();
    /** @type {(field: EditorField) => EditorField} */
    const localize = (field) => {
      if (field.type === "expandable") {
        return {
          ...field,
          title: translate(lang, SECTION_TITLE_KEYS[field.name]),
          schema: /** @type {EditorField[]} */ (field.schema).map(localize),
        };
      }
      const labelKeys = OPTION_LABEL_KEYS[field.name];
      if (!labelKeys) return field;
      return {
        ...field,
        selector: {
          select: {
            options: /** @type {Record<string, any>} */ (field.selector).select.options.map((/** @type {{ value: string }} */ option) => ({
              value: option.value,
              label: translate(lang, labelKeys[option.value]),
            })),
          },
        },
      };
    };
    return CARD_EDITOR_SCHEMA.map(localize);
  }

  // What the form shows: the saved options, over the default of every option
  // that has one. Without this a list or a box would look empty (nothing ticked,
  // no value) until the user touched it, although the card uses the default.
  /**
   * @returns {RawConfig}
   */
  _formData() {
    const defaults = Object.fromEntries(editorFields().filter((f) => f.default !== undefined).map((f) => [f.name, f.default]));
    return { ...defaults, ...clampRangedOptions(/** @type {RawConfig} */ (this._config)) };
  }

  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._schema()}
        .computeLabel=${(/** @type {{ name: string }} */ s) => this._computeLabel(s)}
        .computeHelper=${(/** @type {{ name: string }} */ s) => this._computeHelper(s)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
}

if (!customElements.get("shower-aquarium-card-editor")) {
  customElements.define("shower-aquarium-card-editor", AquariumShowerCardEditor);
}
