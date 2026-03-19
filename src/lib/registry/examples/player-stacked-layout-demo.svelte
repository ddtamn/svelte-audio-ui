<script lang="ts">
	import * as AudioPlayer from "$registry/ui/audio/player/index.js";
</script>

<AudioPlayer.Root>
	<AudioPlayer.ControlBar variant="stacked">
		<AudioPlayer.ControlGroup>
			<AudioPlayer.TimeDisplay />
			<AudioPlayer.SeekBar />
			<AudioPlayer.TimeDisplay remaining />
		</AudioPlayer.ControlGroup>
		<AudioPlayer.ControlGroup>
			<AudioPlayer.ControlGroup className="justify-between md:justify-start">
				<AudioPlayer.SkipBack />
				<AudioPlayer.Play />
				<AudioPlayer.SkipForward />
			</AudioPlayer.ControlGroup>
			<AudioPlayer.Volume />
		</AudioPlayer.ControlGroup>
	</AudioPlayer.ControlBar>
</AudioPlayer.Root>
