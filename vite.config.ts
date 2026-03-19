import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
            return "react-vendor";
          }
          if (id.includes("i18next") || id.includes("react-i18next")) {
            return "i18n";
          }
          if (id.includes("@radix-ui")) {
            return "radix-ui";
          }
          if (id.includes("@tanstack")) {
            return "query";
          }
          if (id.includes("recharts") || id.includes("d3-") || id.includes("victory-")) {
            return "charts";
          }
          return "vendor";
        },
      },
    },
  },
  ssr: {
    noExternal: ["react-router-dom"],
  },
}));
