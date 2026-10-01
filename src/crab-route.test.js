// @vitest-environment happy-dom
//
// The crab walks all over the reef, along a route from the sand in the middle
// of the tank, over the sand, up the pile of live rock to its flat rock, and
// hides in the cave of the pile of live rock. A knock on the
// glass sends it into the nearest cave.
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import "./shower-aquarium-card.js";
import { createFrame, stepCrab, startleCrab, startleCrawler, CRAB_MOVE, FLEE } from "./physics.js";
import { CRAB_ROUTE, CRAB_STOPS, CRAB_ROUTE_LENGTH, CRAB_CAVES, CRAB_START_S, REEF_PILE, crabPointAt } from "./reef-layout.js";
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
    tank: { tankTop: 15, tankBottom: 565, waterSurfaceY: 15, waterRatio: 1, isDead: false, isBoiling: false, speedMultiplier: 1, ...tankOver },
    ...over,
  });
const crab = (over = {}) => ({ ...createInitialScene().crab, idleUntil: NOW + 1e9, ...over });
const constant = (v) => () => v;
const scripted = (...values) => {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
};
/** Runs the crab frame after frame, `ms` apart, until `done` or the limit. */
function run(c, { ms = 16.66, from = NOW, limit = 4000, rand = constant(0.5), done = () => false } = {}) {
  let now = from;
  for (let i = 0; i < limit && !done(c); i++) {
    stepCrab(c, frame({ nowMs: now, timestamp: now - NOW + 1000, deltaMs: ms, delta: ms / 16.66 }), rand);
    now += ms;
  }
  return now;
}

describe("the route of the crab", () => {
  it("goes from the sand, up the pile of rock, to its flat rock", () => {
    expect(CRAB_ROUTE[0].x).toBeLessThan(REEF_PILE.x0);
    expect(CRAB_ROUTE[CRAB_ROUTE.length - 1].h).toBe(REEF_PILE.ledge);
    for (const stop of CRAB_ROUTE) expect(stop.h).toBeLessThanOrEqual(REEF_PILE.ledge);
  });

  it("measures the distance to every stop, from 0 to the whole length", () => {
    expect(CRAB_STOPS).toHaveLength(CRAB_ROUTE.length);
    expect(CRAB_STOPS[0]).toBe(0);
    expect(CRAB_STOPS[CRAB_STOPS.length - 1]).toBe(CRAB_ROUTE_LENGTH);
    for (let i = 1; i < CRAB_STOPS.length; i++) expect(CRAB_STOPS[i]).toBeGreaterThan(CRAB_STOPS[i - 1]);
  });

  it("crabPointAt() gives the stops themselves, a point in between, and stays on the route past its ends", () => {
    CRAB_ROUTE.forEach((stop, i) => {
      const point = crabPointAt(CRAB_STOPS[i]);
      expect(point.x).toBeCloseTo(stop.x, 6);
      expect(point.h).toBeCloseTo(stop.h, 6);
    });
    const middle = crabPointAt((CRAB_STOPS[1] + CRAB_STOPS[2]) / 2);
    expect(middle.x).toBeCloseTo((CRAB_ROUTE[1].x + CRAB_ROUTE[2].x) / 2, 6);
    expect(crabPointAt(-50)).toEqual(crabPointAt(0));
    expect(crabPointAt(CRAB_ROUTE_LENGTH + 50)).toEqual(crabPointAt(CRAB_ROUTE_LENGTH));
  });

  it("has one cave: the one in the front of the pile of live rock (the rock in the middle of the tank is gone)", () => {
    expect(CRAB_CAVES).toHaveLength(1);
    expect(crabPointAt(CRAB_CAVES[0]).x).toBeGreaterThanOrEqual(REEF_PILE.x0);
    expect(crabPointAt(CRAB_CAVES[0]).x).toBeLessThanOrEqual(REEF_PILE.x1);
  });

  it("starts on the sand, clear of the anemone", () => {
    expect(CRAB_ROUTE[0].x).toBeGreaterThan(400);
    expect(CRAB_ROUTE[0].h).toBeLessThan(40);
  });

  it("starts on the flat rock, in the middle of the part it walks on", () => {
    const start = crabPointAt(CRAB_START_S);
    expect(start.h).toBe(REEF_PILE.ledge);
    expect(start.x).toBeGreaterThanOrEqual(REEF_PILE.ledgeFrom);
    expect(start.x).toBeLessThanOrEqual(REEF_PILE.ledgeTo);
  });

  it("the crab of the starting scene stands on it, in sight", () => {
    const c = createInitialScene().crab;
    expect(c.s).toBe(CRAB_START_S);
    expect(c.hide).toBe(0);
  });
});

