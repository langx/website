/**
 * Mirror of `PLAN_LIMITS` in `langx/packages/shared/src/limits.ts`.
 *
 * Written as two lists rather than a grid on purpose. A comparison table
 * makes a reader check every row across both columns to answer the only
 * question they have — what do I get if I pay — and most of those rows say the
 * same thing twice, because Pro inherits everything free already has.
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
	/** `pro` tints the card the way the app tints the paid tier. */
	tone?: 'pro';
	points: PlanPoint[];
	/**
	 * The four or five lines the card on /plans shows: the pitch, not the
	 * record. Every one restates a point above (or, for Free, Echo — see
	 * echo.ts), so the long list stays the only place a limit is defined.
	 */
	highlights: PlanPoint[];
};

export const plans: Plan[] = [
	{
		name: 'Free',
		tagline: 'A real plan, not a trial.',
		points: [
			{ label: 'Unlimited text messages' },
			{
				label: '500 messages a day with a photo, video or voice note',
				note: 'The same fair-use ceiling on every plan — a ceiling on abuse, not a paywall. A normal conversation never reaches it.'
			},
			{ label: 'Unlimited replies to anyone who writes to you' },
			{ label: 'Unlimited corrections' },
			{ label: '5 new conversations a day' },
			{ label: '20 translations a day' },
			{
				label: '100 chat messages read aloud a day',
				note: 'Hold any message to hear it said, in a voice that runs on our own machines rather than somebody’s meter.'
			},
			{
				label: '50 Echo cards read aloud a day',
				note: 'A synthetic voice for a card nobody has recorded yet. A pack’s readings are already there and cost nothing.'
			},
			{
				label: '50 voice notes written out as text a day',
				note: 'Show text under a voice note, written out on our own machines. Once one of you has asked, the other reads it for nothing.'
			},
			{ label: '1 language you are learning, 1 you speak natively' },
			{ label: 'Filters: country, age and level' },
			{ label: '10 photos on your profile' }
		],
		highlights: [
			{ label: 'Unlimited replies and corrections' },
			{ label: '5 new conversations a day' },
			{ label: '20 translations a day' },
			{ label: 'Echo packs to learn from, free' },
			{ label: 'No ads' }
		]
	},
	{
		name: 'Pro',
		tagline: 'Everything in Free, without the limits.',
		tone: 'pro',
		points: [
			{ label: 'Unlimited new conversations' },
			{
				label: '1000 translations a day',
				note: 'Far more than a conversation uses. Translation is the one feature with a real per-request cost, so it has a number rather than a promise.'
			},
			{ label: '1000 chat messages read aloud a day' },
			{ label: '500 Echo cards read aloud a day' },
			{ label: '400 voice notes written out as text a day' },
			{ label: '5 languages you are learning, 5 you speak natively' },
			{ label: 'Filters: gender and city' },
			{
				label: 'Nearby',
				note: 'Sorts discovery by distance, if you turn location sharing on.'
			},
			{
				label: 'Boosted profile',
				note: 'A Boosted strip above the Discover list, shown to everyone whose languages match yours. On by default; switch it off in Settings.'
			},
			{ label: 'See who viewed your profile' },
			{ label: 'Incognito browsing' },
			{
				label: 'Write in your language, send in theirs',
				note: 'Reading a translation is free on every plan. This is the other direction — your own message goes with a translation under it.'
			},
			{
				label: 'Export your saved phrases',
				note: 'A conversation’s saved phrases as a file. It opens in Anki.'
			},
			{
				label: 'LangX Copilot',
				note: 'Private AI feedback while you practise.',
				pending: true
			}
		],
		highlights: [
			{ label: 'Unlimited new conversations' },
			{ label: '1000 translations a day' },
			{ label: '5 languages you learn, 5 you speak' },
			{ label: 'Who viewed you, incognito, Nearby' },
			{ label: 'Write in your language, send in theirs' },
			{ label: 'LangX Copilot', pending: true }
		]
	}
];

/**
 * The metered things, one row each, for the bars on /plans: the same numbers
 * as the lists above, in the order Free, Pro. `null` is
 * unlimited; `shown` is the label when the number alone would mislead.
 */
export type LimitRow = {
	label: string;
	values: [free: number | null, pro: number | null];
	shown?: [free: string, pro: string];
};

export const limits: LimitRow[] = [
	{ label: 'New conversations a day', values: [5, null] },
	{ label: 'Translations a day', values: [20, 1000] },
	{ label: 'Chat messages read aloud a day', values: [100, 1000] },
	{ label: 'Echo cards read aloud a day', values: [50, 500] },
	{ label: 'Voice notes written out as text a day', values: [50, 400] },
	{ label: 'Languages, learning + native', values: [2, 10], shown: ['1 + 1', '5 + 5'] }
];

/** The three lines worth keeping under the plans. Everything else was noise. */
export const planNotes = [
	'The free plan’s daily caps run over a rolling 24 hours, not a calendar day.',
	'Pro is monthly or yearly, with a one-week free trial; yearly works out to 3 months free. Prices are set per region and shown in the app.',
	'Tokens cannot buy a paid plan, and never will. A streak freeze bought with tokens can keep a streak going toward a streak reward, but tokens never buy Pro directly.'
];

/**
 * Ways to get Pro without paying. Mirrors the reward and gift rules in
 * `langx/packages/shared` — the invite and streak milestones, and gift codes
 * redeemed from the app's plans screen. Rewarded or gifted Pro never renews
 * and never charges anyone; the Terms (§5) carry the same rules in full.
 */
export type FreeProWay = { icon: string; title: string; body: string };

export const freeProWays: FreeProWay[] = [
	{
		icon: 'person',
		title: 'Invite friends',
		body: 'Every 3 friends who join with your link and start talking give you 1 month of Pro. Up to 3 months a year.'
	},
	{
		icon: 'award',
		title: 'Keep a streak',
		body: 'Reach a 7-day streak for 1 week of Pro, 100 days for 1 month, and 365 days for 3 more. Each one once.'
	},
	{
		icon: 'gift',
		title: 'Use a gift code',
		body: 'Got a code? Tap “Have a gift code?” on the plans screen in the app and Pro is yours for as long as the code says.'
	}
];

export const freeProNote =
	'Now and then we gift Pro as a thank-you, too. Pro you get for free never renews itself and never charges you — the app lets you know before it ends.';
