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

const SOURCES = ["src/shower-aquarium-card.js", "src/card-editor.js"];

describe("translation keys used in the code exist in en.json and fr.json", () => {
  it.each(SOURCES)("%s", (file) => {
    const keys = [...new Set([...read(file).matchAll(KEY_RE)].map((m) => m[1]))];
    expect(keys.length, `expected to find literal t()/translate() keys in ${file}`).toBeGreaterThan(0);

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