describe("stepCrab()", () => {
  it("puts itself where its distance along the route says, on the floor whatever its height", () => {
    const c = crab({ s: CRAB_STOPS[2], state: "idle" });
    stepCrab(c, frame(), constant(0.5));
    const { x, h } = crabPointAt(CRAB_STOPS[2]);
    expect(c.x).toBeCloseTo(x, 6);
    expect(c.y).toBe(565 - (h + 30));
  });

  it("a crab placed by hand, without a distance, starts at the start of its route", () => {
    const c = { x: 100, y: 100, state: "idle", idleUntil: NOW + 1e9, dir: 1 };
    stepCrab(c, frame(), constant(0.5));
    expect(c.s).toBe(CRAB_START_S);
  });

  it("makes up its first rest from the clock and the random source", () => {
    const c = { ...createInitialScene().crab, idleUntil: 0 };
    stepCrab(c, frame(), constant(0.5));
    expect(c.idleUntil).toBe(NOW + CRAB_MOVE.firstIdle[0] + 0.5 * CRAB_MOVE.firstIdle[1]);
    expect(c.state).toBe("idle");
  });

  it("walks to a new place once its rest is over, towards the goal it chose", () => {
    const c = crab({ idleUntil: NOW - 1 });
    // No cave (0.9 > 0.4), then a goal 0.1 of the way along the route.
    stepCrab(c, frame(), scripted(0.9, 0.1));
    expect(c.state).toBe("moving");
    expect(c.goalS).toBeCloseTo(0.1 * CRAB_ROUTE_LENGTH, 6);
    expect(c.targetX).toBeCloseTo(crabPointAt(c.goalS).x, 6);
  });

  it("often chooses the cave", () => {
    const c = crab({ s: CRAB_START_S, idleUntil: NOW - 1 });
    stepCrab(c, frame(), scripted(0.1, 0));
    expect(c.goalS).toBe(CRAB_CAVES[0]);
    const d = crab({ s: CRAB_START_S, idleUntil: NOW - 1 });
    stepCrab(d, frame(), scripted(0.1, 0.99));
    expect(d.goalS).toBe(CRAB_CAVES[0]);
  });

  it("does not choose the cave it stands at: it walks somewhere else", () => {
    const c = crab({ s: CRAB_CAVES[0], idleUntil: NOW - 1 });
    stepCrab(c, frame(), scripted(0.1, 0.9));
    expect(Math.abs(c.goalS - CRAB_CAVES[0])).toBeGreaterThanOrEqual(40);
  });

  it("does not choose a place that is hardly worth the walk: it goes to the other end of the route", () => {
    const near = crab({ s: CRAB_START_S, idleUntil: NOW - 1 });
    stepCrab(near, frame(), scripted(0.9, (CRAB_START_S + 10) / CRAB_ROUTE_LENGTH));
    expect(near.goalS).toBe(0);
    const start = crab({ s: 5, idleUntil: NOW - 1 });
    stepCrab(start, frame(), scripted(0.9, 0.001));
    expect(start.goalS).toBe(CRAB_ROUTE_LENGTH);
  });

  it("walks at its own speed, faces the way it goes, and rests when it arrives at an ordinary place", () => {
    const c = crab({ s: 300, goalS: 100, state: "moving" });
    stepCrab(c, frame({ delta: 2 }), constant(0.5));
    expect(300 - c.s).toBeCloseTo(CRAB_MOVE.speed * 2, 6);
    expect(c.dir).toBe(-1);
    const right = crab({ s: 100, goalS: 300, state: "moving", dir: -1 });
    stepCrab(right, frame(), constant(0.5));
    expect(right.dir).toBe(1);
    run(right, { done: (k) => k.state !== "moving" });
    expect(right.s).toBe(300);
    expect(right.state).toBe("idle");
    expect(right.idleUntil).toBeGreaterThan(NOW);
  });

  it("goes in a cave when it arrives at one: it hides, stays hidden for a while, comes out and rests", () => {
    const c = crab({ s: CRAB_CAVES[0] - 20, goalS: CRAB_CAVES[0], state: "moving" });
    const seen = [c.state];
    let now = NOW;
    for (let i = 0; i < 20000 && !(seen.includes("emerging") && c.state === "idle"); i++) {
      stepCrab(c, frame({ nowMs: now }), constant(0.5));
      if (seen[seen.length - 1] !== c.state) seen.push(c.state);
      now += 16.66;
    }
    expect(seen).toEqual(["moving", "hiding", "hidden", "emerging", "idle"]);
    expect(c.hide).toBe(0);
  });

  it("stays hidden for the delay, and only then comes out", () => {
    const c = crab({ s: CRAB_CAVES[0], state: "hiding", hide: 0.99 });
    stepCrab(c, frame(), constant(0.5));
    expect(c.state).toBe("hidden");
    expect(c.hide).toBe(1);
    expect(c.idleUntil).toBe(NOW + CRAB_MOVE.hidden[0] + 0.5 * CRAB_MOVE.hidden[1]);
    stepCrab(c, frame({ nowMs: NOW + 100 }), constant(0.5));
    expect(c.state).toBe("hidden");
    stepCrab(c, frame({ nowMs: c.idleUntil }), constant(0.5));
    expect(c.state).toBe("emerging");
  });

  it("hides faster, and for longer, when it was frightened", () => {
    const calm = crab({ s: CRAB_CAVES[0], state: "hiding", hide: 0.5 });
    const scared = crab({ s: CRAB_CAVES[0], state: "hiding", hide: 0.5, fleeUntil: NOW + 1000 });
    stepCrab(calm, frame(), constant(0.5));
    stepCrab(scared, frame(), constant(0.5));
    expect(scared.hide - 0.5).toBeCloseTo(2 * (calm.hide - 0.5), 6);
    const long = crab({ s: CRAB_CAVES[0], state: "hiding", hide: 0.99, fleeUntil: NOW + 1000 });
    stepCrab(long, frame(), constant(0));
    expect(long.idleUntil).toBe(NOW + CRAB_MOVE.fleeHidden[0]);
  });

  it("coming out, it shows itself again little by little, then rests a moment", () => {
    const c = crab({ s: CRAB_CAVES[0], state: "emerging", hide: 0.5 });
    stepCrab(c, frame(), constant(0.5));
    expect(c.hide).toBeCloseTo(0.5 - CRAB_MOVE.hideStep, 6);
    expect(c.state).toBe("emerging");
    c.hide = 0.01;
    stepCrab(c, frame(), constant(0.5));
    expect(c.hide).toBe(0);
    expect(c.state).toBe("idle");
    expect(c.idleUntil).toBe(NOW + 600 + 0.5 * 800);
  });

  it("visits the whole route over time and never leaves it", () => {
    const c = crab({ idleUntil: 0 });
    let now = NOW;
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    let minS = Infinity;
    let maxS = -Infinity;
    for (let i = 0; i < 60000; i++) {
      stepCrab(c, frame({ nowMs: now }), rand);
      now += 16.66;
      minS = Math.min(minS, c.s);
      maxS = Math.max(maxS, c.s);
      expect(c.s).toBeGreaterThanOrEqual(0);
      expect(c.s).toBeLessThanOrEqual(CRAB_ROUTE_LENGTH);
      expect(c.hide).toBeGreaterThanOrEqual(0);
      expect(c.hide).toBeLessThanOrEqual(1);
    }
    expect(minS).toBeLessThan(CRAB_STOPS[1]);
    expect(maxS).toBeGreaterThan(CRAB_STOPS[CRAB_STOPS.length - 2]);
  });

  it("dead, it comes out of its cave, stays where it is and fades", () => {
    const c = crab({ s: CRAB_CAVES[0], state: "hidden", hide: 1 });
    stepCrab(c, frame({}, { isDead: true }), constant(0.5));
    expect(c.deathProgress).toBeGreaterThan(0);
    expect(c.hide).toBeLessThan(1);
    expect(c.s).toBe(CRAB_CAVES[0]);
    for (let i = 0; i < 100; i++) stepCrab(c, frame({}, { isDead: true }), constant(0.5));
    expect(c.hide).toBe(0);
  });

  it("back to life, its death is forgotten", () => {
    const c = crab({ deathProgress: 0.8 });
    stepCrab(c, frame(), constant(0.5));
    expect(c.deathProgress).toBe(0);
  });
});

