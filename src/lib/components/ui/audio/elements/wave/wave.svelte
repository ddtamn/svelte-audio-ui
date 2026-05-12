<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = "" }: Props = $props();
</script>

<div class="flex items-center justify-center rounded-md border border-dashed p-8 {className}">
	<span class="text-muted-foreground text-sm">Wave Component</span>
</div>
