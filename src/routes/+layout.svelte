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
	import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
	import { AudioProvider } from "$registry/ui/audio/provider/index.js";
	import { MetaTags } from "svelte-meta-tags";
	import { siteConfig } from "$lib/config.js";
	import posthog from "posthog-js";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";

	injectAnalytics({ mode: dev ? "development" : "production" });
	injectSpeedInsights();

	let { children, data } = $props();

	// svelte-ignore state_referenced_locally
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
	onMount(async () => {
		if (browser) {
			posthog.init("phc_XqpIvSj41JuKZBl9aB64FBEKOAjxbawBzTgkI6mnuKA", {
				api_host: "https://us.i.posthog.com",
				defaults: "2026-01-30",
			});
		}

		return;
	});
</script>

<MetaTags
	title={siteConfig.title}
	description={siteConfig.description}
	keywords={siteConfig.keywords}
	twitter={{
		cardType: "summary_large_image",
		title: siteConfig.title,
		description: siteConfig.description,
		image: siteConfig.ogImage.url,
		site: "@ddtamn",
		creator: "@ddtamn",
	}}
	additionalMetaTags={[
		{
			content: "width=device-width, initial-scale=1",
			name: "viewport",
		},
	]}
	additionalLinkTags={[
		{
			rel: "icon",
			href: "/favicon.ico",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "32x32",
			href: "/favicon-32x32.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "16x16",
			href: "/favicon-16x16.png",
		},
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			href: "/apple-touch-icon.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "192x192",
			href: "/android-chrome-192x192.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "512x512",
			href: "/android-chrome-512x512.png",
		},
	]}
/>

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
