---
title: Audio Queue
description: Queue management components with browse, search, reorder, and control playback order.
component: true
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";
	import ComponentSource from "$lib/components/component-source.svelte";

	let { viewerData } = $props();
  
</script>

<br>A set of composable components for managing the audio queue. Includes a browseable queue dialog, shuffle, repeat mode, and an advanced preferences panel.

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui.vercel.app/r/queue.json" />

{/snippet}

{#snippet manual()}

{#if viewerData}
	<ComponentSource item={viewerData} data-llm-ignore />
{:else}
	<p class="text-muted-foreground mt-4 text-sm">Source code not available.</p>
{/if}

{/snippet}

</InstallTabs>

## Usage

Import the components:

```svelte
<script lang="ts">
  import * as AudioQueue from "$lib/components/ui/audio/queue/index.js";
</script>
```

### Basic Queue

The `AudioQueue` component opens a dialog showing the current queue with search functionality and track selection.

```svelte
<AudioPlayer.Root>
  <AudioPlayer.ControlBar>
    <AudioQueue.Root />
  </AudioPlayer.ControlBar>
</AudioPlayer.Root>
```

### Queue with Shuffle and Repeat

Use this when you want quick access to shuffle and repeat controls. The toggle buttons provide fast switching between modes.

<ComponentPreview name="queue-shuffle-repeat-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[400px]" description="Queue with Shuffle and Repeat" align="center">

<div></div>

</ComponentPreview>

### Queue with Preferences

Use this when you want a compact interface with all queue settings in a dropdown menu. Ideal for space-constrained layouts.

<ComponentPreview name="queue-preferences-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[400px]" description="Queue with Preferences" align="center">

<div></div>

</ComponentPreview>

### Queue with All Controls

Use this when you want a compact interface with all queue settings in a dropdown menu. Ideal for space-constrained layouts.

<ComponentPreview name="queue-all-controls-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[400px]" description="Queue with All Controls" align="center">

<div></div>

</ComponentPreview>

## API Reference

### AudioQueue

An icon button that opens a dialog showing the current queue. Supports live search by title or artist, drag-to-reorder tracks (disabled when filtering), per-track remove, and a clear-all button.

#### Props

| Prop                | Type                      | Default                                 | Description                                   |
| ------------------- | ------------------------- | --------------------------------------- | --------------------------------------------- |
| `class`             | `string`                  | -                                       | Additional CSS classes on the trigger button. |
| `searchPlaceholder` | `string`                  | `"Search for a track..."`               | Placeholder text in the search input.         |
| `emptyLabel`        | `string`                  | `"No tracks found"`                     | Heading shown when the queue is empty.        |
| `emptyDescription`  | `string`                  | `"Try searching for a different track"` | Subtext for the empty state.                  |
| `onTrackSelect`     | `(index: number) => void` | -                                       | Called when a track row is clicked.           |

#### Behavior

- Opens a modal dialog with a full-height track list
- Search filters by `title` and `artist` (case-insensitive)
- When not filtering, the list is **drag-to-reorder** enabled
- Clicking a track plays it immediately; clicking the current track toggles play/pause
- Remove button appears on non-current tracks
- **Clear** button removes all tracks from the queue and closes the dialog

---

### AudioQueueShuffle

A toggle button that enables or disables shuffle mode. Highlights when active.

#### Props

| Prop      | Type     | Default     | Description             |
| --------- | -------- | ----------- | ----------------------- |
| `class`   | `string` | -           | Additional CSS classes. |
| `size`    | `string` | `"icon"`    | Button size variant.    |
| `variant` | `string` | `"outline"` | Button visual variant.  |

Accepts any additional HTML button attributes via `...rest`.

#### Behavior

- When shuffle is **enabled**: `audioStore.shuffle()` randomizes the remaining tracks
- When shuffle is **disabled**: `audioStore.unshuffle()` restores original order
- Uses `role="switch"` and `aria-checked` for accessibility

---

### AudioQueueRepeatMode

A toggle button that cycles through three repeat modes: **none → all → one**.

#### Props

| Prop      | Type     | Default     | Description             |
| --------- | -------- | ----------- | ----------------------- |
| `class`   | `string` | -           | Additional CSS classes. |
| `size`    | `string` | `"icon"`    | Button size variant.    |
| `variant` | `string` | `"outline"` | Button visual variant.  |

Accepts any additional HTML button attributes via `...rest`.

#### Behavior

| State  | Icon                    | Tooltip             |
| ------ | ----------------------- | ------------------- |
| `none` | `Repeat` (dimmed)       | "Disable repeat"    |
| `all`  | `Repeat` (highlighted)  | "Repeat playlist"   |
| `one`  | `Repeat1` (highlighted) | "Repeat this track" |

Cycles on click via `audioStore.changeRepeatMode()`. Uses `role="switch"` for accessibility.

---

### AudioQueuePreferences

An icon button that opens a dropdown with advanced queue settings: **Repeat Mode** and **Insert Mode**.

#### Props

| Prop           | Type     | Default               | Description                   |
| -------------- | -------- | --------------------- | ----------------------------- |
| `class`        | `string` | -                     | Additional CSS classes.       |
| `size`         | `string` | `"icon"`              | Button size variant.          |
| `variant`      | `string` | `"outline"`           | Button visual variant.        |
| `tooltipLabel` | `string` | `"Queue preferences"` | Tooltip text for the trigger. |

#### Repeat Mode options

| Value  | Description                              |
| ------ | ---------------------------------------- |
| `none` | No repeat — stops after the last track   |
| `one`  | Repeat the current track indefinitely    |
| `all`  | Loop through the full queue continuously |

#### Insert Mode options

Controls where newly added tracks are inserted into the queue:

| Value   | Description                                |
| ------- | ------------------------------------------ |
| `first` | Insert at the beginning of the queue       |
| `last`  | Append to the end of the queue             |
| `after` | Insert immediately after the current track |

## Related

- [Audio Player](/docs/components/player) — player controls to use alongside queue components
- [Audio Provider](/docs/components/provider) — required wrapper that manages queue state
