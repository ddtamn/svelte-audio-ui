<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$registry/lib/utils.js";

	interface Props {
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let { class: className = "", children, ...rest }: Props = $props();
</script>

<div
	class={cn("flex w-full items-center gap-1.5", className)}
	data-slot="audio-control-group"
	{...rest}
>
	{@render children?.()}
</div>
