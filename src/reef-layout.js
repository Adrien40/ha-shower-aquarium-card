// Where the things of the reef tank stand, in the 1024-wide drawing. The drawing
// of the decor (render/saltwater.js) and the walking area of the crab and the
// shrimp (physics.js) read it from here, so the crab really walks on its rocks.

/**
 * The pile of live rock in the right-hand corner. The crab lives on the flat
 * rock at three quarters of the height of the pile.
 */
export const REEF_PILE = Object.freeze({
  /** left and right ends of the pile */
  x0: 776,
  x1: 1010,
  /** height of the highest rock above the tank bottom */
  height: 254,
  /** height of the flat rock the crab walks on: three quarters of the pile */
  ledge: 190,
  /** the part of the flat rock the crab walks on */
  ledgeFrom: 880,
  ledgeTo: 940,
});

/**
 * The way the crab takes through the reef, as a chain of stops from the grotto
 * on the left, over the sand, to the pile of live rock and up to its flat
 * rock. `x` is the position in the drawing, `h` the height of its feet above
 * the bottom of the tank. A stop with `cave` is a place where it can hide: the
 * grotto of the middle of the tank and the cave in the front of the pile.
 */
export const CRAB_ROUTE = Object.freeze([
  { x: 372, h: 24, cave: true },
  { x: 500, h: 26, cave: false },
  { x: 650, h: 26, cave: false },
  { x: 770, h: 26, cave: false },
  { x: 884, h: 22, cave: true },
  { x: 850, h: 118, cave: false },
  { x: 880, h: 190, cave: false },
  { x: 940, h: 190, cave: false },
]);

/** Distance (in drawing units) from the start of the route to each of its stops. */
export const CRAB_STOPS = Object.freeze(
  CRAB_ROUTE.reduce((/** @type {number[]} */ stops, stop, i) => {
    if (i === 0) return [0];
    const before = CRAB_ROUTE[i - 1];
    return [...stops, stops[i - 1] + Math.hypot(stop.x - before.x, stop.h - before.h)];
  }, [])
);

/** Length of the whole route. */
export const CRAB_ROUTE_LENGTH = CRAB_STOPS[CRAB_STOPS.length - 1];

/**
 * Where the crab is after walking `s` units along its route (clamped to it).
 * @param {number} s
 * @returns {{ x: number, h: number }}
 */
export function crabPointAt(s) {
  const d = Math.max(0, Math.min(CRAB_ROUTE_LENGTH, s));
  let i = 1;
  while (i < CRAB_STOPS.length - 1 && CRAB_STOPS[i] < d) i++;
  const [a, b] = [CRAB_ROUTE[i - 1], CRAB_ROUTE[i]];
  const t = (d - CRAB_STOPS[i - 1]) / (CRAB_STOPS[i] - CRAB_STOPS[i - 1]);
  return { x: a.x + (b.x - a.x) * t, h: a.h + (b.h - a.h) * t };
}

/** Distances along the route of the places where the crab can hide. */
export const CRAB_CAVES = Object.freeze(CRAB_STOPS.filter((_, i) => CRAB_ROUTE[i].cave));

/** The crab starts in the middle of its flat rock, at the end of the route. */
export const CRAB_START_S = CRAB_ROUTE_LENGTH - (CRAB_ROUTE[7].x - CRAB_ROUTE[6].x) / 2;
