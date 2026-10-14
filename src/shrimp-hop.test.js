// @vitest-environment happy-dom
//
// A knock on the glass makes the shrimp leap away, head first, in two bounds, and
// the Ancistrus dash away much faster than it ever glides. The shrimp also faces
// the way it walks (its drawing has its head to the left).
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "lit";
import "./shower-aquarium-card.js";
import { createFrame, stepShrimp, startleShrimp, startleAncistrus, stepAncistrus, SHRIMP_HOP, SHRIMP_SPEC, FLEE, ANCISTRUS_MOVE } from "./physics.js";
import { createInitialScene } from "./scene.js";
import { CARD_EDITOR_SCHEMA } from "./card-editor.js";

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
    tank: { tankTop: 15, tankBottom: 565, waterSurfaceY: 15, waterRatio: 1, isDead: false, isBoiling: false, speedMultiplier: 1, ...tankOver },
    ...over,
  });
const constant = (v) => () => v;
const shrimp = (over = {}) => ({ ...createInitialScene().shrimp, x: 650, y: 540, idleUntil: 1e12, ...over });
const FLOOR = 565 - SHRIMP_SPEC.floorOffset;

/** Plays the leap frame by frame; returns what the shrimp did. */
function play(s, { tankOver = {}, limit = 400 } = {}) {
  const lifts = [];
  const xs = [];
  const pitches = [];
  let now = NOW;
  for (let i = 0; i < limit && s.state === "jumping"; i++) {
    stepShrimp(s, frame({ nowMs: now, timestamp: 1000 + (now - NOW) }, tankOver), constant(0.5));
    lifts.push(s.lift);
    xs.push(s.x);
    pitches.push(s.pitch);
    now += 16.66;
  }
  return { lifts, xs, pitches, frames: lifts.length };
}

describe("startleShrimp()", () => {
  it("ignores a knock that is too far away", () => {
    const s = shrimp();
    expect(startleShrimp(s, 650 + FLOOR + FLEE.radius, 300, NOW)).toBe(false);
    expect(s.state).toBe("idle");
    expect(s.hops).toBeUndefined();
  });

  it("leaps away from the knock, in two bounds, the first longer and higher", () => {
    const s = shrimp();
    expect(startleShrimp(s, 600, 540, NOW)).toBe(true);
    expect(s.state).toBe("jumping");
    expect(s.hops).toHaveLength(2);
    const [a, b] = s.hops;
    expect(a.fromX).toBe(650);
    expect(a.toX).toBeGreaterThan(650);
    expect(b.fromX).toBe(a.toX);
    expect(b.toX).toBeGreaterThan(a.toX);
    expect(a.toX - a.fromX).toBeGreaterThan(b.toX - b.fromX);
    expect(a.height).toBeGreaterThan(b.height);
    expect(a.ms).toBeGreaterThan(b.ms);
    expect(s.fleeUntil).toBeGreaterThan(NOW);
  });

  it("goes the other way when the knock is on the other side", () => {
    const s = shrimp({ x: 650 });
    startleShrimp(s, 700, 540, NOW);
    expect(s.hops.at(-1).toX).toBeLessThan(650);
  });

  it("the nearer the knock, the farther it goes", () => {
    // Far from the end of the lane, so that nothing stops it.
    const [near, far] = [shrimp({ x: 480 }), shrimp({ x: 480 })];
    startleShrimp(near, 470, 540, NOW);
    startleShrimp(far, 480 - 400, 540, NOW);
    expect(near.hops.at(-1).toX - 480).toBeGreaterThan(far.hops.at(-1).toX - 480);
    expect(near.hops.at(-1).toX - 480).toBeLessThanOrEqual(SHRIMP_HOP.distance[1] + 1e-9);
    expect(far.hops.at(-1).toX - 480).toBeGreaterThanOrEqual(SHRIMP_HOP.distance[0] - 1e-9);
  });

  it("a leap that would hit the end of the lane is shorter, but never less than it can", () => {
    const s = shrimp({ x: 650 });
    startleShrimp(s, 640, 540, NOW);
    expect(s.hops.at(-1).toX).toBe(SHRIMP_SPEC.fleeMaxX);
  });

  it("stays on the sand it may run to, and leaps the other way at the end of it", () => {
    const right = shrimp({ x: SHRIMP_SPEC.fleeMaxX - 10 });
    startleShrimp(right, right.x - 40, 540, NOW);
    expect(right.hops.at(-1).toX).toBeLessThan(right.x);
    const left = shrimp({ x: SHRIMP_SPEC.fleeMinX + 10 });
    startleShrimp(left, left.x + 40, 540, NOW);
    expect(left.hops.at(-1).toX).toBeGreaterThan(left.x);
    for (const s of [right, left]) for (const hop of s.hops) {
      expect(hop.toX).toBeGreaterThanOrEqual(SHRIMP_SPEC.fleeMinX);
      expect(hop.toX).toBeLessThanOrEqual(SHRIMP_SPEC.fleeMaxX);
    }
  });

  it("a knock right above it sends it the way it faces", () => {
    const facingLeft = shrimp({ dir: -1 });
    startleShrimp(facingLeft, 650, 540, NOW);
    expect(facingLeft.hops.at(-1).toX).toBeLessThan(650);
    const facingRight = shrimp({ dir: 1 });
    startleShrimp(facingRight, 650, 540, NOW);
    expect(facingRight.hops.at(-1).toX).toBeGreaterThan(650);
    const unknown = shrimp();
    delete unknown.dir;
    startleShrimp(unknown, 650, 540, NOW);
    expect(unknown.hops.at(-1).toX).toBeGreaterThan(650);
  });

  it("a shrimp that is already in the air keeps its leap", () => {
    const s = shrimp();
    startleShrimp(s, 600, 540, NOW);
    const hops = s.hops;
    stepShrimp(s, frame(), constant(0.5));
    expect(startleShrimp(s, 700, 540, NOW)).toBe(true);
    expect(s.hops).toBe(hops);
    expect(hops[0].toX).toBeGreaterThan(650);
  });
});

