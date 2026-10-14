import { E, C, P, L, sh, memo } from "./skin.js";

// Where every fish is described, once, as shapes: the three looks (see skin.js)
// are drawn from these. The fish faces right, its head at +x, its tail at -x,
// and it fits in about -45..27 by -14..14 (the physics and the skeleton of the
// dead fish count on that). Each biotope has its own list of species.

/** @typedef {import("./skin.js").Shape} Shape */
/**
 * @typedef {object} FishSpec
 * @property {Shape[]} fins  drawn behind the body
 * @property {{ at: number[], mul: number, shapes: Shape[], rays: number[][] }} tail  turns with the tail wag
 * @property {Shape} body
 * @property {Shape[]} marks  stripes, bands, patches: drawn over the body
 * @property {Shape[]} over  small parts drawn over the marks (beak, eye spot)
 * @property {{ at: number[], shapes: Shape[] } | null} pec  pectoral fin, turns with the fin wag
 * @property {{ x: number, y: number, r: number, iris?: string, hl?: string }} eye
 * @property {number[]} area  [cx, cy, rx, ry] of the part of the body the scales and the light go on
 */

/**
 * @param {Partial<FishSpec> & Pick<FishSpec, "tail" | "body" | "eye" | "area">} s
 * @returns {FishSpec}
 */
const spec = (s) => ({ fins: [], marks: [], over: [], pec: null, ...s });

/** A wavy line across the body, from x0 to x1 at height y. @param {number} x0 @param {number} x1 @param {number} y */
const wavy = (x0, x1, y) => `M ${x0},${y} Q ${x0 + 6},${y - 4} ${x0 + 12},${y} T ${x1},${y}`;

// ---------------------------------------------------------------- freshwater

/** @param {string} color */
const angelfish = (color) =>
  spec({
    fins: [sh(P("5,-42 -10,-12 10,-12"), color, { op: 0.9 }), sh(P("0,42 -8,12 8,12"), color, { op: 0.9 }), sh(L(8, 10, 20, 48), undefined, { stroke: "#ffffff", sw: 2, lc: "round" })],
    tail: { at: [-22, 0], mul: 1, shapes: [sh(P("0,0 -20,-14 -15,0 -20,14"), color)], rays: [[-20, -14], [-17, 0], [-20, 14]] },
    body: sh(P("-20,0 5,-17 24,0 5,17"), color),
    marks: [sh(L(3, -17, 3, 17), undefined, { stroke: "#0f172a", sw: 3 })],
    eye: { x: 16, y: -3, r: 3, iris: "#ef4444" },
    area: [3, 0, 12, 10],
  });

const neon = () =>
  spec({
    tail: { at: [-20, 0], mul: 1, shapes: [sh(P("0,0 -14,-7 -12,0 -14,7"), "rgba(255,255,255,0.7)")], rays: [[-14, -7], [-12, 0], [-14, 7]] },
    body: sh(E(0, 0, 22, 9), "#1e293b"),
    marks: [sh("M 15,-2 L -17,-2", undefined, { stroke: "#06b6d4", sw: 3.5, lc: "round" }), sh("M 0,3 L -17,3", undefined, { stroke: "#ef4444", sw: 3.5, lc: "round" })],
    eye: { x: 14, y: -2, r: 2.2, iris: "#38bdf8" },
    area: [0, 0, 22, 9],
  });

// Discus: a round disc, orange with turquoise wavy lines and a red eye.
const discus = () =>
  spec({
    fins: [sh(C(2, 0, 24), "#b45309", { op: 0.75 })],
    tail: { at: [-19, 0], mul: 1, shapes: [sh("M 0,0 C -6,-8 -12,-7 -13,0 C -12,7 -6,8 0,0 Z", "#c2410c", { op: 0.85 })], rays: [[-12, -4], [-13, 0], [-12, 4]] },
    body: sh(C(2, 0, 20), "#ea6a2a"),
    marks: [wavy(-14, 18, -10), wavy(-14, 18, -2), wavy(-14, 18, 6)].map((d) => sh(d, undefined, { stroke: "#22d3ee", sw: 1.8, op: 0.85, lc: "round" })),
    eye: { x: 15, y: -3, r: 2.6, iris: "#dc2626" },
    area: [2, 0, 14, 14],
  });

