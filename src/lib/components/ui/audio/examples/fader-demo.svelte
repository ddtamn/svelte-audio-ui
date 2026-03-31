<script lang="ts">
	import { Fader } from "$lib/components/ui/audio/elements/fader/index.js";
	let value = $state(50);
</script>

<div class="h-48">
	<Fader {value} onValueChange={(e) => (value = e)} />
</div>
