<script lang="ts">
	import { Knob } from "$registry/ui/audio/elements/knob/index.js";

	let channels = $state([
		{ label: "Vol", value: 80 },
		{ label: "Pan", value: 50 },
		{ label: "EQ Lo", value: 60 },
		{ label: "EQ Hi", value: 40 },
		{ label: "Reverb", value: 25 },
		{ label: "Delay", value: 35 },
	]);
</script>

<div class="flex flex-wrap items-center justify-center gap-6">
	{#each channels as channel (channel.label)}
		<div class="flex flex-col items-center gap-1">
			<Knob
				label={channel.label}
				value={channel.value}
				onValueChange={(v) => (channel.value = v)}
			/>
			<span class="text-muted-foreground text-xs tabular-nums">{channel.value}</span>
		</div>
	{/each}
</div>
