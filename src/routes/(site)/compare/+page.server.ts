import { filteredPosts } from '$lib/data/blog-posts';

/**
 * Every post that puts LangX next to another app. They are found by slug, so
 * a new `open-source-alternative-to-*` post turns up here without anyone
 * having to remember this page.
 */
const isComparison = (slug: string) =>
	slug.startsWith('open-source-alternative-to-') ||
	slug.endsWith('-vs-hellotalk') ||
	slug.endsWith('-vs-language-exchange') ||
	slug === 'duolingo-alternatives-for-speaking' ||
	slug.startsWith('social-') ||
	slug.startsWith('best-language-exchange-apps') ||
	slug.startsWith('best-apps-to-practice-') ||
	slug === 'free-language-exchange-apps' ||
	slug === 'best-language-learning-apps' ||
	slug === 'free-language-learning-apps' ||
	slug === 'can-you-become-fluent-with-duolingo';

export async function load() {
	const posts = filteredPosts.filter((p) => isComparison(p.slug));
	// The overview first, then the one-to-ones in the order people search for them.
	const order = [
		'best-language-exchange-apps',
		'open-source-alternative-to-tandem',
		'open-source-alternative-to-hellotalk',
		'open-source-alternative-to-duolingo',
		'social-alternative-to-duolingo',
		'tandem-vs-hellotalk',
		'duolingo-alternatives-for-speaking'
	];
	posts.sort((a, b) => {
		const ia = order.indexOf(a.slug);
		const ib = order.indexOf(b.slug);
		return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
	});
	return {
		posts: posts.map(
			({ slug, title, excerpt, coverImage, coverWebp, thumbnail, readingTime, tags, apps }) => ({
				slug,
				title,
				excerpt,
				coverImage,
				coverWebp,
				thumbnail,
				readingTime,
				tags,
				apps
			})
		)
	};
}
