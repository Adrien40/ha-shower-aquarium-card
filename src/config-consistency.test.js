// @vitest-environment happy-dom
// The card and its visual editor both know the option defaults. If they drift
// apart, the editor shows one value while the card uses another.
import { describe, it, expect, beforeAll } from "vitest";
import "./shower-aquarium-card.js";
import { editorFields } from "./card-editor.js";
import { LEGACY_CONFIG_KEYS } from "./pure.js";

beforeAll(() => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = () => 0;
    window.cancelAnimationFrame = () => {};
  }
});

function cardWithMinimalConfig() {
  const Card = customElements.get("shower-aquarium-card");
  const el = new Card();
  el.setConfig({ entity: "sensor.shower_volume" });
  return el;
}

describe("card defaults match the editor schema defaults", () => {
  const el = cardWithMinimalConfig();
  const withDefault = editorFields().filter((f) => f.default !== undefined);

  it("the schema declares defaults for a meaningful number of fields", () => {
    expect(withDefault.length).toBeGreaterThan(15);
  });

  it.each(withDefault.map((f) => [f.name, f.default]))("%s defaults to %s in both places", (name, expected) => {
    expect(el._config[name]).toEqual(expected);
  });
});

describe("getStubConfig() matches the editor schema", () => {
  const Card = customElements.get("shower-aquarium-card");
  const stub = Card.getStubConfig({}, ["sensor.hydrao_shower_volume", "sensor.hydrao_shower_temperature"]);

  it("only contains options that exist in the editor schema", () => {
    const names = editorFields().map((f) => f.name);
    for (const key of Object.keys(stub)) expect(names, key).toContain(key);
  });

  it("picks a shower entity and a temperature entity when they exist", () => {
    expect(stub.entity).toBe("sensor.hydrao_shower_volume");
    expect(stub.temperature_entity).toBe("sensor.hydrao_shower_temperature");
  });

  it("falls back to the first entity, then to an empty string", () => {
    expect(Card.getStubConfig({}, ["sensor.other"]).entity).toBe("sensor.other");
    expect(Card.getStubConfig({}, []).entity).toBe("");
    expect(Card.getStubConfig({}, ["sensor.other"]).temperature_entity).toBe("");
  });

  it("is accepted by setConfig()", () => {
    const el = new Card();
    expect(() => el.setConfig(stub)).not.toThrow();
  });

  it("does not contain any removed option", () => {
    for (const key of LEGACY_CONFIG_KEYS) expect(stub).not.toHaveProperty(key);
  });
});

describe("removed options", () => {
  it("setConfig() drops legacy keys found in a saved dashboard", () => {
    const Card = customElements.get("shower-aquarium-card");
    const el = new Card();
    el.setConfig({ entity: "sensor.shower_volume", night_entity: "sun.sun", night_lux_threshold: 5, theme: "saltwater" });
    for (const key of LEGACY_CONFIG_KEYS) expect(el._config).not.toHaveProperty(key);
    expect(el._config.theme).toBe("saltwater");
  });

  it("the card has no night state or night renderer left", () => {
    const el = cardWithMinimalConfig();
    expect(el).not.toHaveProperty("_isNight");
    expect(el).not.toHaveProperty("_nightProgress");
    expect(typeof el._renderNightOverlay).toBe("undefined");
  });
});
