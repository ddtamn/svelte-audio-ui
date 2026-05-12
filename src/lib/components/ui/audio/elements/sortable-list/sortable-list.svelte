<script lang="ts" generics="Item extends { id: string | number }">
	import { tick } from "svelte";
	import { flip } from "svelte/animate";
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";
	import { dragHandleZone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";

	interface Props {
		class?: string;
		items: Item[];
		item: Snippet<[Item]>;
		onDrop?: (items: Item[]) => void;
	}

	let { class: className, items, onDrop, item }: Props = $props();

	const flipDurationMs = 150;

	let isDragging = $state(false);
	let dndItems = $state<Item[]>([...items]);

	$effect(() => {
		if (isDragging) return;
		const needsSync =
			dndItems.length !== items.length ||
			dndItems.some((item, i) => item.id !== items[i]?.id);
		if (needsSync) {
			dndItems = [...items];
		}
	});

	function handleConsider(e: CustomEvent<{ items: Item[] }>) {
		isDragging = true;
		dndItems = e.detail.items;
	}

	async function handleFinalize(e: CustomEvent<{ items: Item[] }>) {
		const finalItems = e.detail.items.filter(
			(i: any) => !i[SHADOW_ITEM_MARKER_PROPERTY_NAME]
		) as Item[];
		dndItems = finalItems;
		onDrop?.(finalItems);

		await tick();
		isDragging = false;
	}
</script>

<div
	use:dragHandleZone={{ items: dndItems, flipDurationMs, dropTargetStyle: {} }}
	onconsider={handleConsider}
	onfinalize={handleFinalize}
	class={cn("flex flex-col gap-1", className)}
>
	{#each dndItems as entry (entry.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			{@render item(entry)}
		</div>
	{/each}
</div>
