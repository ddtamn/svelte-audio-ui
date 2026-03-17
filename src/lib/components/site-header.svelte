<script lang="ts">
	import { Button } from "./ui/button";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import MainNav from "./main-nav.svelte";
	import ModeToggle from "./mode-toggle.svelte";
	import LayoutToggle from "./layout-toggle.svelte";
	import MobileNav from "./mobile-nav.svelte";
	import GithubLink from "./github-link.svelte";
	import CommandMenu from "./command-menu/command-menu.svelte";
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

			<Button class="hidden md:flex" size="sm" variant="ghost">
				<a href="/" class="flex items-center sm:pl-1" aria-label="Home">
					<div
						aria-hidden="true"
						class="text-muted-foreground flex shrink-0 items-center justify-center gap-1 select-none"
					>
						<div class="text-foreground pointer-events-none size-4 sm:size-5">
							<svg
								fill="none"
								height="24"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								width="24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>Svelte Audio UI</title>
								<path d="M2 10v3" />
								<path d="M6 6v11" />
								<path d="M10 3v18" />
								<path d="M14 8v7" />
								<path d="M18 5v13" />
								<path d="M22 10v3" />
							</svg>
						</div>
						<p
							class="-mt-[2.3px] font-serif text-xl leading-snug font-medium text-balance sm:-mt-[3px] sm:text-2xl"
						>
							audio/ui
						</p>
					</div>
				</a>
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
