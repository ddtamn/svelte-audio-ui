---
title: Fader
description: A slider-style fader component for audio mixing interfaces. Supports vertical and horizontal orientations, size variants, and customisable thumb marks.
component: true
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";
	import ComponentSource from "$lib/components/component-source.svelte";

	let { viewerData } = $props();
</script>

<br>A drag-to-adjust fader built entirely from plain HTML elements and Tailwind — no external slider primitives. Ideal for volume controls, mixing boards, or any parameter you want to expose in a tactile, studio-style UI. Supports vertical and horizontal orientations, three size variants, and configurable thumb marks.

<ComponentPreview name="fader-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[250px]" description="Vertical fader" align="center">

<div></div>

</ComponentPreview>

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui.vercel.app/r/fader.json" />

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

```svelte
<script lang="ts">
  import { Fader } from "$lib/components/ui/audio/elements/fader/index.js";

  let value = $state(50);
</script>
```

```svelte
<Fader {value} onValueChange={(e) => (value = e)} />
```

### Horizontal Fader

<ComponentPreview name="fader-horizontal-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[150px]" description="Horizontal fader" align="center">

<div></div>

</ComponentPreview>

### Custom Thumb Marks

<ComponentPreview name="fader-custom-thumb-marks-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[250px]" description="Custom thumb marks count" align="center">

<div></div>

</ComponentPreview>

### No Thumb Marks

<ComponentPreview name="fader-no-thumb-marks-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[250px]" description="Fader with no thumb marks" align="center">

<div></div>

</ComponentPreview>

## API Reference

### Fader

#### Props

| Prop            | Type                         | Default      | Description                                                 |
| --------------- | ---------------------------- | ------------ | ----------------------------------------------------------- |
| `value`         | `number`                     | `50`         | Current value (bindable).                                   |
| `min`           | `number`                     | `0`          | Minimum value.                                              |
| `max`           | `number`                     | `100`        | Maximum value.                                              |
| `step`          | `number`                     | `1`          | Step increment.                                             |
| `disabled`      | `boolean`                    | `false`      | Disables all interaction and adds reduced-opacity styling.  |
| `orientation`   | `"horizontal" \| "vertical"` | `"vertical"` | Fader orientation.                                          |
| `size`          | `"sm" \| "default" \| "lg"`  | `"default"`  | Controls the track width and thumb dimensions.              |
| `thumbMarks`    | `number \| false`            | `3`          | Number of grip lines on the thumb, or `false` to hide them. |
| `label`         | `string`                     | -            | Optional text label rendered above the fader.               |
| `onValueChange` | `(value: number) => void`    | -            | Fires on every input event as the user drags.               |
| `class`         | `string`                     | -            | Additional CSS classes on the root wrapper.                 |

#### Behavior

- Interaction is handled by an invisible native `<input type="range">` stretched over the full component — keyboard and pointer events just work, fully accessible.
- Vertical mode uses `writing-mode: vertical-lr` + `direction: rtl` on the hidden input so dragging upward increases the value, matching physical fader muscle memory.
- The fill and thumb position are driven by derived state — no manual DOM manipulation needed.

> **Tip:** Use `bind:value` for two-way binding in Svelte, or pass `value` + `onValueChange` for a controlled setup.

## Examples

### Volume Control

Wire directly to `audioStore` for a store-driven volume fader:

<ComponentPreview name="fader-volume-control-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[250px]" description="Volume control fader" align="center">

<div></div>

</ComponentPreview>

### Multiple Faders (Mixing Board)

<ComponentPreview name="fader-multiple-control-demo" class="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[300px]" description="Mixing board with multiple faders" align="center">

<div></div>

</ComponentPreview>

## Related

- [Audio Player](/docs/components/player) — player controls to pair with faders
- [Audio Provider](/docs/components/provider) — audio context and state management
