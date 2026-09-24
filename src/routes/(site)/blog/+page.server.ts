import { filteredPosts } from '$lib/data/blog-posts';

export async function load() {
	return {
		// Only what a card and the Blog JSON-LD show. Each post also carries its
		// keywords, author and three related posts in full, and serialised for
		// sixty posts that was 145 KB of a 244 KB page.
		posts: filteredPosts.map(
			({
				slug,
				title,
				date,
				excerpt,
				coverImage,
				coverWebp,
				thumbnail,
				readingTime,
				tags,
				apps
			}) => ({
				slug,
				title,
				date,
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
