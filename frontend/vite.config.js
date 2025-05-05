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
        target: 'http://localhost:3000',
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
  
});