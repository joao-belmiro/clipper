# Clipper

Static Nuxt app for managing a private, browser-local clipboard history.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Static production build

Generate the static site into `.output/public`:

```bash
npm run build
```

Publish the contents of `.output/public` to a static web server or hosting provider. No Node.js server is needed at runtime. The app is configured for the `/retro-clipper/` base path.

Preview the generated files locally with:

```bash
npm run preview
```

To regenerate the static output explicitly:

```bash
npm run generate
```

For local development, use `npm run dev`; it runs the Nuxt development server and is not the production hosting mode.
