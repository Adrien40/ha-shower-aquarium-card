import { defineConfig } from "vitest/config";

// Smoke test of the built bundle (dist/shower-aquarium-card.js), the file
// that users actually load. Run it after `npm run build`: `npm run test:dist`.
export default defineConfig({
  test: {
    include: ["scripts/dist.smoke.test.js"],
    environment: "happy-dom",
  },
});
