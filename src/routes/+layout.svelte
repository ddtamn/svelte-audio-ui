<script lang="ts">
	import '$lib/styles/app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/navbar.svelte';

	let { children } = $props();
</script>

<ModeWatcher />
<Navbar/>
{@render children()}
