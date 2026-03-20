<script lang="ts">
	import { audioStore } from "$registry/lib/audio-store.svelte";

	function formatDuration(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}
</script>

<div class="rounded-md border p-4">
	<p class="font-bold">Track: {audioStore.currentTrack?.title ?? "None"}</p>
	<p class="text-sm text-gray-500">
		Time: {formatDuration(audioStore.currentTime)} / {formatDuration(audioStore.duration)}
	</p>
	<p class="mb-2">Status: {audioStore.isPlaying ? "▶ Playing" : "⏸ Paused"}</p>

	<div class="flex gap-2">
		<button onclick={() => audioStore.previous()}>◀ Prev</button>
		<button onclick={() => audioStore.togglePlay()}>
			{audioStore.isPlaying ? "⏸" : "▶"}
		</button>
		<button onclick={() => audioStore.next()}>Next ▶</button>
	</div>
</div>

<!-- <script lang="ts">
	import SortableListDemo from "$registry/examples/sortable-list-demo.svelte";
</script>

<div class="flex min-h-[80vh] items-center justify-center p-4">
	<div class="w-full max-w-sm">
		<SortableListDemo></SortableListDemo>
	</div>
</div> -->

<!-- <script>
	import { dragHandleZone, dragHandle } from "svelte-dnd-action"; // ← not dndzone
	import { flip } from "svelte/animate";

	let items = $state([
		{ id: 1, text: "Item 1" },
		{ id: 2, text: "Item 2" },
		{ id: 3, text: "Item 3" },
		{ id: 4, text: "Item 4" },
		{ id: 5, text: "Item 5" },
		{ id: 6, text: "Item 6" },
	]);

	const flipDurationMs = 200;

	const handleConsider = (evt) => {
		items = evt.detail.items;
	};
	const handleFinalize = (evt) => {
		items = evt.detail.items;
	};
</script>

<section
	use:dragHandleZone={{ items, flipDurationMs, dropTargetStyle: {} }}
	onconsider={handleConsider}
	onfinalize={handleFinalize}
>
	{#each items as item (item.id)}
		<div class="item" animate:flip={{ duration: flipDurationMs }}>
			<div use:dragHandle class="handle" aria-label="drag handle for {item.text}"></div>
			<span>{item.text}</span>
		</div>
	{/each}
</section>

<style>
	.item {
		position: relative;
		height: 1.5em;
		width: 10em;
		text-align: center;
		border: 1px solid black;
		margin: 0.2em;
		padding: 0.3em;
	}
	.handle {
		cursor: grab;
		position: absolute;
		right: 0;
		width: 1em;
		height: 0.5em;
		background-color: grey;
	}
</style> -->
