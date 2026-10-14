// The version of the card is written in ONE place: "version" in package.json.
// Everything else reads it from there (this file, and through it the card, the
// editor and the picker entry of Home Assistant). To release, run
//
//   npm version <x.y.z> --no-git-tag-version
//
// which also updates package-lock.json, then add the entry <x.y.z> at the top of
// CHANGELOG.md and CHANGELOG.fr.md (src/version.test.js checks they agree).
// esbuild inlines the JSON, so the bundle stays self-contained.
import pkg from "../package.json";

export const CARD_VERSION = pkg.version;

// Where the card lives. The card picker of Home Assistant links to it (help
// link of the card editor), and a test checks it against package.json.
export const REPOSITORY_URL = "https://github.com/Adrien40/ha-shower-aquarium-card";
