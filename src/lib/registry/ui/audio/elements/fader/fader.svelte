<script lang="ts">
	import { cn } from "$registry/lib/utils.js";

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
	const trackSize: Record<Size, string> = {
		sm: isVertical ? "w-2" : "h-2",
		default: isVertical ? "w-3" : "h-3",
		lg: isVertical ? "w-4" : "h-4",
	};

	// ── Thumb dimensions ────────────────────────────────────────────────────────
	const thumbW: Record<Size, string> = {
		sm: isVertical ? "w-7" : "w-4",
		default: isVertical ? "w-9" : "w-5",
		lg: isVertical ? "w-11" : "w-6",
	};
	const thumbH: Record<Size, string> = {
		sm: isVertical ? "h-4" : "h-7",
		default: isVertical ? "h-5" : "h-9",
		lg: isVertical ? "h-6" : "h-11",
	};

	// ── Thumb mark dimensions ───────────────────────────────────────────────────
	const markW: Record<Size, string> = {
		sm: isVertical ? "w-3" : "w-px",
		default: isVertical ? "w-4" : "w-px",
		lg: isVertical ? "w-5" : "w-px",
	};
	const markH: Record<Size, string> = {
		sm: isVertical ? "h-px" : "h-3",
		default: isVertical ? "h-px" : "h-4",
		lg: isVertical ? "h-px" : "h-5",
	};

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
	data-disabled={disabled}
	role="presentation"
>
	{#if label}
		<span class="text-muted-foreground mb-1 text-xs">{label}</span>
	{/if}

	<!-- Track -->
	<div
		class={cn(
			"bg-muted relative cursor-pointer overflow-hidden rounded-full",
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
			"absolute flex shrink-0 cursor-grab items-center justify-center",
			"border-border bg-card rounded-md border shadow-sm",
			"transition-[border-color,box-shadow] duration-150 ease-out outline-none",
			"hover:ring-ring/50 hover:ring-2",
			"active:border-ring active:ring-ring active:cursor-grabbing active:ring-2",
			thumbW[size],
			thumbH[size],
			isVertical ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2"
		)}
		style={thumbStyle}
	>
		<!-- Thumb marks -->
		<div
			class={cn(
				"flex h-full w-full items-center justify-center gap-0.5",
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
			"absolute cursor-grab opacity-0",
			isVertical
				? "h-full w-full [direction:rtl] [writing-mode:vertical-lr]"
				: "h-full w-full",
			disabled && "cursor-not-allowed"
		)}
		oninput={handleInput}
	/>
</div>
