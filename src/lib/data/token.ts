/**
 * Mirror of `TOKEN_RULES` and `COSMETICS` in
 * `langx/packages/shared/src/token.ts` and `cosmetics.ts`.
 *
 * langx marks these as "starting values only" — they are expected to move
 * once there is real activity data, which is why the page that renders them
 * says so out loud.
 */

export const tokenEarning = [
	{ action: 'Send a message', amount: '2' },
	{ action: "Correct someone else's sentence", amount: '10' },
	{ action: 'Answer a pronunciation request with a recording', amount: '10' },
	{ action: 'First conversation where both of you have spoken', amount: '15' }
];

export const tokenCaps = [
	'Up to 100 tokens a day from messages.',
	'At most 30 of those from any one person, so talking to a single partner all day is not a strategy.',
	'A shared daily pool of 10,000 tokens is split between that day’s active users, in proportion to how active they were. No one can take more than 5% of it.'
];

export const streakMilestones = [
	{ day: 7, bonus: 50 },
	{ day: 30, bonus: 250 },
	{ day: 100, bonus: 1000 },
	{ day: 180, bonus: 1500 },
	{ day: 365, bonus: 5000 },
	{ day: 730, bonus: 12000 },
	{ day: 1095, bonus: 25000 }
];

export const tokenSinks = [
	{
		name: 'Streak freeze',
		price: '200 tokens',
		description: 'Rescues one missed day. You can bank two at a time.'
	},
	{
		name: 'Fill in a missed day',
		price: '600 tokens',
		description:
			'Fills one empty square on your activity map, within the last 14 days. Two a month, and never today — today is earned.'
	},
	{
		name: 'Frames and titles',
		price: '1,000 – 100,000 tokens',
		description:
			'Cosmetic only: ten avatar frames from Slate to Midnight, and ten titles from Beginner to Legend.'
	}
];

/**
 * The hourly gift in the wallet's store. Free and random; mirrors
 * `TOKEN_RULES.gift`. Gift tokens count toward the all-time balance only,
 * never toward the weekly, monthly or yearly tables.
 */
export const tokenGift = {
	every: 'Once an hour',
	range: '0 – 250 tokens',
	description:
		'A small gift every hour, for free. Most hold a handful of tokens — about a third are empty and nine in ten hold 30 or fewer — and a few hold more. It never counts toward a leaderboard.'
};

/** The full list, phrased so it can be read as a promise rather than a disclaimer. */
export const tokenIsNot = [
	'It cannot be bought — there is no way to purchase tokens, with money or anything else.',
	'It cannot be sold, traded or staked. There is no exchange, no market, no marketplace, and none is planned.',
	'It cannot be sent to another user.',
	'It cannot be withdrawn. It does not leave the app.',
	'It is not on a blockchain. There is no chain, no contract, no wallet address.',
	'It cannot unlock a paid plan. Those are subscriptions; tokens buy none of them.'
];

/** v1 balances are credited to earned tokens divided by this. */
export const legacyTokenDivisor = 100;
export const welcomeBackBonus = 250;
