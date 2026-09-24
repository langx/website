// Disabling eslint because importing Prism is needed
// even if not directly used in this file
// eslint-disable-next-line no-unused-vars
import Prism from 'prismjs';
// Referenced so the import above is not tree-shaken away.
void Prism;
import 'prism-svelte';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Component } from 'svelte';
import { render as renderToHtml } from 'svelte/server';
import readingTime from 'reading-time';
import striptags from 'striptags';
import type { BlogPost } from '$lib/utils/types';
import { COMPETITORS } from '$lib/data/competitors';

// Only ever called from server code (+server.ts, +page.server.ts), which is
// what lets it import svelte/server.
export const importPosts = (render = false) => {
	const blogImports = import.meta.glob('$routes/*/*/*.md', { eager: true });
	const innerImports = import.meta.glob('$routes/*/*/*/*.md', { eager: true });

	const imports = { ...blogImports, ...innerImports };

	const posts: BlogPost[] = [];
	for (const path in imports) {
		const post = imports[path] as {
			metadata: BlogPost;
			default: Component;
		};
		if (post) {
			posts.push({
				...post.metadata,
				coverWebp: coverWebp(post.metadata),
				// Svelte 5 components have no render() of their own; this is its
				// replacement. The comments are hydration markers, of no use in a feed.
				html: render ? renderToHtml(post.default).body.replace(/<!--[\s\S]*?-->/g, '') : undefined
			});
		}
	}

	return posts;
};

/**
 * The WebP copies `scripts/covers.mjs` makes of a photo cover, if both are
 * there. Looked for rather than assumed: a picture's WebP source that is
 * missing is a broken image, not a fall back to the original. Paths are from
 * the project root, where the build and the dev server both run.
 */
const coverWebp = ({ coverImage, thumbnail }: BlogPost) => {
	if (!coverImage || thumbnail) return undefined;
	const base = coverImage.replace(/\.(png|jpe?g)$/i, '');
	if (base === coverImage) return undefined;
	const full = `${base}.webp`;
	const square = `${base}-square.webp`;
	return existsSync(join('static', full)) && existsSync(join('static', square))
		? { full, square }
		: undefined;
};

/**
 * A post's text with each tag turned into a space. Svelte 5 renders less
 * whitespace between tags than Svelte 4 did, and stripping tags outright would
 * glue the words either side of one together.
 */
const words = (html: string) => striptags(html, [], ' ');

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
			const readingTimeResult = post.html ? readingTime(words(post.html)) : undefined;
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
	const text = words(html);
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
		readingTime: p.html ? readingTime(words(p.html)).text : ''
	}));
};

// #endregion
