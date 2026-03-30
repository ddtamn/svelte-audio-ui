<script lang="ts">
	import { Loader2, Pause, Play } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { audioStore } from "$registry/lib/audio-store.svelte.js";
	import { cn } from "$registry/lib/utils.js";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Button, type ButtonSize, type ButtonVariant } from "$lib/components/ui/button";

	interface Props {
		class?: string;
		size?: ButtonSize;
		variant?: ButtonVariant;
		onclick?: (e: MouseEvent) => void;
		[key: string]: unknown;
	}

	let {
		class: className = "",
		size = "icon",
		variant = "ghost",
		onclick,
		...rest
	}: Props = $props();

	const showSpinner = $derived(audioStore.isLoading || audioStore.isBuffering);
	const isDisabled = $derived(showSpinner || !audioStore.currentTrack);
	const tooltipLabel = $derived(audioStore.isPlaying ? "Pause" : "Play");

	function handleClick(e: MouseEvent) {
		onclick?.(e);
		audioStore.togglePlay();
	}

	// Spacebar shortcut
	onMount(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.code === "Space" && e.target === document.body) {
				e.preventDefault();
				audioStore.togglePlay();
			}
		}
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	});
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button
				aria-label={tooltipLabel}
				class={cn(className)}
				data-slot="audio-play-button"
				disabled={isDisabled}
				{size}
				{variant}
				{...props}
				onclick={(e) => {
					// @ts-expect-error
					props.onclick?.(e);
					handleClick(e);
				}}
			>
				{#if showSpinner}
					<Loader2 class="animate-spin" />
				{:else if audioStore.isPlaying}
					<Pause fill="currentColor" />
				{:else}
					<Play fill="currentColor" />
				{/if}
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content sideOffset={4}>{tooltipLabel}</Tooltip.Content>
</Tooltip.Root>
