import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_BASE = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.resolve(REGISTRY_BASE, "../../../static/r");

const uiAudioBase = path.join(REGISTRY_BASE, "ui/audio");
const uiAudioElementsBase = path.join(REGISTRY_BASE, "ui/audio/elements");
const particlesBase = path.join(REGISTRY_BASE, "particles");
const examplesBase = path.join(REGISTRY_BASE, "examples");

interface RegistryFile {
	content: string;
	type: string;
	target: string;
	path?: string;
}

interface RegistryItem {
	name: string;
	type: string;
	author?: string;
	description?: string;
	dependencies?: string[];
	registryDependencies?: string[];
	meta?: Record<string, string>;
	files: RegistryFile[];
}

function ensureDirectory(dir: string) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function getFilesInDirectory(dir: string): string[] {
	let files: string[] = [];
	const items = fs.readdirSync(dir, { withFileTypes: true });
	for (const item of items) {
		const fullPath = path.join(dir, item.name);
		if (item.isDirectory()) {
			files = files.concat(getFilesInDirectory(fullPath));
		} else {
			files.push(fullPath);
		}
	}
	return files;
}

function processComponent(name: string, dir: string, filePaths: string[], kind: "ui" | "particle" | "example" = "ui"): RegistryItem {
	const dependencies = new Set<string>();
	const registryDependencies = new Set<string>();

	const processedFiles: RegistryFile[] = filePaths.map((filePath) => {
		let content = fs.readFileSync(filePath, "utf8");

		// 1. Find registry dependencies within svelte-audio-ui
		const regDepsRegex = /\$registry\/ui\/audio\/(elements\/)?([^\/]+)/g;
		let match;
		while ((match = regDepsRegex.exec(content)) !== null) {
			const depName = match[2];
			if (depName !== name) {
				registryDependencies.add(`https://svelte-audio-ui.vercel.app/r/${depName}.json`);
			}
		}

		// 2. Find particles dependencies
		const particleDepsRegex = /\$registry\/particles\/([^\/\.]+)\.svelte/g;
		while ((match = particleDepsRegex.exec(content)) !== null) {
			const depName = match[1];
			// Particles are prefixed with 'particle-' in registry
			if (`particle-${depName}` !== name) {
				registryDependencies.add(`https://svelte-audio-ui.vercel.app/r/particle-${depName}.json`);
			}
		}

		// 3. Find standard shadcn-svelte dependencies
		const shadcnDepsRegex = /\$lib\/components\/ui\/([a-zA-Z0-9_-]+)/g;
		while ((match = shadcnDepsRegex.exec(content)) !== null) {
			const depName = match[1];
			if (depName !== "audio") { 
				registryDependencies.add(depName);
			}
		}

		// 4. Find NPM dependencies
		const npmDepsRegex = /from\s+['"]([^$][^'"\.]+)['"]/g;
		while ((match = npmDepsRegex.exec(content)) !== null) {
			const depName = match[1];
			if (depName.startsWith("svelte")) continue; // Built-in
			// Add common third party dependencies
			if (depName.startsWith("@lucide/svelte") || depName.startsWith("lucide-svelte")) dependencies.add("lucide-svelte");
			if (depName.startsWith("svelte-dnd-action")) dependencies.add("svelte-dnd-action");
			if (depName.startsWith("tailwind-merge")) dependencies.add("tailwind-merge");
			if (depName.startsWith("clsx")) dependencies.add("clsx");
			// Add more rules here if necessary
		}

		// 5. Inherent Provider Dependency
		// These standard UI components intrinsically rely on the AudioProvider wrapper
		const requiresProvider = ["player", "queue", "track", "playback-speed"];
		if (requiresProvider.includes(name) && kind === "ui") {
			registryDependencies.add("https://svelte-audio-ui.vercel.app/r/provider.json");
		}


		// --- TRANSFORM IMPORTS FOR USER ENVIRONMENT ---
		// Utils
		content = content.replace(/\$registry\/lib\/utils(\.js)?/g, "$lib/utils.js");
		content = content.replace(/\$registry\/registry-utils(\.js)?/g, "$lib/utils.js"); // fallback

		// Libs
		content = content.replace(/\$registry\/lib\/audio-store\.svelte(\.js)?/g, "$lib/audio-store.svelte.js");
		content = content.replace(/\$registry\/lib\/html-audio(\.js)?/g, "$lib/html-audio.js");
		
		// Remove `elements/` from path because we flatten into `audio/`
		content = content.replace(/\$registry\/ui\/audio\/elements\/([^\/]+)/g, "$lib/components/ui/audio/$1");
		
		// Standard components
		content = content.replace(/\$registry\/ui\/audio\/([^\/]+)/g, "$lib/components/ui/audio/$1");
		
		// Particles
		content = content.replace(/\$registry\/particles\/([^\/\.]+)\.svelte/g, "$lib/components/ui/audio/particle-$1.svelte");

		// Determine target path for the CLI
		let targetPath: string;
		if (kind === "particle" || kind === "example") {
			targetPath = `audio/${name}.svelte`;
		} else {
			const relPath = path.relative(dir, filePath);
			// Force POSIX separators for URL/CLI paths
			targetPath = `audio/${name}/${relPath.split(path.sep).join("/")}`;
		}

		return {
			content,
			type: "registry:file",
			target: targetPath,
		};
	});

	if (name === "provider" && kind === "ui") {
		const libDir = path.join(REGISTRY_BASE, "lib");
		if (fs.existsSync(path.join(libDir, "audio-store.svelte.ts"))) {
			processedFiles.push({
				content: fs.readFileSync(path.join(libDir, "audio-store.svelte.ts"), "utf8"),
				type: "registry:lib",
				target: "audio-store.svelte.ts",
			});
		}
		if (fs.existsSync(path.join(libDir, "html-audio.ts"))) {
			processedFiles.push({
				content: fs.readFileSync(path.join(libDir, "html-audio.ts"), "utf8"),
				type: "registry:lib",
				target: "html-audio.ts",
			});
		}
	}

	return {
		name,
		type: kind === "example" || kind === "particle" ? "registry:block" : "registry:ui",
		author: "ddtamn",
		description: "",
		dependencies: Array.from(dependencies),
		registryDependencies: Array.from(registryDependencies),
		meta: {
			author: "ddtamn",
			version: "1.0.0",
			documentation: `https://svelte-audio-ui.vercel.app/docs/components/${name.replace(/^particle-/, "")}`,
			repository: "https://github.com/ddtamn/svelte-audio-ui",
		},
		files: processedFiles,
	};
}

