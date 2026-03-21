<script lang="ts">
	import { cn } from "$registry/lib/utils.js";

	export type Size = "sm" | "default" | "lg" | "xl";

	interface Props {
		value?: number; // 0–100
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		size?: Size;
		class?: string;
		label?: string;
		onValueChange?: (value: number) => void;
	}

	let {
		value = $bindable(50),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		size = "default",
		class: className = "",
		label,
		onValueChange,
	}: Props = $props();

	// ── Size map (px) ───────────────────────────────────────────────────────────
	const sizeMap: Record<Size, string> = {
		sm: "size-8",
		default: "size-12",
		lg: "size-16",
		xl: "size-24",
	};

	const insetMap: Record<Size, string> = {
		sm: "inset-0.5",
		default: "inset-1",
		lg: "inset-1.5",
		xl: "inset-2",
	};

	const indicatorMap: Record<Size, { top: string; h: string; w: string }> = {
		sm: { top: "top-0.5", h: "h-2", w: "w-0.5" },
		default: { top: "top-1", h: "h-3", w: "w-0.5" },
		lg: { top: "top-1.5", h: "h-4", w: "w-0.5" },
		xl: { top: "top-2", h: "h-6", w: "w-1" },
	};

	// ── Arc geometry ────────────────────────────────────────────────────────────
	// The knob sweeps from -135° to +135° (270° total arc)
	const MIN_ANGLE = -135;
	const MAX_ANGLE = 135;
	const cx = 50;
	const cy = 50;
	const r = 40;

	function toRad(deg: number) {
		return (deg * Math.PI) / 180;
	}

	function arcPoint(angleDeg: number) {
		const a = toRad(angleDeg - 90); // -90 so 0° points up
		return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
	}

	const normalised = $derived(Math.max(0, Math.min(1, (value - min) / (max - min))));
	const currentAngle = $derived(MIN_ANGLE + normalised * (MAX_ANGLE - MIN_ANGLE));
	const rotationDeg = $derived(currentAngle); // for the body indicator

	// SVG arc path from MIN_ANGLE to currentAngle
	const arcPath = $derived(() => {
		const start = arcPoint(MIN_ANGLE);
		const end = arcPoint(currentAngle);
		const large = currentAngle - MIN_ANGLE > 180 ? 1 : 0;
		return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
	});

	// ── Pointer drag ────────────────────────────────────────────────────────────
	let dragging = false;
	let startY = 0;
	let startValue = 0;

	function onPointerDown(e: PointerEvent) {
		if (disabled) return;
		dragging = true;
		startY = e.clientY;
		startValue = value;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		// Drag up = increase, drag down = decrease; 200px = full range
		const delta = -(e.clientY - startY) / 200;
		const raw = startValue + delta * (max - min);
		const snapped = Math.round(raw / step) * step;
		const clamped = Math.max(min, Math.min(max, snapped));
		onValueChange?.(clamped);
	}

	function onPointerUp(e: PointerEvent) {
		dragging = false;
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
	}

	function onKeyDown(e: KeyboardEvent) {
		if (disabled) return;
		let next = value;
		if (e.key === "ArrowUp" || e.key === "ArrowRight") next = Math.min(max, value + step);
		if (e.key === "ArrowDown" || e.key === "ArrowLeft") next = Math.max(min, value - step);
		if (e.key === "Home") next = min;
		if (e.key === "End") next = max;
		if (next !== value) {
			e.preventDefault();
			onValueChange?.(next);
		}
	}

	const ind = $derived(indicatorMap[size]);
</script>

<div class={cn("relative inline-flex flex-col items-center gap-1", className)} role="presentation">
	{#if label}
		<span class="text-muted-foreground text-xs">{label}</span>
	{/if}

	<!-- Outer ring / slider surface -->
	<div
		class={cn(
			"relative flex cursor-grab touch-none rounded-full select-none",
			"bg-muted border border-transparent shadow-inner",
			"transition-[color,border-color,box-shadow] duration-150 ease-out",
			"hover:ring-ring/50 hover:shadow-inner hover:ring-2",
			"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
			"active:border-ring active:ring-ring active:cursor-grabbing active:ring-2",
			disabled && "pointer-events-none cursor-not-allowed opacity-50",
			sizeMap[size]
		)}
		role="slider"
		tabindex={disabled ? -1 : 0}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		aria-label={label ?? "Knob"}
		aria-disabled={disabled}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onkeydown={onKeyDown}
	>
		<!-- SVG arc -->
		<svg
			viewBox="0 0 100 100"
			class="pointer-events-none absolute inset-0 size-full overflow-visible"
			aria-hidden="true"
		>
			<!-- Background track arc -->
			<path
				d={(() => {
					const s = arcPoint(MIN_ANGLE);
					const e = arcPoint(MAX_ANGLE);
					return `M ${s.x} ${s.y} A ${r} ${r} 0 1 1 ${e.x} ${e.y}`;
				})()}
				fill="none"
				stroke="currentColor"
				stroke-width="6"
				stroke-linecap="round"
				class="text-muted-foreground/20"
			/>
			<!-- Active fill arc -->
			{#if normalised > 0}
				<path
					d={arcPath()}
					fill="none"
					stroke="currentColor"
					stroke-width="6"
					stroke-linecap="round"
					class="text-primary opacity-70"
				/>
			{/if}
		</svg>

		<!-- Body (rotates with value) -->
		<div
			class={cn(
				"border-border bg-card absolute rounded-full border shadow-sm",
				"transition-transform duration-100 ease-out",
				insetMap[size]
			)}
			style="transform: rotate({rotationDeg}deg)"
		>
			<!-- Indicator dot -->
			<div
				class={cn(
					"bg-primary absolute left-1/2 -translate-x-1/2 rounded-full",
					ind.top,
					ind.h,
					ind.w
				)}
			></div>
		</div>
	</div>
</div>
