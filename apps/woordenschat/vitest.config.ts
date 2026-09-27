import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': __dirname },
  },
  test: {
    name: 'woordenschat',
    include: ['**/*.test.ts'],
    exclude: ['node_modules', '.next'],
    environment: 'node',
    root: path.resolve(__dirname),
  },
});
