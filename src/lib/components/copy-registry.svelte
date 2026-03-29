<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { UseClipboard } from "$lib/hooks/use-clipboard.svelte.js";
	import { cn } from "$lib/utils.js";
	import CheckIcon from "@lucide/svelte/icons/check";
	import McpIcon from "./icons/mcp.svelte";
	import * as Kbd from "$lib/components/ui/kbd/index.js";
	import type { ComponentProps } from "svelte";

	let {
		text,
		variant = "ghost",
		class: className,
		...restProps
	}: ComponentProps<typeof Button> & {
		text: string;
	} = $props();

	const clipboard = new UseClipboard();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const rp = $derived(restProps as any);
</script>

<Tooltip.Root disableCloseOnTriggerClick>
	<Tooltip.Trigger
		{...rp}
		class={cn("hover:opacity-100 focus-visible:opacity-100", className)}
		onclick={() => clipboard.copy(text)}
	>
		{#snippet child({ props })}
			<Button {...props} data-slot="copy-button" {variant}>
				<span class="sr-only" data-llm-ignore>Copy</span>
				{#if clipboard.copied}
					<CheckIcon class="size-3.5" />
				{:else}
					<McpIcon class="size-3.5" />
				{/if}
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>
		{#if clipboard.copied}
			Copied
		{:else}
			<Kbd.Group class="flex items-center gap-2.5 ">
				Copy Registry URL
				<Kbd.Root class="">
					<McpIcon class="fill-background" />
				</Kbd.Root>
			</Kbd.Group>
		{/if}
	</Tooltip.Content>
</Tooltip.Root>
