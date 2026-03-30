<script lang="ts">
	import { Rewind } from "@lucide/svelte";
	import { audioStore } from "$registry/lib/audio-store.svelte.js";
	import { htmlAudio } from "$registry/lib/html-audio.js";
	import { cn } from "$registry/lib/utils.js";
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
	const isDisabled = $derived(
		!audioStore.currentTrack || audioStore.currentTime <= 0 || isLiveStream
	);
	const tooltipLabel = $derived(
		isLiveStream ? "Not available for live streams" : "Skip backward"
	);

	function handleClick(e: MouseEvent) {
		onclick?.(e);
		if (!isLiveStream) {
			audioStore.seek(Math.max(audioStore.currentTime - 10, 0));
		}
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button
				class={cn(className)}
				data-slot="audio-rewind-button"
				disabled={isDisabled}
				{size}
				{variant}
				{...props}
				onclick={(e) => {
					// @ts-expect-error
					props.onclick?.(e);
					handleClick(e);
				}}
			>
				<Rewind fill="currentColor" />
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content sideOffset={4}>{tooltipLabel}</Tooltip.Content>
</Tooltip.Root>
