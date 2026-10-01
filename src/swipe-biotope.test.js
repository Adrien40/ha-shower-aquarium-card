// @vitest-environment happy-dom
//
// A horizontal swipe on the tank changes the biotope (freshwater, saltwater,
// coldwater). The choice is kept on the device, the name of the new biotope is
// shown for a moment, and a button gives the keyboard the same action.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { classifySwipe, nextBiotope, BIOTOPES, SWIPE, detectHydraoEntities } from "./pure.js";
import { renderBiotopeNotice } from "./render/hud.js";
import { CARD_EDITOR_SCHEMA, FIELD_LABEL_KEYS, HELPER_KEYS } from "./card-editor.js";
import enTranslations from "../translations/en.json";
import frTranslations from "../translations/fr.json";

const Card = () => customElements.get("shower-aquarium-card");

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] });
  vi.setSystemTime(1_700_000_000_000);
  window.requestAnimationFrame = () => 1;
  window.localStorage.clear();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  document.body.innerHTML = "";
});

const hass = (volume = 12) => ({
  language: "en",
  states: { "sensor.v": { state: String(volume), last_changed: new Date().toISOString() }, "sensor.t": { state: "34", last_changed: new Date().toISOString() } },
});
async function mount(config = {}, volume = 12) {
  const el = new (Card())();
  el.setConfig({ entity: "sensor.v", temperature_entity: "sensor.t", ...config });
  el.hass = hass(volume);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}
const svgOf = (el) => el.shadowRoot.querySelector("svg");
const pointer = (type, x, y) => new MouseEvent(type, { clientX: x, clientY: y, bubbles: true });
/** A finger that goes from (x0, y0) to (x1, y1) in `ms` milliseconds. */
async function swipe(el, [x0, y0], [x1, y1], ms = 200) {
  svgOf(el).dispatchEvent(pointer("pointerdown", x0, y0));
  vi.setSystemTime(Date.now() + ms);
  svgOf(el).dispatchEvent(pointer("pointerup", x1, y1));
  await el.updateComplete;
}

describe("classifySwipe()", () => {
  it.each([
    [-120, 5, 200, 1],
    [120, -5, 200, -1],
    [-61, 0, 200, 1],
    [-59, 0, 200, 0],
    [-200, 0, SWIPE.maxDurationMs, 1],
    [-200, 0, SWIPE.maxDurationMs + 1, 0],
    [-150, 100, 200, 0],
    [-160, 100, 200, 1],
    [0, 300, 200, 0],
    [0, 0, 100, 0],
  ])("a move of (%s, %s) in %s ms is %s", (dx, dy, ms, expected) => {
    expect(classifySwipe(dx, dy, ms)).toBe(expected);
  });
});

describe("nextBiotope()", () => {
  it("goes through the biotopes and wraps round, both ways", () => {
    expect(BIOTOPES).toEqual(["freshwater", "saltwater", "coldwater"]);
    expect(nextBiotope("freshwater", 1)).toBe("saltwater");
    expect(nextBiotope("saltwater", 1)).toBe("coldwater");
    expect(nextBiotope("coldwater", 1)).toBe("freshwater");
    expect(nextBiotope("freshwater", -1)).toBe("coldwater");
    expect(nextBiotope("coldwater", -1)).toBe("saltwater");
  });

  it("an unknown biotope counts as the first one", () => {
    expect(nextBiotope("lake", 1)).toBe("saltwater");
  });
});