describe("startleCrab()", () => {
  it("ignores a knock that is too far away", () => {
    const c = crab({ s: CRAB_START_S, state: "idle" });
    stepCrab(c, frame(), constant(0.5));
    expect(startleCrab(c, c.x - FLEE.radius - 50, c.y, NOW)).toBe(false);
    expect(c.state).toBe("idle");
    expect(c.fleeUntil).toBeUndefined();
  });

  it("makes it run to the nearest cave, much faster than it walks", () => {
    const c = crab({ s: CRAB_CAVES[0] + 100, state: "idle" });
    stepCrab(c, frame(), constant(0.5));
    expect(startleCrab(c, c.x - 120, c.y, NOW)).toBe(true);
    expect(c.state).toBe("moving");
    expect(c.goalS).toBe(CRAB_CAVES[0]);
    expect(c.fleeUntil).toBeGreaterThan(NOW);
    const before = c.s;
    stepCrab(c, frame(), constant(0.5));
    expect(before - c.s).toBeCloseTo(CRAB_MOVE.speed * FLEE.crawlerFactor, 6);
  });

  it("runs to the cave even when the knock is on its side: it has only one", () => {
    const c = crab({ s: CRAB_CAVES[0] - 150, state: "idle" });
    stepCrab(c, frame(), constant(0.5));
    const knockX = crabPointAt(CRAB_CAVES[0]).x + 20;
    expect(startleCrab(c, knockX, c.y, NOW)).toBe(true);
    expect(c.goalS).toBe(CRAB_CAVES[0]);
  });

  it("a knock on the side of the cave still sends it there, but a knock on the far side is no different", () => {
    const [near, far] = [crab({ s: CRAB_CAVES[0] - 150, state: "idle" }), crab({ s: CRAB_CAVES[0] - 150, state: "idle" })];
    stepCrab(near, frame(), constant(0.5));
    stepCrab(far, frame(), constant(0.5));
    startleCrab(near, near.x + 60, near.y, NOW);
    startleCrab(far, far.x - 60, far.y, NOW);
    expect(near.goalS).toBe(far.goalS);
  });

  it("when it is already at a cave, it goes in at once", () => {
    const c = crab({ s: CRAB_CAVES[0], state: "idle" });
    stepCrab(c, frame(), constant(0.5));
    startleCrab(c, c.x + 100, c.y, NOW);
    expect(c.state).toBe("hiding");
  });

  it("a crab that is hiding stays hidden for longer", () => {
    const c = crab({ s: CRAB_CAVES[0], state: "hidden", hide: 1, idleUntil: NOW + 100 });
    stepCrab(c, frame(), constant(0.5));
    expect(startleCrab(c, c.x + 100, c.y, NOW)).toBe(true);
    expect(c.idleUntil).toBe(NOW + CRAB_MOVE.fleeHidden[0]);
    const later = crab({ s: CRAB_CAVES[0], state: "hiding", hide: 0.4, idleUntil: NOW + 99_000_000 });
    stepCrab(later, frame(), constant(0.5));
    startleCrab(later, later.x + 100, later.y, NOW);
    expect(later.idleUntil).toBe(NOW + 99_000_000);
  });

  it("a crab that is coming out goes back in", () => {
    const c = crab({ s: CRAB_CAVES[0], state: "emerging", hide: 0.5 });
    stepCrab(c, frame(), constant(0.5));
    startleCrab(c, c.x + 100, c.y, NOW);
    expect(c.state).toBe("hiding");
  });

  it("works from anywhere in the tank, within the range of a knock", () => {
    const c = crab({ s: CRAB_START_S, state: "idle" });
    stepCrab(c, frame(), constant(0.5));
    expect(startleCrab(c, c.x - 200, c.y - 50, NOW)).toBe(true);
    expect(CRAB_CAVES).toContain(c.goalS);
  });
});

