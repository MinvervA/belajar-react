import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vite.config.js",
    test: {
      coverage: {
        provider: "istanbul",
        reporter: ["text", "html"],
        exclude: [
          "src/routeTree.gen.ts",
          "coverage/**",
          "dist/**",
          "**/*.test.{js,jsx,ts,tsx}",
        ],
      },
    },
  },
  {
    extends: "./vite.config.js",
    test: {
      setupFiles: ["vitest-browser-react"],
      include: ["**/*.browser.test.{js,jsx}"],
      name: "browser",
      browser: {
        provider: "playwright",
        enabled: true,
        name: "chromium",
      },
    },
  },
]);
