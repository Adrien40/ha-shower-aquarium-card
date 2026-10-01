// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import {
  CARD_EDITOR_SCHEMA,
  editorFields,
  SECTION_TITLE_KEYS,
  FIELD_LABEL_KEYS,
  HELPER_KEYS,
  OPTION_LABEL_KEYS,
} from "./card-editor.js";
import { LEGACY_CONFIG_KEYS } from "./pure.js";
import enTranslations from "../translations/en.json";
import frTranslations from "../translations/fr.json";

const HASS_FR = { locale: { language: "fr-FR" } };
const HASS_EN = { locale: { language: "en-US" } };

function mountEditor(configOverrides = {}, hassOverrides = {}) {
  const Editor = customElements.get("shower-aquarium-card-editor");
  const el = new Editor();
  el.setConfig({ entity: "sensor.shower_volume", ...configOverrides });
  el.hass = { ...HASS_FR, ...hassOverrides };
  document.body.appendChild(el);
  return el.updateComplete.then(() => el);
}

describe("card-editor.js registration", () => {
  it("registers the shower-aquarium-card-editor custom element", () => {
    expect(customElements.get("shower-aquarium-card-editor")).toBeDefined();
  });

  it("does not register the element twice when the module is evaluated again", async () => {
    const before = customElements.get("shower-aquarium-card-editor");
    vi.resetModules();
    await import("./card-editor.js");
    expect(customElements.get("shower-aquarium-card-editor")).toBe(before);
  });
});

describe("card-editor.js CARD_EDITOR_SCHEMA", () => {
  // The form has sections; the tests below look at the fields they hold.
  const names = editorFields().map((f) => f.name);

  it("has unique field names", () => {
    expect(new Set(names).size).toBe(names.length);
  });

  it("marks only the shower volume entity as required", () => {
    expect(editorFields().filter((f) => f.required).map((f) => f.name)).toEqual(["entity"]);
  });

  it("gives every field a selector", () => {
    for (const field of editorFields()) {
      expect(field.selector, field.name).toBeTypeOf("object");
      expect(Object.keys(field.selector), field.name).toHaveLength(1);
    }
  });

  it("has a label translation key for every field, and no label key for a missing field", () => {
    expect([...names].sort()).toEqual(Object.keys(FIELD_LABEL_KEYS).sort());
  });

  it.each(Object.entries(FIELD_LABEL_KEYS))("label key of %s (%s) exists in both dictionaries", (_field, key) => {
    expect(enTranslations[key], `en.json ${key}`).toBeTypeOf("string");
    expect(frTranslations[key], `fr.json ${key}`).toBeTypeOf("string");
  });

  it.each(Object.entries(HELPER_KEYS))("helper key of %s (%s) exists in both dictionaries", (field, key) => {
    expect(names).toContain(field);
    expect(enTranslations[key]).toBeTypeOf("string");
    expect(frTranslations[key]).toBeTypeOf("string");
  });

  it("no longer exposes any removed (legacy) option", () => {
    for (const key of LEGACY_CONFIG_KEYS) {
      expect(names).not.toContain(key);
      expect(FIELD_LABEL_KEYS).not.toHaveProperty(key);
    }
  });

  it("every numeric selector has a coherent min/max range", () => {
    for (const field of editorFields()) {
      const num = field.selector.number;
      if (!num) continue;
      expect(num.min, field.name).toBeLessThan(num.max);
      if (field.default !== undefined) {
        expect(field.default, field.name).toBeGreaterThanOrEqual(num.min);
        expect(field.default, field.name).toBeLessThanOrEqual(num.max);
      }
    }
  });

  it("the default of every select field is one of its options", () => {
    for (const field of editorFields()) {
      const select = field.selector.select;
      if (!select) continue;
      expect(select.options.map((o) => o.value), field.name).toContain(field.default);
    }
  });

  it("OPTION_LABEL_KEYS covers exactly the options of the theme, animation_quality, creature_style and gauge_style selects", () => {
    for (const [fieldName, keys] of Object.entries(OPTION_LABEL_KEYS)) {
      const field = editorFields().find((f) => f.name === fieldName);
      expect(field, fieldName).toBeDefined();
      expect(field.selector.select.options.map((o) => o.value).sort()).toEqual(Object.keys(keys).sort());
      for (const key of Object.values(keys)) {
        expect(enTranslations[key], key).toBeTypeOf("string");
        expect(frTranslations[key], key).toBeTypeOf("string");
      }
    }
  });
});

