import { svg } from "lit";
import { fishSpec } from "./fish-specs.js";
import { OUTLINE, shapeEl, sh, E, creatureStyle, shadingAllowed } from "./skin.js";
import { renderStressDots } from "./stress.js";

/** @typedef {import("./skin.js").CreatureStyle} CreatureStyle */
/** @typedef {import("./fish-specs.js").FishSpec} FishSpec */

/**
 * The small arcs of the scales, laid out on a staggered grid inside the
 * `area` [cx, cy, rx, ry] of the body.
 * @param {number[]} area
 */
function scales(area) {
  const [cx, cy, rx, ry] = area;
  const arcs = [];
  let row = 0;
  for (let y = cy - ry * 0.7; y <= cy + ry * 0.7; y += 5) {
    for (let x = cx - rx * 0.8 + (row % 2) * 3; x <= cx + rx * 0.8; x += 6) {
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 0.72) arcs.push(`M${x.toFixed(1)},${y.toFixed(1)} q3,2.4 6,0`);
    }
    row++;
  }
  return arcs.join(" ");
}

/**
 * The eye, in the chosen look.
 * @param {CreatureStyle} style
 * @param {FishSpec["eye"]} e
 */
function eye(style, e) {
  const iris = e.iris ?? "#ffffff";
  const highlight = e.hl ?? "#ffffff";
  if (style === "cartoon") {
    const R = e.r * 2.1;
    return svg`
      <circle cx="${e.x}" cy="${e.y}" r="${R}" fill="#ffffff" stroke="${OUTLINE}" stroke-width="1.5" />
      <circle cx="${e.x + R * 0.12}" cy="${e.y + R * 0.1}" r="${R * 0.6}" fill="#111827" />
      <circle cx="${e.x + R * 0.3}" cy="${e.y - R * 0.28}" r="${R * 0.26}" fill="#ffffff" />
      <circle cx="${e.x - R * 0.12}" cy="${e.y + R * 0.3}" r="${R * 0.12}" fill="#ffffff" />
    `;
  }
  if (style === "realistic") {
    return svg`
      <circle cx="${e.x}" cy="${e.y}" r="${e.r * 1.15}" fill="${iris === "#ffffff" ? "#fef3c7" : iris}" stroke="#111827" stroke-opacity="0.8" stroke-width="0.9" />
      <circle cx="${e.x + 0.4}" cy="${e.y}" r="${e.r * 0.62}" fill="#000000" />
      <circle cx="${e.x - e.r * 0.3}" cy="${e.y - e.r * 0.4}" r="${e.r * 0.28}" fill="${highlight}" />
    `;
  }
  return svg`
    <circle cx="${e.x}" cy="${e.y}" r="${e.r}" fill="${iris}" />
    <circle cx="${e.x + 1}" cy="${e.y}" r="${e.r * 0.48}" fill="#0f172a" />
    <circle cx="${e.x + 0.4}" cy="${e.y - e.r * 0.4}" r="${e.r * 0.2}" fill="${highlight}" />
  `;
}

/**
 * What the chosen look adds over the body: a belly light and a gill line
 * (flat), rosy cheeks and a smile (cartoon), shading, scales and a shine
 * (realistic).
 * @param {CreatureStyle} style
 * @param {boolean} shading
 * @param {FishSpec} f
 */
function overBody(style, shading, f) {
  const [cx, cy, rx, ry] = f.area;
  const e = f.eye;
  if (style === "cartoon") {
    return svg`
      ${shapeEl(sh(E(e.x - e.r * 0.4, e.y + e.r * 3.1, e.r * 1.3, e.r * 0.8), "#fb7185", { op: 0.7, stroke: "none" }))}
      ${shapeEl(sh(`M${e.x + e.r * 0.6},${e.y + e.r * 2.7} q${e.r * 1.2},${e.r * 1.1} ${e.r * 2.4},0`, undefined, { stroke: OUTLINE, sw: 1.3, lc: "round" }))}
    `;
  }
  if (style === "realistic") {
    return svg`
      ${shading ? svg`<path d="${f.body.d}" fill="url(#shade)" />` : ""}
      ${shapeEl(sh(scales(f.area), undefined, { stroke: "#0f172a", sw: 0.8, op: 0.22 }))}
      ${shapeEl(sh(E(cx - rx * 0.15, cy - ry * 0.62, rx * 0.6, Math.max(1.4, ry * 0.13)), "#ffffff", { op: 0.3 }))}
    `;
  }
  return svg`
    ${shapeEl(sh(E(cx, cy + ry * 0.55, rx * 0.85, ry * 0.4), "#ffffff", { op: 0.14 }))}
    ${shapeEl(sh(`M${e.x - e.r * 1.6},${e.y + e.r * 0.8} q${-e.r * 0.9},${e.r * 2.2} 0,${e.r * 4.4}`, undefined, { stroke: "#0f172a", sw: 1, op: 0.22, lc: "round" }))}
  `;
}

