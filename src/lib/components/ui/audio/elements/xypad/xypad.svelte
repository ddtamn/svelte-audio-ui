<script lang="ts">
	import { cva, type VariantProps } from "cva";
	import { cn } from "$lib/utils.js";

	// ── Size variants (mirrors React xypadVariants cva) ─────────────────────────
	const xypadVariants = cva("", {
		variants: {
			size: {
				sm: "h-40",
				default: "h-48",
				lg: "h-64",
				xl: "h-96",
			},
		},
		defaultVariants: { size: "default" },
	});

	type Size = NonNullable<VariantProps<typeof xypadVariants>["size"]>;

	// Mirrors @audio-ui/utils Point type
	interface Point {
		x: number;
		y: number;
	}

	// ── Inlined utils from @audio-ui/utils ─────────────────────────────────────
	// clamp(value, min, max)
	function clamp(v: number, lo: number, hi: number) {
		return Math.max(lo, Math.min(hi, v));
	}
	// clampUnit(value) → 0..1
	function clampUnit(v: number) {
		return clamp(v, 0, 1);
	}
	// quantizeRound(value, step) — snaps value to nearest multiple of step
	function quantizeRound(v: number, step: number) {
		if (step <= 0) return v;
		return Math.round(v / step) * step;
	}

	// ── Props — mirrors XYPad.RootProps + xypadVariants + xypad.tsx wrapper ─────
	interface Props extends VariantProps<typeof xypadVariants> {
		value?: Point;
		defaultValue?: Point;
		minX?: number;
		maxX?: number;
		minY?: number;
		maxY?: number;
		stepX?: number;
		stepY?: number;
		disabled?: boolean;
		size?: Size;
		class?: string;
		label?: string;
		showValueDisplay?: boolean;
		/** Mirrors XYPadPrimitive.ValueDisplay formatValue */
		formatValue?: (value: Point) => string;
		onValueChange?: (value: Point) => void;
		onValueCommit?: (value: Point) => void;
	}

	let {
		value: controlledValue,
		defaultValue,
		minX = 0,
		maxX = 100,
		minY = 0,
		maxY = 100,
		stepX = 1,
		stepY = 1,
		disabled = false,
		size = "default",
		class: className = "",
		label,
		showValueDisplay = true,
		formatValue,
		onValueChange,
		onValueCommit,
	}: Props = $props();

	// ── Default value: midpoint of range (mirrors primitive's computedDefaultValue) ──
	const computedDefault: Point = $derived(
		defaultValue ?? { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
	);

	// ── Controlled / uncontrolled state ─────────────────────────────────────────
	let internalValue: Point = $state({ ...computedDefault });

	const liveValue = $derived<Point>(controlledValue ?? internalValue);

	// Apply clamp + step snap, then emit — mirrors primitive's updateValue
	function updateValue(raw: Point) {
		const x = quantizeRound(clamp(raw.x, minX, maxX), stepX);
		const y = quantizeRound(clamp(raw.y, minY, maxY), stepY);
		const next: Point = { x, y };
		if (!controlledValue) internalValue = next;
		onValueChange?.(next);
		return next;
	}

	// Apply clamp + step snap, emit, then call commit — mirrors primitive's commitValue
	function commitValue(raw: Point) {
		const committed = updateValue(raw);
		onValueCommit?.(committed);
	}

	// ── Thumb CSS position — mirrors primitive's thumbX / thumbY ────────────────
	// percentageX/Y: normalised 0..1 within the min/max range
	// thumbX = percentageX * 100             → CSS left %
	// thumbY = (1 - percentageY) * 100       → CSS top %  (Y-axis inverted)
	const percentageX = $derived((liveValue.x - minX) / (maxX - minX));
	const percentageY = $derived((liveValue.y - minY) / (maxY - minY));
	const thumbX = $derived(percentageX * 100);
	const thumbY = $derived((1 - percentageY) * 100);

	// ── Grid lines: 4 lines at 20 / 40 / 60 / 80 % ─────────────────────────────
	const gridPositions = Array.from({ length: 4 }, (_, i) => ((i + 1) * 100) / 5);

	// ── Pointer interaction ─────────────────────────────────────────────────────
	// isDragging + dragStartValue are NOT $state — never need to trigger re-renders
	let isDragging = false;
	let dragStartValue: Point = { x: 0, y: 0 };
	let padEl: HTMLDivElement | undefined;

	// Maps absolute pointer position → value in [minX..maxX] × [minY..maxY]
	// Mirrors primitive's calculateValueFromPoint
	function valueFromPoint(clientX: number, clientY: number): Point {
		if (!padEl) return liveValue;
		const rect = padEl.getBoundingClientRect();
		const nx = clampUnit((clientX - rect.left) / rect.width);
		const ny = clampUnit((clientY - rect.top) / rect.height);
		return {
			x: minX + nx * (maxX - minX),
			y: maxY - ny * (maxY - minY), // Y inverted: top of pad = maxY
		};
	}

	function handlePointerDown(e: PointerEvent) {
		if (disabled) return;
		e.preventDefault();
		padEl?.focus();
		isDragging = true;
		padEl?.setPointerCapture(e.pointerId);
		// Initial click: jump to pointer position (mirrors primitive's onDragStart)
		const v = valueFromPoint(e.clientX, e.clientY);
		dragStartValue = v;
		updateValue(v);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || disabled) return;
		// Continuous update while dragging (mirrors primitive's onDrag)
		updateValue(valueFromPoint(e.clientX, e.clientY));
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;
		padEl?.releasePointerCapture(e.pointerId);
		// Commit on release (mirrors primitive's onDragEnd → commitValue)
		commitValue(valueFromPoint(e.clientX, e.clientY));
	}

	// ── Keyboard navigation — mirrors primitive's useKeyboardNavigation handlers ──
	// ArrowLeft/Right → ± stepX on X axis
	// ArrowUp/Down    → ± stepY on Y axis
	// PageUp/PageDown → ± stepY * 10 on Y axis
	// Home            → { minX, maxY }  (top-left corner)
	// End             → { maxX, minY }  (bottom-right corner)
	function handleKeyDown(e: KeyboardEvent) {
		if (disabled) return;
		const { x, y } = liveValue;
		let next: Point | null = null;

		switch (e.key) {
			case "ArrowRight":
				next = { x: x + stepX, y };
				break;
			case "ArrowLeft":
				next = { x: x - stepX, y };
				break;
			case "ArrowUp":
				next = { x, y: y + stepY };
				break;
			case "ArrowDown":
				next = { x, y: y - stepY };
				break;
			case "PageUp":
				next = { x, y: y + stepY * 10 };
				break;
			case "PageDown":
				next = { x, y: y - stepY * 10 };
				break;
			case "Home":
				next = { x: minX, y: maxY };
				break;
			case "End":
				next = { x: maxX, y: minY };
				break;
			default:
				return;
		}

		e.preventDefault();
		commitValue(next);
	}

	// ── Unique element id for aria-labelledby ────────────────────────────────────
	// Mirrors primitive's useId() + elementId pattern
	let uid = $state(Math.random().toString(36).slice(2));
	const labelId = $derived(`xypad-label-${uid}`);
