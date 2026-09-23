// Disabling eslint because importing Prism is needed
// even if not directly used in this file
// eslint-disable-next-line no-unused-vars
import Prism from 'prismjs';
// Referenced so the import above is not tree-shaken away.
void Prism;
import 'prism-svelte';
import readingTime from 'reading-time';
import striptags from 'striptags';
import type { BlogPost } from '$lib/utils/types';
import { COMPETITORS } from '$lib/data/competitors';

export const importPosts = (render = false) => {
	const blogImports = import.meta.glob('$routes/*/*/*.md', { eager: true });
	const innerImports = import.meta.glob('$routes/*/*/*/*.md', { eager: true });

	const imports = { ...blogImports, ...innerImports };

	const posts: BlogPost[] = [];
	for (const path in imports) {
		const post = imports[path] as {
			metadata: BlogPost;
			default: { render?: () => { html: string } };
		};
		if (post) {
			posts.push({
				...post.metadata,
				html: render && post.default.render ? post.default.render()?.html : undefined
			});
		}
	}

	return posts;
};

export const filterPosts = (posts: BlogPost[]) => {
	return posts
		.filter((post) => !post.hidden)
		.sort((a, b) =>
			new Date(a.date).getTime() > new Date(b.date).getTime()
				? -1
				: new Date(a.date).getTime() < new Date(b.date).getTime()
				? 1
				: 0
		)
		.map((post) => {
			const readingTimeResult = post.html ? readingTime(striptags(post.html) || '') : undefined;
			const relatedPosts = getRelatedPosts(posts, post);

			return {
				...post,
				readingTime: readingTimeResult ? readingTimeResult.text : '',
				relatedPosts: relatedPosts,
				headings: post.html ? headingsOf(post.html) : [],
				apps: post.html ? appsIn(post.title, post.html) : []
			} as BlogPost;
		});
};

/**
 * The H2s of a rendered post, for the table of contents beside it. This is the
 * last place the body is at hand — `blog-posts/index.ts` drops it before it
 * reaches a page — and rehype-slug has already given every heading its id.
 * The permalink "#" that rehype-autolink-headings puts inside each one is
 * taken out with the rest of the markup.
 */
const headingsOf = (html: string) =>
	[...html.matchAll(/<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)]
		.map(([, id, inner]) => ({
			id,
			text: striptags(inner.replace(/<a class="heading-link"[\s\S]*?<\/a>/, ''))
				.replace(/&amp;/g, '&')
				.replace(/&#39;|&apos;/g, '’')
				.replace(/&quot;/g, '"')
				.trim()
		}))
		.filter((h) => h.text);

/**
 * The apps a post is about, for the art above it: the ones named in the title
 * first, in the order they appear there, then whichever the body keeps coming
 * back to. A name mentioned once in passing is not what the post is about.
 */
const appsIn = (title: string, html: string) => {
	const text = striptags(html);
	const count = (name: string) =>
		text.match(new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'))?.length ??
		0;
	const inTitle = COMPETITORS.map((c) => ({ name: c.name, at: title.indexOf(c.name) }))
		.filter((c) => c.at >= 0)
		.sort((a, b) => a.at - b.at)
		.map((c) => c.name);
	const inBody = COMPETITORS.map((c) => ({ name: c.name, n: count(c.name) }))
		.filter((c) => c.n >= 2 && !inTitle.includes(c.name))
		.sort((a, b) => b.n - a.n)
		.map((c) => c.name);
	return [...inTitle, ...inBody];
};

// #region Unexported Functions

const getRelatedPosts = (posts: BlogPost[], post: BlogPost) => {
	// Get the first 3 posts that have the highest number of tags in common
	const relatedPosts = posts
		.filter((p) => !p.hidden && p.slug !== post.slug)
		.sort((a, b) => {
			const aTags = a.tags?.filter((t) => post.tags?.includes(t));
			const bTags = b.tags?.filter((t) => post.tags?.includes(t));
			return aTags?.length > bTags?.length ? -1 : aTags?.length < bTags?.length ? 1 : 0;
		});

	return relatedPosts.slice(0, 3).map((p) => ({
		...p,
		readingTime: p.html ? readingTime(striptags(p.html) || '').text : ''
	}));
};

// #endregion
