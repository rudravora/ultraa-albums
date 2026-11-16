import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: { host: "0.0.0.0", port: 3000, strictPort: true },
  preview: { host: "0.0.0.0", port: 3000, strictPort: true },
  build: { target: "es2022" },
});
