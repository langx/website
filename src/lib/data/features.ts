import type { Feature } from '$lib/utils/types';

export default [
	{
		name: 'Markdown Support',
		description:
			'Blog posts are written in Markdown, a simple and nearly-universal format. This means you can bring over your posts from other platforms, and easily export to another if you want to.',
		image: 'images/features/markdown.jpg',
		tags: [{ label: 'Powered by MDsveX' }]
	},
	{
		name: 'Themeable',
		description:
			'You can easily theme the entire website by changing just a few colors in the _themes.scss file.',
		image: 'images/features/themeable.jpg',
		tags: [{ label: 'Primary Color' }, { label: 'Secondary Color', color: 'secondary' }]
	},
	{
		name: 'Well Optimized',
		description:
			'Images are automatically optimized and lazy loaded, to ensure the website loads as fast as possible regardless of connection speed.',
		image: 'images/features/optimized.jpg',
		tags: [{ label: 'Powered by Image Transmutation' }]
	}
] as Feature[];
