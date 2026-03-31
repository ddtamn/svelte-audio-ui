<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils.js";

	type Variant = "compact" | "stacked";

	interface Props {
		variant?: Variant;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let { variant = "compact", class: className = "", children, ...rest }: Props = $props();

	const variantClass = $derived(variant === "stacked" ? "flex-col" : "flex-row");
</script>

<div
	class={cn(
		"group/audio-control-bar flex w-full min-w-0 items-center gap-1.5",
		variantClass,
		className
	)}
	data-slot="audio-control-bar"
	data-variant={variant}
	{...rest}
>
	{@render children?.()}
</div>
