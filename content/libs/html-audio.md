---
title: HTML Audio
description: The core HtmlAudio class for robust audio playback.
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

The `HtmlAudio` class manages playback of HTML5 audio with automatic retry logic, event handling, and volume fading. In normal audio UI usage, [AudioProvider](/docs/components/provider) creates and owns the instance for you.

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

Import the class and helpers from the audio library:

```svelte
<script lang="ts">
  import { HtmlAudio, formatDuration, type Track } from "$lib/html-audio";
</script>
```

## Core API

### The `HtmlAudio` Class

Manages the underlying `HTMLAudioElement`, playback state, retries, and custom events. Initialize on client start — the instance is built to be server-safe.

```typescript
import { HtmlAudio } from "$lib/html-audio";

const htmlAudio = new HtmlAudio();

// Initialize on the client
htmlAudio.init();

// Load and play
await htmlAudio.load({ url: "https://example.com/audio.mp3", startTime: 0 });
await htmlAudio.play();
```

<Callout variant="info">

<strong>Client initialization:</strong>

An `HtmlAudio` instance must be initialized on the client.

Call `htmlAudio.init()` inside `onMount` or an `$effect` so the underlying
`HTMLAudioElement` is created only in the browser environment.

</Callout>

#### Lifecycle

| Method      | Description                                             |
| ----------- | ------------------------------------------------------- |
| `init()`    | Initialize on the client. Safe to call multiple times.  |
| `cleanup()` | Reset and release the audio element (pause, clear src). |

#### Playback

| Method                                     | Description                                                                                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `load({ url, startTime?, isLiveStream? })` | Load an audio source and wait for readiness. Pass `isLiveStream: true` for live streams (longer timeout, no seek). Returns `Promise<void>`. |
| `play()`                                   | Start or resume playback. Returns a promise that resolves when the browser allows playback.                                                 |
| `pause()`                                  | Pause playback immediately.                                                                                                                 |
| `setCurrentTime(time)`                     | Seek when metadata is available. Ignored and bounded by duration safely.                                                                    |
| `setPlaybackRate(rate)`                    | Adjust playback speed (0.25 - 2). Disabled automatically if it's a live stream.                                                             |

<Callout variant="warning">

**Browser autoplay restrictions:**

The `play()` call returns a promise which may be rejected by browser autoplay policies if there was no recent user gesture.
Make sure playback is initiated by a user interaction.

</Callout>

<Callout variant="info">

**Live streams:** For live streams (when `isLiveStream` is
true) seeking is disabled and longer timeouts (60s instead of 30s) are used carefully to handle stream buffering.

</Callout>

#### Volume

| Method                             | Description                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `setVolume({ volume, fadeTime? })` | Set or fade volume (0–1). If `fadeTime` > 0, animates smoothly.             |
| `getVolume()`                      | Return current volume (0–1).                                                |
| `setMuted(muted)`                  | Mute or unmute. Restores previous volume when unmuting using a smooth fade. |

#### State

| Method                | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| `getDuration()`       | Return loaded source duration (seconds) or `0` if unavailable. |
| `getCurrentTime()`    | Return current playback position (seconds).                    |
| `isPaused()`          | Return boolean — is playback paused.                           |
| `getBufferedRanges()` | Return underlying `TimeRanges` or `null`.                      |
| `getSource()`         | Return current source URL string.                              |
| `getAudioElement()`   | Return raw `HTMLAudioElement` or `null` on server.             |
| `getPlaybackRate()`   | Return current playback rate.                                  |

#### Events

The library emits custom events via an internal `EventTarget`. You can listen to these without messing with the raw `<audio>` element events:

```typescript
htmlAudio.addEventListener("bufferingStart", () =>
  console.log("Buffering...")
);
htmlAudio.addEventListener("bufferingEnd", () => console.log("Ready to play"));
htmlAudio.addEventListener("playbackStarted", () => console.log("Playing"));
htmlAudio.addEventListener("audioError", () => console.error("Error"));
htmlAudio.addEventListener("bufferUpdate", (e) => {
  if (e instanceof CustomEvent)
    console.log("Buffered:", e.detail.bufferedTime);
});
```

## Utilities

### `formatDuration`

