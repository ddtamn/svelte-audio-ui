<script lang="ts">
	import { XYPad } from "$lib/components/ui/audio/elements/xypad/index.js";
</script>

<XYPad
	defaultValue={{ x: 50, y: 50 }}
	showValueDisplay={false}
	maxX={100}
	maxY={100}
	minX={0}
	minY={0}
	class="aspect-square"
/>