describe("card-editor.js render()", () => {
  it("returns an empty template before hass/_config are both set (no crash)", () => {
    const Editor = customElements.get("shower-aquarium-card-editor");
    const el = new Editor();
    expect(() => el.render()).not.toThrow();
  });

  it("returns an empty template when only hass is set", () => {
    const Editor = customElements.get("shower-aquarium-card-editor");
    const el = new Editor();
    el.hass = HASS_EN;
    document.body.appendChild(el);
    expect(el.shadowRoot.querySelector("ha-form")).toBeNull();
  });

  it("renders an <ha-form> once hass and _config are both set", async () => {
    const el = await mountEditor();
    expect(el.shadowRoot.querySelector("ha-form")).not.toBeNull();
  });

  it("passes the whole CARD_EDITOR_SCHEMA to ha-form, sections included, in order", async () => {
    const el = await mountEditor();
    const form = el.shadowRoot.querySelector("ha-form");
    expect(form.schema.map((f) => f.name)).toEqual(CARD_EDITOR_SCHEMA.map((f) => f.name));
    expect(editorFields(form.schema).map((f) => f.name)).toEqual(editorFields().map((f) => f.name));
  });

  it("passes the current config to ha-form as data", async () => {
    const el = await mountEditor({ theme: "saltwater" });
    const form = el.shadowRoot.querySelector("ha-form");
    expect(form.data.theme).toBe("saltwater");
    expect(form.data.entity).toBe("sensor.shower_volume");
  });

  it("the computeLabel/computeHelper functions actually bound to ha-form work", async () => {
    const el = await mountEditor();
    const form = el.shadowRoot.querySelector("ha-form");
    expect(form.computeLabel({ name: "entity" })).toBe(frTranslations.field_entity);
    expect(form.computeHelper({ name: "fullscreen" })).toBe(frTranslations.helper_fullscreen);
  });
});

describe("card-editor.js shows the defaults of the card", () => {
  const dataOf = async (config = {}) => (await mountEditor(config)).shadowRoot.querySelector("ha-form").data;

  it("every select has its default ticked: biotope, animation quality and gauge style", async () => {
    const data = await dataOf();
    expect(data.theme).toBe("freshwater");
    expect(data.animation_quality).toBe("max");
    expect(data.gauge_style).toBe("thermometer");
  });

  it("the boxes show the default values instead of staying empty", async () => {
    const data = await dataOf();
    expect(data.temp_boiling_threshold).toBe(40);
    expect(data.temp_deadly_threshold).toBe(45);
    expect(data.survival_volume).toBe(5);
    expect(data.target_budget).toBe(50);
    expect(data.fish_count).toBe(4);
  });

  it("what the user saved wins over the default", async () => {
    const data = await dataOf({ theme: "coldwater", temp_boiling_threshold: 38, fish_count: 9 });
    expect(data.theme).toBe("coldwater");
    expect(data.temp_boiling_threshold).toBe(38);
    expect(data.fish_count).toBe(9);
  });

  it("options without a default (the entities, the title) stay empty", async () => {
    const data = await dataOf();
    expect(data).not.toHaveProperty("temperature_entity");
    expect(data).not.toHaveProperty("target_budget_entity");
    expect(data).not.toHaveProperty("comfort_temp_entity");
    expect(data).not.toHaveProperty("title");
  });

  it("does not change the saved configuration by itself", async () => {
    const el = await mountEditor();
    expect(el._config).not.toHaveProperty("theme");
  });

  it("saves the defaults it showed once the user changes something", async () => {
    const el = await mountEditor();
    const seen = [];
    el.addEventListener("config-changed", (e) => seen.push(e.detail.config));
    const form = el.shadowRoot.querySelector("ha-form");
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...form.data, fish_count: 6 } } }));
    expect(seen[0]).toMatchObject({ theme: "freshwater", animation_quality: "max", fish_count: 6 });
  });
});

