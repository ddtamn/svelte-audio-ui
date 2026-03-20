<script lang="ts">
	import * as AudioPlayer from "$registry/ui/audio/player/index.js";
	import * as AudioQueue from "$registry/ui/audio/queue/index.js";
</script>

<AudioPlayer.Root class="w-max">
	<AudioPlayer.ControlBar>
		<AudioQueue.Preferences />
		<AudioQueue.Root />
	</AudioPlayer.ControlBar>
</AudioPlayer.Root>
