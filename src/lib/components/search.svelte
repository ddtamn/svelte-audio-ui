<script lang="ts">
  import * as Command from "$lib/components/ui/command";
  import { onMount } from "svelte";
  import { toggleMode, mode } from "mode-watcher";

  let open = $state(false); // Svelte 5 state (or let open = false in Svelte 4)

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open = !open;
    }
  }
  import { SidebarComponentData } from "$lib/data/sidebar-component-data.generated";

  const documentations = [
    { title: "Introduction", href: "/docs/introduction" },
    { title: "Installation", href: "/docs/installation" },
  ];
  const components = SidebarComponentData[0].items.map((item) => ({
    title: item.title,
    href: item.url,
  }));

  const buttons = SidebarComponentData[1].items.map((item) => ({
    title: item.title,
    href: item.url,
  }));

  const textAnimations = SidebarComponentData[2].items.map((item) => ({
    title: item.title,
    href: item.url,
  }));

  function navigate(href: string) {
    window.location.href = href;
    open = false;
  }
</script>

<svelte:document onkeydown={handleKeydown} />

<button 
  onclick={() => (open = true)}
  class="relative md:inline-flex h-9 w-full items-center justify-start rounded-[0.5rem] hidden border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-40 lg:w-64"
>
  <span class="inline-flex">Search documentation...</span>
  <kbd class="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
    <span class="text-xs">⌘</span>K
  </kbd>
</button>

<Command.Dialog bind:open>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>

    <Command.Group heading="General">
      <Command.Item onSelect={toggleMode}>
        <span>Toggle {mode.current === "light" ? "Dark" : "Light"} Mode</span>
      </Command.Item>
    </Command.Group>
    
    <Command.Group heading="Documentation">
      {#each documentations as docs}
        <Command.Item onSelect={() => navigate(docs.href)}>
          <span>{docs.title}</span>
        </Command.Item>
      {/each}
    </Command.Group>

    <Command.Separator />

    <Command.Group heading="Components">
      {#each components as comp}
        <Command.Item onSelect={() => navigate(comp.href)}>
          <span>{comp.title}</span>
        </Command.Item>
      {/each}
    </Command.Group>

    <Command.Separator />

    <Command.Group heading="Buttons">
      {#each buttons as button}
        <Command.Item onSelect={() => navigate(button.href)}>
          <span>{button.title}</span>
        </Command.Item>
      {/each}
    </Command.Group>

    <Command.Separator />

    <Command.Group heading="Text Animations">
      {#each textAnimations as textAnimation}
        <Command.Item onSelect={() => navigate(textAnimation.href)}>
          <span>{textAnimation.title}</span>
        </Command.Item>
      {/each}
    </Command.Group>
  </Command.List>
</Command.Dialog>