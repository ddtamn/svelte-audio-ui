# Contributing to Svelte Audio UI

Thank you for your interest in contributing to **Svelte Audio UI**! Whether you're reporting a bug, proposing a new component, improving documentation, or submitting a fix — every contribution is appreciated.

This guide explains how to get involved and what to expect during the process.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting New Components](#suggesting-new-components)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Coding Style](#coding-style)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Commit & PR Title Guidelines](#commit--pr-title-guidelines)

---

## Code of Conduct

All contributors are expected to be respectful and inclusive. Harassment, discrimination, or hostile behavior of any kind will not be tolerated. Be kind — this is a community project.

---

## Ways to Contribute

- **Bug reports** – Found something broken? Open an issue.
- **Component suggestions** – Have an idea for a new audio UI component? Start a GitHub Discussion.
- **Documentation improvements** – Unclear wording, missing examples, or broken links.
- **Bug fixes** – Pick up an open issue and submit a PR.
- **New components or particles** – Propose first in Discussions, then implement.
- **Registry improvements** – Help improve the `generate-registry.ts` output or schema.
- **Testing** – Help verify PRs work correctly across browsers and environments.

---

## Reporting Bugs

Before filing a bug report:

1. **Search existing issues** — the bug may already be known.
2. **Confirm it's reproducible** on the latest version.
3. **Check it's not a dependency issue** (e.g., `bits-ui`, `shadcn-svelte`, `svelte-dnd-action`).

When opening an issue, include:

- A clear, descriptive title
- Steps to reproduce
- Expected vs. actual behavior
- Relevant code snippets or a minimal reproduction
- Environment info: OS, browser, Node/Bun version, Svelte/SvelteKit version

> **Note:** Issues are for bugs only. Feature suggestions belong in [GitHub Discussions](https://github.com/ddtamn/svelte-audio-ui/discussions).

---

## Suggesting New Components

Open a **GitHub Discussion** (not an issue) with:

- What the component does and why it's useful for audio UIs
- Rough API / props sketch if you have one
- Examples or references from other UI libraries

Large PRs without prior discussion may be declined. Discuss first, then build.

---

## Development Setup

### Prerequisites

- **Bun** (recommended) — `bun install`
- **Node.js 20+** (works with `npm` or `pnpm` as alternatives)

### Clone & install

```sh
git clone https://github.com/ddtamn/svelte-audio-ui.git
cd svelte-audio-ui
bun install
```

### Start the dev server

```sh
bun run dev
```

This runs the registry build step (`scripts/build-registry.ts`) and then starts the Vite dev server.

If you're only working on the Svelte app (not docs content):

```sh
bun run dev:svelte
```

If you're editing markdown content / velite collections:

```sh
bun run dev:content
```

For content-heavy changes, run both in separate terminals:

```sh
# Terminal 1
bun run dev

# Terminal 2
bun run dev:content
```

---

## Project Structure

```
.
├── content/                        # Markdown documentation pages
├── scripts/
│   └── build-registry.ts           # Generates src/__registry__/index.js
├── src/
│   ├── __registry__/               # Auto-generated registry index (do not edit)
│   ├── lib/
│   │   ├── components/             # Shared site/docs UI (non-registry)
│   │   ├── registry/
│   │   │   ├── ui/audio/           # Core audio components (Player, Queue, Track, etc.)
│   │   │   ├── ui/audio/elements/  # Primitive UI elements (Knob, Fader, Slider, XYPad, etc.)
│   │   │   ├── particles/          # Standalone demo particles (shown on /particles page)
│   │   │   ├── examples/           # Docs preview examples
│   │   │   ├── lib/                # Audio runtime (audio-store, html-audio)
│   │   │   └── scripts/
│   │   │       └── generate-registry.ts  # Generates static/r/*.json for the CLI
│   │   ├── navigation.ts           # Site navigation structure
│   │   └── config.ts               # Global site config
│   └── routes/                     # SvelteKit app routes
├── static/
│   └── r/                          # Generated registry JSON files (do not edit manually)
├── mdsx.config.js                  # Markdown pipeline (Shiki, rehype, component previews)
├── velite.config.js                # Content collections
├── svelte.config.js
└── vite.config.ts
```

### Key areas

| Area | Description |
|---|---|
| `src/lib/registry/lib/audio-store.svelte.ts` | Global reactive audio store — playback, queue, state |
| `src/lib/registry/lib/html-audio.ts` | Low-level HTMLAudioElement wrapper |
| `src/lib/registry/ui/audio/provider/` | `AudioProvider` — must wrap app at layout level |
| `src/lib/registry/scripts/generate-registry.ts` | Generates the `static/r/*.json` registry files |
| `scripts/build-registry.ts` | Generates `src/__registry__/index.js` for docs previews |
| `content/` | All markdown documentation |

---

## Making Changes

### Adding a new audio component

1. Create it under `src/lib/registry/ui/audio/<name>/`.
2. Add an `index.ts` that exports all sub-components.
3. Create at least one example in `src/lib/registry/examples/<name>-demo.svelte`.
4. Run the registry generators:

   ```sh
   bun run build:registry
   cd src/lib/registry && bun run scripts/generate-registry.ts
   ```

5. Add a docs page in `content/components/<name>.md` and register it in `src/lib/navigation.ts`.

### Adding a particle

1. Create `src/lib/registry/particles/<name>.svelte`.
2. Register it in `src/lib/registry/particles/index.ts`.
3. Re-run the registry build.

### Updating the audio runtime

Be careful when editing `audio-store.svelte.ts`, `html-audio.ts`, or `audio-provider.svelte` — these affect **all** interactive demos across the docs site. Test thoroughly before submitting.

### Adding or editing docs

1. Edit or create a `.md` file under `content/`.
2. Update `src/lib/navigation.ts` if it's a new page.
3. In code blocks, use `$lib/components/ui/audio/...` paths (not `$registry/...`) — these map to what users will have after installing via the CLI.

---

## Coding Style

We use **ESLint** and **Prettier** for consistent formatting. Please run before submitting:

```sh
bun run lint     # Check for lint errors
bun run format   # Auto-format with Prettier
bun run check    # TypeScript + Svelte type checking
```

General guidelines:

- **TypeScript everywhere** — avoid `any`, prefer proper types.
- **Svelte 5 runes API** — use `$state`, `$derived`, `$effect`, `$props()`.
- **No nested interactive elements** — e.g., don't put a `<Button>` inside a `<Tooltip.Trigger>` without using the `#snippet child({ props })` pattern (hydration issues).
- **`$lib/` paths in examples and docs** — never use `$registry/` in code blocks shown to users.
- **Accessible markup** — use `aria-label`, proper roles, keyboard handlers.
- **camelCase** for variables/functions, **PascalCase** for components.

---

## Submitting a Pull Request

1. **Fork** the repository and create a branch from `main`.
2. **Name your branch** descriptively: `fix/queue-hydration-error`, `feat/wave-shaper-particle`.
3. **Never submit from your `main` branch.**
4. Make your changes, following the coding style above.
5. Re-run `bun run build:registry` if you added or renamed any registry components.
6. Push your branch and open a PR against `main`.
7. In the PR description:
   - Summarize what you changed and why.
   - Link to any related issue or discussion.
   - Include screenshots or recordings for visual changes.
8. Address review feedback promptly.

**Keep PRs focused.** One feature or bug fix per PR. Large multi-feature PRs are hard to review and may be split or rejected.

---

## Commit & PR Title Guidelines

Use a conventional prefix in your PR title and key commits:

| Prefix | When to use |
|---|---|
| `feat:` | New component, particle, or feature |
| `fix:` | Bug fix |
| `docs:` | Documentation-only changes |
| `chore:` | Tooling, dependencies, config (no source changes) |
| `refactor:` | Restructuring without changing behavior |
| `style:` | Formatting, whitespace, aesthetics |

**Examples:**

```
feat: add WaveShaper particle
fix: resolve nested button hydration error in AudioQueue
docs: update AudioPlayer installation path
chore: regenerate static/r registry JSON files
```

---

## Questions?

Open a [GitHub Discussion](https://github.com/ddtamn/svelte-audio-ui/discussions) — we're happy to help you get started!
