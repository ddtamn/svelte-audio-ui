<script lang="ts" generics="Item extends { id: string | number }">
	import { flip } from "svelte/animate";
	import { cn } from "$registry/lib/utils.js";
	import type { Snippet } from "svelte";
	import { dragHandleZone } from "svelte-dnd-action";

	interface Props {
		class?: string;
		items: Item[];
		item: Snippet<[Item]>;
		onDrop?: (items: Item[]) => void;
	}

	let { class: className, items = $bindable(), onDrop, item }: Props = $props();
	const flipDurationMs = 150;

	function handleConsider(e: CustomEvent<{ items: Item[] }>) {
		items = e.detail.items;
	}

	function handleFinalize(e: CustomEvent<{ items: Item[] }>) {
		items = e.detail.items;
		onDrop?.(items);
	}
</script>

<div
	use:dragHandleZone={{ items, flipDurationMs, dropTargetStyle: {} }}
	onconsider={handleConsider}
	onfinalize={handleFinalize}
	class={cn("flex flex-col gap-1", className)}
>
	<!-- todo: adding shadow placeholder element using SHADOW_ITEM_MARKER_PROPERTY_NAME -->
	{#each items as entry (entry.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			{@render item(entry)}
		</div>
	{/each}
</div>
