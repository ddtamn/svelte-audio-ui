<script lang="ts" generics="TItem extends { id: string | number }">
	import { dndzone, type DndEvent } from "svelte-dnd-action";
	import { setContext } from "svelte";
	import type { Snippet } from "svelte";
	import { cn } from "$registry/lib/utils.js";
	import { flip } from "svelte/animate";

	interface Props {
		items: TItem[];
		onChange: (items: TItem[]) => void;
		/** Snippet receives (item, index). Wrap content in <SortableItem> for styling. */
		item: Snippet<[TItem, number]>;
		class?: string;
	}

	let { items, onChange, item: itemSnippet, class: className = "" }: Props = $props();

	// svelte-dnd-action works with a LOCAL copy that it can mutate during drag.
	// We sync it from `items` whenever the source changes, but NOT during active drag.
	let localItems: TItem[] = $state([...items]);
	let isDragging = $state(false);

	$effect(() => {
		if (!isDragging) localItems = [...items];
	});

	// ── Drag handle context ─────────────────────────────────────────────────────
	// dragDisabled=true by default; SortableDragHandle flips it to false on press.
	let dragDisabled = $state(true);

	setContext("sortable-dnd", {
		enableDrag() {
			dragDisabled = false;
		},
		disableDrag() {
			dragDisabled = true;
		},
		get isDragging() {
			return isDragging;
		},
	});

	// ── dndzone event handlers ──────────────────────────────────────────────────
	function handleConsider(e: CustomEvent<DndEvent<TItem>>) {
		isDragging = true;
		localItems = e.detail.items;
	}

	function handleFinalize(e: CustomEvent<DndEvent<TItem>>) {
		isDragging = false;
		dragDisabled = true;
		localItems = e.detail.items;
		// Strip the internal dnd metadata (_isGhost, etc.) before calling back
		const clean = e.detail.items.map(({ ...rest }) => rest as TItem);
		onChange(clean);
	}
</script>

<!--
  The <ul> IS the drop zone.
  flipDurationMs drives the smooth reorder animation.
  dragDisabled=true by default so only the grip handle can start a drag.
-->
<ul
	class={cn("flex list-none flex-col p-0", className)}
	role="listbox"
	use:dndzone={{ items: localItems, dragDisabled, flipDurationMs: 150 }}
	onconsider={handleConsider}
	onfinalize={handleFinalize}
>
	{#each localItems as listItem, index (listItem.id)}
		<li animate:flip={{ duration: 150 }} class="flex flex-1 list-none">
			{@render itemSnippet(listItem, index)}
		</li>
	{/each}
</ul>
