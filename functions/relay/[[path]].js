/**
 * The site's reverse proxy onto PostHog.
 *
 * A Cloudflare Pages Function, because it is the only server this site has:
 * `adapter-static` produces files and nothing that runs, and this runs on the
 * same edge that serves them. Everything under `/relay/` is forwarded to
 * PostHog's EU cloud and the answer handed back unchanged. Nothing else on
 * langx.io reaches this file — Wrangler generates a `_routes.json` from this
 * directory and Pages invokes a Function only for the paths in it, so a page
 * view of `/blog/` is served exactly as it was before.
 *
 * Why proxy at all: `src/lib/analytics.ts` used to send its page views to
 * `eu.i.posthog.com`, and every widely used blocklist carries that host, so an
 * unknowable share of visits was never counted — which is what PostHog's own
 * setup check means by its "Reverse proxy" warning. Requests to langx.io are
 * not on any list, because a list cannot block them without breaking the site.
 * That is the honest description of what this buys: a more complete count,
 * bought by not looking like analytics from the outside. It is worth saying
 * plainly, so `/cookie-policy` §3.4 says it too rather than leaving it to be
 * discovered in a network tab.
 *
 * What is sent does not change. Same page views, same two events, still
 * cookieless, still nothing written to the visitor's browser. PostHog receives
 * the same request it would have received directly, minus the `cookie` header,
 * which is dropped below.
 *
 * Two hosts, because PostHog splits ingestion from the scripts its lazily
 * loaded extensions fetch. The site bundles the SDK from npm and turns those
 * extensions off, so `/static/` is expected to stay unused here; it is
 * forwarded anyway, since the alternative is an unexplained 404 the day one of
 * them is switched on.
 *
 * How it gets deployed is in `.github/workflows/deploy.yml`: Wrangler looks
 * for `functions/` in its working directory, not inside the directory it
 * publishes, so the build artifact carries this tree alongside `build/`.
 */

const API_HOST = 'eu.i.posthog.com';
const ASSET_HOST = 'eu-assets.i.posthog.com';

/**
 * The prefix this Function is mounted on, stripped before forwarding. It has
 * to match `PROXY_PATH` in `src/lib/analytics.ts`, and it is deliberately not
 * called `/ingest` — that is the path PostHog's own guide suggests, which
 * makes it the one a blocklist can learn.
 */
const PREFIX = '/relay';

/** @param {{ request: Request }} context */
export async function onRequest({ request }) {
	const url = new URL(request.url);
	const path = url.pathname.slice(PREFIX.length) || '/';
	const host = path.startsWith('/static/') ? ASSET_HOST : API_HOST;

	// `new Request(url, request)` keeps the method, headers and body and only
	// changes where it is going. No cache of our own: Workers' `fetch` already
	// puts GET subrequests through Cloudflare's cache under the origin's own
	// headers, which is the right answer for `/static/` and a no-op for the
	// POSTs that carry events.
	const forwarded = new Request(`https://${host}${path}${url.search}`, request);

	// Nothing on this site sets a cookie, but the domain is shared with things
	// that do, and a proxy that quietly forwards them to a third party would
	// make `/cookie-policy` wrong. Analytics here is cookieless by design; this
	// keeps it that way at the hop as well as in the browser.
	forwarded.headers.delete('cookie');

	return fetch(forwarded);
}
