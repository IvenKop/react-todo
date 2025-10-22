import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  base: "/",
  define: {
    "process.env": {},
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    globals: true,
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        ...((configDefaults.coverage?.exclude) || []),
        "node_modules/",
        "dist/",
        "src/locales/**"
      ],
    },
  },
});
