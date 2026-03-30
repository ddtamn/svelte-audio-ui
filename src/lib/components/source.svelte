<script lang="ts">
	import CopyButton from "$lib/components/copy-button.svelte";
	import { cn } from "$lib/utils.js";
	import { SvelteMap } from "svelte/reactivity";
	import type { Plugin } from "prettier";

	// Highlighter is expensive to instantiate – create it once and share it.
	let highlighterPromise: Promise<any> | null = null;

	function getHighlighter(): Promise<any> {
		if (!highlighterPromise) {
			highlighterPromise = (async () => {
				const { createHighlighterCore } = await import("shiki/core");
				const { createJavaScriptRegexEngine } = await import("shiki/engine/javascript");
				return createHighlighterCore({
					themes: [
						import("@shikijs/themes/github-dark"),
						import("@shikijs/themes/github-light-default"),
					],
					langs: [
						import("@shikijs/langs/svelte"),
						import("@shikijs/langs/typescript"),
						import("@shikijs/langs/css"),
						import("@shikijs/langs/bash"),
						import("@shikijs/langs/json"),
					],
					engine: createJavaScriptRegexEngine(),
				});
			})();
		}
		return highlighterPromise;
	}

	// Prettier result cache keyed by "lang:rawCode"
	const prettierCache = new SvelteMap<string, string>();

	type FormattableLanguage = "svelte" | "typescript" | "css";
	const FORMATTABLE = new Set<FormattableLanguage>(["svelte", "typescript", "css"]);

	async function formatCode(raw: string, lang: string): Promise<string> {
		if (!FORMATTABLE.has(lang as FormattableLanguage)) return raw;

		const cacheKey = `${lang}:${raw}`;
		const cached = prettierCache.get(cacheKey);
		if (cached !== undefined) return cached;

		try {
			const prettier = await import("prettier/standalone");
			const plugins: unknown[] = [];

			if (lang === "svelte") {
				plugins.push(
					await import("prettier-plugin-svelte/browser"),
					await import("prettier/plugins/estree"),
					await import("prettier/plugins/typescript"),
					await import("prettier/plugins/babel"),
					await import("prettier/plugins/postcss"),
					await import("prettier/plugins/html")
				);
			} else if (lang === "typescript") {
				plugins.push(
					await import("prettier/plugins/typescript"),
					await import("prettier/plugins/estree")
				);
			} else {
				plugins.push(await import("prettier/plugins/postcss"));
			}

			const parser =
				lang === "svelte" ? "svelte" : lang === "typescript" ? "typescript" : "css";
			const resolvedPlugins = plugins.map((p) => (p as { default?: unknown }).default ?? p) as Plugin<any>[];

			const formatted = await prettier.format(raw, {
				parser,
				plugins: resolvedPlugins,
				useTabs: false,
				tabWidth: 2,
				singleQuote: false,
				trailingComma: "none",
				printWidth: 80,
				endOfLine: "lf",
				bracketSameLine: false,
			});

			const clean = formatted
				.replaceAll("<!-- prettier-ignore -->\n", "")
				.replaceAll("// prettier-ignore\n", "")
				.trim();

			prettierCache.set(cacheKey, clean);
			return clean;
		} catch (e) {
			console.error("Prettier formatting failed:", e);
			return raw;
		}
	}

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

	// ─── Async pipeline state ─────────────────────────────────────────────────────
	// $derived cannot be async in Svelte 5, so $effect + $state is the correct
	// pattern for an async highlight pipeline.
	let highlightedHtml = $state("");
	let plainText = $state("");

	$effect(() => {
		const rawInput = String(component || "").trim();
		const currentLang = lang;

		if (!rawInput) {
			plainText = "";
			highlightedHtml = "";
			return;
		}

		let cancelled = false;

		(async () => {
			// 1. Format (module-level cache avoids redundant Prettier runs)
			const formatted = await formatCode(rawInput, currentLang);
			if (cancelled) return;
			plainText = formatted;

			// 2. Highlight (singleton — only instantiated on the very first call)
			const highlighter = await getHighlighter();
			if (cancelled) return;

			const html = highlighter.codeToHtml(formatted, {
				lang: currentLang,
				themes: { dark: "github-dark", light: "github-light-default" },
				defaultColor: false,
				transformers: [
					{
						line(node: { properties: Record<string, string> }) {
							node.properties["data-line"] = "";
						},
					},
				],
			});

			const domParser = new DOMParser();
			const doc = domParser.parseFromString(html, "text/html");
			const preNode = doc.querySelector("pre");

			if (preNode && showLineNumbers) {
				preNode.querySelector("code")?.setAttribute("data-line-numbers", "");
			}

			if (cancelled) return;
			highlightedHtml = preNode?.innerHTML ?? "";
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<figure data-rehype-pretty-code-figure class={cn("relative mt-6", className)}>
	{#if highlightedHtml}
		<!-- Shiki output is trusted HTML; the XSS risk here is acceptable -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<pre
			class={cn(
				"no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none",
				showLineNumbers && "has-data-line-numbers:px-0"
			)}>{@html highlightedHtml}</pre>
		<CopyButton text={plainText} />
	{:else}
		<pre
			class="no-scrollbar text-muted-foreground min-w-0 overflow-x-auto px-4 py-3.5 outline-none"><code
				>{plainText}</code
			></pre>
	{/if}
</figure>
