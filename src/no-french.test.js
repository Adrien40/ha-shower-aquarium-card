// Project rule: source code, comments, tooling scripts and CI workflows are
// written in English only. French belongs in translations/fr.json,
// README.fr.md and CHANGELOG.fr.md, nothing else.
//
// Two independent checks are applied to every scanned file:
//  1. any accented Latin letter (a French text is almost never accent-free);
//  2. a short list of very common French words that are not English words,
//     which catches accent-free sentences such as "pour le test".
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// U+00C0..U+00FF without the multiplication/division signs, plus oe ligatures.
const ACCENTED_RE = /[\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u0152\u0153]/;
const FRENCH_WORD_RE = /\b(les|des|une|avec|pour|dans|sont|cette|fichier|chaque|aussi|mais|donc|quand)\b/i;

/** Returns "line N: reason" for every offending line of `text`. */
export function findFrench(text) {
  const problems = [];
  text.split("\n").forEach((line, i) => {
    const accent = line.match(ACCENTED_RE);
    if (accent) problems.push(`line ${i + 1}: accented letter "${accent[0]}"`);
    const word = line.match(FRENCH_WORD_RE);
    if (word) problems.push(`line ${i + 1}: French word "${word[0]}"`);
  });
  return problems;
}

function walk(dir, predicate, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === "coverage" || name === ".git") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

const SELF = resolve(dirname(fileURLToPath(import.meta.url)), "no-french.test.js");
const isCode = (f) => /\.(js|mjs|json|ya?ml)$/.test(f);

const scanned = [
  ...walk(join(root, "src"), isCode),
  ...walk(join(root, ".github"), isCode),
  ...walk(join(root, "scripts"), isCode),
  ...walk(join(root, "visual"), isCode),
  ...["build.mjs", "eslint.config.js", "vitest.config.js", "vitest.dist.config.js", "package.json", "hacs.json"]
    .map((f) => join(root, f))
    .filter(existsSync),
].filter((f) => f !== SELF);

describe("findFrench() detector (sanity check of this guard)", () => {
  it("flags accented letters", () => {
    // \u00e9 is an e with an acute accent; escaped so this file stays accent-free.
    expect(findFrench("const label = \"R\u00e9cif\";")).toHaveLength(1);
    expect(findFrench("// \u0153uvre")).toHaveLength(1);
  });

  it("flags common French words even without accents", () => {
    expect(findFrench("// pour le test")).toHaveLength(1);
    expect(findFrench("// each fish is drawn with the tail")).toEqual([]);
  });

  it("reports the line number", () => {
    expect(findFrench("ok\nok\nune ligne")[0]).toMatch(/^line 3:/);
  });

  it("does not flag CSS/SVG font stacks such as sans-serif", () => {
    expect(findFrench('font-family="system-ui, sans-serif"')).toEqual([]);
  });

  it("does not flag currency, degree or superscript symbols", () => {
    expect(findFrench("unit_of_measurement: \"€/m³\"; \"°C\"; a × b ÷ c")).toEqual([]);
  });
});

describe("this guard file", () => {
  it("contains no accented letter itself (its samples are written as \\u escapes)", () => {
    const own = readFileSync(SELF, "utf8");
    expect(own.split("\n").filter((l) => ACCENTED_RE.test(l))).toEqual([]);
  });
});

describe("no French in source code, comments, tooling or workflows", () => {
  it("scans a meaningful number of files", () => {
    expect(scanned.length).toBeGreaterThan(10);
    expect(scanned.map((f) => relative(root, f))).toContain("src/pure.js");
    expect(scanned.map((f) => relative(root, f))).toContain("build.mjs");
    expect(scanned.map((f) => relative(root, f))).toContain("scripts/dist.smoke.test.js");
    expect(scanned.map((f) => relative(root, f))).toContain("visual/helpers.js");
  });

  it.each(scanned.map((f) => [relative(root, f), f]))("%s", (_name, file) => {
    expect(findFrench(readFileSync(file, "utf8"))).toEqual([]);
  });
});
