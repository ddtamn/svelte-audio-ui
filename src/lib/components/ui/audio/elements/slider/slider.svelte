<script lang="ts">
	import { Slider } from "bits-ui";
	import { cn } from "$lib/utils.js";

	/**
	 * Mirrors the React Radix Slider API:
	 * - `value`        → always number[] (controlled)
	 * - `defaultValue` → always number[] (uncontrolled)
	 * - `bufferValue`  → 0–100 percentage for buffer/preload indicator
	 *
	 * Bits-ui handles all keyboard, pointer, a11y, and RTL internally.
	 */
	interface Props {
		value?: number[];
		defaultValue?: number[];
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		orientation?: "horizontal" | "vertical";
		dir?: "ltr" | "rtl";
		autoSort?: boolean;
		bufferValue?: number;
		class?: string;
		onValueChange?: (value: number[]) => void;
		onValueCommit?: (value: number[]) => void;
	}

	let {
		value,
		defaultValue,
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		orientation = "horizontal",
		dir = "ltr",
		autoSort = true,
		bufferValue,
		class: className = "",
		onValueChange,
		onValueCommit,
	}: Props = $props();

	// ── Resolve initial values (mirrors React useMemo logic) ────────────────────
	// Always work with number[] internally; bits-ui receives it as type="multiple"
	// svelte-ignore state_referenced_locally
	let internalValue: number[] = $state(
		Array.isArray(value) ? [...value] : Array.isArray(defaultValue) ? [...defaultValue] : [min]
	);

	// Sync controlled `value` prop changes in
	$effect(() => {
		if (Array.isArray(value)) internalValue = [...value];
	});

	const isVertical = $derived(orientation === "vertical");

	// Buffer bar style — always left/bottom-anchored percentage
	const bufferStyle = $derived(
		isVertical
			? `height: ${bufferValue ?? 0}%; bottom: 0;`
			: `width: ${bufferValue ?? 0}%; left: 0;`
	);
</script>

<Slider.Root
	type="multiple"
	bind:value={internalValue}
	{min}
	{max}
	{step}
	{disabled}
	{orientation}
	{dir}
	{autoSort}
	onValueChange={(v) => {
		internalValue = v as number[];
		onValueChange?.(v as number[]);
	}}
	onValueCommit={(v) => onValueCommit?.(v as number[])}
	class={cn(
		"relative flex w-full touch-none items-center select-none",
		"data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44",
		"data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
		"data-[disabled]:opacity-50",
		className
	)}
	data-slot="slider"
>
	{#snippet children({ thumbs })}
		<!--
      Track — plain <span> so we can layer the buffer div behind Slider.Range.
      data-orientation forwarded for Tailwind variant compatibility.
    -->
		<span
			class={cn(
				"bg-muted relative grow overflow-hidden rounded-full",
				"data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
				"data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
			)}
			data-slot="slider-track"
			data-orientation={orientation}
		>
			<!-- Buffer indicator (behind active range) -->
			{#if bufferValue !== undefined}
				<div
					class={cn("bg-primary/40 absolute z-0", isVertical ? "w-full" : "h-full")}
					data-slot="slider-buffer"
					style={bufferStyle}
				></div>
			{/if}

			<!-- Active range fill -->
			<Slider.Range
				class={cn(
					"bg-primary absolute",
					"data-[orientation=horizontal]:h-full",
					"data-[orientation=vertical]:w-full"
				)}
				data-slot="slider-range"
			/>
		</span>

		<!-- One thumb per value entry -->
		{#each thumbs as index (index)}
			<Slider.Thumb
				{index}
				class={cn(
					"border-primary bg-background block size-4 shrink-0 rounded-full border shadow-sm",
					"ring-ring/50 transition-[color,box-shadow]",
					"hover:ring-4",
					"focus-visible:ring-ring/50 focus-visible:ring-4 focus-visible:outline-none",
					"data-[active]:ring-ring/50 data-[active]:ring-4",
					"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
					"cursor-grab active:cursor-grabbing"
				)}
				data-slot="slider-thumb"
			/>
		{/each}
	{/snippet}
</Slider.Root>
