<script lang="ts">
	import "$lib/styles/app.css";
	import { watch } from "runed";
	import { ModeWatcher, setTheme } from "mode-watcher";
	import SiteHeader from "$lib/components/site-header.svelte";
	import SiteFooter from "$lib/components/site-footer.svelte";
	import { UserConfig, UserConfigContext } from "$lib/user-config.svelte.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { dev } from "$app/environment";
	import { injectAnalytics } from "@vercel/analytics/sveltekit";
	import { AudioProvider } from "$registry/ui/audio/provider/index.js";

	injectAnalytics({ mode: dev ? "development" : "production" });

	let { children, data } = $props();

	const userConfig = UserConfigContext.set(new UserConfig(data.userConfig));

	const themeColors = { light: "#ffffff", dark: "#09090b" };
	const modeClasses = $derived([
		`layout-${userConfig.current.layout}`,
		`theme-${userConfig.current.activeTheme}`,
	]);

	watch.pre(
		() => userConfig.current.activeTheme,
		() => {
			setTheme(userConfig.current.activeTheme);
		}
	);

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

<ModeWatcher
	defaultMode="system"
	disableTransitions
	defaultTheme={userConfig.current.activeTheme}
	{themeColors}
	darkClassNames={["dark", ...modeClasses]}
	lightClassNames={["light", ...modeClasses]}
/>
<Toaster />
<AudioProvider {tracks}>
	<div
		class="before:bg-sidebar relative flex min-h-svh flex-col overflow-clip [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 xl:[--footer-height:calc(var(--spacing)*24)]"
	>
		<SiteHeader />
		<main class="flex flex-1 flex-col">
			<Tooltip.Provider>
				{@render children()}
			</Tooltip.Provider>
		</main>
		<SiteFooter />
	</div>
</AudioProvider>
