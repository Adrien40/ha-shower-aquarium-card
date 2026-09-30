// Extracts the notes of one version from CHANGELOG.md, for the body of the GitHub release.
//
//   node scripts/release-notes.mjs 1.0.0 > release-notes.md
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * The text under the "## [version]" heading of a Keep a Changelog file, up to
 * the next "## [" heading. Returns null when the version has no entry or the
 * entry is empty.
 *
 * @param {string} changelog
 * @param {string} version  for example "1.0.0" (no leading "v")
 * @returns {string | null}
 */
export function extractReleaseNotes(changelog, version) {
  const lines = changelog.split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));
  if (start === -1) return null;
  let end = lines.findIndex((line, i) => i > start && line.startsWith("## ["));
  if (end === -1) end = lines.length;
  const notes = lines.slice(start + 1, end).join("\n").trim();
  return notes === "" ? null : notes;
}

function main() {
  const version = process.argv[2];
  if (!version) {
    console.error("Usage: node scripts/release-notes.mjs <version>");
    process.exit(2);
  }
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const notes = extractReleaseNotes(readFileSync(resolve(root, "CHANGELOG.md"), "utf8"), version);
  if (notes === null) {
    console.error(`CHANGELOG.md has no notes for version ${version}.`);
    process.exit(1);
  }
  process.stdout.write(notes + "\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
