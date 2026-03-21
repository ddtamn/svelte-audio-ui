<svelte:options runes />

<script lang="ts">
	import { siteConfig } from "$lib/config";
	import Button from "$lib/components/ui/button/button.svelte";
	import PlasmaGrid from "$lib/components/plasma-grid/plasma-grid.svelte";

	import PocketSynth from "$registry/particles/pocket-synth.svelte";
</script>

<div class="relative flex flex-1 flex-col">
	<PlasmaGrid color="#121212" highlightColor="#373636" class="absolute inset-0 h-[400px]" />
	<div
		class="pointer-events-none absolute inset-x-0 top-0 z-10 h-32"
		style="background: linear-gradient(to bottom, #121212, transparent);"
	></div>
	<div
		class="pointer-events-none absolute inset-x-0 top-[calc(400px-8rem)] z-10 h-32"
		style="background: linear-gradient(to top, #121212, transparent);"
	></div>
	<div class="relative z-20 flex flex-1 flex-col">
		<section class="border-grid">
			<div class="container-wrapper">
				<div
					class="container flex flex-col items-center gap-2 py-16 text-center md:py-32 lg:py-40 xl:gap-4"
				>
					<h1
						class="text-primary leading-tighter max-w-4xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter"
					>
						{siteConfig.name}
					</h1>
					<p class="text-foreground max-w-3xl text-base text-balance sm:text-lg">
						{siteConfig.description}
					</p>

					<div
						class="flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none"
					>
						<Button href="/docs/get-started" size="sm">Get Started</Button>
						<Button href="/docs/components/player" size="sm" variant="ghost"
							>View Components</Button
						>
					</div>
				</div>
			</div>
		</section>
		<div class="container-wrapper flex flex-1 flex-col pb-6">
			<div class="theme-container container flex flex-1 flex-col">
				<div class="grid gap-3 lg:grid-cols-2">
					<div class="space-y-3">
						<PocketSynth />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
