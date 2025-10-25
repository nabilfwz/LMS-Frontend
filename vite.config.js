import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  optimizeDeps: {
    exclude: ["ckeditor5"], // tambahkan ini
  },
});
