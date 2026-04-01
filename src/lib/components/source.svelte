<script lang="ts">
	import CopyButton from "$lib/components/copy-button.svelte";
	import { cn } from "$lib/utils.js";
	import { highlighterPromise } from "$lib/shiki.js";
	import { LoaderCircle } from "@lucide/svelte";

	// ─── Props ────────────────────────────────────────────────────────────────────
	let {
		component = "",
		lang = "svelte",
		class: className,
		showLineNumbers = true,
	}: {
		component?: string;
		lang?: string;
		class?: string;
		showLineNumbers?: boolean;
	} = $props();

	// ─── Async pipeline ───────────────────────────────────────────────────────────
	// The only async step is awaiting the Shiki highlighter singleton (which is
	// already resolving in the background from the moment shiki.ts is imported).
	// codeToHtml() itself is synchronous and fast — no Prettier, no blocking.
	let highlightedHtml = $state("");
	let plainText = $state("");
	let loading = $state(false);

	$effect(() => {
		// Normalise: trim and convert tabs → 2 spaces (same as shiki.ts formatCode)
		const rawInput = (component || "").replace(/\t/g, "  ").trim();
		const currentLang = lang;
		const lineNumbers = showLineNumbers;

		if (!rawInput) {
			plainText = "";
			highlightedHtml = "";
			loading = false;
			return;
		}

		plainText = rawInput;
		loading = true;
		highlightedHtml = "";

		let cancelled = false;

		(async () => {
			// highlighterPromise resolves almost instantly after first call since
			// shiki.ts kicks it off at module load time.
			const highlighter = await highlighterPromise;
			if (cancelled) return;

			const html = highlighter.codeToHtml(rawInput, {
				lang: currentLang,
				themes: { dark: "github-dark", light: "github-light-default" },
				defaultColor: false,
				transformers: [
					{
						pre(node: { properties: Record<string, unknown> }) {
							node.properties["class"] =
								"no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none !bg-transparent";
						},
						code(node: { properties: Record<string, unknown> }) {
							if (lineNumbers) {
								node.properties["data-line-numbers"] = "";
							}
						},
						line(node: { properties: Record<string, unknown> }) {
							node.properties["data-line"] = "";
						},
					},
				],
			});

			if (cancelled) return;
			highlightedHtml = html;
			loading = false;
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<figure data-rehype-pretty-code-figure class={cn("relative mt-6", className)}>
	{#if highlightedHtml}
		<!-- Shiki output is trusted HTML; XSS risk is acceptable here -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html highlightedHtml}
		<CopyButton text={plainText} />
	{:else if loading}
		<div class="text-muted-foreground flex items-center justify-center py-10">
			<LoaderCircle class="size-5 animate-spin" />
		</div>
	{/if}
</figure>
