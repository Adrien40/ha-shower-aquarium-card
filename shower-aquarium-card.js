import { LitElement, html, css } from "./lit-element-bundle.min.js";

const CARD_VERSION = "0.2.5-canvas";

const THEME_PRESETS = {
  freshwater: {
    waterTop: "#38bdf8",
    waterBottom: "#0284c7",
    sandColor: "#fde68a",
    background: "#f0fdfa",
    palette: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#84cc16"],
  },
  saltwater: {
    waterTop: "#06b6d4",
    waterBottom: "#0e7490",
    sandColor: "#fef08a",
    background: "#ecfeff",
    palette: ["#f97316", "#eab308", "#3b82f6", "#a855f7", "#ec4899", "#14b8a6", "#06b6d4", "#f43f5e", "#84cc16", "#6366f1"],
  },
  coldwater: {
    waterTop: "#67e8f9",
    waterBottom: "#0891b2",
    sandColor: "#cbd5e1",
    background: "#f8fafc",
    palette: ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fbbf24", "#d97706", "#b45309", "#78350f", "#ffffff", "#94a3b8"],
  },
};

class AquariumShowerCard extends LitElement {
  static get properties() {
    return {
      _hass: { type: Object },
      _config: { type: Object },
    };
  }

  constructor() {
    super();
    this._animationFrameId = null;
    this._lastTimestamp = 0;
    this._animTime = 0;
    this._cachedConsumedVolume = 0;
    this._cachedTemperature = 0;
    this._cachedTargetBudget = 50;
    this._cachedSurvivalVolume = 10;

    this._fishes = Array.from({ length: 4 }, (_, i) => ({
      color: THEME_PRESETS.freshwater.palette[i],
      x: 150 + i * 200,
      y: 200 + (i % 2) * 80,
      vx: 1.2 + Math.random() * 0.4,
      vy: 0.4 * (i % 2 === 0 ? 1 : -1),
      dir: i % 2 === 0 ? 1 : -1,
    }));

    this._ancistrus = { x: 70, y: 340, targetY: 340, idleUntil: 0 };
    this._bubbles = [
      { x: 180, y: 560, vy: 1.0, r: 4.5 },
      { x: 512, y: 570, vy: 0.8, r: 5.0 },
      { x: 820, y: 580, vy: 1.1, r: 4.0 },
    ];
  }

  static get styles() {
    return css`
      :host { display: block; width: 100%; box-sizing: border-box; }
      ha-card {
        padding: 0;
        background: transparent;
        border-radius: var(--ha-card-border-radius, 12px);
        overflow: hidden;
        position: relative;
      }
      :host([fullscreen]) {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        margin: 0; padding: 0;
        z-index: 1;
      }
      :host([fullscreen]) ha-card { height: 100%; width: 100%; border-radius: 0; border: none; }
      canvas { display: block; width: 100%; height: 100%; }
      .hud-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
      }
    `;
  }

  setConfig(config) {
    if (!config.entity) throw new Error("Please define a valid entity.");
    this._config = {
      theme: "freshwater",
      aspect_ratio_width: 1024,
      aspect_ratio_height: 600,
      fish_count: 4,
      target_budget: 50,
      survival_volume: 10,
      temp_deadly_threshold: 45,
      fish_speed_multiplier: 1.2,
      fullscreen: false,
      ...config,
    };
    if (this._config.fullscreen) this.setAttribute("fullscreen", "");
    else this.removeAttribute("fullscreen");
    this._updateCachedMetrics();
    this.requestUpdate();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateCachedMetrics();
    this.requestUpdate();
  }

