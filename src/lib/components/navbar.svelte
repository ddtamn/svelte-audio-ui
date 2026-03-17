<script lang="ts">
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import OriLogoFull from '$lib/assets/ori.svelte';
	import { Button } from './ui/button';
	// import { IconBrandGithub } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';
	import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
	// import Search from '$lib/components/search.svelte';
	import Github from "$lib/icons/github.svelte";

	let stargazersCount = $state(0);
	const CACHE_KEY = 'SVELTE-AUDIO-UI-GITHUB-STARS';
	const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

	import { mode } from 'mode-watcher';

	let theme = $state<string | undefined>('light');

	onMount(() => {
		const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
		if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
			stargazersCount = cached.stars;
		} else {
			fetch('https://api.github.com/repos/TheChirag356/ori-ui')
				.then((res) => res.json())
				.then((data) => {
					stargazersCount = data.stargazers_count;
					localStorage.setItem(
						CACHE_KEY,
						JSON.stringify({ stars: data.stargazers_count, timestamp: Date.now() })
					);
				})
				.catch(() => {
					stargazersCount = 0;
				});
		}
	});

	$effect(() => {
		theme = mode.current;
	});

	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	const navbarItems = [
		{ label: 'Docs', href: '/docs' },
		{ label: 'Particles', href: '/particles' }
	];
</script>

<header class="bg-background sticky top-0 z-50 w-full border-b border-border">
	<div class="container-wrapper 3xl:fixed:px-0 px-6">
		<div class="3xl:fixed:container h-14 flex items-center gap-2">
			<!-- todo:  Mobile Header -->
			<Button class="hidden md:flex" size="sm" variant="ghost">
				<a href="/" class="flex items-center sm:pl-1" aria-label="Home">
					<div
						aria-hidden="true"
						class="flex shrink-0 select-none items-center justify-center gap-1 text-muted-foreground"
					>
						<div class="pointer-events-none size-4 text-foreground sm:size-5">
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
							class="-mt-[2.3px] sm:-mt-[3px] text-balance font-medium font-serif text-xl leading-snug sm:text-2xl"
						>
							audio/ui
						</p>
					</div>
				</a>
			</Button>
			<nav class="hidden md:flex">
					{#each navbarItems as item }
					<Button size="sm" href={item.href} variant="ghost">
						{item.label}
					</Button>
					{/each}
			</nav>
			<div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
				<div class="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
					<!-- Github stars -->
					<ButtonGroup.Root>
						<Button size="icon-sm" variant="outline"> <a
							aria-label="GitHub"
							href="https://github.com/ddtamn/svelte-audio-ui"
							rel="noopener noreferrer"
							target="_blank"
						  >
							<Github class="w-5 h-5" />
						  </a></Button>
						<Button size="sm" variant="outline">{stargazersCount}</Button>
					  </ButtonGroup.Root>
				</div>
			</div>
		</div>
	</div>
</header>
