// Smoke test of the shipped bundle. Unlike the unit tests (which import
// src/), this loads dist/shower-aquarium-card.js exactly as Home Assistant
// does, so it catches bundling regressions: a leftover import, a missing
// dependency, an element that is not registered, a stale version.
import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distPath = resolve(root, "dist/shower-aquarium-card.js");
const packageVersion = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).version;

// The bundle is a single self-contained file; keep an eye on its weight.
const MAX_BUNDLE_BYTES = 150 * 1024;

describe("dist/shower-aquarium-card.js", () => {
  it("exists (run `npm run build` first)", () => {
    expect(existsSync(distPath)).toBe(true);
  });

  const source = existsSync(distPath) ? readFileSync(distPath, "utf8") : "";

  it("stays within the size budget", () => {
    expect(statSync(distPath).size).toBeLessThan(MAX_BUNDLE_BYTES);
  });

  it("contains the current version", () => {
    expect(source).toContain(packageVersion);
  });

  it("is self-contained: no static import and no dynamic import", () => {
    expect(source).not.toMatch(/(^|[;}\n])\s*import\s*[\w*{"']/);
    expect(source).not.toContain("import(");
  });

  it("contains no reference to a remote host", () => {
    expect(source).not.toMatch(/from\s*["']https?:/);
  });

  it("no longer ships the removed night mode", () => {
    expect(source).not.toContain("night-overlay");
  });

  it("ships the power-saving and sizing hooks", () => {
    expect(source).toContain("IntersectionObserver");
    expect(source).toContain("prefers-reduced-motion");
    expect(source).toContain("getGridOptions");
  });

  it("ships the keyboard actions", () => {
    expect(source).toContain("keyboard-actions");
    expect(source).toContain("kb-button");
  });

  it("contains both translations", () => {
    expect(source).toContain("field_entity");
    expect(source).toContain("Shower volume entity");
  });
});

describe("dist bundle evaluated like Home Assistant does", () => {
  beforeAll(async () => {
    window.requestAnimationFrame = () => 1;
    window.cancelAnimationFrame = () => {};
    await import(distPath);
  });

  it("registers the card and its editor", () => {
    expect(customElements.get("shower-aquarium-card")).toBeDefined();
    expect(customElements.get("shower-aquarium-card-editor")).toBeDefined();
  });

  it("registers a picker entry that carries the version", () => {
    const entry = window.customCards.find((c) => c.type === "shower-aquarium-card");
    expect(entry).toBeDefined();
    expect(entry.description).toContain(packageVersion);
    expect(entry.preview).toBe(true);
  });

  it("renders a tank from a minimal configuration", async () => {
    const el = new (customElements.get("shower-aquarium-card"))();
    el.setConfig({ entity: "sensor.shower_volume" });
    el.hass = {
      language: "en",
      states: { "sensor.shower_volume": { state: "12", last_changed: new Date().toISOString() } },
    };
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
    expect(el.shadowRoot.innerHTML).not.toMatch(/NaN/);
    el.remove();
  });

  it("the editor builds an ha-form with the translated labels", async () => {
    const el = document.createElement("shower-aquarium-card-editor");
    el.setConfig({ entity: "sensor.shower_volume" });
    el.hass = { locale: { language: "en" } };
    document.body.appendChild(el);
    await el.updateComplete;
    const form = el.shadowRoot.querySelector("ha-form");
    expect(form.computeLabel({ name: "entity" })).toBe("Shower volume entity");
    el.remove();
  });
});
