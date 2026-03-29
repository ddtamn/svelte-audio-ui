---
title: Audio Provider
description: Svelte 5 provider component that manages audio playback lifecycle, state synchronization, and error handling.
component: true
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import Steps from "$lib/components/steps.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";

	let { viewerData } = $props();
</script> <br>

`AudioProvider` is the engine behind every audio component. It initializes the HTML audio element, registers all event listeners, syncs playback state with the `audioStore`, handles errors and retries, preloads the next track, and persists state to `localStorage`.

**It is required.** All audio components depend on it.

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui.vercel.app/r/provider.json" />

{/snippet}

{#snippet manual()}

On progress

{/snippet}

</InstallTabs>

## Usage

The recommended place to mount `AudioProvider` is in your layout file so all pages share the same playback state:

```svelte
<script lang="ts">
  import { AudioProvider } from "$lib/components/ui/audio/provider/index.js";

  let { children } = $props();

  const tracks = [
    {
      id: "1",
      title: "My Track",
      artist: "Artist Name",
      url: "https://example.com/audio.mp3",
    },
  ];
</script>

<AudioProvider {tracks}>
  {@render children()}
</AudioProvider>
```

## API Reference

### Props

| Prop       | Type      | Default | Description                                          |
| ---------- | --------- | ------- | ---------------------------------------------------- |
| `tracks`   | `Track[]` | `[]`    | Initial list of tracks to load into the queue.       |
| `children` | `Snippet` | —       | Required. The content to render inside the provider. |

### Track Shape

Each track in the `tracks` array must follow this shape:

```ts
interface Track {
  id: string | number;
  title: string;
  artist?: string;
  url: string; // URL to the audio file or stream
  cover?: string; // Optional album art URL
  duration?: number; // Optional pre-known duration in seconds
}
```

## How It Works

`AudioProvider` coordinates three layers:

1. **`htmlAudio`** — a singleton that holds the actual `HTMLAudioElement`
2. **`audioStore`** — a Svelte 5 reactive class instance that holds all playback state
3. **`AudioProvider`** — the glue layer that wires DOM events → store updates and store changes → DOM mutations

```
tracks prop → audioStore.queue
audioStore state changes → htmlAudio (DOM)
htmlAudio DOM events → audioStore state
audioStore → localStorage
```

### Lifecycle

On mount, `AudioProvider`:

1. Calls `htmlAudio.init()` to create the underlying `HTMLAudioElement`
2. Creates a secondary muted `<audio>` element for pre-loading the next track
3. Attaches all event listeners via `AbortController` (automatically cleaned up on destroy)
4. Restores the last playback position, volume, and track from `localStorage`

### Reactive `$effect` Sync

Eight `$effect` runes keep the `HTMLAudioElement` in sync with `audioStore`:

| Effect        | Trigger                              | Action                                      |
| ------------- | ------------------------------------ | ------------------------------------------- |
| Track sync    | `tracks` prop changes                | Updates `audioStore.queue` if tracks differ |
| Track change  | `audioStore.currentTrack` changes    | Loads and plays new track                   |
| Seek          | `audioStore.currentTime` user update | Seeks `HTMLAudioElement`                    |
| Volume        | `audioStore.volume` changes          | Sets `audio.volume`                         |
| Mute          | `audioStore.isMuted` changes         | Sets `audio.muted`                          |
| Playback rate | `audioStore.playbackRate` changes    | Sets `audio.playbackRate`                   |
| Queue reset   | `audioStore.queue` becomes empty     | Clears preload audio `src`                  |
| Persistence   | Any tracked state changes            | Saves to `localStorage`                     |

### Error Handling

`AudioProvider` classifies `MediaError` codes and decides if an error is recoverable:

| Error code                        | Message                    | Recoverable |
| --------------------------------- | -------------------------- | ----------- |
| `MEDIA_ERR_ABORTED` (1)           | Playback cancelled         | Yes         |
| `MEDIA_ERR_NETWORK` (2)           | Network error              | Yes         |
| `MEDIA_ERR_DECODE` (3)            | Audio file decoding error  | No          |
| `MEDIA_ERR_SRC_NOT_SUPPORTED` (4) | File/network loading error | Yes         |

For recoverable errors, it retries up to **3 times** with exponential backoff (1s → 2s → 4s). If all retries fail, `audioStore.isError` is set to `true` with an error message.

### Next Track Preloading

When playback starts, `AudioProvider` preloads the next track in a secondary muted `<audio>` element. This minimizes buffering delay when skipping or when the current track ends. It respects shuffle and repeat mode when calculating which track to preload.

### State Persistence

`audioStore` automatically saves to `localStorage` under the key `audio:ui:store` whenever any of these fields change:

- Current track and queue
- Volume and mute
- Playback rate
- Repeat mode and shuffle
- Current playback position
- Queue insert mode and current index

On the next page load, `AudioProvider` restores these values and seeks to the last known position.

## Notes

- **Only one instance** — mount `AudioProvider` once at the top of your app. Multiple instances will conflict because they share the same `htmlAudio` singleton.

- **`tracks` prop is additive** — if `audioStore.queue` already has tracks (e.g. restored from `localStorage`), the `tracks` prop won't overwrite them unless they differ by length or `id`. This prevents overwriting the restored queue on page reload.

- **No playback on restore** — `AudioProvider` restores the last position and loads the track, but does not auto-play. The user must press play.

- **Live stream detection** — live streams are detected via `audio.duration === Infinity` or `NaN`. On a live stream end event (stream drops), `audioStore.isError` is set with the message `"Live stream connection lost"`.