function generateRegistry() {
	ensureDirectory(OUTPUT_DIR);

	const registryIndex: Record<string, any>[] = [];
	const items: RegistryItem[] = [];

	// 1. Scan ui/audio base folders
	const audioFolders = fs.readdirSync(uiAudioBase, { withFileTypes: true });
	for (const folder of audioFolders) {
		if (folder.isDirectory() && folder.name !== "elements") {
			const fullDir = path.join(uiAudioBase, folder.name);
			const files = getFilesInDirectory(fullDir);
			const item = processComponent(folder.name, fullDir, files, "ui");
			items.push(item);
		}
	}

	// 2. Scan ui/audio/elements folders
	if (fs.existsSync(uiAudioElementsBase)) {
		const elementFolders = fs.readdirSync(uiAudioElementsBase, { withFileTypes: true });
		for (const folder of elementFolders) {
			if (folder.isDirectory()) {
				const fullDir = path.join(uiAudioElementsBase, folder.name);
				const files = getFilesInDirectory(fullDir);
				const item = processComponent(folder.name, fullDir, files, "ui");
				items.push(item);
			}
		}
	}

	// 3. Scan particles
	if (fs.existsSync(particlesBase)) {
		const particleFiles = fs.readdirSync(particlesBase, { withFileTypes: true });
		for (const file of particleFiles) {
			if (file.isFile() && file.name.endsWith(".svelte")) {
				const basename = path.basename(file.name, ".svelte");
				const name = `particle-${basename}`;
				const item = processComponent(name, particlesBase, [path.join(particlesBase, file.name)], "particle");
				items.push(item);
			}
		}
	}

	// 4. Scan examples
	if (fs.existsSync(examplesBase)) {
		const exampleFiles = fs.readdirSync(examplesBase, { withFileTypes: true });
		for (const file of exampleFiles) {
			if (file.isFile() && file.name.endsWith(".svelte")) {
				const name = path.basename(file.name, ".svelte");
				const item = processComponent(name, examplesBase, [path.join(examplesBase, file.name)], "example");
				items.push(item);
			}
		}
	}

	// Write individual component JSON files
	for (const item of items) {
		const outPath = path.join(OUTPUT_DIR, `${item.name}.json`);
		fs.writeFileSync(outPath, JSON.stringify(item, null, 2));
		console.log(`Generated: static/r/${item.name}.json`);

		registryIndex.push({
			name: item.name,
			type: item.type,
			dependencies: item.dependencies,
			registryDependencies: item.registryDependencies,
			files: item.files.map((f) => ({ type: f.type, target: f.target })),
		});
	}

	// Write the main registry index file
	const indexItem = {
		name: "svelte-audio-ui",
		homepage: "https://svelte-audio-ui.vercel.app",
		items: registryIndex,
	};
	
	fs.writeFileSync(path.join(OUTPUT_DIR, "index.json"), JSON.stringify(indexItem, null, 2));
	console.log("Generated: static/r/index.json");
}

generateRegistry();
