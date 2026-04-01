import { json } from "@sveltejs/kit";
import fs from "fs/promises";
import path from "path";
import process from "process";
import type { RequestHandler } from "./$types.js";
import { highlightCode } from "$lib/shiki.js";

export const GET: RequestHandler = async ({ params }) => {
	const blockName = params.block;
	
	try {
		// Read the registry json file
		const filePath = path.join(process.cwd(), "static", "r", `${blockName}.json`);
		const fileContent = await fs.readFile(filePath, "utf-8");
		const registryItem = JSON.parse(fileContent);

		if (!registryItem.files) {
			return json({ error: "Invalid registry item" }, { status: 400 });
		}

		// Ensure sequential highlighting to avoid cache weirdness,
        // or just use Promise.all. shadcn maps with Promise.all
		const highlightedFiles = await Promise.all(registryItem.files.map(async (file: Record<string, string>) => {
			const content = file.content;
			let target = file.target || file.path;
			const lang = path.extname(target).slice(1) || "svelte";
			
			// Highlight the source
			const highlightedContent = await highlightCode(content, lang);

			// Clean up the CLI path for the viewer tree:
			const match = target.match(/src\/lib\/components\/ui\/audio\/(.+)/) 
                          || target.match(/src\/lib\/components\/ui\/(.+)/)
                          || target.match(/src\/lib\/(.+)/);
			
            if (match) {
				const parts = match[1].split("/");
				// Find where the component folder starts (e.g. "fader")
				const idx = parts.indexOf(blockName);
				
				if (idx !== -1) {
					// Slice from the component name onwards ("fader/fader.svelte")
					target = parts.slice(idx).join("/");
				} else {
					// If there is no exact component folder match, just take the last two parts or prepend blockName
					if (parts.length === 1) {
						target = `${blockName}/${parts[0]}`;
					} else {
						// e.g. "elements/something.svelte" -> "something/something.svelte" if we want
						target = `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
					}
				}
			} else {
				target = target.replace(/^~\/?/, "");
			}

			// Force 'registry:lib' items to display inside a 'libs' folder in the viewer tree
			if (file.type === "registry:lib" && !target.includes("/")) {
				target = `libs/${target}`;
			}

			return {
				type: file.type,
				target: target,
				highlightedContent: highlightedContent,
			};
		}));

		return json({
			name: registryItem.name,
			description: registryItem.description,
			type: registryItem.type,
			dependencies: registryItem.dependencies,
			registryDependencies: registryItem.registryDependencies,
			files: highlightedFiles,
		});
	} catch (e) {
		console.error("Failed to load block:", e);
		return json({ error: "Block not found" }, { status: 404 });
	}
};

export const prerender = true;