describe("swiping the tank", () => {
  it("a swipe to the left goes to the next biotope: new fish, new creatures, and the new decor", async () => {
    const el = await mount({ theme: "freshwater" });
    const before = el._fishes;
    await swipe(el, [400, 200], [200, 210]);
    expect(el._themeKey).toBe("saltwater");
    expect(el._fishes).not.toBe(before);
    expect(el._fishes).toHaveLength(el._config.fish_count);
    expect(el.shadowRoot.innerHTML).toContain('id="reef-decor"');
    // The configuration itself is left alone.
    expect(el._config.theme).toBe("freshwater");
  });

  it("a swipe to the right goes to the previous one", async () => {
    const el = await mount({ theme: "freshwater" });
    await swipe(el, [200, 200], [420, 190]);
    expect(el._themeKey).toBe("coldwater");
  });

  it("puts the creatures back at their starting places and clears the food and the ripples", async () => {
    const el = await mount({ theme: "saltwater" });
    el._crab.s = 10;
    el._crab.hide = 1;
    el._food = [{ x: 1, y: 1 }];
    el._ripples = [{ x: 1, y: 1, born: Date.now() }];
    await swipe(el, [400, 200], [200, 200]);
    expect(el._crab.hide).toBe(0);
    expect(el._food).toEqual([]);
    expect(el._ripples).toEqual([]);
  });

  it("names the new biotope for two seconds, then lets it go", async () => {
    const el = await mount({ theme: "freshwater" });
    await swipe(el, [400, 200], [200, 200]);
    expect(el._biotopeNotice).toBe(enTranslations.theme_saltwater);
    expect(svgOf(el).textContent).toContain(enTranslations.theme_saltwater);
    vi.advanceTimersByTime(2100);
    await el.updateComplete;
    expect(el._biotopeNotice).toBe("");
    expect(svgOf(el).textContent).not.toContain(enTranslations.theme_saltwater);
  });

  it("two swipes in a row keep the name shown for two seconds after the last one", async () => {
    const el = await mount({ theme: "freshwater" });
    await swipe(el, [400, 200], [200, 200]);
    vi.advanceTimersByTime(1500);
    await swipe(el, [400, 200], [200, 200]);
    vi.advanceTimersByTime(1500);
    expect(el._biotopeNotice).toBe(enTranslations.theme_coldwater);
    vi.advanceTimersByTime(600);
    expect(el._biotopeNotice).toBe("");
  });

  it("tells screen readers", async () => {
    const el = await mount({ theme: "freshwater" });
    await swipe(el, [400, 200], [200, 200]);
    expect(el.shadowRoot.querySelector(".sr-only[role='status']").textContent.trim()).toBe(`Biotope: ${enTranslations.theme_saltwater}.`);
  });

  it("swiping back to the configured biotope forgets the choice", async () => {
    const el = await mount({ theme: "freshwater" });
    await swipe(el, [400, 200], [200, 200]);
    await swipe(el, [200, 200], [400, 200]);
    expect(el._themeOverride).toBeNull();
    expect(el._themeKey).toBe("freshwater");
  });

  it("is not a swipe when it is a tap, a scroll, a slow drag or when the option is off", async () => {
    const el = await mount({ theme: "freshwater" });
    await swipe(el, [400, 200], [410, 200]);
    await swipe(el, [400, 200], [380, 420]);
    await swipe(el, [400, 200], [100, 200], 2000);
    expect(el._themeKey).toBe("freshwater");
    const off = await mount({ theme: "freshwater", swipe_biotope: false });
    await swipe(off, [400, 200], [100, 200]);
    expect(off._themeKey).toBe("freshwater");
    expect(off._biotopeNotice).toBe("");
  });

  it("a finger that is taken away (the page scrolls) cancels the swipe", async () => {
    const el = await mount({ theme: "freshwater" });
    svgOf(el).dispatchEvent(pointer("pointerdown", 400, 200));
    svgOf(el).dispatchEvent(pointer("pointercancel", 0, 0));
    vi.setSystemTime(Date.now() + 100);
    svgOf(el).dispatchEvent(pointer("pointerup", 100, 200));
    expect(el._themeKey).toBe("freshwater");
  });

  it("a pointer that goes up without having gone down does nothing", async () => {
    const el = await mount({ theme: "freshwater" });
    svgOf(el).dispatchEvent(pointer("pointerup", 100, 200));
    expect(el._themeKey).toBe("freshwater");
  });

  it("the click that ends a swipe does not drop food or knock on the glass", async () => {
    const el = await mount({ theme: "freshwater" });
    await swipe(el, [400, 200], [200, 200]);
    vi.setSystemTime(Date.now() + 100);
    svgOf(el).dispatchEvent(new MouseEvent("click", { clientX: 200, clientY: 200, bubbles: true }));
    expect(el._ripples).toEqual([]);
    expect(el._food).toEqual([]);
    // A tap a moment later is a tap again.
    vi.setSystemTime(Date.now() + 1000);
    el._onTankTap = vi.fn(el._onTankTap.bind(el));
    el._onKnockButton();
    expect(el._ripples).toHaveLength(1);
  });

  it("works in fullscreen too", async () => {
    const el = await mount({ theme: "coldwater", fullscreen: true });
    await swipe(el, [400, 200], [200, 200]);
    expect(el._themeKey).toBe("freshwater");
  });

  it("the animation uses the biotope that was swiped to (the clownfish stay near their anemone)", async () => {
    const el = await mount({ theme: "freshwater" });
    await swipe(el, [400, 200], [200, 200]);
    el._updatePhysics(1000);
    el._updatePhysics(1016);
    const clown = el._fishes.find((f) => f.species === 0);
    expect(clown.x).toBeLessThanOrEqual(380);
    expect(clown.x).toBeGreaterThanOrEqual(160);
  });
});

