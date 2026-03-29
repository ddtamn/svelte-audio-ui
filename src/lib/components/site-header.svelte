<script lang="ts">
	import { Button } from "./ui/button";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import MainNav from "./main-nav.svelte";
	import ModeToggle from "./mode-toggle.svelte";
	import LayoutToggle from "./layout-toggle.svelte";
	import MobileNav from "./mobile-nav.svelte";
	import GithubLink from "./github-link.svelte";
	import CommandMenu from "./command-menu/command-menu.svelte";
	import Logo from "./logo.svelte";
	import { mainNavItems } from "$lib/navigation.js";

	let mobileNavRef: { closeMenu: () => void } | undefined;

	function closeMobileMenu() {
		if (mobileNavRef) {
			mobileNavRef.closeMenu();
		}
	}
</script>

<header class="bg-sidebar/80 sticky top-0 z-50 w-full backdrop-blur-sm">
	<div class="container-wrapper 3xl:fixed:px-0 px-6">
		<div
			class="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:h-4!"
		>
			<MobileNav bind:this={mobileNavRef} class="flex lg:hidden" />

			<Button href="/" variant="ghost" size="icon" class="hidden size-8 lg:flex">
				<Logo class="size-5" />
				<span class="sr-only">Svelte Audio UI</span>
			</Button>

			<MainNav items={mainNavItems} class="hidden lg:flex" />
			<div class="ms-auto flex items-center gap-2 md:flex-1 md:justify-end">
				<div class="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
					<!-- (WIP) -->
					<CommandMenu {closeMobileMenu} />
				</div>

				<GithubLink />
				<Separator class="3xl:flex hidden" orientation="vertical" />
				<LayoutToggle class="3xl:flex hidden" />
				<Separator orientation="vertical" />
				<ModeToggle />
			</div>
		</div>
	</div>
</header>
