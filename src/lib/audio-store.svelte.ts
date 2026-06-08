import { createContext } from "svelte";
import { type HtmlAudio, type Track } from "$lib/html-audio.js";

export type RepeatMode = "none" | "one" | "all";
export type InsertMode = "first" | "last" | "after";

// ─── Context ─────────────────────────────────────────────────────────────────

export const [getAudioContext, setAudioContext] = createContext<AudioStore>();

// ─── Helper functions ────────────────────────────────────────────────────────

export function canUseDOM(): boolean {
	return typeof window !== "undefined" && !!window.document?.createElement;
}

type QueueNavigationParams = {
	queue: Track[];
	currentQueueIndex: number;
	shuffleEnabled: boolean;
	repeatMode: RepeatMode;
};

function getRandomShuffleIndex(queueLength: number, currentIndex: number): number {
	if (queueLength === 1) return 0;
	let idx: number;
	do {
		idx = Math.floor(Math.random() * queueLength);
	} while (idx === currentIndex);
	return idx;
}

function calculateQueueIndex(params: QueueNavigationParams & { direction: 1 | -1 }): number {
	const { queue, currentQueueIndex, shuffleEnabled, repeatMode, direction } = params;
	if (queue.length === 0) return -1;
	if (shuffleEnabled) {
		if (queue.length === 1) return repeatMode === "none" ? -1 : 0;
		return getRandomShuffleIndex(queue.length, currentQueueIndex);
	}
	const next = currentQueueIndex + direction;
	if (next >= queue.length) return repeatMode === "all" ? 0 : -1;
	if (next < 0) return repeatMode === "all" ? queue.length - 1 : -1;
	return next;
}

export function calculateNextIndex(params: QueueNavigationParams): number {
	return calculateQueueIndex({ ...params, direction: 1 });
}

export function calculatePreviousIndex(params: QueueNavigationParams): number {
	return calculateQueueIndex({ ...params, direction: -1 });
}

// ─── Store ───────────────────────────────────────────────────────────────────

const DEFAULT_STORAGE_KEY = "audio:ui:store";

export class AudioStore {
	readonly htmlAudio: HtmlAudio;
	private readonly storageKey: string | null;

	// ── Reactive state ──────────────────────────────────────────────────────
	currentTrack: Track | null = $state(null);
	queue: Track[] = $state([]);
	isPlaying = $state(false);
	isLoading = $state(false);
	isBuffering = $state(false);
	volume = $state(1);
	isMuted = $state(false);
	playbackRate = $state(1);
	repeatMode: RepeatMode = $state("none");
	shuffleEnabled = $state(false);
	currentTime = $state(0);
	duration = $state(0);
	progress = $state(0);
	bufferedTime = $state(0);
	insertMode: InsertMode = $state("last");
	isError = $state(false);
	errorMessage: string | null = $state(null);
	currentQueueIndex = $state(-1);

	// ── Derived ─────────────────────────────────────────────────────────────
	get isLive(): boolean {
		return this.htmlAudio.isLive(this.duration);
	}

	constructor(htmlAudio: HtmlAudio, storageKey?: string | null) {
		this.htmlAudio = htmlAudio;
		this.storageKey = storageKey === undefined ? DEFAULT_STORAGE_KEY : storageKey;
		if (canUseDOM() && this.storageKey) this.loadFromStorage();
	}

	// ── Persistence ─────────────────────────────────────────────────────────

	loadFromStorage(): void {
		if (!this.storageKey) return;
		try {
			const raw = localStorage.getItem(this.storageKey);
			if (!raw) return;
			const d = JSON.parse(raw);
			if (d.currentTrack !== undefined) this.currentTrack = d.currentTrack;
			if (d.queue !== undefined) this.queue = d.queue;
			if (d.volume !== undefined) this.volume = d.volume;
			if (d.isMuted !== undefined) this.isMuted = d.isMuted;
			if (d.playbackRate !== undefined) this.playbackRate = d.playbackRate;
			if (d.repeatMode !== undefined) this.repeatMode = d.repeatMode;
			if (d.shuffleEnabled !== undefined) this.shuffleEnabled = d.shuffleEnabled;
			if (d.currentTime !== undefined) this.currentTime = d.currentTime;
			if (d.insertMode !== undefined) this.insertMode = d.insertMode;
			if (d.currentQueueIndex !== undefined) this.currentQueueIndex = d.currentQueueIndex;
			if (this.duration > 0) {
				this.progress = (this.currentTime / this.duration) * 100;
			}
		} catch {
			/* ignore */
		}
	}

