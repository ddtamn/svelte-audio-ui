import { getDoc } from "$lib/docs.js";
import type { EntryGenerator, PageLoad } from "./$types.js";
// Beritahu SvelteKit untuk mem-build halaman ini secara statis.
export const prerender = true;
// Memberitahu prerender halaman apa saja yang harus di-build
// berdasarkan file .md yang ada di folder content/
export const entries: EntryGenerator = () => {
	const modules = import.meta.glob("/content/**/*.md");
	const entries = [];
	for (const path of Object.keys(modules)) {
		const slug = path.replace("/content/", "").replace(".md", "").replace("/index", "").trim();

		entries.push({ slug });
	}
	return entries;
};
// Proses load data per halaman
export const load: PageLoad = async ({ params }) => {
	// Panggil getDoc yang ada di src/lib/docs.ts
	const doc = await getDoc(params.slug);

	// Nanti di +page.svelte, data ini bisa diakses melalui "data" prop
	return {
		...doc,
	};
};
