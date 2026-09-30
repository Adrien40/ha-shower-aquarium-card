// Release and publication: the address of the repository, the file HACS
// installs, the notes of a release and the workflow that publishes it. None of
// this can be run here (a workflow only runs on GitHub), so what can be checked
// is checked: the pieces agree with each other, and the workflow keeps the
// safeguards it was written with.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { CARD_VERSION, REPOSITORY_URL } from "./version.js";
import { extractReleaseNotes } from "../scripts/release-notes.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");
const pkg = JSON.parse(read("package.json"));
const hacs = JSON.parse(read("hacs.json"));
const workflow = read(".github/workflows/release.yaml");

// ---------------------------------------------------------------------------
describe("the address of the repository is the same everywhere", () => {
  it("is a plain https GitHub address without a trailing slash or .git", () => {
    expect(REPOSITORY_URL).toMatch(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/);
    expect(REPOSITORY_URL.endsWith("/")).toBe(false);
    expect(REPOSITORY_URL.endsWith(".git")).toBe(false);
  });

  it("matches the repository, homepage and bugs fields of package.json", () => {
    expect(pkg.repository).toEqual({ type: "git", url: `git+${REPOSITORY_URL}.git` });
    expect(pkg.homepage).toBe(`${REPOSITORY_URL}#readme`);
    expect(pkg.bugs).toEqual({ url: `${REPOSITORY_URL}/issues` });
  });

  it.each(["README.md", "README.fr.md"])("%s installs and links to the same repository", (file) => {
    const text = read(file);
    expect(text).toContain(`${REPOSITORY_URL}/releases`);
    expect(text).toContain(`\`${REPOSITORY_URL}\``);
    expect(text.match(/github\.com\/[\w-]+\/ha-shower-aquarium-card/g).every((m) => `https://${m}` === REPOSITORY_URL)).toBe(true);
  });

  it("the repository is named like the card, which HACS expects to find", () => {
    expect(basename(REPOSITORY_URL)).toBe(pkg.name);
  });
});

// ---------------------------------------------------------------------------
describe("HACS finds the card", () => {
  const outfile = read("build.mjs").match(/outfile:\s*"([^"]+)"/)[1];

  it("hacs.json names the very file the build produces", () => {
    expect(outfile).toBe(`dist/${hacs.filename}`);
    expect(hacs.filename).toMatch(/\.js$/);
  });

  it("hacs.json has the display name and renders the README", () => {
    expect(hacs.name).toBe("Shower Aquarium Card");
    expect(hacs.render_readme).toBe(true);
  });

  it("the file is built into dist/, the first place HACS looks", () => {
    expect(outfile.startsWith("dist/")).toBe(true);
  });

  it("the workflow that keeps dist/ up to date is present", () => {
    expect(read(".github/workflows/build-dist.yaml")).toContain("git add -f dist");
  });
});

