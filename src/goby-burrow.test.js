// @vitest-environment happy-dom
//
// The goby stays at its burrow, and the burrow stays where it is: the goby no
// longer drags its hole around. A knock on the glass sends it into the sand; it
// comes out again after a few seconds, slowly.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./shower-aquarium-card.js";
import { createFrame, stepGoby, startleGoby, GOBY_MOVE, FLEE, STRESS_MS } from "./physics.js";
import { GOBY_HIDE } from "./render/goby.js";
import { createInitialScene } from "./scene.js";

beforeEach(() => {
  window.requestAnimationFrame = () => 1;
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const NOW = 5_000_000;
const frame = (over = {}, tankOver = {}) =>
  createFrame({
    timestamp: 1000,
    deltaMs: 16.66,
    delta: 1,
    nowMs: NOW,
    animTime: 0,
    userSpeed: 1,
    themeKey: "saltwater",
    tank: { tankTop: 15, tankBottom: 565, waterSurfaceY: 15, waterRatio: 1, isDead: false, isBoiling: false, speedMultiplier: 1, ...over.tank, ...tankOver },
    ...over,
  });
const constant = (v) => () => v;
const goby = (over = {}) => ({ ...createInitialScene().goby, ...over });
const markup = (template) => template.strings.join("") + JSON.stringify(template.values);

describe("stepGoby()", () => {
  it("stays where it is, at the height of its place, and never wanders off", () => {
    const g = goby();
    for (let i = 0; i < 3000; i++) stepGoby(g, frame({ nowMs: NOW + i * 16.66 }), constant(0.5));
    expect(g.x).toBe(530);
    expect(g.y).toBe(565 - GOBY_MOVE.floorOffset);
    expect(g.state).toBe("idle");
    expect(g.hide).toBe(0);
  });

  it("follows the bottom of the tank, whatever its height", () => {
    const g = goby();
    stepGoby(g, frame({}, { tankBottom: 2048 }), constant(0.5));
    expect(g.y).toBe(2048 - GOBY_MOVE.floorOffset);
  });

  it("goes in quickly, stays hidden for a delay, then comes out slowly and rests", () => {
    const g = goby({ state: "hiding" });
    const seen = [g.state];
    const steps = { in: 0, out: 0 };
    let now = NOW;
    for (let i = 0; i < 20000 && !(seen.includes("emerging") && g.state === "idle"); i++) {
      stepGoby(g, frame({ nowMs: now }), constant(0.5));
      if (g.state === "hiding") steps.in++;
      if (g.state === "emerging") steps.out++;
      expect(g.hide).toBeGreaterThanOrEqual(0);
      expect(g.hide).toBeLessThanOrEqual(1);
      if (seen[seen.length - 1] !== g.state) seen.push(g.state);
      if (g.state === "hidden") expect(g.hide).toBe(1);
      now += 16.66;
    }
    expect(seen).toEqual(["hiding", "hidden", "emerging", "idle"]);
    expect(g.hide).toBe(0);
    // It dives in much faster than it comes out.
    expect(steps.in).toBeLessThan(steps.out / 2);
    expect(g.x).toBe(530);
  });

  it("stays hidden for the delay and not a moment less", () => {
    const g = goby({ state: "hiding", hide: 0.99 });
    stepGoby(g, frame(), constant(0.5));
    expect(g.state).toBe("hidden");
    expect(g.idleUntil).toBe(NOW + GOBY_MOVE.hidden[0] + 0.5 * GOBY_MOVE.hidden[1]);
    stepGoby(g, frame({ nowMs: g.idleUntil - 1 }), constant(0.5));
    expect(g.state).toBe("hidden");
    stepGoby(g, frame({ nowMs: g.idleUntil }), constant(0.5));
    expect(g.state).toBe("emerging");
  });

  it("works its stress out each frame", () => {
    const g = goby({ stressUntil: NOW + STRESS_MS / 2, stressPower: 1 });
    stepGoby(g, frame(), constant(0.5));
    expect(g.stress).toBeCloseTo(0.5, 6);
  });

  it("dead, it comes out of the sand, stays where it is and fades", () => {
    const g = goby({ state: "hidden", hide: 1 });
    stepGoby(g, frame({}, { isDead: true }), constant(0.5));
    expect(g.deathProgress).toBeGreaterThan(0);
    expect(g.hide).toBeLessThan(1);
    for (let i = 0; i < 400; i++) stepGoby(g, frame({}, { isDead: true }), constant(0.5));
    expect(g.hide).toBe(0);
    expect(g.deathProgress).toBe(1);
    expect(g.x).toBe(530);
  });

  it("back to life, its death is forgotten", () => {
    const g = goby({ deathProgress: 0.7 });
    stepGoby(g, frame(), constant(0.5));
    expect(g.deathProgress).toBe(0);
  });

  it("a goby made by hand, without a hiding, starts in sight", () => {
    const g = { x: 530, y: 0, state: "idle", idleUntil: 0, dir: 1 };
    stepGoby(g, frame(), constant(0.5));
    expect(g.hide).toBe(0);
  });
});

describe("startleGoby()", () => {
  it("ignores a knock that is too far away", () => {
    const g = goby();
    expect(startleGoby(g, 530 + FLEE.radius + 50, g.y, NOW)).toBe(false);
    expect(g.state).toBe("idle");
  });

  it("sends it into the sand", () => {
    const g = goby();
    expect(startleGoby(g, 400, 300, NOW)).toBe(true);
    expect(g.state).toBe("hiding");
    expect(g.x).toBe(530);
  });

  it("a goby that is already going in is left alone", () => {
    const g = goby({ state: "hiding", hide: 0.4 });
    startleGoby(g, 400, 300, NOW);
    expect(g.state).toBe("hiding");
    expect(g.hide).toBe(0.4);
  });

  it("a hidden goby stays hidden for longer, but never for less than it was", () => {
    const g = goby({ state: "hidden", hide: 1, idleUntil: NOW + 100 });
    startleGoby(g, 400, 300, NOW);
    expect(g.idleUntil).toBe(NOW + GOBY_MOVE.hidden[0]);
    const long = goby({ state: "hidden", hide: 1, idleUntil: NOW + 99_000_000 });
    startleGoby(long, 400, 300, NOW);
    expect(long.idleUntil).toBe(NOW + 99_000_000);
    const unset = goby({ state: "hidden", hide: 1 });
    delete unset.idleUntil;
    startleGoby(unset, 400, 300, NOW);
    expect(unset.idleUntil).toBe(NOW + GOBY_MOVE.hidden[0]);
  });

  it("a goby that is coming out goes back in", () => {
    const g = goby({ state: "emerging", hide: 0.5 });
    startleGoby(g, 400, 300, NOW);
    expect(g.state).toBe("hiding");
  });
});

describe("drawing the goby and its burrow", () => {
  const mount = async (config = {}) => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.v", theme: "saltwater", ...config });
    el.hass = { language: "en", states: { "sensor.v": { state: "12", last_changed: new Date().toISOString() } } };
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  };

  it("draws the burrow (the mound and the hole) on its own, not inside the goby", async () => {
    const el = await mount();
    const drawing = el._renderGoby(false);
    const out = markup(drawing);
    // The burrow group comes first, then the goby; the sand colour is in the burrow only.
    const burrowAt = out.indexOf("#d8b45f");
    const gobyAt = out.indexOf("#fde047");
    expect(burrowAt).toBeGreaterThan(-1);
    expect(burrowAt).toBeLessThan(gobyAt);
    expect(out.match(/#5b4423/g)).toHaveLength(1);
  });

  it("the burrow does not move with the goby: it is drawn at the home of the goby, whatever its hiding", async () => {
    const el = await mount();
    const home = (hide) => {
      el._goby.hide = hide;
      const html = JSON.stringify(el._renderGoby(false).values);
      return html;
    };
    expect(home(0)).toContain("530");
    // Same position of the burrow at 0 and at 1: the group holding it only depends on x and y.
    el._goby.hide = 0;
    const a = el._renderGoby(false).values[0];
    el._goby.hide = 1;
    const b = el._renderGoby(false).values[0];
    expect(a).toEqual(b);
    expect(a).toBe(530);
  });

  it("draws the goby as it always did while it is in sight: no cut, no offset", async () => {
    const el = await mount();
    const out = markup(el._renderGoby(false));
    expect(out).not.toContain("<clipPath");
    expect(out).toContain('clip-path="');
    expect(JSON.stringify(el._renderGoby(false).values)).toContain("none");
    expect(JSON.stringify(el._renderGoby(false).values)).not.toContain("url(#goby-sand)");
  });

  it("slides to the burrow and sinks into the sand as it hides, and is cut at the sand", async () => {
    const el = await mount();
    el._goby.hide = 0.5;
    const half = el._renderGoby(false);
    const flat = JSON.stringify(half.values);
    expect(flat).toContain(String(-0.5 * GOBY_HIDE.slide));
    expect(flat).toContain(String(0.5 * GOBY_HIDE.sink));
    expect(flat).toContain("url(#goby-sand)");
    el._goby.hide = 1;
    const full = JSON.stringify(el._renderGoby(false).values);
    expect(full).toContain(String(-GOBY_HIDE.slide));
    expect(full).toContain(String(GOBY_HIDE.sink));
  });

  it("sinks far enough to hide even its tall fin", () => {
    // The tallest part of the drawing is the first dorsal fin, about 30 units above its centre.
    expect(-30 + GOBY_HIDE.sink).toBeGreaterThan(GOBY_HIDE.sandLine);
  });

  it("the cut is just under the sand line of the burrow, scaled like the drawing", async () => {
    const el = await mount();
    el._goby.hide = 0.5;
    const clip = JSON.stringify(el._renderGoby(false).values);
    // y of the goby (551) + 5 * 1.3, plus the 100 units of margin above.
    expect(clip).toContain((el._goby.y + GOBY_HIDE.sandLine * 1.3 + 100).toFixed(1));
  });

  it("fully hidden, nothing of the goby shows above the sand", async () => {
    const el = await mount();
    el._goby.hide = 1;
    const out = JSON.stringify(el._renderGoby(false).values);
    // Its top (the tall fin) after the sinking is below the cut: 551 + 1.3 * (-30 + 38) > 551 + 1.3 * 5.
    expect(551 + 1.3 * (-30 + GOBY_HIDE.sink)).toBeGreaterThan(551 + 1.3 * GOBY_HIDE.sandLine);
    expect(out).toContain("url(#goby-sand)");
  });

  it("a hiding that is not a number or goes beyond 0..1 is kept in range", async () => {
    const el = await mount();
    el._goby.hide = 7;
    expect(JSON.stringify(el._renderGoby(false).values)).toContain(String(-GOBY_HIDE.slide));
    el._goby.hide = -3;
    expect(JSON.stringify(el._renderGoby(false).values)).not.toContain("url(#goby-sand)");
    el._goby.hide = undefined;
    expect(JSON.stringify(el._renderGoby(false).values)).not.toContain("url(#goby-sand)");
  });

  it("is not cut when it is dead (it comes out of the sand and lies there)", async () => {
    const el = await mount();
    el._goby.hide = 0;
    el._goby.deathProgress = 1;
    const out = JSON.stringify(el._renderGoby(true).values);
    expect(out).not.toContain("url(#goby-sand)");
    expect(markup(el._renderGoby(true))).toContain("-1.3");
  });
});

describe("in the card", () => {
  const mount = async () => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.v", theme: "saltwater" });
    el.hass = { language: "en", states: { "sensor.v": { state: "12", last_changed: new Date().toISOString() } } };
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  };

  it("a knock on the glass sends the goby into the sand, and it stays in its place", async () => {
    const el = await mount();
    el._updatePhysics(1000);
    el._knockAt(400, 500, el._tankState());
    expect(el._goby.state).toBe("hiding");
    expect(el._goby.stressUntil).toBeGreaterThan(Date.now());
    for (let i = 0; i < 30; i++) el._updatePhysics(1016 + i * 17);
    expect(el._goby.hide).toBe(1);
    expect(el._goby.x).toBe(530);
    await el.updateComplete;
    expect(el.shadowRoot.innerHTML).toContain('id="goby-sand"');
  });

  it("a knock too far from the goby leaves it alone", async () => {
    const el = await mount();
    el._goby.x = 5000;
    el._knockAt(100, 300, el._tankState());
    expect(el._goby.state).toBe("idle");
    expect(el._goby.stressUntil).toBeUndefined();
  });

  it("comes out again a few seconds later", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(1_700_000_000_000);
    const el = await mount();
    el._knockAt(400, 500, el._tankState());
    let t = 1000;
    for (let i = 0; i < 60; i++) {
      vi.setSystemTime(Date.now() + 17);
      el._updatePhysics((t += 17));
    }
    expect(el._goby.state).toBe("hidden");
    vi.setSystemTime(Date.now() + 8000);
    for (let i = 0; i < 80; i++) {
      vi.setSystemTime(Date.now() + 17);
      el._updatePhysics((t += 17));
    }
    expect(el._goby.hide).toBeLessThan(1);
    expect(["emerging", "idle"]).toContain(el._goby.state);
    vi.useRealTimers();
  });
});
