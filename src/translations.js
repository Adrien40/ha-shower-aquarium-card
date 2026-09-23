import frTranslations from "../translations/fr.json";
import enTranslations from "../translations/en.json";

const TRANSLATIONS = {
  fr: frTranslations,
  en: enTranslations,
};

/**
 * Resolve a 2-letter language code from Home Assistant's hass object.
 */
export function resolveLang(hass) {
  const raw = hass?.locale?.language || hass?.language || "en";
  return raw.substring(0, 2).toLowerCase();
}

/**
 * Return dictionary for the given language code, falling back to English.
 */
export function getTranslations(lang) {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}

/**
 * Look up a flat translation key, falling back to English, then to the
 * key itself -- this card's translations are a flat dictionary (label_*,
 * field_*, theme_*), not the dot-separated nested keys ha-ffbb-tracker-card
 * uses, so the lookup here stays a plain property access rather than a
 * dot-path walk.
 */
export function translate(lang, key) {
  const dict = getTranslations(lang);
  return dict[key] || TRANSLATIONS.en[key] || key;
}