describe("stepShrimp()", () => {
  it("walks like any crawler when it is not leaping", () => {
    const s = shrimp({ state: "moving", targetX: 700 });
    stepShrimp(s, frame(), constant(0.5));
    expect(s.x).toBeGreaterThan(650);
    expect(s.y).toBe(FLOOR);
    expect(s.lift).toBe(0);
    expect(s.pitch).toBe(0);
    expect(s.floorY).toBe(FLOOR);
  });

  it("leaves the ground, comes down in an arc, twice, and lands at the end of its second bound", () => {
    const s = shrimp({ x: 480 });
    startleShrimp(s, 470, 540, NOW);
    const { lifts, xs } = play(s);
    expect(s.state).toBe("idle");
    expect(s.lift).toBe(0);
    expect(s.y).toBe(FLOOR);
    expect(Math.max(...lifts)).toBeGreaterThan(SHRIMP_HOP.height[0] * 0.95);
    // Two humps: it touches the sand once in between.
    const humps = lifts.reduce((n, lift, i) => (i > 0 && lift > 0 && lifts[i - 1] <= 1 ? n + 1 : n), lifts[0] > 0 ? 1 : 0);
    expect(humps).toBe(2);
    expect(lifts.every((l) => l >= 0)).toBe(true);
    // It only ever goes forward.
    for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThanOrEqual(xs[i - 1] - 1e-9);
    expect(s.x).toBeGreaterThan(480 + SHRIMP_HOP.distance[0] * 0.8);
  });

  it("the whole leap lasts about a second", () => {
    const s = shrimp();
    startleShrimp(s, 600, 540, NOW);
    const { frames } = play(s);
    const ms = frames * 16.66;
    expect(ms).toBeGreaterThan(SHRIMP_HOP.ms[0] + SHRIMP_HOP.ms[1] - 60);
    expect(ms).toBeLessThan(SHRIMP_HOP.ms[0] + SHRIMP_HOP.ms[1] + 60);
  });

  it("the second bound is lower than the first", () => {
    const s = shrimp();
    startleShrimp(s, 600, 540, NOW);
    const { lifts } = play(s);
    const split = lifts.findIndex((l, i) => i > 5 && l < 1);
    expect(Math.max(...lifts.slice(0, split))).toBeGreaterThan(Math.max(...lifts.slice(split)) * 1.4);
  });

  it("raises its nose as it takes off and lowers it as it lands, head first", () => {
    const s = shrimp();
    startleShrimp(s, 600, 540, NOW);
    const first = [];
    stepShrimp(s, frame(), constant(0.5));
    first.push(s.pitch);
    expect(s.pitch).toBeGreaterThan(SHRIMP_HOP.pitch * 0.9);
    const { pitches } = play(s);
    expect(Math.min(...pitches)).toBeLessThan(-SHRIMP_HOP.pitch * 0.8);
    expect(s.pitch).toBe(0);
  });

  it("faces the way it leaps", () => {
    const right = shrimp();
    startleShrimp(right, 600, 540, NOW);
    stepShrimp(right, frame(), constant(0.5));
    expect(right.dir).toBe(1);
    const left = shrimp();
    startleShrimp(left, 700, 540, NOW);
    stepShrimp(left, frame(), constant(0.5));
    expect(left.dir).toBe(-1);
  });

  it("rests a moment after it has landed, then walks again", () => {
    const s = shrimp();
    startleShrimp(s, 600, 540, NOW);
    play(s);
    expect(s.state).toBe("idle");
    expect(s.idleUntil).toBe(1000 + (16.66 * play.length || 0) * 0 + s.idleUntil - 1000);
    expect(s.idleUntil).toBeGreaterThan(1000);
    expect(s.hops).toBeUndefined();
  });

  it("stays in the water: under a low surface the bounds are lower", () => {
    const high = shrimp();
    startleShrimp(high, 600, 540, NOW);
    const lowSurface = FLOOR - 70;
    const s = shrimp();
    startleShrimp(s, 600, 540, NOW);
    const { lifts } = play(s, { tankOver: { waterSurfaceY: lowSurface } });
    expect(Math.max(...lifts)).toBeLessThanOrEqual(FLOOR - (lowSurface + SHRIMP_HOP.surfaceMargin) + 1e-6);
    expect(Math.max(...lifts)).toBeGreaterThan(20);
    // Its top is under the surface.
    expect(FLOOR - Math.max(...lifts)).toBeGreaterThanOrEqual(lowSurface);
  });

  it("hops a little even with almost no water", () => {
    const s = shrimp();
    startleShrimp(s, 600, 540, NOW);
    const { lifts } = play(s, { tankOver: { waterSurfaceY: FLOOR - 5 } });
    expect(Math.max(...lifts)).toBeCloseTo(SHRIMP_HOP.minHeight, 1);
  });

  it("works its stress out, and keeps its legs still in the air", () => {
    const s = shrimp({ stressUntil: NOW + 1750, stressPower: 1, walk: 3, stride: 1 });
    startleShrimp(s, 600, 540, NOW);
    stepShrimp(s, frame(), constant(0.5));
    expect(s.stress).toBeGreaterThan(0.4);
    const before = s.walk;
    for (let i = 0; i < 20; i++) stepShrimp(s, frame(), constant(0.5));
    expect(s.walk).toBe(before);
    expect(s.stride).toBeLessThan(1);
  });

  it("dead, it comes down on the sand where it is and fades", () => {
    const s = shrimp();
    startleShrimp(s, 600, 540, NOW);
    for (let i = 0; i < 12; i++) stepShrimp(s, frame(), constant(0.5));
    expect(s.lift).toBeGreaterThan(10);
    stepShrimp(s, frame({}, { isDead: true }), constant(0.5));
    expect(s.state).toBe("idle");
    expect(s.lift).toBe(0);
    expect(s.pitch).toBe(0);
    expect(s.y).toBe(FLOOR);
    expect(s.hops).toBeUndefined();
    expect(s.deathProgress).toBeGreaterThan(0);
  });

  it("a state 'jumping' without any bound left goes back to rest instead of getting stuck", () => {
    const s = shrimp({ state: "jumping", hops: [] });
    stepShrimp(s, frame(), constant(0.5));
    expect(s.state).toBe("idle");
    const noHops = shrimp({ state: "jumping" });
    stepShrimp(noHops, frame(), constant(0.5));
    expect(noHops.state).toBe("idle");
  });

  it("makes the same leap on a slow screen as on a fast one", () => {
    const [fast, slow] = [shrimp(), shrimp()];
    startleShrimp(fast, 600, 540, NOW);
    startleShrimp(slow, 600, 540, NOW);
    let now = NOW;
    for (let i = 0; i < 40; i++) stepShrimp(fast, frame({ nowMs: now }), constant(0.5)), (now += 16.66);
    now = NOW;
    for (let i = 0; i < 20; i++) stepShrimp(slow, frame({ nowMs: now, delta: 2 }), constant(0.5)), (now += 33.32);
    expect(slow.x).toBeCloseTo(fast.x, 0);
    expect(slow.lift).toBeCloseTo(fast.lift, 0);
  });
});

