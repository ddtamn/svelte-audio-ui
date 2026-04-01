<script lang="ts" generics="Item extends { id: string | number }">
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

	// Internal DnD state — completely decoupled from the `items` prop.
	// The prop only flows in; results flow out via onDrop.
	let isDragging = $state(false);
	let dndItems = $state<Item[]>([...items]);

	// Sync prop → dndItems only when the user is NOT mid-drag.
	// During a drag svelte-dnd-action owns the list (shadow items, order),
	// so external reactive updates must not overwrite its internal state.
	$effect(() => {
		if (!isDragging) {
			dndItems = [...items];
		}
	});

	function handleConsider(e: CustomEvent<{ items: Item[] }>) {
		isDragging = true;
		// Only update the internal DnD list — never write back to the prop.
		// Writing to the prop would trigger the parent's $effect.pre which strips
		// the shadow-item markers, causing svelte-dnd-action to lose its DOM
		// reference and crash in keepOriginalElementInDom.
		dndItems = e.detail.items;
	}

	function handleFinalize(e: CustomEvent<{ items: Item[] }>) {
		isDragging = false;
		// Strip any lingering shadow placeholder items before we publish the result.
		const finalItems = e.detail.items.filter(
			(i: any) => !i[SHADOW_ITEM_MARKER_PROPERTY_NAME]
		) as Item[];
		dndItems = finalItems;
		onDrop?.(finalItems);
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
