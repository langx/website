/**
 * The apps LangX is compared with on /compare, one row each. Every cell is a
 * claim about someone else's product: it was checked against their own site
 * and store listings when written (September 2026), carries no prices, and is
 * worth re-checking whenever the matching comparison post is updated.
 */
export type Competitor = {
	name: string;
	/** The comparison post, e.g. `open-source-alternative-to-tandem`. */
	slug: string;
	what: string;
	bestFor: string;
	free: string;
	/** `active`, or how and when it stopped. */
	status: string;
	openSource: boolean;
	website: string;
};

export const COMPETITORS: Competitor[] = [
	{
		name: 'Tandem',
		slug: 'open-source-alternative-to-tandem',
		what: 'Large language exchange community with chat, calls and group Parties',
		bestFor: 'Live calls and a very large partner pool',
		free: 'Free version with daily limits; paid Pro tier',
		status: 'active',
		openSource: false,
		website: 'https://tandem.net'
	},
	{
		name: 'HelloTalk',
		slug: 'open-source-alternative-to-hellotalk',
		what: 'Social language exchange app with Moments, Voicerooms and livestreams',
		bestFor: 'Social learners who want feeds and group voice',
		free: 'Most features free with daily caps; paid VIP',
		status: 'active',
		openSource: false,
		website: 'https://www.hellotalk.com'
	},
	{
		name: 'Speaky',
		slug: 'open-source-alternative-to-speaky',
		what: 'Exchange app to message partners, plus AI practice partners',
		bestFor: 'Free, low-friction chatting in many languages',
		free: 'Free to use, with ads',
		status: 'active',
		openSource: false,
		website: 'https://www.speaky.com'
	},
	{
		name: 'Conversation Exchange',
		slug: 'open-source-alternative-to-conversationexchange',
		what: 'Long-running website for in-person, pen pal and chat partners',
		bestFor: 'Face-to-face exchange partners in your city',
		free: 'Free; paid membership removes ads and limits',
		status: 'active',
		openSource: false,
		website: 'https://www.conversationexchange.com'
	},
	{
		name: 'Lingbe',
		slug: 'open-source-alternative-to-lingbe',
		what: 'Press a button for an instant voice call with a native speaker',
		bestFor: 'Live speaking practice on demand',
		free: 'Free credits earned by helping others; paid options',
		status: 'active',
		openSource: false,
		website: 'https://www.lingbe.com'
	},
	{
		name: 'Busuu',
		slug: 'open-source-alternative-to-busuu',
		what: 'Structured course app with native-speaker corrections on exercises',
		bestFor: 'Beginners who want a structured course',
		free: 'Free tier with limits; Premium subscription',
		status: 'active',
		openSource: false,
		website: 'https://www.busuu.com'
	},
	{
		name: 'italki',
		slug: 'open-source-alternative-to-italki',
		what: 'Marketplace for paid one-to-one lessons, plus a free community',
		bestFor: 'Lessons with professional teachers',
		free: 'Free community; lessons are paid',
		status: 'active',
		openSource: false,
		website: 'https://www.italki.com'
	},
	{
		name: 'Bilingua',
		slug: 'open-source-alternative-to-bilingua',
		what: 'Exchange app that matched partners by interests',
		bestFor: 'Former users looking for a new app',
		free: 'No longer available',
		status: 'Gone from the app stores since 2023',
		openSource: false,
		website: ''
	}
];
