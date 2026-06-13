import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Only set CSP for HTML pages, not for assets or API routes
	if (response.headers.get("content-type")?.startsWith("text/html")) {
		const csp = [
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://media.ethicalads.io https://cdn.ethicalads.io https://www.googletagmanager.com",
			"style-src 'self' 'unsafe-inline' https://media.ethicalads.io",
			"img-src 'self' data: blob: https:",
			"font-src 'self' data:",
			"connect-src 'self' blob: https:",
			"frame-src 'self' https://media.ethicalads.io",
			"media-src 'self' blob: https:",
		].join("; ");

		response.headers.set("Content-Security-Policy", csp);
		response.headers.set("X-Content-Type-Options", "nosniff");
		response.headers.set("X-Frame-Options", "DENY");
		response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	}

	return response;
};
