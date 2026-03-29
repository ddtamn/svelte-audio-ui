<script lang="ts">
	import type { SVGAttributes } from "svelte/elements";

	let { ...restProps }: SVGAttributes<SVGElement> = $props();
</script>

<svg
	width="256"
	height="256"
	viewBox="0 0 256 256"
	class="size-5"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	{...restProps}
>
	<rect width="256" height="256" fill="none" />
	<path
		d="M28.8334 108.167V137.917"
		stroke="#EB4F27"
		stroke-width="23"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M68.5 68.5V177.583"
		stroke="#EB4F27"
		stroke-width="23"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M108.167 38.75V217.25"
		stroke="#EB4F27"
		stroke-width="23"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M147.833 88.3333V157.75"
		stroke="#EB4F27"
		stroke-width="23"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M187.5 58.5833V187.5"
		stroke="#EB4F27"
		stroke-width="23"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M227.167 108.167V137.917"
		stroke="#EB4F27"
		stroke-width="23"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
