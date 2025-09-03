import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // only used in local dev, ignored in Render
  },
  build: {
    outDir: "dist", // <-- Render expects "dist" by default
  },
});
