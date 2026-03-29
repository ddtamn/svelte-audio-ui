<script lang="ts">

	import CopyButton from "$lib/components/copy-button.svelte";
	import { cn } from "$lib/utils.js";

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

	let highlightedHtml = $state("");
	let plainText = $state("");

	$effect(() => {
		const rawInput = String(component || "").trim();
		if (!rawInput) {
			plainText = "";
			highlightedHtml = "";
			return;
		}

		let isActive = true;

		async function processCode() {
			let codeToHighlight = rawInput;
			try {
				if (lang === "svelte" || lang === "typescript" || lang === "css") {
					const prettier = await import("prettier/standalone");
					const plugins = [];
					if (lang === "svelte") {
						plugins.push(await import("prettier-plugin-svelte/browser"));
						plugins.push(await import("prettier/plugins/estree"));
						plugins.push(await import("prettier/plugins/typescript"));
						plugins.push(await import("prettier/plugins/babel"));
						plugins.push(await import("prettier/plugins/postcss"));
						plugins.push(await import("prettier/plugins/html"));
					} else if (lang === "typescript") {
						plugins.push(await import("prettier/plugins/typescript"));
						plugins.push(await import("prettier/plugins/estree"));
					} else if (lang === "css") {
						plugins.push(await import("prettier/plugins/postcss"));
					}

					codeToHighlight = await prettier.format(codeToHighlight, {
						parser: lang === "svelte" ? "svelte" : lang === "typescript" ? "typescript" : "css",
						plugins: plugins.map((p) => p.default || p),
						useTabs: false,
						tabWidth: 2,
						singleQuote: false,
						trailingComma: "none",
						printWidth: 80,
						endOfLine: "lf",
						bracketSameLine: false,
					});

					codeToHighlight = codeToHighlight
						.replaceAll("<!-- prettier-ignore -->\n", "")
						.replaceAll("// prettier-ignore\n", "")
						.trim();
				}
			} catch (e) {
				console.error("Prettier formatting failed:", e);
			}

			if (!isActive) return;
			plainText = codeToHighlight;

			const { createHighlighterCore } = await import("shiki/core");
			const { createJavaScriptRegexEngine } = await import("shiki/engine/javascript");

			const highlighter = await createHighlighterCore({
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

			const html = highlighter.codeToHtml(codeToHighlight, {
				lang,
				themes: {
					dark: "github-dark",
					light: "github-light-default",
				},
				defaultColor: false,
				// Make sure CSS variables match the site's utility rules
				transformers: [
					{
						line(node) {
							node.properties["data-line"] = "";
						},
					},
				],
			});

			const parser = new DOMParser();
			const doc = parser.parseFromString(html, "text/html");
			const preNode = doc.querySelector("pre");

			if (preNode && showLineNumbers) {
				const codeNode = preNode.querySelector("code");
				if (codeNode) {
					codeNode.setAttribute("data-line-numbers", "");
				}
			}

			if (!isActive) return;
			highlightedHtml = preNode?.innerHTML ?? "";
		}

		processCode();

		return () => {
			isActive = false;
		};
	});
</script>

<figure data-rehype-pretty-code-figure class={cn("relative mt-6", className)}>
	{#if highlightedHtml}
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
