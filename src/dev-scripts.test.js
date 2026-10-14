// The maintainers develop on several operating systems, so the npm scripts
// must work in cmd, PowerShell and a POSIX shell alike.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const scripts = Object.entries(pkg.scripts);

describe("npm scripts are portable", () => {
  it("has scripts to check", () => {
    expect(scripts.length).toBeGreaterThan(8);
  });

  it.each(scripts)("%s does not use POSIX-only VAR=value syntax", (_name, command) => {
    // `UPDATE_X=1 vitest` only works in a POSIX shell; cross-env works everywhere.
    const withoutCrossEnv = command.replace(/cross-env\s+([A-Z_]+=\S+\s+)+/g, "");
    expect(withoutCrossEnv).not.toMatch(/(^|&&\s*)[A-Z_][A-Z0-9_]*=\S+/);
  });

  it("does not use rm, cp, mv or export, which cmd does not know", () => {
    for (const [, command] of scripts) expect(command).not.toMatch(/(^|&&\s*)(rm|cp|mv|export|cat|ls)\s/);
  });

  it("the update scripts use cross-env", () => {
    expect(pkg.scripts["visual:update"]).toMatch(/^cross-env UPDATE_VISUAL=1 /);
    expect(pkg.scripts["golden:update"]).toMatch(/^cross-env UPDATE_GOLDEN=1 /);
    expect(pkg.devDependencies["cross-env"]).toBeTypeOf("string");
  });

  it("the update scripts run the suites they regenerate", () => {
    expect(pkg.scripts["visual:update"]).toContain("vitest run visual");
    expect(pkg.scripts["golden:update"]).toContain("src/physics-golden.test.js");
  });

  it("the visual suite has its own script", () => {
    expect(pkg.scripts["test:visual"]).toBe("vitest run visual");
  });
});