// Guppy: a small silvery-blue body carrying a huge, spotted orange tail.
const guppy = () =>
  spec({
    fins: [sh(P("-4,-6 4,-14 10,-6"), "#f97316", { op: 0.9 })],
    tail: {
      at: [-16, 0],
      mul: 1,
      shapes: [
        sh("M 0,0 C -8,-12 -22,-15 -29,-8 C -26,-3 -26,3 -29,8 C -22,15 -8,12 0,0 Z", "#f97316", { op: 0.92 }),
        sh(C(-18, -6, 2.2), "#1e3a8a", { op: 0.8 }),
        sh(C(-22, 4, 2.6), "#1e3a8a", { op: 0.8 }),
        sh(C(-14, 5, 1.6), "#1e3a8a", { op: 0.7 }),
      ],
      rays: [[-29, -8], [-27, 0], [-29, 8]],
    },
    body: sh(E(0, 0, 17, 7.5), "#38bdf8"),
    marks: [sh(E(-2, 3.5, 13, 3), "#e0f2fe", { op: 0.55 }), sh(E(5, -2.5, 6, 2.2), "#0ea5e9", { op: 0.5 })],
    eye: { x: 12, y: -2, r: 2.2 },
    area: [0, 0, 13, 6],
  });

// Harlequin rasbora: a copper body with a black wedge on the rear half.
const rasbora = () =>
  spec({
    tail: { at: [-19, 0], mul: 1, shapes: [sh(P("0,0 -12,-8 -9,0 -12,8"), "#fdba74", { op: 0.9 })], rays: [[-12, -8], [-9, 0], [-12, 8]] },
    body: sh(E(0, 0, 19, 10), "#fb923c"),
    marks: [sh(E(-1, 6, 13, 3), "#fde68a", { op: 0.55 }), sh("M 6,-8.5 C 9,-4 9,4 6,8.5 C -2,8 -10,4 -16,1 C -10,-1 -2,-5 6,-8.5 Z", "#111827")],
    eye: { x: 13, y: -3, r: 2.4, iris: "#fde68a" },
    area: [0, -1, 14, 7],
  });

// Dwarf gourami: a deep blue body barred with orange, and thin feelers.
const gourami = () =>
  spec({
    fins: [sh(P("-14,-12 -3,-22 8,-12"), "#f97316", { op: 0.85 }), sh(P("-16,12 -4,20 10,12"), "#f97316", { op: 0.85 }), sh("M 12,8 C 18,16 20,24 18,32", undefined, { stroke: "#f97316", sw: 0.9, lc: "round" })],
    tail: { at: [-21, 0], mul: 1, shapes: [sh("M 0,0 C -8,-9 -14,-8 -15,0 C -14,8 -8,9 0,0 Z", "#3b82f6", { op: 0.85 })], rays: [[-13, -5], [-15, 0], [-13, 5]] },
    body: sh(E(0, 0, 21, 14), "#3b82f6"),
    marks: [-12, -6, 0, 6, 12].map((x, i) => sh(`M ${x - 4},-12 L ${x + 2},12`, undefined, { stroke: i % 2 ? "#1d4ed8" : "#f97316", sw: 1.6, op: 0.85 })),
    eye: { x: 14, y: -4, r: 2.8, iris: "#fef3c7" },
    area: [0, 0, 17, 11],
  });

// ----------------------------------------------------------------- saltwater

/** The clownfish: the male and the female differ in size (see pure.js). */
const clownfish = () => {
  const band = (/** @type {string} */ d) => sh(d, "#ffffff", { stroke: "#0f172a", sw: 1.4 });
  return spec({
    tail: { at: [-20, 0], mul: 1, shapes: [sh("M 0,0 C -12,-14 -18,-9 -20,0 C -18,9 -12,14 0,0 Z", "#ea580c", { stroke: "#0f172a", sw: 1.4 })], rays: [[-15, -6], [-17, 0], [-15, 6]] },
    body: sh(E(0, 0, 24, 15), "#f97316"),
    marks: [band("M 14,-12 Q 16,0, 14,12 L 9,12 Q 11,0, 9,-12 Z"), band("M -2,-15 Q 0,0, -2,15 L -7,15 Q -5,0, -7,-15 Z"), band("M -16,-11 Q -15,0, -16,11 L -20,11 Q -19,0, -20,-11 Z")],
    pec: { at: [3, 3], shapes: [sh(E(0, 6, 6, 10), "#f97316", { op: 0.9, stroke: "#0f172a", sw: 1 })] },
    eye: { x: 15, y: -4, r: 3.2 },
    area: [0, 0, 22, 13],
  });
};

