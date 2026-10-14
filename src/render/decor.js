import { saltwaterDecor } from "./saltwater.js";
import { coldwaterDecor } from "./coldwater.js";
import { freshwaterDecor } from "./freshwater.js";
import { creatureStyle, shadingAllowed } from "./skin.js";

/**
 * Bottom decoration of the tank, chosen by biotope.
 * @param {import("../types.js").RenderHost} ctx the card element
 * @param {string} themeKey
 * @param {boolean} isFullscreen
 * @param {number} [deathProgress]
 */
export function renderThemeDecoration(ctx, themeKey, isFullscreen, deathProgress = 0) {
  const bottomY = isFullscreen ? ctx._getCanvasHeight() : ctx._getCanvasHeight() - 35;
  // Living decor (plants, corals, anemone) fades to a dull, withered look
  // as the tank dies; rocks and sand are left untouched.
  // The light profile fades the decor instead of using CSS filters, which
  // are costly on weak displays.
  const lifeStyle = ctx._profile.deathFilter
    ? `filter: grayscale(${(deathProgress * 0.85).toFixed(2)}) sepia(${(deathProgress * 0.5).toFixed(2)}) brightness(${(1 - deathProgress * 0.45).toFixed(2)});`
    : `opacity: ${(1 - deathProgress * 0.6).toFixed(2)};`;

  if (themeKey === "saltwater") return saltwaterDecor(ctx, bottomY, lifeStyle, deathProgress);
  if (themeKey === "coldwater") return coldwaterDecor(bottomY, creatureStyle(ctx), shadingAllowed(ctx));
  return freshwaterDecor(bottomY, lifeStyle, creatureStyle(ctx), shadingAllowed(ctx), deathProgress);
}
