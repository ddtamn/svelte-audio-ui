<script lang="ts">
	import { Shuffle } from "@lucide/svelte";
	import { audioStore } from "$registry/lib/audio-store.svelte.js";
	import { cn } from "$registry/lib/utils.js";
	import * as Tooltip from "$lib/components/ui/tooltip";

	interface Props {
		class?: string;
		[key: string]: unknown;
	}

	let { class: className = "", ...rest }: Props = $props();

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
		<button
			type="button"
			role="switch"
			aria-checked={audioStore.shuffleEnabled}
			aria-label="Shuffle"
			data-slot="audio-queue-shuffle"
			data-state={audioStore.shuffleEnabled ? "on" : "off"}
			class={cn(
				"inline-flex h-8 w-8 items-center justify-center rounded-md text-sm",
				"border-input bg-background border transition-colors",
				"hover:bg-accent hover:text-accent-foreground",
				"focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
				audioStore.shuffleEnabled && "bg-accent! text-accent-foreground!",
				className
			)}
			onclick={handleToggle}
			{...rest}
		>
			<Shuffle class="size-4" />
		</button>
	</Tooltip.Trigger>
	<Tooltip.Content side="top" sideOffset={4}>
		Shuffle {audioStore.shuffleEnabled ? "on" : "off"}
	</Tooltip.Content>
</Tooltip.Root>
