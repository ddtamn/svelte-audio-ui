<script lang="ts">
	import { cn } from "$registry/lib/utils.js";
	import type { Snippet } from "svelte";

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className = "", children }: Props = $props();
</script>

<div class={cn("flex items-center gap-2", className)}>
	{@render children?.()}
</div>
