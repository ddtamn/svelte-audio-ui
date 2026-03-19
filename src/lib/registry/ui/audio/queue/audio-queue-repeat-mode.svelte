<script lang="ts">
	import { Repeat, Repeat1 } from "@lucide/svelte";
	import { audioStore } from "$registry/lib/audio-store.svelte.js";
	import { cn } from "$registry/lib/utils.js";
	import * as Tooltip from "$lib/components/ui/tooltip";

	interface Props {
		class?: string;
		size?: string;
		[key: string]: unknown;
	}

	let { class: className = "", ...rest }: Props = $props();

	const isPressed = $derived(audioStore.repeatMode !== "none");
	const Icon = $derived(audioStore.repeatMode === "one" ? Repeat1 : Repeat);
	const tooltipText = $derived(() => {
		if (audioStore.repeatMode === "one") return "Repeat this track";
		if (audioStore.repeatMode === "all") return "Repeat playlist";
		return "Disable repeat";
	});
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<button
			type="button"
			role="switch"
			aria-checked={isPressed}
			aria-label="Repeat mode"
			data-slot="audio-queue-repeat-mode"
			data-state={isPressed ? "on" : "off"}
			class={cn(
				"inline-flex h-8 w-8 items-center justify-center rounded-md text-sm",
				"border-input bg-background border transition-colors",
				"hover:bg-accent hover:text-accent-foreground",
				"focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
				isPressed && "bg-accent! text-accent-foreground!",
				className
			)}
			onclick={() => audioStore.changeRepeatMode()}
			{...rest}
		>
			<Icon class="size-4" />
		</button>
	</Tooltip.Trigger>
	<Tooltip.Content side="top" sideOffset={4}>
		{tooltipText()}
	</Tooltip.Content>
</Tooltip.Root>
