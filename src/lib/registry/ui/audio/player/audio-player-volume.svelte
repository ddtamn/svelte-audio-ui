<script lang="ts">
	import { Volume, Volume1, Volume2, VolumeX } from "@lucide/svelte";
	import { audioStore } from "$registry/lib/audio-store.svelte.js";
	import { cn } from "$registry/lib/utils.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Button, type ButtonSize, type ButtonVariant } from "$lib/components/ui/button";
	import { Slider } from "$lib/components/ui/slider";

	interface Props {
		class?: string;
		size?: ButtonSize;
		variant?: ButtonVariant;
	}

	let { class: className = "", size = "icon", variant = "outline" }: Props = $props();

	let volumePercent = $derived(Math.round(audioStore.volume * 100));

	const VolumeIcon = $derived.by(() => {
		if (audioStore.isMuted || audioStore.volume === 0) return VolumeX;
		if (volumePercent < 33) return Volume;
		if (volumePercent < 66) return Volume1;
		return Volume2;
	});

	const tooltipLabel = $derived(audioStore.isMuted ? "Muted" : `Volume ${volumePercent}%`);

	function handleSliderChange(v: number) {
		if (v === undefined) return;
		audioStore.setVolume({ volume: v / 100 });
		if (v === 0 && !audioStore.isMuted) audioStore.toggleMute();
		if (v > 0 && audioStore.isMuted) audioStore.toggleMute();
	}
</script>

<DropdownMenu.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props: tooltipProps })}
				<DropdownMenu.Trigger {...tooltipProps}>
					{#snippet child({ props: dropdownProps })}
						<Button
							class={cn("hidden md:flex", className)}
							data-slot="audio-volume-button"
							{size}
							{variant}
							{...dropdownProps}
						>
							<VolumeIcon
								class={cn(audioStore.isMuted && "opacity-40", "text-primary")}
							/>
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content sideOffset={4}>{tooltipLabel}</Tooltip.Content>
	</Tooltip.Root>

	<DropdownMenu.Content class={cn("flex w-48 flex-col gap-1.5 p-1.5", className)}>
		<div class="flex items-center justify-between">
			<span class="text-sm">Volume</span>
			<span class="font-mono text-sm tabular-nums">{volumePercent}%</span>
		</div>
		<div class="flex items-center gap-2">
			<!-- Mute toggle icon -->
			<button
				type="button"
				aria-label={audioStore.isMuted ? "Unmute" : "Mute"}
				class={cn(
					"size-4 shrink-0 cursor-pointer",
					audioStore.isMuted ? "opacity-40" : "opacity-60"
				)}
				onclick={() => audioStore.toggleMute()}
			>
				<VolumeX class="size-4" />
			</button>

			<Slider
				type="single"
				class={className}
				max={100}
				min={0}
				bind:value={volumePercent}
				onValueChange={(e) => {
					handleSliderChange(e);
				}}
			/>

			<Volume2 aria-hidden="true" class="size-4 shrink-0 opacity-60" />
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>
