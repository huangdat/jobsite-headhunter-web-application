import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@types": path.resolve(__dirname, "src/types"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@services": path.resolve(__dirname, "src/services"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@config": path.resolve(__dirname, "src/config"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@interfaces": path.resolve(__dirname, "src/interfaces"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@store": path.resolve(__dirname, "src/store"),
    },
  },
});
