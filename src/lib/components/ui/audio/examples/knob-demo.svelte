<script lang="ts">
	import { Knob } from "$lib/components/ui/audio/elements/knob/index.js";

	let value = $state(50);
</script>

<div class="flex flex-col items-center gap-4">
	<Knob {value} onValueChange={(v) => (value = v)} />
	<span class="text-muted-foreground text-xs tabular-nums">{value}</span>
</div>
