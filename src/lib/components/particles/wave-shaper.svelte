<script lang="ts">
	import { onDestroy } from "svelte";
	import { XYPad } from "$lib/components/ui/audio/elements/xypad/index.js";
	import { Fader } from "$lib/components/ui/audio/elements/fader/index.js";
	import { Knob } from "$lib/components/ui/audio/elements/knob/index.js";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";

	// ─── Types ────────────────────────────────────────────────────────────────
	type WaveformType = "sine" | "triangle" | "sawtooth" | "square";

	// ─── Reactive UI state ────────────────────────────────────────────────────
	let waveform = $state<WaveformType>("sine");
	let volume = $state(0.5);
	let drive = $state(1);
	let tone = $state(50);
	let detune = $state(0);
	let mix = $state(50);
	let isPlaying = $state(false);
	let position = $state({ x: 0.5, y: 0.5 });

	// ─── Audio node refs (non-reactive) ───────────────────────────────────────
	let audioCtx: AudioContext | null = null;
	let oscillator1: OscillatorNode | null = null;
	let oscillator2: OscillatorNode | null = null;
	let gainNode: GainNode | null = null;
	let dryGain: GainNode | null = null;
	let wetGain: GainNode | null = null;
	let shaper: WaveShaperNode | null = null;
	let filter: BiquadFilterNode | null = null;

	// ─── Helpers ──────────────────────────────────────────────────────────────
	function getFrequency(x: number): number {
		return 55 * (880 / 55) ** x;
	}

	function getResonance(y: number): number {
		return 0.5 + y * 15;
	}

	function makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
		const samples = 44_100;
		const curve = new Float32Array(samples);
		const deg = Math.PI / 180;
		for (let i = 0; i < samples; i++) {
			const x = (i * 2) / samples - 1;
			curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
		}
		return curve as Float32Array<ArrayBuffer>;
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
		const frequency = getFrequency(x);
		const resonance = getResonance(y);

		const osc1 = ctx.createOscillator();
		const osc2 = ctx.createOscillator();
		const oscGain = ctx.createGain();
		const dryG = ctx.createGain();
		const wetG = ctx.createGain();
		const mainGain = ctx.createGain();
		const wshaper = ctx.createWaveShaper();
		const filt = ctx.createBiquadFilter();

		osc1.type = waveform;
		osc2.type = waveform;
		osc1.frequency.setValueAtTime(frequency, now);
		osc2.frequency.setValueAtTime(frequency, now);
		osc2.detune.setValueAtTime(detune, now);

		wshaper.curve = makeDistortionCurve(drive);
		wshaper.oversample = "4x";

		filt.type = "lowpass";
		filt.frequency.setValueAtTime(500 + tone * 75, now);
		filt.Q.setValueAtTime(resonance, now);

		const dryLevel = (100 - mix) / 100;
		const wetLevel = mix / 100;

		oscGain.gain.setValueAtTime(0.5, now);
		dryG.gain.setValueAtTime(dryLevel, now);
		wetG.gain.setValueAtTime(wetLevel, now);
		mainGain.gain.setValueAtTime(0, now);
		mainGain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.02);

		osc1.connect(oscGain);
		osc2.connect(oscGain);
		oscGain.connect(dryG);
		oscGain.connect(wshaper);
		wshaper.connect(wetG);
		dryG.connect(filt);
		wetG.connect(filt);
		filt.connect(mainGain);
		mainGain.connect(ctx.destination);

		osc1.start();
		osc2.start();

		oscillator1 = osc1;
		oscillator2 = osc2;
		gainNode = mainGain;
		dryGain = dryG;
		wetGain = wetG;
		shaper = wshaper;
		filter = filt;
		isPlaying = true;
	}

	function stopSound(): void {
		const ctx = getAudioContext();
		if (!ctx || !gainNode || !oscillator1 || !oscillator2) return;

		const now = ctx.currentTime;
		gainNode.gain.linearRampToValueAtTime(0, now + 0.05);

		const osc1 = oscillator1;
		const osc2 = oscillator2;
		setTimeout(() => {
			osc1.stop();
			osc1.disconnect();
			osc2.stop();
			osc2.disconnect();
		}, 60);

		oscillator1 = null;
		oscillator2 = null;
		gainNode = null;
		dryGain = null;
		wetGain = null;
		shaper = null;
		filter = null;
		isPlaying = false;
	}

	function updateSound(x: number, y: number): void {
		const ctx = getAudioContext();
		if (!ctx || !oscillator1 || !oscillator2 || !filter) return;

		const now = ctx.currentTime;
		const frequency = getFrequency(x);
		const resonance = getResonance(y);

		oscillator1.frequency.setTargetAtTime(frequency, now, 0.01);
		oscillator2.frequency.setTargetAtTime(frequency, now, 0.01);
		filter.Q.setTargetAtTime(resonance, now, 0.01);
	}

	// ─── Sync live audio node props when UI state changes ─────────────────────
	$effect(() => {
		if (oscillator1) oscillator1.type = waveform;
		if (oscillator2) oscillator2.type = waveform;
	});

	$effect(() => {
		const ctx = getAudioContext();
		if (oscillator2 && ctx) oscillator2.detune.setTargetAtTime(detune, ctx.currentTime, 0.01);
	});

	$effect(() => {
		if (shaper) shaper.curve = makeDistortionCurve(drive);
	});

	$effect(() => {
		const ctx = getAudioContext();
		if (filter && ctx) filter.frequency.setTargetAtTime(500 + tone * 75, ctx.currentTime, 0.01);
	});

	$effect(() => {
		const ctx = getAudioContext();
		if (dryGain && wetGain && ctx) {
			const now = ctx.currentTime;
			dryGain.gain.setTargetAtTime((100 - mix) / 100, now, 0.01);
			wetGain.gain.setTargetAtTime(mix / 100, now, 0.01);
		}
	});

	$effect(() => {
		const ctx = getAudioContext();
		if (gainNode && ctx) gainNode.gain.setTargetAtTime(volume * 0.4, ctx.currentTime, 0.01);
	});

	// ─── Cleanup ──────────────────────────────────────────────────────────────
	onDestroy(() => {
		if (oscillator1) {
			oscillator1.stop();
			oscillator1.disconnect();
		}
		if (oscillator2) {
			oscillator2.stop();
			oscillator2.disconnect();
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
		const freq = Math.round(getFrequency(val.x / 100));
		const res = getResonance(val.y / 100).toFixed(1);
		return `${freq}Hz, Q: ${res}`;
	}

	// ─── Waveform options ─────────────────────────────────────────────────────
	const waveformOptions: { value: WaveformType; label: string }[] = [
		{ value: "sine", label: "Sine wave" },
		{ value: "triangle", label: "Triangle wave" },
		{ value: "sawtooth", label: "Sawtooth wave" },
		{ value: "square", label: "Square wave" },
	];
</script>

<div class="bg-card flex w-full min-w-0 flex-col gap-1.5 rounded-xl border p-1.5">
	<!-- XY Pad: X = frequency, Y = filter resonance -->
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

	<!-- Knobs: Drive · Tone · Detune · Mix -->
	<div class="bg-popover grid grid-cols-4 gap-3 rounded-lg border p-1.5">
		<div class="flex flex-col items-center gap-1.5">
			<label class="text-muted-foreground text-xs font-medium" for="drive">Drive</label>
			<Knob
				size="sm"
				min={0}
				max={100}
				step={1}
				bind:value={drive}
				onValueChange={(v) => (drive = v)}
			/>
			<output class="text-muted-foreground font-mono text-xs">{drive}</output>
		</div>

		<div class="flex flex-col items-center gap-1.5">
			<label class="text-muted-foreground text-xs font-medium" for="tone">Tone</label>
			<Knob
				size="sm"
				min={0}
				max={100}
				step={1}
				bind:value={tone}
				onValueChange={(v) => (tone = v)}
			/>
			<output class="text-muted-foreground font-mono text-xs">{tone}</output>
		</div>

		<div class="flex flex-col items-center gap-1.5">
			<label class="text-muted-foreground text-xs font-medium" for="detune">Detune</label>
			<Knob
				size="sm"
				min={-50}
				max={50}
				step={1}
				bind:value={detune}
				onValueChange={(v) => (detune = v)}
			/>
			<output class="text-muted-foreground font-mono text-xs">
				{detune > 0 ? "+" : ""}{detune}
			</output>
		</div>

		<div class="flex flex-col items-center gap-1.5">
			<label class="text-muted-foreground text-xs font-medium" for="mix">Mix</label>
			<Knob
				size="sm"
				min={0}
				max={100}
				step={1}
				bind:value={mix}
				onValueChange={(v) => (mix = v)}
			/>
			<output class="text-muted-foreground font-mono text-xs">{mix}%</output>
		</div>
	</div>

	<!-- Volume fader -->
	<div class="bg-popover flex items-center gap-3 rounded-lg border p-3">
		<label class="text-muted-foreground text-sm leading-tight font-medium" for="volume">
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
