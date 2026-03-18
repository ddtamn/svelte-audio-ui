---
title: Get Started
description: This guide provides the essentials for adding **audio/ui** components to your React application.
---

## Prerequisites

Our components are built with [Tailwind CSS v4](https://tailwindcss.com). Before you begin, make sure you have a React project set up with Tailwind CSS.

## Registry Configuration

Before adding components, you need to configure the registry in your `components.json` file.

If you don't have a `components.json` file yet, initialize it by running:

```bash
npx shadcn@latest init
```

Then, add the `registries` section to your `components.json` file:

```json {18-18}  title="components.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  },
  "registries": {
    "@audio": "https://audio-ui.xyz/r/{name}.json"
  }
}
```

The `registries` field allows you to configure custom registries. The `{name}` placeholder will be replaced with the component name when fetching from the registry.

## Adding Components

You can add components **automatically with the shadcn CLI** or **manually by copying the files**.
