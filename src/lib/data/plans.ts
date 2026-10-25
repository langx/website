/**
 * Mirror of `PLAN_LIMITS` in `langx/packages/shared/src/limits.ts`, as /plans
 * shows it: one table of what Pro changes, and the two card lists. When a
 * limit changes in langx, this file is the only place here that has to
 * change (prices are in prices.ts).
 */

/**
 * The table on /plans: what Pro changes and what it leaves alone. The first
 * rows are the same on both plans on purpose. `true` draws a tick, `false`
 * a dash. Copilot is drawn as the app's paywall draws it: part of Pro,
 * marked "Beta" rather than ticked, and never with a value on Free.
 */
export type CompareRow = { label: string; free: string | boolean; pro: string | boolean };

export const compareRows: CompareRow[] = [
	{ label: 'Messages and replies', free: 'Unlimited', pro: 'Unlimited' },
	{ label: 'Corrections', free: 'Unlimited', pro: 'Unlimited' },
	{ label: 'Voice and video calls', free: 'Included', pro: 'Included' },
	{ label: 'Echo packs', free: 'Free', pro: 'Free' },
	{ label: 'New chats', free: '5 a day', pro: 'No limit' },
	{ label: 'Translations', free: '20 a day', pro: 'Unlimited' },
	{ label: 'Languages you learn', free: '1', pro: 'Up to 5' },
	{ label: 'Gender and city filters', free: false, pro: true },
	{ label: 'See who viewed your profile', free: false, pro: true },
	{ label: 'LangX Copilot', free: false, pro: 'Beta' }
];

/** The card lists on /plans. */
export const freeCard = [
	'Unlimited messages, replies and corrections',
	'Voice and video calls',
	'Echo packs to learn from',
	'5 new chats a day',
	'20 translations a day',
	'No ads'
];

export const proCard = [
	'Unlimited new chats',
	'Unlimited translations',
	'See who viewed you',
	'Up to 5 languages you learn'
];
