import { filterPosts, importPosts } from './utils';
import type { BlogPost } from '$lib/utils/types';

// The rendered body is only needed to work out the reading time, which
// `filterPosts` has already done. Everything exported from here ends up in a
// page's serialised load data, and carrying the body along put every post's
// full HTML — and its three related posts' — into /blog, which weighed 624 KB
// for a list of titles. The RSS feed needs the body and imports `utils` itself.
const withoutBody = (post: BlogPost): BlogPost => ({
	...post,
	html: undefined,
	relatedPosts: post.relatedPosts?.map((related) => ({ ...related, html: undefined }))
});

export const allPosts = importPosts(true);
export const filteredPosts = filterPosts(allPosts).map(withoutBody);
