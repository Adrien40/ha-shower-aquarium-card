// @vitest-environment happy-dom
//
// Power saving: the animation loop only runs while the card is on screen, its
// tab is in the foreground and motion is allowed; redraws only happen when a
// displayed value changed. Browser APIs are replaced by controllable fakes.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";

class FakeIntersectionObserver {
  static instances = [];
  constructor(callback) {
    this.callback = callback;
    this.observe = vi.fn();
    this.disconnect = vi.fn();
    FakeIntersectionObserver.instances.push(this);
  }
  emit(...flags) {
    this.callback(flags.map((isIntersecting) => ({ isIntersecting })));
  }
}

let pageState;
let motionQuery;
let rafQueue;
let rafId;
let saved;

function installEnvironment({ reduced = false, intersectionObserver = true } = {}) {
  FakeIntersectionObserver.instances = [];
  pageState = "visible";
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => pageState });

  motionQuery = {
    matches: reduced,
    listeners: new Set(),
    addEventListener(_type, cb) {
      this.listeners.add(cb);
    },
    removeEventListener(_type, cb) {
      this.listeners.delete(cb);
    },
    change(matches) {
      this.matches = matches;
      this.listeners.forEach((cb) => cb({ matches }));
    },
  };
  window.matchMedia = vi.fn(() => motionQuery);
  window.IntersectionObserver = intersectionObserver ? FakeIntersectionObserver : undefined;

  rafQueue = [];
  rafId = 0;
  window.requestAnimationFrame = (cb) => {
    rafQueue.push(cb);
    return ++rafId;
  };
  window.cancelAnimationFrame = vi.fn();
}

beforeEach(() => {
  saved = {
    raf: window.requestAnimationFrame,
    caf: window.cancelAnimationFrame,
    io: window.IntersectionObserver,
    mm: window.matchMedia,
  };
  installEnvironment();
});

