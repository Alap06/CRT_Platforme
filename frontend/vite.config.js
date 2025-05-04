import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Importez le plugin Tailwind CSS correctement
import tailwindcss from '@tailwindcss/postcss';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {}], // Optionnel : pour le compilateur React 19
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss], // Utilisez le plugin correct
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 5173, // Port préféré
    strictPort: false, // Permet à Vite de chercher un autre port si 4000 est occupé
    open: true, // Ouvre automatiquement le navigateur
  },
});