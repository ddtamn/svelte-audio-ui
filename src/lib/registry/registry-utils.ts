export type FileTree = {
	name: string;
	path?: string;
	children?: FileTree[];
};

// todo
export function createFileTreeForRegistryItemFiles(
	files: Array<{ target: string; type: [] }> | undefined
): FileTree[] {
	if (!files || !Array.isArray(files)) {
		return [];
	}

	const root: FileTree[] = [];

	for (const file of files) {
		const path = file.target;
		const parts = path.split("/");
		let currentLevel = root;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const isFile = i === parts.length - 1;
			const existingNode = currentLevel.find((node) => node.name === part);

			if (existingNode) {
				if (isFile) {
					existingNode.path = path;
				} else {
					currentLevel = existingNode.children!;
				}
			} else {
				const newNode: FileTree = isFile
					? { name: part, path }
					: { name: part, children: [] };

				currentLevel.push(newNode);

				if (!isFile) {
					currentLevel = newNode.children!;
				}
			}
		}
	}

	return root;
}
