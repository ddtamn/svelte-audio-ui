<script lang="ts">
	import { XYPad } from "$lib/components/ui/audio/elements/xypad/index.js";
</script>

<XYPad
	class="aspect-square"
	defaultValue={{ x: 50, y: 50 }}
	formatValue={(val) => `Freq: ${val.x}%, Res: ${val.y}%`}
/>
