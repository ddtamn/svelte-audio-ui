import Root from "./audio-player.svelte";
import ControlBar from "./audio-player-control-bar.svelte";
import ControlGroup from "./audio-player-control-group.svelte";
import FastForward from "./audio-player-fast-forward.svelte";
import Play from "./audio-player-play.svelte";
import Rewind from "./audio-player-rewind.svelte";
import SeekBar from "./audio-player-seek-bar.svelte";
import SkipBack from "./audio-player-skip-back.svelte";
import SkipForward from "./audio-player-skip-forward.svelte";
import TimeDisplay from "./audio-player-time-display.svelte";
import Volume from "./audio-player-volume.svelte";

export {
	Root,
	ControlBar,
	ControlGroup,
	FastForward,
	Play,
	Rewind,
	SeekBar,
	SkipBack,
	SkipForward,
	TimeDisplay,
	Volume,

	//
	Root as AudioPlayer,
	ControlBar as AudioPlayerControlBar,
	ControlGroup as AudioPlayerControlGroup,
	FastForward as AudioPlayerFastForward,
	Play as AudioPlayerPlay,
	Rewind as AudioPlayerRewind,
	SeekBar as AudioPlayerSeekBar,
	SkipBack as AudioPlayerSkipBack,
	SkipForward as AudioPlayerSkipForward,
	TimeDisplay as AudioPlayerTimeDisplay,
	Volume as AudioPlayerVolume,
};
