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
		size?: string;
		variant?: string;
		tooltipLabel?: string;
		[key: string]: unknown;
	}

	let {
		class: className = "",
		size = "icon",
		variant = "outline",
		tooltipLabel = "Queue preferences",
		...rest
	}: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					class={cn(className)}
					data-slot="audio-queue-preferences-trigger"
					{size}
					{variant}
					{...rest}
				>
					<SlidersHorizontal class="size-4" />
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content sideOffset={4}>{tooltipLabel}</Tooltip.Content>
		</Tooltip.Root>
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
