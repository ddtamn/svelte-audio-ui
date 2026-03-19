<script lang="ts">
	import { getContext } from "svelte";
	import { GripVertical } from "@lucide/svelte";
	import { cn } from "$registry/lib/utils.js";

	interface DndContext {
		enableDrag: () => void;
		disableDrag: () => void;
		isDragging: boolean;
	}

	interface Props {
		class?: string;
	}

	let { class: className = "" }: Props = $props();

	const dnd = getContext<DndContext>("sortable-dnd");

	if (!dnd) {
		throw new Error("SortableDragHandle must be used inside a SortableList");
	}

	function handlePointerDown(e: PointerEvent) {
		// Only primary pointer (left mouse / touch)
		if (e.button !== undefined && e.button !== 0) return;
		e.stopPropagation();
		dnd.enableDrag();
	}

	function handlePointerUp() {
		// If drag wasn't picked up, reset immediately.
		// SortableList resets on finalize; this handles the "press but no drag" case.
		setTimeout(() => dnd.disableDrag(), 0);
	}
</script>

<button
	type="button"
	class={cn(
		"inline-flex h-7 w-7 cursor-grab touch-none items-center justify-center rounded-sm",
		"text-muted-foreground/60 hover:bg-accent hover:text-accent-foreground transition-colors",
		"focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none active:cursor-grabbing",
		className
	)}
	aria-label="Drag to reorder"
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
>
	<GripVertical class="size-4" />
</button>
