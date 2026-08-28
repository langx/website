import type { Feature } from '$lib/utils/types';

// Every claim here has to be true of the shipping app. The numbers come from
// `langx2/packages/shared/src/limits.ts` (PLAN_LIMITS) — when a limit changes
// there, this file is the second place to change.
//
// NOTE: the screenshots in `static/images/features/` are still v1's UI.
export default [
	{
		name: '🤝 Matched Both Ways',
		description:
			'You only see people whose languages fit yours in both directions — they speak what you are learning, and they are learning what you speak.',
		image: 'images/features/2.png',
		tags: [{ label: 'Matching' }]
	},
	{
		name: '✍️ Correct Each Other',
		description:
			'Tap any message to suggest a better way to say it. Corrections are unlimited on every plan — teaching someone is the point of the product, not a feature to ration.',
		image: 'images/features/10.png',
		tags: [{ label: 'Corrections' }, { label: 'Unlimited on every plan' }]
	},
	{
		name: '🌐 Translation When You Are Stuck',
		description:
			'Built into the chat, so you never leave the conversation to look something up. 20 a day on the free plan, unlimited on Pro.',
		image: 'images/features/9.png',
		tags: [{ label: 'Translation' }]
	},
	{
		name: '🔥 Streaks, Tokens and Leaderboards',
		description:
			'Keep a daily streak, earn LangX Tokens for talking and for teaching, and see where you land on the weekly, monthly, yearly and all-time boards.',
		image: 'images/features/12.png',
		tags: [{ label: 'Streaks' }, { label: 'LangX Token' }]
	},
	{
		name: '🎙️ Capture Moments, Share Voices',
		description:
			'Send voice messages to practise pronunciation, and photos to show what you are talking about.',
		image: 'images/features/3.png',
		tags: [{ label: 'Voice & Photos' }]
	},
	{
		name: '⚙️ Fine Tune Your Connections',
		description:
			'Narrow discovery by gender, country, age and level to find the partners who actually fit how you want to practise.',
		image: 'images/features/7.png',
		tags: [{ label: 'Filters' }, { label: 'LangX Pro', color: 'pro' }]
	},
	{
		name: '🔍 Profile Insights',
		description:
			'See your streak, your tokens and how your week is going, straight from your profile.',
		image: 'images/features/5.png',
		tags: [{ label: 'Insights' }]
	},
	{
		name: '🔒 Your Data, Your Control',
		description:
			'Download everything we hold about you, or delete your account from inside the app. No advertising identifiers and no third-party analytics SDK.',
		image: 'images/features/6.png',
		tags: [{ label: 'Privacy' }]
	},
	{
		name: '🌙 Night Mode Engage',
		description:
			'Switch to night mode for a more comfortable reading experience in low light environments.',
		image: 'images/features/4.png',
		tags: [{ label: 'Night Mode' }]
	},
	{
		name: '📖 All Open-Sourced',
		description:
			'The app and the API are open source under BSD-3, and you can host your own instance. Join our developer community and contribute to our codebase.',
		image: 'images/features/11.png',
		tags: [{ label: 'Open Source' }]
	},
	{
		name: '🆓 Free to Use, Always',
		description:
			'Reply to every message you get with no limits, and correct as many as you like. On the free plan you can start 5 new conversations a day.',
		image: 'images/features/8.png',
		tags: [{ label: 'Free' }]
	},
	{
		name: '🤖 LangX Copilot',
		description:
			'Private feedback while you practise with a real person — only you see it. Not in the first release; it lands in a later one.',
		image: 'images/features/1.png',
		tags: [{ label: 'AI' }, { label: 'Coming Soon', color: 'secondary' }]
	}
] as Feature[];