const bluetang = () =>
  spec({
    tail: { at: [-25, 0], mul: 1, shapes: [sh(P("0,-2 -20,-13 -13,-2 -20,9 0,2"), "#f59e0b"), sh(P("0,-2 -17,-10 -12,-2 -17,7 0,1"), "#fde047", { op: 0.85 })], rays: [[-20, -13], [-13, -2], [-20, 9]] },
    body: sh("M 0,-20 C 14,-20 24,-10 25,0 C 24,10 14,20 0,20 C -16,19 -26,10 -26,0 C -26,-10 -16,-19 0,-20 Z", "url(#tangBodyGrad)"),
    marks: [sh("M -19,-10 C -5,-17 9,-15 14,-5 C 10,1 7,9 11,15 C 1,16 -11,12 -18,3 C -21,-1 -21,-6 -19,-10 Z", "#0f172a", { op: 0.88 })],
    over: [sh(C(19, 2, 1.5), "#facc15", { op: 0.8 })],
    eye: { x: 18, y: -6, r: 2.8, iris: "#0f172a", hl: "#93c5fd" },
    area: [-2, 0, 20, 16],
  });

// Royal gramma: purple in front, yellow behind, a dark stripe through the eye.
const gramma = () =>
  spec({
    fins: [sh("M -16,-8 C -8,-17 8,-16 14,-9 Z", "#facc15", { op: 0.9 })],
    tail: { at: [-22, 0], mul: 1, shapes: [sh("M 0,0 C -8,-9 -14,-9 -15,0 C -14,9 -8,9 0,0 Z", "#facc15")], rays: [[-13, -5], [-15, 0], [-13, 5]] },
    body: sh(E(0, 0, 22, 10.5), "#facc15"),
    marks: [sh("M -4,-10.3 A 22,10.5 0 0,1 22,0 A 22,10.5 0 0,1 -4,10.3 C 3,5 3,-5 -4,-10.3 Z", "#7c3aed"), sh("M 10,-3 L 22,-1", undefined, { stroke: "#1e1b4b", sw: 1.4, lc: "round" })],
    eye: { x: 16, y: -3, r: 2.6, iris: "#fde68a" },
    area: [0, 0, 18, 8],
  });

const butterflyfish = () => {
  const stripe = (/** @type {string} */ d, /** @type {number} */ op) => sh(d, undefined, { stroke: "#ea580c", sw: 1.3, op });
  return spec({
    tail: { at: [-22, 0], mul: 1, shapes: [sh(P("0,0 -12,-9 -8,0 -12,9"), "#fbbf24", { op: 0.9 })], rays: [[-12, -9], [-8, 0], [-12, 9]] },
    body: sh(E(0, 0, 23, 20), "url(#butterflyBodyGrad)"),
    marks: [stripe(L(-14, -16, -8, 17), 0.55), stripe(L(-6, -19, 0, 19), 0.55), stripe(L(2, -19, 7, 19), 0.55), stripe(L(10, -17, 14, 16), 0.5)],
    over: [sh("M 18,-3 Q 26,-1 27,0 Q 26,1 18,3 Z", "#fbbf24"), sh(C(-15, 0, 3), "#1f2937", { op: 0.8 }), sh(C(-15, 0, 1.6), "#fbbf24", { op: 0.9 })],
    eye: { x: 12.5, y: -4, r: 2.6, iris: "#0f172a", hl: "#e2e8f0" },
    area: [0, 0, 20, 17],
  });
};

// Yellow tang: a bright yellow disc with a pointed snout and a white spine at the tail.
const yellowtang = () =>
  spec({
    fins: [sh(P("-14,-15 0,-24 16,-12"), "#fde047", { op: 0.95 }), sh(P("-12,15 2,23 16,12"), "#fde047", { op: 0.95 })],
    tail: { at: [-22, 0], mul: 1, shapes: [sh(P("0,0 -12,-10 -8,0 -12,10"), "#fde047")], rays: [[-12, -10], [-8, 0], [-12, 10]] },
    body: sh(E(0, 0, 22, 17), "#fde047"),
    marks: [sh(E(2, 8, 16, 6), "#fef9c3", { op: 0.7 })],
    over: [sh("M 20,-3 Q 27,-1 28,0 Q 27,1 20,3 Z", "#fde047"), sh(C(-19, 0, 1.6), "#ffffff", { op: 0.9 })],
    eye: { x: 14, y: -5, r: 2.6, iris: "#ffffff" },
    area: [0, 0, 17, 14],
  });

