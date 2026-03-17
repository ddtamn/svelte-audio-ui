<script lang="ts">
	import "$lib/styles/app.css";
	import { watch } from "runed";
	import { ModeWatcher, setTheme } from "mode-watcher";
	import SiteHeader from "$lib/components/site-header.svelte";
	import { UserConfig, UserConfigContext } from "$lib/user-config.svelte.js";
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
<div
	class="before:bg-sidebar relative flex min-h-svh flex-col overflow-clip [--header-height:4rem] before:pointer-events-none before:absolute before:inset-0 before:-z-10"
>
	<SiteHeader />
	{@render children()}
</div>
