<script lang="ts">
	import * as AudioPlayer from "$lib/components/ui/audio/player/index.js";
	import {
		AudioQueue,
		AudioQueueRepeatMode,
		AudioQueueShuffle,
	} from "$lib/components/ui/audio/queue/index.js";
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
			<AudioQueueShuffle />
			<AudioQueueRepeatMode />
			<AudioPlayer.Volume />
			<AudioQueue />
		</AudioPlayer.ControlGroup>
	</AudioPlayer.ControlBar>
</AudioPlayer.Root>
