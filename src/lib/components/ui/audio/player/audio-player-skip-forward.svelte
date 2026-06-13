<script lang="ts">
	import { SkipForward } from "@lucide/svelte";
	import { getAudioContext } from "$lib/audio-store.svelte.js";
	import { cn } from "$lib/utils.js";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Button, type ButtonSize, type ButtonVariant } from "$lib/components/ui/button";

	const audioStore = getAudioContext();

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

	const isDisabled = $derived(
		!audioStore.currentTrack ||
			(audioStore.currentQueueIndex === audioStore.queue.length - 1 &&
				audioStore.repeatMode !== "all")
	);
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button
				aria-label="Next"
				class={cn(className)}
				data-slot="audio-skip-forward-button"
				disabled={isDisabled}
				{size}
				{variant}
				{...props}
				onclick={(e) => {
					// @ts-expect-error
					props.onclick?.(e);
					onclick?.(e);
					audioStore.next();
				}}
			>
				<SkipForward fill="currentColor" />
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content sideOffset={4}>Next</Tooltip.Content>
</Tooltip.Root>
