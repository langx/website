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
	coverImage: string | undefined;
};
