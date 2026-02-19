import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    // Remove environmentOptions for now to let Nuxt auto-detect
    globals: true, // This allows you to use 'describe' and 'it' without importing them
  },
});
