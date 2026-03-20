# Svelte Audio UI

Svelte Audio UI is a SvelteKit-powered documentation site and component registry for building accessible, composable audio interfaces in Svelte.

The project combines:

- a docs site rendered from markdown content,
- a registry of reusable audio UI components,
- live examples and source viewers embedded in docs,
- and a shared audio runtime for queues, playback state, and transport controls.

## What this repo contains

- **SvelteKit app shell** for site layout, theming, navigation, and metadata.
- **Markdown docs content** stored in `content/` and compiled with Velite + mdsx.
- **Audio UI registry** in `src/lib/registry/` with components such as players, queues, tracks, sliders, knobs, faders, and XY pads.
- **Examples registry build step** in `scripts/build-registry.ts`, which generates `src/__registry__/index.js` for docs previews/source viewers.

## Tech stack

- SvelteKit + Svelte 5
- TypeScript
- Tailwind CSS v4
- mdsx
- Velite
- Vite
- Zod

## Project structure

```text
.
├── content/                     # Markdown docs pages
├── scripts/
│   └── build-registry.ts        # Generates src/__registry__/index.js
├── src/
│   ├── __registry__/            # Generated registry index used by docs tooling
│   ├── lib/
│   │   ├── components/          # Shared site/docs UI components
│   │   ├── registry/            # Audio components, libs, and examples
│   │   ├── docs.ts              # Doc resolver for markdown pages
│   │   ├── navigation.ts        # Main nav + docs sidebar structure
│   │   └── user-config.svelte.ts
│   └── routes/                  # App routes and layouts
├── mdsx.config.js               # Markdown/docs rendering pipeline
├── svelte.config.js             # SvelteKit config
├── velite.config.ts             # Content collections
└── vite.config.ts               # Vite config
```

## Local development

### Prerequisites

- **Node.js 20+**
- **npm 10+** or **pnpm 9+**

> The repository includes a `bun.lock`, but the build pipeline has been set up so production builds can run with standard Node-based package managers too.

### Install dependencies

With npm:

```sh
npm install
```

Or with pnpm:

```sh
pnpm install
```

### Start development

Run the full app:

```sh
npm run dev
```

That runs the registry build step once and then starts the Vite dev server.

If you only want the Svelte app dev server:

```sh
npm run dev:svelte
```

If you are actively editing docs/content metadata:

```sh
npm run dev:content
```

When working on content-heavy changes, it is best to use two terminals:

```sh
npm run dev
```

```sh
npm run dev:content
```

## Build and checks

Production build:

```sh
npm run build
```

Type and Svelte checks:

```sh
npm run check
```

Lint:

```sh
npm run lint
```

Format:

```sh
npm run format
```

Preview production build locally:

```sh
npm run preview
```

## Contributor onboarding

If you are new to the repo, use this path:

### 1. Understand the app shell

Start with:

- `src/routes/+layout.svelte`
- `src/routes/+layout.server.ts`
- `src/routes/+layout.ts`

These files define global styling, theme/layout state, cookies, and shared providers.

### 2. Understand the docs system

Then read:

- `velite.config.ts`
- `mdsx.config.js`
- `src/lib/docs.ts`
- `src/routes/(main)/docs/[...slug]/+page.ts`
- `src/routes/(main)/docs/[...slug]/+page.svelte`

These are the files that turn markdown pages in `content/` into the docs experience.

### 3. Understand the navigation model

Read:

- `src/lib/navigation.ts`
- `src/lib/components/app-sidebar.svelte`
- `src/lib/components/site-header.svelte`

This is where the docs hierarchy and top-level site navigation live.

### 4. Understand the audio runtime

Read these next:

- `src/lib/registry/lib/audio-store.svelte.ts`
- `src/lib/registry/lib/html-audio.ts`
- `src/lib/registry/ui/audio/provider/audio-provider.svelte`

This is the heart of playback state, queue management, and audio element synchronization.

### 5. Understand the reusable registry components

Browse:

- `src/lib/registry/ui/audio/`
- `src/lib/registry/ui/audio/elements/`
- `src/lib/registry/examples/`

The docs pages showcase components from these folders.

### 6. Understand the generated registry flow

The docs tooling relies on a generated file:

- source examples are indexed by `scripts/build-registry.ts`
- output is written to `src/__registry__/index.js`
- markdown preview/source transforms read from that generated index

If you add or rename an example component, rebuild the registry before testing docs behavior.

## How docs pages work

1. Markdown lives under `content/`.
2. Velite collects metadata and emits `.velite/*`.
3. `src/lib/docs.ts` resolves a slug to both metadata and the markdown component.
4. The docs route renders the page, table of contents, navigation, and component/source viewers.
5. `mdsx.config.js` augments markdown with syntax highlighting and component preview/source transforms.

## How audio demos work

Docs pages under `/docs` are wrapped by the docs layout, which provides:

- an `AudioProvider`,
- a shared list of demo tracks,
- and a persistent audio store for queue/playback controls.

This allows demo components to behave like real audio UI instead of static examples.

## Deploying to Vercel

This repository is configured to deploy from the Vercel dashboard with the SvelteKit Vercel adapter.

### Vercel dashboard setup

1. Push this repo to GitHub, GitLab, or Bitbucket.
2. In Vercel, click **Add New Project**.
3. Import the repository.
4. Keep the detected framework as **SvelteKit** if Vercel suggests it.
5. Use the default install command for your package manager.
6. Use the default build command, or set:

```sh
npm run build
```

### Important note

The build step runs `scripts/build-registry.ts` before the app build, so Vercel does not require any extra prebuild configuration.

### Environment variables

At the moment, the project does not require any documented environment variables for a basic deployment.

If you introduce env-based features later, add them to:

- `.env.example`
- this README
- the Vercel project settings

## Common contributor tasks

### Add a new docs page

1. Add a markdown file under `content/overview`, `content/components`, `content/ui`, or `content/libs`.
2. Add/update navigation in `src/lib/navigation.ts` if needed.
3. Run:

```sh
npm run build
```

### Add a new example component

1. Create the example in `src/lib/registry/examples/`.
2. Rebuild the registry:

```sh
npm run build
```

3. Reference it from markdown preview/source blocks.

### Update the shared audio runtime

Be careful when editing:

- `src/lib/registry/lib/audio-store.svelte.ts`
- `src/lib/registry/ui/audio/provider/audio-provider.svelte`

These files affect all interactive audio demos.

## License

MIT.
