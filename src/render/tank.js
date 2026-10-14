import { svg } from "lit";

/**
 * Backdrop of the tank: the themed background and the sand bed.
 * @param {object} p
 * @param {boolean} p.isFullscreen
 * @param {number} p.canvasH
 * @param {number} p.canvasBottom
 * @param {number} p.tankBottom
 * @param {import("../types.js").ThemePreset} p.theme
 */
export function renderTankBackdrop({ isFullscreen, canvasH, canvasBottom, tankBottom, theme }) {
  return svg`
    <rect
      x="${isFullscreen ? 0 : 12}"
      y="${isFullscreen ? 0 : 14}"
      width="${isFullscreen ? 1024 : 1000}"
      height="${isFullscreen ? canvasH : canvasBottom - 14}"
      fill="${theme.background}"
    />

    <path
      d="M ${isFullscreen ? 0 : 12} ${tankBottom - 60} Q 280 ${tankBottom - 85}, 512 ${tankBottom - 55} T ${isFullscreen ? 1024 : 1012} ${tankBottom - 60} L ${isFullscreen ? 1024 : 1012} ${tankBottom} L ${isFullscreen ? 0 : 12} ${tankBottom} Z"
      fill="${theme.sandColor}"
    />
  `;
}

/**
 * Glass front and stand of the tank; nothing in fullscreen mode.
 * @param {boolean} isFullscreen
 * @param {number} canvasBottom
 */
export function renderTankGlass(isFullscreen, canvasBottom) {
  if (isFullscreen) return svg``;
  return svg`
    <rect x="12" y="14" width="1000" height="${canvasBottom - 14}" rx="18" ry="18" fill="url(#glassGrad)" stroke="#94a3b8" stroke-width="3" />
    <rect x="4" y="${canvasBottom}" width="1016" height="14" rx="4" ry="4" fill="#1e293b" />
  `;
}
