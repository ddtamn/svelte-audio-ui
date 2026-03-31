<script lang="ts">
	import { Fader } from "$lib/components/ui/audio/elements/fader/index.js";

	let value = $state(50);
</script>

<div class="flex h-48 items-center justify-center gap-8">
	<Fader thumbMarks={1} {value} onValueChange={(e) => (value = e)} label="1" />
	<Fader thumbMarks={3} onValueChange={(e) => (value = e)} {value} label="3" />
	<Fader thumbMarks={5} onValueChange={(e) => (value = e)} {value} label="5" />
</div>
