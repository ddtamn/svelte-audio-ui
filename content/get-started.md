---
title: Get Started
description: Add your first audio component using the registry.
---

<script>
	import Steps from "$lib/components/steps.svelte";
	import PMCreate from "$lib/components/pm-create.svelte";
	import PMExecute from "$lib/components/pm-execute.svelte";
	import PMInstall from "$lib/components/pm-install.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
  import InstallTabs from "$lib/components/install-tabs.svelte";
  import Callout from '$lib/components/callout.svelte';
  import InfoIcon from "@lucide/svelte/icons/info";
</script>

<br>
<Steps>

This guide will walk you through adding **svelte-audio-ui** components using the [shadcn-svelte](https://shadcn-svelte.com) CLI and registry system.

## Prerequisites

Before you begin, make sure you have:

- A **Svelte 5 project** (SvelteKit recommended for most use cases)
- **Tailwind CSS v4** properly configured
- **shadcn-svelte** initialized in your project

If you haven’t initialized shadcn-svelte yet, run:

<PMExecute command="shadcn-svelte@latest init" />

## Adding Components

You can add components **svelte-audio-ui** using **shadcn-svelte** CLI or **manually by copying the files.**

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui/r/player.json" />

This command will:

- add the `AudioPlayer` component
- automatically install required shadcn primitives
- include the audio store and core logic
- install the `AudioProvider` if it does not already exist

Everything is copied into your project—nothing is installed as a runtime dependency.

{/snippet}

{#snippet manual()}

> On Progress

{/snippet}

</InstallTabs>

## Step 3: Setup AudioProvider

The `AudioProvider` is required and will be added automatically when installing your first audio component.

It acts as the central engine that:

- initializes and manages the HTMLAudioElement
- syncs playback state with the store
- handles buffering, retries, and errors
- preloads upcoming tracks for smoother playback
- persists playback state (volume, progress, queue, etc)

Wrap your app with `AudioProvider` at the root level:

```svelte
<script lang="ts">
  import { AudioProvider } from "$lib/components/ui/audio/provider/index.js";

  let { children } = $props();
</script>

<AudioProvider tracks={initialTracks}>{@render children()}</AudioProvider>
```

This ensures all audio components share a single, consistent playback state.

## Step 4: Use the component

```svelte
<script lang="ts">
  import * as AudioPlayer from "$registry/ui/audio/player/index.js";

  let { children } = $props();
</script>

<AudioProvider tracks={initialTracks}>{@render children()}</AudioProvider>
```

## Styling

Components are styled with a design token system defined by CSS variables and implemented with Tailwind CSS. The variables follow the same approach as shadcn/ui and are fully customizable.

For detailed information about styling, color tokens, and customization options, see the [shadcn-svelte theming documentation.](https://www.shadcn-svelte.com/docs/theming)

## Working with LLMs

I try to keep the documentation structured in a way that’s easy for AI to read and work with.
To support that, I include:

- **[llms.txt](/llms.txt)** — a lightweight map of the documentation and component structure, so AI tools can quickly understand how things are organized without scanning everything.

- **[llms-full.txt](/llms-full.txt)** — a more complete dump of the docs and component sources, useful when you want deeper analysis or more accurate generation.

- **Copy Markdown button** — available on every page, so you can quickly grab the content and feed it into your own AI workflow without extra cleanup.

</Steps>
