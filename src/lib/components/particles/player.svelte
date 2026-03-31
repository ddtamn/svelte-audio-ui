<script lang="ts">
	import * as AudioPlayer from "$lib/components/ui/audio/player/index.js";
	import * as AudioQueue from "$lib/components/ui/audio/queue/index.js";
</script>

<AudioPlayer.Root>
	<AudioPlayer.ControlBar variant="stacked">
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
