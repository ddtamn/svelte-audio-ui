<script lang="ts">
	import { Fader } from "$registry/ui/audio/elements/fader/index.js";

	let value = $state(50);
</script>

<div class="flex h-48 items-center justify-center">
	<Fader thumbMarks={false} {value} onValueChange={(e) => (value = e)} />
</div>
