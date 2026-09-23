import { describe, it, expect } from "vitest";
import { resolveLang, getTranslations, translate } from "./translations.js";

describe("resolveLang", () => {
  it("reads hass.locale.language, taking the first 2 letters lowercased", () => {
    expect(resolveLang({ locale: { language: "fr-FR" } })).toBe("fr");
    expect(resolveLang({ locale: { language: "EN-US" } })).toBe("en");
  });

  it("falls back to hass.language when locale.language is absent", () => {
    expect(resolveLang({ language: "fr" })).toBe("fr");
  });

  it("falls back to 'en' when hass is missing or has no language info at all", () => {
    expect(resolveLang(null)).toBe("en");
    expect(resolveLang({})).toBe("en");
  });
});

describe("getTranslations", () => {
  it("returns the French dictionary for 'fr'", () => {
    expect(getTranslations("fr").field_entity).toBe("Entité de volume de douche");
  });

  it("falls back to English for an unsupported language code", () => {
    expect(getTranslations("de").field_entity).toBe(getTranslations("en").field_entity);
  });
});

describe("translate", () => {
  it("returns the value for a known key in the requested language", () => {
    expect(translate("fr", "field_entity")).toBe("Entité de volume de douche");
    expect(translate("en", "field_entity")).toBe("Shower volume entity");
  });

  it("falls back to English when the key is missing from the requested language's dictionary", () => {
    // Every current key exists in both files (see i18n-keys.test.js), so
    // this exercises the fallback path with a key that exists in neither,
    // confirming it doesn't throw and returns the key itself as a last resort.
    expect(translate("fr", "totally_made_up_key")).toBe("totally_made_up_key");
  });

  it("falls back to the key itself when it exists in no dictionary at all", () => {
    expect(translate("en", "not_a_real_key")).toBe("not_a_real_key");
  });
});
