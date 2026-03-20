<script lang="ts">
	import { Knob } from "$registry/ui/audio/elements/knob/index.js";

	let frequency = $state(2000);
	let resonance = $state(30);
	let mix = $state(50);

	function formatFreq(hz: number) {
		return hz >= 1000 ? `${(hz / 1000).toFixed(1)}k` : `${hz}`;
	}
</script>

<div class="flex flex-wrap items-center justify-center gap-8">
	<div class="flex flex-col items-center gap-2">
		<Knob
			label="Freq"
			value={((frequency - 20) / (20000 - 20)) * 100}
			onValueChange={(v) => (frequency = Math.round(20 + (v / 100) * (20000 - 20)))}
			size="lg"
		/>
		<span class="text-muted-foreground text-xs tabular-nums">{formatFreq(frequency)} Hz</span>
	</div>

	<div class="flex flex-col items-center gap-2">
		<Knob
			label="Res"
			value={resonance}
			onValueChange={(v) => {
				resonance = v;
			}}
			size="lg"
		/>
		<span class="text-muted-foreground text-xs tabular-nums">{resonance}%</span>
	</div>

	<div class="flex flex-col items-center gap-2">
		<Knob
			label="Mix"
			value={mix}
			onValueChange={(v) => {
				mix = v;
			}}
			size="lg"
		/>
		<span class="text-muted-foreground text-xs tabular-nums">{mix}%</span>
	</div>
</div>
