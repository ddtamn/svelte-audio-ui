---
title: Slider
description: A slider component with buffer support. Perfect for media players to show loading progress.
component: true
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";

	let { viewerData } = $props();
</script>

<ComponentPreview name="slider-demo" description="A slider component with buffer support." align="center">

<div></div>

</ComponentPreview>

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui/r/slider.json" />

{/snippet}

{#snippet manual()}

On progress

{/snippet}

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/audio/elements/slider/index.js";
</script>
```

```svelte
<Slider value={[33]} max={100} step={1} />
```

### Buffer Indicator

This slider extends the shadcn-svelte slider component (which uses `bits-ui`) to add support for a `bufferValue` prop, which displays a buffer indicator behind the current value. This is particularly useful for media players to show loading progress:

```svelte showLineNumbers
<script lang="ts">
  import { Slider } from "$lib/components/ui/audio/elements/slider/index.js";
</script>

<Slider
  bufferValue={75}
  class="w-[60%]"
  value={[25]}
  max={100}
  step={1}
/>
```

## API Reference

### Slider

This component extends the `bits-ui` Slider component and inherits its props. Additionally, it supports:

| Prop            | Type                                  | Default        | Description                                                                                                                                         |
| --------------- | ------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`         | `number[]`                            | -              | The controlled value array of the slider.                                                                                                           |
| `defaultValue`  | `number[]`                            | -              | The uncontrolled default value array.                                                                                                               |
| `bufferValue`   | `number`                              | -              | Buffer indicator value (0-100). Displays a semi-transparent overlay behind the current value. Useful for showing loading progress in media players. |
| `min`           | `number`                              | `0`            | The minimum value for the range.                                                                                                                    |
| `max`           | `number`                              | `100`          | The maximum value for the range.                                                                                                                    |
| `step`          | `number`                              | `1`            | The stepping interval.                                                                                                                              |
| `orientation`   | `"horizontal" \| "vertical"`          | `"horizontal"` | The orientation of the slider.                                                                                                                      |
| `disabled`      | `boolean`                             | `false`        | When `true`, prevents the user from interacting with the slider.                                                                                    |
| `onValueChange` | `(value: number[]) => void`           | -              | Event handler called when the value changes.                                                                                                        |
| `onValueCommit` | `(value: number[]) => void`           | -              | Event handler called when the value changes at the end of an interaction (e.g. pointer up).                                                         |

For all other props, see the [Bits UI Slider API Reference](https://bits-ui.com/docs/components/slider).

## Notes

> **Important Information:**
>
> * **Custom Component:** This component is based on the default shadcn-svelte registry `Slider` component but extends it with audio-specific features. All standard slider functionality is preserved, with the addition of the `bufferValue` prop for buffer indicators.
> * **Buffer Indicator:** The buffer indicator displays a semi-transparent overlay behind the current value. This is particularly useful for media players to show loading progress or buffered content.
> * **Usage in Audio Player:** This slider is used by the `AudioPlayerSeekBar` component to display playback progress and buffer status.
