<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import ParticleDisplay from "./particle-display.svelte";
	import { particles } from "$registry/particles";
	const categories = ["All", "Grid", "Player", "Queue", "Sortable", "Synth", "Track"];
</script>

<div class="container w-full">
	<div class="border-grid">
		<div class="container-wrapper">
			<div
				class="container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4"
			>
				<h1
					class="text-primary leading-tighter max-w-4xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter"
				>
					Particles
				</h1>
				<p class="text-foreground max-w-3xl text-base text-balance sm:text-lg">
					Particles are more than just components. They are the building blocks of your
					design system. Click on a category or browse them all.
				</p>

				<div class="mx-auto mt-4 w-full max-w-4xl">
					<div class="flex flex-wrap justify-center gap-2">
						{#each categories as category (category)}
							<Button size="sm" variant="outline">{category}</Button>
						{/each}
					</div>
				</div>
			</div>
			<div class="grid flex-1 items-stretch gap-3 pb-12 lg:grid-cols-2">
				{#each particles as particle (particle.id)}
					{@const Component = particle.component}
					<ParticleDisplay {particle}>
						<Component />
					</ParticleDisplay>
				{/each}
			</div>
		</div>
	</div>
</div>
