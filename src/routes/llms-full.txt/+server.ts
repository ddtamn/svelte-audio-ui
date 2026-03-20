import { text } from '@sveltejs/kit';

export async function GET() {
	let content = '';

	// Import the metadata from velite to list the files
	const { overview, components, ui, libs } = await import('$content/index.js');
	const allDocs = [...overview, ...components, ...ui, ...libs];

	// Import raw markdown files
	const rawDocs = import.meta.glob('/content/**/*.md', { query: '?raw', import: 'default' });

	for (const doc of allDocs) {
		if (content.length > 0) {
			content += `\n\n\n`;
		}
		content += `# ${doc.title}\n\n\n\n`;

		// find matching file
		const filePath = `/content/${doc.path}`;
		const match = rawDocs[`${filePath}.md`] || rawDocs[`${filePath}/index.md`] || rawDocs[filePath];

		if (match) {
			const raw = await match();
			
			// Simple strip of svelte <script> tags
			let cleanRaw = (raw as string).replace(/<script[\s\S]*?<\/script>/g, '');
			
			// Simple strip of frontmatter
			cleanRaw = cleanRaw.replace(/^---\n[\s\S]*?\n---\n/, '');
			
			content += cleanRaw.trim();
		}
	}

	return text(content + '\n', {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
}
