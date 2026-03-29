import type { Component } from "svelte";
import Player from "./player.svelte";
import PlayerWidget from "./player-widget.svelte";
import PocketSynth from "./pocket-synth.svelte";
import WaveShaper from "./wave-shaper.svelte";
import TrackListDemo from "$registry/examples/track-list-demo.svelte";
import TrackListGridDemo from "$registry/examples/track-list-grid-demo.svelte";
import TrackSortableListDemo from "$registry/examples/track-sortable-list-demo.svelte";
import TrackSortableListGridDemo from "$registry/examples/track-sortable-list-grid-demo.svelte";
import QueueAllControlsDemo from "$registry/examples/queue-all-controls-demo.svelte";

type ParticleItem = {
	id: string;
	description: string;
	component: Component;
	fullWidth?: boolean;
	category?: string[];
};

export const particles: ParticleItem[] = [
	{
		id: "particle-player",
		description: "Audio Player",
		component: Player,
		category: ["player"],
	},
	{
		id: "particle-player-widget",
		description: "Audio Player Widget",
		component: PlayerWidget,
		category: ["player", "track"],
	},
	{
		id: "queue-all-controls-demo",
		description: "Queue with all controls",
		component: QueueAllControlsDemo,
		category: ["queue"],
	},
	{
		id: "track-list-demo",
		description: "Track list with selection example",
		component: TrackListDemo,
		category: ["track"],
	},
	{
		id: "track-list-grid-demo",
		description: "Track list with grid layout example",
		component: TrackListGridDemo,
		category: ["track", "grid"],
	},
	{
		id: "track-sortable-list-demo",
		description: "Track list with sortable selection example",
		component: TrackSortableListDemo,
		category: ["track", "sortable"],
	},
	{
		id: "track-sortable-list-grid-demo",
		description: "Track list with sortable selection and grid layout example",
		component: TrackSortableListGridDemo,
		category: ["track", "sortable", "grid"],
	},
	{
		id: "particle-pocket-synth",
		description: "Pocket synth",
		component: PocketSynth,
		category: ["synth"],
	},
	{
		id: "particle-wave-shaper",
		description: "Wave Shaper",
		component: WaveShaper,
		category: ["synth"],
	},
];
