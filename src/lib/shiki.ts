import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const highlightCodeCache = new Map<string, string>();
const jsEngine = createJavaScriptRegexEngine();

/**
 * Shared Shiki highlighter singleton – exported so other modules can reuse it
 * without creating a second instance.
 */
export const highlighterPromise = createHighlighterCore({
	themes: [import("@shikijs/themes/github-dark"), import("@shikijs/themes/github-light-default")],
	langs: [
		import("@shikijs/langs/typescript"),
		import("@shikijs/langs/svelte"),
		import("@shikijs/langs/css"),
		import("@shikijs/langs/bash"),
		import("@shikijs/langs/json"),
	],
	engine: jsEngine,
});

export async function highlightCode(code: string, language: string = "svelte"): Promise<string> {
	const cachedCode = highlightCodeCache.get(code);
	if (cachedCode) return cachedCode;

	const highlighter = await highlighterPromise;

	const html = highlighter.codeToHtml(formatCode(code), {
		lang: language,
		themes: {
			dark: "github-dark",
			light: "github-light-default",
		},
		defaultColor: false,
		transformers: [
			{
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				pre(node: any) {
					node.properties["class"] =
						"no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0 !bg-transparent";
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				code(node: any) {
					node.properties["data-line-numbers"] = "";
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				line(node: any) {
					node.properties["data-line"] = "";
				},
			},
		],
	});

	highlightCodeCache.set(code, html);

	return html;
}

function formatCode(code: string): string {
	return code.replace(/\t/g, "  ");
}