describe("card-editor.js brings out-of-range values back", () => {
  const dataOf = async (config) => (await mountEditor(config)).shadowRoot.querySelector("ha-form").data;

  it("shows 10 fish, not 20, when the saved configuration says 20", async () => {
    expect((await dataOf({ fish_count: 20 })).fish_count).toBe(10);
  });

  it("shows the speed within 0.2..3", async () => {
    expect((await dataOf({ fish_speed_multiplier: 8 })).fish_speed_multiplier).toBe(3);
    expect((await dataOf({ fish_speed_multiplier: 0.01 })).fish_speed_multiplier).toBe(0.2);
  });

  it("saves the corrected value once something changes", async () => {
    const el = await mountEditor({ fish_count: 20 });
    const seen = [];
    el.addEventListener("config-changed", (e) => seen.push(e.detail.config));
    const form = el.shadowRoot.querySelector("ha-form");
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...form.data, title: "Bath", fish_count: 20 } } }));
    expect(seen[0].fish_count).toBe(10);
    expect(seen[0].title).toBe("Bath");
  });

  it("does not alter the options that have no range", async () => {
    const data = await dataOf({ target_budget: 800 });
    expect(data.target_budget).toBe(800);
  });

  it("leaves the saved configuration untouched until the user changes something", async () => {
    const el = await mountEditor({ fish_count: 20 });
    expect(el._config.fish_count).toBe(20);
  });
});

describe("card-editor.js texts that explain the options", () => {
  it("the target budget says it is only used without the target entity", () => {
    expect(HELPER_KEYS.target_budget).toBe("helper_target_budget");
    expect(enTranslations.helper_target_budget).toContain("target entity");
    expect(frTranslations.helper_target_budget).toBe(frTranslations.helper_target_budget.trim());
    expect(frTranslations.helper_target_budget).not.toBe(enTranslations.helper_target_budget);
  });

  it("the fish count tells the maximum of 10, in both languages", () => {
    expect(enTranslations.helper_fish_count).toContain("10");
    expect(frTranslations.helper_fish_count).toContain("10");
  });

  it("the fish speed tells its range, in both languages", () => {
    expect(enTranslations.helper_fish_speed).toContain("0.2");
    expect(enTranslations.helper_fish_speed).toContain("3");
    expect(frTranslations.helper_fish_speed).toContain("0,2");
    expect(frTranslations.helper_fish_speed).toContain("3");
  });

  it("the ranges written in the texts are the ones of the selectors", () => {
    const fields = Object.fromEntries(editorFields().map((f) => [f.name, f]));
    expect(fields.fish_count.selector.number).toMatchObject({ min: 1, max: 10 });
    expect(fields.fish_speed_multiplier.selector.number).toMatchObject({ min: 0.2, max: 3 });
  });

  it("the comfort temperature entity is called the minimum comfort temperature", () => {
    expect(enTranslations.field_comfort_temp_entity).toBe("Minimum comfort temperature entity (optional)");
    // \u00e9 is an e with an acute accent (kept as an escape: this file stays accent-free).
    expect(frTranslations.field_comfort_temp_entity).toBe("Entit\u00e9 de temp\u00e9rature de confort minimum (optionnel)");
  });
});

