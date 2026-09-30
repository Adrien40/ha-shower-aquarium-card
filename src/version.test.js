// The card version must be identical everywhere it is written down. The only
// place a human edits it in code is src/version.js; everything else is
// checked against it here so a release can never ship with mismatched numbers.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CARD_VERSION } from "./version.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");

const SEMVER_RE = /^\d+\.\d+\.\d+$/;
const firstChangelogVersion = (text) => text.match(/^## \[(\d+\.\d+\.\d+)\]/m)?.[1];

describe("card version", () => {
  it("is a plain MAJOR.MINOR.PATCH string", () => {
    expect(CARD_VERSION).toMatch(SEMVER_RE);
  });

  it("matches package.json", () => {
    expect(JSON.parse(read("package.json")).version).toBe(CARD_VERSION);
  });

  it("matches the root entry of package-lock.json", () => {
    const lock = JSON.parse(read("package-lock.json"));
    expect(lock.version).toBe(CARD_VERSION);
    expect(lock.packages[""].version).toBe(CARD_VERSION);
  });

  it("matches the newest entry of CHANGELOG.md", () => {
    expect(firstChangelogVersion(read("CHANGELOG.md"))).toBe(CARD_VERSION);
  });

  it("matches the newest entry of CHANGELOG.fr.md", () => {
    expect(firstChangelogVersion(read("CHANGELOG.fr.md"))).toBe(CARD_VERSION);
  });

  it("firstChangelogVersion() reads the first heading only (sanity check of this guard)", () => {
    expect(firstChangelogVersion("# T\n\n## [2.0.0] — x\n\n## [1.0.0] — y")).toBe("2.0.0");
    expect(firstChangelogVersion("# nothing here")).toBeUndefined();
  });

  it("every changelog entry is newer than the one below it", () => {
    const versions = [...read("CHANGELOG.md").matchAll(/^## \[(\d+)\.(\d+)\.(\d+)\]/gm)].map((m) => m.slice(1).map(Number));
    for (let i = 1; i < versions.length; i++) {
      const [a, b] = [versions[i - 1], versions[i]];
      const newer = a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
      expect(newer, `entry ${i} is not older than entry ${i - 1}`).toBeGreaterThan(0);
    }
  });

  it("both changelogs list the same versions", () => {
    const list = (t) => [...t.matchAll(/^## \[(\d+\.\d+\.\d+)\]/gm)].map((m) => m[1]);
    expect(list(read("CHANGELOG.fr.md"))).toEqual(list(read("CHANGELOG.md")));
  });
});
