<script lang="ts">
	import { Music, Pause, Play, Radio, X } from "@lucide/svelte";
	import { getAudioContext } from "$lib/audio-store.svelte.js";
	import { formatDuration, type Track } from "$lib/html-audio.js";
	import { cn } from "$lib/utils.js";
	import { SortableDragHandle } from "$lib/components/ui/audio/elements/sortable-list/index.js";

	const audioStore = getAudioContext();

	interface Props {
		track?: Track;
		trackId?: string | number;
		index?: number;
		onclick?: () => void;
		onRemove?: (trackId: string) => void;
		showRemove?: boolean;
		showPlayPause?: boolean;
		showDragHandle?: boolean;
		showCover?: boolean;
		class?: string;
	}

	let {
		track: externalTrack,
		trackId,
		index,
		onclick,
		onRemove,
		showRemove = false,
		showPlayPause = true,
		showDragHandle = false,
		showCover = true,
		class: className = "",
	}: Props = $props();

	// ── Resolve track ───────────────────────────────────────────────────────────
	const resolvedTrack = $derived<Track | undefined>(
		externalTrack ??
			(trackId ? audioStore.queue.find((t) => String(t.id) === String(trackId)) : undefined)
	);

	const isCurrent = $derived(audioStore.currentTrack?.id === resolvedTrack?.id);
	const actualIsPlaying = $derived(audioStore.isPlaying && isCurrent);
	const trackDuration = $derived(
		isCurrent && audioStore.duration > 0 ? audioStore.duration : resolvedTrack?.duration
	);
	const isLiveTrack = $derived(
		resolvedTrack?.live === true ||
			(trackDuration !== undefined &&
				trackDuration !== null &&
				audioStore.htmlAudio.isLive(trackDuration))
	);

	const coverImage = $derived(resolvedTrack?.artwork ?? resolvedTrack?.images?.[0]);

	// ── Handlers ────────────────────────────────────────────────────────────────
	function handleRowClick(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		onclick?.();
	}

	function handlePlayPause(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		if (!resolvedTrack) return;
		if (isCurrent) {
			audioStore.togglePlay();
		} else {
			const idx = audioStore.queue.findIndex((t) => t.id === resolvedTrack.id);
			if (idx >= 0) audioStore.setQueueAndPlay(audioStore.queue, idx);
		}
	}

	function handleRemove(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		if (resolvedTrack?.id) onRemove?.(String(resolvedTrack.id));
	}

	function getPlayTitle() {
		if (!isCurrent) return "Play this track";
		return actualIsPlaying ? "Pause" : "Play";
	}
</script>

{#if resolvedTrack}
	<!--
    Layout mirrors the React Item/ItemMedia/ItemContent/ItemActions pattern but
    inlined as plain divs — no external Item primitive required.
  -->
	<div
		role="button"
		tabindex="0"
		class={cn(
			"flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5",
			"hover:bg-secondary/50 transition-all",
			isCurrent && "bg-secondary/80 ring-border ring-1 backdrop-blur-sm",
			className
		)}
		onclick={handleRowClick}
		onkeydown={(e) => e.key === "Enter" && handleRowClick(e as unknown as MouseEvent)}
	>
		<!-- ── Media (drag handle + cover) ──────────────────────────────────── -->
		<div class="flex shrink-0 items-center gap-2">
			{#if showDragHandle}
				<SortableDragHandle />
			{/if}

			{#if showCover}
				<div class="bg-muted size-8 shrink-0 overflow-hidden rounded-sm">
					{#if coverImage}
						<img
							src={coverImage}
							alt={resolvedTrack.title}
							class="size-full object-cover"
						/>
					{:else}
						<div class="flex size-full items-center justify-center">
							<Music class="text-muted-foreground size-4" />
						</div>
					{/if}
				</div>
			{:else if index !== undefined}
				<span class="text-muted-foreground/60 w-5 text-center text-xs">{index + 1}</span>
			{/if}
		</div>

		<!-- ── Title + artist ────────────────────────────────────────────────── -->
		<div class="min-w-0 flex-1 overflow-hidden">
			<div class="flex items-center gap-1.5">
				<span class="truncate text-sm leading-tight font-medium">
					{resolvedTrack.title ?? "Unknown"}
				</span>
				{#if isLiveTrack}
					<span
						class="bg-destructive/10 text-destructive inline-flex shrink-0 items-center gap-0.5
                   rounded-sm px-1 py-0.5 text-[10px] leading-none font-medium uppercase"
					>
						<Radio class="size-2.5" />
						Live
					</span>
				{/if}
			</div>
			{#if resolvedTrack.artist}
				<p class="text-muted-foreground truncate text-xs leading-tight">
					{resolvedTrack.artist}
				</p>
			{/if}
		</div>

		<!-- ── Duration ───────────────────────────────────────────────────────── -->
		{#if !isLiveTrack && trackDuration !== undefined}
			<span class="text-muted-foreground shrink-0 text-xs tabular-nums">
				{formatDuration(trackDuration)}
			</span>
		{/if}

		<!-- ── Actions ────────────────────────────────────────────────────────── -->
		<div class="flex shrink-0 items-center gap-0.5">
			{#if showRemove && !isCurrent && onRemove}
				<button
					type="button"
					title="Remove"
					class="text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive inline-flex h-6 w-6
                 items-center justify-center rounded-sm transition-colors"
					onclick={handleRemove}
				>
					<X class="size-3.5" />
				</button>
			{/if}

			{#if showPlayPause}
				<button
					type="button"
					title={getPlayTitle()}
					class="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-6 w-6
                 items-center justify-center rounded-sm transition-colors"
					onclick={handlePlayPause}
				>
					{#if actualIsPlaying}
						<Pause class="size-3.5 fill-current" />
					{:else}
						<Play class="size-3.5 fill-current" />
					{/if}
				</button>
			{/if}
		</div>
	</div>
{/if}
