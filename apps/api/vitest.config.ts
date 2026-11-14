import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['test/**/*.test.ts'],
    // PGlite roda em WASM; forks isolam cada suíte com seu próprio banco efêmero.
    pool: 'forks',
  },
});
