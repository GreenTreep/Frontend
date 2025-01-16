import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      // Création d'un alias pour `global` qui pointe vers `window`
      global: 'window', // Utilise `window` au lieu de `global`
    },
  },
  define: {
    // Ajout d'une définition globale pour "global"
    global: 'window',
  },
  optimizeDeps: {
    include: ['sockjs-client'], // Assure-toi que `sockjs-client` soit bien optimisé
  },
});
