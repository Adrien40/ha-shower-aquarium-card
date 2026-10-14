// @vitest-environment happy-dom
//
// Two options of the normal (not fullscreen) mode: the gauges of fullscreen mode
// can also be drawn on the picture (show_gauges), and the tiles under the
// picture can be removed (show_tiles).
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { CONFIG_DEFAULTS } from "./defaults.js";
import { normalizeConfig } from "./pure.js";

beforeEach(() => {
  window.requestAnimationFrame = () => 1;
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

async function mount(config = {}, volume = 12, { preview = false, lost = false } = {}) {
  const el = new (customElements.get("shower-aquarium-card"))();
  el.preview = preview;
  el.setConfig({ entity: "sensor.v", temperature_entity: "sensor.t", ...config });
  el.hass = {
    language: "en",
    states: {
      "sensor.v": { state: lost ? "unavailable" : String(volume), last_changed: new Date().toISOString() },
      "sensor.t": { state: "36", last_changed: new Date().toISOString() },
    },
  };
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}
const html = (el) => el.shadowRoot.innerHTML;
const hasGauges = (el) => html(el).includes('font-size="58"') || html(el).includes('font-size="34"');
const hasTiles = (el) => el.shadowRoot.querySelector(".metrics-grid") !== null;
const hasCostLabel = (el) => html(el).includes('translate(512, 96)');

describe("the defaults", () => {
  it("the tiles are shown and the gauges are not, as before", () => {
    expect(CONFIG_DEFAULTS.show_tiles).toBe(true);
    expect(CONFIG_DEFAULTS.show_gauges).toBe(false);
  });

  it("a card without these options looks as it did", async () => {
    const el = await mount();
    expect(hasTiles(el)).toBe(true);
    expect(hasGauges(el)).toBe(false);
  });

  it("they are plain options: nothing to correct in the configuration", () => {
    const { config, warnings } = normalizeConfig({ show_gauges: true, show_tiles: false });
    expect(config).toEqual({ show_gauges: true, show_tiles: false });
    expect(warnings).toEqual([]);
  });
});

describe("show_tiles", () => {
  it("false removes the tiles under the picture", async () => {
    const el = await mount({ show_tiles: false });
    expect(hasTiles(el)).toBe(false);
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });

  it("true keeps them, with the cost when it is enabled", async () => {
    const el = await mount({ show_tiles: true, show_cost: true });
    expect(hasTiles(el)).toBe(true);
    expect(html(el)).toContain("€");
  });

  it("changes nothing in fullscreen mode, where there are no tiles anyway", async () => {
    expect(hasTiles(await mount({ fullscreen: true, show_tiles: true }))).toBe(false);
    expect(hasTiles(await mount({ fullscreen: true, show_tiles: false }))).toBe(false);
  });

  it("does not hide the title of the card", async () => {
    const el = await mount({ show_tiles: false, title: "Shower" });
    expect(el.shadowRoot.querySelector(".card-title").textContent).toBe("Shower");
  });
});

describe("show_gauges", () => {
  it("draws the temperature and the volume on the picture of the normal mode", async () => {
    const el = await mount({ show_gauges: true });
    expect(hasGauges(el)).toBe(true);
    expect(el.shadowRoot.querySelector("svg").textContent).toContain("12.0");
    expect(el.shadowRoot.querySelector("svg").textContent).toContain("36.0°");
    // The tiles are still there.
    expect(hasTiles(el)).toBe(true);
  });

  it("follows the style of the gauges: thermometer or arcs", async () => {
    const thermometer = await mount({ show_gauges: true, gauge_style: "thermometer" });
    expect(thermometer.shadowRoot.querySelector('rect[rx="9"]')).not.toBeNull();
    const arcs = await mount({ show_gauges: true, gauge_style: "arc" });
    expect(arcs.shadowRoot.querySelector('rect[rx="9"]')).toBeNull();
    expect(arcs.shadowRoot.querySelectorAll("[stroke-dasharray]").length).toBeGreaterThan(0);
  });

  it("stays hidden while nothing is consumed, on a dashboard", async () => {
    expect(hasGauges(await mount({ show_gauges: true }, 0))).toBe(false);
  });

  it("is shown at 0 L in the preview of the editor, to be adjusted", async () => {
    expect(hasGauges(await mount({ show_gauges: true }, 0, { preview: true }))).toBe(true);
  });

  it("false keeps the picture clean, even with water running", async () => {
    expect(hasGauges(await mount({ show_gauges: false }, 30))).toBe(false);
  });

  it("works with the tiles removed: the aquarium alone, with its gauges", async () => {
    const el = await mount({ show_gauges: true, show_tiles: false });
    expect(hasGauges(el)).toBe(true);
    expect(hasTiles(el)).toBe(false);
  });

  it("is on in fullscreen mode whatever the option says", async () => {
    expect(hasGauges(await mount({ fullscreen: true, show_gauges: false }))).toBe(true);
  });

  it("writes the budget on the volume gauge when asked", async () => {
    const el = await mount({ show_gauges: true, show_budget: true, target_budget: 50 });
    expect(el.shadowRoot.querySelector("svg").textContent).toContain("/ 50");
  });
});

describe("the cost with the gauges", () => {
  it("is in its tile, not on the picture, while the tiles are shown", async () => {
    const el = await mount({ show_gauges: true, show_cost: true });
    expect(hasCostLabel(el)).toBe(false);
    expect(html(el)).toContain("€");
  });

  it("is written on the picture, between the gauges, once the tiles are removed", async () => {
    const el = await mount({ show_gauges: true, show_tiles: false, show_cost: true });
    expect(hasCostLabel(el)).toBe(true);
    expect(el.shadowRoot.querySelector("svg").textContent).toContain("€");
  });

  it("is nowhere when it is not enabled", async () => {
    const el = await mount({ show_gauges: true, show_tiles: false, show_cost: false });
    expect(hasCostLabel(el)).toBe(false);
  });

  it("is still on the picture in fullscreen mode", async () => {
    expect(hasCostLabel(await mount({ fullscreen: true, show_cost: true }))).toBe(true);
  });
});

describe("the notice of a lost sensor with the gauges", () => {
  const lostNotice = async (config) => {
    vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] });
    vi.setSystemTime(1_700_000_000_000);
    const el = await mount(config, 12);
    el.hass = { language: "en", states: { "sensor.v": { state: "unavailable", last_changed: new Date().toISOString() }, "sensor.t": { state: "36", last_changed: new Date().toISOString() } } };
    vi.setSystemTime(Date.now() + 61_000);
    el.requestUpdate();
    await el.updateComplete;
    const out = html(el);
    vi.useRealTimers();
    return out;
  };

  it("goes under the numbers when the gauges are shown", async () => {
    expect(await lostNotice({ show_gauges: true })).toContain("translate(0, 112)");
  });

  it("goes near the top when they are not", async () => {
    expect(await lostNotice({ show_gauges: false })).toContain("translate(0, 24)");
  });
});
