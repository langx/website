import type { Feature } from '$lib/utils/types';

// Every claim here has to be true of the shipping app. The numbers come from
// `langx/packages/shared/src/limits.ts` (PLAN_LIMITS) — when a limit changes
// there, this file is the second place to change. Name the plan that actually
// unlocks a paid feature: Fluent (`pro`) or Polyglot (`pro_plus`).
//
// Matching, corrections and streaks are demonstrated with live screens higher
// up the homepage, so they are not repeated here. Keep each line short and
// plain; the details live on /pro and in the FAQ.
//
// NOTE: `image` still points at v1 screenshots in `static/images/features/`.
// Nothing renders them any more.
export default [
	{
		name: 'Translate inside the chat',
		description: 'Stuck on a word? Translate it without leaving the conversation.',
		image: 'images/features/9.png',
		tags: [{ label: 'Translation' }]
	},
	{
		name: 'Voice, photo and video messages',
		description:
			'Practise pronunciation with voice notes, and show what you mean with photos or a short video.',
		image: 'images/features/3.png',
		tags: [{ label: 'Voice, Photos & Video' }]
	},
	{
		name: 'Filters',
		description:
			'Find people by country, age and level for free. Fluent adds gender and city, Polyglot adds people near you.',
		image: 'images/features/7.png',
		tags: [
			{ label: 'Gender, city: Fluent', color: 'pro' },
			{ label: 'Nearby: Polyglot', color: 'pro-plus' }
		]
	},
	{
		name: 'See who viewed your profile',
		description: 'Curious who has been looking? Polyglot shows you.',
		image: 'images/features/5.png',
		tags: [{ label: 'Polyglot', color: 'pro-plus' }]
	},
	{
		name: 'Your data stays yours',
		description: 'Download or delete everything from inside the app. No ads, no trackers.',
		image: 'images/features/6.png',
		tags: [{ label: 'Privacy' }]
	},
	{
		name: 'Dark theme',
		description: 'Easier on the eyes at night. Follows your system, or your choice.',
		image: 'images/features/4.png',
		tags: [{ label: 'Dark theme' }]
	},
	{
		name: 'Open source',
		description: 'The whole app is free to read, and free to run yourself.',
		image: 'images/features/11.png',
		tags: [{ label: 'Open Source' }]
	},
	{
		name: 'LangX Copilot',
		description: 'Private AI feedback on your own messages. Coming later, for Polyglot.',
		image: 'images/features/1.png',
		tags: [
			{ label: 'Polyglot', color: 'pro-plus' },
			{ label: 'Coming soon', color: 'secondary' }
		]
	}
] as Feature[];
