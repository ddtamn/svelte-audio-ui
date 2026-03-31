<script lang="ts">
	import * as AudioPlayer from "$lib/components/ui/audio/player/index";
	import * as AudioTrack from "$lib/components/ui/audio/track/index.js";
	import * as AudioQueue from "$lib/components/ui/audio/queue/index.js";
</script>

<AudioPlayer.Root class="flex flex-col gap-1.5">
	<AudioTrack.List class="bg-muted/50 h-36 w-full rounded-sm border p-1" />
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
		</AudioPlayer.ControlGroup>
	</AudioPlayer.ControlBar>
</AudioPlayer.Root>
