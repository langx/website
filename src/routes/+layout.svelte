<script lang="ts">
	import { onMount } from 'svelte';
	import { initAnalytics } from '$lib/analytics';
	import '$lib/scss/global.scss';

	/**
	 * Analytics starts here rather than in `+layout.ts`, which is where
	 * PostHog's own SvelteKit guide puts it. That guide assumes a page rendered
	 * per request; every page of this site is prerendered by adapter-static, and
	 * on the first load of a prerendered page SvelteKit hydrates from the
	 * serialised layout data instead of re-running the universal `load`. It only
	 * re-runs on a later client-side navigation, so `load` fired on an internal
	 * link and never on the visit that arrived from outside — which is most of
	 * them.
	 *
	 * Caught in production rather than in review: the deployed bundle carried
	 * the key and the config, and the PostHog chunk was still never fetched.
	 * `onMount` runs on hydration, always, which is what this needs.
	 */
	onMount(initAnalytics);
</script>

<slot />
