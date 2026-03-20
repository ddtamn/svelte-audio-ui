<script lang="ts">
	import { XYPad } from "$registry/ui/audio/elements/xypad/index.js";
</script>

<XYPad
	defaultValue={{ x: 30, y: 70 }}
	class="aspect-square"
	formatValue={(v) => {
		const freq = Math.round(20 + (v.x / 100) * 20_000);
		const cutoff = Math.round(200 + (v.y / 100) * 8000);
		return `${freq}Hz, ${cutoff}Hz`;
	}}
/>
