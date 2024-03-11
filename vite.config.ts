// vite.config.js
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  base: './',
  plugins: [
    dts({
      exclude: ['**/**.spec.*', '**/**.test.*', '*.config.*'],
      insertTypesEntry: true,
    }),
  ],
  worker: {
    format: 'es',
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: fileURLToPath(new URL('src/main.ts', import.meta.url)),
      name: 'imageCompressor',
      formats: ['es', 'umd'],
    },
  },
});
