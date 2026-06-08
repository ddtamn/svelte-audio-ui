<script lang="ts">
	import { audioStore } from "$lib/audio-store.svelte.js";
	import { cn } from "$lib/utils.js";
	import AudioSeekSlider from "./audio-seek-slider.svelte";

	interface Props {
		class?: string;
	}

	let { class: className = "" }: Props = $props();

	const isLiveStream = $derived(audioStore.isLive);

	const progress = $derived(() => {
		if (isLiveStream) return 100;
		if (!audioStore.duration) return 0;
		return (audioStore.currentTime / audioStore.duration) * 100;
	});

	const bufferedProgress = $derived(() => {
		if (isLiveStream) return 100;
		if (!audioStore.duration) return 0;
		return (audioStore.bufferedTime / audioStore.duration) * 100;
	});

	function seekFromEvent(e: MouseEvent | TouchEvent) {
		if (isLiveStream || !audioStore.duration) return;
		const target = e.currentTarget as HTMLElement;
		const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
		const rect = target.getBoundingClientRect();
		const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
		audioStore.seek(pos * audioStore.duration);
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isLiveStream && e.buttons === 1) seekFromEvent(e);
	}

	function handleTouchStart(e: TouchEvent) {
		if (!isLiveStream) seekFromEvent(e);
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isLiveStream) {
			e.preventDefault();
			seekFromEvent(e);
		}
	}

	function handleValueChange(values: number[]) {
		if (!isLiveStream && values[0] !== undefined && audioStore.duration > 0) {
			audioStore.seek((values[0] / 100) * audioStore.duration);
		}
	}
</script>

<AudioSeekSlider
	class={cn("min-w-20 flex-1", className)}
	disabled={isLiveStream}
	value={progress()}
	bufferValue={bufferedProgress()}
	onValueChange={handleValueChange}
	onMouseMove={handleMouseMove}
	onTouchStart={handleTouchStart}
	onTouchMove={handleTouchMove}
/>
