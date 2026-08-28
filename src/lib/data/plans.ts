/**
 * Mirror of `PLAN_LIMITS` in `langx2/packages/shared/src/limits.ts`.
 *
 * Three plans. Pro+ is Pro plus two things — LangX Copilot and Nearby — which
 * is why every `proPlus` value repeats `pro` until the last two rows.
 */

export type PlanRow = {
	label: string;
	free: string;
	pro: string;
	proPlus: string;
	/** Shown under the row. Use it where the *reason* is the interesting part. */
	note?: string;
};

export const planRows: PlanRow[] = [
	{
		label: 'Replying to messages you receive',
		free: 'Unlimited',
		pro: 'Unlimited',
		proPlus: 'Unlimited',
		note: 'The free plan limits how many conversations you can open, never how much you can talk.'
	},
	{
		label: 'Writing corrections',
		free: 'Unlimited',
		pro: 'Unlimited',
		proPlus: 'Unlimited',
		note: 'Deliberately the same on all plans. Correcting someone is a favour to them — rate-limiting free users would shrink what a paying user receives just as much.'
	},
	{
		label: 'Starting new conversations',
		free: '5 per 24 hours',
		pro: 'Unlimited',
		proPlus: 'Unlimited'
	},
	{ label: 'In-chat translation', free: '20 per 24 hours', pro: 'Unlimited', proPlus: 'Unlimited' },
	{
		label: 'Photos and voice messages',
		free: '50 per 24 hours',
		pro: 'Unlimited',
		proPlus: 'Unlimited',
		note: 'A ceiling on abuse, not a paywall — a normal conversation never reaches it.'
	},
	{ label: 'Filters: gender, country, age, level', free: '—', pro: 'Yes', proPlus: 'Yes' },
	{
		label: 'Who viewed your profile',
		free: 'How many',
		pro: 'Who they are',
		proPlus: 'Who they are'
	},
	{ label: 'Incognito browsing', free: '—', pro: 'Yes', proPlus: 'Yes' },
	{
		label: 'Profile photos',
		free: '6',
		pro: '6',
		proPlus: '6',
		note: 'Also the same on purpose. A gallery is how someone shows they are a real person; gating it would make free profiles look like throwaway accounts.'
	},
	{
		label: 'LangX Copilot',
		free: '—',
		pro: '—',
		proPlus: 'Coming soon',
		note: 'Private AI feedback while you practise. Not in the first release — the row is here because it is what Pro+ will add.'
	},
	{
		label: 'Nearby: sort people by distance',
		free: '—',
		pro: '—',
		proPlus: 'Yes',
		note: 'Only if you switch location sharing on.'
	}
];

/** Limits that are counted over a rolling window, not a calendar day. */
export const quotaWindow = 'rolling 24 hours';
