import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    exclude: [...configDefaults.exclude, './build/**', './dist/**'],
    browser: {
      enabled: true,
      headless: true,
      name: 'chrome',
    },
    coverage: {
      reporter: ['default', 'text', 'html'],
      extension: ['.ts'],
      include: ['src'],
      clean: true,
      all: true,
    },
  },
});
