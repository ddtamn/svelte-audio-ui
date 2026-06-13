<script lang="ts">
	import { onMount, tick } from "svelte";
	import { getAudioContext } from "$lib/audio-store.svelte.js";
	import { cn } from "$lib/utils.js";
	import type WaveSurfer from "wavesurfer.js";

	const audioStore = getAudioContext();

	interface Props {
		/** Pre-decoded peaks array (0–1). If omitted, wavesurfer decodes from URL. */
		peaks?: number[];
		/** Required when passing peaks — total duration in seconds. */
		duration?: number;
		height?: number;
		waveColor?: string;
		progressColor?: string;
		cursorColor?: string;
		barWidth?: number;
		barGap?: number;
		barRadius?: number;
		/** Whether the user can seek by clicking. Default: true */
		interact?: boolean;
		class?: string;
	}

	let {
		peaks,
		duration,
		height = 64,
		waveColor,
		progressColor,
		cursorColor,
		barWidth = 3,
		barGap = 1,
		barRadius = 2,
		interact = true,
		class: className = "",
	}: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let wavesurfer: WaveSurfer | null = null;

	let isReady = $state(false);
	let isLoading = $state(false);

	function getCssVar(name: string, fallback: string): string {
		if (!containerEl) return fallback;
		const val = getComputedStyle(containerEl).getPropertyValue(name).trim();
		return val || fallback;
	}

	function resolvedWaveColor() {
		return waveColor ?? getCssVar("--muted-foreground", "hsl(215,16%,47%)");
	}

	function resolvedProgressColor() {
		return progressColor ?? getCssVar("--primary", "hsl(221,83%,53%)");
	}

	function resolvedCursorColor() {
		return cursorColor ?? getCssVar("--primary", "hsl(221,83%,53%)");
	}

	onMount(() => {
		if (!containerEl) return;

		audioStore.htmlAudio.init();
		const audioEl = audioStore.htmlAudio.getAudioElement();
		if (!audioEl) return;

		// Dynamic import to enable code-splitting of wavesurfer.js
		(async () => {
			const { default: WS } = await import("wavesurfer.js");

			wavesurfer = WS.create({
				container: containerEl,
				media: audioEl,
				height,
				waveColor: resolvedWaveColor(),
				progressColor: resolvedProgressColor(),
				cursorColor: resolvedCursorColor(),
				cursorWidth: 2,
				barWidth,
				barGap,
				barRadius,
				interact,
				normalize: true,
				backend: "MediaElement",
				dragToSeek: true,
			});

			wavesurfer.on("ready", () => {
				isReady = true;
				isLoading = false;
			});

			wavesurfer.on("loading", () => {
				isLoading = true;
			});

			// User clicked / dragged on the waveform → seek via audioStore
			wavesurfer.on("interaction", (newTime: number) => {
				if (!audioStore.isLoading) {
					audioStore.seek(newTime);
				}
			});

			wavesurfer.on("error", () => {
				isLoading = false;
			});

			tick().then(() => {
				if (wavesurfer) loadCurrentTrack();
			});
		})();

		return () => {
			wavesurfer?.destroy();
			wavesurfer = null;
		};
	});

	function loadCurrentTrack() {
		if (!wavesurfer || !audioStore.currentTrack) return;

		// Skip waveform generation for live streams to prevent AbortErrors,
		// UNLESS the user explicitly bypassed this by providing manual peaks data.
		const trackDuration = audioStore.currentTrack.duration ?? audioStore.duration;
		const isLive = audioStore.currentTrack.live || audioStore.htmlAudio.isLive(trackDuration);
		const hasPeaks = peaks && peaks.length > 0;
		if (isLive && !hasPeaks) {
			isReady = true;
			isLoading = false;
			wavesurfer.empty();
			return;
		}

		isReady = false;
		isLoading = true;

		if (hasPeaks) {
			// Fast path: use pre-decoded peaks — no fetch needed
			// Note: WaveSurfer requires duration when passing peaks. If it's missing,
			// we pass a fallback duration (or the Audio elements duration) to avoid crashing.
			const dur = duration || audioStore.currentTrack.duration || audioStore.duration || 1;
			wavesurfer.load(audioStore.currentTrack.url, [peaks], dur).catch((e) => {
				if (e.name !== "AbortError") console.error("WaveSurfer load error (peaks):", e);
			});
		} else {
			// Decode from URL — wavesurfer fetches + decodes for peaks only.
			wavesurfer.load(audioStore.currentTrack.url).catch((e) => {
				if (e.name !== "AbortError") console.error("WaveSurfer load error:", e);
			});
		}
	}

	// Reload waveform when track changes (only when not mid-restore/loading)
	$effect(() => {
		const url = audioStore.currentTrack?.url;
		const loading = audioStore.isLoading;
		if (wavesurfer && url && !loading) loadCurrentTrack();
	});

	// Sync visual options when props change
	$effect(() => {
		if (!wavesurfer) return;
		wavesurfer.setOptions({
			height,
			waveColor: resolvedWaveColor(),
			progressColor: resolvedProgressColor(),
			cursorColor: resolvedCursorColor(),
			barWidth,
			barGap,
			barRadius,
			interact,
		});
	});

	// Sync peaks prop changes (e.g. parent loads peaks async)
	$effect(() => {
		if (!wavesurfer || !audioStore.currentTrack || !peaks?.length) return;
		const dur = duration || audioStore.currentTrack.duration || audioStore.duration || 1;
		wavesurfer.load(audioStore.currentTrack.url, [peaks], dur).catch(() => {});
	});

	// Live stream: disable interaction, but allow showing if peaks are manually provided
	const isLiveStream = $derived(
		audioStore.htmlAudio.isLive(audioStore.duration) || audioStore.currentTrack?.live
	);
	const showLivestreamFallback = $derived(isLiveStream && !(peaks && peaks.length > 0));

	$effect(() => {
		if (!wavesurfer) return;
		wavesurfer.setOptions({ interact: interact && !isLiveStream });
	});
