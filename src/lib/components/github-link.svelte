<script lang="ts">
	import { siteConfig } from "$lib/config.js";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
	import GithubIcon from "./github.svelte";
	import { onMount } from "svelte";

	const FALLBACK_STAR_COUNT = 9600;

	async function getGithubStarCount() {
		try {
			const res = await fetch("https://ungh.cc/repos/ddtamn/svelte-audio-ui");
			const data = await res.json();
			return data.repo?.stars ?? FALLBACK_STAR_COUNT;
		} catch (error) {
			console.error(error);
			return FALLBACK_STAR_COUNT;
		}
	}

	let stars = $state(FALLBACK_STAR_COUNT);

	onMount(async () => {
		stars = await getGithubStarCount();
	});
</script>

<ButtonGroup.Root>
	<Button size="icon-sm" variant="outline">
		<a
			aria-label="GitHub"
			href={siteConfig.links.github}
			rel="noopener noreferrer"
			target="_blank"
		>
			<GithubIcon />
		</a></Button
	>
	<Button size="sm" variant="outline"
		>{stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars.toLocaleString()}</Button
	>
</ButtonGroup.Root>