describe("the crab in the card", () => {
  const mount = async (config = {}, volume = 12, temp = 34) => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.v", temperature_entity: "sensor.t", theme: "saltwater", ...config });
    el.hass = { language: "en", states: { "sensor.v": { state: String(volume), last_changed: new Date().toISOString() }, "sensor.t": { state: String(temp), last_changed: new Date().toISOString() } } };
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  };
  const markup = (template) => template.strings.join("") + JSON.stringify(template.values);

  it("a knock on the glass sends it to a cave", async () => {
    const el = await mount();
    el._updatePhysics(1000);
    el._updatePhysics(1016);
    el._knockAt(el._crab.x - 80, el._crab.y, el._tankState());
    expect(el._crab.goalS).toBeDefined();
    expect(CRAB_CAVES).toContain(el._crab.goalS);
    expect(el._crab.fleeUntil).toBeGreaterThan(Date.now());
  });

  it("is drawn whole and in sight when it walks", async () => {
    const el = await mount();
    const out = markup(el._renderCrab(false));
    expect(out).toContain("1.4");
    expect(out).not.toContain("#f8fafc");
  });

  it("shrinks and fades as it goes into a cave, and only its eyes are left when it is hidden", async () => {
    const el = await mount();
    el._crab.hide = 0.5;
    const half = el._renderCrab(false);
    expect(markup(half)).toContain("scale(");
    expect(JSON.stringify(half.values)).toMatch(/0\.98/); // 1.4 * (1 - 0.5 * 0.6)
    expect(JSON.stringify(half.values)).not.toContain("#f8fafc");
    el._crab.hide = 1;
    const hidden = markup(el._renderCrab(false));
    expect(hidden).toContain("0.08"); // the body has faded to 8 %
    expect(hidden).toContain("#f8fafc"); // the two eyes
    expect(hidden.match(/<circle/g)).toHaveLength(4);
  });

  it("shows no eyes while it is only half hidden, nor when it is dead", async () => {
    const el = await mount();
    el._crab.hide = 0.8;
    expect(markup(el._renderCrab(false))).not.toContain("<circle");
    el._crab.hide = 1;
    expect(markup(el._renderCrab(true))).not.toContain("<circle");
  });

  it("there is no rock in the middle of the tank next to the anemone any more, and the rocks on the sand are only there", async () => {
    const reef = await mount();
    expect(reef.shadowRoot.querySelector("#live-rock-2")).toBeNull();
    const scattered = reef.shadowRoot.querySelectorAll("#live-rock-scattered path");
    expect(scattered.length).toBeGreaterThanOrEqual(5);
    // None of them reaches the anemone (its tentacles spread about 130 units on each side of x = 260).
    for (const path of scattered) {
      // The first point of each shape (the pits and the arcs have other numbers after it).
      const first = Number(path.getAttribute("d").match(/^M\s*(-?[\d.]+)/)[1]);
      expect(first).toBeGreaterThan(400);
    }
    const fresh = await mount({ theme: "freshwater" });
    expect(fresh.shadowRoot.querySelector("#live-rock-scattered")).toBeNull();
  });
});

