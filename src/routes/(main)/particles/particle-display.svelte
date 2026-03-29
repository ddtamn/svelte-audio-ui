<script lang="ts">
	import { InfoIcon } from "@lucide/svelte";
	import CopyRegistry from "$lib/components/copy-registry.svelte";
	import * as Sheet from "$lib/components/ui/sheet/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import PmAddComp from "$lib/components/pm-add-comp.svelte";
	import Source from "$lib/components/source.svelte";

	let { children, particle } = $props();

	// Load all particle sources as raw strings
	const rawSources = import.meta.glob("/src/lib/registry/particles/*.svelte", {
		query: "?raw",
		import: "default",
		eager: true,
	}) as Record<string, string>;

	let ComponentSource = $derived(
		rawSources[`/src/lib/registry/particles/${particle.id.replace("particle-", "")}.svelte`] ||
			""
	);
</script>

<div class="bg-muted/50 relative flex min-w-0 flex-col rounded-xl border">
	<div
		class="bg-background -m-px flex min-w-0 flex-1 flex-col flex-wrap items-center justify-center overflow-x-auto rounded-xl border p-5"
	>
		<div class="w-full">{@render children()}</div>
	</div>
	<div class="flex items-center gap-3 rounded-b-xl p-2">
		<p class="text-muted-foreground flex flex-1 gap-1 truncate text-xs">
			<InfoIcon class="size-3 h-lh shrink-0" />
			<span class="truncate">{particle.description}</span>
		</p>
		<div class="flex items-center gap-1.5">
			<CopyRegistry text="test" variant="outline" size="icon-sm" />
			<Sheet.Root>
				<Sheet.Trigger
					class={[buttonVariants({ variant: "outline", size: "sm" }), "text-xs"]}
				>
					View Code
				</Sheet.Trigger>
				<Sheet.Content
					class="bg-sidebar duration-200 data-ending-style:translate-x-8 data-ending-style:opacity-0 data-starting-style:translate-x-8 data-starting-style:opacity-0 sm:max-w-3xl"
				>
					<Sheet.Header class="sr-only">
						<Sheet.Title>View Code</Sheet.Title>
						<Sheet.Description>
							View the code for the {particle.id} particle
						</Sheet.Description>
					</Sheet.Header>
					<div class="flex flex-1 flex-col overflow-hidden p-6">
						<div>
							<h2 class="font-heading mb-4 text-xl">Installation</h2>
							<PmAddComp name="tes" />
						</div>

						{#if ComponentSource}
							<div class="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden">
								<h2 class="font-heading mb-4 shrink-0 text-xl">Source</h2>
								<div
									class="border-border/50 bg-code no-scrollbar min-h-0 flex-1 overflow-y-auto rounded-xl border"
								>
									<Source class="mt-0 border-none" component={ComponentSource} />
								</div>
							</div>
						{/if}
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</div>
