<script lang="ts">
import * as Sidebar from '$lib/components/ui/sidebar';
import AppSidebar from '$lib/components/app-sidebar.svelte';
    let {children} = $props()
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full h-full px-4 pb-6 md:px-6">
		{@render children?.()}
	</main>
</Sidebar.Provider>