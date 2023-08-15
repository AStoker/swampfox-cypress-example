import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://localhost:8443",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "**/*.e2e.ts",
  },
});
