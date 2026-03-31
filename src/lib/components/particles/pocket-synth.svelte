<script lang="ts">
	import { onDestroy } from "svelte";
	import { XYPad } from "$lib/components/ui/audio/elements/xypad/index.js";
	import { Fader } from "$lib/components/ui/audio/elements/fader/index.js";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";

	// ─── Types ────────────────────────────────────────────────────────────────
	type WaveformType = "sine" | "triangle" | "sawtooth" | "square";
	type FilterType = "lowpass" | "highpass" | "bandpass" | "allpass";

	// ─── Reactive UI state ────────────────────────────────────────────────────
	let waveform = $state<WaveformType>("square");
	let filterType = $state<FilterType>("allpass");
	let volume = $state(0.5);
	let isPlaying = $state(false);
	let position = $state({ x: 0.5, y: 0.5 });

	// ─── Audio node refs (non-reactive) ───────────────────────────────────────
	let audioCtx: AudioContext | null = null;
	let oscillator: OscillatorNode | null = null;
	let gainNode: GainNode | null = null;
	let filterNode: BiquadFilterNode | null = null;

	// ─── Helpers ──────────────────────────────────────────────────────────────
	function getFrequency(x: number): number {
		return 30 * (1046 / 30) ** x;
	}

	function getFilterCutoff(y: number): number {
		return 200 * (8000 / 200) ** y;
	}

	function getAudioContext(): AudioContext | null {
		if (typeof window === "undefined") return null;
		if (!audioCtx) {
			const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
			if (Ctx) audioCtx = new Ctx();
		}
		return audioCtx;
	}

	// ─── Sound control ────────────────────────────────────────────────────────
	function startSound(x: number, y: number): void {
		const ctx = getAudioContext();
		if (!ctx) return;

		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		const filter = ctx.createBiquadFilter();

		osc.type = waveform;
		osc.frequency.setValueAtTime(getFrequency(x), now);

		filter.type = filterType;
		filter.frequency.setValueAtTime(getFilterCutoff(y), now);
		filter.Q.setValueAtTime(5, now);

		gain.gain.setValueAtTime(0, now);
		gain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.02);

		osc.connect(filter);
		filter.connect(gain);
		gain.connect(ctx.destination);
		osc.start();

		oscillator = osc;
		gainNode = gain;
		filterNode = filter;
		isPlaying = true;
	}

	function stopSound(): void {
		const ctx = getAudioContext();
		if (!ctx || !gainNode || !oscillator) return;

		const now = ctx.currentTime;
		gainNode.gain.linearRampToValueAtTime(0, now + 0.05);

		const osc = oscillator;
		setTimeout(() => {
			osc.stop();
			osc.disconnect();
		}, 60);

		oscillator = null;
		gainNode = null;
		filterNode = null;
		isPlaying = false;
	}

	function updateSound(x: number, y: number): void {
		const ctx = getAudioContext();
		if (!ctx || !oscillator || !filterNode) return;

		const now = ctx.currentTime;
		oscillator.frequency.setTargetAtTime(getFrequency(x), now, 0.01);
		filterNode.frequency.setTargetAtTime(getFilterCutoff(y), now, 0.01);
	}

	// ─── Sync live audio node props when UI state changes ─────────────────────
	$effect(() => {
		if (oscillator) oscillator.type = waveform;
	});
	$effect(() => {
		if (filterNode) filterNode.type = filterType;
	});
	$effect(() => {
		const ctx = getAudioContext();
		if (gainNode && ctx) gainNode.gain.setTargetAtTime(volume * 0.3, ctx.currentTime, 0.01);
	});

	// ─── Cleanup ──────────────────────────────────────────────────────────────
	onDestroy(() => {
		if (oscillator) {
			oscillator.stop();
			oscillator.disconnect();
		}
		audioCtx?.close();
	});

	// ─── XYPad handler ────────────────────────────────────────────────────────
	function handlePadChange(val: { x: number; y: number }): void {
		const x = val.x / 100;
		const y = val.y / 100;
		position = { x, y };
		if (isPlaying) updateSound(x, y);
		else startSound(x, y);
	}

	function formatPadValue(val: { x: number; y: number }): string {
		return `${Math.round(getFrequency(val.x / 100))}Hz, ${Math.round(getFilterCutoff(val.y / 100))}Hz`;
	}

	// ─── Options ──────────────────────────────────────────────────────────────
	const waveformOptions: { value: WaveformType; label: string }[] = [
		{ value: "sine", label: "Sine" },
		{ value: "triangle", label: "Triangle" },
		{ value: "sawtooth", label: "Saw" },
		{ value: "square", label: "Square" },
	];

	const filterOptions: { value: FilterType; label: string }[] = [
		{ value: "allpass", label: "Allpass" },
		{ value: "lowpass", label: "Lowpass" },
		{ value: "highpass", label: "Highpass" },
		{ value: "bandpass", label: "Bandpass" },
	];
</script>

<div class="bg-accent/5 flex w-full min-w-0 flex-col gap-1.5 rounded-xl border p-1.5">
	<!-- XY Pad: X axis = frequency, Y axis = filter cutoff -->
	<XYPad
		value={{ x: position.x * 100, y: position.y * 100 }}
		minX={0}
		maxX={100}
		minY={0}
		maxY={100}
		onValueChange={handlePadChange}
		onValueCommit={stopSound}
		showValueDisplay
		formatValue={formatPadValue}
	/>

	<!-- Waveform selector -->
	<ToggleGroup.Root
		type="single"
		value={waveform}
		onValueChange={(v) => {
			if (v) waveform = v as WaveformType;
		}}
		variant="outline"
		size="sm"
		class="w-full"
	>
		{#each waveformOptions as opt (opt.value)}
			<ToggleGroup.Item value={opt.value} aria-label={opt.label} class="flex-1">
				{#if opt.value === "sine"}
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<title>Sine wave</title>
						<path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0 4 4 6 0" />
					</svg>
				{:else if opt.value === "triangle"}
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<title>Triangle wave</title>
						<path d="M2 12l5-6 5 12 5-12 5 6" />
					</svg>
				{:else if opt.value === "sawtooth"}
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<title>Sawtooth wave</title>
						<path d="M2 18l8-12v12l8-12v12" />
					</svg>
				{:else}
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<title>Square wave</title>
						<path d="M2 18h4V6h6v12h4V6h6" />
					</svg>
				{/if}
			</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>

	<!-- Filter type selector -->
	<ToggleGroup.Root
		type="single"
		value={filterType}
		onValueChange={(v) => {
			if (v) filterType = v as FilterType;
		}}
		variant="outline"
		size="sm"
		class="w-full"
	>
		{#each filterOptions as opt (opt.value)}
			<ToggleGroup.Item value={opt.value} aria-label={opt.label} class="flex-1">
				{opt.label}
			</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>

	<!-- Volume fader -->
	<div class="bg-popover flex items-center gap-3 rounded-lg border p-3">
		<label class="text-muted-foreground text-sm leading-tight font-medium" for="pocket-volume">
			Volume
		</label>
		<Fader
			class="mx-1.5 flex-1"
			orientation="horizontal"
			min={0}
			max={1}
			step={0.01}
			value={volume}
			onValueChange={(v) => (volume = v)}
		/>
		<output class="text-muted-foreground font-mono text-sm">
			{Math.round(volume * 100)}%
		</output>
	</div>
</div>
