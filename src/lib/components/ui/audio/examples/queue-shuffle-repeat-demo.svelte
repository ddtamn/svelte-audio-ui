<script lang="ts">
	import * as AudioPlayer from "$lib/components/ui/audio/player/index.js";
	import * as AudioQueue from "$lib/components/ui/audio/queue/index.js";
</script>

<AudioPlayer.Root class="w-max">
	<AudioPlayer.ControlBar>
		<AudioQueue.Shuffle />
		<AudioQueue.RepeatMode />
		<AudioQueue.Root />
	</AudioPlayer.ControlBar>
</AudioPlayer.Root>