describe("remembering the choice on the device", () => {
  it("a new card with the same sensor and the same configuration finds the biotope again", async () => {
    const first = await mount({ theme: "freshwater" });
    await swipe(first, [400, 200], [200, 200]);
    const second = await mount({ theme: "freshwater" });
    expect(second._themeKey).toBe("saltwater");
    expect(second._fishes).toHaveLength(second._config.fish_count);
  });

  it("changing the biotope of the configuration starts over from the new one", async () => {
    const first = await mount({ theme: "freshwater" });
    await swipe(first, [400, 200], [200, 200]);
    const second = await mount({ theme: "coldwater" });
    expect(second._themeKey).toBe("coldwater");
  });

  it("each sensor has its own choice", async () => {
    const first = await mount({ theme: "freshwater" });
    await swipe(first, [400, 200], [200, 200]);
    const other = await mount({ entity: "sensor.other", theme: "freshwater" });
    expect(other._themeKey).toBe("freshwater");
  });

  it("is not restored when the option is off, nor from something that is not a saved choice", async () => {
    const first = await mount({ theme: "freshwater" });
    await swipe(first, [400, 200], [200, 200]);
    expect((await mount({ theme: "freshwater", swipe_biotope: false }))._themeKey).toBe("freshwater");
    window.localStorage.setItem("shower-aquarium-card:biotope:sensor.v", "{not json");
    expect((await mount({ theme: "freshwater" }))._themeKey).toBe("freshwater");
    window.localStorage.setItem("shower-aquarium-card:biotope:sensor.v", JSON.stringify({ base: "freshwater", chosen: "lake" }));
    expect((await mount({ theme: "freshwater" }))._themeKey).toBe("freshwater");
    window.localStorage.setItem("shower-aquarium-card:biotope:sensor.v", JSON.stringify({ base: "freshwater", chosen: "freshwater" }));
    expect((await mount({ theme: "freshwater" }))._themeKey).toBe("freshwater");
  });

  it("does not save anything from the preview of the editor", async () => {
    const el = new (Card())();
    el.preview = true;
    el.setConfig({ entity: "sensor.v", theme: "freshwater" });
    el.hass = hass();
    document.body.appendChild(el);
    await el.updateComplete;
    await swipe(el, [400, 200], [200, 200]);
    expect(el._themeKey).toBe("saltwater");
    expect(window.localStorage.getItem("shower-aquarium-card:biotope:sensor.v")).toBeNull();
  });

  it("still works when the device refuses to store anything", async () => {
    const real = Object.getOwnPropertyDescriptor(window, "localStorage");
    const denied = vi.fn(() => {
      throw new Error("denied");
    });
    Object.defineProperty(window, "localStorage", { configurable: true, value: { getItem: denied, setItem: denied } });
    try {
      const el = await mount({ theme: "freshwater" });
      await swipe(el, [400, 200], [200, 200]);
      expect(el._themeKey).toBe("saltwater");
      expect(denied.mock.calls.length).toBeGreaterThanOrEqual(2);
    } finally {
      Object.defineProperty(window, "localStorage", real);
    }
  });
});

describe("the button for the keyboard", () => {
  it("is the third button, always usable, and goes to the next biotope", async () => {
    const el = await mount({ theme: "freshwater" });
    const buttons = [...el.shadowRoot.querySelectorAll(".keyboard-actions button")];
    expect(buttons).toHaveLength(3);
    expect(buttons[2].textContent.trim()).toBe(enTranslations.action_biotope);
    expect(buttons[2].getAttribute("type")).toBe("button");
    buttons[2].click();
    await el.updateComplete;
    expect(el._themeKey).toBe("saltwater");
  });

  it("is also usable when the animals are dead or the tank is empty", async () => {
    const el = await mount({ theme: "freshwater" }, 200);
    const buttons = [...el.shadowRoot.querySelectorAll(".keyboard-actions button")];
    expect(buttons[0].hasAttribute("disabled")).toBe(true);
    expect(buttons[2].hasAttribute("disabled")).toBe(false);
  });

  it("is labelled in French for a French user", async () => {
    const el = new (Card())();
    el.setConfig({ entity: "sensor.v", theme: "freshwater" });
    el.hass = { ...hass(), language: "fr" };
    document.body.appendChild(el);
    await el.updateComplete;
    const button = el.shadowRoot.querySelectorAll(".keyboard-actions button")[2];
    expect(button.textContent.trim()).toBe(frTranslations.action_biotope);
  });
});

