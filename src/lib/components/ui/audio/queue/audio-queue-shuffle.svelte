<script lang="ts">
	import { Shuffle } from "@lucide/svelte";
	import { audioStore } from "$lib/audio-store.svelte.js";
	import { cn } from "$lib/utils.js";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Button } from "$lib/components/ui/button";

	interface Props {
		class?: string;
		size?: "icon" | "default" | "sm" | "lg" | "icon-sm" | "icon-lg";
		variant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link";
		[key: string]: unknown;
	}

	let {
		class: className = "",
		size = "icon" as Props["size"],
		variant = "outline" as Props["variant"],
		...rest
	}: Props = $props();

	function handleToggle() {
		if (audioStore.shuffleEnabled) {
			audioStore.unshuffle();
		} else {
			audioStore.shuffle();
		}
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				{variant}
				{size}
				aria-label="Shuffle"
				data-slot="audio-queue-shuffle"
				data-state={audioStore.shuffleEnabled ? "on" : "off"}
				class={cn(
					audioStore.shuffleEnabled && "bg-accent! text-accent-foreground!",
					className
				)}
				onclick={handleToggle}
				{...rest}
			>
				<Shuffle class="size-4" />
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content side="top" sideOffset={4}>
		Shuffle {audioStore.shuffleEnabled ? "on" : "off"}
	</Tooltip.Content>
</Tooltip.Root>
