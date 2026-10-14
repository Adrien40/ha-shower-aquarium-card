import { svg } from "lit";
import { skinned, shapeEl, sh, C, E, OUTLINE, memo } from "./skin.js";

// The redrawn Ancistrus, shrimp and crab. Each function draws what goes inside
// the group that positions, flips and fades the animal (see creatures.js), in
// the chosen look (see skin.js). The drawing they had before is still there, as
// the "classic" design.

/** @typedef {import("./skin.js").CreatureStyle} CreatureStyle */

/**
 * A closed outline that is the same on both sides of the line x = 0, from its
 * right half: a start on the line, then cubic segments (control, control, end)
 * that finish on the line again.
 * @param {number[]} start  [x, y] on the line
 * @param {number[][]} segments  [c1x, c1y, c2x, c2y, x, y] each
 */
export function symmetric(start, segments) {
  let d = `M${start[0]},${start[1]}`;
  for (const s of segments) d += ` C${s.join(",")}`;
  const points = [start, ...segments.map((s) => [s[4], s[5]])];
  for (let i = segments.length - 1; i >= 0; i--) {
    const [c1x, c1y, c2x, c2y] = segments[i];
    d += ` C${-c2x},${c2y} ${-c1x},${c1y} ${-points[i][0]},${points[i][1]}`;
  }
  return `${d} Z`;
}

/**
 * The two helpers every drawing uses: a filled shape in the chosen look (with
 * a thin edge of its own, or the outline of the cartoon look) and a line.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 * @param {Omit<import("./skin.js").Shape, "d" | "fill">} edge
 */
function tools(style, shading, edge) {
  /**
   * @param {string} d
   * @param {string} fill
   * @param {number} [op]
   */
  const k = (d, fill, op) => skinned(style, shading, d, fill, { ...(style === "cartoon" ? {} : edge), ...(op === undefined ? {} : { op }) });
  /**
   * @param {string} d
   * @param {number} w
   * @param {string} color
   * @param {number} [op]
   */
  const line = (d, w, color, op) => shapeEl(sh(d, undefined, { stroke: color, sw: w, op, lc: "round" }));
  return { k, line };
}

/**
 * How the legs move: `phase` grows with the distance walked, `stride` is how
 * wide they swing (0 at rest, 1 walking), `time` is the animation clock.
 * @typedef {{ phase?: number, stride?: number, time?: number }} Gait
 */

/** The four walking legs of the shrimp: the hip [x, y] and the line of the leg. @type {[number, number, string][]} */
const SHRIMP_LEGS = [
  [-24, 8, "M -24,8 L -27,16 L -31,21"],
  [-16, 9, "M -16,9 L -17,17 L -20,22"],
  [-8, 9, "M -8,9 L -8,17 L -10,22"],
  [0, 9, "M 0,9 L 1,17 L 0,22"],
];

/** The four walking legs on each side of the crab: the hip [x, y], the line of the leg and its light edge. @type {[number, number, string, string][]} */
const CRAB_LEGS = [
  [22, -4, "M 22,-4 L 33,-11 L 42,-6", "M 22,-4 L 33,-11"],
  [24, 1, "M 24,1 L 36,1 L 44,7", "M 24,1 L 36,1"],
  [22, 7, "M 22,7 L 32,14 L 38,24", "M 22,7 L 32,14"],
  [16, 12, "M 16,12 L 22,22 L 25,32", "M 16,12 L 22,22"],
];

/** The same content, drawn again on the other side of the line x = 0. @param {import("lit").SVGTemplateResult | import("lit").SVGTemplateResult[]} content */
const pair = (content) => svg`${content}<g transform="scale(-1,1)">${content}</g>`;

/**
 * Big shiny eyes of the cartoon look.
 * @param {number} x @param {number} y @param {number} r
 */
function bigEye(x, y, r) {
  return svg`
    ${shapeEl(sh(C(x, y, r), "#ffffff", { stroke: OUTLINE, sw: 1.2 }))}
    ${shapeEl(sh(C(x + r * 0.15, y + r * 0.1, r * 0.58), "#111827", { stroke: "none" }))}
    ${shapeEl(sh(C(x + r * 0.32, y - r * 0.3, r * 0.24), "#ffffff", { stroke: "none" }))}
  `;
}