describe("the name of the biotope on the picture", () => {
  const text = (template) => template.strings.join("") + JSON.stringify(template.values);

  it("draws nothing when there is no name", () => {
    expect(text(renderBiotopeNotice("", 600))).not.toContain("<rect");
  });

  it("draws the name in the middle of the picture, on a pill wide enough for it", () => {
    const short = renderBiotopeNotice("Reef", 600);
    expect(JSON.stringify(short.values)).toContain("300");
    const long = renderBiotopeNotice("Coldwater (Goldfish) and more words", 600);
    expect(JSON.stringify(long.values)).toContain(`${-(Math.max(260, 35 * 22 + 70)) / 2}`);
    expect(short.strings.join("")).toContain("pointer-events");
  });
});

describe("the option in the editor", () => {
  const fields = CARD_EDITOR_SCHEMA.flatMap((f) => (f.type === "expandable" ? f.schema : [f]));

  it("is in the display section, with a label and a helper in both languages", () => {
    const field = fields.find((f) => f.name === "swipe_biotope");
    expect(field.default).toBe(true);
    expect(field.selector).toEqual({ boolean: {} });
    expect(enTranslations[FIELD_LABEL_KEYS.swipe_biotope]).toBeTruthy();
    expect(frTranslations[FIELD_LABEL_KEYS.swipe_biotope]).toBeTruthy();
    expect(enTranslations[HELPER_KEYS.swipe_biotope]).toBeTruthy();
    expect(frTranslations[HELPER_KEYS.swipe_biotope]).toBeTruthy();
  });

  it("explains what the age of the algae does", () => {
    expect(enTranslations[HELPER_KEYS.algae_age]).toContain("0");
    expect(frTranslations[HELPER_KEYS.algae_age]).toContain("0");
  });

  it("the style of the gauges comes right after the fullscreen option", () => {
    const names = fields.map((f) => f.name);
    expect(names.indexOf("gauge_style")).toBe(names.indexOf("fullscreen") + 1);
  });
});

describe("finding the Hydrao Custom entities", () => {
  it("also finds them among the states when the picker does not offer them (already on the dashboard)", () => {
    const hass = {
      states: {
        "sensor.hydrao_ab12_shower_volume": {},
        "sensor.hydrao_ab12_temperature": {},
        "number.hydrao_ab12_minimum_comfort_temperature": {},
        "sensor.hydrao_ab12_total_cumulative_shower_volume": {},
      },
    };
    expect(detectHydraoEntities(hass, ["sensor.other"])).toEqual({
      entity: "sensor.hydrao_ab12_shower_volume",
      temperature_entity: "sensor.hydrao_ab12_temperature",
      comfort_temp_entity: "number.hydrao_ab12_minimum_comfort_temperature",
    });
  });

  it("looks at every list it is given, and ignores one that is not a list", () => {
    const found = detectHydraoEntities(null, ["sensor.x"], ["sensor.hydrao_ab12_shower_volume"], undefined, "nope");
    expect(found.entity).toBe("sensor.hydrao_ab12_shower_volume");
  });

  it("the card picker takes them from the second list too, and else offers any sensor", () => {
    const stub = Card().getStubConfig({ states: {} }, ["light.kitchen", "sensor.something"], ["sensor.hydrao_ab12_shower_volume"]);
    expect(stub.entity).toBe("sensor.hydrao_ab12_shower_volume");
    const any = Card().getStubConfig({}, ["light.kitchen", "sensor.something"]);
    expect(any.entity).toBe("sensor.something");
  });
});

describe("the thermometer", () => {
  it("has a small bulb, joined to the tube, about one and a half times as wide", async () => {
    const el = await mount({ fullscreen: true }, 12);
    const bulb = el.shadowRoot.querySelector('circle[cx="62"][r="12"]');
    const tube = el.shadowRoot.querySelector('rect[rx="9"]');
    const tubeBottom = Number(tube.getAttribute("y")) + Number(tube.getAttribute("height"));
    expect(Number(bulb.getAttribute("cy")) - Number(bulb.getAttribute("r"))).toBeLessThanOrEqual(tubeBottom);
    expect(Number(bulb.getAttribute("r"))).toBeLessThan(Number(tube.getAttribute("width")));
  });
});
