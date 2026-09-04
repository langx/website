/**
 * Mirror of `PLAN_LIMITS` in `langx/packages/shared/src/limits.ts`.
 *
 * Written as three lists rather than a grid on purpose. A comparison table
 * makes a reader check eleven rows across three columns to answer the only
 * question they have — what do I get if I pay — and most of those rows say the
 * same thing three times, because Polyglot is a superset of Fluent and both
 * inherit everything free already has.
 *
 * So each list holds only what is *new* at that plan. When a limit changes in
 * langx, this file is the only place here that has to change.
 */

export type PlanPoint = {
	label: string;
	/** Shown under the label, small. Only where the reason is worth a line. */
	note?: string;
	/** Renders as "Coming soon" — for something sold before it is built. */
	pending?: boolean;
};

export type Plan = {
	name: string;
	tagline: string;
	/** `pro` and `pro-plus` tint the card the way the app tints the tier. */
	tone?: 'pro' | 'pro-plus';
	points: PlanPoint[];
};

export const plans: Plan[] = [
	{
		name: 'Free',
		tagline: 'A real plan, not a trial.',
		points: [
			{ label: 'Unlimited replies to anyone who writes to you' },
			{ label: 'Unlimited corrections' },
			{ label: '5 new conversations a day' },
			{ label: '20 translations a day' },
			{ label: '1 language you are learning, 1 you speak natively' },
			{ label: 'Filters: country, age and level' },
			{
				label: '50 photo, video or voice messages a day',
				note: 'A ceiling on abuse, not a paywall — a normal conversation never reaches it.'
			},
			{ label: '6 photos on your profile' }
		]
	},
	{
		name: 'Fluent',
		tagline: 'Everything in Free, without the limits.',
		tone: 'pro',
		points: [
			{ label: 'Unlimited new conversations' },
			{
				label: '300 translations a day',
				note: 'Far more than a conversation uses. Translation is the one feature with a real per-request cost, so it has a number rather than a promise.'
			},
			{ label: '2 languages you are learning, 2 you speak natively' },
			{ label: 'Filters: gender and city' }
		]
	},
	{
		name: 'Polyglot',
		tagline: 'Everything in Fluent, and what it cannot do.',
		tone: 'pro-plus',
		points: [
			{ label: 'See who viewed your profile' },
			{ label: 'Incognito browsing' },
			{ label: '1000 translations a day' },
			{ label: '5 languages you are learning, 5 you speak natively' },
			{
				label: 'Nearby',
				note: 'Sorts discovery by distance, if you turn location sharing on.'
			},
			{
				label: 'LangX Copilot',
				note: 'Private AI feedback while you practise.',
				pending: true
			}
		]
	}
];

/** The three lines worth keeping under the plans. Everything else was noise. */
export const planNotes = [
	'The free plan’s daily caps run over a rolling 24 hours, not a calendar day.',
	'Fluent and Polyglot are monthly or yearly, with a free trial. Prices are set per region and shown in the app.',
	'Tokens cannot buy a paid plan, and never will.'
];
