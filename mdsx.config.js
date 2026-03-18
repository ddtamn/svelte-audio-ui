import { defineConfig } from "mdsx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

export const mdsxConfig = defineConfig({
	extensions: [".md"],
	remarkPlugins: [remarkGfm],
	rehypePlugins: [rehypeSlug],
});