describe("card-editor.js setConfig()", () => {
  it("copies the config instead of keeping a reference to it", async () => {
    const Editor = customElements.get("shower-aquarium-card-editor");
    const el = new Editor();
    const config = { entity: "sensor.a" };
    el.setConfig(config);
    config.entity = "sensor.mutated";
    expect(el._config.entity).toBe("sensor.a");
  });

  it("drops the keys of removed features so the editor stops writing them back", async () => {
    const el = await mountEditor({ night_entity: "sun.sun", night_lux_threshold: 30, theme: "coldwater" });
    expect(el._config).not.toHaveProperty("night_entity");
    expect(el._config).not.toHaveProperty("night_lux_threshold");
    expect(el._config.theme).toBe("coldwater");
  });
});

describe("card-editor.js _computeLabel()", () => {
  it("returns the French label for a known field when hass is French", async () => {
    const el = await mountEditor();
    expect(el._computeLabel({ name: "entity" })).toBe(frTranslations.field_entity);
    expect(el._computeLabel({ name: "entity" })).not.toBe(enTranslations.field_entity);
  });

  it("returns the English label when hass is English", async () => {
    const el = await mountEditor({}, HASS_EN);
    expect(el._computeLabel({ name: "entity" })).toBe(enTranslations.field_entity);
  });

  it("falls back to English for a language that has no dictionary", async () => {
    const el = await mountEditor({}, { locale: { language: "de-DE" } });
    expect(el._computeLabel({ name: "entity" })).toBe(enTranslations.field_entity);
  });

  it("falls back to the raw field name for a field with no translation mapping", async () => {
    const el = await mountEditor();
    expect(el._computeLabel({ name: "not_a_real_field" })).toBe("not_a_real_field");
  });

  it.each([...editorFields().map((f) => f.name), ...Object.keys(SECTION_TITLE_KEYS)])("never shows a raw key for %s", async (name) => {
    const el = await mountEditor();
    const label = el._computeLabel({ name });
    expect(label).not.toBe(name);
    expect(label).not.toMatch(/^(field|section)_/);
  });
});

describe("card-editor.js _computeHelper()", () => {
  it.each(Object.entries(HELPER_KEYS))("%s gets its helper text in French and English", async (field, key) => {
    const fr = await mountEditor();
    expect(fr._computeHelper({ name: field })).toBe(frTranslations[key]);
    const en = await mountEditor({}, HASS_EN);
    expect(en._computeHelper({ name: field })).toBe(enTranslations[key]);
  });

  it("returns an empty string for a field without helper text", async () => {
    const el = await mountEditor();
    expect(el._computeHelper({ name: "entity" })).toBe("");
    expect(el._computeHelper({ name: "not_a_real_field" })).toBe("");
  });
});

describe("card-editor.js _schema() option labels", () => {
  const optionLabels = (schema, fieldName) =>
    editorFields(schema).find((f) => f.name === fieldName).selector.select.options.map((o) => o.label);

  it.each(Object.keys(OPTION_LABEL_KEYS))("%s labels follow the French dictionary", async (fieldName) => {
    const el = await mountEditor();
    const expected = Object.values(OPTION_LABEL_KEYS[fieldName]).map((k) => frTranslations[k]);
    expect(optionLabels(el._schema(), fieldName)).toEqual(expected);
  });

  it.each(Object.keys(OPTION_LABEL_KEYS))("%s labels follow the English dictionary", async (fieldName) => {
    const el = await mountEditor({}, HASS_EN);
    const expected = Object.values(OPTION_LABEL_KEYS[fieldName]).map((k) => enTranslations[k]);
    expect(optionLabels(el._schema(), fieldName)).toEqual(expected);
  });

  it("theme labels differ between languages (regression: they used to be hardcoded)", async () => {
    const fr = await mountEditor();
    const en = await mountEditor({}, HASS_EN);
    expect(optionLabels(fr._schema(), "theme")).not.toEqual(optionLabels(en._schema(), "theme"));
  });

  it("keeps the option values untouched", async () => {
    const el = await mountEditor();
    const values = editorFields(el._schema()).find((f) => f.name === "theme").selector.select.options.map((o) => o.value);
    expect(values).toEqual(["freshwater", "saltwater", "coldwater"]);
  });

  it("returns fields without translated options as the very same objects", async () => {
    const el = await mountEditor();
    const localized = editorFields(el._schema());
    editorFields().forEach((field, i) => {
      if (!OPTION_LABEL_KEYS[field.name]) expect(localized[i]).toBe(field);
    });
  });

  it("does not mutate the shared CARD_EDITOR_SCHEMA", async () => {
    const before = JSON.stringify(CARD_EDITOR_SCHEMA);
    const el = await mountEditor();
    el._schema();
    expect(JSON.stringify(CARD_EDITOR_SCHEMA)).toBe(before);
  });
});

