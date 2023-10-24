import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const extensions = ['.svelte', '.md'];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter()
	},
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: extensions,
			rehypePlugins: [
				rehypeExternalLinks, // Adds 'target' and 'rel' to external links
				rehypeSlug, // Adds 'id' attributes to Headings (h1,h2,etc)
				[
					rehypeAutolinkHeadings,
					{
						// Adds hyperlinks to the headings, requires rehypeSlug
						behavior: 'prepend',
						properties: { className: ['heading-link'], title: 'Permalink', ariaHidden: 'true' },
						content: {
							type: 'element',
							tagName: 'span',
							properties: {},
							children: [{ type: 'text', value: '#' }]
						}
					}
				]
			]
		})
	],
	extensions: extensions,
	trailingSlash: 'always'
};

config.paths = { base: process.argv.includes('dev') ? '' : process.env.BASE_PATH };

export default config;
