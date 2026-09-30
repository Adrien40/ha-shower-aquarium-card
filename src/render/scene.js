import { html, svg } from "lit";
import { renderSensorBadge } from "./hud.js";
import { renderStatusPanel } from "./gauges.js";
import { renderDefs } from "./defs.js";
import { renderTankBackdrop, renderTankGlass } from "./tank.js";
import { renderSnails } from "./snails.js";
import { creatureStyle, shadingAllowed } from "./skin.js";
import { renderBubbles, renderBoilingBubbles } from "./effects.js";

/** @typedef {import("../types.js").SceneView} SceneView */
/** @typedef {import("../shower-aquarium-card.js").AquariumShowerCard} AquariumShowerCard */

/**
 * The picture of the tank: the SVG with the water, the creatures, the effects,
 * the gauges of fullscreen mode and the notices. The gauges and the cost only
 * appear once some water has been consumed. Everything it needs to know
 * about the current state comes in `view`; the creatures and the animation
 * clocks are read from the card itself.
 *
 * @param {AquariumShowerCard} host  the card element
 * @param {SceneView} view
 */
export function renderTankSvg(host, view) {
  const {
    isFullscreen,
    canvasH,
    canvasBottom,
    ariaLabel,
    aspectWidth,
    aspectHeight,
    themeKey,
    theme,
    waterColorStart,
    waterColorEnd,
    isBoiling,
    isDead,
    waterRatio,
    waterSurfaceY,
    tankBottom,
    effectiveAlgaeHours,
    showReadings,
    displayedTemp,
    currentVolume,
    targetBudget,
    comfortMin,
    deadlyTemp,
    boilTemp,
    gaugeStyle,
    showBudget,
    cost,
    lang,
    sensorLost,
  } = view;
  return html`
    <svg
      role="img"
      aria-label="${ariaLabel}"
      @click=${(/** @type {MouseEvent} */ e) => host._onTankTap(e)}
      viewBox="0 0 1024 ${canvasH}"
      preserveAspectRatio="xMidYMid meet"
      shape-rendering="${host._profile.antialias ? "auto" : "optimizeSpeed"}"
      style="${isFullscreen
        ? "width: 100%; height: 100%;"
        : `aspect-ratio: ${aspectWidth} /${aspectHeight};`}"
    >
      ${renderDefs({ isFullscreen, canvasH, canvasBottom, waterColorStart, waterColorEnd, isBoiling })}

      <g clip-path="url(#innerTankClip)">
        ${renderTankBackdrop({ isFullscreen, canvasH, canvasBottom, tankBottom, theme })}

        ${host._renderThemeDecoration(themeKey, isFullscreen, host._deathProgress)}

        ${renderSnails(host._snails, themeKey, isDead, creatureStyle(host), shadingAllowed(host))}

        ${waterRatio > 0
          ? svg`
              <g>
                <rect
                  x="${isFullscreen ? 0 : 12}"
                  y="${waterSurfaceY - 5}"
                  width="${isFullscreen ? 1024 : 1000}"
                  height="${tankBottom - waterSurfaceY + 5}"
                  fill="url(#waterGrad)"
                />
                ${host._renderWaterSurface(
                  isFullscreen ? 0 : 12,
                  isFullscreen ? 1024 : 1012,
                  waterSurfaceY
                )}
              </g>
            `
          : ""}

        ${waterRatio > 0 && !isDead ? renderBubbles(host._bubbles) : ""}

        ${waterRatio > 0 && !isDead ? host._renderFlowBubbles() : ""}
        ${host._renderFood()}

        ${isBoiling && waterRatio > 0 ? renderBoilingBubbles(host._boilingBubbles) : ""}

        <g>
          ${(host._fishes || []).map((fish) => {
            return svg`
              <g transform="translate(${fish.x},${fish.y})">
                ${host._renderFishShape(fish, themeKey, isDead)}
              </g>
            `;
          })}
        </g>

        ${themeKey === "freshwater" ? host._renderAncistrus(isDead) : ""}
        ${themeKey === "saltwater" ? host._renderShrimp(isDead) : ""}
        ${themeKey === "saltwater" ? host._renderCrab(isDead) : ""}
        ${themeKey === "saltwater" ? host._renderGoby(isDead) : ""}
        ${host._renderAlgae(effectiveAlgaeHours, isFullscreen)}
        ${host._renderRipples()}

        <!-- Modern Frosted Glass HUD Gauges -->
        ${isFullscreen && showReadings
          ? renderStatusPanel({
              style: gaugeStyle,
              currentTemp: displayedTemp,
              currentVolume,
              targetBudget,
              comfortMin,
              deadlyTemp,
              boilTemp,
              showBudget,
              lang,
            })
          : ""}
        ${isFullscreen && showReadings ? host._renderCostLabel(cost) : ""}

        ${host._renderFpsBadge()}
        ${renderSensorBadge(host, sensorLost, isFullscreen && showReadings)}
      </g>

      ${renderTankGlass(isFullscreen, canvasBottom)}
    </svg>
  `;
}
