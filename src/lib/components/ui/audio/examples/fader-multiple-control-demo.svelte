<script lang="ts">
	import { Fader } from "$lib/components/ui/audio/elements/fader/index.js";

	let channels = $state([
		{ label: "Kick", value: 75 },
		{ label: "Snare", value: 60 },
		{ label: "Bass", value: 80 },
		{ label: "Vox", value: 90 },
		{ label: "FX", value: 40 },
	]);
</script>

<div class="flex h-56 items-end justify-center gap-4">
	{#each channels as channel (channel.label)}
		<div class="flex flex-col items-center gap-2">
			<Fader
				value={channel.value}
				label={channel.label}
				size="sm"
				onValueChange={(e) => (channel.value = e)}
			/>
			<span class="text-muted-foreground text-xs tabular-nums">{channel.value}</span>
		</div>
	{/each}
</div>
