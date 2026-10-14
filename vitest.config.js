import { defineConfig } from "vitest/config";

// Unit tests for everything in src/, and the visual regression tests of visual/. Coverage thresholds are enforced by
// `npm run test:coverage` (used in CI): a change that adds code without
// tests fails the build. Statements, lines and functions must stay at 100 %;
// branches get a 2 % margin only because V8 branch counting can shift a
// little between tool versions.
export default defineConfig({
  test: {
    include: ["src/**/*.test.js", "visual/**/*.test.js"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.js"],
      exclude: ["src/**/*.test.js"],
      reporter: ["text", "lcov", "json-summary"],
      thresholds: {
        statements: 100,
        lines: 100,
        functions: 100,
        branches: 98,
      },
    },
  },
});