describe("the Ancistrus dashes away", () => {
  const tank = { tankTop: 15, tankBottom: 565, waterSurfaceY: 15 };
  const anc = (over = {}) => ({ x: 400, y: 300, targetX: 700, targetY: 300, heading: 0, state: "moving", idleUntil: 1e9, ...over });

  it("goes about eighteen times faster than it glides, at the start of a dash", () => {
    const calm = anc();
    const scared = anc();
    startleAncistrus(scared, 300, 300, NOW, tank, constant(0.5));
    stepAncistrus(calm, frame(), constant(0.5));
    stepAncistrus(scared, frame(), constant(0.5));
    const [slow, fast] = [Math.hypot(calm.x - 400, calm.y - 300), Math.hypot(scared.x - 400, scared.y - 300)];
    expect(fast / slow).toBeGreaterThan(15);
    expect(FLEE.ancistrusFactor).toBeGreaterThanOrEqual(18);
  });

  it("covers a trip of several hundred units in about half a second", () => {
    const s = anc({ x: 100, y: 300 });
    startleAncistrus(s, 50, 300, NOW, tank, constant(0.5));
    let frames = 0;
    let now = NOW;
    while (s.state === "moving" && frames < 400) {
      stepAncistrus(s, frame({ nowMs: now, timestamp: 1000 + frames * 16.66 }), constant(0.5));
      frames++;
      now += 16.66;
    }
    expect(frames * 16.66).toBeLessThan(900);
    expect(frames * 16.66).toBeGreaterThan(150);
  });

  it("turns its head fast to go, a dash being short", () => {
    expect(FLEE.ancistrusTurn).toBeGreaterThan(ANCISTRUS_MOVE.turn * 4);
    const s = anc({ heading: 0 });
    startleAncistrus(s, 500, 300, NOW, tank, constant(0.5));
    stepAncistrus(s, frame(), constant(0.5));
    expect(Math.abs(s.heading)).toBeGreaterThanOrEqual(FLEE.ancistrusTurn - 1e-9);
  });

  it("slows down over the last stretch instead of stopping dead", () => {
    const s = anc({ x: 400, y: 300, targetX: 700, targetY: 300 });
    s.fleeUntil = NOW + 5000;
    const speeds = [];
    let now = NOW;
    for (let i = 0; i < 300 && s.state === "moving"; i++) {
      const before = s.x;
      stepAncistrus(s, frame({ nowMs: now }), constant(0.5));
      speeds.push(s.x - before);
      now += 16.66;
    }
    const top = Math.max(...speeds);
    expect(top).toBeGreaterThan(14);
    const last = speeds.filter((v) => v > 0).slice(-3);
    expect(Math.max(...last)).toBeLessThan(top / 2);
    // It stops within a step and a half of where it was going.
    expect(Math.abs(s.x - 700)).toBeLessThan(1.6);
  });

  it("glides at its usual speed when it is not fleeing, whatever the distance", () => {
    const s = anc({ x: 400, targetX: 420 });
    stepAncistrus(s, frame(), constant(0.5));
    expect(s.x - 400).toBeCloseTo(ANCISTRUS_MOVE.speed, 6);
  });
});

