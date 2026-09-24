<script lang="ts">
	import {
		description as defaultDescription,
		image,
		imageAlt,
		imageHeight,
		imageWidth,
		keywords as defaultKeywords,
		title as defaultTitle,
		siteBaseUrl
	} from '$lib/data/meta';

	interface Props {
		/** Page title. Suffixed with the brand unless it is long, and never on the homepage. */
		title?: string | null;
		description?: string;
		/** Path, not a full URL — e.g. `/plans`. */
		path?: string;
		/** Kept out of the index, for pages like the 404 that must not rank. */
		noindex?: boolean;
		keywords?: string[];
		/** `article` on posts; everything else is a `website`. */
		type?: 'website' | 'article';
		/** Absolute URL of a page-specific social card; the site card otherwise. */
		ogImage?: string | null;
		ogImageAlt?: string | null;
	}

	let {
		title = null,
		description = defaultDescription,
		path = '',
		noindex = false,
		keywords = defaultKeywords,
		type = 'website',
		ogImage = null,
		ogImageAlt = null
	}: Props = $props();

	// A long title already fills a results line; the suffix would only push
	// the words that matter past the cut. It goes on only when the whole fits
	// the sixty characters a results line shows: at 56, as it was, a title of
	// 53 to 56 came out at 61 to 64, and that was more than a hundred pages.
	const SUFFIX = ' | LangX';
	let pageTitle = $derived(
		title ? (title.length + SUFFIX.length > 60 ? title : `${title}${SUFFIX}`) : defaultTitle
	);
	let canonical = $derived(`${siteBaseUrl}${path}`);
	let cardImage = $derived(ogImage ?? image);
	let cardAlt = $derived(ogImage ? (ogImageAlt ?? pageTitle) : imageAlt);
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}
	<meta name="keywords" content={keywords.join(', ')} />

	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />

	<title>{pageTitle}</title>
	<meta property="og:title" content={pageTitle} />
	<meta name="twitter:title" content={pageTitle} />

	<meta property="og:url" content={canonical} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="LangX" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={cardImage} />
	{#if !ogImage}
		<meta property="og:image:width" content={String(imageWidth)} />
		<meta property="og:image:height" content={String(imageHeight)} />
	{/if}
	<meta property="og:image:alt" content={cardAlt} />
	<meta name="twitter:image" content={cardImage} />
	<meta name="twitter:image:alt" content={cardAlt} />

	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
