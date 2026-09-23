import { LitElement, html } from "lit";
import { resolveLang, translate } from "./translations.js";

export const CARD_EDITOR_SCHEMA = [
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

// schema field name -> translation key. Kept as a lookup table (rather
// than e.g. naming translation keys after the field) so CARD_EDITOR_SCHEMA
// above can stay in FFBB-style plain HA selectors, independent of this
// card's particular translation key names.
const FIELD_LABEL_KEYS = {
  entity: "field_entity",
  temperature_entity: "field_temp_entity",
  title: "field_title",
  theme: "field_theme",
  fish_count: "field_fish_count",
  target_budget_entity: "field_target_budget_entity",
  target_budget: "field_target_budget",
  survival_volume: "field_survival_volume",
  temp_boiling_threshold: "field_temp_boil",
  temp_deadly_threshold: "field_temp_deadly",
  algae_enabled: "field_algae_enabled",
  algae_delay_hours: "field_algae_delay",
  algae_age: "field_algae_age",
  fish_speed_multiplier: "field_fish_speed",
  fullscreen: "field_fullscreen",
  aspect_ratio_width: "field_aspect_ratio_width",
  aspect_ratio_height: "field_aspect_ratio_height",
};

export class AquariumShowerCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
  }

  setConfig(config) {
    this._config = { ...config };
  }

  _lang() {
    return resolveLang(this.hass);
  }

  _computeLabel(schema) {
    const key = FIELD_LABEL_KEYS[schema.name];
    return key ? translate(this._lang(), key) : schema.name;
  }

  _computeHelper(schema) {
    return schema.name === "fullscreen" ? translate(this._lang(), "helper_fullscreen") : "";
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

if (!customElements.get("shower-aquarium-card-editor")) {
  customElements.define("shower-aquarium-card-editor", AquariumShowerCardEditor);
}
