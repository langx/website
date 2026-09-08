import { initAnalytics } from '$lib/analytics';

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

// The root load is the earliest place that runs in the browser on every page,
// which is where PostHog's own SvelteKit guide puts `init`. It is a no-op
// during prerendering and a no-op without a key; see `$lib/analytics`.
export const load = () => {
	initAnalytics();
};