</script>

<!--
  Mirrors XYPadPrimitive.Root + Label + Slider composition.
  All data-* slot/part attributes preserved for Tailwind selector compatibility.
-->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="flex flex-col gap-1" data-slot="xypad-root">
	<!--
    XYPadPrimitive.Label — visually hidden, aria-live="polite".
    Announces current value to screen readers as the pad changes.
    Mirrors the primitive's sr-only absolute positioning trick.
  -->
	<span
		id={labelId}
		aria-live="polite"
		role="status"
		data-slot="xypad-label"
		class="absolute -m-px h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0,0,0,0)]"
	>
		{label ? `${label}: ` : ""}{`X: ${liveValue.x.toFixed(1)}, Y: ${liveValue.y.toFixed(1)}`}
	</span>

	<!-- Optional visible label (not part of primitive, added for xypad.tsx wrapper UX) -->
	{#if label}
		<span class="text-muted-foreground text-xs" aria-hidden="true">
			{label}
		</span>
	{/if}

	<!--
    XYPadPrimitive.Slider — the interactive surface.
    role="application" matches the primitive (not "slider").
    aria-labelledby wires to the sr-only label above.
  -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		bind:this={padEl}
		role="application"
		tabindex={disabled ? -1 : 0}
		aria-label={label ? undefined : "XY Pad"}
		aria-labelledby={label ? labelId : undefined}
		aria-disabled={disabled}
		data-slot="xypad-slider"
		data-disabled={disabled ? "true" : undefined}
		class={cn(
			"relative block w-full cursor-crosshair touch-none overflow-hidden select-none",
			"border-border bg-card rounded-lg border shadow-sm",
			"transition-[color,border-color,box-shadow] duration-150 ease-out",
			"hover:ring-ring/50 hover:shadow-sm hover:ring-2",
			"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:shadow-sm focus-visible:ring-[3px] focus-visible:outline-none",
			"active:border-ring active:ring-ring active:shadow-sm active:ring-2",
			"data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
			xypadVariants({ size }),
			className
		)}
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onkeydown={handleKeyDown}
	>
		<!-- XYPadPrimitive.Grid -->
		<div aria-hidden="true" class="pointer-events-none absolute inset-0" data-slot="xypad-grid">
			<!-- Vertical grid lines -->
			{#each gridPositions as pos (pos)}
				<div
					class="bg-border absolute top-0 bottom-0 w-px opacity-30"
					data-slot="xypad-grid-line"
					data-grid-vertical-line=""
					style="left: {pos}%"
				></div>
			{/each}

			<!-- Horizontal grid lines -->
			{#each gridPositions as pos (`h${pos}`)}
				<div
					class="bg-border absolute right-0 left-0 h-px opacity-30"
					data-slot="xypad-grid-line"
					data-grid-horizontal-line=""
					style="top: {pos}%"
				></div>
			{/each}
		</div>

		<!-- XYPadPrimitive.Crosshair vertical (tracks thumbX) -->
		<div
			aria-hidden="true"
			class="bg-primary pointer-events-none absolute top-0 bottom-0 w-px opacity-50"
			data-slot="xypad-crosshair"
			data-crosshair-vertical=""
			style="left: {thumbX}%"
		></div>

		<!-- XYPadPrimitive.Crosshair horizontal (tracks thumbY) -->
		<div
			aria-hidden="true"
			class="bg-primary pointer-events-none absolute right-0 left-0 h-px opacity-50"
			data-slot="xypad-crosshair"
			data-crosshair-horizontal=""
			style="top: {thumbY}%"
		></div>

		<!-- XYPadPrimitive.Cursor -->
		<div
			aria-hidden="true"
			class="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 transition-none"
			data-slot="xypad-cursor"
			style="left: {thumbX}%; top: {thumbY}%"
		>
			<!-- CursorGlow -->
			<div
				class="bg-primary absolute inset-0 rounded-full opacity-30 blur-lg transition-opacity duration-200"
				data-slot="xypad-cursor-glow"
			></div>
			<!-- CursorDot -->
			<div
				class="bg-primary shadow-primary/50 absolute inset-1 rounded-full shadow-lg"
				data-slot="xypad-cursor-dot"
			></div>
			<!-- CursorHighlight -->
			<div
				class="bg-primary-foreground absolute inset-2 rounded-full opacity-30"
				data-slot="xypad-cursor-highlight"
			></div>
		</div>

		<!--
      XYPadPrimitive.ValueDisplay
      Default format mirrors primitive: "x, y" with toFixed(0).
      Custom formatValue prop overrides completely.
    -->
		{#if showValueDisplay}
			<div
				aria-live="polite"
				class={cn(
					"pointer-events-none absolute top-1.5 right-1.5 z-10",
					"border-border bg-background/80 rounded-sm border backdrop-blur-sm",
					"text-muted-foreground px-2 py-1 font-mono text-xs"
				)}
				data-slot="xypad-value-display"
			>
				{#if formatValue}
					{formatValue(liveValue)}
				{:else}
					<span data-slot="xypad-value-x">{liveValue.x.toFixed(0)}</span><span
						data-slot="xypad-value-separator"
						>,
					</span><span data-slot="xypad-value-y">{liveValue.y.toFixed(0)}</span>
				{/if}
			</div>
		{/if}
	</div>
</div>
