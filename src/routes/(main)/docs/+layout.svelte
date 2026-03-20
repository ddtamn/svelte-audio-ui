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
			album: "Pixabay Music",
			url: "https://cdn.pixabay.com/audio/2024/10/21/audio_78251ef8e3.mp3",
			genre: "Upbeat",
		},
		{
			id: "2",
			title: "Type",
			artist: "Aliabbas Abasov",
			album: "Pixabay Music",
			url: "https://cdn.pixabay.com/audio/2024/02/28/audio_60f7a54400.mp3",
			genre: "Hip Hop",
		},
		{
			id: "3",
			title: "Radio Tuxnet",
			artist: "Tuxnet",
			url: "https://radio.sevalla.app/live.aac?host=ice2.tuxnet.me",
			genre: "Hip Hop",
			artwork: "https://audio-ui.xyz/icon",
		},
		{
			id: "4",
			title: "Live Radio",
			artist: "Audio UI",
			url: "https://radio.sevalla.app/live.aac",
			artwork: "https://audio-ui.xyz/icon",
			genre: "Hip Hop",
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
