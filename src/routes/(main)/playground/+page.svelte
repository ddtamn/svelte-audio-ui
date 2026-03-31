<script lang="ts">
	import Waveform from "$registry/ui/audio/elements/waveform/waveform.svelte";
	import Wave from "$registry/ui/audio/elements/wave/wave.svelte";
	import * as AudioPlayer from "$registry/ui/audio/player/index.js";
	import * as AudioQueue from "$registry/ui/audio/queue/index.js";

	// const data = Array.from({ length: 500 }, () => Math.random());
</script>

<div class="container h-full flex-col items-center justify-center *:flex">
	<AudioPlayer.Root>
		<AudioPlayer.ControlBar variant="stacked">
			<AudioPlayer.ControlGroup class="p-2">
				<Waveform />
			</AudioPlayer.ControlGroup>
			<AudioPlayer.ControlGroup>
				<AudioPlayer.TimeDisplay />
				<AudioPlayer.SeekBar />
				<AudioPlayer.TimeDisplay remaining />
			</AudioPlayer.ControlGroup>
			<AudioPlayer.ControlGroup>
				<AudioPlayer.ControlGroup>
					<AudioPlayer.SkipBack />
					<AudioPlayer.Play />
					<AudioPlayer.SkipForward />
				</AudioPlayer.ControlGroup>
				<AudioQueue.Shuffle />
				<AudioQueue.RepeatMode />
				<AudioPlayer.Volume />
				<AudioQueue.Root />
			</AudioPlayer.ControlGroup>
		</AudioPlayer.ControlBar>
	</AudioPlayer.Root>

	<!-- <Wave class="h-16 gap-0.5" /> -->
</div>
