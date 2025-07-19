import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.spec.{js,ts,jsx,tsx}'],
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: [
        'text',
        'lcov',
        'html',
        'json-summary',
        'cobertura'
      ],
      include: [
        'src/**/*.{ts,js,svelte}',
      ],
      exclude: [
        'src/**/*.spec.{ts,js}',
        'src/**/*.test.{ts,js}',
        'src/**/*.d.ts',
        'src/app.html',
        'src/app.d.ts',
        'src/routes/**/*.svelte', // Page components excluded for now
      ],
      thresholds: {
        'src/utils/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        'src/stores/': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },
      all: true,
      skipFull: false,
    }
  },
  server: {
    hmr: false // Disable HMR for testing
  }
});