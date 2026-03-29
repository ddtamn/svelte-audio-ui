<script lang="ts">
	import * as AudioTrack from "$registry/ui/audio/track/index.js";
	import { audioStore } from "$registry/lib/audio-store.svelte.js";
</script>

{#if audioStore.queue[0]}
	<AudioTrack.Root trackId={audioStore.queue[0].id} />
{:else}
	<p class="text-muted-foreground text-sm">No tracks in queue.</p>
{/if}
