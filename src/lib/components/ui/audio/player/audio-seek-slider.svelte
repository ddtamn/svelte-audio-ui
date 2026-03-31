<script lang="ts">
	import { cn } from "$lib/utils.js";

	interface Props {
		value?: number; // 0–100
		bufferValue?: number; // 0–100
		disabled?: boolean;
		class?: string;
		onValueChange?: (values: number[]) => void;
		onMouseMove?: (e: MouseEvent) => void;
		onTouchStart?: (e: TouchEvent) => void;
		onTouchMove?: (e: TouchEvent) => void;
	}

	let {
		value = 0,
		bufferValue = 0,
		disabled = false,
		class: className = "",
		onValueChange,
		onMouseMove,
		onTouchStart,
		onTouchMove,
	}: Props = $props();

	// Clamp helper
	const pct = (v: number) => `${Math.max(0, Math.min(100, v))}%`;

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		onValueChange?.([Number(e.currentTarget.value)]);
	}
</script>

<!--
  Layered slider:
  1. muted bg track
  2. buffer progress
  3. play progress
  4. invisible <input type="range"> for interaction
  5. visible thumb
-->
<div
	class={cn(
		"relative flex h-4 w-full cursor-pointer touch-none items-center select-none",
		disabled && "pointer-events-none opacity-50",
		className
	)}
	role="presentation"
>
	<!-- Track background -->
	<div class="bg-muted absolute h-1.5 w-full overflow-hidden rounded-full">
		<!-- Buffer -->
		<div
			class="bg-muted-foreground/30 absolute left-0 h-full rounded-full transition-[width]"
			style="width: {pct(bufferValue)}"
		></div>
		<!-- Progress -->
		<div
			class="bg-primary absolute left-0 h-full rounded-full transition-[width]"
			style="width: {pct(value)}"
		></div>
	</div>

	<!-- Native range input (invisible, full-width, handles a11y & drag) -->
	<input
		type="range"
		min="0"
		max="100"
		step="0.1"
		{value}
		{disabled}
		aria-valuenow={value}
		class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
		oninput={handleInput}
		onmousemove={onMouseMove}
		ontouchstart={onTouchStart}
		ontouchmove={onTouchMove}
	/>

	<!-- Visible thumb -->
	<div
		class={cn(
			"pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full",
			"border-primary bg-background border-2 shadow ring-0 transition-all",
			"focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
		)}
		style="left: {pct(value)}"
	></div>
</div>
