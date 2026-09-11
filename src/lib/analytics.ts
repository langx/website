import { browser } from '$app/environment';

/**
 * The site's whole surface onto PostHog.
 *
 * Shaped like the app's `lib/analytics.ts`, and for the same first reason: an
 * optional service degrades rather than crashes. Without a key the SDK is
 * never imported, no request leaves the browser, and every export here is a
 * no-op — which is what a fork, a `npm run dev` and a preview build all get.
 *
 * Four settings below are declarations, not preferences. They are what
 * `/cookie-policy` and `/privacy-policy` say about this site, and those pages
 * are answered from this file; change one and the pages are wrong:
 *
 *  - `cookieless_mode: 'always'` — nothing is written to your browser. No
 *    cookie, no localStorage, no sessionStorage. PostHog counts a visitor with
 *    a hash it computes on its own side from a salt it discards daily, so
 *    there is nothing stored on your device to ask consent for, and the site
 *    keeps its promise of having no cookie banner. **This one has a second
 *    half that lives outside the repository**: the project must have
 *    "Cookieless server hash mode" switched on, or ingestion drops every event
 *    the setting below produces. Nothing warns you — the request is accepted,
 *    answered `{"status":"Ok"}`, and the event never appears. It cost an
 *    afternoon and two days of traffic to find, so: if the site looks
 *    instrumented and PostHog is empty, check that setting before anything
 *    here.
 *  - `person_profiles: 'never'` — no person record is created and `identify()`
 *    is a no-op. This site has no accounts; identity lives in the app.
 *  - `disable_session_recording: true` — no recordings, the same answer the app
 *    gives.
 *  - `autocapture: false` — clicks are not swept up wholesale. What is sent is
 *    the page you are on plus the closed list of events in `SiteEvent` below,
 *    which is the only reason a page like `/privacy-policy` can describe this
 *    in a sentence rather than a paragraph of caveats.
 *
 * The cost of cookieless is real and worth stating rather than discovering: a
 * returning visitor is a new one tomorrow. This measures which pages get read
 * and which links get clicked, never retention.
 *
 * EU Cloud, because the users are — the same host the app defaults to, and as
 * of September 2026 the same *project*: PostHog's free plan allows exactly one,
 * so the site writes into the app's rather than a "LangX Web" of its own. That
 * is why every event leaves here stamped with `langx_surface` — see
 * `before_send` below. If the plan ever gains a second project, splitting them
 * is a key change and a stamp that stops mattering, nothing more.
 */

/**
 * Events do not leave for `eu.i.posthog.com` any more; they go to `/relay/` on
 * whatever origin served the page, and `functions/relay/[[path]].js` forwards
 * them from Cloudflare's edge. The reason is the one PostHog's own setup check
 * gives: its ingestion host is on every blocklist worth the name, so page views
 * were being dropped before they were sent, silently and in unknown numbers. A
 * first-party path is not blocked, because blocking it would break the site.
 *
 * This changes who the browser connects to and nothing about what is sent, and
 * that distinction is the one `/cookie-policy` §3.4 now draws for the reader.
 *
 * The path has to match `PREFIX` in the Function. It is not `/ingest`, which is
 * what PostHog's guide suggests and therefore the first thing a list will learn.
 */
const PROXY_PATH = '/relay';

/**
 * Vite inlines `VITE_*` at build time and leaves it `undefined` when unset,
 * which is exactly the graceful-degradation this file needs. SvelteKit's
 * `$env/static/public` is the more idiomatic import, but it is a build error
 * rather than an `undefined` when the variable is missing, and a missing key
 * has to stay a no-op here rather than break `npm run build` for anyone who
 * clones this repository.
 */
const apiKey = (import.meta.env.VITE_POSTHOG_KEY as string | undefined) || null;

/**
 * The escape hatch, and the only way left to talk to PostHog directly: set
 * `VITE_POSTHOG_HOST` to `https://eu.i.posthog.com`. `npm run dev` serves no
 * Pages Function, so a key set locally needs it; unset, as it is in CI and for
 * anyone who clones this, the proxy is what runs.
 */
const apiHostOverride = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || null;

/**
 * Every event this site is allowed to send, as a closed union — the same
 * device the app uses to keep the list short and reviewable. Adding a member
 * is a deliberate act that should come with a line in the privacy policy.
 *
 *  - `download_clicked` — a click on any link that leaves for the app: the
 *    download page, the web app, or either store listing.
 *  - `newsletter_subscribed` — the newsletter form came back ok. The address
 *    itself is never a property; the API already has it.
 */
export type SiteEvent =
	| { name: 'download_clicked'; properties: { destination: string; location: string } }
	| { name: 'newsletter_subscribed'; properties?: never };

/** The hosts a `download_clicked` is worth recording for. */
const APP_HOSTS = ['get.langx.io', 'app.langx.io', 'apps.apple.com', 'play.google.com'];

