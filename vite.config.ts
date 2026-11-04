import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

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

  plugins: [TanStackRouterVite(), react(), tailwindcss()],

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
