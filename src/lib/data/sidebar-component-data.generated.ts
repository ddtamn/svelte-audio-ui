type SidebarItem = {
	title: string;
	url: string;
};

type SidebarGroup = {
	title: string;
	items: SidebarItem[];
};

export const SidebarComponentData: SidebarGroup[] = [
	{ title: "Components", items: [] },
	{ title: "Buttons", items: [] },
	{ title: "Text Animations", items: [] },
];
