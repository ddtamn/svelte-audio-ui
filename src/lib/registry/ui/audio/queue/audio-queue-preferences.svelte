<script lang="ts">
	import { SlidersHorizontal } from "@lucide/svelte";
	import {
		audioStore,
		type InsertMode,
		type RepeatMode,
	} from "$registry/lib/audio-store.svelte.js";
	import { cn } from "$registry/lib/utils.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Button } from "$lib/components/ui/button";

	interface Props {
		class?: string;
		size?: "icon" | "default" | "sm" | "lg" | "icon-sm" | "icon-lg";
		variant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link";
		tooltipLabel?: string;
		[key: string]: unknown;
	}

	let {
		class: className = "",
		size = "icon" as Props["size"],
		variant = "outline" as Props["variant"],
		tooltipLabel = "Queue preferences",
		...rest
	}: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props: dropdownProps })}
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props: tooltipProps })}
						<Button
							{...dropdownProps}
							{...tooltipProps}
							class={cn(className)}
							data-slot="audio-queue-preferences-trigger"
							{size}
							{variant}
							{...rest}
						>
							<SlidersHorizontal class="size-4" />
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content sideOffset={4}>{tooltipLabel}</Tooltip.Content>
			</Tooltip.Root>
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content
		align="end"
		class={cn("w-44", className)}
		data-slot="audio-queue-preferences-content"
	>
		<!-- Repeat mode -->
		<DropdownMenu.Label class="text-muted-foreground">Repeat Mode</DropdownMenu.Label>
		<DropdownMenu.RadioGroup
			value={audioStore.repeatMode}
			onValueChange={(v) => audioStore.setRepeatMode(v as RepeatMode)}
		>
			<DropdownMenu.RadioItem value="none">None</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="one">One</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="all">All</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>

		<DropdownMenu.Separator />

		<!-- Insert mode -->
		<DropdownMenu.Label class="text-muted-foreground">Insert Mode</DropdownMenu.Label>
		<DropdownMenu.RadioGroup
			value={audioStore.insertMode}
			onValueChange={(v) => audioStore.setInsertMode(v as InsertMode)}
		>
			<DropdownMenu.RadioItem value="first">First</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="last">Last</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="after">After Current</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
