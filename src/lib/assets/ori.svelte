<script lang="ts">
	import { cn } from '$lib/utils';
	import { mode } from 'mode-watcher';
	let { class: className }: { class?: string } = $props();

	let ui_mode = $state(mode.current);
</script>

<img
	src={ui_mode === 'dark' || ui_mode === undefined
		? '/assets/logo/ori-dark.svg'
		: '/assets/logo/ori-light.svg'}
	alt="Ori Logo"
	loading="eager"
	height="30"
	width="30"
	class={cn('', className)}
/>