/**
 * The Ancistrus (bristlenose pleco) seen from below, head at the top: a broad
 * flat head with a round sucker mouth, small fleshy tentacles on the snout,
 * pectoral and pelvic fins swept back along the body, a pale spotted belly.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 * @param {number} pulse  breathing of the mouth, 1 = still
 */
export function ancistrusRedrawn(style, shading, pulse) {
  // Only the breathing of the mouth changes from one frame to the next: the rest is drawn once and kept.
  const part = memo(`ancistrus|${style}|${shading}`, () => ancistrusParts(style, shading));
  return svg`${part.before}<g transform="translate(0, 3) scale(${pulse},${pulse})">${part.mouth}</g>${part.after}`;
}

/**
 * The Ancistrus in three parts: what is drawn before the mouth, the mouth itself and what is drawn after it.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 */
function ancistrusParts(style, shading) {
  const cartoon = style === "cartoon";
  const { k, line } = tools(style, shading, { stroke: "#0a0f14", sw: 0.8 });
  // Short papillae round the lips of the sucker.
  const papillae = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    return `M${(c * 6.5).toFixed(1)},${(s * 5).toFixed(1)} L${(c * 8.6).toFixed(1)},${(s * 6.7).toFixed(1)}`;
  }).join(" ");
  const before = svg`
    ${k(symmetric([0, 73], [[3, 75, 8, 80, 9, 89], [6, 91, 2, 88, 0, 84]]), "#182026")}
    ${style === "cartoon" ? "" : pair(line("M 1,76 L 6,88 M 1,76 L 8,86", 0.7, "#64748b", 0.5))}
    ${pair(svg`
      ${k("M 15,12 C 24,12 32,20 34,32 C 33,38 28,40 24,36 C 19,30 16,22 15,16 Z", "#182026")}
      ${cartoon ? "" : line("M 16,15 L 33,26 M 16,17 L 33,32 M 17,19 L 30,37 M 18,20 L 25,37", 0.7, "#64748b", 0.5)}
      ${line("M 15,12 C 24,12 31,19 34,31", 1.5, "#64748b", 0.9)}
      ${k("M 9,38 C 15,40 20,47 19,55 C 16,57 12,53 10,48 Z", "#182026")}
      ${cartoon ? "" : line("M 10,41 L 18,52 M 11,43 L 15,54", 0.6, "#64748b", 0.5)}
      ${k("M 4,60 C 7,60 9,64 8,68 C 6,68 4,66 3,64 Z", "#182026")}
    `)}
    ${k(symmetric([0, -11], [[7, -11, 13, -8, 15, -1], [17, 6, 18, 12, 16, 18], [14, 28, 11, 42, 8, 56], [6, 64, 3, 71, 0, 75]]), "#1e293b")}
    ${k(symmetric([0, 14], [[7, 14, 10, 22, 9, 32], [8, 44, 6, 56, 4, 66], [3, 69, 2, 71, 0, 72]]), "#475569", 0.9)}
    ${style === "flat"
      ? [[-3, 24, 1.2], [4, 30, 1], [-5, 38, 1.3], [3, 46, 1], [-3, 54, 1.2], [2, 62, 0.9], [-1, 32, 0.8], [5, 52, 0.8]].map(([x, y, r]) => shapeEl(sh(C(x, y, r), "#ffffff", { op: 0.7, stroke: "none" })))
      : ""}
    ${style === "realistic" ? pair(line("M 12,20 C 10,34 8,48 5,62", 0.9, "#0a0f14", 0.4)) : ""}
    ${pair(svg`
      ${line("M 6,-8 C 9,-12 12,-14 13,-19", 2.2, "#3b4a5f", 1)}
      ${line("M 10,-14 C 13,-15 15,-17 16,-20", 1.6, "#3b4a5f", 1)}
      ${line("M 2.5,-10 C 3.5,-14 3,-18 1.5,-21", 2.2, "#3b4a5f", 1)}
    `)}
  `;
  const mouth = svg`
      ${shapeEl(sh(E(0, 0, 9.2, 7.2), "#64748b", { stroke: "#0a0f14", sw: 0.9 }))}
      ${style === "cartoon" ? "" : line(papillae, 0.6, "#94a3b8", 0.7)}
      ${shapeEl(sh(E(0, 0, 6.3, 4.8), "#334155", { stroke: "#0a0f14", sw: 0.7 }))}
      ${shapeEl(sh(E(0, 0, 3.4, 2.5), "#0f172a", { stroke: "none" }))}
  `;
  const after = svg`
    ${cartoon
      ? svg`${bigEye(-9, -3, 3.8)}${bigEye(9, -3, 3.8)}${shapeEl(sh(E(-13, 9, 2.8, 1.8), "#fb7185", { op: 0.65, stroke: "none" }))}${shapeEl(sh(E(13, 9, 2.8, 1.8), "#fb7185", { op: 0.65, stroke: "none" }))}`
      : pair(svg`${shapeEl(sh(C(12.3, -3, 1.7), "#0a0f14", { stroke: "none" }))}${shapeEl(sh(C(12.7, -3.5, 0.5), "#f1f5f9", { stroke: "none" }))}`)}
    ${style === "realistic" ? shapeEl(sh(E(-4, 34, 2.4, 14), "#ffffff", { op: 0.1, stroke: "none" })) : ""}
  `;
  return { before, mouth, after };
}