	saveToStorage(): void {
		if (!canUseDOM() || !this.storageKey) return;
		try {
			localStorage.setItem(
				this.storageKey,
				JSON.stringify({
					currentTrack: this.currentTrack,
					queue: this.queue,
					volume: this.volume,
					isMuted: this.isMuted,
					playbackRate: this.playbackRate,
					repeatMode: this.repeatMode,
					shuffleEnabled: this.shuffleEnabled,
					currentTime: this.currentTime,
					insertMode: this.insertMode,
					currentQueueIndex: this.currentQueueIndex,
				})
			);
		} catch {
			/* ignore */
		}
	}

	// ── Playback actions ────────────────────────────────────────────────────

	play(): void {
		if (this.isLoading) return;
		this.isPlaying = true;
		this.htmlAudio.play().catch(() => {});
	}

	pause(): void {
		this.isPlaying = false;
		this.htmlAudio.pause();
	}

	togglePlay(): void {
		if (this.isLoading) return;
		if (this.isPlaying) {
			this.pause();
		} else {
			this.play();
		}
	}

	seek(time: number): void {
		const valid = this.duration > 0 ? Math.max(0, Math.min(time, this.duration)) : time;
		this.currentTime = valid;
		this.progress = this.duration > 0 ? (valid / this.duration) * 100 : 0;
	}

	next(): void {
		const idx = calculateNextIndex({
			queue: this.queue,
			currentQueueIndex: this.currentQueueIndex,
			shuffleEnabled: this.shuffleEnabled,
			repeatMode: this.repeatMode,
		});
		const track = this.queue[idx];
		if (idx === -1 || !track) {
			this.isLoading = false;
			this.isPlaying = false;
			this.isBuffering = false;
			return;
		}
		this.loadAndPlayTrack(track, idx);
	}

	previous(): void {
		if (this.currentTime > 3 && !this.shuffleEnabled) {
			this.currentTime = 0;
			this.progress = 0;
			return;
		}
		const idx = calculatePreviousIndex({
			queue: this.queue,
			currentQueueIndex: this.currentQueueIndex,
			shuffleEnabled: this.shuffleEnabled,
			repeatMode: this.repeatMode,
		});
		const track = this.queue[idx];
		if (idx === -1 || !track) {
			this.isLoading = false;
			this.isPlaying = false;
			this.isBuffering = false;
			return;
		}
		this.loadAndPlayTrack(track, idx);
	}

	setQueueAndPlay(songs: Track[], startIndex: number): void {
		const target = songs[startIndex];
		if (!target) {
			this.clearQueue();
			this.isPlaying = false;
			this.isLoading = false;
			this.currentTrack = null;
			this.currentQueueIndex = -1;
			return;
		}
		this.setQueue(songs, startIndex);
		this.loadAndPlayTrack(target, startIndex);
	}

	handleTrackEnd(): void {
		this.next();
	}

	// ── Queue actions ───────────────────────────────────────────────────────

	setQueue(tracks: Track[], startIndex = 0): void {
		const current = tracks[startIndex] ?? null;
		this.queue = tracks;
		this.currentQueueIndex = current ? startIndex : -1;
		this.currentTrack = current;
	}

	getCurrentQueueIndex(): number {
		return this.currentQueueIndex;
	}

	addToQueue(track: Track, mode: InsertMode = "last"): void {
		if (!this.currentTrack) {
			this.currentTrack = track;
			this.currentQueueIndex = 0;
			this.queue = [track];
			return;
		}
		switch (mode) {
			case "first":
				this.queue = [track, ...this.queue];
				this.currentQueueIndex++;
				break;
			case "after":
				this.queue = [
					...this.queue.slice(0, this.currentQueueIndex + 1),
					track,
					...this.queue.slice(this.currentQueueIndex + 1),
				];
				break;
			default:
				this.queue = [...this.queue, track];
		}
	}