Format seconds into an `MM:SS` string. Extremely handy for UI constraints. Handles invalid input gracefully.

```typescript
import { formatDuration } from "$lib/html-audio";

console.log(formatDuration(125)); // "2:05"
console.log(formatDuration(3661)); // "61:01"
```

### `htmlAudio.isLive`

Check if a duration value indicates a live stream.

```typescript
import { HtmlAudio } from "$lib/html-audio";

const htmlAudio = new HtmlAudio();
const duration = htmlAudio.getDuration();

if (htmlAudio.isLive(duration)) {
  // Disable scrubbers, hide fast-forward buttons, etc.
}
```

<Callout variant="info">

**Live Stream Detection:** The `isLive()` method checks
if a duration `isNaN`,`Infinity`, or `-Infinity`. A duration of `0` just means the metadata hasn't loaded yet.

</Callout>

## Types

### Track

A versatile representation of an audio track to be used across your components:

| Prop            | Type               | Description                      |
| --------------- | ------------------ | -------------------------------- |
| `id`            | `string \| number` | Unique identifier (optional).    |
| `url`           | `string`           | URL of the audio file or stream. |
| `title`         | `string`           | Track title.                     |
| `artist`        | `string`           | Artist name.                     |
| `artwork`       | `string`           | Album artwork URL.               |
| `images`        | `string[]`         | Array of image URLs.             |
| `duration`      | `number`           | Track duration in seconds.       |
| `album`         | `string`           | Album name.                      |
| `genre`         | `string`           | Genre.                           |
| `live`          | `boolean`          | Whether this is a live stream.   |
| `[key: string]` | `unknown`          | Additional ad-hoc properties.    |

## Examples

### Basic Playback

Just wire it up on mount.

```svelte
<script lang="ts">
  import { HtmlAudio } from "$lib/html-audio";
  import { onMount } from "svelte";

  const htmlAudio = new HtmlAudio();

  onMount(() => {
    htmlAudio.init();
  });

  async function playTrack(url: string) {
    try {
      await htmlAudio.load({ url, startTime: 0 });
      await htmlAudio.play();
    } catch (error) {
      console.error("Playback failed:", error);
    }
  }
</script>

<button onclick={() => playTrack("/music.mp3")}>Play Track</button>
```

### Volume Fading

Awesome polish feature: you can smoothly fade the volume instead of jarring the user.

```typescript
import { HtmlAudio } from "$lib/html-audio";

const htmlAudio = new HtmlAudio();

// Immediate jump
htmlAudio.setVolume({ volume: 0.5 });

// Smooth, butter-like fade over 1 second (1000ms)
htmlAudio.setVolume({ volume: 0.8, fadeTime: 1000 });

// Mute with memory (remembers previous volume when toggled back)
htmlAudio.setMuted(true);
htmlAudio.setMuted(false);
```

### Listening to Progress

```svelte
<script lang="ts">
  import { HtmlAudio, formatDuration } from "$lib/html-audio";
  import { onMount, onDestroy } from "svelte";

  const htmlAudio = new HtmlAudio();
  let time = $state(0);

  onMount(() => {
    const updateTime = () => {
      time = htmlAudio.getCurrentTime();
    };

    // Poll the time roughly every frame
    const interval = setInterval(updateTime, 100);

    return () => clearInterval(interval);
  });
</script>

<span>{formatDuration(time)}</span>
```

## Related

- [Audio Store](/docs/libs/audio-store) — A Svelte 5 reactive store class wrapping this class to provide playback state.
- [Audio Provider](/docs/components/provider) — Composable provider that creates and orchestrates an `HtmlAudio` instance inside your layout.
- [Audio Player](/docs/components/player) — Composable player UI components.

## Notes

- **Instance-based**: Each `HtmlAudio` instance owns its own underlying audio element. `AudioProvider` creates one instance per provider.
- **Server-safe**: Most methods (`getVolume()`, etc) have built-in `isClient()` guards, so they won't blow up during SSR.
- **Resilience**: It handles native HTML5 `<audio>` random error events entirely manually, throwing up to 3 retries under the hood before giving up.
- **Polished Fades**: Built-in volume cross-fades use `getAnimationFrame` / timers for smooth transitions. Just supply `fadeTime`.
