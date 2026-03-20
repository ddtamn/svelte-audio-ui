<script lang="ts">
	import { XYPad } from "$registry/ui/audio/elements/xypad/index.js";
</script>

<XYPad
	defaultValue={{ x: 50, y: 50 }}
	class="aspect-square"
	formatValue={(val) => `X: ${val.x}, Y: ${val.y}`}
	maxX={100}
	maxY={100}
	minX={0}
	minY={0}
/>