/**
 * The package's default entry. `dist/module.no-external.js` was tried here, on
 * the theory that compiling PostHog's extensions in would stop the SDK fetching
 * anything from its asset CDN, and made no difference — but measured against
 * the built, prerendered output the default entry makes no asset-CDN or /flags
 * request either. The earlier observation of both came from `vite preview`, so
 * treat request counts as something to re-measure on a real build rather than
 * to assume from a dev server.
 */
type PostHog = typeof import('posthog-js').default;

let client: PostHog | null = null;
let starting: Promise<void> | null = null;

/**
 * Starts the SDK and the one listener that feeds it.
 *
 * Called from the root layout's `onMount`, not its `load`: every page here is
 * prerendered, and SvelteKit hydrates a prerendered page from serialised data
 * rather than re-running the universal `load`, so `load` never fired on a visit
 * arriving from outside. The `browser` guard stays anyway — it costs nothing
 * and keeps the rule in one place rather than in the caller.
 */
export function initAnalytics(): void {
	if (!browser || !apiKey || starting) return;
	starting = (async () => {
		try {
			const { default: posthog } = await import('posthog-js');
			posthog.init(apiKey, {
				// `window` rather than a hardcoded https://langx.io: the same bundle
				// is what a branch preview on pages.dev serves, and each carries its
				// own copy of the Function.
				api_host: apiHostOverride ?? `${window.location.origin}${PROXY_PATH}`,
				// Where the *dashboard* lives, which the SDK can no longer infer once
				// `api_host` is ours. Only links out of the toolbar use it, and the
				// toolbar is not loaded here — it is set so the day something does
				// need it, it does not point at langx.io.
				ui_host: 'https://eu.posthog.com',
				// Pins the SDK's behaviour to a dated set of defaults rather than
				// to whatever the latest version decides. This one turns
				// `capture_pageview` into 'history_change', which is what makes
				// SvelteKit's client-side navigations count as page views without
				// a hook of our own.
				defaults: '2026-05-30',
				cookieless_mode: 'always',
				person_profiles: 'never',
				disable_session_recording: true,
				autocapture: false,
				// One project, two products. `$lib` ('web' here, 'posthog-react-native'
				// in the app) would already tell them apart, but a dashboard filter
				// should rest on a name we chose rather than on an SDK's internal
				// detail. Stamped in `before_send` rather than `register()` because
				// the first `$pageview` is captured during `init` and would miss a
				// super property set on the line after it.
				before_send: (event) => {
					if (event) event.properties.langx_surface = 'website';
					return event;
				},
				// Feature flags need a stable identity, which cookieless
				// deliberately does not have, so nothing here could use one.
				// Measured against an invalid key the SDK still called `/flags`
				// once on load despite this; that may be a fallback for a remote
				// config it could not fetch, and it was not worth a real key to
				// find out. Treat the switch as intent, not as a promise about
				// the request count.
				advanced_disable_flags: true
			});
			/**
			 * The first page has to be captured by hand, and this is not a
			 * belt-and-braces call — without it the landing page is never
			 * counted at all.
			 *
			 * `defaults: '2026-05-30'` sets `capture_pageview: 'history_change'`,
			 * and that mode is exactly what it says: the SDK wraps `pushState`,
			 * `replaceState` and `popstate` and captures a page view when one of
			 * them changes the path. A visit that arrives from outside changes
			 * nothing — it *is* the first path — so the only page views that were
			 * being recorded were internal link clicks, and a marketing site's
			 * traffic is mostly people who read one page and leave.
			 *
			 * Measured rather than reasoned about: on a cold load the network tab
			 * shows no request to the relay at all, and clicking an internal link
			 * immediately shows one. The duplicate this might look like cannot
			 * happen — the history hook only captures when the path, search or
			 * hash differs from the last one it saw.
			 */
			posthog.capture('$pageview');
			client = posthog;
			listenForAppLinks();
		} catch {
			// Blocked, offline, or a chunk that never arrived. The site does not
			// depend on this and must not announce it.
		}
	})();
}

/** Sends one of the events named above. A no-op until the SDK is up. */
export function track(event: SiteEvent): void {
	client?.capture(event.name, event.properties);
}

/**
 * One delegated listener instead of a handler on each of the ~15 "Start for
 * free" buttons scattered across the marketing pages and the tools. Catches
 * clicks that are routed through a child element too, which a per-button
 * handler would also have to.
 */
function listenForAppLinks(): void {
	document.addEventListener(
		'click',
		(event) => {
			const target = event.target;
			if (!(target instanceof Element)) return;
			const link = target.closest('a');
			if (!link?.href) return;
			let host: string;
			try {
				host = new URL(link.href).host;
			} catch {
				return;
			}
			if (!APP_HOSTS.includes(host)) return;
			track({
				name: 'download_clicked',
				properties: { destination: host, location: window.location.pathname }
			});
		},
		// Capture phase: the click still counts if something downstream stops
		// the event from bubbling.
		{ capture: true }
	);
}
