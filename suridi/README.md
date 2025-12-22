# Suridi

A small Three.js site built with Vite.

## Local Development

```bash
cd suridi
npm install
npm run dev
```

Open the local server URL Vite prints (typically http://localhost:5173).

## Build for Production

```bash
cd suridi
npm run build
npm run preview
```

## Deploy (GitHub Pages)

This repo includes a workflow at `.github/workflows/deploy.yml` that builds this project on pushes to the `main` branch and publishes the `suridi/dist` folder to GitHub Pages.

The workflow sets a `BASE_PATH` of `/<repo-name>/` so asset paths work under project pages. If your default branch is not `main`, edit `deploy.yml` accordingly.

After the action runs, your site will be available at `https://<username>.github.io/<repo-name>/`.
