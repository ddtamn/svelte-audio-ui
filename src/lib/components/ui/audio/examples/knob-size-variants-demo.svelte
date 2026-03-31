<script lang="ts">
	import { Knob, type KnobSize } from "$lib/components/ui/audio/elements/knob/index.js";

	let sizes: { size: KnobSize; value: number }[] = $state([
		{ size: "sm", value: 80 },
		{ size: "default", value: 50 },
		{ size: "lg", value: 60 },
		{ size: "xl", value: 40 },
	]);
</script>

<div class="flex flex-wrap items-end justify-center gap-8">
	{#each sizes as item (item.size)}
		<div class="flex flex-col items-center gap-2">
			<Knob
				size={item.size}
				value={item.value}
				onValueChange={(v) => {
					item.value = v;
				}}
			/>
			<span class="text-muted-foreground text-xs">{item.size}</span>
		</div>
	{/each}
</div>
