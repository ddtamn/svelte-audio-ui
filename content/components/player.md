---
title: Audio Player
description: A composable audio player component system.
component: true
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import ComponentSource from "$lib/components/component-source.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import PMInstall from "$lib/components/pm-install.svelte";
	import Steps from "$lib/components/steps.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";
	import Step from "$lib/components/step.svelte";
  import Callout from '$lib/components/callout.svelte';

  let { viewerData } = $props();

</script>

<ComponentPreview name="player-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[400px]" description="A fully featured audio player component" align="center">

<div></div>

</ComponentPreview>

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui.vercel.app/r/player.json" />

{/snippet}

{#snippet manual()}

{#if viewerData}
	<ComponentSource item={viewerData} data-llm-ignore />
{:else}
	<p class="text-muted-foreground mt-4 text-sm">Source code not available.</p>
{/if}

{/snippet}

</InstallTabs>

## Setup

Wrap your app with `AudioProvider` at the root level. It powers everything behind the scenes—state, playback, events, retries, and preloading—so all audio components stay in sync.

First, wrap your app with `AudioProvider` at the root level:

```svelte
<script lang="ts">
  import { AudioProvider } from "$lib/components/ui/audio/provider/index.js";

  let { children } = $props();
</script>

<AudioProvider tracks={initialTracks}>{@render children()}</AudioProvider>
```

## Usage

Use the component you need :

```svelte
<script lang="ts">
  import * as AudioPlayer from "$lib/components/ui/audio/player/index.js";
</script>

<AudioPlayer.Root>
  <AudioPlayer.ControlBar>
    <AudioPlayer.ControlGroup>
      <AudioPlayer.SkipBack />
      <AudioPlayer.Rewind />
      <AudioPlayer.Play />
      <AudioPlayer.FastForward />
      <AudioPlayer.SkipForward />
      <AudioPlayer.SeekBar />
      <AudioPlayer.TimeDisplay />
      <AudioPlayer.TimeDisplay remaining />
      <AudioPlayer.Volume />
    </AudioPlayer.ControlGroup>
  </AudioPlayer.ControlBar>
</AudioPlayer.Root>
```

### Stacked Layout

A player with stacked variant, showing time displays above and below the seek bar.

<ComponentPreview name="player-stacked-layout-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[400px]" description="A fully featured audio player component" align="center">

<div></div>

</ComponentPreview>

### Player with Queue

A full-featured player with queue management, shuffle, and repeat controls. Uses `AudioPlayerControlGroup` for flexible layout management.

<ComponentPreview name="player-with-queue-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[400px]" description="A fully featured audio player component" align="center">

<div></div>

</ComponentPreview>

For more queue management options, see the [Audio Queue documentation](/docs/components/queue).

## API Reference

### AudioPlayer.Root

A styled container component for audio controls. This is a presentational wrapper that provides consistent styling. All audio components are self-contained and read state from the global store.

#### Props

Inherits all props from `HTMLDivElement`.

#### Example

```svelte
<AudioPlayer.Root>{/* Your audio controls */}</AudioPlayer.Root>
```

### AudioPlayer.ControlBar

A container component that holds audio player controls. Use it to wrap your control components.

#### Props

| Prop      | Type                     | Default     | Description                         |
| --------- | ------------------------ | ----------- | ----------------------------------- |
| `variant` | `"compact" \| "stacked"` | `"compact"` | Layout variant for the control bar. |
| `class`   | `string`                 | -           | Additional CSS classes.             |

#### Example

```svelte
<AudioPlayer.ControlBar>
  <AudioPlayer.Play />
  <AudioPlayer.SeekBar />
  <AudioPlayer.TimeDisplay />
</AudioPlayer.ControlBar>
```

#### Stacked Layout

```svelte
<AudioPlayer.ControlBar variant="stacked">
  <AudioPlayer.ControlGroup>
    <AudioPlayer.TimeDisplay />
    <AudioPlayer.SeekBar />
    <AudioPlayer.TimeDisplay remaining />
  </AudioPlayer.ControlGroup>
</AudioPlayer.ControlBar>
```

### AudioPlayer.ControlGroup

A flexible wrapper component for grouping audio controls and managing flex layouts. Useful for creating custom layouts with flex-col, justify-between, etc.

#### Props

| Prop    | Type     | Default | Description             |
| ------- | -------- | ------- | ----------------------- |
| `class` | `string` | -       | Additional CSS classes. |

#### Example

```svelte
<AudioPlayer.ControlBar variant="stacked">
  <AudioPlayer.ControlGroup>
    <AudioPlayer.TimeDisplay />
    <AudioPlayer.SeekBar />
    <AudioPlayer.TimeDisplay remaining />
  </AudioPlayer.ControlGroup>
  <AudioPlayer.ControlGroup class="justify-between">
    <AudioPlayer.ControlGroup>
      <AudioPlayer.SkipBack />
      <AudioPlayer.Play />
      <AudioPlayer.SkipForward />
    </AudioPlayer.ControlGroup>
    <AudioPlayer.Volume />
  </AudioPlayer.ControlGroup>
</AudioPlayer.ControlBar>
```

### AudioPlayer.Play

A button that toggles play/pause state. Shows a loading spinner when buffering or loading, and automatically handles the Space bar keyboard shortcut.

#### Props

| Prop      | Type                      | Default   | Description               |
| --------- | ------------------------- | --------- | ------------------------- |
| `class`   | `string`                  | -         | Additional CSS classes.   |
| `size`    | `string`                  | `"icon"`  | Button size variant.      |
| `variant` | `string`                  | `"ghost"` | Button visual variant.    |
| `onclick` | `(e: MouseEvent) => void` | -         | Additional click handler. |

> **Keyboard Shortcuts**: Automatically handles the Space bar to toggle play/pause when focus is on `document.body`.

### AudioPlayer.SkipBack

Navigates to the previous track. If the current track has played for more than 3 seconds, it restarts the current track instead.

Accepts `class`, `size`, and `variant` props (same as `AudioPlayer.Play`).

### AudioPlayer.SkipForward

Navigates to the next track in the queue.

Accepts `class`, `size`, and `variant` props (same as `AudioPlayer.Play`).

### AudioPlayer.Rewind

Seeks backward by 10 seconds. Disabled on live streams.

Accepts `class`, `size`, and `variant` props (same as `AudioPlayer.Play`).

### AudioPlayer.FastForward

Seeks forward by 10 seconds. Disabled on live streams.

Accepts `class`, `size`, and `variant` props (same as `AudioPlayer.Play`).

### AudioPlayer.SeekBar

A slider that shows playback progress and allows seeking. Locked and shows 100% for live streams.

#### Props

| Prop    | Type     | Default | Description             |
| ------- | -------- | ------- | ----------------------- |
| `class` | `string` | -       | Additional CSS classes. |

### AudioPlayer.TimeDisplay

Displays the current playback time or remaining time.

#### Props

| Prop        | Type      | Default | Description                                     |
| ----------- | --------- | ------- | ----------------------------------------------- |
| `remaining` | `boolean` | `false` | Display remaining time instead of elapsed time. |
| `class`     | `string`  | -       | Additional CSS classes.                         |

On live streams: the non-remaining display shows elapsed time, and the remaining display shows a pulsing **LIVE** badge with a Radio icon.

### AudioPlayer.Volume

A dropdown button that opens a volume slider. Includes a mute toggle button inside the dropdown. Hidden on mobile (`hidden md:flex`).

#### Props

| Prop      | Type     | Default     | Description             |
| --------- | -------- | ----------- | ----------------------- |
| `class`   | `string` | -           | Additional CSS classes. |
| `size`    | `string` | `"icon"`    | Button size variant.    |
| `variant` | `string` | `"outline"` | Button visual variant.  |

## Notes

#### Important Information :

- **Component Architecture:** All audio components are self-contained and read state directly from the global `audioStore` — a Svelte 5 reactive class instance (using `$state` fields) defined in `audio-store.svelte.ts`. The audio player uses the HTML5 audio element under the hood via the `htmlAudio` singleton from `html-audio.ts`.

- **AudioProvider Role:** The `AudioProvider` component manages the audio element lifecycle by importing the `htmlAudio` singleton directly (no hook needed). It initialises the `HTMLAudioElement` inside `onMount`, registers all playback event listeners via an `AbortController` (automatically cleaned up on destroy), handles error retries (up to 3 retries with exponential backoff), preloads the next track into a secondary muted `<audio>` element, and uses seven `$effect` runes to reactively sync `audioStore` state changes (track changes, play/pause, seek, volume, mute, playback rate, and localStorage persistence) back to the audio element. It also restores the last playback position from `localStorage` on mount. `AudioProvider` is required for all audio components to function correctly.

- **Previous Button Behavior:** `AudioPlayer.SkipBack` restarts the current track if it has been playing for more than 3 seconds, otherwise it navigates to the previous track in the queue.

- **State Persistence:** `audioStore` automatically persists queue, current track, volume, playback rate, repeat mode, shuffle, insert mode, and playback position to `localStorage` under the key `audio:ui:store`, restored on page reload.

**Live Stream Limitations:**
Live streams disable seeking, rewind, fast-forward, and playback speed controls. The seek bar is locked at 100% progress, and the time display switches to a pulsing **LIVE** badge. Live streams are detected automatically via the HTML5 `audio.duration` value (`Infinity` or `NaN`).
