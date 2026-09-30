// @vitest-environment happy-dom
//
// Whole-card property test: random configurations, random sensor data that
// changes while the animation runs, random frame rates. Whatever happens, the
// simulation must stay finite and inside its limits, and the drawing must
// never contain NaN or undefined.
import { describe, it, vi, beforeEach, afterEach } from "vitest";
import fc from "fast-check";
import "./shower-aquarium-card.js";

const T0 = 1_700_000_000_000;

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(T0);
  window.requestAnimationFrame = () => 1;
  window.cancelAnimationFrame = () => {};
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const num = (min, max) => fc.double({ min, max, noNaN: true, noDefaultInfinity: true });

const configArb = fc.record({
  theme: fc.constantFrom("freshwater", "saltwater", "coldwater"),
  fish_count: fc.integer({ min: 1, max: 10 }),
  animation_quality: fc.constantFrom("max", "balanced", "light"),
  fullscreen: fc.boolean(),
  target_budget: fc.integer({ min: 5, max: 200 }),
  survival_volume: fc.integer({ min: 1, max: 50 }),
  temp_boiling_threshold: fc.integer({ min: 30, max: 45 }),
  temp_deadly_threshold: fc.integer({ min: 46, max: 65 }),
  fish_speed_multiplier: num(0.2, 3),
  show_cost: fc.boolean(),
  algae_enabled: fc.boolean(),
  algae_age: fc.integer({ min: 0, max: 48 }),
});

const readingsArb = fc.array(
  fc.record({ volume: num(0, 300), temp: num(0, 70), atFrame: fc.integer({ min: 0, max: 150 }) }),
  { maxLength: 6 }
);

const hass = (volume, temp) => ({
  language: "en",
  states: {
    "sensor.shower_volume": { state: String(volume), last_changed: new Date().toISOString() },
    "sensor.shower_temp": { state: String(temp), last_changed: new Date().toISOString() },
  },
});

const creatures = (el) => [...el._fishes, ...el._snails, el._ancistrus, el._shrimp, el._crab].filter(Boolean);

describe("the whole card, under random configurations and random data", () => {
  it("keeps every number finite, every progress within 0..1, and never draws NaN", async () => {
    await fc.assert(
      fc.asyncProperty(configArb, readingsArb, fc.constantFrom(16.66, 33.3, 50), fc.integer({ min: 20, max: 160 }), async (config, readings, stepMs, frames) => {
        const el = new (customElements.get("shower-aquarium-card"))();
        el.setConfig({ entity: "sensor.shower_volume", temperature_entity: "sensor.shower_temp", ...config });
        el.hass = hass(5, 30);
        document.body.appendChild(el);

        for (let frame = 0; frame < frames; frame++) {
          vi.setSystemTime(T0 + Math.round(frame * stepMs));
          for (const r of readings) if (r.atFrame === frame) el.hass = hass(r.volume, r.temp);
          el._updatePhysics(1000 + frame * stepMs);

          for (const c of creatures(el)) {
            if (!Number.isFinite(c.x) || !Number.isFinite(c.y)) return false;
            if (c.deathProgress < 0 || c.deathProgress > 1) return false;
          }
          if (el._deathProgress < 0 || el._deathProgress > 1) return false;
          if (!Number.isFinite(el._flowIntensity) || el._flowIntensity < 0 || el._flowIntensity > 1) return false;
          if (el._food.length > 30) return false;
          if (!el._flowBubbles.every((b) => Number.isFinite(b.x) && Number.isFinite(b.y))) return false;
        }

        el.requestUpdate();
        await el.updateComplete;
        const markup = el.shadowRoot.innerHTML;
        const ok = !/NaN|undefined|Infinity/.test(markup) && el.shadowRoot.querySelector("svg") !== null;
        el.remove();
        return ok;
      }),
      { numRuns: 60 }
    );
  });

  it("the tank state always agrees with the readings: dead animals stay dead until the data recovers", async () => {
    await fc.assert(
      fc.asyncProperty(configArb, async (config) => {
        const el = new (customElements.get("shower-aquarium-card"))();
        el.setConfig({ entity: "sensor.shower_volume", temperature_entity: "sensor.shower_temp", ...config });
        el.hass = hass(1, config.temp_deadly_threshold + 5);
        for (let frame = 0; frame < 400; frame++) {
          vi.setSystemTime(T0 + frame * 20);
          el._updatePhysics(1000 + frame * 20);
        }
        const allDead = creatures(el).filter((c) => "deathProgress" in c).every((c) => c.deathProgress === 1);
        // Recovery: cool water, everything comes back to life.
        el.hass = hass(1, 25);
        vi.setSystemTime(T0 + 10_000);
        el._updatePhysics(1000 + 400 * 20 + 20);
        const allAlive = creatures(el).filter((c) => "deathProgress" in c).every((c) => c.deathProgress === 0);
        return allDead && allAlive && el._deathProgress === 0;
      }),
      { numRuns: 40 }
    );
  });

  it("a card with any valid-looking configuration renders on the first try", async () => {
    await fc.assert(
      fc.asyncProperty(configArb, num(0, 300), num(0, 70), async (config, volume, temp) => {
        const el = new (customElements.get("shower-aquarium-card"))();
        el.setConfig({ entity: "sensor.shower_volume", temperature_entity: "sensor.shower_temp", ...config });
        el.hass = hass(volume, temp);
        document.body.appendChild(el);
        await el.updateComplete;
        const ok = el.shadowRoot.querySelector("ha-card") !== null && !/NaN|undefined/.test(el.shadowRoot.innerHTML);
        el.remove();
        return ok;
      }),
      { numRuns: 60 }
    );
  });
});
