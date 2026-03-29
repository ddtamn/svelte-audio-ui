<script lang="ts">
	import * as AudioTrack from "$registry/ui/audio/track/index.js";
</script>

<AudioTrack.List onTrackSelect={(index) => console.log("selected queue index", index)} />
