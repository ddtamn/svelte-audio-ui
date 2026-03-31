/**
 * generate-registry.ts
 *
 * Generates shadcn-svelte-compatible registry JSON files for every component,
 * particle, and example in src/lib/components/ui/audio, plus the two core lib
 * files (audio-store.svelte.ts, html-audio.ts).
 *
 * The CLI requires each file entry to have:
 *   - content : inlined file content as a string
 *   - target  : destination path in the user's project
 *   - type    : registry file type
 *
 * Output: static/r/<name>.json  +  static/r/index.json
 * Spec  : https://shadcn-svelte.com/docs/registry/registry-item-json.md
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ─── Paths ───────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const AUDIO_DIR = path.join(ROOT, "src/lib/components/ui/audio");
const ELEMENTS_DIR = path.join(AUDIO_DIR, "elements");
const EXAMPLES_DIR = path.join(AUDIO_DIR, "examples");
const PARTICLES_DIR = path.join(ROOT, "src/lib/components/particles");
const LIB_DIR = path.join(ROOT, "src/lib");
const OUTPUT_DIR = path.join(ROOT, "static/r");

// const BASE_URL = "http://localhost:5173";
const BASE_URL = "https://svelte-audio-ui.vercel.app";
const AUTHOR = "ddtamn <https://github.com/ddtamn>";

// ─── Types ───────────────────────────────────────────────────────────────────

type FileType =
	| "registry:ui"
	| "registry:component"
	| "registry:lib"
	| "registry:hook"
	| "registry:block"
	| "registry:page"
	| "registry:file";

interface RegistryFile {
	/** Destination path in the user's project */
	target: string;
	/** Inlined file content */
	content: string;
	type: FileType;
}

interface RegistryItem {
	$schema: string;
	name: string;
	type: "registry:ui" | "registry:block" | "registry:lib";
	title: string;
	description: string;
	author: string;
	dependencies: string[];
	registryDependencies: string[];
	files: RegistryFile[];
	docs?: string;
	categories?: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ensureDir(dir: string) {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function walkDir(dir: string): string[] {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) files.push(...walkDir(full));
		else files.push(full);
	}
	return files;
}

