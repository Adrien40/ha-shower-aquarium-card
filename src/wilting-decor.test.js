// @vitest-environment happy-dom
//
// The plants, the corals and the anemone die with the tank: they shrink and fall
// over, and the tentacles of the anemone go limp instead of standing up in the air.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "lit";
import "./shower-aquarium-card.js";
import { wilt } from "./render/skin.js";
import { freshwaterDecor } from "./render/freshwater.js";
import { renderAnemoneTentacles } from "./render/saltwater.js";

beforeEach(() => {
  window.requestAnimationFrame = () => 1;
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const draw = (template) => {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  render(template, g);
  return g;
};

describe("wilt()", () => {
  it("leaves a living thing alone", () => {
    expect(wilt(100, 500, 40, 0.5, 0)).toBeUndefined();
    expect(wilt(100, 500, 40, 0.5, -1)).toBeUndefined();
    expect(wilt(100, 500, 40, 0.5, NaN)).toBeUndefined();
  });

  it("shrinks and tilts about its foot, in proportion to the death", () => {
    expect(wilt(100, 500, 40, 0.5, 1)).toBe("translate(100 500) rotate(40.0) scale(1 0.500) translate(-100 -500)");
    expect(wilt(100, 500, 40, 0.5, 0.5)).toBe("translate(100 500) rotate(20.0) scale(1 0.750) translate(-100 -500)");
  });

  it("never goes beyond the dead state", () => {
    expect(wilt(0, 0, 40, 0.5, 9)).toBe(wilt(0, 0, 40, 0.5, 1));
  });
});

describe("the plants of the freshwater tank", () => {
  const plants = (death) => draw(freshwaterDecor(565, "", "flat", true, death));
  const transforms = (g) => [...g.querySelectorAll("#freshwater-plants > g")].map((el) => el.getAttribute("transform"));

  it("stand up while the tank is alive: nothing is moved", () => {
    expect(transforms(plants(0))).toHaveLength(3);
    for (const t of transforms(plants(0))) expect(t).toBeFalsy();
    expect(freshwaterDecor(565, "", "flat", true).strings.join("")).toContain("freshwater-plants");
  });

  it("the three groups of plants fall over, each its own way, and shrink when the tank is dead", () => {
    const [bush, stem, blades] = transforms(plants(1));
    expect(bush).toMatch(/rotate\(-4\.0\) scale\(1 0\.450\)/);
    expect(stem).toMatch(/rotate\(72\.0\) scale\(1 0\.750\)/);
    expect(blades).toMatch(/rotate\(-68\.0\) scale\(1 0\.700\)/);
  });

  it("the stem falls to the right and the blades to the left", () => {
    const [, stem, blades] = transforms(plants(0.5));
    expect(Number(stem.match(/rotate\(([-\d.]+)/)[1])).toBeGreaterThan(0);
    expect(Number(blades.match(/rotate\(([-\d.]+)/)[1])).toBeLessThan(0);
  });

  it("fall a little more at each step of the death", () => {
    const angle = (death) => Number(transforms(plants(death))[1].match(/rotate\(([-\d.]+)/)[1]);
    expect(angle(0.25)).toBeLessThan(angle(0.5));
    expect(angle(0.5)).toBeLessThan(angle(1));
  });

  it("keep all their shapes while they wilt", () => {
    expect(plants(1).querySelectorAll("path").length).toBe(plants(0).querySelectorAll("path").length);
  });
});

describe("the anemone", () => {
  const tentacles = (death, time = 0) => draw(renderAnemoneTentacles({ _ambientTime: time, _config: { creature_style: "flat" } }, death));
  const angles = (g) => [...g.querySelectorAll("g")].map((el) => Number(el.getAttribute("transform").match(/rotate\(([-\d.]+)\)/)[1]));

  it("stands up while it is alive, the tentacles fanning out above it", () => {
    const up = angles(tentacles(0));
    expect(up).toHaveLength(27);
    // Up and out to the sides: never hanging down (the sway adds a few degrees at most).
    for (const a of up) expect(Math.abs(a)).toBeLessThan(105);
    expect(Math.min(...up)).toBeLessThan(-60);
    expect(Math.max(...up)).toBeGreaterThan(60);
  });

  it("goes limp when it is dead: every tentacle hangs outward and down, not in the air", () => {
    const limp = angles(tentacles(1));
    // More than 90 degrees from straight up on either side: pointing down.
    for (const a of limp) expect(Math.abs(a)).toBeGreaterThan(110);
    // The ones on the left hang to the left, those on the right to the right.
    expect(limp.some((a) => a < 0)).toBe(true);
    expect(limp.some((a) => a > 0)).toBe(true);
  });

  it("sways no more when it is dead", () => {
    expect(angles(tentacles(1, 0))).toEqual(angles(tentacles(1, 3)));
    expect(angles(tentacles(0, 0))).not.toEqual(angles(tentacles(0, 3)));
  });

  it("droops a little more at each step of the death", () => {
    const meanDown = (death) => {
      const a = angles(tentacles(death));
      return a.reduce((sum, x) => sum + Math.abs(x), 0) / a.length;
    };
    expect(meanDown(0)).toBeLessThan(meanDown(0.5));
    expect(meanDown(0.5)).toBeLessThan(meanDown(1));
  });

  it("they do not all hang to the same side", () => {
    const signs = angles(tentacles(1)).map(Math.sign);
    const right = signs.filter((x) => x > 0).length;
    expect(right).toBeGreaterThan(8);
    expect(signs.length - right).toBeGreaterThan(8);
  });
});

describe("in the card", () => {
  const mount = async (config) => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.v", temperature_entity: "sensor.t", ...config });
    el.hass = { language: "en", states: { "sensor.v": { state: "12", last_changed: new Date().toISOString() }, "sensor.t": { state: "34", last_changed: new Date().toISOString() } } };
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  };
  const die = async (el) => {
    el._deathProgress = 1;
    el.requestUpdate();
    await el.updateComplete;
  };

  it("the corals and the anemone of the reef shrink and fall over when the tank is dead", async () => {
    const el = await mount({ theme: "saltwater" });
    const living = el.shadowRoot.innerHTML;
    expect(living).not.toContain("rotate(-16.0)");
    await die(el);
    const dead = el.shadowRoot.innerHTML;
    for (const part of ["rotate(-16.0) scale(1 0.400)", "rotate(14.0) scale(1 0.450)", "rotate(12.0) scale(1 0.450)", "rotate(0.0) scale(1 0.600)", "rotate(0.0) scale(1 0.700)"]) expect(dead, part).toContain(part);
  });

  it("the anemone has its tentacles hanging when the tank is dead", async () => {
    const el = await mount({ theme: "saltwater" });
    await die(el);
    const angles = [...el.shadowRoot.querySelectorAll('#anemone g[transform^="translate"] g[transform^="translate"]')].map((g) => Number(g.getAttribute("transform").match(/rotate\(([-\d.]+)\)/)?.[1]));
    expect(angles.filter((a) => Math.abs(a) > 110).length).toBeGreaterThanOrEqual(27);
  });

  it("the plants of the freshwater tank fall over when it is dead, and stand up again when it recovers", async () => {
    const el = await mount({ theme: "freshwater" });
    await die(el);
    expect(el.shadowRoot.innerHTML).toContain("rotate(72.0)");
    el._deathProgress = 0;
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot.innerHTML).not.toContain("rotate(72.0)");
  });

  it("the light profile has them fall over too (it only leaves out the colour filter)", async () => {
    const el = await mount({ theme: "freshwater", animation_quality: "light" });
    await die(el);
    expect(el.shadowRoot.innerHTML).toContain("rotate(72.0)");
  });

  it("the coldwater tank has no plants to wither: only its pebbles", async () => {
    const el = await mount({ theme: "coldwater" });
    await die(el);
    expect(el.shadowRoot.innerHTML).not.toContain("rotate(72.0)");
  });

  it("the whole tank dies by itself after a few seconds of heat", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(1_700_000_000_000);
    const el = await mount({ theme: "freshwater" });
    el.hass = { language: "en", states: { "sensor.v": { state: "12", last_changed: new Date().toISOString() }, "sensor.t": { state: "50", last_changed: new Date().toISOString() } } };
    for (let i = 0; i < 400; i++) {
      vi.setSystemTime(Date.now() + 17);
      el._updatePhysics(1000 + i * 17);
    }
    await el.updateComplete;
    expect(el._deathProgress).toBe(1);
    expect(el.shadowRoot.innerHTML).toContain("rotate(72.0)");
    vi.useRealTimers();
  });
});
