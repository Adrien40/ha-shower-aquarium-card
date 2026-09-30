import { svg } from "lit";

/**
 * The reusable paint of the picture: glass and water gradients, the fish body
 * gradients, the algae pattern and the clip that keeps everything inside the tank.
 * @param {object} p
 * @param {boolean} p.isFullscreen
 * @param {number} p.canvasH
 * @param {number} p.canvasBottom
 * @param {string} p.waterColorStart  top colour of the water gradient
 * @param {string} p.waterColorEnd  bottom colour of the water gradient
 * @param {boolean} p.isBoiling
 */
export function renderDefs({ isFullscreen, canvasH, canvasBottom, waterColorStart, waterColorEnd, isBoiling }) {
  return svg`
    <defs>
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
        <stop offset="10%" stop-color="#ffffff" stop-opacity="0.02" />
        <stop offset="90%" stop-color="#ffffff" stop-opacity="0.02" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18" />
      </linearGradient>

      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${waterColorStart}" stop-opacity="${isBoiling ? "0.5" : "0.25"}" />
        <stop offset="100%" stop-color="${waterColorEnd}" stop-opacity="${isBoiling ? "0.75" : "0.45"}" />
      </linearGradient>

      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.42" />
        <stop offset="0.5" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="1" stop-color="#000000" stop-opacity="0.3" />
      </linearGradient>

      <linearGradient id="tangBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1e3a8a" />
        <stop offset="55%" stop-color="#2563eb" />
        <stop offset="100%" stop-color="#60a5fa" />
      </linearGradient>

      <linearGradient id="chromisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0d9488" />
        <stop offset="55%" stop-color="#2dd4bf" />
        <stop offset="100%" stop-color="#a5f3fc" />
      </linearGradient>

      <linearGradient id="butterflyBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="55%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#f97316" />
      </linearGradient>

      <pattern id="algaeDots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="2.5" cy="3" r="1.4" fill="#2d4a1d" opacity="0.95" />
        <circle cx="8.5" cy="6" r="1.8" fill="#1e3312" opacity="0.98" />
        <circle cx="5" cy="10" r="1.3" fill="#365314" opacity="0.9" />
        <circle cx="10" cy="11" r="1.5" fill="#1b2e10" opacity="0.95" />
      </pattern>

      <clipPath id="innerTankClip">
        ${isFullscreen
          ? svg`<rect x="0" y="0" width="1024" height="${canvasH}" />`
          : svg`<rect x="12" y="14" width="1000" height="${canvasBottom - 14}" rx="18" ry="18" />`}
      </clipPath>
    </defs>
  `;
}