/**
 * The shrimp, side view, head to the left: an abdomen arched in five segments
 * that ends in a tail fan, walking legs, long white antennae, an eye.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 * @param {Gait} [gait]  the walking legs (the swimmerets under the abdomen always flutter)
 */
export function shrimpRedrawn(style, shading, gait = {}) {
  const { phase = 0, stride = 0, time = 0 } = gait;
  const { line } = tools(style, shading, { stroke: "#7f1d1d", sw: 0.8 });
  const at = shrimpAt;
  const R = SHRIMP_ARCH[2];
  // The swimmerets flutter a little all the time, each one a little after the one before.
  const swimmerets = [0, 1, 2, 3, 4].map((i) => {
    const deg = -110 + i * 13;
    const half = 8 - i * 0.8;
    const [x1, y1] = at(deg, R - half);
    const [x2, y2] = at(deg, R - half - 4.5);
    const flutter = 0.3 * Math.sin(time * 6 + i * 1.1);
    const [dx, dy] = [x2 - x1, y2 - y1];
    const [fx, fy] = [x1 + dx * Math.cos(flutter) - dy * Math.sin(flutter), y1 + dx * Math.sin(flutter) + dy * Math.cos(flutter)];
    return `M${x1.toFixed(1)},${y1.toFixed(1)} L${fx.toFixed(1)},${fy.toFixed(1)}`;
  }).join(" ");
  // The four walking legs swing from their hips, one after the other.
  const legs = SHRIMP_LEGS.map(([hx, hy, d], i) => svg`<g transform="rotate(${(stride * 16 * Math.sin(phase + i * 1.7)).toFixed(1)} ${hx} ${hy})">${line(d, 1.6, "#7f1d1d", 0.85)}</g>`);
  // The legs and the swimmerets move; the rest of the shrimp is drawn once and kept.
  return svg`
    ${legs}
    ${line(swimmerets, 1.3, "#7f1d1d", 0.7)}
    ${memo(`shrimp|${style}|${shading}`, () => shrimpBody(style, shading))}
  `;
}

/** The arch of the abdomen of the shrimp: the centre of the circle it follows and its radius. */
const SHRIMP_ARCH = [22, 28, 27];

/**
 * A point of the abdomen of the shrimp: it follows a gentle arch, an arc of a wide circle whose centre lies below the shrimp.
 * @param {number} deg
 * @param {number} [r]
 */
