import { svg } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

// Everything the three looks of the living things have in common. The look is
// chosen with the `creature_style` option:
//  - "flat":      flat colours plus small details (gills, fin rays, a belly light);
//  - "cartoon":   a dark outline round every shape, big shiny eyes, rosy cheeks, a smile;
//  - "realistic": soft shading and a shine over the shapes, scales, translucent fins.

/** @typedef {"flat" | "cartoon" | "realistic"} CreatureStyle */
/** @typedef {{ d: string, fill?: string, stroke?: string, sw?: number, op?: number, lc?: string }} Shape */

/** The looks, in the order the editor lists them. */
export const CREATURE_STYLES = ["flat", "cartoon", "realistic"];

/** Colour of the outline of the cartoon look. */
export const OUTLINE = "#1e293b";

/**
 * The look chosen for this card.
 * @param {import("../types.js").RenderHost} ctx the card element
 * @returns {CreatureStyle}
 */
export function creatureStyle(ctx) {
  return /** @type {CreatureStyle} */ (ctx._config?.creature_style || "flat");
}

/**
 * Whether soft shading may be drawn: it costs a gradient fill per shape, so the
 * light animation profile (weak screens) leaves it out.
 * @param {import("../types.js").RenderHost} ctx the card element
 */
export function shadingAllowed(ctx) {
  return ctx._profile.shading;
}

// Path builders: every shape of the living things is a path, so one template draws them all.
/** @param {number} cx @param {number} cy @param {number} rx @param {number} ry */
export const E = (cx, cy, rx, ry) => `M${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy} Z`;
/** @param {number} cx @param {number} cy @param {number} r */
export const C = (cx, cy, r) => E(cx, cy, r, r);
/** @param {string} points  "x,y x,y x,y" */
export const P = (points) => `M${points.trim().split(/\s+/).join(" L")} Z`;
/** @param {number} x1 @param {number} y1 @param {number} x2 @param {number} y2 */
export const L = (x1, y1, x2, y2) => `M${x1},${y1} L${x2},${y2}`;

/**
 * A shape. Without a fill it is a line.
 * @param {string} d
 * @param {string} [fill]
 * @param {Omit<Shape, "d" | "fill">} [extra]
 * @returns {Shape}
 */
export const sh = (d, fill, extra = {}) => ({ d, fill, ...extra });

/**
 * Draws a shape. With `outline`, a shape that has no stroke of its own gets the
 * dark outline of the cartoon look.
 * @param {Shape} s
 * @param {boolean} [outline]
 */
export function shapeEl(s, outline = false) {
  return svg`<path d="${s.d}" fill="${s.fill ?? "none"}" stroke="${ifDefined(s.stroke ?? (outline ? OUTLINE : undefined))}" stroke-width="${ifDefined(s.sw ?? (outline ? 1.6 : undefined))}" stroke-linecap="${ifDefined(s.lc)}" stroke-linejoin="round" opacity="${ifDefined(s.op)}" />`;
}

/**
 * A filled shape in the chosen look: as it is, with the outline of the cartoon
 * look, or with the soft shading laid over it (realistic look).
 * @param {CreatureStyle} style
 * @param {boolean} shading  whether the realistic look may draw its shading
 * @param {string} d
 * @param {string} fill
 * @param {Omit<Shape, "d" | "fill">} [extra]
 */
export function skinned(style, shading, d, fill, extra = {}) {
  const base = shapeEl(sh(d, fill, extra), style === "cartoon");
  return style === "realistic" && shading ? svg`${base}<path d="${d}" fill="url(#shade)" opacity="${ifDefined(extra.op)}" />` : base;
}

/**
 * The transform of a plant or a coral that dies with the tank: it shrinks and
 * falls over, about its foot (px, py). `death` goes from 0 (alive) to 1 (dead);
 * undefined while alive, so the drawing is left as it was.
 *
 * @param {number} px
 * @param {number} py
 * @param {number} tilt  degrees it has turned when dead (positive: to the right)
 * @param {number} shrink  share of its height it has lost when dead
 * @param {number} death
 * @returns {string | undefined}
 */
export function wilt(px, py, tilt, shrink, death) {
  if (!(death > 0)) return undefined;
  const d = Math.min(1, death);
  return `translate(${px} ${py}) rotate(${(tilt * d).toFixed(1)}) scale(1 ${(1 - shrink * d).toFixed(3)}) translate(${-px} ${-py})`;
}

// Things that do not change from one frame to the next (the rocks, the plants,
// the shape of a fish) are built once and kept: the card draws 20 to 60 times a
// second, and building them again each time is wasted work on a weak display.
const MEMO_LIMIT = 600;
/** @type {Map<string, unknown>} */
const memoStore = new Map();

/**
 * The value `build()` makes for `key`, made once and kept (the oldest entries go
 * when there are too many, e.g. after many resizes of a fullscreen card). The key
 * must say everything the value depends on.
 *
 * @template T
 * @param {string} key
 * @param {() => T} build
 * @returns {T}
 */
export function memo(key, build) {
  if (memoStore.has(key)) return /** @type {T} */ (memoStore.get(key));
  const value = build();
  memoStore.set(key, value);
  // Building one thing may keep others (a group of rocks keeps each rock): the limit is checked afterwards.
  while (memoStore.size > MEMO_LIMIT) memoStore.delete(/** @type {string} */ (memoStore.keys().next().value));
  return value;
}

/** How many things are kept (for the tests). */
export const memoSize = () => memoStore.size;
/** Empties the memory (for the tests). */
export const memoClear = () => memoStore.clear();
/** The most things kept. */
export const MEMO_MAX = MEMO_LIMIT;
