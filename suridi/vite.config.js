import { defineConfig } from 'vite';

// Configure base path for GitHub Pages deployments.
// The GitHub Actions workflow sets BASE_PATH to "/<repo-name>/".
export default defineConfig({
  base: process.env.BASE_PATH || '/',
});
