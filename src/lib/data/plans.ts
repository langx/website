/**
 * Mirror of `PLAN_LIMITS` in `langx2/packages/shared/src/limits.ts`.
 *
 * Kept as data rather than prose so the numbers appear on the site exactly
 * once. When a limit changes in langx2, this file is the only place here that
 * has to change — see the sync note in README.md.
 */

export type PlanRow = {
	label: string;
	free: string;
	pro: string;
	/** Shown under the row. Use it where the *reason* is the interesting part. */
	note?: string;
};

export const planRows: PlanRow[] = [
	{
		label: 'Replying to messages you receive',
		free: 'Unlimited',
		pro: 'Unlimited',
		note: 'The free plan limits how many conversations you can open, never how much you can talk.'
	},
	{
		label: 'Writing corrections',
		free: 'Unlimited',
		pro: 'Unlimited',
		note: 'Deliberately the same on both plans. Correcting someone is a favour to them — rate-limiting free users would shrink what a paying user receives just as much.'
	},
	{ label: 'Starting new conversations', free: '5 per 24 hours', pro: 'Unlimited' },
	{ label: 'In-chat translation', free: '20 per 24 hours', pro: 'Unlimited' },
	{
		label: 'Photos and voice messages',
		free: '50 per 24 hours',
		pro: 'Unlimited',
		note: 'A ceiling on abuse, not a paywall — a normal conversation never reaches it.'
	},
	{ label: 'Filters: gender, country, age, level', free: '—', pro: 'Yes' },
	{ label: 'Who viewed your profile', free: 'How many', pro: 'Who they are' },
	{ label: 'Incognito browsing', free: '—', pro: 'Yes' },
	{
		label: 'Profile photos',
		free: '6',
		pro: '6',
		note: 'Also the same on purpose. A gallery is how someone shows they are a real person; gating it would make free profiles look like throwaway accounts.'
	}
];

/** Limits that are counted over a rolling window, not a calendar day. */
export const quotaWindow = 'rolling 24 hours';
