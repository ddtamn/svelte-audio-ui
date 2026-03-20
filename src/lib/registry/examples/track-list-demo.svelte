<script lang="ts">
	import * as AudioTrack from "$registry/ui/audio/track/index.js";
</script>

<div class="w-full max-w-sm">
	<AudioTrack.List
		onTrackSelect={(index) => console.log("selected queue index", index)}
	/>
</div>
