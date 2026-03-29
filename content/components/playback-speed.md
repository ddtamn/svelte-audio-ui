---
title: Audio Playback Speed
description: Dropdown control for adjusting playback speed. Auto-disabled on live streams with a contextual tooltip.
component: true
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";

	let { viewerData } = $props();
</script>

<br>A compact dropdown button for switching playback speed on the fly — from a slow `0.5x` all the way up to `2x`. Shows the current rate directly on the button, auto-disables itself when a live stream is detected, and remembers your choice across page reloads.

<ComponentPreview name="playback-speed-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[100px]" description="Playback speed control" align="center">

<div></div>

</ComponentPreview>

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui.vercel.app/r/playback-speed.json" />

{/snippet}

{#snippet manual()}

On progress

{/snippet}

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { AudioPlaybackSpeed } from "$lib/components/ui/audio/playback-speed/index.js";
</script>
```

### Basic

Drop it anywhere — no extra wiring needed, it reads from and writes to `audioStore` directly:

```svelte
<AudioPlaybackSpeed />
```

### Icon-only mode

Pass `size="icon"` to hide the gauge icon and show only the speed label — handy when space is tight in a control bar:

```svelte
<AudioPlaybackSpeed size="icon" variant="ghost" />
```

### Custom speeds

Swap out the default speed options with your own list:

```svelte
<AudioPlaybackSpeed
  speeds={[
    { value: 0.75, label: "0.75x" },
    { value: 1, label: "Normal" },
    { value: 1.5, label: "1.5x" },
    { value: 2, label: "2x" },
  ]}
/>
```

## API Reference

### AudioPlaybackSpeed

#### Props

| Prop      | Type                                 | Default           | Description                                                                    |
| --------- | ------------------------------------ | ----------------- | ------------------------------------------------------------------------------ |
| `speeds`  | `{ value: number; label: string }[]` | `DEFAULT_SPEEDS`  | Speed options. Defaults: `0.5x`, `0.75x`, `1x`, `1.25x`, `1.5x`, `2x`.       |
| `size`    | `string`                             | `"sm"`            | Button size. Use `"icon"` to hide the gauge icon and show only the speed label.|
| `variant` | `string`                             | `"outline"`       | Button visual variant.                                                         |
| `class`   | `string`                             | -                 | Additional CSS classes.                                                        |

Accepts any additional HTML button attributes via `...rest`.

#### Behavior

- **Live streams** — automatically disabled when `htmlAudio.isLive()` returns `true`. Tooltip changes to `"Not available for live streams"` so the user always knows why.
- **Current speed indicator** — the active rate is shown on the button and marked with a radio checkmark in the dropdown.
- **Persistence** — speed is saved to `localStorage` via `audioStore` and restored on the next page load.
- **Icon mode** — when `size="icon"`, the `Gauge` icon is hidden; only the speed label (e.g. `1x`) is shown.

> **Note:** `AudioPlaybackSpeed` requires `AudioProvider` (or the audio store) to be mounted higher in the tree. It reads `audioStore.playbackRate` and `audioStore.duration` reactively via Svelte 5 `$derived` runes — no hook wrappers needed.

## Examples

### Inside a player control bar

```svelte
<script lang="ts">
  import * as AudioPlayer from "$lib/components/ui/audio/player/index.js";
  import { AudioPlaybackSpeed } from "$lib/components/ui/audio/playback-speed/index.js";
</script>

<AudioPlayer.Root>
  <AudioPlayer.ControlBar>
    <AudioPlayer.ControlGroup>
      <AudioPlayer.SkipBack />
      <AudioPlayer.Play />
      <AudioPlayer.SkipForward />
    </AudioPlayer.ControlGroup>
    <AudioPlayer.ControlGroup>
      <AudioPlaybackSpeed />
      <AudioPlayer.Volume />
    </AudioPlayer.ControlGroup>
  </AudioPlayer.ControlBar>
</AudioPlayer.Root>
```

### Custom labels

```svelte
<AudioPlaybackSpeed
  speeds={[
    { value: 0.75, label: "Slow" },
    { value: 1, label: "Normal" },
    { value: 1.5, label: "Fast" },
    { value: 2, label: "Turbo" },
  ]}
/>
```

## Related

- [Audio Player](/docs/components/player) — the full player component system
- [Audio Provider](/docs/components/provider) — required wrapper that manages playback state
