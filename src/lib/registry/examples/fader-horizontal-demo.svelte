<script lang="ts">
	import { Fader } from "$registry/ui/audio/elements/fader/index.js";

	let value = $state(50);
</script>

<div class="flex w-full max-w-sm flex-col items-center gap-4">
	<Fader orientation="horizontal" {value} onValueChange={(e) => (value = e)} />
	<span class="text-muted-foreground text-sm tabular-nums">{value}</span>
</div>