	removeFromQueue(trackId: string): void {
		const idx = this.queue.findIndex((s) => s.id === trackId);
		if (idx === -1) return;
		this.queue = this.queue.filter((s) => s.id !== trackId);
		if (idx < this.currentQueueIndex) this.currentQueueIndex--;
	}

	clearQueue(): void {
		this.queue = [];
	}

	moveInQueue(fromIndex: number, toIndex: number): void {
		const q = [...this.queue];
		const [item] = q.splice(fromIndex, 1);
		if (!item) return;
		q.splice(toIndex, 0, item);
		this.queue = q;
	}

	addTracksToEndOfQueue(tracks: Track[]): void {
		if (!tracks?.length) return;
		const ids = new Set(this.queue.map((s) => s.id));
		const newTracks = tracks.filter((t) => !ids.has(t.id));
		if (newTracks.length) this.queue = [...this.queue, ...newTracks];
	}

	// ── Control actions ─────────────────────────────────────────────────────

	setVolume(params: { volume: number }): void {
		this.volume = params.volume;
		this.isMuted = params.volume === 0;
	}

	toggleMute(): void {
		this.isMuted = !this.isMuted;
	}

	setPlaybackRate(rate: number): void {
		if (this.duration && this.htmlAudio.isLive(this.duration)) return;
		this.playbackRate = Math.max(0.25, Math.min(2, rate));
	}

	changeRepeatMode(): void {
		const modes: RepeatMode[] = ["none", "one", "all"];
		const i = modes.indexOf(this.repeatMode);
		this.repeatMode = modes[(i + 1) % modes.length] as RepeatMode;
	}

	setRepeatMode(mode: RepeatMode): void {
		this.repeatMode = mode;
	}
	setInsertMode(mode: InsertMode): void {
		this.insertMode = mode;
	}

	shuffle(): void {
		if (!this.queue.length || this.queue.length < 2 || !this.currentTrack) return;
		const rest = this.queue.filter((_, i) => i !== this.currentQueueIndex);
		const shuffled = [...rest];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
		}
		this.queue = [this.currentTrack, ...shuffled];
		this.currentQueueIndex = 0;
		this.shuffleEnabled = true;
	}

	unshuffle(): void {
		this.shuffleEnabled = false;
	}

	// ── State actions ───────────────────────────────────────────────────────

	setCurrentTrack(track: Track | null): void {
		if (!track) {
			this.currentTrack = null;
			this.currentQueueIndex = -1;
			this.isPlaying = false;
			this.currentTime = 0;
			this.duration = 0;
			this.queue = [];
			this.isLoading = false;
			this.isError = false;
			this.errorMessage = null;
			return;
		}
		if (this.currentTrack?.id === track.id) return;
		this.currentTrack = track;
		this.queue = [track];
		this.currentQueueIndex = 0;
		this.isLoading = true;
		this.isPlaying = false;
		this.currentTime = 0;
		this.duration = 0;
		this.isError = false;
		this.errorMessage = null;
		this.loadAndPlayTrack(track, 0);
	}

	/** Called by AudioProvider to sync audio element time into state. */
	syncTime(currentTime: number, duration: number): void {
		this.currentTime = currentTime;
		this.duration = duration;
		this.progress = duration > 0 ? (currentTime / duration) * 100 : 0;
	}

	setError(message: string | null): void {
		this.isError = !!message;
		this.errorMessage = message;
		this.isLoading = false;
		this.isPlaying = false;
	}

	/**
	 * Sets state to signal the provider to load and play a track.
	 * The actual audio loading is handled by AudioProvider via $effect.
	 */
	loadAndPlayTrack(track: Track, queueIndex: number): void {
		const isLiveStream =
			track.live === true ||
			(track.duration !== undefined && this.htmlAudio.isLive(track.duration));

		this.currentTrack = track;
		this.currentQueueIndex = queueIndex;
		this.isError = false;
		this.errorMessage = null;

		if (isLiveStream && this.playbackRate !== 1) this.playbackRate = 1;

		// Signal provider: set isPlaying=true to trigger load+play effect
		this.isLoading = false;
		this.isBuffering = false;
		this.isPlaying = true;
	}
}
