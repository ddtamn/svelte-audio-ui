---
title: Sortable List
description: A sortable list component with drag-and-drop support.
component: true
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";
	import ComponentSource from "$lib/components/component-source.svelte";

	let { viewerData } = $props();
</script>

<ComponentPreview name="sortable-list-demo" description="A sortable list component with drag-and-drop support." >
	<div></div>

</ComponentPreview>

## Installation

<InstallTabs>

{#snippet cli()}

<PMAddComp name="https://svelte-audio-ui.vercel.app/r/sortable-list.json" />

{/snippet}

{#snippet manual()}

{#if viewerData}
	<ComponentSource item={viewerData} data-llm-ignore />
{:else}
	<p class="text-muted-foreground mt-4 text-sm">Source code not available.</p>
{/if}

{/snippet}

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import {
    SortableList,
    SortableItem,
    SortableDragHandle,
  } from "$lib/components/ui/audio/elements/sortable-list/index.js";
</script>
```

```svelte showLineNumbers
<script lang="ts">
  import {
    SortableList,
    SortableItem,
    SortableDragHandle,
  } from "$lib/components/ui/audio/elements/sortable-list/index.js";

  let items = $state([
    { id: "1", title: "Item 1", description: "Description for item 1" },
    { id: "2", title: "Item 2", description: "Description for item 2" },
    { id: "3", title: "Item 3", description: "Description for item 3" },
  ]);
</script>

<div class="w-full max-w-sm">
  <SortableList bind:items onDrop={(v) => (items = v)}>
    {#snippet item(row)}
      <SortableItem
        class="border-border bg-muted/40 rounded-md border p-3 text-sm"
      >
        <SortableDragHandle />
        <div class="flex flex-col">
          <span class="font-semibold">{row.title}</span>
          <span class="text-muted-foreground text-xs"
            >{row.description}</span
          >
        </div>
      </SortableItem>
    {/snippet}
  </SortableList>
</div>
```

## API Reference

### SortableList

The main container component for sortable items. Built with `svelte-dnd-action` for accessibility and smooth drag-and-drop interactions.

#### Props

| Prop       | Type                                | Description                                                                                                                             |
| ---------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `items`    | `Item[]`                            | Array of items to display (bindable). Each item must have an `id` property.                                                             |
| `onDrop`   | `(items: Item[]) => void`           | Callback fired when items are reordered.                                                                                                |
| `item`     | `Snippet<[Item]>`                   | The snippet block to render each item.                                                                                                  |
| `class`    | `string`                            | Additional CSS classes for the list container.                                                                                          |

### SortableItem

A wrapper component for individual sortable items.

#### Props

| Prop       | Type      | Description                                        |
| ---------- | --------- | -------------------------------------------------- |
| `class`    | `string`  | Additional CSS classes on the inner `div` wrapper. |
| `children` | `Snippet` | Content of the sortable item.                      |

> **Note:** `SortableItem` does not require an `id` prop, as the item layout and ID configuration are managed at the `SortableList` level via `<svelte:animate>`.

### SortableDragHandle

A pre-built drag handle button that uses the sortable component state context to initiate a drag mechanism. Extends your existing `Button` component layout.

#### Props

Inherits all props from shadcn-svelte's `Button` component, overriding `active` states automatically to establish grip interactions.

## Notes

> **Important Information:**
>
> - **Custom Component:** This component is based on the Svelte port of the ui registry. It's a custom component built specifically to enable drag-and-drop reordering of tracks in user interfaces.
> - **Built with svelte-dnd-action:** This component is built on top of `svelte-dnd-action`, which abstracts accessibility attributes.
> - **Drag Handle:** The `SortableDragHandle` component uses shadcn/ui's `Button` component and provides a pre-configured drag handle with localized event listeners contextually bound to the active `SortableList`. Use it to create designated draggable interaction anchors in a list.
> - **Item IDs:** Each item must have a unique `id` property (either string or number). The type requirement is checked internally.
> - **Usage in Audio Components:** This component is used by the `AudioTrackList` internally to enable drag-and-drop reordering of tracks in the queue.
