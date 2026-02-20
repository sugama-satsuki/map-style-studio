import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/map-style-studio/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setupTests.ts'],
    exclude: [
      '**/node_modules/**',
      '**/e2e/**',
      '**/*.spec.ts',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.{ts,tsx}', 'src/hooks/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/__tests__/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
