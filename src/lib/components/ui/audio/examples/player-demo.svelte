<script lang="ts">
	import * as AudioPlayer from "$lib/components/ui/audio/player/index.js";
</script>

<AudioPlayer.Root>
	<AudioPlayer.ControlBar>
		<AudioPlayer.Play />
		<AudioPlayer.SeekBar />
		<AudioPlayer.TimeDisplay />
		<AudioPlayer.Volume />
	</AudioPlayer.ControlBar>
</AudioPlayer.Root>
