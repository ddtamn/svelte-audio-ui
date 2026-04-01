---
title: Audio Track
description: Track components for displaying and managing audio tracks, with store and controlled modes.
component: true
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";
	import ComponentSource from "$lib/components/component-source.svelte";

	let { viewerData } = $props();
</script>

<br>Track components for displaying and managing audio tracks. These components support two modes:

- **Store mode**: reads from and controls the global audio queue provided by `audioStore`.
- **Controlled mode**: accepts an explicit list or single track for use in search results or external lists.

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui.vercel.app/r/track.json" />

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
  import * as AudioTrack from "$lib/components/ui/audio/track/index.js";
</script>
```

### AudioTrack

Displays a single track with optional cover, metadata, and playback controls. Use either:

- `trackId` to render an item from the global audio queue (store mode), or
- `track` to render a provided track object (controlled mode).

<ComponentPreview name="track-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[200px]" description="Single track item" align="center">

<div></div>

</ComponentPreview>

```svelte
<!-- From queue by id -->
<AudioTrack.Root trackId={track.id} />

<!-- With explicit data -->
<AudioTrack.Root track={customTrack} onclick={() => handlePlay(customTrack)} />
```

### AudioTrackList

Renders a list of tracks. Pass `tracks` for a controlled list, otherwise the component renders the global queue.

Key features:

- Text filtering via `filterQuery` or a custom `filterFn`.
- Optional drag-and-drop (`sortable`) — reordering updates the queue only when not filtered and when `tracks` is not provided.
- Per-item remove action and play/pause controls (configurable via props).

<ComponentPreview name="track-list-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[300px]" description="Track list (store mode)" align="center">

<div></div>

</ComponentPreview>

```svelte
<!-- Store mode: renders global queue -->
<AudioTrack.List onTrackSelect={(index) => console.log(index)} />

<!-- Controlled mode: render custom set -->
<AudioTrack.List tracks={searchResults} onTrackSelect={handleSelect} />
```

#### Grid Layout

<ComponentPreview name="track-list-grid-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[300px]" description="Track list grid layout" align="center">

<div></div>

</ComponentPreview>

#### Sortable

<ComponentPreview name="track-sortable-list-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[300px]" description="Sortable track list" align="center">

<div></div>

</ComponentPreview>

#### Sortable Grid

<ComponentPreview name="track-sortable-list-grid-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[300px]" description="Sortable track list grid" align="center">

<div></div>

</ComponentPreview>

## API Reference

### AudioTrack

#### Props

| Prop             | Type                        | Default | Description                                                                           |
| ---------------- | --------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `trackId`        | `string \| number`          | -       | Load a track from the global queue (store mode). Do not use together with `track`.    |
| `track`          | `Track`                     | -       | Render a provided track object (controlled mode). Do not use together with `trackId`. |
| `index`          | `number`                    | -       | Display index (shown as one-based when `showCover` is false).                         |
| `onclick`        | `() => void`                | -       | Click handler invoked when the track row is clicked.                                  |
| `onRemove`       | `(trackId: string) => void` | -       | Called when the remove button is used. Receives the track `id` as a string.           |
| `showRemove`     | `boolean`                   | `false` | Whether to show the remove (✕) button. Always hidden for the currently playing track. |
| `showPlayPause`  | `boolean`                   | `true`  | Show play/pause control button.                                                       |
| `showDragHandle` | `boolean`                   | `false` | Show a drag handle (use together with a sortable list).                               |
| `showCover`      | `boolean`                   | `true`  | Show album artwork. Falls back to a music icon when no artwork is available.          |
| `class`          | `string`                    | -       | Additional CSS classes on the track row element.                                      |

> **Note:** Use either `trackId` (store mode) or `track` (controlled mode). Both should not be used together. Store mode requires `AudioProvider` to be set up. Cover images are taken from `track.artwork` or `track.images[0]`. Live tracks show a **Live** badge and the duration is hidden — live detection uses `htmlAudio.isLive()`.

---

### AudioTrackList

#### Props

| Prop               | Type                                     | Default                    | Description                                                                                                                                         |
| ------------------ | ---------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tracks`           | `Track[]`                                | -                          | Controlled list of tracks. When omitted, the component reads from the global queue (store mode).                                                    |
| `onTrackSelect`    | `(index: number, track?: Track) => void` | -                          | Called when a track is selected or played. In store mode the index is the queue index; in controlled mode it refers to the provided `tracks` array. |
| `onTrackRemove`    | `(trackId: string) => void`              | -                          | Remove handler used by the per-item remove button.                                                                                                  |
| `sortable`         | `boolean`                                | `false`                    | Enable drag-and-drop reordering. Reordering updates the store queue only when not filtered and when `tracks` is not provided.                       |
| `showCover`        | `boolean`                                | `true`                     | Show track cover image.                                                                                                                             |
| `variant`          | `"default" \| "grid"`                    | `"default"`                | Layout variant: stacked list or responsive grid.                                                                                                    |
| `filterQuery`      | `string`                                 | -                          | Simple text filter (matches `title` or `artist`, case-insensitive).                                                                                 |
| `filterFn`         | `(track: Track) => boolean`              | -                          | Custom filter function. When provided, `filterQuery` is ignored.                                                                                    |
| `emptyLabel`       | `string`                                 | `"No tracks found"`        | Label shown when the list is empty.                                                                                                                 |
| `emptyDescription` | `string`                                 | `"Try adding some tracks"` | Description shown in the empty state.                                                                                                               |
| `class`            | `string`                                 | -                          | Additional CSS classes.                                                                                                                             |

> **Store vs Controlled Mode:** When `tracks` is omitted, the component reads from the global queue. When `tracks` is provided, it operates in controlled mode using the provided array.

> **Sortable Behavior:** When `sortable` is enabled, reordering will only update the store queue when the list is not filtered (`filterQuery` and `filterFn` are not used) AND the component is in store mode (`tracks` prop is not provided). Keep `sortable` disabled while filtering to avoid unexpected reordering behavior.

## Examples

### Store mode (main queue)

```svelte
<AudioTrack.List
  sortable
  onTrackSelect={(i) => console.log("play queue index", i)}
/>
```

### Controlled mode (external list)

```svelte
<AudioTrack.List
  tracks={searchResults}
  variant="grid"
  onTrackSelect={(index, track) => addToQueue(track)}
/>
```

### Filtering

```svelte
<!-- Simple text filter -->
<AudioTrack.List filterQuery="jazz" />

<!-- Custom filter function -->
<AudioTrack.List filterFn={(t) => t.genre === "jazz"} />
```

### With removal

```svelte
<AudioTrack.List onTrackRemove={(id) => removeFromQueue(id)} />
```

## Related

- [Audio Player](/docs/components/player) — player controls to use alongside track components
- [Audio Provider](/docs/components/provider) — required wrapper that manages queue state
- [Audio Queue](/docs/components/queue) — queue dialog and ordering controls