afterEach(() => {
  delete document.visibilityState;
  window.requestAnimationFrame = saved.raf;
  window.cancelAnimationFrame = saved.caf;
  window.IntersectionObserver = saved.io;
  window.matchMedia = saved.mm;
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const hass = (volume, temp, language = "en", extra = {}) => ({
  language,
  states: {
    "sensor.shower_volume": { state: String(volume), last_changed: new Date().toISOString() },
    ...(temp === undefined ? {} : { "sensor.shower_temp": { state: String(temp), last_changed: new Date().toISOString() } }),
    ...extra,
  },
});

async function mountCard(config = {}, volume = 12, temp) {
  const el = new (customElements.get("shower-aquarium-card"))();
  el.setConfig({ entity: "sensor.shower_volume", temperature_entity: "sensor.shower_temp", fish_count: 3, ...config });
  el.hass = hass(volume, temp);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const observer = () => FakeIntersectionObserver.instances.at(-1);
const setPage = (state) => {
  pageState = state;
  document.dispatchEvent(new Event("visibilitychange"));
};
const running = (el) => el._animationFrameId !== null;

// ---------------------------------------------------------------------------
describe("redraw only when a displayed value changed", () => {
  it("does not redraw when an unrelated entity changes", async () => {
    const el = await mountCard({}, 12);
    const render = vi.spyOn(el, "render");
    el.hass = hass(12, undefined, "en", { "light.kitchen": { state: "on" } });
    await el.updateComplete;
    expect(render).not.toHaveBeenCalled();
  });

  it("does not redraw when hass is replaced by an identical copy", async () => {
    const el = await mountCard({}, 12, 30);
    const render = vi.spyOn(el, "render");
    el.hass = hass(12, 30);
    await el.updateComplete;
    expect(render).not.toHaveBeenCalled();
  });

  it.each([
    ["volume", () => hass(13, 30)],
    ["temperature", () => hass(12, 31)],
    ["language", () => hass(12, 30, "fr")],
  ])("redraws when the %s changes", async (_what, next) => {
    const el = await mountCard({}, 12, 30);
    const render = vi.spyOn(el, "render");
    el.hass = next();
    await el.updateComplete;
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("redraws when the target budget entity changes", async () => {
    const el = await mountCard({ target_budget_entity: "input_number.budget" }, 12);
    el.hass = hass(12, undefined, "en", { "input_number.budget": { state: "60" } });
    await el.updateComplete;
    const render = vi.spyOn(el, "render");
    el.hass = hass(12, undefined, "en", { "input_number.budget": { state: "70" } });
    await el.updateComplete;
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("assigning _hass directly never schedules an update by itself", async () => {
    const el = await mountCard({}, 12);
    el._hass = hass(99);
    expect(el.isUpdatePending).toBe(false);
  });

  it("the displayed data follows the latest hass", async () => {
    const el = await mountCard({}, 12);
    el.hass = hass(20);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".metric-value").textContent).toContain("20.0");
  });
});

// ---------------------------------------------------------------------------
describe("browser tab visibility", () => {
  it("starts the loop when connected and visible", async () => {
    const el = await mountCard();
    expect(running(el)).toBe(true);
  });

  it("stops the loop when the tab goes to the background and restarts it when it returns", async () => {
    const el = await mountCard();
    setPage("hidden");
    expect(running(el)).toBe(false);
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
    setPage("visible");
    expect(running(el)).toBe(true);
  });

  it("does not redraw while hidden, and redraws the latest data on return", async () => {
    const el = await mountCard({}, 12);
    setPage("hidden");
    const render = vi.spyOn(el, "render");
    el.hass = hass(30);
    await el.updateComplete;
    expect(render).not.toHaveBeenCalled();
    setPage("visible");
    await el.updateComplete;
    expect(render).toHaveBeenCalled();
    expect(el.shadowRoot.querySelector(".metric-value").textContent).toContain("30.0");
  });

  it("shouldUpdate() follows the tab visibility", async () => {
    const el = await mountCard();
    expect(el.shouldUpdate()).toBe(true);
    setPage("hidden");
    expect(el.shouldUpdate()).toBe(false);
  });

  it("a card created while the tab is hidden starts stopped", async () => {
    pageState = "hidden";
    const el = await mountCard();
    expect(running(el)).toBe(false);
    setPage("visible");
    expect(running(el)).toBe(true);
  });

  it("a restart does not see the hidden time as one huge frame", async () => {
    const el = await mountCard();
    el._lastTimestamp = 5000;
    el._lastFrameTs = 5000;
    el._rafCount = 99;
    setPage("hidden");
    setPage("visible");
    expect(el._lastTimestamp).toBe(0);
    expect(el._lastFrameTs).toBe(0);
    expect(el._rafCount).toBe(0);
  });

  it("stops listening once the card leaves the page", async () => {
    const el = await mountCard();
    el.remove();
    expect(running(el)).toBe(false);
    const sync = vi.spyOn(el, "_syncAnimation");
    setPage("hidden");
    setPage("visible");
    expect(sync).not.toHaveBeenCalled();
    expect(running(el)).toBe(false);
  });

  it("can be attached again after being removed", async () => {
    const el = await mountCard();
    el.remove();
    document.body.appendChild(el);
    expect(running(el)).toBe(true);
    setPage("hidden");
    expect(running(el)).toBe(false);
  });

  it("_syncAnimation() on a disconnected card just stops the loop", () => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.shower_volume" });
    expect(() => el._syncAnimation()).not.toThrow();
    expect(running(el)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe("card scrolled out of view", () => {
  it("observes the card itself", async () => {
    const el = await mountCard();
    expect(observer().observe).toHaveBeenCalledWith(el);
  });

  it("pauses when the card leaves the viewport and resumes when it comes back", async () => {
    const el = await mountCard();
    observer().emit(false);
    expect(running(el)).toBe(false);
    expect(el.shouldUpdate()).toBe(false);
    observer().emit(true);
    expect(running(el)).toBe(true);
    expect(el.shouldUpdate()).toBe(true);
  });

  it("uses the most recent observation when several arrive at once", async () => {
    const el = await mountCard();
    observer().emit(false, true);
    expect(running(el)).toBe(true);
    observer().emit(true, false);
    expect(running(el)).toBe(false);
  });

  it("ignores an observation that changes nothing", async () => {
    const el = await mountCard();
    const spy = vi.spyOn(el, "_syncAnimation");
    observer().emit(true);
    expect(spy).not.toHaveBeenCalled();
  });

  it("ignores an empty observation list", async () => {
    const el = await mountCard();
    expect(() => observer().callback([])).not.toThrow();
    expect(running(el)).toBe(true);
  });

  it("stays hidden while either condition still says hidden", async () => {
    const el = await mountCard();
    observer().emit(false);
    setPage("hidden");
    setPage("visible");
    expect(running(el)).toBe(false);
    observer().emit(true);
    expect(running(el)).toBe(true);
  });

  it("disconnects the observer when the card is removed", async () => {
    const el = await mountCard();
    const obs = observer();
    el.remove();
    expect(obs.disconnect).toHaveBeenCalled();
    expect(el._intersectionObserver).toBeNull();
  });

  it("still works in a browser without IntersectionObserver", async () => {
    installEnvironment({ intersectionObserver: false });
    const el = await mountCard();
    expect(running(el)).toBe(true);
    expect(el._intersectionObserver).toBeNull();
    el.remove();
  });
});

// ---------------------------------------------------------------------------
describe("reduced motion", () => {
  it("does not start the loop when the system asks for reduced motion", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard();
    expect(el._motionAllowed).toBe(false);
    expect(running(el)).toBe(false);
    expect(rafQueue).toHaveLength(0);
  });

  it("still draws the aquarium", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard();
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });

  it("animates anyway when respect_reduced_motion is false", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard({ respect_reduced_motion: false });
    expect(el._motionAllowed).toBe(true);
    expect(running(el)).toBe(true);
  });

  it("follows the operating system setting while the page is open", async () => {
    const el = await mountCard();
    expect(running(el)).toBe(true);
    motionQuery.change(true);
    expect(running(el)).toBe(false);
    motionQuery.change(false);
    expect(running(el)).toBe(true);
  });

  it("reacts to a change of respect_reduced_motion in the configuration", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard();
    expect(running(el)).toBe(false);
    el.setConfig({ ...el._config, respect_reduced_motion: false });
    expect(running(el)).toBe(true);
    el.setConfig({ ...el._config, respect_reduced_motion: true });
    expect(running(el)).toBe(false);
  });

  it("stops listening to the setting when the card leaves the page", async () => {
    const el = await mountCard();
    expect(motionQuery.listeners.size).toBe(1);
    el.remove();
    expect(motionQuery.listeners.size).toBe(0);
  });

  it("works in a browser without matchMedia", async () => {
    window.matchMedia = undefined;
    const el = await mountCard();
    expect(el._motionAllowed).toBe(true);
    expect(running(el)).toBe(true);
    el.remove();
  });

  it("works with a legacy media query object that has no addEventListener", async () => {
    window.matchMedia = () => ({ matches: false });
    const el = await mountCard();
    expect(running(el)).toBe(true);
    expect(() => el.remove()).not.toThrow();
  });

  it("ignores taps: nothing would ever remove the food or the ripples", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard({}, 0);
    el._eventToSvgPoint = () => ({ x: 500, y: 20 });
    el._onTankTap({});
    el._eventToSvgPoint = () => ({ x: 500, y: 300 });
    el._onTankTap({});
    expect(el._food).toEqual([]);
    expect(el._ripples).toEqual([]);
  });

  it("never starts a bubble stream", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard({}, 10);
    el._flow = { lastVolume: 10, lastIncreaseAt: Date.now() - 9000, target: 0.8, showerActive: true };
    el._updatePhysics(1000);
    expect(el._flow.showerActive).toBe(false);
    el._flow = { lastVolume: 10, lastIncreaseAt: Date.now(), target: 0.8, showerActive: true };
    for (let i = 0; i < 10; i++) el._updatePhysics(1000 + i * 40);
    expect(el._flowIntensity).toBe(0);
    expect(el._flowBubbles.every((b) => !b.active)).toBe(true);
  });

  it("puts fish back into the water when the level drops", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard({}, 0);
    el._fishes.forEach((f) => (f.y = 60));
    el.hass = hass(45);
    await el.updateComplete;
    // 45 L used of 60 L: the surface is far below y = 60.
    expect(Math.min(...el._fishes.map((f) => f.y))).toBeGreaterThan(400);
  });

  it("finishes the death animation in one go when the water becomes deadly", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard({}, 5, 30);
    el.hass = hass(5, 50);
    await el.updateComplete;
    expect(el._deathProgress).toBe(1);
    expect(el._fishes.every((f) => f.deathProgress === 1)).toBe(true);
    expect(el.shadowRoot.innerHTML).not.toMatch(/NaN/);
  });

  it("settles a living tank with just two steps", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard({}, 5, 30);
    const spy = vi.spyOn(el, "_updatePhysics");
    el._settleScene();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("settles a dead tank with many steps so the animals reach the bottom", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard({}, 5, 50);
    const spy = vi.spyOn(el, "_updatePhysics");
    el._settleScene();
    expect(spy).toHaveBeenCalledTimes(120);
  });

  it("_settleScene() clears food and ripples and leaves the clock ready for a restart", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard({}, 5, 30);
    el._food = [{ x: 1, y: 1 }];
    el._ripples = [{ x: 1, y: 1, born: 0 }];
    el._settleScene();
    expect(el._food).toEqual([]);
    expect(el._ripples).toEqual([]);
    expect(el._lastTimestamp).toBe(0);
  });

  it("_settleScene() without a configuration does nothing", () => {
    const el = new (customElements.get("shower-aquarium-card"))();
    expect(() => el._settleScene()).not.toThrow();
  });

  it("while hidden nothing is settled; the still frame is prepared on return", async () => {
    installEnvironment({ reduced: true });
    const el = await mountCard({}, 0);
    setPage("hidden");
    const settle = vi.spyOn(el, "_settleScene");
    el.hass = hass(45);
    expect(settle).not.toHaveBeenCalled();
    setPage("visible");
    expect(settle).toHaveBeenCalledTimes(1);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".metric-value").textContent).toContain("45.0");
  });

  it("does not settle when motion is allowed (the loop does the work)", async () => {
    const el = await mountCard({}, 0);
    const settle = vi.spyOn(el, "_settleScene");
    el.hass = hass(45);
    expect(settle).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
describe("the animation loop itself", () => {
  it("keeps scheduling frames while running, and a paused card schedules none", async () => {
    const el = await mountCard();
    const before = rafQueue.length;
    rafQueue.shift()(1000);
    expect(rafQueue.length).toBe(before);
    setPage("hidden");
    rafQueue.length = 0;
    expect(rafQueue).toHaveLength(0);
    expect(running(el)).toBe(false);
  });

  it("a visible card with motion allowed draws frames that change the scene", async () => {
    const el = await mountCard();
    const fish = el._fishes[0];
    const x0 = fish.x;
    rafQueue.shift()(1000);
    rafQueue.shift()(1016.66);
    expect(fish.x).not.toBe(x0);
  });
});
