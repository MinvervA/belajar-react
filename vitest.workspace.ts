import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vite.config.ts",
    test: {
      name: "happy-dom",
      environment: "happy-dom",
      include: ["**/*.node.test.{js,jsx,ts,tsx}"],
    },
  },
  {
    extends: "./vite.config.ts",
    test: {
      name: "browser",
      setupFiles: ["vitest-browser-react"],
      include: ["**/*.browser.test.{js,jsx,ts,tsx}"],
      browser: {
        provider: "playwright",
        enabled: true,
        name: "chromium",
      },
    },
  },
]);
