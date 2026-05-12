<script lang="ts">
	import { cn } from "$lib/utils.js";

	type Orientation = "horizontal" | "vertical";
	type Size = "sm" | "default" | "lg";

	interface Props {
		value?: number; // 0–100
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		orientation?: Orientation;
		size?: Size;
		thumbMarks?: number | false;
		class?: string;
		label?: string;
		onValueChange?: (value: number) => void;
	}

	let {
		value = 50,
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		orientation = "vertical",
		size = "default",
		thumbMarks = 3,
		class: className = "",
		label,
		onValueChange,
	}: Props = $props();

	// ── Derived geometry ────────────────────────────────────────────────────────
	const isVertical = $derived(orientation === "vertical");
	const fillPercent = $derived(((value - min) / (max - min)) * 100);

	// ── Static lookup maps (created once, never re-allocated) ───────────────────
	const TRACK = { v: { sm: "w-2", default: "w-3", lg: "w-4" }, h: { sm: "h-2", default: "h-3", lg: "h-4" } };
	const TW = { v: { sm: "w-7", default: "w-9", lg: "w-11" }, h: { sm: "w-4", default: "w-5", lg: "w-6" } };
	const TH = { v: { sm: "h-4", default: "h-5", lg: "h-6" }, h: { sm: "h-7", default: "h-9", lg: "h-11" } };
	const TW_S = { v: { sm: "28px", default: "36px", lg: "44px" }, h: { sm: "16px", default: "20px", lg: "24px" } };
	const TH_S = { v: { sm: "16px", default: "20px", lg: "24px" }, h: { sm: "28px", default: "36px", lg: "44px" } };
	const MW = { v: { sm: "w-3", default: "w-4", lg: "w-5" }, h: { sm: "w-px", default: "w-px", lg: "w-px" } };
	const MH = { v: { sm: "h-px", default: "h-px", lg: "h-px" }, h: { sm: "h-3", default: "h-4", lg: "h-5" } };

	const axis = $derived(isVertical ? "v" : "h");
	const trackSize = $derived(TRACK[axis][size]);
	const thumbW = $derived(TW[axis][size]);
	const thumbH = $derived(TH[axis][size]);
	const markW = $derived(MW[axis][size]);
	const markH = $derived(MH[axis][size]);
	const cssVars = $derived(`--thumb-w: ${TW_S[axis][size]}; --thumb-h: ${TH_S[axis][size]};`);

	// ── Thumb position as CSS ───────────────────────────────────────────────────
	// Vertical: thumb slides from bottom (0%) to top (100%)
	// Horizontal: thumb slides from left (0%) to right (100%)
	const thumbStyle = $derived(
		isVertical
			? `bottom: calc(${fillPercent}% - 10px)` // offset by half thumb height ≈ 10 px
			: `left: calc(${fillPercent}% - 10px)`
	);

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		onValueChange?.(Number(e.currentTarget.value));
	}
</script>

<div
	class={cn(
		"relative flex touch-none select-none",
		isVertical
			? "h-full min-h-32 w-full flex-col items-center justify-center"
			: "h-full min-w-32 flex-row items-center",
		disabled && "pointer-events-none cursor-not-allowed opacity-50",
		className
	)}
	style={cssVars}
	data-disabled={disabled}
	role="presentation"
>
	{#if label}
		<span class="text-muted-foreground mb-1 text-xs">{label}</span>
	{/if}

	<!-- Invisible native range input (handles all pointer/keyboard interaction) -->
	<input
		type="range"
		{min}
		{max}
		{step}
		{value}
		{disabled}
		aria-label={label ?? "Fader"}
		aria-orientation={orientation}
		class={cn(
			"peer absolute inset-0 z-20 cursor-grab opacity-0",
			"active:cursor-grabbing",
			isVertical
				? "h-full w-full [direction:rtl] [writing-mode:vertical-lr]"
				: "h-full w-full",
			disabled && "cursor-not-allowed"
		)}
		oninput={handleInput}
	/>

	<!-- Track -->
	<div
		class={cn(
			"bg-muted pointer-events-none relative z-10 overflow-hidden rounded-full",
			isVertical ? `h-full ${trackSize[size]}` : `w-full ${trackSize[size]}`
		)}
	>
		<!-- Fill -->
		<div
			class={cn("bg-primary absolute", isVertical ? "bottom-0 w-full" : "left-0 h-full")}
			style={isVertical ? `height: ${fillPercent}%` : `width: ${fillPercent}%`}
		></div>
	</div>

	<!-- Thumb -->
	<div
		class={cn(
			"pointer-events-none absolute z-10 flex shrink-0 items-center justify-center",
			"border-border bg-card rounded-md border shadow-sm",
			"transition-[border-color,box-shadow] duration-150 ease-out outline-none",
			"peer-hover:ring-ring/50 peer-hover:ring-2",
			"peer-active:border-ring peer-active:ring-ring peer-active:ring-2",
			thumbW[size],
			thumbH[size],
			isVertical ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2"
		)}
		style={thumbStyle}
	>
		<!-- Thumb marks -->
		<div
			class={cn(
				"pointer-events-none flex h-full w-full items-center justify-center gap-0.5",
				isVertical ? "flex-col" : "flex-row"
			)}
		>
			{#if thumbMarks !== false}
				{#each { length: thumbMarks } as _, i (i)}
					<div
						class={cn("bg-muted-foreground opacity-30", markW[size], markH[size])}
					></div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
	}

	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: var(--thumb-w, 20px);
		height: var(--thumb-h, 20px);
		cursor: grab;
		background: transparent;
		border: none;
	}

	input[type="range"]:active::-webkit-slider-thumb {
		cursor: grabbing;
	}

	input[type="range"]::-moz-range-thumb {
		width: var(--thumb-w, 20px);
		height: var(--thumb-h, 20px);
		cursor: grab;
		background: transparent;
		border: none;
	}

	input[type="range"]:active::-moz-range-thumb {
		cursor: grabbing;
	}
</style>
