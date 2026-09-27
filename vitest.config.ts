import { defineConfig } from 'vitest/config';

/** One runner for the whole workspace: each app or package that has tests
 *  carries its own vitest.config.ts, and this file only lists them. */
export default defineConfig({
  test: {
    projects: ['apps/*/vitest.config.ts', 'packages/*/vitest.config.ts'],
  },
});
