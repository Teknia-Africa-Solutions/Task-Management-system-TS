import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable']
  },
  build: {
    commonjsOptions: {
      include: [/jspdf/, /jspdf-autotable/]
    }
  }
});