<script lang="ts">
	import { ListMusic, Search, Trash2 } from "@lucide/svelte";
	import { audioStore } from "$lib/audio-store.svelte.js";
	import type { Track } from "$lib/html-audio.js";
	import { cn } from "$lib/utils.js";
	import { AudioTrackList } from "../track/index";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Button } from "$lib/components/ui/button";

	interface Props {
		onTrackSelect?: (index: number) => void;
		searchPlaceholder?: string;
		emptyLabel?: string;
		emptyDescription?: string;
		class?: string;
	}

	let {
		onTrackSelect,
		searchPlaceholder = "Search for a track...",
		emptyLabel = "No tracks found",
		emptyDescription = "Try searching for a different track",
		class: className = "",
	}: Props = $props();

	let dialogOpen = $state(false);
	let searchQuery = $state("");

	const isFiltered = $derived(searchQuery.trim().length > 0);

	// ── Handlers ────────────────────────────────────────────────────────────────

	function handleOpenChange(open: boolean) {
		dialogOpen = open;
		if (!open) searchQuery = "";
	}

	function handleTrackSelect(index: number) {
		// Re-resolve against the full queue in case list is filtered
		const filteredTracks = filterTracks(audioStore.queue, searchQuery);
		const selected = filteredTracks[index];
		if (!selected) return;

		const queueIndex = audioStore.queue.findIndex((t) => t.id === selected.id);
		if (queueIndex < 0) return;

		if (audioStore.currentTrack?.id === selected.id) {
			audioStore.togglePlay();
		} else if (audioStore.queue.length > 0) {
			audioStore.setQueueAndPlay(audioStore.queue, queueIndex);
		}

		onTrackSelect?.(queueIndex);
		dialogOpen = false;
		searchQuery = "";
	}

	function handleTrackRemove(trackId: string) {
		audioStore.removeFromQueue(trackId);
	}

	function handleClear() {
		audioStore.clearQueue();
		dialogOpen = false;
	}

	function filterTracks(tracks: Track[], query: string): Track[] {
		if (!query.trim()) return tracks;
		const q = query.toLowerCase();
		return tracks.filter(
			(t) => t.title?.toLowerCase().includes(q) || t.artist?.toLowerCase().includes(q)
		);
	}
</script>

<Dialog.Root open={dialogOpen} onOpenChange={handleOpenChange}>
	<!-- Trigger button ────────────────────────────────────────────────────────── -->
	<Tooltip.Root>
		<Tooltip.Trigger onclick={() => (dialogOpen = true)}>
			{#snippet child({ props })}
				<Button
					{...props}
					size="icon"
					variant="outline"
					aria-label="Open queue"
					class={cn(className)}
					data-slot="audio-queue-trigger"
				>
					<ListMusic class="size-4" />
				</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content sideOffset={4}>Queue</Tooltip.Content>
	</Tooltip.Root>

	<!-- Dialog ────────────────────────────────────────────────────────────────── -->
	<Dialog.Content
		class="rounded-xl border-none bg-clip-padding p-0 shadow-2xl ring-4 ring-neutral-200/80
           sm:max-w-md dark:bg-neutral-900 dark:ring-neutral-800"
		data-slot="audio-queue"
	>
		<Dialog.Header class="sr-only">
			<Dialog.Title>Audio Queue</Dialog.Title>
			<Dialog.Description>Select a track from the queue to play</Dialog.Description>
		</Dialog.Header>

		<!-- Search input ──────────────────────────────────────────────────────── -->
		<div class="relative border-b border-neutral-100 px-2 py-2 dark:border-neutral-800">
			<Search
				class="text-muted-foreground/60 absolute top-1/2 left-4 size-4 -translate-y-1/2"
			/>
			<input
				type="text"
				placeholder={searchPlaceholder}
				bind:value={searchQuery}
				class="border-input bg-input/50 placeholder:text-muted-foreground/60 focus:ring-ring h-9 w-full rounded-md border py-0
               pr-3 pl-9
               text-sm focus:ring-1 focus:outline-none"
			/>
		</div>

		<!-- Track list ────────────────────────────────────────────────────────── -->
		<div class="max-h-[60vh] min-h-[200px] overflow-hidden px-2 py-2 pb-12">
			<AudioTrackList
				filterQuery={searchQuery}
				sortable={!isFiltered}
				{emptyLabel}
				{emptyDescription}
				onTrackSelect={handleTrackSelect}
				onTrackRemove={handleTrackRemove}
				class="h-full"
			/>
		</div>

		<!-- Footer: clear button ─────────────────────────────────────────────── -->
		<div
			class="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 rounded-b-xl
             border-t border-t-neutral-100 bg-neutral-50 p-1
             dark:border-t-neutral-700 dark:bg-neutral-800"
		>
			<Button
				class="w-full"
				size="sm"
				variant="destructive"
				title="Clear queue"
				onclick={handleClear}
			>
				<Trash2 class="size-4" />
				Clear
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
