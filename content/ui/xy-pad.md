---
title: XY Pad
description: An XY pad component for controlling two parameters simultaneously. Perfect for synthesizers, filters, and effects that need two-dimensional control.
component: true
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";
	import ComponentSource from "$lib/components/component-source.svelte";

	let { viewerData } = $props();
</script>

<ComponentPreview name="xypad-demo" description="Basic XY Pad" align="center">

<div></div>

</ComponentPreview>

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui.vercel.app/r/xypad.json" />

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
  import { XYPad } from "$lib/components/ui/audio/elements/xypad/index.js";
</script>
```

### Basic XY Pad

```svelte
<XYPad defaultValue={{ x: 50, y: 50 }} />
```

### Custom Value Display

<ComponentPreview name="xypad-format-value-demo" description="Custom formatted value display" align="center">

<div></div>

</ComponentPreview>

### Hide Value Display

<ComponentPreview name="xypad-hide-value-demo" description="XY Pad with hidden value display overlay" align="center">

<div></div>

</ComponentPreview>

## API Reference

### XYPad

#### Props

| Prop               | Type                                          | Default                | Description                                     |
| ------------------ | --------------------------------------------- | ---------------------- | ----------------------------------------------- |
| `value`            | `{ x: number; y: number }`                    | -                      | Controlled value.                               |
| `defaultValue`     | `{ x: number; y: number }`                    | `{ x: 50, y: 50 }`     | Uncontrolled default value.                     |
| `size`             | `"sm" \| "default" \| "lg" \| "xl"`           | `"default"`            | Size variant (affects height).                  |
| `disabled`         | `boolean`                                     | `false`                | Disables interaction and lowers opacity.        |
| `label`            | `string`                                      | -                      | Optional text label rendered above the pad.     |
| `showValueDisplay` | `boolean`                                     | `true`                 | Whether to show the value display overlay.      |
| `formatValue`      | `(value: { x: number; y: number }) => string` | -                      | Custom formatter for the value text.            |
| `class`            | `string`                                      | -                      | Additional CSS classes for the root element.    |
| `onValueChange`    | `(value: { x: number; y: number }) => void`   | -                      | Callback when value changes during interaction. |
| `onValueCommit`    | `(value: { x: number; y: number }) => void`   | -                      | Callback when value is committed (on release).  |

## Examples

### Synthesizer Control

<ComponentPreview name="xypad-synthesizer-control-demo" description="Synthesizer parameter mapping" align="center">

<div></div>

</ComponentPreview>

### Filter Control

<ComponentPreview name="xypad-filter-control-demo" description="Filter cutoff and resonance control" align="center">

<div></div>

</ComponentPreview>

## Notes

> **Important Information:**
>
> * **Native Implementation:** This component is built as a pure Svelte implementation, providing a high-quality, accessible XY pad control without bulky dependencies.
> * **Grid Display:** The pad includes a visual grid to help with positioning.
> * **Crosshair:** Visual crosshairs indicate the current X and Y positions.
> * **Value Display:** By default, a value display overlay shows the current position. You can customize the formatter function or hide it entirely.
> * **Size Variants:** Four size variants are available (`sm`, `default`, `lg`, and `xl`). These effectively control the pad height.
> * **Keyboard Support:** Arrow keys adjust the value by 1. Holding `Shift` while using arrow keys changes the step amount to 10. `y = 100` maps to the top of the pad following standard musical conventions.
