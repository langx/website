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
 *    keeps its promise of having no cookie banner.
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

const DEFAULT_HOST = 'https://eu.i.posthog.com';

/**
 * Vite inlines `VITE_*` at build time and leaves it `undefined` when unset,
 * which is exactly the graceful-degradation this file needs. SvelteKit's
 * `$env/static/public` is the more idiomatic import, but it is a build error
 * rather than an `undefined` when the variable is missing, and a missing key
 * has to stay a no-op here rather than break `npm run build` for anyone who
 * clones this repository.
 */
const apiKey = (import.meta.env.VITE_POSTHOG_KEY as string | undefined) || null;
const apiHost = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || DEFAULT_HOST;

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
 * The package's default entry. The `dist/module.no-external.js` build was tried
 * here, on the theory that compiling PostHog's extensions in would stop the SDK
 * fetching anything from its asset CDN — it does exactly that on
 * token.langx.io, which uses the `array.no-external` build. It made no
 * difference from this entry point: the network log still shows the request to
 * eu-assets.i.posthog.com. Not worth a fragile deep import into `dist/` for
 * nothing, so this stays the plain import and section 3.4 of the cookie policy
 * names that request rather than pretending it away.
 */
type PostHog = typeof import('posthog-js').default;

let client: PostHog | null = null;
let starting: Promise<void> | null = null;

/**
 * Starts the SDK and the one listener that feeds it.
 *
 * Called from the root layout's `load`, which runs at prerender time as well
 * as in the browser — hence the `browser` guard rather than a check inside the
 * caller, so there is one place that knows this must not run on the server.
 */
export function initAnalytics(): void {
	if (!browser || !apiKey || starting) return;
	starting = (async () => {
		try {
			const { default: posthog } = await import('posthog-js');
			posthog.init(apiKey, {
				api_host: apiHost,
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
