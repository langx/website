/**
 * PostHog, on our own domain.
 *
 * Everything under `/ingest` is forwarded to PostHog's European cloud from
 * Cloudflare's edge instead of being sent there by the visitor's browser. Two
 * reasons, in the order they matter:
 *
 *  - `eu.i.posthog.com` is on every blocklist an ad blocker ships with, so a
 *    page view from a browser running one was never counted at all. Nothing
 *    can block `langx.io/ingest` without blocking the site itself.
 *  - PostHog's own project health check asks for exactly this, which is what
 *    started it.
 *
 * What it does not change: the data still ends up at PostHog, in the same
 * European region, and the visitor's address still reaches it — see
 * `X-Forwarded-For` below. This moves the connection, not the recipient, which
 * is why `/cookie-policy` had a sentence to correct rather than to add.
 *
 * Shaped after the Worker in PostHog's own Cloudflare guide
 * (posthog.com/docs/advanced/proxy/cloudflare), written as a Pages Function
 * because this site is already a Pages project: it then ships with the deploy
 * that needs it, rather than living in a dashboard nobody will think to look
 * at. Wrangler picks the `functions` directory up from its working directory,
 * not from the directory it publishes — see `.github/workflows/deploy.yml`.
 */

const API_HOST = 'eu.i.posthog.com';

/**
 * `recorder.js`, `surveys.js`, `toolbar.js`. This site loads none of them
 * today — no recording, no surveys — but the SDK asks `<api_host>/static/…`
 * for them, and `<api_host>` is now us. Handled so that switching one on stays
 * a config change rather than a debugging session.
 */
const ASSET_HOST = 'eu-assets.i.posthog.com';

/** Ours. What follows it is a path PostHog knows. */
const PREFIX = '/ingest';

export async function onRequest({ request, waitUntil }) {
	const url = new URL(request.url);
	const path = url.pathname.slice(PREFIX.length) || '/';
	const asset = path.startsWith('/static/') || path.startsWith('/array/');
	const target = `https://${asset ? ASSET_HOST : API_HOST}${path}${url.search}`;
	return asset ? retrieveAsset(request, target, waitUntil) : forwardRequest(request, target);
}

/**
 * Assets are public, versioned and identical for everyone, so they are held in
 * the edge cache rather than fetched from PostHog once per visitor. The key is
 * the incoming request — a langx.io URL, which is fine because the mapping to
 * PostHog's URL is one to one.
 */
async function retrieveAsset(request, target, waitUntil) {
	const cached = await caches.default.match(request);
	if (cached) return cached;
	const response = await fetch(target);
	// A `put` can reject — a `Set-Cookie` in the response, a status the cache
	// declines to store. Not being able to cache is not a reason to fail.
	if (response.ok) waitUntil(caches.default.put(request, response.clone()).catch(() => {}));
	return response;
}

/**
 * Everything else — `/e/`, `/i/v0/e/`, `/flags`, the remote config — goes on as
 * it arrived. `new Request(url, request)` carries the method, the body and the
 * headers over, and unlike the headers of an incoming request its own can be
 * edited. Three are:
 */
function forwardRequest(request, target) {
	const forwarded = new Request(target, request);
	// This site writes no cookie and says so, but Cloudflare sets `__cf_bm` on
	// langx.io itself, and a same-origin request would otherwise carry it to a
	// third party that has no use for it.
	forwarded.headers.delete('cookie');
	// Nothing here is authenticated, so a header claiming otherwise is not
	// something to pass on.
	forwarded.headers.delete('authorization');
	// The one thing a proxy would otherwise destroy. Without it PostHog sees
	// this data centre instead of the visitor, and cookieless counting is a
	// hash of that address — a whole country would arrive as one person.
	// `CF-Connecting-IP` is set by Cloudflare and cannot be forged by a client.
	forwarded.headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') ?? '');
	return fetch(forwarded);
}
