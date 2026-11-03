import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/public": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },

  plugins: [TanStackRouterVite(), react()],

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
});
