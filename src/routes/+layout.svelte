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
