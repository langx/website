/**
 * Pro's price in US dollars, the one place the site writes it. The stores
 * set a price per region (since 24 September 2026: $9.99 a month, $83.99 a
 * year, every price ending .99), and the app shows the local one before
 * anyone pays, so the site says these are US prices.
 *
 * When the prices change in the stores, change them here: /plans and its
 * FAQ read this file, and nothing else on the site prints a price.
 */
export const PRO_PRICE = {
	currency: 'USD',
	monthly: '$9.99',
	yearly: '$83.99',
	/** The yearly price over twelve, truncated the way the app's paywall shows it. */
	yearlyPerMonth: '$6.99',
	/** What yearly saves against twelve monthly payments, rounded down. */
	yearlySaving: '3 months free',
	/** Only the yearly plan has a free week, and only for someone who has not had Pro. */
	yearlyTrial: '1 week free'
} as const;
