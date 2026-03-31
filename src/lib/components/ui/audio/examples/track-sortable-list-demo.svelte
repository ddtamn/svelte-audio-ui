<script lang="ts">
	import * as AudioTrack from "$lib/components/ui/audio/track/index.js";
</script>

<AudioTrack.List sortable onTrackSelect={(index) => console.log("selected queue index", index)} />
