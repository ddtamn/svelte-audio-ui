<script lang="ts">
	import { Canvas } from "@threlte/core";
	import Scene from "./plasma-grid-scene.svelte";
	import { cn } from "$lib/utils";
	// NoToneMapping is value 0 in Three.js — avoid static import for code-splitting
	const NoToneMapping = 0;
	import type { ComponentProps } from "svelte";

	type SceneProps = ComponentProps<typeof Scene>;

	interface Props {
		/**
		 * The base background color of the effect.
		 * @default "#111113"
		 */
		color?: SceneProps["color"];
		/**
		 * The color used for the plasma noise gradients.
		 * @default "#FF6900"
		 */
		highlightColor?: SceneProps["highlightColor"];
		/**
		 * Additional CSS classes for the container.
		 */
		class?: string;
		[key: string]: unknown;
	}

	let { color, highlightColor, class: className = "", ...rest }: Props = $props();

	const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
</script>

<div class={cn("relative h-full w-full overflow-hidden", className)} {...rest}>
	<div class="absolute inset-0 z-0">
		<Canvas {dpr} toneMapping={NoToneMapping}>
			<Scene {color} {highlightColor} />
		</Canvas>
	</div>
</div>