// ---------------------------------------------------------------------------
describe("extractReleaseNotes()", () => {
  const changelog = [
    "# Changelog",
    "",
    "Intro text.",
    "",
    "## [1.0.0] — 2026-10-01",
    "",
    "### Added",
    "- A thing.",
    "",
    "## [0.9.10] — 2026-09-30",
    "",
    "- Ten.",
    "",
    "## [0.9.1] — 2026-09-29",
    "",
    "- One.",
    "",
    "## [0.9.0]",
    "",
    "",
    "## [0.8.0] — 2026-09-01",
    "- Last entry, up to the end of the file.",
  ].join("\n");

  it("returns the text under the heading of a version", () => {
    expect(extractReleaseNotes(changelog, "1.0.0")).toBe("### Added\n- A thing.");
  });

  it("stops at the next version heading", () => {
    expect(extractReleaseNotes(changelog, "0.9.1")).toBe("- One.");
  });

  it("does not confuse 0.9.1 with 0.9.10", () => {
    expect(extractReleaseNotes(changelog, "0.9.10")).toBe("- Ten.");
    expect(extractReleaseNotes(changelog, "0.9.1")).not.toContain("Ten");
  });

  it("goes to the end of the file for the last entry", () => {
    expect(extractReleaseNotes(changelog, "0.8.0")).toBe("- Last entry, up to the end of the file.");
  });

  it("returns null for a version that has no entry", () => {
    expect(extractReleaseNotes(changelog, "9.9.9")).toBeNull();
  });

  it("returns null for an entry that is empty", () => {
    expect(extractReleaseNotes(changelog, "0.9.0")).toBeNull();
  });

  it("finds a heading that carries a date or nothing after the version", () => {
    expect(extractReleaseNotes("## [2.0.0]\n- x", "2.0.0")).toBe("- x");
    expect(extractReleaseNotes("## [2.0.0] — 2026-01-01\n- y", "2.0.0")).toBe("- y");
  });

  it("copes with Windows line endings", () => {
    expect(extractReleaseNotes("## [1.0.0]\r\n- a\r\n- b\r\n\r\n## [0.9.0]\r\n- c", "1.0.0")).toBe("- a\n- b");
  });

  it("handles a pre-release version", () => {
    expect(extractReleaseNotes("## [1.0.0-beta.1]\n- beta\n## [0.9.0]\n- old", "1.0.0-beta.1")).toBe("- beta");
  });

  it("does not take a mention of a version in the text for a heading", () => {
    expect(extractReleaseNotes("Fixed in [1.0.0] earlier\n## [1.0.0]\n- real", "1.0.0")).toBe("- real");
  });

  it("the changelog of this project has notes for the version of the card", () => {
    expect(extractReleaseNotes(read("CHANGELOG.md"), CARD_VERSION)).toBeTypeOf("string");
  });

  it("the notes of the current version do not run into the previous version", () => {
    const notes = extractReleaseNotes(read("CHANGELOG.md"), CARD_VERSION);
    expect(notes).not.toMatch(/^## \[/m);
  });
});

describe("scripts/release-notes.mjs on the command line", () => {
  const run = (...args) => spawnSync(process.execPath, [join(root, "scripts/release-notes.mjs"), ...args], { encoding: "utf8" });

  it("prints the notes of the current version", () => {
    const result = run(CARD_VERSION);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(extractReleaseNotes(read("CHANGELOG.md"), CARD_VERSION));
  });

  it("fails with a clear message for an unknown version", () => {
    const result = run("9.9.9");
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("no notes for version 9.9.9");
    expect(result.stdout).toBe("");
  });

  it("fails with the usage when no version is given", () => {
    const result = run();
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Usage");
  });
});

// ---------------------------------------------------------------------------
describe(".github/workflows/release.yaml keeps its safeguards", () => {
  const position = (needle) => {
    const index = workflow.indexOf(needle);
    expect(index, `"${needle}" is missing from release.yaml`).toBeGreaterThanOrEqual(0);
    return index;
  };

  it("only runs when a version tag is pushed, never on a branch", () => {
    expect(workflow).toMatch(/on:\s*\n\s*push:\s*\n\s*tags:\s*\n\s*- "v\*"/);
    expect(workflow).not.toMatch(/branches:/);
    expect(workflow).not.toContain("pull_request");
    expect(workflow).not.toContain("workflow_dispatch");
  });

  it("asks for the write access a release needs, and nothing more", () => {
    expect(workflow).toMatch(/permissions:\s*\n\s*contents: write/);
    expect(workflow.match(/permissions:/g)).toHaveLength(1);
    expect(workflow).not.toMatch(/(write-all|id-token|packages: write|actions: write)/);
  });

  it("only uses official actions and the gh command line tool, no third-party action", () => {
    const actions = [...workflow.matchAll(/uses:\s*([^\s]+)/g)].map((m) => m[1]);
    expect(actions.length).toBeGreaterThan(0);
    for (const action of actions) expect(action, action).toMatch(/^actions\/[\w-]+@v\d+$/);
    expect(workflow).toContain("gh release create");
  });

  it("uses the same action versions and Node version as the other workflows", () => {
    const checks = read(".github/workflows/tests.yaml");
    for (const action of workflow.matchAll(/uses:\s*(actions\/[\w-]+@v\d+)/g)) expect(checks).toContain(action[1]);
    expect(workflow).toContain("node-version: 24");
    expect(checks).toContain("node-version: 24");
  });

  it("refuses a tag that does not match package.json and src/version.js", () => {
    expect(workflow).toContain("GITHUB_REF_NAME");
    expect(workflow).toContain("require('./package.json').version");
    expect(workflow).toContain("src/version.js");
    expect(workflow).toContain('"v${version}"');
  });

  it("requires the changelog to describe the version, using the tested script", () => {
    expect(workflow).toContain('node scripts/release-notes.mjs "${VERSION}"');
    expect(workflow).toContain("--notes-file");
  });

  it("refuses a tag whose commit has no dist/ file", () => {
    expect(workflow).toContain("[ ! -f dist/shower-aquarium-card.js ]");
  });

  it("compares the committed dist/ with a fresh build, byte for byte, and refuses a stale one", () => {
    expect(workflow).toContain("cmp -s");
    expect(workflow).toContain("is out of date");
  });

  it("runs the whole check before it publishes anything", () => {
    expect(workflow).toContain("npm ci");
    expect(position("npm run check")).toBeLessThan(position("gh release create"));
    expect(position("npm ci")).toBeLessThan(position("npm run check"));
  });

  it("saves the committed file before the build can overwrite it, and compares after", () => {
    const save = position('cp dist/shower-aquarium-card.js "${RUNNER_TEMP}/committed.js"');
    const build = position("npm run check");
    const compare = position('cmp -s "${RUNNER_TEMP}/committed.js"');
    const publish = position("gh release create");
    expect(save).toBeLessThan(build);
    expect(build).toBeLessThan(compare);
    expect(compare).toBeLessThan(publish);
  });

  it("attaches the file HACS installs to the release", () => {
    const line = workflow.match(/gh release create[^\n]*/)[0];
    expect(line).toContain(`dist/${hacs.filename}`);
  });

  it("marks a 0.x version as a pre-release", () => {
    expect(workflow).toContain('case "${VERSION}" in 0.*) flags="--prerelease" ;; esac');
    expect(workflow).toContain("${flags}");
  });

  it("never creates or pushes a tag itself (the comments explain them to the user, the steps do not run them)", () => {
    const steps = workflow.split("\n").filter((line) => !line.trim().startsWith("#")).join("\n");
    expect(steps).not.toMatch(/git tag|git push/);
    expect(workflow).toContain("git tag v1.0.0");
  });

  it("tells the user which commit to tag (the one made by the build workflow)", () => {
    expect(workflow).toContain("chore: rebuild dist/");
    expect(read(".github/workflows/build-dist.yaml")).toContain("chore: rebuild dist/");
  });
});
