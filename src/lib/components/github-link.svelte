<script lang="ts">
	import { siteConfig } from "$lib/config.js";
	import Button from "$lib/components/ui/button/button.svelte";
	import GithubIcon from "./github.svelte";
	import { onMount } from "svelte";

	let stars = $state(0);
	const CACHE_KEY = "SVELTE-AUDIO-UI-GITHUB-STARS";
	const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

	async function getGithubStarCount() {
		try {
			const res = await fetch("https://api.github.com/repos/ddtamn/svelte-audio-ui");
			const data = await res.json();
			localStorage.setItem(
				CACHE_KEY,
				JSON.stringify({ stars: data.stargazers_count, timestamp: Date.now() })
			);
			return data.stargazers_count ?? 0;
		} catch (error) {
			console.error(error);
			return 0;
		}
	}

	onMount(async () => {
		const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
		if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
			stars = cached.stars;
		} else {
			stars = await getGithubStarCount();
		}
	});
</script>

<Button
	href={siteConfig.links.github}
	target="_blank"
	rel="noreferrer"
	size="sm"
	variant="ghost"
	class="h-8 shadow-none"
>
	<GithubIcon />
	<span class="text-muted-foreground text-xs tabular-nums">
		{stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars.toLocaleString()}
	</span>
</Button>
