<script lang="ts">
	import * as AudioTrack from "$lib/components/ui/audio/track/index.js";
	import { getAudioContext } from "$lib/audio-store.svelte.js";

	const audioStore = getAudioContext();
</script>

{#if audioStore.queue[0]}
	<AudioTrack.Root trackId={audioStore.queue[0].id} />
{:else}
	<p class="text-muted-foreground text-sm">No tracks in queue.</p>
{/if}
