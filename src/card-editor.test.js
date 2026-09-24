// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import "./card-editor.js";

function mountEditor(configOverrides = {}, hassOverrides = {}) {
  const Editor = customElements.get("shower-aquarium-card-editor");
  const el = new Editor();
  el.setConfig({ entity: "sensor.shower_volume", ...configOverrides });
  el.hass = { locale: { language: "fr-FR" }, ...hassOverrides };
  document.body.appendChild(el);
  return el.updateComplete.then(() => el);
}

describe("card-editor.js registration", () => {
  it("registers the shower-aquarium-card-editor custom element", () => {
    expect(customElements.get("shower-aquarium-card-editor")).toBeDefined();
  });
});

describe("card-editor.js render()", () => {
  it("returns an empty template before hass/_config are both set (no crash)", () => {
    const Editor = customElements.get("shower-aquarium-card-editor");
    const el = new Editor();
    expect(() => el.render()).not.toThrow();
  });

  it("renders an <ha-form> once hass and _config are both set", async () => {
    const el = await mountEditor();
    expect(el.shadowRoot.querySelector("ha-form")).not.toBeNull();
  });

  it("passes the full CARD_EDITOR_SCHEMA (25 fields) to ha-form", async () => {
    const el = await mountEditor();
    const form = el.shadowRoot.querySelector("ha-form");
    expect(form.schema).toHaveLength(25);
    expect(form.schema.map((f) => f.name)).toContain("entity");
    expect(form.schema.map((f) => f.name)).toContain("aspect_ratio_height");
  });

  it("the computeLabel/computeHelper functions actually bound to ha-form (not just the underlying methods) work", async () => {
    const el = await mountEditor();
    const form = el.shadowRoot.querySelector("ha-form");
    expect(form.computeLabel({ name: "entity" })).toBe("Entité de volume de douche");
    expect(form.computeHelper({ name: "fullscreen" })).toBe("Tablette, Nest Hub...");
  });
});

describe("card-editor.js _computeLabel()", () => {
  it("returns the French label for a known field when hass is French", async () => {
    const el = await mountEditor();
    expect(el._computeLabel({ name: "entity" })).toBe("Entité de volume de douche");
  });

  it("returns the English label when hass is English", async () => {
    const el = await mountEditor({}, { locale: { language: "en-US" } });
    expect(el._computeLabel({ name: "entity" })).toBe("Shower volume entity");
  });

  it("falls back to the raw field name for a field with no translation mapping", async () => {
    const el = await mountEditor();
    expect(el._computeLabel({ name: "not_a_real_field" })).toBe("not_a_real_field");
  });
});

describe("card-editor.js _computeHelper()", () => {
  it("only the fullscreen field gets helper text", async () => {
    const el = await mountEditor();
    expect(el._computeHelper({ name: "fullscreen" })).toBe("Tablette, Nest Hub...");
    expect(el._computeHelper({ name: "entity" })).toBe("");
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

  it("does nothing if _config or hass isn't set yet (no crash on a stray event)", () => {
    const Editor = customElements.get("shower-aquarium-card-editor");
    const el = new Editor();
    expect(() => el._valueChanged({ detail: { value: {} } })).not.toThrow();
  });
});
