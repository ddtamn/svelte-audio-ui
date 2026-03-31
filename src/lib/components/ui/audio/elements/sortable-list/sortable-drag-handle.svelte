<script lang="ts">
	import { GripVertical } from "@lucide/svelte";
	import { cn } from "$lib/utils.js";
	import { buttonVariants } from "$lib/components/ui/button";
	import { dragHandle } from "svelte-dnd-action";

	type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | undefined;
	type ButtonVariant =
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| undefined;

	interface Props {
		class?: string;
		size?: ButtonSize;
		variant?: ButtonVariant;
		[key: string]: unknown;
	}

	let {
		class: className = "",
		size = "icon-sm" as ButtonSize,
		variant = "ghost" as ButtonVariant,
		...rest
	}: Props = $props();
</script>

<div
	use:dragHandle
	class={cn(
		buttonVariants({ size, variant }),
		"cursor-grab touch-none active:cursor-grabbing",
		className
	)}
	aria-label="Drag to reorder"
	data-slot="sortable-drag-handle"
	role="button"
	tabindex="0"
	{...rest}
>
	<GripVertical class="size-4" />
</div>
