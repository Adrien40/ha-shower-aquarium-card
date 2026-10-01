// The pictures recorded as baselines: every biotope in every state the card
// can be in, plus the transient effects. Each scenario is played with a seeded
// random generator and a fake clock, so it always draws the same tank.
import { withFlakes, withRipples, withSensorLost, hassWith } from "./helpers.js";

export const SCENARIOS = {
  // Biotopes at rest
  "freshwater-calm": { config: { theme: "freshwater" }, volume: 12, temp: 34 },
  "saltwater-calm": { config: { theme: "saltwater" }, volume: 12, temp: 34 },
  "coldwater-calm": { config: { theme: "coldwater" }, volume: 12, temp: 34 },
  // The other looks of the living things
  "freshwater-cartoon": { config: { theme: "freshwater", creature_style: "cartoon" }, volume: 12, temp: 34 },
  "freshwater-realistic": { config: { theme: "freshwater", creature_style: "realistic" }, volume: 12, temp: 34 },
  "saltwater-cartoon": { config: { theme: "saltwater", creature_style: "cartoon" }, volume: 12, temp: 34 },
  "saltwater-realistic": { config: { theme: "saltwater", creature_style: "realistic" }, volume: 12, temp: 34 },
  "coldwater-cartoon": { config: { theme: "coldwater", creature_style: "cartoon" }, volume: 12, temp: 34 },
  "coldwater-realistic": { config: { theme: "coldwater", creature_style: "realistic" }, volume: 12, temp: 34 },
  // The previous drawing of the Ancistrus, the shrimp and the crab
  // States
  "freshwater-warning": { config: { theme: "freshwater" }, volume: 40, temp: 36 },
  "saltwater-over-budget": { config: { theme: "saltwater" }, volume: 55, temp: 36 },
  "coldwater-boiling": { config: { theme: "coldwater" }, volume: 12, temp: 42 },
  "freshwater-dead-by-heat": { config: { theme: "freshwater" }, volume: 12, temp: 50, frames: 420 },
  "saltwater-dead-by-heat": { config: { theme: "saltwater" }, volume: 12, temp: 50, frames: 420 },
  "coldwater-drained": { config: { theme: "coldwater" }, volume: 60, temp: 34, frames: 420 },
  "freshwater-dirty-algae": { config: { theme: "freshwater", algae_age: 40 }, volume: 12, temp: 34 },
  "freshwater-ten-fish": { config: { theme: "freshwater", fish_count: 10 }, volume: 12, temp: 34 },
  // Transient effects
  "freshwater-water-running": {
    config: { theme: "freshwater" },
    volume: 4,
    temp: 36,
    frames: 150,
    atFrame: { 10: (el) => (el.hass = hassWith(6, 36)), 60: (el) => (el.hass = hassWith(9, 36)), 110: (el) => (el.hass = hassWith(12, 36)) },
  },
  "saltwater-fish-food": { config: { theme: "saltwater" }, volume: 12, temp: 34, frames: 40, after: withFlakes },
  "saltwater-knock-on-the-glass": { config: { theme: "saltwater" }, volume: 12, temp: 34, after: withRipples },
  // The volume sensor is gone: the last volume stays, with a notice
  "freshwater-sensor-unavailable": { config: { theme: "freshwater" }, volume: 20, temp: 34, after: withSensorLost },
  "coldwater-fullscreen-sensor-unavailable": { config: { theme: "coldwater", fullscreen: true, show_cost: true, show_fps: true }, volume: 20, temp: 34, after: withSensorLost },
  // Fullscreen (gauges) and cost
  "coldwater-fullscreen": { config: { theme: "coldwater", fullscreen: true }, volume: 30, temp: 39 },
  "saltwater-fullscreen-cost": {
    config: { theme: "saltwater", fullscreen: true, show_cost: true },
    volume: 18,
    temp: 38.4,
  },
  "coldwater-fullscreen-arc": { config: { theme: "coldwater", fullscreen: true, gauge_style: "arc", show_budget: true }, volume: 30, temp: 39 },
  "saltwater-fullscreen-budget": { config: { theme: "saltwater", fullscreen: true, show_budget: true }, volume: 42, temp: 41.5 },
  "coldwater-fullscreen-no-consumption": { config: { theme: "coldwater", fullscreen: true, show_cost: true }, volume: 0, temp: 0 },
  "freshwater-fullscreen-dead": { config: { theme: "freshwater", fullscreen: true }, volume: 12, temp: 50, frames: 420 },
  // Fullscreen on screens of other shapes: the drawing follows the shape, nothing is stretched
  "saltwater-fullscreen-portrait": {
    config: { theme: "saltwater", fullscreen: true, show_cost: true },
    volume: 18,
    temp: 38.4,
    viewport: { width: 300, height: 600 },
  },
  "saltwater-fullscreen-ultrawide": {
    config: { theme: "saltwater", fullscreen: true, show_cost: true },
    volume: 18,
    temp: 38.4,
    viewport: { width: 900, height: 300 },
  },
  "coldwater-fullscreen-tablet-4x3": { config: { theme: "coldwater", fullscreen: true }, volume: 30, temp: 39, viewport: { width: 800, height: 600 } },
  "freshwater-fullscreen-dead-portrait": {
    config: { theme: "freshwater", fullscreen: true },
    volume: 12,
    temp: 50,
    frames: 2400,
    viewport: { width: 300, height: 600 },
  },
  // Performance profile
  "freshwater-light-profile": { config: { theme: "freshwater", animation_quality: "light" }, volume: 12, temp: 34 },
};
