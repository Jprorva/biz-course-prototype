import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: './',
  root: fileURLToPath(new URL('./pages', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  resolve: {
    alias: {
      '@': projectRoot,
    },
  },
  build: {
    outDir: fileURLToPath(new URL('./dist-pages', import.meta.url)),
    emptyOutDir: true,
  },
});
