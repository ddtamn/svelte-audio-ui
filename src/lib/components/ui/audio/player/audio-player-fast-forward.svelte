<script lang="ts">
	import { FastForward } from "@lucide/svelte";
	import { audioStore } from "$lib/audio-store.svelte.js";
	import { htmlAudio } from "$lib/html-audio.js";
	import { cn } from "$lib/utils.js";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Button, type ButtonSize, type ButtonVariant } from "$lib/components/ui/button";

	interface Props {
		class?: string;
		size?: ButtonSize;
		variant?: ButtonVariant;
		onclick?: (e: MouseEvent) => void;
		[key: string]: unknown;
	}

	let {
		class: className = "",
		size = "icon",
		variant = "ghost",
		onclick,
		...rest
	}: Props = $props();

	const isLiveStream = $derived(htmlAudio.isLive(audioStore.duration));
	const isDisabled = $derived(() => {
		if (!audioStore.currentTrack || isLiveStream) return true;
		return audioStore.duration > 0 && audioStore.currentTime >= audioStore.duration;
	});
	const tooltipLabel = $derived(isLiveStream ? "Not available for live streams" : "Skip forward");

	function handleClick(e: MouseEvent) {
		onclick?.(e);
		if (!isLiveStream) {
			audioStore.seek(Math.min(audioStore.currentTime + 10, audioStore.duration));
		}
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button
				class={cn(className)}
				data-slot="audio-fast-forward-button"
				disabled={isDisabled()}
				{size}
				{variant}
				{...props}
				onclick={(e) => {
					// @ts-expect-error
					props.onclick?.(e);
					handleClick(e);
				}}
			>
				<FastForward fill="currentColor" />
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content sideOffset={4}>{tooltipLabel}</Tooltip.Content>
</Tooltip.Root>