// Blue-green chromis: a slim, shimmering body and a deeply forked tail.
const chromis = () =>
  spec({
    fins: [sh(P("-6,-7 4,-14 12,-7"), "#2dd4bf", { op: 0.9 }), sh(P("-8,7 0,12 8,7"), "#2dd4bf", { op: 0.9 })],
    tail: { at: [-20, 0], mul: 1, shapes: [sh(P("0,0 -14,-11 -9,0 -14,11"), "#2dd4bf")], rays: [[-14, -11], [-9, 0], [-14, 11]] },
    body: sh(E(0, 0, 20, 8.5), "url(#chromisGrad)"),
    marks: [sh(E(0, 4, 15, 2.6), "#e0f2fe", { op: 0.45 })],
    eye: { x: 14, y: -2, r: 2.2 },
    area: [0, 0, 16, 7],
  });

// Lyretail anthias: orange with a pink belly and a lyre-shaped tail.
const anthias = () =>
  spec({
    fins: [sh(P("-12,-8 4,-20 14,-8"), "#fb923c", { op: 0.9 })],
    tail: { at: [-21, 0], mul: 1, shapes: [sh("M 0,0 L -8,-10 L -18,-16 L -8,-3 L -7,0 L -8,3 L -18,16 L -8,10 Z", "#fb923c")], rays: [[-18, -16], [-7, 0], [-18, 16]] },
    body: sh(E(0, 0, 21, 9), "#f97316"),
    marks: [sh(E(0, 4.5, 15, 3.6), "#f9a8d4", { op: 0.65 })],
    eye: { x: 15, y: -2, r: 2.4, iris: "#fde68a" },
    area: [0, 0, 16, 7],
  });

// ---------------------------------------------------------------- cold water
// Goldfish of six kinds: they differ by shape, by colour and by their fins.

/** Ryukin: a deep body with a hump on the back and a flowing double tail. @param {string} color */
const ryukin = (color) =>
  spec({
    fins: [sh("M -4,-20 C 2,-33 18,-31 21,-18 Z", color, { op: 0.8 })],
    tail: { at: [-14, 0], mul: 1.1, shapes: [sh("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z", color, { op: 0.88 })], rays: [[-35, -11], [-43, 17], [-21, 34]] },
    body: sh("M -14,4 C -16,-12 -4,-26 10,-22 C 22,-19 28,-8 27,2 C 26,12 18,18 8,18 C -4,18 -14,14 -14,4 Z", color),
    marks: [sh(E(4, 9, 12, 6), "#ffffff", { op: 0.75 }), sh(E(-4, -10, 7, 4), "#ffffff", { op: 0.55 })],
    eye: { x: 21, y: -3, r: 3.4 },
    area: [6, 0, 15, 15],
  });

/** Comet: slim, with a long forked tail and white patches. @param {string} color */
const comet = (color) =>
  spec({
    fins: [sh(P("-4,-16 4,-25 14,-17"), color, { op: 0.85 })],
    tail: { at: [-16, 0], mul: 1, shapes: [sh("M 0,0 L -48,-19 L -30,-1 Z", color, { op: 0.92 }), sh("M 0,0 L -48,19 L -30,1 Z", color, { op: 0.8 })], rays: [[-48, -19], [-48, 19]] },
    body: sh("M -14,0 C -14,-11 -6,-19 8,-19 C 20,-19 27,-11 27,0 C 27,10 20,17 8,17 C -6,17 -14,10 -14,0 Z", color),
    marks: [sh(E(6, -5, 10, 4), "#ffffff", { op: 0.65 }), sh(E(-3, 5, 8, 3.5), "#ffffff", { op: 0.55 })],
    eye: { x: 20, y: -3, r: 3 },
    area: [6, 0, 17, 13],
  });

/** Pearlscale: a round ball, every scale a raised pearl. @param {string} color */
const pearlscale = (color) =>
  spec({
    tail: { at: [-14, 0], mul: 0.8, shapes: [sh("M 0,0 C -9,-12 -23,-12 -30,-2 C -22,2 -22,2 -30,6 C -23,14 -9,12 0,0 Z", color, { op: 0.88 })], rays: [[-30, -2], [-30, 6]] },
    body: sh(C(4, 2, 22), color),
    marks: [[-8, -4], [0, -12], [10, -10], [-10, 6], [-2, 0], [8, -2], [16, 4], [-4, 12], [6, 10], [14, 14]].map(([x, y]) => sh(C(x, y, 3.4), "#ffffff", { op: 0.32 })),
    eye: { x: 20, y: -1, r: 3 },
    area: [4, 2, 17, 17],
  });