function shrimpAt(deg, r = SHRIMP_ARCH[2]) {
  const [cx, cy] = SHRIMP_ARCH;
  return [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
}

/**
 * What of the shrimp does not move: the tail fan, the plates of the abdomen, the shell, the antennae and the eye.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 */
function shrimpBody(style, shading) {
  const cartoon = style === "cartoon";
  const { k, line } = tools(style, shading, { stroke: "#7f1d1d", sw: 0.8 });
  const at = shrimpAt;
  // The plate nearest the head lies over the next one.
  const segments = [4, 3, 2, 1, 0].map((i) => {
    const deg = -110 + i * 13;
    const [x, y] = at(deg);
    const half = 8 - i * 0.8;
    return svg`<g transform="rotate(${deg} ${x.toFixed(1)} ${y.toFixed(1)})">${k(E(Number(x.toFixed(1)), Number(y.toFixed(1)), half, 6.6 - i * 0.25), i % 2 ? "#c81e1e" : "#d42424")}</g>`;
  });
  const [tx, ty] = at(-45);
  const fanAngle = -45 + 90;
  return svg`
    <g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) rotate(${fanAngle})">
      ${k("M 0,-2.4 C 5,-9.5 11,-10.5 14,-7 C 11,-3.2 6,-1 0,0 Z", "#dc2626")}
      ${k("M 0,2.4 C 5,9.5 11,10.5 14,7 C 11,3.2 6,1 0,0 Z", "#dc2626")}
      ${k("M 0,-3 C 6,-3 11,-1.6 15,0 C 11,1.6 6,3 0,3 Z", "#ef4444")}
      ${cartoon ? "" : line("M 2,-1.5 L 12,-7 M 2,0 L 13,0 M 2,1.5 L 12,7", 0.7, "#7f1d1d", 0.5)}
    </g>
    ${segments}
    ${k("M -34,-3 C -34,-11 -25,-16 -12,-16 C 0,-16 10,-12 13,-4 C 15,1 12,6 6,8 L -14,8 C -27,8 -34,3 -34,-3 Z", "#dc2626")}
    ${cartoon ? "" : line("M -28,-12 C -18,-17 -2,-17 8,-14 C 12,-14 14,-12 16,-9", 2.2, "#fef2f2", 0.85)}
    ${k("M -33,-9 L -50,-13 L -35,-3 Z", "#dc2626")}
    ${line("M -32,-12 Q -60,-24 -88,-30 M -30,-9 Q -54,-12 -80,-10", 1.1, "#fef9c3", 0.9)}
    ${line("M -33,-9 Q -44,-8 -50,-2", 1, "#fef9c3", 0.8)}
    ${cartoon
      ? svg`${bigEye(-26, -12, 5)}${shapeEl(sh(E(-22, -2, 3.4, 2), "#fb7185", { op: 0.75, stroke: "none" }))}${shapeEl(sh("M -32,-4 Q -28,1 -23,-3", undefined, { stroke: OUTLINE, sw: 1.2, lc: "round" }))}`
      : svg`
          ${shapeEl(sh(C(-27, -13, 3), "#0f172a", { stroke: "none" }))}
          ${shapeEl(sh(C(-27.8, -14, 0.9), "#f1f5f9", { stroke: "none" }))}
        `}
    ${style === "flat" ? [[-22, -7], [-14, -10], [-6, -10], [1, -7]].map(([x, y]) => shapeEl(sh(C(x, y, 1.5), "#fef2f2", { op: 0.9, stroke: "none" }))) : ""}
    ${style === "realistic" ? shapeEl(sh(E(-8, -14, 12, 1.6), "#ffffff", { op: 0.35, stroke: "none" })) : ""}
  `;
}

/**
 * The crab, seen from above: pointed shell, eyes on stalks, two big claws with
 * teeth, four walking legs on each side.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 * @param {Gait} [gait]  the walking legs and claws
 */
export function crabRedrawn(style, shading, gait = {}) {
  const { phase = 0, stride = 0 } = gait;
  const cartoon = style === "cartoon";
  const { k, line } = tools(style, shading, { stroke: "#7c2d12", sw: 0.9 });
  // The arm and the claw only turn as a whole: they are drawn once and kept.
  const claw = memo(`crab-claw|${style}|${shading}`, () => svg`
        ${line("M 20,-8 L 30,-17", cartoon ? 4 : 3.4, "#7c2d12", 1)}
        ${k("M 27,-19 C 25,-30 34,-36 41,-33 C 46,-30 45,-25 41,-24 C 45,-21 43,-16 38,-16 C 33,-16 29,-17 27,-19 Z", "#ea580c")}
        ${k("M 31,-31 C 33,-40 42,-42 46,-37 C 42,-38 38,-36 36,-32 Z", "#ea580c")}
        ${style === "cartoon" ? "" : shapeEl(sh("M 36,-28 L 39,-31 L 40,-27 L 43,-29 M 34,-21 L 38,-22 L 38,-19 L 42,-20", undefined, { stroke: "#fef3c7", sw: 0.9, lc: "round", op: 0.8 }))}
      `);
  // One side of the crab: four legs that swing from their hips, in turn, and the arm with its claw that sways a little.
  // The two sides are in opposition, like a crab that walks sideways.
  const side = (/** @type {number} */ n) => {
    const swing = (/** @type {number} */ i) => (stride * 13 * Math.sin(phase + i * Math.PI + n * Math.PI)).toFixed(1);
    const legs = CRAB_LEGS.map(([hx, hy, d, light], i) => svg`
      <g transform="rotate(${swing(i)} ${hx} ${hy})">
        ${line(d, cartoon ? 3.2 : 2.6, "#7c2d12", 1)}
        ${cartoon ? "" : line(light, 0.8, "#f87171", 0.5)}
      </g>
    `);
    return svg`
      ${legs}
      <g transform="rotate(${(stride * 5 * Math.sin(phase * 0.7 + n * 1.3)).toFixed(1)} 20 -8)">${claw}</g>
    `;
  };
  return svg`
    ${side(0)}<g transform="scale(-1,1)">${side(1)}</g>
    ${memo(`crab-body|${style}|${shading}`, () => crabBody(style, shading))}
  `;
}

/**
 * What of the crab does not move: the shell, the eyes on their stalks and the face.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 */
function crabBody(style, shading) {
  const cartoon = style === "cartoon";
  const { k, line } = tools(style, shading, { stroke: "#7c2d12", sw: 0.9 });
  return svg`
    ${k("M 0,-15 C 10,-16 20,-14 26,-8 L 30,-2 L 27,4 C 24,12 14,18 0,18 C -14,18 -24,12 -27,4 L -30,-2 L -26,-8 C -20,-14 -10,-16 0,-15 Z", "#dc2626")}
    ${k("M 0,-11 C 9,-12 17,-10 22,-5 L 24,0 C 22,8 12,13 0,13 C -12,13 -22,8 -24,0 L -22,-5 C -17,-10 -9,-12 0,-11 Z", "#ef4444", 0.55)}
    ${style === "cartoon"
      ? ""
      : svg`
          ${line("M -14,-6 Q 0,-13 14,-6 M -16,2 Q 0,-4 16,2 M 0,-12 L 0,12", 0.9, "#7f1d1d", 0.4)}
          ${style === "flat" ? [[-9, 3, 1.6], [9, 4, 1.6], [0, 8, 1.4], [6, -5, 1.2], [-7, -4, 1.2]].map(([x, y, r]) => shapeEl(sh(C(x, y, r), "#fca5a5", { op: 0.85, stroke: "none" }))) : ""}
        `}
    ${pair(svg`${line("M 6,-15 L 7,-21", 1.4, "#7c2d12", 1)}${cartoon ? "" : shapeEl(sh(C(7, -22, 2.2), "#0f172a", { stroke: "none" }))}`)}
    ${cartoon
      ? svg`${bigEye(-7, -23, 5)}${bigEye(7, -23, 5)}${shapeEl(sh("M -6,8 Q 0,14 6,8", undefined, { stroke: OUTLINE, sw: 1.4, lc: "round" }))}${shapeEl(sh(E(-15, 6, 3.4, 2), "#fb7185", { op: 0.75, stroke: "none" }))}${shapeEl(sh(E(15, 6, 3.4, 2), "#fb7185", { op: 0.75, stroke: "none" }))}`
      : ""}
    ${style === "realistic" ? shapeEl(sh(E(-7, -8, 11, 2.2), "#ffffff", { op: 0.3, stroke: "none" })) : ""}
  `;
}
