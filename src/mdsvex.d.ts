// mdsvex components: the blog posts and the legal pages. A file of its own
// because a wildcard module declaration has to live outside a module.
declare module '*.md' {
	import type { Component } from 'svelte';
	const component: Component;
	export default component;
	export const metadata: Record<string, unknown>;
}
