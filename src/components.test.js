// @vitest-environment happy-dom
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { render } from "lit";
import "./shower-aquarium-card.js";

// happy-dom does not implement requestAnimationFrame by default; stub it so
// connectedCallback()'s animation loop doesn't throw when a card is
// mounted. The loop body itself (physics/rendering) is exercised through
// pure.js's own tests, not by actually driving frames here.
beforeAll(() => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = () => 0;
    window.cancelAnimationFrame = () => {};
  }
});

afterEach(() => {
  document.body.innerHTML = "";
});

function mountCard(config = {}) {
  const Card = customElements.get("shower-aquarium-card");
  const el = new Card();
  el.setConfig({ entity: "sensor.shower_volume", ...config });
  el.hass = {
    language: "en",
    states: {
      "sensor.shower_volume": { state: "12", last_changed: new Date().toISOString() },
    },
  };
  document.body.appendChild(el);
  return el;
}

describe("shower-aquarium-card.js registration", () => {
  it("registers the shower-aquarium-card custom element", () => {
    expect(customElements.get("shower-aquarium-card")).toBeDefined();
  });

  it("registers a window.customCards entry with type shower-aquarium-card", () => {
    const entry = window.customCards.find((c) => c.type === "shower-aquarium-card");
    expect(entry).toBeDefined();
    expect(entry.name).toBe("Shower Aquarium Card");
  });
});

describe("setConfig()", () => {
  it("throws when entity is missing", () => {
    const Card = customElements.get("shower-aquarium-card");
    const el = new Card();
    expect(() => el.setConfig({})).toThrow(/entity/i);
  });

  it("accepts a minimal config and fills in the documented defaults", () => {
    const Card = customElements.get("shower-aquarium-card");
    const el = new Card();
    el.setConfig({ entity: "sensor.shower_volume" });
    expect(el._config.theme).toBe("freshwater");
    expect(el._config.fish_count).toBe(4);
    expect(el._config.target_budget).toBe(50);
    expect(el._config.fullscreen).toBe(false);
  });

  it("generates the initial fish array sized to fish_count", () => {
    const Card = customElements.get("shower-aquarium-card");
    const el = new Card();
    el.setConfig({ entity: "sensor.shower_volume", fish_count: 7 });
    expect(el._fishes).toHaveLength(7);
  });

  it("sets/removes the fullscreen attribute based on config.fullscreen", () => {
    const Card = customElements.get("shower-aquarium-card");
    const el = new Card();
    el.setConfig({ entity: "sensor.shower_volume", fullscreen: true });
    expect(el.hasAttribute("fullscreen")).toBe(true);
    el.setConfig({ entity: "sensor.shower_volume", fullscreen: false });
    expect(el.hasAttribute("fullscreen")).toBe(false);
  });
});

describe("static getStubConfig()", () => {
  it("prefers an entity whose id mentions 'shower' or 'hydrao'", () => {
    const Card = customElements.get("shower-aquarium-card");
    const stub = Card.getStubConfig(null, ["sensor.random", "sensor.my_shower_volume"]);
    expect(stub.entity).toBe("sensor.my_shower_volume");
  });

  it("falls back to the first entity when nothing matches", () => {
    const Card = customElements.get("shower-aquarium-card");
    const stub = Card.getStubConfig(null, ["sensor.unrelated_one", "sensor.unrelated_two"]);
    expect(stub.entity).toBe("sensor.unrelated_one");
  });

  it("returns a config with every field setConfig() expects", () => {
    const Card = customElements.get("shower-aquarium-card");
    const stub = Card.getStubConfig(null, []);
    for (const key of ["theme", "aspect_ratio_width", "aspect_ratio_height", "fish_count", "target_budget"]) {
      expect(stub).toHaveProperty(key);
    }
  });
});

describe("static getConfigElement()", () => {
  it("returns a shower-aquarium-card-editor element", async () => {
    const Card = customElements.get("shower-aquarium-card");
    const el = await Card.getConfigElement();
    expect(el.tagName.toLowerCase()).toBe("shower-aquarium-card-editor");
  });
});

describe("getCardSize()", () => {
  it("returns a fixed size (6)", () => {
    const Card = customElements.get("shower-aquarium-card");
    const el = new Card();
    expect(el.getCardSize()).toBe(6);
  });
});

