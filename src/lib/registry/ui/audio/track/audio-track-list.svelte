<script lang="ts">
	import { ListMusic } from "@lucide/svelte";
	import { audioStore } from "$registry/lib/audio-store.svelte.js";
	import type { Track } from "$registry/lib/html-audio.js";
	import { cn } from "$registry/lib/utils.js";
	import AudioTrack from "./audio-track.svelte";
	import { SortableList } from "$registry/ui/audio/elements/sortable-list/index.js";

	type Variant = "default" | "grid";

	interface Props {
		/** When omitted, reads from audioStore.queue (store mode). */
		tracks?: Track[];
		onTrackSelect?: (index: number, track?: Track) => void;
		onTrackRemove?: (trackId: string) => void;
		sortable?: boolean;
		showCover?: boolean;
		variant?: Variant;
		emptyLabel?: string;
		emptyDescription?: string;
		filterQuery?: string;
		filterFn?: (track: Track) => boolean;
		class?: string;
	}

	let {
		tracks: externalTracks,
		onTrackSelect,
		onTrackRemove,
		sortable = false,
		showCover = true,
		variant = "default",
		emptyLabel = "No tracks found",
		emptyDescription = "Try adding some tracks",
		filterQuery = "",
		filterFn,
		class: className = "",
	}: Props = $props();

	const isExternalTracks = $derived(!!externalTracks);

	// ── Filtered tracks ─────────────────────────────────────────────────────────
	const displayTracks = $derived<Track[]>(() => {
		let base: Track[] = externalTracks ?? audioStore.queue;

		if (filterFn) {
			base = base.filter(filterFn);
		} else if (filterQuery.trim()) {
			const q = filterQuery.toLowerCase();
			base = base.filter(
				(t) => t.title?.toLowerCase().includes(q) || t.artist?.toLowerCase().includes(q)
			);
		}
		return base;
	});

	const isFiltered = $derived(filterQuery.trim().length > 0 || !!filterFn);

	// ── Variant classes ─────────────────────────────────────────────────────────
	const listClass = $derived(
		variant === "grid" ? "grid grid-cols-1 gap-2 xl:grid-cols-2" : "space-y-0.5"
	);

	// ── Track click handler ─────────────────────────────────────────────────────
	function handleTrackClick(track: Track, index: number) {
		if (isExternalTracks) {
			onTrackSelect?.(index, track);
			return;
		}
		// Store mode: find real queue index (filter may shift indices)
		const queueIndex = audioStore.queue.findIndex((t) => t.id === track.id);
		if (queueIndex >= 0) {
			if (audioStore.currentTrack?.id === track.id) {
				audioStore.togglePlay();
			} else {
				audioStore.setQueueAndPlay(audioStore.queue, queueIndex);
			}
			onTrackSelect?.(queueIndex, audioStore.queue[queueIndex]);
		} else {
			onTrackSelect?.(index, track);
		}
	}

	// ── Reorder handler (sortable, store mode only) ────────────────────────────
	function handleReorder(reordered: { id: string | number }[]) {
		if (isFiltered || isExternalTracks) return;

		const reorderedTracks = reordered
			.map((r) => displayTracks().find((t) => String(t.id) === String(r.id)))
			.filter((t): t is Track => t !== undefined);

		const newCurrentIndex =
			audioStore.currentTrack?.id !== undefined
				? reorderedTracks.findIndex((t) => t.id === audioStore.currentTrack!.id)
				: -1;

		const finalIndex =
			newCurrentIndex >= 0
				? newCurrentIndex
				: Math.max(0, Math.min(audioStore.currentQueueIndex, reorderedTracks.length - 1));

		audioStore.setQueue(reorderedTracks, finalIndex);
	}
</script>

{#if displayTracks().length === 0}
	<!-- Empty state ──────────────────────────────────────────────────────────── -->
	<div
		class={cn(
			"mx-auto flex size-full flex-col items-center justify-center gap-3",
			"bg-muted/30 rounded-lg border p-8 text-center",
			className
		)}
	>
		<div class="bg-muted flex size-10 items-center justify-center rounded-full">
			<ListMusic class="text-muted-foreground size-5" />
		</div>
		<div class="space-y-1">
			<p class="text-sm font-medium">{emptyLabel}</p>
			<p class="text-muted-foreground text-xs/relaxed">{emptyDescription}</p>
		</div>
	</div>
{:else if sortable && !isFiltered}
	<!-- Sortable list ─────────────────────────────────────────────────────────── -->
	<div class={cn("no-scrollbar w-full overflow-y-auto", className)}>
		<SortableList
			items={displayTracks()
				.filter((t) => t.id !== undefined)
				.map((t) => ({ id: String(t.id), _track: t }))}
			onDrop={handleReorder}
			class={variant === "grid" ? "grid grid-cols-1 gap-2 xl:grid-cols-2" : "gap-0.5"}
		>
			{#snippet item(row)}
				{@const track = row._track as Track}
				{@const idx = displayTracks().findIndex((t) => t.id === track.id)}
				<AudioTrack
					{track}
					index={idx >= 0 ? idx : undefined}
					{showCover}
					showDragHandle={true}
					showRemove={!!onTrackRemove}
					onRemove={onTrackRemove}
					onclick={() => handleTrackClick(track, idx >= 0 ? idx : 0)}
				/>
			{/snippet}
		</SortableList>
	</div>
{:else}
	<!-- Plain list ────────────────────────────────────────────────────────────── -->
	<div class={cn("no-scrollbar w-full overflow-y-auto", className)}>
		<div class={cn("w-full", listClass)}>
			{#each displayTracks() as track, idx (track.id)}
				<AudioTrack
					{track}
					index={idx}
					{showCover}
					showDragHandle={false}
					showRemove={!!onTrackRemove}
					onRemove={onTrackRemove}
					onclick={() => handleTrackClick(track, idx)}
				/>
			{/each}
		</div>
	</div>
{/if}
