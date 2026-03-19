import { getDoc } from "$lib/docs.js";
import type { EntryGenerator, PageLoad } from "./$types.js";

export const prerender = true;

export const entries: EntryGenerator = () => {
	const modules = import.meta.glob("/content/**/*.md");
	const entries = [];
	for (const path of Object.keys(modules)) {
		const slug = path.replace("/content/", "").replace(".md", "").replace("/index", "").trim();
		entries.push({ slug });
	}
	return entries;
};

export const load: PageLoad = async ({ params }) => {
	const doc = await getDoc(params.slug);
	return { ...doc };
};
