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
	import ComponentSource from "$lib/components/component-source.svelte";

	let { viewerData } = $props();
</script> <br>

`AudioProvider` is the engine behind every audio component. It creates an `HtmlAudio` instance and a matching `AudioStore`, registers all event listeners, syncs playback state, handles errors and retries, preloads the next track, and optionally persists state to `localStorage`.

**It is required.** All audio components depend on it.

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

| Prop         | Type             | Default            | Description                                                                  |
| ------------ | ---------------- | ------------------ | ---------------------------------------------------------------------------- |
| `tracks`     | `Track[]`        | `[]`               | Initial list of tracks to load into the queue.                               |
| `storageKey` | `string \| null` | `"audio:ui:store"` | Key used for `localStorage` persistence. Pass `null` to disable persistence. |
| `children`   | `Snippet`        | —                  | Required. The content to render inside the provider.                         |

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

`AudioProvider` coordinates four layers:

1. **`HtmlAudio`** - an instance that owns the actual `HTMLAudioElement`
2. **`AudioStore`** - a Svelte 5 reactive class instance that holds playback state
3. **Svelte context** - exposes the store to child audio components
4. **`AudioProvider`** - the glue layer that wires DOM events to store updates and store changes back to DOM mutations

```
tracks prop -> provider AudioStore.queue
AudioStore state changes -> HtmlAudio instance
HtmlAudio DOM events -> AudioStore state
AudioStore -> localStorage, when storageKey is enabled
```

### Lifecycle

On mount, `AudioProvider`:

1. Creates dedicated `HtmlAudio` and `AudioStore` instances
2. Sets the store in Svelte context for child audio components
3. Calls `htmlAudio.init()` to create the underlying `HTMLAudioElement`
4. Creates a secondary muted `<audio>` element for pre-loading the next track
5. Attaches all event listeners via `AbortController` (automatically cleaned up on destroy)
6. Restores the last playback position, volume, and track from `localStorage` when persistence is enabled

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

The provider's `AudioStore` automatically saves to `localStorage` under the key `audio:ui:store` whenever any of these fields change:

- Current track and queue
- Volume and mute
- Playback rate
- Repeat mode and shuffle
- Current playback position
- Queue insert mode and current index

On the next page load, `AudioProvider` restores these values and seeks to the last known position.

Use `storageKey` when multiple players should keep separate saved state:

```svelte
<AudioProvider tracks={podcastTracks} storageKey="audio:podcast">
  <PodcastPlayer />
</AudioProvider>

<AudioProvider tracks={musicTracks} storageKey="audio:music">
  <MusicPlayer />
</AudioProvider>
```

Pass `storageKey={null}` to disable persistence for that provider.

## Notes

- **Provider scope** - every audio component must render inside an `AudioProvider`. Multiple providers are allowed; each provider owns an independent `HtmlAudio` and `AudioStore` instance.

- **`tracks` prop is additive** — if `audioStore.queue` already has tracks (e.g. restored from `localStorage`), the `tracks` prop won't overwrite them unless they differ by length or `id`. This prevents overwriting the restored queue on page reload.

- **No playback on restore** — `AudioProvider` restores the last position and loads the track, but does not auto-play. The user must press play.

- **Live stream detection** — live streams are detected via `audio.duration === Infinity` or `NaN`. On a live stream end event (stream drops), `audioStore.isError` is set with the message `"Live stream connection lost"`.
