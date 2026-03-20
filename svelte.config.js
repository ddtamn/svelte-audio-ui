import { mdsx } from "mdsx";
import { mdsxConfig } from "./mdsx.config.js";
import { existsSync } from "node:fs";

const adapterPackage = existsSync("./node_modules/@sveltejs/adapter-vercel/package.json")
	? "@sveltejs/adapter-vercel"
	: "@sveltejs/adapter-auto";

const { default: adapter } = await import(adapterPackage);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		alias: {
			"$content/*": ".velite/*",
			"$registry/*": "src/lib/registry/*",
		},
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes("node_modules") ? undefined : { runes: true },
	},
	preprocess: [mdsx(mdsxConfig)],
	extensions: [".svelte", ".md"],
};

export default config;
