// @vitest-environment happy-dom
//
// window.customCards registration (the card-picker entry HA's frontend
// reads) is a module-level side effect in shower-aquarium-card.js: it
// runs once, the moment the module is first imported, right alongside
// customElements.define(). That define() call cannot run twice for the
// same tag name without throwing, so this "an entry for this card
// already exists -- replace it in place instead of pushing a duplicate"
// branch can only be exercised by seeding window.customCards *before*
// the very first import of the module in a given module graph.
//
// This has to live in its own file, separate from
// card-registration-new.test.js: Vitest gives each test *file* a fresh
// module registry, but re-importing the same specifier a second time
// within one file just returns the already-cached module -- it does not
// re-run the top-level side effect a second time.
import { describe, it, expect } from "vitest";

describe("window.customCards registration", () => {
  it("replaces the existing entry in place instead of pushing a duplicate", async () => {
    window.customCards = [
      { type: "some-other-card", name: "Unrelated" },
      { type: "shower-aquarium-card", name: "Stale name from a previous load" },
    ];

    await import("./shower-aquarium-card.js");

    expect(window.customCards).toHaveLength(2);
    const entry = window.customCards.find((c) => c.type === "shower-aquarium-card");
    expect(entry.name).not.toBe("Stale name from a previous load");
    expect(entry.name).toBe("Shower Aquarium Card");
  });
});