</script>

<div
	class={cn("relative w-full", className)}
	style="height: {height}px;"
	data-slot="audio-waveform"
	data-loading={isLoading ? "true" : undefined}
	data-ready={isReady ? "true" : undefined}
	data-live={isLiveStream ? "true" : undefined}
>
	<div
		bind:this={containerEl}
		class={cn(
			"w-full transition-opacity duration-200",
			isLoading && !isReady ? "opacity-0" : "opacity-100",
			showLivestreamFallback ? "pointer-events-none opacity-0" : ""
		)}
	></div>

	{#if showLivestreamFallback}
		<div
			class="pointer-events-none absolute inset-0 flex items-center justify-between px-1"
			aria-hidden="true"
		>
			{#each { length: 100 } as _, i (i)}
				<span
					class="bg-primary/30 mx-[2px] flex-1 animate-pulse rounded-sm"
					style="height: {75 +
						Math.sin(i * 0.7) * 14 +
						Math.cos(i * 0.3) * 10}%; max-height: 90%; animation-delay: {(i * 80) %
						1200}ms; animation-duration: {1200 + Math.sin(i * 0.5) * 400}ms;"
				></span>
			{/each}
		</div>
	{:else if isLoading && !isReady}
		<div
			class="pointer-events-none absolute inset-0 flex items-center justify-between px-1"
			aria-hidden="true"
		>
			{#each { length: 250 } as _, i (i)}
				<div
					class="bg-muted mx-px flex-1 animate-pulse rounded-sm"
					style="height: {100 +
						Math.sin(i * 0.8) * 15 +
						Math.cos(i * 0.4) * 10}%; max-height: 100%;"
				></div>
			{/each}
		</div>
	{/if}
</div>
