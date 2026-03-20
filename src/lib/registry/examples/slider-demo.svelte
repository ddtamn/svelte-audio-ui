<script lang="ts">
	import { Slider } from "$registry/ui/audio/elements/slider/index.js";

	let value = $state([25]);
</script>

<div class="w-full max-w-sm">
	<Slider {value} onValueChange={(v) => (value = v)} max={100} step={1} bufferValue={55} />
</div>
