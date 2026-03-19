<script lang="ts">
	import * as AudioPlayer from "$registry/ui/audio/player/index.js";
	import { AudioProvider } from "$registry/ui/audio/provider/index.js";
	import { audioStore } from "$registry/lib/audio-store.svelte.js";

	import type { Track } from "$registry/lib/html-audio";

	const tracks: Track[] = [
		{
			id: "1",
			title: "Beautiful Loop",
			artist: "Flavio Concini",
			url: "https://cdn.pixabay.com/audio/2024/10/21/audio_78251ef8e3.mp3",
		},
		{
			id: "2",
			title: "Type",
			artist: "Aliabbas Abasov",
			url: "https://cdn.pixabay.com/audio/2024/02/28/audio_60f7a54400.mp3",
		},
	];
</script>

<div class="flex min-h-[80vh] items-center justify-center p-4">
	<div class="w-full max-w-sm">
		<AudioProvider {tracks}>
			<AudioPlayer.Root>
				<div class="mb-4 flex flex-col items-center justify-center space-y-1 text-center">
					{#if audioStore.isError}
						<div class="rounded bg-red-500/10 px-3 py-2 text-sm text-red-500">
							<span class="font-bold">Error:</span>
							{audioStore.errorMessage}
						</div>
					{/if}

					{#if audioStore.currentTrack}
						<h3 class="text-lg font-semibold">{audioStore.currentTrack.title}</h3>
						<p class="text-muted-foreground text-sm">
							{audioStore.currentTrack.artist}
						</p>
						{#if audioStore.isLoading}
							<p class="mt-1 animate-pulse text-xs text-blue-500">Loading audio...</p>
						{/if}
					{:else}
						<h3 class="text-lg font-semibold">No Track Selected</h3>
					{/if}
				</div>

				<AudioPlayer.ControlBar variant="stacked">
					<AudioPlayer.ControlGroup>
						<AudioPlayer.TimeDisplay />
						<AudioPlayer.SeekBar />
						<AudioPlayer.TimeDisplay remaining />
					</AudioPlayer.ControlGroup>
					<AudioPlayer.ControlGroup>
						<AudioPlayer.SkipBack />
						<AudioPlayer.Rewind />
						<AudioPlayer.Play />
						<AudioPlayer.FastForward />
						<AudioPlayer.SkipForward />
						<AudioPlayer.Volume />
						<AudioPlayer.PlaybackSpeed />
					</AudioPlayer.ControlGroup>
				</AudioPlayer.ControlBar>
			</AudioPlayer.Root>
		</AudioProvider>
	</div>
</div>
