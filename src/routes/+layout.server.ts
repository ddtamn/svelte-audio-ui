import { USER_CONFIG_COOKIE_NAME, userConfigSchema } from "$lib/user-config.svelte.js";
import type { LayoutServerLoad } from "./$types.js";

export const load: LayoutServerLoad = async ({ cookies }) => {
	const sidebarState = cookies.get("sidebar_state") === "true" ? true : false;

	const userConfigCookie = cookies.get(USER_CONFIG_COOKIE_NAME);
	let parsedUserConfig = {};
	if (userConfigCookie) {
		try {
			parsedUserConfig = JSON.parse(userConfigCookie);
		} catch {
			/* ignore malformed cookie JSON */
		}
	}
	const userConfigResult = userConfigSchema.safeParse(parsedUserConfig);
	const userConfig = userConfigResult.success ? userConfigResult.data : userConfigSchema.parse({});

	return { sidebarState, userConfig };
};
