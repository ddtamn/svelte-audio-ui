---
title: Introduction
description: Audio UI components for Svelte 5. Copy, paste, and own your code.
---

**svelte-audio-ui** is a collection of audio UI components built with [Svelte](https://svelte.dev), [Tailwind CSS](https://tailwindcss.com), and on top of [shadcn-svelte](https://shadcn-svelte.com).

It is inspired by [audio-ui](https://audio-ui.xyz)—an audio component system built on top of shadcn/ui for React—but rethought and rebuilt for the Svelte ecosystem.

**This is not a component library. It is how you build your own audio component system.**

## Why

I’ve used a lot of UI libraries over time, and they usually work well at the beginning.

But once you need deeper control—like adjusting behavior, matching a design system, or building something slightly outside the provided components—things start to break down.

You end up:

- wrapping components just to change small behavior details
- overriding styles in ways that feel fragile and hard to maintain
- mixing multiple libraries that don’t share the same API or design language

That friction adds up quickly.

svelte-audio-ui is my attempt to solve that by keeping everything simple:

> give you the actual code, not an abstraction layer

## Not a Component Library

svelte-audio-ui follows the same philosophy as audio-ui and shadcn:

You don’t install it as a dependency.  
You copy the component into your project and own it.

This approach gives you:

- **No Lock-in:** Your components live inside your codebase, so you are never tied to an external package or update cycle that might break your UI.
- **Full Control Over Behavior:** You can change logic, structure, or state handling without needing to wrap or override anything.
- **Long-Term Maintainability:** Instead of fighting abstractions, your components evolve naturally alongside your application.

## Built for Svelte 5

This project is built specifically for modern Svelte, not adapted from another framework.

It uses Svelte 5 patterns and runes to keep components:

- **Explicit and Predictable:** State and reactivity are easy to follow without hidden magic or complex abstractions.
- **Lightweight by Default:** No unnecessary layers, just straightforward component logic that feels close to plain JavaScript.
- **Easy to Extend:** Adding new features or modifying behavior does not require learning a custom API.

The goal is simple: everything should feel like native Svelte code.

## Inspired by shadcn-svelte

The workflow is heavily influenced by [shadcn-svelte](https://shadcn-svelte.com):

- components are copied, not installed
- everything lives in your project
- nothing is hidden behind a package boundary

svelte-audio-ui just narrows the focus into one domain:

**building audio interfaces that are flexible and composable.**

## Composition

Instead of shipping one large “Audio Player” component, the system is built from smaller primitives that can be combined as needed.

Typical building blocks include:

- **Player Controls:** Play, pause, skip, and other interaction elements designed to be reused across different layouts.
- **Timeline / Progress:** A flexible progress system that can be adapted into simple sliders or more advanced scrubbing interactions.
- **Volume Controls:** Independent and composable volume handling that can be reused in different contexts.
- **Optional Layers (Waveform, Metadata):** Additional UI layers that can be plugged in when needed without affecting the core system.

This makes the system flexible enough for both simple players and more complex audio interfaces.

## Beautiful Defaults

Styling is handled with [Tailwind CSS](https://tailwindcss.com), with a focus on clean and consistent defaults.

- **Minimal but Practical:** Components look good out of the box without trying to impose a heavy visual identity.
- **Consistent Across Components:** Spacing, sizing, and interaction patterns are aligned so everything feels like part of the same system.
- **Easy to Customize:** Because styles are local and not abstracted, you can adjust them directly without fighting specificity or overrides.

## AI-Ready

Because everything is just code inside your project, AI tools can work with it more effectively.

- **Readable Structure:** Components follow consistent patterns, making them easier for AI to understand.
- **Extensible System:** AI can help generate new components that match your existing structure and conventions.
- **Faster Iteration:** Instead of starting from scratch, you can evolve your system with AI assistance over time.

## Particles

On top of primitives, there are also [particles](/particles)—pre-built compositions of multiple components.

## Open Source

svelte-audio-ui is open source and built in the open.
I’m working on this as an indie developer, so the project will continue to evolve as I use it in real projects.
If it’s useful for you, feel free to use it, adapt it, or contribute back.
