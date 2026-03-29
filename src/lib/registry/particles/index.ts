import type { Component } from "svelte";
import Player from "./player.svelte";
import PlayerWidget from "./player-widget.svelte";

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
];
