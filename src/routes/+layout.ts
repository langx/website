// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

// URLs have no trailing slash: /blog, not /blog/. It is SvelteKit's default,
// written out because svelte.config.js used to carry `trailingSlash: 'always'`
// at its top level, where SvelteKit never reads it — it is a page option, not
// a config key. 'never' prerenders `blog.html`, which Cloudflare Pages serves
// at /blog and reaches from /blog/ with a 308, and the canonicals and sitemap
// are written without the slash to match. Switching to 'always' would move
// every page to `blog/index.html` and flip all three.
export const trailingSlash = 'never';
