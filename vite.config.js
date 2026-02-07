import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      avif: { quality: 30 },
      jfif: { quality: 30 },
      png: { quality: 30 },
      jpg: { quality: 30 },
    }),
  ],
});
