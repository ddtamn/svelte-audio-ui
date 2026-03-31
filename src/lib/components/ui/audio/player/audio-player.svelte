<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils.js";

	interface Props {
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let { class: className = "", children, ...rest }: Props = $props();
</script>

<div
	class={cn("bg-card w-full rounded-lg border p-1.5", className)}
	data-slot="audio-player"
	role="presentation"
	{...rest}
>
	{@render children?.()}
</div>
