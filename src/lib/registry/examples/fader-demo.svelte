<script lang="ts">
	import { Fader } from "$registry/ui/audio/elements/fader/index.js";
	let value = $state(50);
</script>

<div class="h-48">
	<Fader {value} onValueChange={(e) => (value = e)} />
</div>
