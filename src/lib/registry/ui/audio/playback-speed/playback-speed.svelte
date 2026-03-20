<script lang="ts">
	import { Gauge } from "@lucide/svelte";
	import { audioStore } from "$registry/lib/audio-store.svelte.js";
	import { htmlAudio } from "$registry/lib/html-audio.js";
	import { cn } from "$registry/lib/utils.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Button } from "$lib/components/ui/button";

	const DEFAULT_SPEEDS = [
		{ value: 0.5, label: "0.5x" },
		{ value: 0.75, label: "0.75x" },
		{ value: 1, label: "1x" },
		{ value: 1.25, label: "1.25x" },
		{ value: 1.5, label: "1.5x" },
		{ value: 2, label: "2x" },
	] as const;

	interface SpeedOption {
		value: number;
		label: string;
	}

	interface Props {
		speeds?: SpeedOption[];
		class?: string;
		size?: string;
		variant?: string;
		[key: string]: unknown;
	}

	let {
		speeds = DEFAULT_SPEEDS as unknown as SpeedOption[],
		class: className = "",
		size = "sm",
		variant = "outline",
		...rest
	}: Props = $props();

	const isLiveStream = $derived(htmlAudio.isLive(audioStore.duration));
	const currentSpeed = $derived(
		speeds.find((s) => s.value === audioStore.playbackRate) ?? speeds[2]
	);
	const tooltipLabel = $derived(
		isLiveStream ? "Not available for live streams" : "Playback speed"
	);
	const isIconSize = $derived(size === "icon");

	function handleSelect(value: string) {
		if (isLiveStream) return;
		audioStore.setPlaybackRate(parseFloat(value));
	}
</script>

<DropdownMenu.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props: tooltipProps })}
				<DropdownMenu.Trigger disabled={isLiveStream} {...tooltipProps}>
					{#snippet child({ props: dropdownProps })}
						{#if isLiveStream}
							<span class="inline-block" {...dropdownProps}>
								<Button
									class={cn(className)}
									data-slot="audio-playback-speed-button"
									disabled
									{size}
									{variant}
									{...rest}
								>
									{#if !isIconSize}<Gauge class="size-4" />{/if}
									<span class="font-mono text-xs">{currentSpeed?.label}</span>
								</Button>
							</span>
						{:else}
							<Button
								class={cn(className)}
								data-slot="audio-playback-speed-button"
								{size}
								{variant}
								{...dropdownProps}
							>
								{#if !isIconSize}<Gauge class="size-4" />{/if}
								<span class="font-mono text-xs">{currentSpeed?.label}</span>
							</Button>
						{/if}
					{/snippet}
				</DropdownMenu.Trigger>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content sideOffset={4}>{tooltipLabel}</Tooltip.Content>
	</Tooltip.Root>

	<DropdownMenu.Content
		align="end"
		class={cn("w-40", className)}
		data-slot="audio-playback-speed-content"
	>
		<DropdownMenu.Label class="text-muted-foreground">Playback Speed</DropdownMenu.Label>
		<DropdownMenu.RadioGroup
			value={String(audioStore.playbackRate)}
			onValueChange={handleSelect}
		>
			{#each speeds as speed (speed.value)}
				<DropdownMenu.RadioItem value={String(speed.value)}>
					{speed.label}
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
