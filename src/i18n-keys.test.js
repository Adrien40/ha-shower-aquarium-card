// Guards against a class of bug that no other test catches: code calling
// _t("some_key") or translate(lang, "some_key") for a key that does not
// exist in the translation files. translate() then silently falls back to
// the key itself, so the UI shows a raw key like "field_entity" instead of
// real text.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");

const en = JSON.parse(read("translations/en.json"));
const fr = JSON.parse(read("translations/fr.json"));

// This card's translations are a flat dictionary (label_*, field_*,
// theme_*, helper_*), not the dot-separated nested keys some other cards
// use -- so the key pattern below is a plain identifier, not a dot path.
// Matches both this._t("key") / _t("key") and translate(lang, "key").
const KEY_RE = /(?<![\w$])(?:_?t\(\s*|translate\(\s*[^,]+,\s*)["']([a-z][a-z_0-9]*)["']/g;

// Keys reached through lookup tables (FIELD_LABEL_KEYS, HELPER_KEYS,
// OPTION_LABEL_KEYS) never appear inside a t()/translate() call, so they are
// matched by their prefix instead. This is what catches a dictionary entry
// that no code path uses any more (e.g. after a feature is removed) and a
// table entry that points at a key which does not exist.
const PREFIXED_KEY_RE = /["']((?:field|label|helper|theme|quality|option|aria|section|action)_[a-z_0-9]+)["']/g;

const SOURCES = ["src/shower-aquarium-card.js", "src/card-editor.js", "src/render/metrics.js", "src/render/hud.js"];

// Every translation key a source file references, whether through a
// t()/translate() call or through one of the lookup tables.
function keysIn(file) {
  const text = read(file);
  const keys = [...text.matchAll(KEY_RE), ...text.matchAll(PREFIXED_KEY_RE)].map((m) => m[1]);
  return [...new Set(keys)];
}

describe("translation keys used in the code exist in en.json and fr.json", () => {
  it.each(SOURCES)("%s", (file) => {
    const keys = keysIn(file);
    expect(keys.length, `expected to find translation keys in ${file}`).toBeGreaterThan(0);

    const missingEn = keys.filter((k) => !(k in en));
    const missingFr = keys.filter((k) => !(k in fr));
    expect(missingEn, `keys missing from en.json (${file})`).toEqual([]);
    expect(missingFr, `keys missing from fr.json (${file})`).toEqual([]);
  });

  it("detects a missing key (sanity check of this guard)", () => {
    expect("field_entity" in en).toBe(true);
    expect("field_this_key_does_not_exist" in en).toBe(false);
  });

  it("every key in en.json also exists in fr.json, and vice versa (both files stay in sync)", () => {
    const enKeys = Object.keys(en);
    const frKeys = Object.keys(fr);
    expect(enKeys.filter((k) => !(k in fr)), "keys in en.json missing from fr.json").toEqual([]);
    expect(frKeys.filter((k) => !(k in en)), "keys in fr.json missing from en.json").toEqual([]);
  });
});

describe("translation keys and their usage stay in sync", () => {
  const used = new Set(SOURCES.flatMap(keysIn));

  it("every prefixed key referenced in the code exists in en.json and fr.json", () => {
    expect([...used].filter((k) => !(k in en))).toEqual([]);
    expect([...used].filter((k) => !(k in fr))).toEqual([]);
  });

  it("every key of en.json is used somewhere in the code (no dead translations)", () => {
    expect(Object.keys(en).filter((k) => !used.has(k))).toEqual([]);
  });

  it("no translation value is empty or whitespace only", () => {
    for (const [lang, dict] of [["en", en], ["fr", fr]]) {
      for (const [key, value] of Object.entries(dict)) {
        expect(typeof value, `${lang}.${key}`).toBe("string");
        expect(value.trim().length, `${lang}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("fr.json really is translated (no value identical to English except units/symbols)", () => {
    const identical = Object.keys(en).filter((k) => en[k] === fr[k]);
    // Allowed: values that are language-neutral.
    expect(identical, `identical en/fr values: ${identical.join(", ")}`).toEqual([]);
  });

  it("placeholders and unit symbols survive translation", () => {
    for (const key of Object.keys(en)) {
      for (const token of ["(L)", "(°C)", "(€/m³)", "(€/kWh)"]) {
        expect(fr[key].includes(token), `${key} ${token}`).toBe(en[key].includes(token));
      }
    }
  });
});

