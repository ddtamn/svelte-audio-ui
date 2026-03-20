<script lang="ts">
	import { Repeat, Repeat1 } from "@lucide/svelte";
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
		<Button
			type="button"
			aria-label="Repeat mode"
			data-slot="audio-repeat-mode-trigger"
			data-state={isPressed ? "on" : "off"}
			class={cn(isPressed && "bg-accent! text-accent-foreground!", className)}
			onclick={() => audioStore.changeRepeatMode()}
			{size}
			{variant}
			{...rest}
		>
			<Icon class="size-4" />
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content side="top" sideOffset={4}>
		{tooltipText()}
	</Tooltip.Content>
</Tooltip.Root>
