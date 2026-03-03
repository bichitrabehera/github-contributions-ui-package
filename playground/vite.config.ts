import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      'github-contributions-ui': path.resolve(__dirname, '..', 'src', 'index.ts'),
    },
  },
});
