export type NavItem = {
	title: string;
	href?: string;
};

export type SidebarNavItem = NavItem & {
	items?: SidebarNavItem[];
};

export const sidebarNavItems: SidebarNavItem[] = [
	{
		title: "Overview",
		items: [
			{
				title: "Introduction",
				href: "/docs/introduction",
			},
			{
				title: "Get Started",
				href: "/docs/get-started",
			},
		],
	},

	{
		title: "Components",
		items: [
			{
				title: "Audio Player",
				href: "/docs/components/audio-player",
			},
			{
				title: "Audio Provider",
				href: "/docs/components/audio-provider",
			},
			{
				title: "Audio Queue",
				href: "/docs/components/audio-queue",
			},
			{
				title: "Audio Track",
				href: "/docs/components/audio-track",
			},
			{
				title: "Audio Playback Speed",
				href: "/docs/components/audio-playback-speed",
			},
		],
	},
	{
		title: "UI",
		items: [
			{
				title: "Fader",
				href: "/docs/ui/fader",
			},
			{
				title: "Knob",
				href: "/docs/ui/knob",
			},
			{
				title: "Slider",
				href: "/docs/ui/slider",
			},
			{
				title: "Sortable List",
				href: "/docs/ui/sortable-list",
			},
			{
				title: "XY Pad",
				href: "/docs/ui/xy-pad",
			},
		],
	},
	{
		title: "Libs",
		items: [
			{
				title: "Audio Store",
				href: "/docs/libs/audio-store",
			},
			{
				title: "HTML Audio",
				href: "/docs/libs/html-audio",
			},
		],
	},
	{
		title: "Resources",
		items: [
			{
				title: "llms.txt",
				href: "/docs/resources/llms-txt",
			},
			{
				title: "llms-full.txt",
				href: "/docs/resources/llms-full-txt",
			},
		],
	},
];

export const mainNavItems: NavItem[] = [
	{ title: "Docs", href: "/docs" },
	{ title: "Particles", href: "/particles" },
];
