<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import { AudioProvider } from "$registry/ui/audio/provider/index.js";
	let { children } = $props();

	const tracks = [
		{
			id: "1",
			title: "Beautiful Loop",
			artist: "Flavio Concini",
			url: "https://cdn.pixabay.com/audio/2024/10/21/audio_78251ef8e3.mp3",
		},
	];
</script>

<AudioProvider {tracks}>
	<div class="container-wrapper flex flex-1 flex-col px-2">
		<Sidebar.Provider
			class="3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]"
		>
			<AppSidebar />

			<div class="h-full w-full">
				{@render children?.()}
			</div>
		</Sidebar.Provider>
	</div>
</AudioProvider>
