<script lang="ts">
	import { Shuffle } from "@lucide/svelte";
	import { audioStore } from "$registry/lib/audio-store.svelte.js";
	import { cn } from "$registry/lib/utils.js";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Button } from "$lib/components/ui/button";

	interface Props {
		class?: string;
		size?: string;
		variant?: string;
		[key: string]: unknown;
	}

	let { class: className = "", size = "icon", variant = "outline", ...rest }: Props = $props();

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
		<Button
			{variant}
			{size}
			aria-label="Shuffle"
			data-slot="audio-queue-shuffle"
			data-state={audioStore.shuffleEnabled ? "on" : "off"}
			class={cn(audioStore.shuffleEnabled && "bg-accent! text-accent-foreground!", className)}
			onclick={handleToggle}
			{...rest}
		>
			<Shuffle class="size-4" />
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content side="top" sideOffset={4}>
		Shuffle {audioStore.shuffleEnabled ? "on" : "off"}
	</Tooltip.Content>
</Tooltip.Root>
