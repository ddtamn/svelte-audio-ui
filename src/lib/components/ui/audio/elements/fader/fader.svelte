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

	// ── Track dimensions ────────────────────────────────────────────────────────
	const trackSize = $derived.by<Record<Size, string>>(() => ({
		sm: isVertical ? "w-2" : "h-2",
		default: isVertical ? "w-3" : "h-3",
		lg: isVertical ? "w-4" : "h-4",
	}));

	// ── Thumb dimensions ────────────────────────────────────────────────────────
	const thumbW = $derived.by<Record<Size, string>>(() => ({
		sm: isVertical ? "w-7" : "w-4",
		default: isVertical ? "w-9" : "w-5",
		lg: isVertical ? "w-11" : "w-6",
	}));
	const thumbH = $derived.by<Record<Size, string>>(() => ({
		sm: isVertical ? "h-4" : "h-7",
		default: isVertical ? "h-5" : "h-9",
		lg: isVertical ? "h-6" : "h-11",
	}));

	const thumbWStyles = $derived.by<Record<Size, string>>(() => ({
		sm: isVertical ? "28px" : "16px",
		default: isVertical ? "36px" : "20px",
		lg: isVertical ? "44px" : "24px",
	}));
	const thumbHStyles = $derived.by<Record<Size, string>>(() => ({
		sm: isVertical ? "16px" : "28px",
		default: isVertical ? "20px" : "36px",
		lg: isVertical ? "24px" : "44px",
	}));
	const cssVars = $derived(`--thumb-w: ${thumbWStyles[size]}; --thumb-h: ${thumbHStyles[size]};`);

	// ── Thumb mark dimensions ───────────────────────────────────────────────────
	const markW = $derived.by<Record<Size, string>>(() => ({
		sm: isVertical ? "w-3" : "w-px",
		default: isVertical ? "w-4" : "w-px",
		lg: isVertical ? "w-5" : "w-px",
	}));
	const markH = $derived.by<Record<Size, string>>(() => ({
		sm: isVertical ? "h-px" : "h-3",
		default: isVertical ? "h-px" : "h-4",
		lg: isVertical ? "h-px" : "h-5",
	}));

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
