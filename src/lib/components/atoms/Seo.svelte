<script lang="ts">
	import {
		description as defaultDescription,
		image,
		keywords,
		title as defaultTitle,
		siteBaseUrl
	} from '$lib/data/meta';

	/** Page title. Suffixed with the brand, except on the homepage. */
	export let title: string | null = null;
	export let description: string = defaultDescription;
	/** Path, not a full URL — e.g. `/pro`. */
	export let path: string = '';

	$: pageTitle = title ? `${title} | LangX` : defaultTitle;
	$: canonical = `${siteBaseUrl}${path}`;
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	<meta name="keywords" content={keywords.join(', ')} />

	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />

	<title>{pageTitle}</title>
	<meta property="og:title" content={pageTitle} />
	<meta name="twitter:title" content={pageTitle} />

	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />
	<meta name="twitter:image" content={image} />

	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
