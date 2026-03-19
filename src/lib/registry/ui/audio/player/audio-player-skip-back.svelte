<script lang="ts">
	import { SkipBack } from "@lucide/svelte";
	import { audioStore } from "$registry/lib/audio-store.svelte.js";
	import { cn } from "$registry/lib/utils.js";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Button } from "$lib/components/ui/button";

	interface Props {
		class?: string;
		size?: string;
		variant?: string;
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
			(audioStore.currentQueueIndex === 0 && audioStore.repeatMode !== "all")
	);
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button
				class={cn(className)}
				data-slot="audio-skip-back-button"
				disabled={isDisabled}
				{size}
				{variant}
				{...props}
				onclick={(e) => {
					// @ts-expect-error
					props.onclick?.(e);
					onclick?.(e);
					audioStore.previous();
				}}
			>
				<SkipBack fill="currentColor" />
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content sideOffset={4}>Previous</Tooltip.Content>
</Tooltip.Root>