describe("card-editor.js _valueChanged()", () => {
  it("dispatches a bubbling, composed config-changed event with the new config", async () => {
    const el = await mountEditor();
    const spy = vi.fn();
    el.addEventListener("config-changed", spy);

    el._valueChanged({ detail: { value: { entity: "sensor.shower_volume", theme: "saltwater" } } });

    expect(spy).toHaveBeenCalledTimes(1);
    const event = spy.mock.calls[0][0];
    expect(event.detail.config).toEqual({ entity: "sensor.shower_volume", theme: "saltwater" });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it("emits a copy, not the object ha-form handed over", async () => {
    const el = await mountEditor();
    const spy = vi.fn();
    el.addEventListener("config-changed", spy);
    const value = { entity: "sensor.shower_volume" };
    el._valueChanged({ detail: { value } });
    expect(spy.mock.calls[0][0].detail.config).not.toBe(value);
  });

  it("is wired to the value-changed event of ha-form", async () => {
    const el = await mountEditor();
    const spy = vi.fn();
    el.addEventListener("config-changed", spy);
    const form = el.shadowRoot.querySelector("ha-form");
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { entity: "sensor.x" } } }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail.config.entity).toBe("sensor.x");
  });

  it("does nothing if _config or hass isn't set yet (no crash on a stray event)", () => {
    const Editor = customElements.get("shower-aquarium-card-editor");
    const el = new Editor();
    const spy = vi.fn();
    el.addEventListener("config-changed", spy);
    expect(() => el._valueChanged({ detail: { value: {} } })).not.toThrow();
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("card-editor.js sections", () => {
  const sections = CARD_EDITOR_SCHEMA.filter((f) => f.type === "expandable");
  const visible = CARD_EDITOR_SCHEMA.filter((f) => f.type !== "expandable");

  // Every option of the card, frozen: a section must never lose or duplicate one.
  const ALL_OPTIONS = [
    "entity", "temperature_entity", "title", "theme", "target_budget_entity", "target_budget",
    "fish_count", "fish_speed_multiplier", "algae_enabled", "algae_delay_hours", "algae_age",
    "survival_volume", "comfort_temp_entity", "use_threshold_colors", "threshold_1_entity", "threshold_2_entity", "threshold_3_entity", "comfort_temp_min", "temp_boiling_threshold", "temp_deadly_threshold",
    "show_cost", "water_price_per_m3", "energy_price_per_kwh", "cold_water_temp",
    "animation_quality", "creature_style", "show_budget", "respect_reduced_motion", "fullscreen", "show_gauges", "gauge_style", "show_tiles", "swipe_biotope", "show_fps", "aspect_ratio_width", "aspect_ratio_height",
  ];

  it("the form holds exactly the 36 options of the card, each once", () => {
    expect(editorFields().map((f) => f.name).sort()).toEqual([...ALL_OPTIONS].sort());
    expect(ALL_OPTIONS).toHaveLength(36);
  });

  it("keeps the essentials always visible and first: entity, temperature, title, theme, target", () => {
    expect(visible.map((f) => f.name)).toEqual(["entity", "temperature_entity", "title", "theme", "target_budget_entity", "target_budget"]);
    expect(CARD_EDITOR_SCHEMA.slice(0, visible.length).map((f) => f.type)).toEqual(visible.map(() => undefined));
  });

  it("has the four sections, after the essentials", () => {
    expect(sections.map((s) => s.name)).toEqual(["section_aquarium", "section_limits", "section_cost", "section_display"]);
    expect(CARD_EDITOR_SCHEMA.slice(visible.length).every((f) => f.type === "expandable")).toBe(true);
  });

  it.each(sections.map((s) => [s.name, s]))("%s is a flattened expandable section with fields", (_name, section) => {
    expect(section.type).toBe("expandable");
    expect(section.flatten).toBe(true);
    expect(section.schema.length).toBeGreaterThan(0);
    expect(section.selector).toBeUndefined();
    expect(section.default).toBeUndefined();
  });

  it("sections are not nested inside each other", () => {
    for (const section of sections) expect(section.schema.some((f) => f.type === "expandable")).toBe(false);
  });

  it("section names are unique and never collide with an option name", () => {
    const all = [...sections.map((s) => s.name), ...editorFields().map((f) => f.name)];
    expect(new Set(all).size).toBe(all.length);
  });

  it("every section has a heading in both languages", () => {
    for (const key of Object.values(SECTION_TITLE_KEYS)) {
      expect(enTranslations[key], key).toBeTypeOf("string");
      expect(frTranslations[key], key).toBeTypeOf("string");
      expect(frTranslations[key]).not.toBe(enTranslations[key]);
    }
    expect(Object.keys(SECTION_TITLE_KEYS).sort()).toEqual(sections.map((s) => s.name).sort());
  });

  it.each([
    ["French", HASS_FR, frTranslations],
    ["English", HASS_EN, enTranslations],
  ])("the headings sent to ha-form are in %s", async (_lang, hass, dictionary) => {
    const el = await mountEditor({}, hass);
    const form = el.shadowRoot.querySelector("ha-form");
    const titles = form.schema.filter((f) => f.type === "expandable").map((f) => f.title);
    expect(titles).toEqual(sections.map((s) => dictionary[SECTION_TITLE_KEYS[s.name]]));
  });

  it("the shared schema keeps no heading of its own: it is only filled in when shown", () => {
    for (const section of sections) expect(section.title).toBeUndefined();
  });

  it("computeLabel also answers for a section (in case ha-form asks)", async () => {
    const el = await mountEditor();
    expect(el._computeLabel({ name: "section_cost" })).toBe(frTranslations.section_cost);
    expect(el._computeLabel({ name: "section_display" })).toBe(frTranslations.section_display);
  });

  it("the data stays flat: sections do not change the configuration format", async () => {
    const el = await mountEditor({ theme: "coldwater", show_cost: true });
    const form = el.shadowRoot.querySelector("ha-form");
    expect(form.data.show_cost).toBe(true);
    for (const section of sections) expect(form.data).not.toHaveProperty(section.name);
    const spy = vi.fn();
    el.addEventListener("config-changed", spy);
    el._valueChanged({ detail: { value: { entity: "sensor.x", show_cost: false, fish_count: 7 } } });
    expect(spy.mock.calls[0][0].detail.config).toEqual({ entity: "sensor.x", show_cost: false, fish_count: 7 });
  });

  it("editorFields() opens the sections and leaves plain fields alone", () => {
    const plain = { name: "a", selector: { text: {} } };
    const section = { type: "expandable", name: "s", flatten: true, schema: [{ name: "b", selector: {} }, { name: "c", selector: {} }] };
    expect(editorFields([plain, section]).map((f) => f.name)).toEqual(["a", "b", "c"]);
    expect(editorFields([])).toEqual([]);
  });
});