describe("render()", () => {
  it("renders nothing before hass/_config are set (no crash)", () => {
    const Card = customElements.get("shower-aquarium-card");
    const el = new Card();
    expect(() => el.render()).not.toThrow();
  });

  it("mounts and renders an <ha-card> with an <svg> tank once hass and config are set", async () => {
    const el = mountCard();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ha-card")).not.toBeNull();
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });

  it("shows the configured title when set, hides the header entirely when not", async () => {
    const withTitle = mountCard({ title: "My Shower" });
    await withTitle.updateComplete;
    expect(withTitle.shadowRoot.querySelector(".card-title").textContent).toContain("My Shower");

    const withoutTitle = mountCard({ title: "" });
    await withoutTitle.updateComplete;
    expect(withoutTitle.shadowRoot.querySelector(".card-title")).toBeNull();
  });

  it("cleans up the animation frame on disconnect (no error, no lingering handle)", async () => {
    const el = mountCard();
    await el.updateComplete;
    document.body.removeChild(el);
    expect(el._animationFrameId).toBeNull();
  });
});

describe("render(): themes", () => {
  it("saltwater theme renders the anemone decoration and at least one clownfish shape", async () => {
    const el = mountCard({ theme: "saltwater", fish_count: 2 });
    await el.updateComplete;
    // The anemone is theme decoration unique to saltwater (see
    // _renderThemeDecoration/_renderAnemoneTentacles); its presence is the
    // simplest signal the saltwater branch actually rendered rather than
    // silently falling through to the freshwater default.
    expect(el.shadowRoot.querySelector("svg").innerHTML).toContain("anemone");
  });

  it("coldwater theme renders without throwing and produces fish shapes", async () => {
    const el = mountCard({ theme: "coldwater", fish_count: 3 });
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll("svg g").length).toBeGreaterThan(0);
  });

  it("saltwater renders each of its 4 species shapes without throwing", async () => {
    const el = mountCard({ theme: "saltwater", fish_count: 5 });
    // 5 fish -> species 0 (clownfish, x2), 1, 3, 2 per assignSpecies --
    // covers every saltwater-specific SVG shape branch, including the
    // plain/default one (species 2), not just the clownfish.
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });

  it("freshwater (default) theme renders without throwing", async () => {
    const el = mountCard({ theme: "freshwater", fish_count: 4 });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });

  it("an unknown theme key falls back to the freshwater palette instead of crashing", async () => {
    const el = mountCard({ theme: "not-a-real-theme" });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });
});

describe("render(): tank states (dead, boiling, critical, warning)", () => {
  function mountWithState(config, sensorState, tempState) {
    const Card = customElements.get("shower-aquarium-card");
    const el = new Card();
    el.setConfig({ entity: "sensor.shower_volume", temperature_entity: "sensor.water_temp", ...config });
    el.hass = {
      language: "en",
      states: {
        "sensor.shower_volume": { state: String(sensorState), last_changed: new Date().toISOString() },
        "sensor.water_temp": { state: String(tempState) },
      },
    };
    document.body.appendChild(el);
    return el;
  }

  it("a deadly temperature renders the tank in its dead state without throwing", async () => {
    const el = mountWithState({ temp_deadly_threshold: 45 }, 10, 46);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });

  it("a boiling (but not yet deadly) temperature renders without throwing", async () => {
    const el = mountWithState({ temp_boiling_threshold: 40, temp_deadly_threshold: 45 }, 10, 41);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });

  it("consumption over budget (critical) renders the red/critical water color", async () => {
    const el = mountWithState({ target_budget: 50 }, 55, 20);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("svg").innerHTML).toContain("#ef4444");
  });

  it("consumption over 70% of budget (warning, not yet critical) renders without throwing", async () => {
    const el = mountWithState({ target_budget: 50 }, 40, 20);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });

  it("a fully drained tank (isWaterDead, volume >= target+survival) renders without throwing", async () => {
    const el = mountWithState({ target_budget: 50, survival_volume: 10 }, 60, 20);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });
});

describe("render(): algae", () => {
  async function algaeMarkup(config) {
    const el = mountCard(config);
    await el.updateComplete;
    const host = document.createElement("div");
    render(el._renderAlgae(config.algae_age ?? 0, false), host);
    return host.querySelector("#algae-layer");
  }

  it("shows algae once enabled and the delay has elapsed (algae_age forces the hours)", async () => {
    const layer = await algaeMarkup({ algae_enabled: true, algae_delay_hours: 12, algae_age: 20 });
    expect(layer).not.toBeNull();
  });

  it("shows nothing when algae is disabled, even past the delay", async () => {
    const layer = await algaeMarkup({ algae_enabled: false, algae_delay_hours: 12, algae_age: 20 });
    expect(layer).toBeNull();
  });

  it("shows nothing before the configured delay has elapsed", async () => {
    const layer = await algaeMarkup({ algae_enabled: true, algae_delay_hours: 12, algae_age: 2 });
    expect(layer).toBeNull();
  });
});

describe("render(): fullscreen mode", () => {
  it("renders with the fullscreen viewBox/attribute path without throwing", async () => {
    const el = mountCard({ fullscreen: true });
    await el.updateComplete;
    expect(el.hasAttribute("fullscreen")).toBe(true);
    expect(el.shadowRoot.querySelector("svg")).not.toBeNull();
  });
});
