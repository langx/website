export type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };

export type TagType = {
	label: string;
	/**
	 * `pro` and `pro-plus` mark a paid feature and use the app's own purples.
	 * Tag the plan that actually unlocks it — Polyglot is the wider one.
	 */
	color?: 'primary' | 'secondary' | 'pro' | 'pro-plus';
};

export type Feature = {
	name: string;
	description: string;
	image: string;
	tags: TagType[];
};

export type BlogPost = {
	tags: string[];
	keywords: string[];
	hidden: boolean;
	slug: string;
	title: string;
	author: {
		name: string;
		url: string;
	};
	date: string;
	updated: string;
	excerpt: string;
	html: string | undefined;
	readingTime: string;
	relatedPosts: BlogPost[];
	/** The post's H2s, for the table of contents; read from the rendered HTML. */
	headings?: { id: string; text: string }[];
	/** Apps from `COMPETITORS` the post is about, title first; drives the art above it. */
	apps?: string[];
	coverImage: string | undefined;
	/** Square image for post lists, drawn by scripts/og/posts.mjs. */
	thumbnail?: string;
};

/** What the art above an alphabet guide draws (see the (blog-article) layout load). */
export type PostScript = {
	code: string;
	rtl: boolean;
	featured: { c: string; name: string; sound: string };
	others: string[];
};
