---
title: Knob
description: A circular rotary control for adjusting values. Perfect for audio parameters, filters, and effects — with arc indicator, pointer drag, and keyboard support.
component: true
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";

	let { viewerData } = $props();
</script>

<br>A pure Svelte knob built from plain HTML and SVG — no external primitives. Drag up/down to adjust, use keyboard arrows for fine control, and see value progress through a 270° arc indicator. Four size variants keep it fitting everywhere from compact effect panels to large master controls.

<ComponentPreview name="knob-demo" description="Basic knob" align="center">

<div></div>

</ComponentPreview>

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui.vercel.app/r/knob.json" />

{/snippet}

{#snippet manual()}

On progress

{/snippet}

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Knob } from "$lib/components/ui/audio/elements/knob/index.js";
</script>
```

```svelte
<Knob value={50} />
```

### Size Variants

<ComponentPreview name="knob-size-variants-demo" description="All four knob size variants" align="center">

<div></div>

</ComponentPreview>

## API Reference

### Knob

#### Props

| Prop            | Type                                | Default     | Description                                        |
| --------------- | ----------------------------------- | ----------- | -------------------------------------------------- |
| `value`         | `number`                            | `50`        | Current value (bindable).                          |
| `min`           | `number`                            | `0`         | Minimum value.                                     |
| `max`           | `number`                            | `100`       | Maximum value.                                     |
| `step`          | `number`                            | `1`         | Step increment.                                    |
| `disabled`      | `boolean`                           | `false`     | Disables all interaction and adds reduced-opacity. |
| `size`          | `"sm" \| "default" \| "lg" \| "xl"` | `"default"` | Controls the knob diameter.                        |
| `label`         | `string`                            | -           | Optional text label rendered above the knob.       |
| `onValueChange` | `(value: number) => void`           | -           | Fires on every change while the user interacts.    |
| `class`         | `string`                            | -           | Additional CSS classes on the root wrapper.        |

#### Behavior

- **Drag:** Click and drag vertically — drag up to increase, drag down to decrease. 200 px of travel covers the full value range.
- **Keyboard:** `ArrowUp` / `ArrowRight` increases; `ArrowDown` / `ArrowLeft` decreases by one step. `Home` jumps to `min`, `End` to `max`.
- **Arc indicator:** A 270° SVG arc shows the track (dimmed) and the active fill from min to the current value.
- **Pointer indicator:** The inner disc rotates with the value, with a small dot marking the exact position.

> **Tip:** Use `bind:value` for two-way binding in Svelte, or pass `value` + `onValueChange` for a controlled setup.

## Examples

### Filter Control

<ComponentPreview name="knob-filter-control-demo" description="Filter frequency, resonance, and mix knobs" align="center">

<div></div>

</ComponentPreview>

### Multiple Knobs

<ComponentPreview name="knob-multiple-control-demo" description="Multiple knobs for a channel strip" align="center">

<div></div>

</ComponentPreview>

## Related

- [Fader](/docs/ui/fader) — linear slider-style control for mixing boards
- [Audio Player](/docs/components/player) — player controls to pair with knobs
- [Audio Provider](/docs/components/provider) — audio context and state management
