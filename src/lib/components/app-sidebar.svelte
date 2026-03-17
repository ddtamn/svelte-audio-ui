<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { onMount, type ComponentProps } from 'svelte';
	import { SidebarData } from '$lib/data/sidebar-data';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
	type SidebarItem = {
		title: string;
		url?: string;
		isActive?: boolean;
		badge?: string;
		icon?: any;
		items?: SidebarItem[];
	};
	type SidebarSection = {
		title: string;
		url: string;
		items: SidebarItem[];
	};
	let data = $state<{ navMain: SidebarSection[] }>({
		navMain: [
			...SidebarData
		]
	});

	const setActiveRecursive = (items: SidebarItem[], url: string): boolean => {
		let anyActive = false;
		for (const item of items) {
			const selfActive = item.url === url;
			const childActive = item.items ? setActiveRecursive(item.items, url) : false;
			item.isActive = selfActive || childActive;
			anyActive ||= item.isActive;
		}
		return anyActive;
	};

	let updateIsActive = (url: string) => {
		for (const section of data.navMain) {
			setActiveRecursive(section.items, url);
		}
	};

	let currentPath = $state('');

	onMount(() => {
		currentPath = page.url.pathname;
		updateIsActive(currentPath);
	});
</script>

<Sidebar.Root class="mt-16 h-[calc(100vh-4rem)] pr-2 pl-6" {...restProps} bind:ref>
	<Sidebar.Content class="thin-scrollbar bg-background mb-4 gap-0 pt-6">
		{#each data.navMain as item (item.title)}
			<Sidebar.Group class="p-0">
				<Sidebar.GroupLabel class="text-muted-foreground text-xs">
					{item.title}
				</Sidebar.GroupLabel>
				<div class="mb-2">
					<Sidebar.GroupContent>
						<Sidebar.Menu class="gap-0.5">
							{#each item.items as subItem (subItem.title)}
								<Sidebar.MenuItem>
									{#if subItem.items?.length}
										<Sidebar.MenuButton
											isActive={subItem.isActive}
											class="hover:text-accent text-foreground hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent data-[active=true]:font-normal data-[active=true]:text-accent"
										>
											{subItem.title}
										</Sidebar.MenuButton>
										<Sidebar.MenuSub>
											{#each subItem.items as subSubItem (subSubItem.title)}
												<Sidebar.MenuSubItem>
													<Sidebar.MenuSubButton
														isActive={subSubItem.isActive}
														onclick={() => {
															if (subSubItem.url) updateIsActive(subSubItem.url);
														}}
													>
														{#snippet child({ props })}
															<a href={subSubItem.url} {...props}>
																{subSubItem.title}
															</a>
														{/snippet}
													</Sidebar.MenuSubButton>
												</Sidebar.MenuSubItem>
											{/each}
										</Sidebar.MenuSub>
									{:else}
										<Sidebar.MenuButton
											isActive={subItem.isActive}
											class="hover:text-accent text-foreground active:text-accent hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent data-[active=true]:font-normal data-[active=true]:text-accent"
											onclick={() => {
												if (subItem.url) updateIsActive(subItem.url);
											}}
										>
											{#snippet child({ props })}
												{@const Icon = subItem.icon}
												<a href={subItem.url} {...props}>
													{#if subItem.icon}
														<Icon class="size-8" />
													{/if}
													{subItem.title}
												</a>
											{/snippet}
										</Sidebar.MenuButton>
									{/if}
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</div>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
</Sidebar.Root>
