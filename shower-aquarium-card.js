import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

class AquariumShowerCard extends LitElement {
  static get properties() {
    return {
      _hass: { type: Object },
      _config: { type: Object },
      _fishes: { type: Array },
    };
  }

  constructor() {
    super();
    this._animationFrameId = null;
    this._lastTimestamp = 0;
    this._fishes = [
      { name: "Adrien", color: "#3b82f6", x: 80, y: 140, vx: 0.8, vy: 0.3, dir: 1 },
      { name: "Magali", color: "#ec4899", x: 220, y: 160, vx: 0.7, vy: -0.4, dir: -1 },
      { name: "Nolan", color: "#10b981", x: 130, y: 180, vx: 1.1, vy: 0.5, dir: 1 },
      { name: "Lucas", color: "#f59e0b", x: 270, y: 130, vx: 0.9, vy: -0.3, dir: -1 },
    ];
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      ha-card {
        padding: 16px;
        background: var(--card-background-color, #ffffff);
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
        overflow: hidden;
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .card-title {
        font-size: 1.15rem;
        font-weight: 600;
        color: var(--primary-text-color, #1f2937);
      }
      .status-badge {
        font-size: 0.8rem;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 9999px;
        text-transform: capitalize;
      }
      .badge-good {
        background-color: #d1fae5;
        color: #065f46;
      }
      .badge-warning {
        background-color: #fef3c7;
        color: #92400e;
      }
      .badge-critical {
        background-color: #fee2e2;
        color: #991b1b;
      }
      .aquarium-container {
        position: relative;
        width: 100%;
        max-width: 420px;
        margin: 0 auto;
      }
      svg {
        width: 100%;
        height: auto;
        display: block;
      }
      .fish-label {
        font-size: 9px;
        font-weight: 600;
        fill: #1f2937;
        text-anchor: middle;
      }
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 14px;
        text-align: center;
      }
      .metric-box {
        background-color: var(--secondary-background-color, #f3f4f6);
        padding: 8px 4px;
        border-radius: 8px;
      }
      .metric-value {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--primary-text-color, #111827);
      }
      .metric-unit {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--secondary-text-color, #6b7280);
      }
      .metric-label {
        font-size: 0.7rem;
        color: var(--secondary-text-color, #6b7280);
        margin-top: 2px;
      }
    `;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Please define a valid entity.");
    }
    this._config = {
      title: "Aquarium Douche",
      target_budget: 35,
      survival_volume: 10,
      ...config,
    };

    if (config.fishes && Array.isArray(config.fishes)) {
      this._fishes = config.fishes.map((fish, index) => ({
        name: fish.name || `Fish ${index + 1}`,
        color: fish.color || "#3b82f6",
        x: 60 + index * 70,
        y: 140 + (index % 2) * 30,
        vx: 0.7 + (index % 3) * 0.2,
        vy: 0.3 * (index % 2 === 0 ? 1 : -1),
        dir: index % 2 === 0 ? 1 : -1,
      }));
    }
  }

  set hass(hass) {
    this._hass = hass;
  }

  connectedCallback() {
    super.connectedCallback();
    this._startAnimation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
  }

  _startAnimation() {
    if (!this._animationFrameId) {
      const loop = (timestamp) => {
        this._updatePhysics(timestamp);
        this._animationFrameId = requestAnimationFrame(loop);
      };
      this._animationFrameId = requestAnimationFrame(loop);
    }
  }

  _stopAnimation() {
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }

  _updatePhysics(timestamp) {
    if (!this._lastTimestamp) {
      this._lastTimestamp = timestamp;
    }
    const delta = Math.min((timestamp - this._lastTimestamp) / 16.66, 2.0);
    this._lastTimestamp = timestamp;

    const currentVolume = this._getConsumedVolume();
    const targetBudget = Number(this._config.target_budget) || 35;
    const survivalVolume = Number(this._config.survival_volume) || 10;
    const totalVolume = targetBudget + survivalVolume;

    const remainingVolume = Math.max(0, totalVolume - currentVolume);
    const waterRatio = remainingVolume / totalVolume;

    const tankTop = 50;
    const tankBottom = 230;
    const tankHeight = tankBottom - tankTop;
    const waterSurfaceY = tankBottom - waterRatio * tankHeight;

    const isDead = remainingVolume <= 0;
    const isStressed = currentVolume > targetBudget && !isDead;

    const speedMultiplier = isStressed ? 1.8 : 1.0;

    let stateChanged = false;

    this._fishes.forEach((fish) => {
      if (isDead) {
        fish.y = Math.min(tankBottom - 10, fish.y + 0.5 * delta);
        stateChanged = true;
        return;
      }

      const minY = Math.max(tankTop + 15, waterSurfaceY + 15);
      const maxY = tankBottom - 15;

      fish.x += fish.vx * fish.dir * speedMultiplier * delta;
      fish.y += fish.vy * speedMultiplier * delta;

      if (fish.x < 55) {
        fish.x = 55;
        fish.dir = 1;
      } else if (fish.x > 345) {
        fish.x = 345;
        fish.dir = -1;
      }

      if (fish.y < minY) {
        fish.y = minY;
        fish.vy = Math.abs(fish.vy);
      } else if (fish.y > maxY) {
        fish.y = maxY;
        fish.vy = -Math.abs(fish.vy);
      }

      stateChanged = true;
    });

    if (stateChanged) {
      this.requestUpdate();
    }
  }

  _getConsumedVolume() {
    if (!this._hass || !this._config || !this._config.entity) {
      return 0;
    }
    const entityState = this._hass.states[this._config.entity];
    if (!entityState || isNaN(parseFloat(entityState.state))) {
      return 0;
    }
    return Math.max(0, parseFloat(entityState.state));
  }

  render() {
    if (!this._config || !this._hass) {
      return html``;
    }

    const currentVolume = this._getConsumedVolume();
    const targetBudget = Number(this._config.target_budget) || 35;
    const survivalVolume = Number(this._config.survival_volume) || 10;
    const totalVolume = targetBudget + survivalVolume;

    const remainingVolume = Math.max(0, totalVolume - currentVolume);
    const waterRatio = Math.max(0, Math.min(1, remainingVolume / totalVolume));

    const tankTop = 50;
    const tankBottom = 230;
    const tankHeight = tankBottom - tankTop;
    const waterSurfaceY = tankBottom - waterRatio * tankHeight;

    const isDead = remainingVolume <= 0;
    const isCritical = currentVolume > targetBudget && !isDead;
    const isWarning = currentVolume > targetBudget * 0.7 && !isCritical && !isDead;

    let statusText = "Tout va bien";
    let badgeClass = "badge-good";

    if (isDead) {
      statusText = "Aquarium à sec";
      badgeClass = "badge-critical";
    } else if (isCritical) {
      statusText = "Zone de survie";
      badgeClass = "badge-critical";
    } else if (isWarning) {
      statusText = "Attention au débit";
      badgeClass = "badge-warning";
    }

    const waterColorStart = isCritical
      ? "#ef4444"
      : isWarning
      ? "#38bdf8"
      : "#0ea5e9";
    const waterColorEnd = isCritical
      ? "#991b1b"
      : isWarning
      ? "#0284c7"
      : "#0369a1";

    return html`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${this._config.title}</span>
          <span class="status-badge ${badgeClass}">${statusText}</span>
        </div>

        <div class="aquarium-container">
          <svg viewBox="0 0 400 260">
            <defs>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
                <stop offset="10%" stop-color="#ffffff" stop-opacity="0.05" />
                <stop offset="90%" stop-color="#ffffff" stop-opacity="0.05" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.3" />
              </linearGradient>

              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${waterColorStart}" stop-opacity="0.65" />
                <stop offset="100%" stop-color="${waterColorEnd}" stop-opacity="0.9" />
              </linearGradient>

              <clipPath id="innerTankClip">
                <rect x="25" y="45" width="350" height="190" rx="14" ry="14" />
              </clipPath>
            </defs>

            <rect
              x="25"
              y="45"
              width="350"
              height="190"
              rx="14"
              ry="14"
              fill="#f0fdfa"
            />

            <path
              d="M 25 210 Q 110 205, 200 215 T 375 210 L 375 235 Q 375 235, 360 235 L 40 235 Q 25 235, 25 235 Z"
              fill="#fde68a"
              clip-path="url(#innerTankClip)"
            />

            <g clip-path="url(#innerTankClip)">
              <path
                d="M 45 235 Q 35 170, 50 130 Q 65 170, 55 235 Z"
                fill="#10b981"
                opacity="0.75"
              />
              <path
                d="M 55 235 Q 70 180, 60 145 Q 50 185, 62 235 Z"
                fill="#059669"
                opacity="0.6"
              />
              <path
                d="M 350 235 Q 365 175, 345 135 Q 335 180, 342 235 Z"
                fill="#10b981"
                opacity="0.75"
              />
            </g>

            ${waterRatio > 0
              ? html`
                  <g clip-path="url(#innerTankClip)">
                    <rect
                      x="25"
                      y="${waterSurfaceY}"
                      width="350"
                      height="${235 - waterSurfaceY}"
                      fill="url(#waterGrad)"
                    />
                    <line
                      x1="25"
                      y1="${waterSurfaceY}"
                      x2="375"
                      y2="${waterSurfaceY}"
                      stroke="#ffffff"
                      stroke-width="2.5"
                      stroke-opacity="0.7"
                    />
                  </g>
                `
              : ""}

            <g clip-path="url(#innerTankClip)">
              ${this._fishes.map((fish) => {
                const isFlipped = fish.dir === -1;
                const rotation = isDead ? 180 : 0;
                return html`
                  <g
                    transform="translate(${fish.x}, ${fish.y}) rotate(${rotation})"
                  >
                    <g transform="scale(${isFlipped ? -1 : 1}, 1)">
                      <polygon
                        points="-14,0 -24,-8 -22,0 -24,8"
                        fill="${fish.color}"
                      />
                      <ellipse
                        cx="0"
                        cy="0"
                        rx="14"
                        ry="9"
                        fill="${fish.color}"
                      />
                      ${isDead
                        ? html`
                            <line
                              x1="6"
                              y1="-4"
                              x2="10"
                              y2="0"
                              stroke="#ffffff"
                              stroke-width="1.5"
                            />
                            <line
                              x1="10"
                              y1="-4"
                              x2="6"
                              y2="0"
                              stroke="#ffffff"
                              stroke-width="1.5"
                            />
                          `
                        : html`
                            <circle cx="8" cy="-2" r="2.5" fill="#ffffff" />
                            <circle cx="9" cy="-2" r="1.2" fill="#111827" />
                          `}
                    </g>
                    <text
                      x="0"
                      y="${isDead ? 16 : -13}"
                      class="fish-label"
                      transform="${isDead ? "scale(1, -1)" : ""}"
                    >
                      ${fish.name}
                    </text>
                  </g>
                `;
              })}
            </g>

            <rect
              x="25"
              y="45"
              width="350"
              height="190"
              rx="14"
              ry="14"
              fill="url(#glassGrad)"
              stroke="#94a3b8"
              stroke-width="3"
            />

            <rect
              x="20"
              y="40"
              width="360"
              height="8"
              rx="4"
              ry="4"
              fill="#334155"
            />

            <rect
              x="18"
              y="235"
              width="364"
              height="10"
              rx="3"
              ry="3"
              fill="#1e293b"
            />
          </svg>
        </div>

        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-value">
              ${currentVolume.toFixed(1)} <span class="metric-unit">L</span>
            </div>
            <div class="metric-label">Consommé</div>
          </div>
          <div class="metric-box">
            <div class="metric-value">
              ${remainingVolume.toFixed(1)} <span class="metric-unit">L</span>
            </div>
            <div class="metric-label">Restant</div>
          </div>
          <div class="metric-box">
            <div class="metric-value">
              ${targetBudget} <span class="metric-unit">L</span>
            </div>
            <div class="metric-label">Objectif</div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 4;
  }
}

customElements.define("shower-aquarium-card", AquariumShowerCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "shower-aquarium-card",
  name: "Shower Aquarium Card",
  preview: true,
  description: "An animated aquarium dashboard card reflecting shower water usage.",
});