/**
 * A whole fish, in the chosen look.
 * @param {CreatureStyle} style
 * @param {boolean} shading
 * @param {FishSpec} f
 * @param {number} tailWag
 * @param {number} finWag
 * @param {number} [stress]  0..1: white dots of stress over the body
 * @param {number} [time]  animation clock, for the twinkling of the dots
 */
export function drawFish(style, shading, f, tailWag, finWag, stress = 0, time = 0) {
  const outline = style === "cartoon";
  const rays = style === "cartoon" ? [] : f.tail.rays;
  const rayOpacity = style === "realistic" ? 0.32 : 0.16;
  return svg`
    ${f.fins.map((s) => shapeEl(s, outline))}
    <g transform="translate(${f.tail.at[0]}, ${f.tail.at[1]}) rotate(${tailWag * f.tail.mul})">
      ${f.tail.shapes.map((s) => shapeEl(s, outline))}
      ${rays.map(([x, y]) => shapeEl(sh(`M0,0 L${x},${y}`, undefined, { stroke: "#0f172a", sw: 0.9, op: rayOpacity })))}
    </g>
    ${shapeEl(f.body, outline)}
    ${f.marks.map((s) => shapeEl(s, outline))}
    ${overBody(style, shading, f)}
    ${f.over.map((s) => shapeEl(s, outline))}
    ${renderStressDots(stress, f.area, time)}
    ${f.pec
      ? svg`<g transform="translate(${f.pec.at[0]}, ${f.pec.at[1]}) rotate(${finWag})">${f.pec.shapes.map((s) => shapeEl(s, outline))}</g>`
      : ""}
    ${eye(style, f.eye)}
  `;
}

/**
 * One fish (or its skeleton once dead), chosen by biotope and species.
 * @param {import("../types.js").RenderHost} ctx the card element (reads its animation clock and its look)
 * @param {import("../types.js").Fish} fish
 * @param {string} themeKey
 * @param {boolean} isDead
 */
export function renderFishShape(ctx, fish, themeKey, isDead) {
  const isFlipped = fish.dir === -1;
  const p = fish.deathProgress || 0;
  const s = fish.scale || 1.4;
  const bodyOpacity = (1.0 - p).toFixed(2);
  const skeletonOpacity = p.toFixed(2);

  const scare = isDead ? 0 : fish.scare || 0;
  const tailWag = isDead
    ? 0
    : Math.sin(ctx._animTime * (3.5 * fish.vx) + fish.phase) * 14 * (1 + 0.8 * scare);
  const finWag = isDead
    ? 0
    : Math.sin(ctx._animTime * (4.5 * fish.vx) + fish.phase) * 10;

  const stress = isDead ? 0 : fish.stress || 0;
  const bodySvg = drawFish(creatureStyle(ctx), shadingAllowed(ctx), fishSpec(themeKey, fish), tailWag, finWag, stress, ctx._ambientTime);

  return svg`
    <g transform="scale(${isFlipped ? -s : s}, ${isDead ? -s : s})">
      <g opacity="${bodyOpacity}">${bodySvg}</g>${p > 0
        ? svg`
            <g opacity="${skeletonOpacity}">
              <!-- Fish Spine -->
              <line x1="-28" y1="0" x2="16" y2="0" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round" />
              <!-- Fish ribs -->
              <path d="M -20,-8 L -16,0 L -20,8 M -12,-11 L -8,0 L -12,11 M -4,-12 L 0,0 L -4,12 M 4,-10 L 8,0 L 4,10" stroke="#f1f5f9" stroke-width="1.8" stroke-linecap="round" fill="none" />
              <!-- Tail fin rays -->
              <path d="M -28,0 L -36,-10 M -28,0 L -38,0 M -28,0 L -36,10" stroke="#e2e8f0" stroke-width="1.8" stroke-linecap="round" />
              <!-- Skull -->
              <path d="M 12,-9 C 24,-9 27,0 25,9 C 18,9 14,5 12,0 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1" />
              <circle cx="18" cy="-2" r="2.8" fill="#0f172a" />
            </g>
          `
        : ""}
    </g>
  `;
}
