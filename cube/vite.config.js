import { defineConfig } from 'vite';

export default defineConfig({
  root: 'cube',           // folder that contains your index.html
  base: './',             // asset path for GitHub Pages (project pages)
  build: {
    outDir: '../dist'     // place final dist/ at repo/cube/dist (adjust as needed)
  }
});