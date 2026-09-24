import adapter from '@sveltejs/adapter-static';
// Kit 2 no longer re-exports it; it comes from the Vite plugin, a direct
// dependency since the upgrade.
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeTables from './src/lib/utils/rehype-tables.js';

const extensions = ['.svelte', '.md'];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// Root-absolute URLs for build artifacts (/_app/...) and for
		// %sveltekit.assets% in app.html, instead of Kit 2's default of paths
		// relative to the page. Cloudflare Pages answers a missing URL at any
		// depth with 404.html, and there a relative ./_app/... resolves under
		// the missing URL's directory, to another 404: the not-found page lost
		// its styles and its scripts. The site is always served from the
		// domain root, branch previews included, so nothing needs relative ones.
		paths: {
			relative: false
		},
		prerender: {
			handleHttpError: 'warn'
		}
	},
	preprocess: [
		// Consult https://kit.svelte.dev/docs/integrations#preprocessors
		// for more information about preprocessors
		vitePreprocess(),
		mdsvex({
			// '.svelte' belongs here as well as '.md': the legal pages
			// (TermsAndConditions.svelte and friends) are written as markdown
			// inside a component and rely on mdsvex to render it. The cost is
			// that markdown rules apply to every component, so stray top-level
			// markup can get wrapped in a <p> — keep HTML comments out of
			// <svelte:head>.
			extensions: extensions,
			rehypePlugins: [
				rehypeExternalLinks, // Adds 'target' and 'rel' to external links
				rehypeTables, // Scroll wrapper and yes/no marks; see the file
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
	extensions: extensions
};

export default config;
