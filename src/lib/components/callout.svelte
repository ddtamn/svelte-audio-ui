<script lang="ts">
	import * as Alert from "$lib/components/ui/alert/index.js";
	import { cn } from "$lib/utils.js";
	import type { Component, ComponentProps } from "svelte";

	let {
		children,
		class: className,
		icon: Icon,
		title,
		...restProps
	}: ComponentProps<typeof Alert.Root> & {
		icon?: Component;
	} = $props();
</script>

<Alert.Root
	class={cn("bg-accent/5 text-foreground my-4 w-auto border md:-mx-1", className)}
	{...restProps}
>
	{#if Icon}
		<Icon />
	{/if}
	{#if title}
		<Alert.Title>{title}</Alert.Title>
	{/if}
	<Alert.Description class="text-card-foreground/80">
		{@render children?.()}
	</Alert.Description>
</Alert.Root>
