// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: "server",
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/uploads': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        }
      }
    }
  }
});