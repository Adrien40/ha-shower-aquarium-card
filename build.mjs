// Bundles the card into a single, self-contained dist/shower-aquarium-card.js.
//
// Why this exists: shower-aquarium-card.js, card-editor.js, pure.js,
// styles.js and translations.js used to be shipped as separate files (plus
// a hand-vendored lit-element-bundle.min.js). A static `import` cannot
// carry a cache-busting `?v=` query string -- the ES module spec requires
// a static import specifier to be a literal string. So after a HACS
// update, the browser could keep serving a stale cached copy of one file
// alongside a fresh copy of the others, producing exactly the "works
// after a hard cache clear, breaks again next update" symptom. Bundling
// everything into one file means there is only one thing for the browser
// to cache: either the whole card is fresh, or the whole card is stale,
// never a mismatched mix.
//
// translations/*.json are statically imported by translations.js (see
// that file), so esbuild inlines their content straight into the bundle
// above -- there's no separate translations/ asset to ship or to
// cache-bust at runtime.
import esbuild from "esbuild";
import { rm, mkdir } from "node:fs/promises";

const watch = process.argv.includes("--watch");

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

const buildOptions = {
  entryPoints: ["src/shower-aquarium-card.js"],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2020",
  outfile: "dist/shower-aquarium-card.js",
  legalComments: "none",
};

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("Watching src/ for changes...");
} else {
  await esbuild.build(buildOptions);
  console.log("Build terminé : dist/shower-aquarium-card.js");
}
