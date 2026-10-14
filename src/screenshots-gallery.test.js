// The screenshot gallery (docs/SCREENSHOTS.md and its French version) shows the
// pictures of visual/baseline/, the ones the visual tests compare against. A new
// scenario must not be forgotten there, and no picture may be missing.
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const baselines = readdirSync(join(root, "visual/baseline")).filter((f) => f.endsWith(".png")).map((f) => f.slice(0, -4)).sort();

const PAGES = [
  { file: "docs/SCREENSHOTS.md", other: "SCREENSHOTS.fr.md", readme: "../README.md" },
  { file: "docs/SCREENSHOTS.fr.md", other: "SCREENSHOTS.md", readme: "../README.fr.md" },
];
const used = (text) => [...text.matchAll(/src="\.\.\/visual\/baseline\/([\w-]+)\.png"/g)].map((m) => m[1]);

describe.each(PAGES)("$file", ({ file, other, readme }) => {
  const text = read(file);

  it("shows every picture of visual/baseline, once each", () => {
    expect(used(text).sort()).toEqual(baselines);
  });

  it("only shows pictures that exist", () => {
    for (const name of used(text)) expect(existsSync(join(root, "visual/baseline", `${name}.png`)), name).toBe(true);
  });

  it("gives every picture an alternative text and a caption", () => {
    const cells = [...text.matchAll(/<td align="center"[^>]*><img [^>]*alt="([^"]*)"[^>]*><br><sub>([^<]+)<\/sub><\/td>/g)];
    expect(cells).toHaveLength(baselines.length);
    for (const [, alt, caption] of cells) {
      expect(alt.length).toBeGreaterThan(5);
      expect(caption.length).toBeGreaterThan(10);
    }
  });

  it("links to the other language and back to the main README, which exist", () => {
    expect(text).toContain(`](${other})`);
    expect(existsSync(join(root, "docs", other))).toBe(true);
    expect(text).toContain(`](${readme})`);
    expect(existsSync(join(root, readme.slice(3)))).toBe(true);
  });

  it("only links to sections of the README that exist", () => {
    const readmeText = read(readme.slice(3));
    // GitHub's anchor of a heading: lower case, emoji and punctuation gone, spaces turned into dashes.
    const anchors = new Set(
      [...readmeText.matchAll(/^#{1,4} (.+)$/gm)].map((m) =>
        m[1].toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, "").replace(/ /g, "-")
      )
    );
    for (const [, anchor] of text.matchAll(/README(?:\.fr)?\.md#([^)]+)\)/g)) {
      expect([...anchors].some((a) => a.endsWith(anchor.replace(/^-/, ""))), anchor).toBe(true);
    }
  });
});

describe("the two pages", () => {
  it("show the same pictures in the same order", () => {
    expect(used(read(PAGES[0].file))).toEqual(used(read(PAGES[1].file)));
  });

  it("are linked from both READMEs", () => {
    expect(read("README.md")).toContain("docs/SCREENSHOTS.md");
    expect(read("README.fr.md")).toContain("docs/SCREENSHOTS.fr.md");
  });
});