describe("startleCrawler() without a special run, and for a crab that has no idea where it is going", () => {
  const lane = { minX: 100, maxX: 300, floorOffset: 20, speed: 1, firstIdle: [1, 1], nextIdle: [1, 1] };

  it("ignores a knock that is too far away", () => {
    const c = { x: 100, y: 500, targetX: 100, state: "idle", idleUntil: 0, dir: 1 };
    expect(startleCrawler(c, 100 + FLEE.radius + 50, 500, NOW, lane)).toBe(false);
    expect(c.state).toBe("idle");
  });

  it("runs along its whole lane when the specification has no longer run of its own", () => {
    const c = { x: 200, y: 500, targetX: 200, state: "idle", idleUntil: 0, dir: 1 };
    startleCrawler(c, 150, 500, NOW, lane);
    expect(c.targetX).toBe(300);
    const d = { x: 200, y: 500, targetX: 200, state: "idle", idleUntil: 0, dir: 1 };
    startleCrawler(d, 250, 500, NOW, lane);
    expect(d.targetX).toBe(100);
  });

  it("a knock exactly above a creature that has no direction yet sends it to the right", () => {
    const c = { x: 200, y: 500, targetX: 200, state: "idle", idleUntil: 0 };
    startleCrawler(c, 200, 500, NOW, lane);
    expect(c.targetX).toBe(300);
  });

  it("at the left end of its lane, a creature knocked from its left turns back to the right", () => {
    const c = { x: 100, y: 500, targetX: 100, state: "idle", idleUntil: 0, dir: 1 };
    startleCrawler(c, 150, 500, NOW, { ...lane, minX: 100, maxX: 300 });
    // Away from the knock is to the left, where the lane ends: so it goes the other way.
    expect(c.targetX).toBe(300);
  });

  it("a crab that is told to move without a goal stays where it is, then rests", () => {
    const c = crab({ s: 250, state: "moving" });
    stepCrab(c, frame(), constant(0.5));
    expect(c.s).toBe(250);
    expect(c.state).toBe("idle");
  });

  it("a crab that has not got a rest time yet is not frightened into a longer one by accident", () => {
    const c = crab({ s: CRAB_CAVES[0], state: "hidden", hide: 1 });
    delete c.idleUntil;
    stepCrab(c, frame(), constant(0.5));
    c.idleUntil = undefined;
    expect(startleCrab(c, c.x + 100, c.y, NOW)).toBe(true);
    expect(c.idleUntil).toBe(NOW + CRAB_MOVE.fleeHidden[0]);
  });
});

describe("a knock on a card whose creatures are gone", () => {
  it("does not throw", async () => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.v", theme: "saltwater" });
    el.hass = { language: "en", states: { "sensor.v": { state: "12", last_changed: new Date().toISOString() } } };
    document.body.appendChild(el);
    await el.updateComplete;
    el._ancistrus = null;
    el._shrimp = null;
    el._crab = null;
    el._goby = null;
    expect(() => el._knockAt(500, 300, el._tankState())).not.toThrow();
  });

  it("a card without a configuration does not change biotope", () => {
    const el = new (customElements.get("shower-aquarium-card"))();
    expect(() => el._switchBiotope(1)).not.toThrow();
    expect(el._themeOverride).toBeNull();
  });
});
