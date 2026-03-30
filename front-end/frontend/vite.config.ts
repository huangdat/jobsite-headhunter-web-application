import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // Now them are enough for entire react project
        "@": path.resolve(__dirname, "src"),
        "@/*": path.resolve(__dirname, "src/*"), // Explicit
        "~": path.resolve(__dirname, "src"), // Legacy fallback
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
    },
  });
};
