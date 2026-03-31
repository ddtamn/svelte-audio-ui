<script lang="ts">
	import {
		SortableList,
		SortableItem,
		SortableDragHandle,
	} from "$lib/components/ui/audio/elements/sortable-list/index.js";

	type Item = { id: string; title: string; description: string };

	let items = $state<Item[]>([
		{ id: "1", title: "Item 1", description: "Description for item 1" },
		{ id: "2", title: "Item 2", description: "Description for item 2" },
		{ id: "3", title: "Item 3", description: "Description for item 3" },
	]);
</script>

<div class="w-full">
	<SortableList bind:items onDrop={(v) => (items = v)}>
		{#snippet item(row)}
			<SortableItem class="border-border bg-muted/40 rounded-md border p-3 text-sm">
				<SortableDragHandle />
				<div class="flex flex-col">
					<span class="font-semibold">{row.title}</span>
					<span class="text-muted-foreground text-xs">
						{row.description}
					</span>
				</div>
			</SortableItem>
		{/snippet}
	</SortableList>
</div>
