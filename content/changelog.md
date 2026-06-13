---
title: Changelog
description: Release history and version changes for svelte-audio-ui.
---

<script>
  import Callout from '$lib/components/callout.svelte';
  import InfoIcon from "@lucide/svelte/icons/info";
</script>

<br>

This page documents the release history of **svelte-audio-ui**. Each release includes detailed changelogs covering new features, bug fixes, breaking changes, and improvements.

<Callout variant="info" title="Versioning">
  <p slot="description">
    This project follows <a href="https://semver.org" target="_blank" rel="noreferrer">Semantic Versioning</a> (SemVer). Given the 0.x major version, breaking changes may occur between minor versions until the 1.0.0 release.
  </p>
</Callout>

## 0.0.1 — Initial Release

**Release Date:** TBD

### Features

- **Audio Provider** — Central audio engine using Svelte 5 context, managing playback state, event listeners, error retries, and track preloading
- **Audio Player** — Composable player with play/pause, seek bar, time display, skip, rewind, fast forward, and volume controls
- **Audio Queue** — Queue management with shuffle, repeat modes, and insert position configuration
- **Audio Track** — Track display with cover art, metadata, and playback state
- **Audio Playback Speed** — Speed control with presets (0.5x – 2x)
- **UI Components** — Fader, Knob, Slider, Sortable List, and XY Pad
- **Particles** — Pre-built audio visualizers: Player Widget, Pocket Synth, Wave Shaper
- **Context-based Architecture** — Each `AudioProvider` owns its own `HtmlAudio` and `AudioStore` instance, enabling multiple independent players
- **State Persistence** — Configurable `localStorage` persistence per provider via `storageKey` prop
- **Live Stream Support** — Automatic live stream detection with disabled controls and LIVE badge
- **Registry System** — shadcn-svelte compatible CLI installation via component registry

### What's Next

- Unit and integration tests
- Additional audio visualizations
- Improved accessibility patterns
- More configuration options for existing components

---

_For the full commit history, visit the [GitHub repository](https://github.com/ddtamn/svelte-audio-ui)._
