<script lang="ts">
	import { Fader } from "$lib/components/ui/audio/elements/fader/index.js";
	import { getAudioContext } from "$lib/audio-store.svelte.js";

	const audioStore = getAudioContext();

	function handleVolumeChange(value: number) {
		audioStore.setVolume({ volume: value / 100 });
	}
</script>

<div class="flex h-48 items-center justify-center gap-4">
	<Fader label="Vol" value={audioStore.volume * 100} onValueChange={handleVolumeChange} />
</div>
