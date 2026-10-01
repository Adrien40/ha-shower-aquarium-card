import { svg } from "lit";

// The white dots that appear on the fish and the other animals when the glass
// is knocked: the sign of stress. They are laid out on a spiral inside an
// ellipse of the body (the same layout every time, so they do not jump), they
// twinkle a little, and they go away one by one as the stress fades.

/** How many dots a stressed animal shows at most. */
export const STRESS_DOTS = 11;

const GOLDEN_ANGLE = 2.399963;

/**
 * Dots in the unit disc: [x, y, radius factor] for each of them, the outer
 * ones last (they are the first to go).
 * @type {number[][]}
 */
const LAYOUT = Array.from({ length: STRESS_DOTS }, (_, i) => {
  const r = Math.sqrt((i + 0.5) / STRESS_DOTS) * 0.85;
  const a = i * GOLDEN_ANGLE;
  return [r * Math.cos(a), r * Math.sin(a), 0.75 + ((i * 7) % 3) * 0.3];
});

/**
 * How many dots are shown at a stress level from 0 (calm) to 1 (a knock just
 * happened).
 * @param {number} stress
 * @returns {number}
 */
export function stressDotCount(stress) {
  if (!(stress > 0)) return 0;
  return Math.min(STRESS_DOTS, Math.ceil(stress * STRESS_DOTS));
}

/**
 * The dots, over the ellipse `area` [cx, cy, rx, ry] of a body. A thin dark
 * edge keeps them visible on a pale body.
 * @param {number} stress  0..1
 * @param {number[]} area  [cx, cy, rx, ry] in the units of the animal
 * @param {number} time  animation clock, for the twinkling
 * @param {number} [size]  radius of an average dot
 */
export function renderStressDots(stress, area, time, size = 1.7) {
  const count = stressDotCount(stress);
  if (count === 0) return svg``;
  const [cx, cy, rx, ry] = area;
  const strength = Math.min(1, 0.35 + stress);
  return svg`
    <g class="stress-dots" pointer-events="none">
      ${LAYOUT.slice(0, count).map(([x, y, k], i) => {
        const twinkle = 0.8 + 0.2 * Math.sin(time * 5 + i * 1.7);
        return svg`<circle cx="${(cx + x * rx).toFixed(1)}" cy="${(cy + y * ry).toFixed(1)}" r="${(size * k).toFixed(2)}" fill="#ffffff" fill-opacity="${(strength * twinkle).toFixed(2)}" stroke="#0f172a" stroke-opacity="${(0.28 * strength).toFixed(2)}" stroke-width="0.4" />`;
      })}
    </g>
  `;
}