  _updateCachedMetrics() {
    if (!this._hass || !this._config) return;
    if (this._config.entity && this._hass.states[this._config.entity]) {
      const v = parseFloat(this._hass.states[this._config.entity].state);
      this._cachedConsumedVolume = isNaN(v) ? 0 : Math.max(0, v);
    }
    if (this._config.temperature_entity && this._hass.states[this._config.temperature_entity]) {
      const t = parseFloat(this._hass.states[this._config.temperature_entity].state);
      this._cachedTemperature = isNaN(t) ? 0 : t;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._startLoop();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
  }

  firstUpdated() {
    this._canvas = this.shadowRoot.querySelector("#aquarium-canvas");
    this._ctx = this._canvas.getContext("2d");
  }

  _startLoop() {
    const loop = (timestamp) => {
      this._renderCanvas(timestamp);
      this._animationFrameId = requestAnimationFrame(loop);
    };
    this._animationFrameId = requestAnimationFrame(loop);
  }

  _renderCanvas(timestamp) {
    if (!this._ctx || !this._canvas) return;
    if (!this._lastTimestamp) this._lastTimestamp = timestamp;
    const deltaMs = timestamp - this._lastTimestamp;
    if (deltaMs < 31) return; // 30 FPS cap
    const delta = Math.min(deltaMs / 16.66, 2.5);
    this._lastTimestamp = timestamp;
    this._animTime = timestamp * 0.0035;

    const ctx = this._ctx;
    const w = 1024;
    const h = 600;
    const theme = THEME_PRESETS[this._config.theme || "freshwater"];

    const currentVolume = this._cachedConsumedVolume;
    const totalVolume = (Number(this._config.target_budget) || 50) + (Number(this._config.survival_volume) || 10);
    const waterRatio = Math.max(0, (totalVolume - currentVolume) / totalVolume);
    const waterSurfaceY = 565 - waterRatio * 565;

    // Clear and background
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, w, h);

    // Sand
    ctx.fillStyle = theme.sandColor;
    ctx.beginPath();
    ctx.moveTo(0, 540);
    ctx.quadraticCurveTo(280, 515, 512, 545);
    ctx.quadraticCurveTo(744, 575, 1024, 540);
    ctx.lineTo(1024, 600);
    ctx.lineTo(0, 600);
    ctx.closePath();
    ctx.fill();

    // Water block
    ctx.fillStyle = theme.waterBottom;
    ctx.globalAlpha = 0.45;
    ctx.fillRect(0, waterSurfaceY, w, 600 - waterSurfaceY);
    ctx.globalAlpha = 1.0;

    // Water wave line
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    const waveOffset = Math.sin(this._animTime * 1.5) * 4;
    ctx.moveTo(0, waterSurfaceY + waveOffset);
    ctx.quadraticCurveTo(512, waterSurfaceY - waveOffset, 1024, waterSurfaceY + waveOffset);
    ctx.stroke();

    // Bubbles
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.6;
    this._bubbles.forEach((b) => {
      b.y -= b.vy * delta;
      if (b.y < waterSurfaceY) b.y = 585;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Fishes
    const userSpeed = Number(this._config.fish_speed_multiplier) || 1.2;
    this._fishes.forEach((f) => {
      f.x += f.vx * f.dir * userSpeed * delta;
      f.y += f.vy * userSpeed * delta;
      if (f.x < 120) { f.x = 120; f.dir = 1; }
      else if (f.x > 900) { f.x = 900; f.dir = -1; }
      if (f.y < Math.max(45, waterSurfaceY + 35)) { f.y = Math.max(45, waterSurfaceY + 35); f.vy = Math.abs(f.vy); }
      else if (f.y > 555) { f.y = 555; f.vy = -Math.abs(f.vy); }

      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.scale(f.dir * 1.4, 1.4);
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tail
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-34, -12);
      ctx.lineTo(-28, 0);
      ctx.lineTo(-34, 12);
      ctx.closePath();
      ctx.fill();
      // Eye
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(15, -4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(16, -4, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Ancistrus
    const anc = this._ancistrus;
    if (timestamp >= anc.idleUntil) {
      anc.targetY = Math.max(70, waterSurfaceY + 70) + Math.random() * 300;
      anc.idleUntil = timestamp + 3500 + Math.random() * 4000;
    }
    anc.y += Math.sign(anc.targetY - anc.y) * Math.min(Math.abs(anc.targetY - anc.y), 0.7 * userSpeed * delta);

    ctx.save();
    ctx.translate(anc.x, anc.y);
    ctx.scale(1.5, 1.5);
    // Fins
    ctx.fillStyle = "#182026";
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(-18, 16, 12, 6, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(18, 16, 12, 6, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Body
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.ellipse(0, 30, 12, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    // Sucker
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.ellipse(0, 3, 7.4, 5.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.ellipse(0, 3, 4.8, 3.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  render() {
    if (!this._config || !this._hass) return html``;
    const isFullscreen = Boolean(this._config.fullscreen);
    const currentVolume = this._cachedConsumedVolume;
    const currentTemp = this._cachedTemperature;
    const targetBudget = Number(this._config.target_budget) || 50;

    const r = 74;
    const circ = 2 * Math.PI * r;
    const volFraction = Math.max(0, Math.min(1, currentVolume / Math.max(1, targetBudget)));
    const volArc = (volFraction * circ).toFixed(1);
    const tempFraction = Math.max(0, Math.min(1, currentTemp / 45));
    const tempArc = (tempFraction * circ).toFixed(1);

    return html`
      <ha-card>
        <canvas id="aquarium-canvas" width="1024" height="600"></canvas>
        ${isFullscreen ? html`
          <svg class="hud-overlay" viewBox="0 0 1024 600">
            <!-- Left Gauge: Temp -->
            <g transform="translate(94, 90)">
              <circle r="${r}" fill="#0f172a" opacity="0.16" />
              <circle r="${r}" fill="none" stroke="#ffffff" stroke-width="8" opacity="0.22" />
              <circle r="${r}" fill="none" stroke="#facc15" stroke-width="8" stroke-linecap="round" stroke-dasharray="${tempArc} ${circ.toFixed(1)}" transform="rotate(-90)" />
              <text y="10" font-family="system-ui, sans-serif" font-size="54" font-weight="900" fill="#ffffff" text-anchor="middle">${currentTemp.toFixed(1)}°</text>
              <text y="36" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff" opacity="0.9" text-anchor="middle" letter-spacing="1.2">TEMP</text>
            </g>
            <!-- Right Gauge: Litres -->
            <g transform="translate(930, 90)">
              <circle r="${r}" fill="#0f172a" opacity="0.16" />
              <circle r="${r}" fill="none" stroke="#ffffff" stroke-width="8" opacity="0.22" />
              <circle r="${r}" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" stroke-dasharray="${volArc} ${circ.toFixed(1)}" transform="rotate(-90)" />
              <text y="10" font-family="system-ui, sans-serif" font-size="54" font-weight="900" fill="#ffffff" text-anchor="middle">${currentVolume.toFixed(1)}</text>
              <text y="36" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff" opacity="0.9" text-anchor="middle" letter-spacing="1.2">LITRES</text>
            </g>
          </svg>
        ` : ""}
      </ha-card>
    `;
  }
}
customElements.define("shower-aquarium-card", AquariumShowerCard);
