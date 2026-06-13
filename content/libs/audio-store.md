---
title: Audio Store
description: A context-backed, reactive Svelte 5 store for managing audio playback state and queue.
component: false
---

<script>
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";
	import ComponentSource from "$lib/components/component-source.svelte";
	import Callout from '$lib/components/callout.svelte';

	let { viewerData } = $props();
</script>

<br/>

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui.vercel.app/r/provider.json" />

{/snippet}

{#snippet manual()}

{#if viewerData}
<ComponentSource item={viewerData} data-llm-ignore />
{:else}
<p class="text-muted-foreground mt-4 text-sm">Source code not available.</p>
{/if}

{/snippet}

</InstallTabs>

### Import

Import the context getter and helper types directly into your Svelte components:

```svelte
<script lang="ts">
  import {
    getAudioContext,
    calculateNextIndex,
    calculatePreviousIndex,
    canUseDOM,
    type RepeatMode,
    type InsertMode,
  } from "$lib/audio-store.svelte";
</script>
```

## Core Concepts

### The `AudioStore` Instance

We leverage Svelte 5's powerful `$state` runes to create a highly reactive, class-based store. `AudioProvider` creates an `AudioStore` instance and exposes it through Svelte context, so child audio components can call `getAudioContext()` and read state directly.

<Callout variant="info">
  <strong>Performance Best Practices:</strong> Because `audioStore` uses runes, accessing its properties in your markup or inside `$derived` / `$effect` blocks automatically establishes granular reactivity. Only the parts of your UI that depend on changed state will re-render!
</Callout>

```svelte
<script lang="ts">
  import { getAudioContext } from "$lib/audio-store.svelte";

  const audioStore = getAudioContext();
</script>

<p>
  {audioStore.currentTrack?.title} ({audioStore.duration}s) — {audioStore.isPlaying
    ? "▶"
    : "⏸"}
</p>
```

### Architecture

The `AudioStore` focuses on **reactive playback state and user intent**. It owns a reference to the provider's `HtmlAudio` instance for direct play/pause intent and live-stream checks, while `AudioProvider` still orchestrates DOM event listeners, loading, retries, preloading, and sync effects.

## Store State

The store exposes properties organized by concern. All of these are deeply reactive (`$state`).

| Category          | Property            | Type                           | Description                  |
| ----------------- | ------------------- | ------------------------------ | ---------------------------- |
| **Playback**      | `isPlaying`         | `boolean`                      | Currently playing            |
|                   | `isLoading`         | `boolean`                      | Loading track                |
|                   | `isBuffering`       | `boolean`                      | Buffering audio              |
|                   | `isError`           | `boolean`                      | Error state                  |
|                   | `errorMessage`      | `string \| null`               | Error details                |
| **Current Track** | `currentTrack`      | `Track \| null`                | Active track object          |
|                   | `currentTime`       | `number`                       | Playback position (seconds)  |
|                   | `duration`          | `number`                       | Track length                 |
|                   | `progress`          | `number`                       | Normalized progress 0–100    |
|                   | `bufferedTime`      | `number`                       | Buffered amount              |
| **Queue**         | `queue`             | `Track[]`                      | Array of tracks              |
|                   | `currentQueueIndex` | `number`                       | Active track index           |
| **Controls**      | `volume`            | `number`                       | Volume 0–1                   |
|                   | `isMuted`           | `boolean`                      | Mute state                   |
|                   | `playbackRate`      | `number`                       | Playback speed (0.25–2)      |
|                   | `repeatMode`        | `"none" \| "one" \| "all"`     | Repeat mode                  |
|                   | `shuffleEnabled`    | `boolean`                      | Shuffle state                |
|                   | `insertMode`        | `"first" \| "last" \| "after"` | Insertion position for queue |

## Types

| Type         | Values                         | Description                             |
| ------------ | ------------------------------ | --------------------------------------- |
| `RepeatMode` | `"none" \| "one" \| "all"`     | Repeat playback mode                    |
| `InsertMode` | `"first" \| "last" \| "after"` | Where new tracks are added to the queue |

## Utility Functions

### `calculateNextIndex`

Calculate the next track index based on playback mode, queue length, and shuffle state.

```typescript
const nextIndex = calculateNextIndex({
  queue: audioStore.queue,
  currentQueueIndex: audioStore.currentQueueIndex,
  shuffleEnabled: audioStore.shuffleEnabled,
  repeatMode: audioStore.repeatMode,
});
// Returns: number (track index or -1 if none)
```

### `calculatePreviousIndex`

Calculate the previous track index based on playback mode.

```typescript
const prevIndex = calculatePreviousIndex({
  queue: audioStore.queue,
  currentQueueIndex: audioStore.currentQueueIndex,
  shuffleEnabled: audioStore.shuffleEnabled,
  repeatMode: audioStore.repeatMode,
});
// Returns: number (track index or -1 if none)
```

### `canUseDOM()`

Check if code runs in a DOM environment (safe for SSR).

```typescript
if (canUseDOM()) {
  // Safe to access window or localStorage
}
```

## Actions

Access actions directly on the `audioStore` instance.

| Category       | Action             | Signature                                        | Description                                            |
| -------------- | ------------------ | ------------------------------------------------ | ------------------------------------------------------ |
| **Playback**   | `play`             | `() => void`                                     | Signifies playback intent                              |
|                | `pause`            | `() => void`                                     | Pause playback                                         |
|                | `togglePlay`       | `() => void`                                     | Toggle play/pause state                                |
|                | `seek`             | `(time: number) => void`                         | Seek to position (seconds)                             |
| **Navigation** | `next`             | `() => void`                                     | Play next track                                        |
|                | `previous`         | `() => void`                                     | Play previous track (or restart based on time)         |
|                | `setCurrentTrack`  | `(track: Track \| null) => void`                 | Load and play specific track                           |
|                | `setQueueAndPlay`  | `(tracks: Track[], startIndex: number) => void`  | Set queue and play from index                          |
| **Queue**      | `addToQueue`       | `(track: Track, mode?: InsertMode) => void`      | Add track to queue (supports "first", "last", "after") |
|                | `removeFromQueue`  | `(trackId: string) => void`                      | Remove track from queue                                |
|                | `moveInQueue`      | `(fromIndex: number, toIndex: number) => void`   | Move track in queue                                    |
|                | `setQueue`         | `(tracks: Track[], startIndex?: number) => void` | Replace entire queue                                   |
|                | `clearQueue`       | `() => void`                                     | Clear all tracks from queue                            |
| **Volume**     | `setVolume`        | `({ volume: number }) => void`                   | Set volume (0-1)                                       |
|                | `toggleMute`       | `() => void`                                     | Toggle mute state                                      |
| **Modes**      | `setPlaybackRate`  | `(rate: number) => void`                         | Adjust playback speed                                  |
|                | `changeRepeatMode` | `() => void`                                     | Cycle repeat mode (none → one → all → none)            |
|                | `setRepeatMode`    | `(mode: RepeatMode) => void`                     | Set repeat mode                                        |
|                | `shuffle`          | `() => void`                                     | Randomize queue order                                  |
|                | `unshuffle`        | `() => void`                                     | Restore original queue order                           |
|                | `setInsertMode`    | `(mode: InsertMode) => void`                     | Set insert mode                                        |
| **Error**      | `setError`         | `(message: string \| null) => void`              | Set or clear error state                               |

## Examples

### Basic Usage

Building a custom minimal player is straightforward. Read the provider's store from context.

```svelte
<script lang="ts">
  import { getAudioContext } from "$lib/audio-store.svelte";

  const audioStore = getAudioContext();

  function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
</script>

<div class="rounded-md border p-4">
  <p class="font-bold">Track: {audioStore.currentTrack?.title ?? "None"}</p>
  <p class="text-sm text-gray-500">
    Time: {formatDuration(audioStore.currentTime)} / {formatDuration(
      audioStore.duration
    )}
  </p>
  <p class="mb-2">Status: {audioStore.isPlaying ? "▶ Playing" : "⏸ Paused"}</p>

  <div class="flex gap-2">
    <button onclick={() => audioStore.previous()}>◀ Prev</button>
    <button onclick={() => audioStore.togglePlay()}>
      {audioStore.isPlaying ? "⏸" : "▶"}
    </button>
    <button onclick={() => audioStore.next()}>Next ▶</button>
  </div>
</div>
```

### Queue Management

Easily manipulate the queue with just a few method calls.

```svelte
<script lang="ts">
  import { getAudioContext } from "$lib/audio-store.svelte";

  const audioStore = getAudioContext();

  const newTrack = { id: "123", title: "Indie Banger", src: "/music.mp3" };
</script>

<div>
  <div class="mb-4 flex gap-2">
    <button onclick={() => audioStore.addToQueue(newTrack, "last")}
      >Add Track</button
    >
    <button onclick={() => audioStore.clearQueue()}>Clear</button>
  </div>
  <div class="space-y-1">
    {#each audioStore.queue as track (track.id)}
      <div class="flex justify-between border p-2">
        <span>{track.title}</span>
        <button onclick={() => audioStore.removeFromQueue(track.id)}
          >Remove</button
        >
      </div>
    {/each}
  </div>
</div>
```

### Advanced: Creating a Store Manually

Most apps should use `AudioProvider`. If you are wiring your own provider layer, create an `HtmlAudio` instance and pass it into `AudioStore`.

```typescript
import { AudioStore } from "$lib/audio-store.svelte";
import { HtmlAudio } from "$lib/html-audio";

const htmlAudio = new HtmlAudio();
const audioStore = new AudioStore(htmlAudio, "my-audio-key");

audioStore.setVolume({ volume: 0.5 });
```

## Persistence

When persistence is enabled, the store automatically hydrates and syncs a subset of its state to `localStorage` on the fly.

| Category     | Properties                                                         |
| ------------ | ------------------------------------------------------------------ |
| **Playback** | `currentTrack`, `currentTime`, `currentQueueIndex`, `playbackRate` |
| **Queue**    | `queue`                                                            |
| **Settings** | `volume`, `isMuted`, `repeatMode`, `shuffleEnabled`, `insertMode`  |

**Default storage key:** `audio:ui:store`

Pass a custom `storageKey` to `AudioProvider` to separate state between players. Pass `storageKey={null}` to disable persistence.

The user can resume their queue seamlessly after a page refresh, as if they never left.

## Related

- [Audio Library](/docs/libs/html-audio) — Core HTMLAudio integration
- [Audio Provider](/docs/components/provider) — Handles the HTML `<audio>` bindings.
- [Audio Player](/docs/components/player) — Drop-in UI components.
- [Audio Queue](/docs/components/queue) — Queue UI management.

## Notes

<Callout variant="info">

  <strong>
    Best Practices:
  </strong>

- `audioStore` focuses solely on state. The `AudioProvider` component handles the actual loading and syncing of the `<audio>` element.
- Ensure the `AudioProvider` wraps your app, or at least the part where playback happens, for the state to translate to real sound.
- Async events (buffering, track end) are driven by the `AudioProvider` which calls methods like `handleTrackEnd()` or sets `syncTime()` on the `audioStore`.
- The `playbackRate` automatically resets to `1` when loading live streams to prevent awful chipmunk audio.

</Callout>
