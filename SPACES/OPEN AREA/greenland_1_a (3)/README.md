# stacksverse

Next.js application exported from Spline, configured to render a local 3D scene file.

## Tech Stack

- Next.js 15
- React 19 RC
- TypeScript
- Spline runtime (`@splinetool/react-spline`, `@splinetool/runtime`)

## Project Setup

1. Install dependencies:

```bash
npm install
```

2. Start local development server:

```bash
npm run dev
```

3. Open in browser:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build production bundle.
- `npm run start`: Run production build.
- `npm run lint`: Run lint checks.

## Scene Assets

- Main scene file: `public/scene.splinecode`
- Draco decoder files:
- `public/draco_decoder.wasm`
- `public/draco_wasm_wrapper.js`

Rendering is configured in `app/page.tsx`:
- Scene path: `"/scene.splinecode"`
- WASM path: `"/"`

## Project Structure

See `docs/PROJECT_STRUCTURE.md` for a concise breakdown of folders and responsibilities.

## Environment Notes

This repo includes `.npmrc` with:
- `bin-links=false`
- `ignore-scripts=true`

These settings help avoid symlink/script issues on certain mounted drives.
