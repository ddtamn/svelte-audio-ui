<script lang="ts">
	import { onMount, untrack } from "svelte";
	import type { Snippet } from "svelte";
	import { HtmlAudio, type Track } from "$lib/html-audio.js";
	import { AudioStore, calculateNextIndex, setAudioContext } from "$lib/audio-store.svelte.js";

	interface Props {
		tracks?: Track[];
		storageKey?: string | null;
		children: Snippet;
	}

	let { tracks = [], storageKey, children }: Props = $props();

	// ─── Create instances & set context ───────────────────────────────────────
	const htmlAudio = new HtmlAudio();
	const audioStore = new AudioStore(htmlAudio, storageKey);
	setAudioContext(audioStore);

	// ─── Constants ─────────────────────────────────────────────────────────────
	const MAX_ERROR_RETRIES = 3;
	const ERROR_RETRY_DELAY = 1000;
	const THROTTLE_INTERVAL = 100;
	const MIN_UPDATE_THRESHOLD = 0.5;

	// ─── Non-reactive refs (no $state — mutations must not trigger re-renders) ──
	let preloadAudio: HTMLAudioElement | null = null;
	let errorRetryCount = 0;
	let lastSeekTime = 0;
	let lastUpdateTime = 0;
	let prevTrackId: string | number | undefined = undefined;
	let isRestoring = false;
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	// ─── Sync tracks prop → store ───────────────────────────────────────────────
	$effect(() => {
		const t = tracks;
		if (!t || t.length === 0) return;
		const q = untrack(() => audioStore.queue);
		const cqi = untrack(() => audioStore.currentQueueIndex);
		const changed =
			q.length === 0 ||
			q.length !== t.length ||
			q.some((track, i) => track.id !== t[i]?.id);
		if (changed) {
			audioStore.queue = [...t];
			if (!untrack(() => audioStore.currentTrack)) audioStore.currentTrack = t[0] ?? null;
			if (cqi === -1) audioStore.currentQueueIndex = 0;
		}
	});

	// ─── Helpers ────────────────────────────────────────────────────────────────
	function forceTimeUpdate() {
		const audio = htmlAudio.getAudioElement();
		if (!audio) return;
		audioStore.syncTime(audio.currentTime, audio.duration || 0);
		lastUpdateTime = Date.now();
	}

	function throttledTimeUpdate() {
		const now = Date.now();
		if (now - lastUpdateTime < THROTTLE_INTERVAL) return;
		lastUpdateTime = now;
		const audio = htmlAudio.getAudioElement();
		if (!audio) return;
		if (Math.abs(audioStore.currentTime - audio.currentTime) > MIN_UPDATE_THRESHOLD) {
			audioStore.syncTime(audio.currentTime, audio.duration || 0);
		}
	}

	function preloadTrack(song: Track) {
		if (!preloadAudio || preloadAudio.src === song.url) return;
		try {
			preloadAudio.src = song.url;
			preloadAudio.preload = "auto";
			preloadAudio.load();
		} catch {
			if (preloadAudio) preloadAudio.src = "";
		}
	}

	function preloadNextTrack() {
		if (!preloadAudio) return;
		const nextIdx = calculateNextIndex({
			queue: audioStore.queue,
			currentQueueIndex: audioStore.currentQueueIndex,
			shuffleEnabled: audioStore.shuffleEnabled,
			repeatMode: audioStore.repeatMode,
		});
		if (nextIdx === -1 || nextIdx >= audioStore.queue.length) return;
		const next = audioStore.queue[nextIdx];
		if (!next || next.id === audioStore.currentTrack?.id) return;
		preloadTrack(next);
	}

	async function retryPlayback(audio: HTMLAudioElement): Promise<boolean> {
		if (errorRetryCount >= MAX_ERROR_RETRIES) return false;
		errorRetryCount++;
		const delay = 2 ** (errorRetryCount - 1) * ERROR_RETRY_DELAY;
		await new Promise((r) => setTimeout(r, delay));
		if (typeof navigator !== "undefined" && !navigator.onLine) return false;
		try {
			const currentTime = audio.currentTime;
			const wasPlaying = !audio.paused;
			if (audioStore.currentTrack) {
				await htmlAudio.load({ url: audioStore.currentTrack.url, startTime: currentTime });
				if (wasPlaying) await htmlAudio.play();
			}
			return true;
		} catch {
			return false;
		}
	}

	// ─── Main setup (event listeners on HTMLAudioElement) ──────────────────────
	onMount(() => {
		htmlAudio.init();

		preloadAudio = new Audio();
		preloadAudio.muted = true;
		preloadAudio.preload = "none";

		const audio = htmlAudio.getAudioElement();
		if (!audio) return;

		const ctrl = new AbortController();
		const { signal } = ctrl;

		// ── Event handlers ────────────────────────────────────────────────────────

		const handlePlay = () => {
			errorRetryCount = 0;
			htmlAudio.setPlaybackRate(audioStore.playbackRate);
			audioStore.isPlaying = true;
			audioStore.isLoading = false;
			audioStore.isBuffering = false;
			forceTimeUpdate();
			requestAnimationFrame(forceTimeUpdate);
			setTimeout(forceTimeUpdate, 50);
			preloadNextTrack();
		};

		const handlePause = () => {
			forceTimeUpdate();
			audioStore.isPlaying = false;
			audioStore.isBuffering = false;
		};

		const handleError = async (e: Event) => {
			let message = "Unknown audio error";
			let recoverable = false;
			if (audio.error) {
				const { code } = audio.error;
				if (code === MediaError.MEDIA_ERR_ABORTED) {
					message = "Playback cancelled";
					recoverable = true;
				} else if (code === MediaError.MEDIA_ERR_NETWORK) {
					message = "Network error";
					recoverable = true;
				} else if (code === MediaError.MEDIA_ERR_DECODE) {
					message = "Audio file decoding error";
					recoverable = false;
				} else if (code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
					message = "File/network loading error (Code 4)";
					recoverable = true;
				} else {
					message = `Unknown error (${code})`;
					recoverable = true;
				}
			} else if (e instanceof ErrorEvent) {
				message = e.message;
				recoverable = true;
			}

			if (recoverable && errorRetryCount < MAX_ERROR_RETRIES) {
				if (await retryPlayback(audio)) return;
			}

			audioStore.isPlaying = false;
			audioStore.isLoading = false;
			audioStore.isBuffering = false;
			audioStore.isError = true;
			audioStore.errorMessage =
				recoverable && errorRetryCount >= MAX_ERROR_RETRIES
					? `Failed after ${MAX_ERROR_RETRIES} attempts: ${message}`
					: message;
		};

		const handleEnded = async () => {
			audioStore.isPlaying = false;
			audioStore.isBuffering = false;
			const audioDuration = audio.duration || 0;
			const isLiveStream = htmlAudio.isLive(audioDuration);

			if (audioStore.currentTrack && isLiveStream) {
				audioStore.isError = true;
				audioStore.errorMessage = "Live stream connection lost";
				return;
			}

			if (audioStore.repeatMode === "one" && audioStore.currentTrack) {
				try {
					await htmlAudio.load({
						url: audioStore.currentTrack.url,
						startTime: 0,
						isLiveStream,
					});
					await htmlAudio.play();
					audioStore.currentTime = 0;
					audioStore.progress = 0;
					return;
				} catch {
					/* fall through to next */
				}
			}

			audioStore.handleTrackEnd();
		};

		const handleLoadStart = () => {
			audioStore.isLoading = true;
			audioStore.isBuffering = false;
			audioStore.isError = false;
			audioStore.errorMessage = null;
		};

		const handleCanPlay = () => {
			audioStore.isLoading = false;
			audioStore.isBuffering = false;
			audioStore.duration = audio.duration || 0;
			audioStore.isError = false;
			audioStore.errorMessage = null;
		};

		const handleWaiting = () => {
			audioStore.isBuffering = true;
			audioStore.isLoading = false;
		};
		const handlePlaying = () => {
			audioStore.isLoading = false;
			audioStore.isBuffering = false;
			audioStore.isPlaying = true;
		};
		const handleDuration = () => {
			audioStore.duration = audio.duration || 0;
		};
		const handleVolume = () => {
			audioStore.volume = audio.volume;
			audioStore.isMuted = audio.muted;
		};
		const handleBufferUpdate = (e: Event) => {
			if (e instanceof CustomEvent && e.detail?.bufferedTime !== undefined) {
				audioStore.bufferedTime = e.detail.bufferedTime;
			}
		};

		// ── Register ──────────────────────────────────────────────────────────────
		audio.addEventListener("play", handlePlay, { signal });
		audio.addEventListener("pause", handlePause, { signal });
		audio.addEventListener("playing", handlePlaying, { signal });
		audio.addEventListener("waiting", handleWaiting, { signal });
		audio.addEventListener("loadstart", handleLoadStart, { signal });
		audio.addEventListener("canplay", handleCanPlay, { signal });
		audio.addEventListener("canplaythrough", handleCanPlay, { signal });
		audio.addEventListener("timeupdate", throttledTimeUpdate, { signal });
		audio.addEventListener("durationchange", handleDuration, { signal });
		audio.addEventListener("loadedmetadata", handleDuration, { signal });
		audio.addEventListener("volumechange", handleVolume, { signal });
		audio.addEventListener("ended", handleEnded, { signal });
		audio.addEventListener("error", handleError, { signal });
		htmlAudio.addEventListener("bufferUpdate", handleBufferUpdate);

		// ── Restore persisted state ───────────────────────────────────────────────
		(async () => {
			if (!audioStore.currentTrack || audioStore.currentTime <= 0) return;
			isRestoring = true;
			const track = audioStore.currentTrack;
			const audioDur = audio.duration || audioStore.duration || 0;
			const isLive = htmlAudio.isLive(audioDur);
			const startTime = isLive ? 0 : audioStore.currentTime;
			prevTrackId = track.id; // suppress the track-change effect on restore
			try {
				audioStore.isLoading = true;
				await htmlAudio.load({ url: track.url, startTime, isLiveStream: isLive });
				htmlAudio.setVolume({ volume: audioStore.volume });
				htmlAudio.setMuted(audioStore.isMuted);
				htmlAudio.setPlaybackRate(audioStore.playbackRate);
				audioStore.isLoading = false;
				audioStore.isPlaying = false;
			} catch {
				audioStore.isError = true;
				audioStore.errorMessage = "Error restoring audio state";
				audioStore.isPlaying = false;
				audioStore.isLoading = false;
				audioStore.isBuffering = false;
			} finally {
				isRestoring = false;
			}
		})();

		return () => {
			ctrl.abort();
			htmlAudio.removeEventListener("bufferUpdate", handleBufferUpdate);
			htmlAudio.cleanup();
			if (saveTimeout) {
				clearTimeout(saveTimeout);
				saveTimeout = null;
			}
			if (preloadAudio) {
				preloadAudio.src = "";
				preloadAudio = null;
			}
		};
	});

	// ─── Reactive sync effects ──────────────────────────────────────────────────

	/** Sync playback rate to audio element */
	$effect(() => {
		htmlAudio.setPlaybackRate(audioStore.playbackRate);
	});

	/** Load new track and play when currentTrack changes */
	$effect(() => {
		if (isRestoring) return;
		const track = audioStore.currentTrack;
		const trackId = track?.id;
		if (!track || trackId === prevTrackId) return;
		prevTrackId = trackId;

		const audio = htmlAudio.getAudioElement();
		if (!audio) return;

		htmlAudio
			.load({ url: track.url, startTime: 0, isLiveStream: false })
			.then(() => {
				audioStore.isLoading = false;
				if (audioStore.isPlaying) return htmlAudio.play();
			})
			.catch(() => {
				audioStore.isLoading = false;
				audioStore.setError("Error loading track");
			});
	});

	// Play/pause is now synchronously handled by audioStore.play() and .pause()

	/** Seek when store currentTime is updated by user (not by syncTime) */
	$effect(() => {
		const currentTime = audioStore.currentTime;
		const audio = htmlAudio.getAudioElement();
		if (!audio) return;
		const diff = Math.abs(audio.currentTime - currentTime);
		if (diff > 0.1 && audio.currentTime !== lastSeekTime) {
			lastSeekTime = currentTime;
			htmlAudio.setCurrentTime(currentTime);
		}
	});

	/** Sync volume changes */
	$effect(() => {
		htmlAudio.setVolume({ volume: audioStore.volume });
	});

	/** Sync mute changes */
	$effect(() => {
		htmlAudio.setMuted(audioStore.isMuted);
	});

	/** Reset preload audio when queue changes drastically */
	$effect(() => {
		const qLen = audioStore.queue.length; // track reactively
		if (qLen === 0 && preloadAudio) preloadAudio.src = "";
	});

	/** Persist state to localStorage (debounced; currentTime excluded from reactivity) */
	$effect(() => {
		void [
			audioStore.currentTrack,
			audioStore.queue.length,
			audioStore.volume,
			audioStore.isMuted,
			audioStore.playbackRate,
			audioStore.repeatMode,
			audioStore.shuffleEnabled,
			audioStore.insertMode,
			audioStore.currentQueueIndex,
		];
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => audioStore.saveToStorage(), 1000);
	});
</script>

{@render children()}
