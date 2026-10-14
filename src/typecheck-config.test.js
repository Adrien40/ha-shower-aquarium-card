// The type check (`npm run typecheck`, tsc on the JSDoc types) is only worth
// something while it stays strict and covers every source file. These tests
// stop the configuration, or the code, from being loosened in silence.
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
const tsconfig = JSON.parse(readFileSync(join(root, "tsconfig.json"), "utf8"));
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const sources = readdirSync(srcDir).filter((f) => f.endsWith(".js") && !f.endsWith(".test.js"));

describe("tsconfig.json", () => {
  it.each([
    ["strict", true],
    ["checkJs", true],
    ["allowJs", true],
    ["noEmit", true],
  ])("keeps %s = %s", (option, value) => {
    expect(tsconfig.compilerOptions[option]).toBe(value);
  });

  it("does not switch off any of the strict sub-checks", () => {
    const relaxed = Object.entries(tsconfig.compilerOptions).filter(
      ([name, value]) => /^(noImplicit|strict)/.test(name) && name !== "strict" && value === false
    );
    expect(relaxed).toEqual([]);
  });

  it("checks every source file and only leaves the tests out", () => {
    expect(tsconfig.include).toEqual(["src/**/*.js"]);
    expect(tsconfig.exclude).toEqual(expect.arrayContaining(["src/**/*.test.js"]));
    expect(tsconfig.exclude.filter((e) => !/test|node_modules|dist/.test(e))).toEqual([]);
  });

  it("there are source files to check", () => {
    expect(sources).toEqual(expect.arrayContaining(["pure.js", "physics.js", "shower-aquarium-card.js", "card-editor.js", "translations.js", "types.js"]));
  });
});

describe("the type check cannot be silenced", () => {
  it.each(sources)("%s has no @ts-nocheck, @ts-ignore or @ts-expect-error", (file) => {
    const text = readFileSync(join(srcDir, file), "utf8");
    expect(text).not.toMatch(/@ts-(nocheck|ignore|expect-error)/);
  });
});

describe("the type check is part of the workflow", () => {
  it("is exposed as npm run typecheck", () => {
    expect(pkg.scripts.typecheck).toBe("tsc -p tsconfig.json");
  });

  it("runs as part of npm run check, before the tests", () => {
    const steps = pkg.scripts.check.split("&&").map((s) => s.trim());
    expect(steps).toContain("npm run typecheck");
    expect(steps.indexOf("npm run typecheck")).toBeLessThan(steps.indexOf("npm run test:coverage"));
  });

  it("runs in the CI workflows", () => {
    for (const file of ["typecheck.yaml", "build-dist.yaml"]) {
      expect(readFileSync(join(root, ".github/workflows", file), "utf8")).toContain("npm run typecheck");
    }
  });

  it("typescript is a declared dev dependency", () => {
    expect(pkg.devDependencies.typescript).toBeTypeOf("string");
  });
});
