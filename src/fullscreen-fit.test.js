// @vitest-environment happy-dom
//
// Fullscreen mode: the drawing takes the shape of the screen instead of being
// stretched to it. The screen is measured with a ResizeObserver (replaced here
// by a controllable fake).
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { REEF_PILE } from "./reef-layout.js";

class FakeResizeObserver {
  static instances = [];
  constructor(callback) {
    this.callback = callback;
    this.observe = vi.fn();
    this.disconnect = vi.fn();
    FakeResizeObserver.instances.push(this);
  }
  emit(...sizes) {
    this.callback(sizes.map(([width, height]) => ({ contentRect: { width, height } })));
  }
}

let saved;
beforeEach(() => {
  saved = { raf: window.requestAnimationFrame, ro: window.ResizeObserver };
  FakeResizeObserver.instances = [];
  window.ResizeObserver = FakeResizeObserver;
  window.requestAnimationFrame = () => 1;
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  window.requestAnimationFrame = saved.raf;
  window.ResizeObserver = saved.ro;
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const observer = () => FakeResizeObserver.instances.at(-1);

async function mount(config = {}, volume = 12, temp = 34) {
  const el = new (customElements.get("shower-aquarium-card"))();
  el.setConfig({ entity: "sensor.v", temperature_entity: "sensor.t", theme: "saltwater", fish_count: 5, ...config });
  el.hass = {
    language: "en",
    states: {
      "sensor.v": { state: String(volume), last_changed: new Date().toISOString() },
      "sensor.t": { state: String(temp), last_changed: new Date().toISOString() },
    },
  };
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const svg = (el) => el.shadowRoot.querySelector("svg");
const viewBoxHeight = (el) => Number(svg(el).getAttribute("viewBox").split(" ")[3]);

// ---------------------------------------------------------------------------
describe("the drawing is never stretched", () => {
  it.each([
    ["fullscreen", { fullscreen: true }],
    ["normal", {}],
  ])("%s mode keeps the proportions (preserveAspectRatio is 'meet', never 'none')", async (_name, config) => {
    const el = await mount(config);
    expect(svg(el).getAttribute("preserveAspectRatio")).toBe("xMidYMid meet");
  });

  it("fullscreen mode without a measured screen still draws 1024 x 600", async () => {
    const el = await mount({ fullscreen: true });
    expect(svg(el).getAttribute("viewBox")).toBe("0 0 1024 600");
  });

  it.each([
    [1280, 800, 640],
    [1920, 1080, 576],
    [1024, 768, 768],
    [300, 600, 2048],
    [900, 300, 341],
  ])("a %s x %s screen is drawn %s units high", async (width, height, expected) => {
    const el = await mount({ fullscreen: true });
    observer().emit([width, height]);
    await el.updateComplete;
    expect(svg(el).getAttribute("viewBox")).toBe(`0 0 1024 ${expected}`);
  });

  it("the viewBox has the shape of the screen for a range of realistic screens", async () => {
    const el = await mount({ fullscreen: true });
    for (const [w, h] of [[1280, 720], [1366, 768], [1440, 900], [2560, 1440], [1080, 1920], [800, 480]]) {
      observer().emit([w, h]);
      await el.updateComplete;
      const [, , vw, vh] = svg(el).getAttribute("viewBox").split(" ").map(Number);
      expect(Math.abs(vw / vh - w / h)).toBeLessThan(0.005);
    }
  });

  it("the tank fills the whole fullscreen drawing", async () => {
    const el = await mount({ fullscreen: true });
    observer().emit([1280, 800]);
    await el.updateComplete;
    const height = viewBoxHeight(el);
    // The clip covers the whole drawing, and the algae layer too.
    expect(el.shadowRoot.querySelector("clipPath rect").getAttribute("height")).toBe(String(height));
    expect(el.shadowRoot.innerHTML).toContain(`height="${height}"`);
  });
});

// ---------------------------------------------------------------------------
describe("the simulation follows the size of the tank", () => {
  it("the shrimp and the crab walk on the new sand level", async () => {
    const el = await mount({ fullscreen: true });
    observer().emit([300, 600]); // portrait: 2048 high
    el._updatePhysics(1000);
    expect(el._shrimp.y).toBe(2048 - 25);
    // The crab stands on the flat rock of the pile, at three quarters of its height.
    expect(el._crab.y).toBe(2048 - (REEF_PILE.ledge + 30));
    expect(el._goby.y).toBe(2048 - 14);
  });

  it("the bottom snail is on the sand of the tall tank, not floating in the water", async () => {
    const el = await mount({ fullscreen: true });
    observer().emit([300, 600]);
    el._updatePhysics(1000);
    expect(el._snails.find((s) => s.type === "bottom").y).toBe(2048 - 10);
  });

  it("the bottom snail is on the sand in the normal mode too (it used to hide below the glass)", async () => {
    const el = await mount({});
    el._updatePhysics(1000);
    const snail = el._snails.find((s) => s.type === "bottom");
    // Normal mode: the sand ends at canvas height - 35 = 565.
    expect(snail.y).toBe(565 - 10);
    expect(snail.y).toBeLessThan(565);
  });

  it("fish swim inside the taller tank, all the way down", async () => {
    const el = await mount({ fullscreen: true }, 0);
    observer().emit([300, 600]);
    el._fishes.forEach((f) => (f.y = 1900));
    for (let i = 0; i < 5; i++) el._updatePhysics(1000 + i * 17);
    expect(Math.max(...el._fishes.map((f) => f.y))).toBeGreaterThan(600);
    expect(Math.max(...el._fishes.map((f) => f.y))).toBeLessThanOrEqual(2048 - 45);
  });

  it("the water level uses the whole new height", async () => {
    const el = await mount({ fullscreen: true, survival_volume: 10 }, 30); // half of the 60 L
    observer().emit([300, 600]);
    await el.updateComplete;
    expect(el.shadowRoot.innerHTML).toContain(`y="${2048 / 2 - 5}"`);
  });

  it("the cost stays at the top of the drawing, whatever its height", async () => {
    const el = await mount({ fullscreen: true, show_cost: true });
    observer().emit([1280, 800]);
    await el.updateComplete;
    expect(el.shadowRoot.innerHTML).toContain(`translate(512, 96)`);
  });

  it("going back to the normal mode restores the configured aspect ratio", async () => {
    const el = await mount({ fullscreen: true, aspect_ratio_width: 16, aspect_ratio_height: 9 });
    observer().emit([300, 600]);
    await el.updateComplete;
    expect(viewBoxHeight(el)).toBe(2048);
    el.setConfig({ ...el._config, fullscreen: false });
    await el.updateComplete;
    expect(viewBoxHeight(el)).toBe(576);
  });

  it("a card switched to fullscreen later uses the size it already measured", async () => {
    const el = await mount({});
    observer().emit([1280, 800]); // normal mode: ignored
    el.setConfig({ ...el._config, fullscreen: true });
    await el.updateComplete;
    expect(viewBoxHeight(el)).toBe(600); // not measured while it was not fullscreen
    observer().emit([1280, 800]);
    await el.updateComplete;
    expect(viewBoxHeight(el)).toBe(640);
  });
});

// ---------------------------------------------------------------------------
describe("measuring the screen", () => {
  it("observes the card itself", async () => {
    const el = await mount({ fullscreen: true });
    expect(observer().observe).toHaveBeenCalledWith(el);
  });

  it("uses the most recent measurement when several arrive at once", async () => {
    const el = await mount({ fullscreen: true });
    observer().emit([1280, 800], [1024, 768]);
    expect(el._viewport).toEqual({ width: 1024, height: 768 });
  });

  it("ignores an empty list of measurements", async () => {
    const el = await mount({ fullscreen: true });
    expect(() => observer().callback([])).not.toThrow();
    expect(el._viewport).toBeNull();
  });

  it("the normal mode ignores every measurement and never redraws because of one", async () => {
    const el = await mount({});
    const render = vi.spyOn(el, "render");
    observer().emit([1280, 800]);
    await el.updateComplete;
    expect(el._viewport).toBeNull();
    expect(render).not.toHaveBeenCalled();
  });

  it("redraws when the shape of the screen changes", async () => {
    const el = await mount({ fullscreen: true });
    const render = vi.spyOn(el, "render");
    observer().emit([1280, 800]);
    await el.updateComplete;
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("does not redraw when a resize leaves the drawing height unchanged", async () => {
    const el = await mount({ fullscreen: true });
    observer().emit([1280, 800]);
    await el.updateComplete;
    const render = vi.spyOn(el, "render");
    observer().emit([1281, 800]); // same rounded height (640)
    observer().emit([2560, 1600]); // a bigger screen of the same shape
    await el.updateComplete;
    expect(render).not.toHaveBeenCalled();
    expect(el._viewport).toEqual({ width: 2560, height: 1600 });
  });

  it("disconnects the observer when the card leaves the page", async () => {
    const el = await mount({ fullscreen: true });
    const obs = observer();
    el.remove();
    expect(obs.disconnect).toHaveBeenCalled();
    expect(el._resizeObserver).toBeNull();
  });

  it("works in a browser without ResizeObserver: the default 1024 x 600 is used", async () => {
    window.ResizeObserver = undefined;
    const el = await mount({ fullscreen: true });
    expect(el._resizeObserver).toBeNull();
    expect(svg(el).getAttribute("viewBox")).toBe("0 0 1024 600");
    el.remove();
  });
});

// ---------------------------------------------------------------------------
describe("resizing with motion disabled", () => {
  beforeEach(() => {
    window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
  });

  it("settles the still scene into the new tank (no loop runs to do it)", async () => {
    const el = await mount({ fullscreen: true }, 0);
    expect(el._motionAllowed).toBe(false);
    const settle = vi.spyOn(el, "_settleScene");
    observer().emit([300, 600]);
    expect(settle).toHaveBeenCalledTimes(1);
    expect(el._shrimp.y).toBe(2048 - 25);
  });
});

// ---------------------------------------------------------------------------
describe("taps stay accurate on a resized drawing", () => {
  it("a tap is converted with the screen matrix, so it lands where the finger is", async () => {
    const el = await mount({ fullscreen: true }, 0);
    observer().emit([1280, 800]);
    await el.updateComplete;
    // The screen matrix of a 1280 x 800 screen showing a 1024 x 640 drawing: 1.25 px per unit.
    const target = {
      getScreenCTM: () => ({ inverse: () => ({ scale: 1 / 1.25 }) }),
      createSVGPoint: () => ({
        x: 0,
        y: 0,
        matrixTransform(m) {
          return { x: this.x * m.scale, y: this.y * m.scale };
        },
      }),
    };
    expect(el._eventToSvgPoint({ currentTarget: target, clientX: 640, clientY: 400 })).toEqual({ x: 512, y: 320 });
  });
});
