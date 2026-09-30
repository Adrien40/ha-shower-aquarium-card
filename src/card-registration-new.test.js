// @vitest-environment happy-dom
//
// See card-registration-existing.test.js for why this scenario needs its
// own file: the window.customCards registration branch it exercises is a
// module-level side effect that only runs on the *first* import of
// shower-aquarium-card.js in a given module graph, and Vitest gives each
// test file its own fresh graph. A second import in the same file (or in
// components.test.js / physics.test.js, which already import this
// module) would be a no-op, and forcing a second real evaluation would
// call customElements.define() twice for the same tag and throw.
import { describe, it, expect } from "vitest";

describe("window.customCards registration", () => {
  it("pushes a new entry when none exists yet for this card type", async () => {
    delete window.customCards;

    await import("./shower-aquarium-card.js");

    expect(window.customCards).toHaveLength(1);
    expect(window.customCards[0].type).toBe("shower-aquarium-card");
  });
});
