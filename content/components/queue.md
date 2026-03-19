---
title: Audio Queue
description: Queue management components — browse, search, reorder, and control playback order.
component: true
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";

	let { viewerData } = $props();
</script>

A set of composable components for managing the audio queue. Includes a browseable queue dialog, shuffle, repeat mode, and an advanced preferences panel.

<ComponentPreview name="player-with-queue-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[400px]" description="Player with queue management" align="center">

<div></div>

</ComponentPreview>

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui/r/queue.json" />

{/snippet}

{#snippet manual()}

On progress

{/snippet}

</InstallTabs>

## Usage

Import from the queue index:

```svelte
<script lang="ts">
  import {
    AudioQueue,
    AudioQueueShuffle,
    AudioQueueRepeatMode,
    AudioQueuePreferences,
  } from "$registry/ui/audio/queue/index.js";
</script>

<AudioQueueShuffle />
<AudioQueueRepeatMode />
<AudioQueue />
<AudioQueuePreferences />
```

Typically used inside `AudioPlayer.ControlBar` alongside player controls:

```svelte
<AudioPlayer.ControlBar variant="stacked">
  <AudioPlayer.ControlGroup>
    <AudioPlayer.TimeDisplay />
    <AudioPlayer.SeekBar />
    <AudioPlayer.TimeDisplay remaining />
  </AudioPlayer.ControlGroup>
  <AudioPlayer.ControlGroup>
    <AudioPlayer.ControlGroup>
      <AudioPlayer.SkipBack />
      <AudioPlayer.Play />
      <AudioPlayer.SkipForward />
    </AudioPlayer.ControlGroup>
    <AudioQueueShuffle />
    <AudioQueueRepeatMode />
    <AudioPlayer.Volume />
    <AudioQueue />
  </AudioPlayer.ControlGroup>
</AudioPlayer.ControlBar>
```

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

| Prop    | Type     | Default | Description             |
| ------- | -------- | ------- | ----------------------- |
| `class` | `string` | -       | Additional CSS classes. |

Accepts any additional HTML button attributes via `...rest`.

#### Behavior

- When shuffle is **enabled**: `audioStore.shuffle()` randomizes the remaining tracks
- When shuffle is **disabled**: `audioStore.unshuffle()` restores original order
- Uses `role="switch"` and `aria-checked` for accessibility

---

### AudioQueueRepeatMode

A toggle button that cycles through three repeat modes: **none → all → one**.

#### Props

| Prop    | Type     | Default | Description             |
| ------- | -------- | ------- | ----------------------- |
| `class` | `string` | -       | Additional CSS classes. |

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
