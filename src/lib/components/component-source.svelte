<script lang="ts" module>
	import { createFileTreeForRegistryItemFiles } from "$lib/registry-utils.js";
	import type { Pane } from "paneforge";
	import { ComponentCodeViewerContext } from "$lib/components/component-code-viewer/component-code-viewer.svelte";
	import ComponentCodeViewerCode from "$lib/components/component-code-viewer/component-code-viewer-code.svelte";

	import { MediaQuery } from "svelte/reactivity";

	export interface HighlightedFile {
		type:
			| "registry:file"
			| "registry:page"
			| "registry:ui"
			| "registry:component"
			| "registry:lib"
			| "registry:hook"
			| "registry:theme"
			| "registry:style";
		target: string;
		highlightedContent: string;
	}

	export interface HighlightedBlock {
		name: string;
		description?: string;
		meta?: Record<string, unknown>;
		type: string;
		dependencies?: string[];
		registryDependencies?: string[];
		files: HighlightedFile[];
	}

	type ComponentCodeViewerContextType = {
		item: HighlightedBlock;
		activeFile: string | null;
		resizablePaneRef: Pane | null;
		tree: ReturnType<typeof createFileTreeForRegistryItemFiles> | null;
		highlightedFiles: HighlightedBlock["files"];
		activeFileCodeToCopy: string;
		allowSidebar?: boolean;
	};
</script>

<script lang="ts">
	import PMInstall from "$lib/components/pm-install.svelte";

	let {
		item,
		allowSidebar = false,
	}: Pick<ComponentCodeViewerContextType, "item" | "allowSidebar"> = $props();

	const tree = $derived(createFileTreeForRegistryItemFiles(item.files));
	const highlightedFiles = $derived(item.files);

	function getFirstFileTargetInTree(_tree: typeof tree = tree): string | null {
		if (!_tree?.length) return null;

		for (const node of _tree) {
			if (node.path) return node.path;
			if (node.children) {
				const result = getFirstFileTargetInTree(node.children);
				if (result) return result;
			}
		}
		return null;
	}

	let activeFile = $state<ComponentCodeViewerContextType["activeFile"]>(
		getFirstFileTargetInTree() ?? null
	);
	let resizablePaneRef = $state<Pane>(null!);
	let activeFileCodeToCopy = $state<ComponentCodeViewerContextType["activeFileCodeToCopy"]>("");

	ComponentCodeViewerContext.set({
		get item() {
			return item;
		},
		get activeFile() {
			return activeFile;
		},
		set activeFile(value) {
			activeFile = value;
		},
		get resizablePaneRef() {
			return resizablePaneRef;
		},
		set resizablePaneRef(value) {
			resizablePaneRef = value;
		},
		get tree() {
			return tree;
		},
		get highlightedFiles() {
			return highlightedFiles;
		},
		get activeFileCodeToCopy() {
			return activeFileCodeToCopy;
		},
		set activeFileCodeToCopy(value) {
			activeFileCodeToCopy = value;
		},
		get allowSidebar() {
			return allowSidebar;
		},
	});

	const isMobile = new MediaQuery("(max-width: 768px)");

	const longestFileHeight = $derived.by(() => {
		if (!highlightedFiles || highlightedFiles.length === 0) return "100%";

		const maxLineCount = highlightedFiles.reduce((max, file) => {
			const lineCount = file.highlightedContent.split("\n").length;
			return Math.max(max, lineCount);
		}, 0);

		// Estimate height: ~1.5rem per line (adjust based on your font size)
		return `${maxLineCount * 1.5}rem`;
	});

	const viewportHeight = $derived(
		isMobile.current ? "75dvh" : "calc(100svh - (var(--header-height) * 2))"
	);

	const height = $derived(`min(${longestFileHeight}, ${viewportHeight})`);
</script>

{#if item.dependencies?.length}
	<h3 class="font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
		Install <span class="bg-muted text-muted-foreground rounded-md px-1.5 py-1 text-sm leading-none font-mono font-medium">{item.dependencies.join(' ')}</span> :
	</h3>
	<div class="mt-4">
		<PMInstall command={item.dependencies.join(" ")} />
	</div>
{/if}

<h3 class="font-heading mt-8 mb-4 scroll-m-20 text-xl font-semibold tracking-tight">Copy and paste the following code into your project.</h3>

<figure data-rehype-pretty-code-figure data-llm-ignore id={item.name}>
	<div
		class="group/block-view-wrapper flex w-full min-w-0 flex-col-reverse items-stretch gap-4 overflow-hidden"
		style="--height: {height};"
	>
		<ComponentCodeViewerCode />
	</div>
</figure>
