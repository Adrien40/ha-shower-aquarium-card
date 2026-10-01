// @vitest-environment happy-dom
//
// Keyboard and screen reader access: feeding the fish and knocking on the
// glass used to be possible only with a mouse or a finger. They are now also
// real <button> elements, which the browser makes focusable and operable with
// Enter and Space, plus a live region that says what happened.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { cardStyles } from "./styles.js";
import enTranslations from "../translations/en.json";
import frTranslations from "../translations/fr.json";

let realRaf;
beforeEach(() => {
  realRaf = window.requestAnimationFrame;
  window.requestAnimationFrame = () => 1;
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  window.requestAnimationFrame = realRaf;
  window.matchMedia = undefined;
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const hass = (volume, temp, language = "en") => ({
  language,
  states: {
    "sensor.v": { state: String(volume), last_changed: new Date().toISOString() },
    "sensor.t": { state: String(temp), last_changed: new Date().toISOString() },
  },
});

async function mount(config = {}, { volume = 12, temp = 34, language = "en" } = {}) {
  const el = new (customElements.get("shower-aquarium-card"))();
  el.setConfig({ entity: "sensor.v", temperature_entity: "sensor.t", fish_count: 4, ...config });
  el.hass = hass(volume, temp, language);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

// The feed and knock buttons; the biotope button is tested on its own (see swipe-biotope.test.js).
const buttons = (el) => [...el.shadowRoot.querySelectorAll(".keyboard-actions button")].slice(0, 2);
const live = (el) => el.shadowRoot.querySelector(".sr-only[role='status']");

// ---------------------------------------------------------------------------
describe("the actions are real buttons", () => {
  it("offers a feed button and a knock button, in that order, as native <button type=button>", async () => {
    const el = await mount();
    const [feed, knock] = buttons(el);
    expect(buttons(el)).toHaveLength(2);
    expect(feed.tagName).toBe("BUTTON");
    expect(knock.tagName).toBe("BUTTON");
    expect(feed.getAttribute("type")).toBe("button");
    expect(feed.textContent.trim()).toBe(enTranslations.action_feed);
    expect(knock.textContent.trim()).toBe(enTranslations.action_knock);
  });

  it("groups them under a translated label", async () => {
    const en = await mount();
    const group = en.shadowRoot.querySelector(".keyboard-actions");
    expect(group.getAttribute("role")).toBe("group");
    expect(group.getAttribute("aria-label")).toBe(enTranslations.aria_actions);
    const fr = await mount({}, { language: "fr" });
    expect(fr.shadowRoot.querySelector(".keyboard-actions").getAttribute("aria-label")).toBe(frTranslations.aria_actions);
  });

  it("labels the buttons in the language of the user", async () => {
    const fr = await mount({}, { language: "fr" });
    expect(buttons(fr).map((b) => b.textContent.trim())).toEqual([frTranslations.action_feed, frTranslations.action_knock]);
    expect(frTranslations.action_feed).not.toBe(enTranslations.action_feed);
  });

  it("keeps the drawing itself a plain image: no tab stop, no key handler to emulate a button", async () => {
    const el = await mount();
    const svg = el.shadowRoot.querySelector("svg");
    expect(svg.getAttribute("role")).toBe("img");
    expect(svg.hasAttribute("tabindex")).toBe(false);
  });

  it("has a polite live region for announcements", async () => {
    const el = await mount();
    expect(live(el)).not.toBeNull();
    expect(live(el).getAttribute("aria-live")).toBe("polite");
    expect(live(el).textContent.trim()).toBe("");
  });

  it("the buttons are also present in fullscreen mode", async () => {
    const el = await mount({ fullscreen: true });
    expect(buttons(el)).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
describe("feeding with the keyboard", () => {
  it("drops fish food at the middle of the surface", async () => {
    const el = await mount();
    const surface = el._tankState().waterSurfaceY;
    buttons(el)[0].click();
    expect(el._food).toHaveLength(6);
    for (const flake of el._food) {
      expect(Math.abs(flake.x - 512)).toBeLessThanOrEqual(35);
      // Just under the water surface (createFlakes adds 2 px and up to 12 px).
      expect(flake.y).toBeGreaterThanOrEqual(surface + 2);
      expect(flake.y).toBeLessThan(surface + 2 + 12 + 1);
    }
  });

  it("says so, in the language of the user", async () => {
    const en = await mount();
    buttons(en)[0].click();
    await en.updateComplete;
    expect(live(en).textContent.trim()).toBe(enTranslations.aria_food_dropped);
    const fr = await mount({}, { language: "fr" });
    buttons(fr)[0].click();
    await fr.updateComplete;
    expect(live(fr).textContent.trim()).toBe(frTranslations.aria_food_dropped);
  });

  it("announces again when the same action is repeated (the text must change to be read)", async () => {
    const el = await mount();
    buttons(el)[0].click();
    const first = el._announcement;
    buttons(el)[0].click();
    const second = el._announcement;
    buttons(el)[0].click();
    expect(second).not.toBe(first);
    expect(second.trim()).toBe(first.trim());
    expect(el._announcement).toBe(first);
  });

  it("keeps at most 30 flakes in the water, like a tap does", async () => {
    const el = await mount();
    for (let i = 0; i < 10; i++) buttons(el)[0].click();
    expect(el._food).toHaveLength(30);
  });

  it("redraws so the flakes appear", async () => {
    const el = await mount();
    const render = vi.spyOn(el, "render");
    buttons(el)[0].click();
    await el.updateComplete;
    expect(render).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
describe("knocking on the glass with the keyboard", () => {
  it("makes a ripple in the middle of the water and startles the fish nearby", async () => {
    const el = await mount({}, { volume: 0 });
    el._fishes = [{ x: 450, y: 290, dir: 1, scare: 0, deathProgress: 0 }, { x: 990, y: 100, dir: 1, scale: 1.4, scare: 0, deathProgress: 0 }];
    buttons(el)[1].click();
    expect(el._ripples).toHaveLength(1);
    // Full tank: the water goes from y = 15 to y = 565, so its middle is y = 290.
    expect(el._ripples[0]).toMatchObject({ x: 512, y: 290 });
    expect(el._fishes[0].scare).toBeGreaterThan(0);
    expect(el._fishes[1].scare).toBe(0);
  });

  it("says so, in the language of the user", async () => {
    const en = await mount();
    buttons(en)[1].click();
    await en.updateComplete;
    expect(live(en).textContent.trim()).toBe(enTranslations.aria_knocked);
    const fr = await mount({}, { language: "fr" });
    buttons(fr)[1].click();
    await fr.updateComplete;
    expect(live(fr).textContent.trim()).toBe(frTranslations.aria_knocked);
  });

  it("does not drop any food", async () => {
    const el = await mount();
    buttons(el)[1].click();
    expect(el._food).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
describe("when nothing can happen, the buttons say so", () => {
  it.each([
    ["the animals are dead (too hot)", { volume: 5, temp: 50 }],
    ["the tank is drained", { volume: 70, temp: 34 }],
  ])("are disabled and inert when %s", async (_name, data) => {
    const el = await mount({}, data);
    for (const button of buttons(el)) expect(button.hasAttribute("disabled")).toBe(true);
    el._onFeedButton();
    el._onKnockButton();
    expect(el._food).toEqual([]);
    expect(el._ripples).toEqual([]);
    expect(el._announcement).toBe("");
  });

  it("are disabled and inert when the system asks for reduced motion (nothing would ever remove the food)", async () => {
    window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
    const el = await mount();
    for (const button of buttons(el)) expect(button.hasAttribute("disabled")).toBe(true);
    el._onFeedButton();
    expect(el._food).toEqual([]);
    expect(el._announcement).toBe("");
  });

  it("are enabled in a living tank", async () => {
    const el = await mount();
    for (const button of buttons(el)) expect(button.hasAttribute("disabled")).toBe(false);
  });

  it("become usable again when the data recovers", async () => {
    const el = await mount({}, { volume: 5, temp: 50 });
    expect(buttons(el)[0].hasAttribute("disabled")).toBe(true);
    el.hass = hass(5, 30);
    await el.updateComplete;
    expect(buttons(el)[0].hasAttribute("disabled")).toBe(false);
  });

  it("do nothing on a card that has no configuration or data yet", () => {
    const el = new (customElements.get("shower-aquarium-card"))();
    expect(() => {
      el._onFeedButton();
      el._onKnockButton();
    }).not.toThrow();
    expect(el._announcement).toBe("");
  });
});

// ---------------------------------------------------------------------------
describe("the mouse and touch behaviour is unchanged", () => {
  const tap = (el, x, y) => {
    el._eventToSvgPoint = () => ({ x, y });
    el._onTankTap({});
  };

  it("a tap near the surface still feeds, a tap in the water still knocks", async () => {
    const el = await mount({}, { volume: 0 });
    tap(el, 300, 20);
    expect(el._food).toHaveLength(6);
    tap(el, 300, 300);
    expect(el._ripples).toHaveLength(1);
  });

  it("a tap stays silent: the announcements are for keyboard and screen reader users", async () => {
    const el = await mount({}, { volume: 0 });
    tap(el, 300, 20);
    tap(el, 300, 300);
    expect(el._announcement).toBe("");
  });

  it("a tap and the feed button do the same thing", async () => {
    const byTap = await mount({}, { volume: 0 });
    tap(byTap, 512, 20);
    const byKey = await mount({}, { volume: 0 });
    byKey._onFeedButton();
    expect(byKey._food).toHaveLength(byTap._food.length);
    expect(byKey._food.every((f) => Math.abs(f.x - 512) <= 35)).toBe(true);
  });

  it("food dropped by the keyboard sinks and is eaten like any other", async () => {
    const el = await mount({}, { volume: 0 });
    el._fishes = [{ species: 0, x: 500, y: 200, vx: 0, vy: 0, dir: 1, scale: 1.4, scare: 0, deathProgress: 0 }];
    el._onFeedButton();
    for (let i = 0; i < 4; i++) el._updatePhysics(1000 + i * 17);
    expect(el._food.every((f) => f.y > 15)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
describe("the shared helpers", () => {
  it("_tankState() describes the tank from the cached values", async () => {
    const el = await mount({ survival_volume: 10 }, { volume: 30, temp: 34 });
    const tank = el._tankState();
    expect(tank.waterRatio).toBeCloseTo(0.5, 10);
    expect(tank.isDead).toBe(false);
    expect(tank.tankBottom).toBe(565);
  });

  it("_interactiveTank() is the tank when it can be used, and null otherwise", async () => {
    const living = await mount();
    expect(living._interactiveTank()).toMatchObject({ isDead: false });
    const dead = await mount({}, { temp: 50 });
    expect(dead._interactiveTank()).toBeNull();
    const empty = await mount({}, { volume: 70 });
    expect(empty._interactiveTank()).toBeNull();
    const noConfig = new (customElements.get("shower-aquarium-card"))();
    expect(noConfig._interactiveTank()).toBeNull();
  });

  it("translation keys of the announcements exist in both languages", () => {
    for (const key of ["action_feed", "action_knock", "aria_actions", "aria_food_dropped", "aria_knocked"]) {
      expect(enTranslations[key], key).toBeTypeOf("string");
      expect(frTranslations[key], key).toBeTypeOf("string");
    }
  });
});

// ---------------------------------------------------------------------------
// The buttons are invisible at rest. If a style change hid them with
// display:none or visibility:hidden they would also vanish for the keyboard and
// for screen readers, and this whole feature would silently stop working.
describe("the styles keep the buttons reachable", () => {
  const css = cardStyles.cssText;
  const block = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
    return match ? match[1] : "";
  };

  it("hides the buttons visually at rest, without removing them from the page", () => {
    const rest = block(".kb-button");
    expect(rest).toContain("opacity: 0");
    expect(rest).toContain("clip-path: inset(50%)");
    expect(rest).not.toMatch(/display:\s*none/);
    expect(rest).not.toMatch(/visibility:\s*hidden/);
  });

  it("shows them, with a visible focus ring, as soon as the keyboard is in the group", () => {
    const shown = block(".keyboard-actions:focus-within .kb-button");
    expect(shown).toContain("opacity: 1");
    expect(shown).toContain("clip-path: none");
    expect(css).toMatch(/\.kb-button:focus-visible\s*\{[^}]*outline:\s*3px/);
  });

  it("keeps the announcements readable by screen readers without displaying them", () => {
    const hidden = block(".sr-only");
    expect(hidden).toContain("clip-path: inset(50%)");
    expect(hidden).not.toMatch(/display:\s*none/);
    expect(hidden).not.toMatch(/visibility:\s*hidden/);
  });

  it("puts the group above the drawing, inside the tank area", () => {
    const group = block(".keyboard-actions");
    expect(group).toContain("position: absolute");
    expect(group).toMatch(/z-index:\s*[1-9]/);
  });

  it("styles a disabled button differently", () => {
    expect(css).toMatch(/\.kb-button:disabled\s*\{[^}]*not-allowed/);
  });

  it("the helper finds nothing for an unknown selector (sanity check of this guard)", () => {
    expect(block(".does-not-exist")).toBe("");
  });
});
