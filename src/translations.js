import frTranslations from "../translations/fr.json";
import enTranslations from "../translations/en.json";

/** @typedef {Record<string, string>} Dictionary */
/** @typedef {import("./types.js").Hass} Hass */

/** @type {Record<string, Dictionary>} */
const TRANSLATIONS = {
  fr: frTranslations,
  en: enTranslations,
};

/**
 * Resolve a 2-letter language code from Home Assistant's hass object.
 *
 * @param {Hass | null | undefined} hass
 * @returns {string}
 */
export function resolveLang(hass) {
  const raw = hass?.locale?.language || hass?.language || "en";
  return raw.substring(0, 2).toLowerCase();
}

/**
 * Return dictionary for the given language code, falling back to English.
 *
 * @param {string | undefined} lang
 * @returns {Dictionary}
 */
export function getTranslations(lang) {
  return (lang && TRANSLATIONS[lang]) || TRANSLATIONS.en;
}

/**
 * Look up a flat translation key, falling back to English, then to the
 * key itself -- this card's translations are a flat dictionary (label_*,
 * field_*, theme_*), not dot-separated nested keys, so the lookup here
 * stays a plain property access rather than a dot-path walk.
 *
 * @param {string | undefined} lang
 * @param {string} key
 * @returns {string}
 */
export function translate(lang, key) {
  const dict = getTranslations(lang);
  return dict[key] || TRANSLATIONS.en[key] || key;
}
