# Project Structure

## Root

- `app/`: Next.js App Router files.
- `public/`: Static assets served directly, including Spline scene and Draco files.
- `docs/`: Project documentation.
- `package.json`: Scripts and dependencies.
- `next.config.js`: Next.js config.
- `tsconfig.json`: TypeScript config.

## App Folder

- `app/layout.tsx`: Root layout and metadata.
- `app/page.tsx`: Homepage rendering the Spline component.
- `app/globals.css`: Global styles.

## Public Assets

- `public/scene.splinecode`: Spline scene source.
- `public/draco_decoder.wasm`: Draco binary decoder.
- `public/draco_wasm_wrapper.js`: Draco JS wrapper.

## Local Development Flow

1. Install packages with `npm install`.
2. Start dev server with `npm run dev`.
3. Open `http://localhost:3000`.