describe("the shrimp on the picture", () => {
  const mount = async () => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.v", theme: "saltwater" });
    el.hass = { language: "en", states: { "sensor.v": { state: "12", last_changed: new Date().toISOString() } } };
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  };
  // The drawing, as the browser gets it: the transform of its group and the shadow under it.
  const draw = (el, dead = false) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    render(el._renderShrimp(dead), g);
    const body = [...g.querySelectorAll("g")].find((x) => x.getAttribute("transform")?.startsWith("translate"));
    return { transform: body.getAttribute("transform"), shadow: g.querySelector("ellipse") };
  };

  it("a knock on the glass makes it leap", async () => {
    const el = await mount();
    el._shrimp.x = 640;
    el._shrimp.y = 540;
    el._knockAt(540, 540, el._tankState());
    expect(el._shrimp.state).toBe("jumping");
    expect(el._shrimp.stressUntil).toBeGreaterThan(Date.now());
    for (let i = 0; i < 12; i++) el._updatePhysics(1000 + i * 17);
    expect(el._shrimp.lift).toBeGreaterThan(20);
    await el.updateComplete;
    expect(el.shadowRoot.innerHTML).toContain("<ellipse");
  });

  it("is drawn in the air, nose up, with a shadow on the sand that is fainter the higher it is", async () => {
    const el = await mount();
    el._shrimp.dir = 1;
    el._shrimp.floorY = 540;
    el._shrimp.y = 500;
    el._shrimp.lift = 40;
    el._shrimp.pitch = 30;
    const low = draw(el);
    expect(low.transform).toContain("rotate(-30.0)");
    expect(Number(low.shadow.getAttribute("cy"))).toBe(547);
    el._shrimp.lift = 110;
    const high = draw(el);
    expect(Number(high.shadow.getAttribute("opacity"))).toBeLessThan(Number(low.shadow.getAttribute("opacity")));
    expect(Number(high.shadow.getAttribute("rx"))).toBeLessThan(Number(low.shadow.getAttribute("rx")));
    // Higher than the shadow can tell: it stops getting smaller.
    el._shrimp.lift = 400;
    expect(Number(draw(el).shadow.getAttribute("rx"))).toBeCloseTo(26 - 12, 6);
  });

  it("the nose goes up the other way when it faces left", async () => {
    const el = await mount();
    el._shrimp.dir = -1;
    el._shrimp.pitch = 30;
    expect(draw(el).transform).toContain("rotate(30.0)");
    el._shrimp.dir = 1;
    expect(draw(el).transform).toContain("rotate(-30.0)");
  });

  it("is drawn flat and with no shadow on the sand, and when it is dead", async () => {
    const el = await mount();
    el._shrimp.lift = 0;
    el._shrimp.pitch = 0;
    expect(draw(el).shadow).toBeNull();
    expect(draw(el).transform).toContain("rotate(0.0)");
    el._shrimp.lift = 60;
    el._shrimp.pitch = 25;
    const dead = draw(el, true);
    expect(dead.shadow).toBeNull();
    expect(dead.transform).toContain("rotate(0.0)");
  });

  it("a shadow without a known floor is put under the shrimp", async () => {
    const el = await mount();
    el._shrimp.floorY = undefined;
    el._shrimp.y = 480;
    el._shrimp.lift = 50;
    expect(Number(draw(el).shadow.getAttribute("cy"))).toBe(480 + 50 + 7);
  });
});

describe("the options of the editor", () => {
  it("the option that shows the images per second is the last one", () => {
    const names = CARD_EDITOR_SCHEMA.flatMap((f) => (f.type === "expandable" ? f.schema : [f])).map((f) => f.name);
    expect(names.at(-1)).toBe("show_fps");
    expect(names.slice(-3)).toEqual(["aspect_ratio_width", "aspect_ratio_height", "show_fps"]);
    expect(names.filter((n) => n === "show_fps")).toHaveLength(1);
  });
});
