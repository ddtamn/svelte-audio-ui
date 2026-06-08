<script lang="ts">
	import { Radio } from "@lucide/svelte";
	import { getAudioContext } from "$lib/audio-store.svelte.js";
	import { formatDuration } from "$lib/html-audio.js";
	import { cn } from "$lib/utils.js";

	const audioStore = getAudioContext();

	interface Props {
		remaining?: boolean;
		class?: string;
		[key: string]: unknown;
	}

	let { remaining = false, class: className = "", ...rest }: Props = $props();

	const isLiveStream = $derived(audioStore.isLive);

	const formattedCurrentTime = $derived(formatDuration(audioStore.currentTime));
	const formattedRemaining = $derived(
		formatDuration(audioStore.duration - audioStore.currentTime)
	);

	const timeValue = $derived(() => {
		if (isLiveStream && remaining) return "LIVE";
		if (isLiveStream && !remaining) return formattedCurrentTime;
		return remaining ? formattedRemaining : formattedCurrentTime;
	});

	const showLiveIcon = $derived(isLiveStream && remaining);
</script>

<time
	class={cn(
		"min-w-12 shrink-0 px-1.5 text-left font-mono text-sm tabular-nums",
		remaining && "text-right",
		showLiveIcon && "flex items-center gap-1 text-xs text-red-500",
		className
	)}
	data-live={isLiveStream ? "true" : undefined}
	data-remaining={remaining ? "true" : undefined}
	data-slot="audio-time-display"
	{...rest}
>
	{#if showLiveIcon}
		<Radio class="size-3 animate-pulse" />
	{/if}
	{timeValue()}
</time>
