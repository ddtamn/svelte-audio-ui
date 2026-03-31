<script lang="ts">
	import * as AudioPlayer from "$lib/components/ui/audio/player/index.js";
	import { AudioPlaybackSpeed } from "$lib/components/ui/audio/playback-speed/index.js";
</script>

<AudioPlayer.Root class="w-max">
	<AudioPlayer.ControlBar>
		<AudioPlayer.ControlGroup>
			<AudioPlayer.SkipBack />
			<AudioPlayer.Play />
			<AudioPlayer.SkipForward />
		</AudioPlayer.ControlGroup>
		<AudioPlayer.ControlGroup>
			<AudioPlayer.TimeDisplay />
			<AudioPlayer.SeekBar />
			<AudioPlayer.TimeDisplay remaining />
		</AudioPlayer.ControlGroup>
		<AudioPlayer.ControlGroup>
			<AudioPlaybackSpeed />
			<AudioPlayer.Volume />
		</AudioPlayer.ControlGroup>
	</AudioPlayer.ControlBar>
</AudioPlayer.Root>