// Oranda: a cream body, a red raspberry hood on the head and a long veil tail.
const oranda = () =>
  spec({
    fins: [sh("M -6,-15 C 0,-27 14,-26 15,-14 Z", "#fecdd3", { op: 0.85 })],
    tail: { at: [-15, 0], mul: 1, shapes: [sh("M 0,0 C -8,-16 -24,-20 -38,-13 C -31,-7 -30,-2 -32,3 C -28,10 -36,15 -38,19 C -24,22 -8,16 0,0 Z", "#fecdd3", { op: 0.88 })], rays: [[-38, -13], [-32, 3], [-38, 19]] },
    body: sh(E(4, 2, 21, 17), "#ffedd5"),
    marks: [sh(E(-2, -6, 14, 7), "#fdba74", { op: 0.55 })],
    over: [[22, -6, 6], [16, -13, 6.5], [8, -15, 6], [1, -12, 5]].map(([x, y, r]) => sh(C(x, y, r), "#dc2626")),
    eye: { x: 22, y: 0, r: 3 },
    area: [4, 3, 16, 13],
  });

// Black moor (a telescope goldfish): a black body, huge bulging eyes and a flowing black tail.
const blackmoor = () =>
  spec({
    fins: [sh("M -4,-18 C 2,-30 18,-28 20,-16 Z", "#1f2937", { op: 0.85 })],
    tail: { at: [-14, 0], mul: 1.1, shapes: [sh("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z", "#1f2937", { op: 0.9 })], rays: [[-35, -11], [-43, 17], [-21, 34]] },
    body: sh(C(6, 1, 21), "#111827"),
    marks: [sh(E(2, -9, 12, 5), "#475569", { op: 0.45 })],
    over: [sh(E(23, -6, 10.5, 9), "#1f2937")],
    eye: { x: 24, y: -6, r: 6, iris: "#f59e0b" },
    area: [6, 1, 16, 15],
  });

// Shubunkin: calico, a pale blue body patched with orange, red and black.
const shubunkin = () =>
  spec({
    fins: [sh(P("-6,-14 4,-24 14,-14"), "#dbeafe", { op: 0.85 })],
    tail: { at: [-20, 0], mul: 1, shapes: [sh("M 0,0 C -10,-15 -28,-15 -34,-5 L -30,0 L -34,5 C -28,15 -10,15 0,0 Z", "#dbeafe", { op: 0.85 })], rays: [[-34, -5], [-30, 0], [-34, 5]] },
    body: sh(E(2, 0, 24, 14), "#bfdbfe"),
    marks: [sh(E(-8, -4, 9, 6), "#f97316"), sh(E(9, 4, 6, 4.5), "#dc2626"), sh(C(2, -8, 2.2), "#1e3a8a", { op: 0.75 }), sh(C(-2, 7, 1.8), "#111827", { op: 0.7 }), sh(C(14, -5, 1.6), "#111827", { op: 0.7 })],
    eye: { x: 20, y: -3, r: 3 },
    area: [2, 0, 19, 11],
  });

/** @type {((color: string) => FishSpec)[]} */
const FRESHWATER = [angelfish, neon, discus, guppy, rasbora, gourami];
/** @type {((color: string) => FishSpec)[]} */
const SALTWATER = [clownfish, bluetang, gramma, butterflyfish, yellowtang, chromis, anthias];
/** @type {((color: string) => FishSpec)[]} */
const COLDWATER = [ryukin, comet, pearlscale, oranda, blackmoor, shubunkin];

/** How many species each biotope has (pure.js hands them out to the fish one after the other). */
export const FISH_SPECIES_COUNT = { freshwater: FRESHWATER.length, saltwater: SALTWATER.length, coldwater: COLDWATER.length };

/**
 * The shapes of one fish, by biotope and species.
 * @param {string} themeKey
 * @param {import("../types.js").Fish} fish
 * @returns {FishSpec}
 */
export function fishSpec(themeKey, fish) {
  const color = fish.color || "#3b82f6";
  const species = themeKey === "saltwater" ? SALTWATER : themeKey === "coldwater" ? COLDWATER : FRESHWATER;
  // A fish without a usable species number is drawn as the first species.
  const number = Math.abs(Math.trunc(Number(fish.species))) || 0;
  // The same fish is asked for every frame: the description is made once (it is never changed afterwards).
  return memo(`fish|${themeKey === "saltwater" || themeKey === "coldwater" ? themeKey : "freshwater"}|${number % species.length}|${color}`, () => species[number % species.length](color));
}
