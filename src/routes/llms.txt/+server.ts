import { text } from "@sveltejs/kit";

export async function GET() {
	let content = `# Docs\n\n`;

	// Import the metadata from velite to list the files
	const { overview, components, ui, libs } = await import("$content/index.js");
	const categories = { overview, components, ui, libs };

	for (const [category, docs] of Object.entries(categories)) {
		if (docs && docs.length > 0) {
			content += `## ${category}\n\n`;
			for (const doc of docs) {
				content += `- [${doc.title}](${doc.slugFull}): ${doc.description}\n`;
			}
			content += `\n`;
		}
	}

	return text(content.trim() + "\n", {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
}