function toTitle(name: string): string {
	return name
		.replace(/^particle-/, "")
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

/**
 * File type rules:
 *   lib files (audio-store.svelte.ts, html-audio.ts) → registry:lib
 *     target = just the filename (CLI places it in $lib/ automatically)
 *   everything else → registry:file
 *     target = ~/src/lib/components/... (explicit, project-root-relative)
 */
function detectFileType(absPath: string, isLib = false): FileType {
	if (isLib) return "registry:lib";
	return "registry:file";
}

/**
 * Compute the target path for the user's project.
 *
 * - Lib files (audio-store, html-audio):  just the filename → $lib/<filename>
 * - All other files: ~/src/lib/components/ui/audio/... (project-root-relative)
 *
 * The `~/` prefix tells the shadcn-svelte CLI to resolve from the project root.
 */
function computeTarget(absPath: string, isLib = false): string {
	if (isLib) {
		// For registry:lib files, target is just the filename;
		// the CLI places it in the project's configured lib dir ($lib)
		return path.basename(absPath);
	}
	// For all other files, use an absolute project-root path via ~/
	// This makes the CLI place files at exactly src/lib/components/ui/audio/...
	const fromRoot = path.relative(ROOT, absPath).split(path.sep).join("/");
	return `~/${fromRoot}`;
}

// ─── Dependency extraction ────────────────────────────────────────────────────

const SVELTE_BUILTINS = new Set([
	"svelte",
	"svelte/animate",
	"svelte/transition",
	"svelte/easing",
	"svelte/store",
	"svelte/motion",
]);

function extractDeps(
	filePaths: string[],
	componentName: string
): { dependencies: string[]; registryDependencies: string[] } {
	const npmDeps = new Set<string>();
	const regDeps = new Set<string>();

	for (const filePath of filePaths) {
		const content = fs.readFileSync(filePath, "utf8");

		// ── npm packages ─────────────────────────────────────────────────────
		const npmRe = /from\s+["']([^$\.\/][^"']+)["']/g;
		let m: RegExpExecArray | null;
		while ((m = npmRe.exec(content)) !== null) {
			const raw = m[1];
			if (SVELTE_BUILTINS.has(raw) || raw.startsWith("svelte/")) continue;
			let pkg: string;
			if (raw.startsWith("@")) {
				const parts = raw.split("/");
				pkg = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : raw;
			} else {
				pkg = raw.split("/")[0]!;
			}
			if (pkg === "cva") pkg = "cva@npm:class-variance-authority";
			if (pkg) npmDeps.add(pkg);
		}

		// ── shadcn-svelte components ($lib/components/ui/<name>) ─────────────
		const shadcnRe = /\$lib\/components\/ui\/([a-zA-Z0-9_-]+)/g;
		while ((m = shadcnRe.exec(content)) !== null) {
			const dep = m[1];
			if (dep !== "audio") regDeps.add(dep);
		}

		// ── internal audio sub-components → full registry URL ──────────────────
		const audioRe = /\$lib\/components\/ui\/audio\/(?:elements\/)?([a-zA-Z0-9_-]+)/g;
		while ((m = audioRe.exec(content)) !== null) {
			const dep = m[1];
			if (dep === "examples" || dep === componentName) continue;
			regDeps.add(`${BASE_URL}/r/${dep}.json`);
		}

		// Note: particleAudioRe removed — audioRe above already handles all
		// $lib/components/ui/audio/* imports with the elements/ path guard.

		// ── lib imports (audio-store, html-audio) → bundled in provider ───────
		if (/\$lib\/audio-store\.svelte/.test(content) || /\$lib\/html-audio/.test(content)) {
			if (componentName !== "provider") {
				regDeps.add(`${BASE_URL}/r/provider.json`);
			}
		}
	}

	return {
		dependencies: [...npmDeps].sort(),
		registryDependencies: [...regDeps].sort(),
	};
}

// ─── Item builders ────────────────────────────────────────────────────────────

function buildComponentItem(name: string, dir: string): RegistryItem {
	const allFiles = walkDir(dir);

	const registryFiles: RegistryFile[] = allFiles.map((f) => ({
		target: computeTarget(f, false),
		content: fs.readFileSync(f, "utf8"),
		type: detectFileType(f, false),
	}));

	// Provider gets the two core lib files embedded
	if (name === "provider") {
		const storeFile = path.join(LIB_DIR, "audio-store.svelte.ts");
		const htmlAudioFile = path.join(LIB_DIR, "html-audio.ts");
		if (fs.existsSync(storeFile)) {
			registryFiles.push({
				target: computeTarget(storeFile, true), // → "audio-store.svelte.ts"
				content: fs.readFileSync(storeFile, "utf8"),
				type: "registry:lib",
			});
		}
		if (fs.existsSync(htmlAudioFile)) {
			registryFiles.push({
				target: computeTarget(htmlAudioFile, true), // → "html-audio.ts"
				content: fs.readFileSync(htmlAudioFile, "utf8"),
				type: "registry:lib",
			});
		}
	}

	const { dependencies, registryDependencies } = extractDeps(allFiles, name);

	return {
		$schema: "https://shadcn-svelte.com/schema/registry-item.json",
		name,
		type: "registry:ui",
		title: toTitle(name),
		description: `${toTitle(name)} audio component for svelte-audio-ui.`,
		author: AUTHOR,
		dependencies,
		registryDependencies,
		files: registryFiles,
		docs: `${BASE_URL}/docs/components/${name}`,
		categories: ["audio"],
	};
}

function buildParticleItem(name: string, filePath: string): RegistryItem {
	const { dependencies, registryDependencies } = extractDeps([filePath], name);

	return {
		$schema: "https://shadcn-svelte.com/schema/registry-item.json",
		name,
		type: "registry:block",
		title: toTitle(name),
		description: `${toTitle(name)} particle for svelte-audio-ui.`,
		author: AUTHOR,
		dependencies,
		registryDependencies,
		files: [
			{
				target: computeTarget(filePath),
				content: fs.readFileSync(filePath, "utf8"),
				type: "registry:component",
			},
		],
		docs: `${BASE_URL}/docs/particles`,
		categories: ["audio", "particle"],
	};
}

function buildExampleItem(name: string, filePath: string): RegistryItem {
	const { dependencies, registryDependencies } = extractDeps([filePath], name);

	return {
		$schema: "https://shadcn-svelte.com/schema/registry-item.json",
		name,
		type: "registry:block",
		title: toTitle(name),
		description: `Example: ${toTitle(name)}.`,
		author: AUTHOR,
		dependencies,
		registryDependencies,
		files: [
			{
				target: computeTarget(filePath),
				content: fs.readFileSync(filePath, "utf8"),
				type: "registry:component",
			},
		],
		categories: ["audio", "example"],
	};
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function generateRegistry() {
	ensureDir(OUTPUT_DIR);

	const items: RegistryItem[] = [];

	// 1. Top-level ui/audio folders (provider, player, queue, track, playback-speed)
	const topLevelDirs = fs
		.readdirSync(AUDIO_DIR, { withFileTypes: true })
		.filter((d) => d.isDirectory() && d.name !== "elements" && d.name !== "examples");

	for (const dir of topLevelDirs) {
		const fullDir = path.join(AUDIO_DIR, dir.name);
		const item = buildComponentItem(dir.name, fullDir);
		items.push(item);
		console.log(`  [ui]       ${item.name}`);
	}

	// 2. elements/* folders (fader, knob, slider, sortable-list, wave, waveform, xypad)
	if (fs.existsSync(ELEMENTS_DIR)) {
		const elementDirs = fs
			.readdirSync(ELEMENTS_DIR, { withFileTypes: true })
			.filter((d) => d.isDirectory());

		for (const dir of elementDirs) {
			const fullDir = path.join(ELEMENTS_DIR, dir.name);
			const item = buildComponentItem(dir.name, fullDir);
			items.push(item);
			console.log(`  [element]  ${item.name}`);
		}
	}

	// 3. Particles (src/lib/components/particles/*.svelte)
	if (fs.existsSync(PARTICLES_DIR)) {
		const particleFiles = fs
			.readdirSync(PARTICLES_DIR, { withFileTypes: true })
			.filter((f) => f.isFile() && f.name.endsWith(".svelte"));

		for (const file of particleFiles) {
			const filePath = path.join(PARTICLES_DIR, file.name);
			const baseName = path.basename(file.name, ".svelte");
			const name = `particle-${baseName}`;
			const item = buildParticleItem(name, filePath);
			items.push(item);
			console.log(`  [particle] ${item.name}`);
		}
	}

	// 4. Examples (src/lib/components/ui/audio/examples/*.svelte)
	if (fs.existsSync(EXAMPLES_DIR)) {
		const exampleFiles = fs
			.readdirSync(EXAMPLES_DIR, { withFileTypes: true })
			.filter((f) => f.isFile() && f.name.endsWith(".svelte"));

		for (const file of exampleFiles) {
			const filePath = path.join(EXAMPLES_DIR, file.name);
			const name = path.basename(file.name, ".svelte");
			const item = buildExampleItem(name, filePath);
			items.push(item);
			console.log(`  [example]  ${item.name}`);
		}
	}

	// ── Write individual JSON files ───────────────────────────────────────────
	for (const item of items) {
		const outPath = path.join(OUTPUT_DIR, `${item.name}.json`);
		fs.writeFileSync(outPath, JSON.stringify(item, null, 2), "utf8");
	}

	// ── Write registry index (index.json) ─────────────────────────────────────
	// Index omits content (too large) — just metadata used for browsing
	const indexItem = {
		$schema: "https://shadcn-svelte.com/schema/registry.json",
		name: "svelte-audio-ui",
		homepage: BASE_URL,
		items: items.map((item) => ({
			name: item.name,
			type: item.type,
			title: item.title,
			description: item.description,
			dependencies: item.dependencies,
			registryDependencies: item.registryDependencies,
			files: item.files.map((f) => ({ target: f.target, type: f.type })),
			categories: item.categories,
			docs: item.docs,
		})),
	};

	fs.writeFileSync(
		path.join(OUTPUT_DIR, "index.json"),
		JSON.stringify(indexItem, null, 2),
		"utf8"
	);

	console.log(`\n✓ Generated ${items.length} registry items → static/r/`);
}

console.log("Generating registry…\n");
generateRegistry();
