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

export const load: PageLoad = async ({ params, fetch }) => {
	const doc = await getDoc(params.slug);
	
	// Get the component name from the slug (e.g. "components/player" -> "player")
	let blockName = params.slug.split('/').pop();
	if (blockName === "xy-pad") blockName = "xypad";
	
	let viewerData = null;
	const isComponentPage = ["components/", "ui/", "particles/", "libs/"].some(prefix => params.slug.startsWith(prefix));

	if (blockName && isComponentPage) {
		try {
			const res = await fetch(`/api/block/${blockName}`);
			if (res.ok) {
				viewerData = await res.json();
			}
		} catch (e) {
			console.error(`Failed to fetch viewerData for ${blockName}`, e);
		}
	}

	return { ...doc, viewerData };
};
