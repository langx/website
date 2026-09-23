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
	/** What kind of app it is; groups the map on /compare. */
	kind: 'exchange' | 'penpal' | 'tutors' | 'course' | 'ai';
	/**
	 * Can you have a conversation with a real person? `paid` is a paid tutor,
	 * `partial` is people correcting exercises rather than talking with you.
	 */
	people: 'yes' | 'paid' | 'partial' | 'no';
	/** A plan you can keep using without paying; `partial` is a trial or a sliver. */
	freePlan: 'yes' | 'partial' | 'no';
	/**
	 * Advertising. `none`: no ads at all. `free-plan`: ads on the free tier
	 * that a paid plan removes — only where the app's own page says it does.
	 * `yes`: ads, with no paid way out that we could confirm. `unknown`: not
	 * checked (an app that has closed).
	 *
	 * Checked on 23 September 2026 against each app's Google Play listing,
	 * whose "Contains ads" label is the developer's own declaration, and for
	 * `free-plan` against the paid plan's page (Tandem's blog, HelloTalk's VIP
	 * FAQ, Duolingo's blog, Conversation Exchange's membership page, Busuu's
	 * premium plans, Memrise's Play description).
	 *
	 * Slowly and Lingbe stay `yes`. Slowly's own help centre confirms its ads
	 * (Google AdMob and Unity Ads, including optional rewarded ads for coins:
	 * help.slowly.app, "How can I report an inappropriate advertisement?") and
	 * lists Slowly Plus as more friends, more Open Letters and bonus coins —
	 * nowhere as ad-free. Lingbe's store listings show "Contains ads" and a
	 * "Lingbe Pro" purchase, but neither they nor lingbe.com say Pro removes
	 * ads; only third-party reviews do. Checked 23 September 2026.
	 */
	ads: 'none' | 'free-plan' | 'yes' | 'unknown';
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
		website: 'https://tandem.net',
		kind: 'exchange',
		people: 'yes',
		freePlan: 'yes',
		ads: 'free-plan'
	},
	{
		name: 'HelloTalk',
		slug: 'open-source-alternative-to-hellotalk',
		what: 'Social language exchange app with Moments, Voicerooms and livestreams',
		bestFor: 'Social learners who want feeds and group voice',
		free: 'Most features free with daily caps; paid VIP',
		status: 'active',
		openSource: false,
		website: 'https://www.hellotalk.com',
		kind: 'exchange',
		people: 'yes',
		freePlan: 'yes',
		ads: 'free-plan'
	},
	{
		name: 'Duolingo',
		slug: 'open-source-alternative-to-duolingo',
		what: 'Gamified course app with bite-size lessons in 40+ languages',
		bestFor: 'Beginners building a daily habit',
		free: 'All courses free, with ads and limits',
		status: 'active',
		openSource: false,
		website: 'https://www.duolingo.com',
		kind: 'course',
		people: 'no',
		freePlan: 'yes',
		ads: 'free-plan'
	},
	{
		name: 'Speaky',
		slug: 'open-source-alternative-to-speaky',
		what: 'Exchange app to message partners, plus AI practice partners',
		bestFor: 'Free, low-friction chatting in many languages',
		free: 'Free to use, with ads',
		status: 'active',
		openSource: false,
		website: 'https://www.speaky.com',
		kind: 'exchange',
		people: 'yes',
		freePlan: 'yes',
		ads: 'yes'
	},
	{
		name: 'Conversation Exchange',
		slug: 'open-source-alternative-to-conversationexchange',
		what: 'Long-running website for in-person, pen pal and chat partners',
		bestFor: 'Face-to-face exchange partners in your city',
		free: 'Free; paid membership removes ads and limits',
		status: 'active',
		openSource: false,
		website: 'https://www.conversationexchange.com',
		kind: 'exchange',
		people: 'yes',
		freePlan: 'yes',
		ads: 'free-plan'
	},
	{
		name: 'Lingbe',
		slug: 'open-source-alternative-to-lingbe',
		what: 'Press a button for an instant voice call with a native speaker',
		bestFor: 'Live speaking practice on demand',
		free: 'Free credits earned by helping others; paid options',
		status: 'active',
		openSource: false,
		website: 'https://www.lingbe.com',
		kind: 'exchange',
		people: 'yes',
		freePlan: 'yes',
		ads: 'yes'
	},
	{
		name: 'Busuu',
		slug: 'open-source-alternative-to-busuu',
		what: 'Structured course app with native-speaker corrections on exercises',
		bestFor: 'Beginners who want a structured course',
		free: 'Free tier with limits; Premium subscription',
		status: 'active',
		openSource: false,
		website: 'https://www.busuu.com',
		kind: 'course',
		people: 'partial',
		freePlan: 'yes',
		ads: 'free-plan'
	},
	{
		name: 'italki',
		slug: 'open-source-alternative-to-italki',
		what: 'Marketplace for paid one-to-one lessons, plus a free community',
		bestFor: 'Lessons with professional teachers',
		free: 'Free community; lessons are paid',
		status: 'active',
		openSource: false,
		website: 'https://www.italki.com',
		kind: 'tutors',
		people: 'paid',
		freePlan: 'partial',
		ads: 'none'
	},
	{
		name: 'Slowly',
		slug: 'open-source-alternative-to-slowly',
		what: 'Anonymous pen-pal app; letters arrive with a distance-based delay',
		bestFor: 'Long, thoughtful letters',
		free: 'Free letters; optional paid Plus and coins',
		status: 'active',
		openSource: false,
		website: 'https://slowly.app',
		kind: 'penpal',
		people: 'yes',
		freePlan: 'yes',
		ads: 'yes'
	},
	{
		name: 'InterPals',
		slug: 'open-source-alternative-to-interpals',
		what: 'Long-running pen-pal and cultural exchange community',
		bestFor: 'Pen pals and long correspondence',
		free: 'Free to use; funded by ads',
		status: 'active',
		openSource: false,
		website: 'https://www.interpals.net',
		kind: 'penpal',
		people: 'yes',
		freePlan: 'yes',
		ads: 'yes'
	},
	{
		name: 'Cambly',
		slug: 'open-source-alternative-to-cambly',
		what: 'Paid live English video lessons with tutors',
		bestFor: 'On-demand live English speaking practice',
		free: 'No free plan; paid subscriptions',
		status: 'active',
		openSource: false,
		website: 'https://www.cambly.com',
		kind: 'tutors',
		people: 'paid',
		freePlan: 'no',
		ads: 'none'
	},
	{
		name: 'Preply',
		slug: 'open-source-alternative-to-preply',
		what: 'Tutor marketplace for one-to-one lessons in 90+ languages',
		bestFor: 'Regular weekly lessons with a tutor',
		free: 'Paid trial, then subscription',
		status: 'active',
		openSource: false,
		website: 'https://preply.com',
		kind: 'tutors',
		people: 'paid',
		freePlan: 'no',
		ads: 'none'
	},
	{
		name: 'Babbel',
		slug: 'open-source-alternative-to-babbel',
		what: 'Structured course app with AI speaking practice (Babbel Speak)',
		bestFor: 'Clear grammar and structured lessons',
		free: 'First lesson of each course free',
		status: 'active',
		openSource: false,
		website: 'https://www.babbel.com',
		kind: 'course',
		people: 'no',
		freePlan: 'partial',
		ads: 'none'
	},
	{
		name: 'Memrise',
		slug: 'open-source-alternative-to-memrise',
		what: 'Vocabulary app with native-speaker videos and AI chat',
		bestFor: 'Vocabulary and listening',
		free: 'Limited free plan with ads; Pro subscription',
		status: 'active',
		openSource: false,
		website: 'https://www.memrise.com',
		kind: 'course',
		people: 'no',
		freePlan: 'yes',
		ads: 'free-plan'
	},
	{
		name: 'Speak',
		slug: 'open-source-alternative-to-speak',
		what: 'AI speaking tutor with a structured course',
		bestFor: 'Guided, pressure-free speaking drills',
		free: 'Free trial, then subscription',
		status: 'active',
		openSource: false,
		website: 'https://www.speak.com',
		kind: 'ai',
		people: 'no',
		freePlan: 'no',
		ads: 'none'
	},
	{
		name: 'Praktika',
		slug: 'open-source-alternative-to-praktika',
		what: 'AI avatar tutors for conversation practice',
		bestFor: 'A lifelike AI tutor for shy beginners',
		free: 'Limited free practice; subscription for full access',
		status: 'active',
		openSource: false,
		website: 'https://praktika.ai',
		kind: 'ai',
		people: 'no',
		freePlan: 'partial',
		ads: 'none'
	},
	{
		name: 'Bilingua',
		slug: 'open-source-alternative-to-bilingua',
		what: 'Exchange app that matched partners by interests',
		bestFor: 'Former users looking for a new app',
		free: 'No longer available',
		status: 'Gone from the app stores since 2023',
		openSource: false,
		website: '',
		kind: 'exchange',
		people: 'no',
		freePlan: 'no',
		ads: 'unknown'
	}
];
