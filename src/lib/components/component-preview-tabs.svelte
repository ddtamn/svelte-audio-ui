<script lang="ts">
	import type { Component, Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		align = "center",
		component,
		example,
		children,
		name,
		...restProps
	}: HTMLAttributes<HTMLElement> & {
		align?: "center" | "start" | "end";
		hideCode?: boolean;
		example?: Snippet;
		component?: Component;
		name: string;
	} = $props();

	// Lazily import from registry if no component prop is passed
	const componentPromise = $derived(
		component
			? Promise.resolve(component)
			: import(`../../lib/registry/examples/${name}.svelte`)
					.then((mod) => mod.default as Component)
					.catch(() => undefined)
	);
</script>

{#snippet NotFound()}
	<p class="text-muted-foreground text-sm">
		Component
		<code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
			{name}
		</code>
		not found in registry.
	</p>
{/snippet}

<div
	class={cn("group relative mt-4 mb-12 flex flex-col gap-2 rounded-lg border", className)}
	{...restProps}
>
	<div>
		<div
			data-slot="preview"
			class="preview flex w-full justify-center data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start"
			data-llm-ignore
		>
			<div
				data-align={align}
				class="preview flex min-h-[450px] w-full justify-center p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start"
			>
				{#if example}
					{@render example()}
				{:else}
					{#await componentPromise}
						<p class="text-muted-foreground text-sm">Loading...</p>
					{:then ResolvedComponent}
						{#if ResolvedComponent}
							<ResolvedComponent />
						{:else}
							{@render NotFound()}
						{/if}
					{:catch}
						{@render NotFound()}
					{/await}
				{/if}
			</div>
		</div>
		<div
			data-slot="code"
			class="overflow-hidden **:data-rehype-pretty-code-figure:m-0! **:data-rehype-pretty-code-figure:rounded-t-none **:data-rehype-pretty-code-figure:border-t [&_pre]:max-h-[400px]"
		>
			{@render children?.()}
		</div>
	</div>
</div>
