/**
 * Real reviews, quoted as written, from the public Google Play listing
 * (tech.newchapter.languageXchange; read again on 23 September 2026). App
 * Store ratings for the app exist (5.0 from 11 ratings on 2 Sep 2026) but no
 * written App Store reviews are published in Apple's public feed, so the
 * quotes are all Google Play.
 *
 * One file, two readers: the homepage shows the first six, /compare all of
 * them. A quote may be shortened, never reworded. `avatar` is the reviewer's
 * own Google Play picture (static/images/reviews, see its README); a reviewer
 * without one gets initials on a tone, the way the app draws a profile with
 * no photo. Add a review only from the listing.
 */
export type Review = {
	name: string;
	store: string;
	body: string;
	initials: string;
	/** Path under static/; absent when the reviewer has no picture on Google Play. */
	avatar?: string;
	/** The fill behind the initials when there is no picture. */
	tone?: 'accent' | 'success' | 'ink' | 'pro';
};

export const reviews: Review[] = [
	{
		name: 'Amanda Hernandez',
		store: 'Google Play',
		initials: 'AH',
		avatar: '/images/reviews/amanda.webp',
		body: 'Great app!! If you are wanting to have real conversations with someone that speaks the language you are trying to learn, this app is what you need!'
	},
	{
		name: 'Erica Harris',
		store: 'Google Play',
		initials: 'EH',
		avatar: '/images/reviews/erica.webp',
		body: 'The admin team are awesome. This app has so much potential and they are working on it everyday to improve the experience.'
	},
	{
		name: 'Burak',
		store: 'Google Play',
		initials: 'B',
		tone: 'success',
		body: "As an English teacher, I came across it by chance with the idea that my students could get extra practice. I'm already looking forward to it. I definitely recommend it!"
	},
	{
		name: 'Aaron Ros',
		store: 'Google Play',
		initials: 'AR',
		avatar: '/images/reviews/aaron.webp',
		body: "I must say this app look gorgeous. It's simple and straightforward but on the other hand has it's style and I personally have enjoyed signing up and completing my profile."
	},
	{
		name: 'Dasha Durneva',
		store: 'Google Play',
		initials: 'DD',
		avatar: '/images/reviews/dasha.webp',
		body: 'Simple yet user-friendly design encourages to chat with language learners like myself. Highly recommend this app!!!'
	},
	{
		name: 'Martín Didoli',
		store: 'Google Play',
		initials: 'MD',
		tone: 'ink',
		body: 'The application is open source and the team behind it is really cool. Try it and meet cool people.'
	},
	{
		name: 'Mubarak',
		store: 'Google Play',
		initials: 'M',
		avatar: '/images/reviews/mubarak.webp',
		body: "It's the best app.. way better than tandem and other learning platforms"
	},
	{
		name: 'Elias',
		store: 'Google Play',
		initials: 'E',
		avatar: '/images/reviews/elias.webp',
		body: 'Really good language learning app. Free, without ads and open source.'
	},
	{
		name: 'Albert Coca Abello',
		store: 'Google Play',
		initials: 'AC',
		tone: 'pro',
		body: "It's my first Language Exchange App, so far it's quite good! No advertisement and I'm starting to talk to some people, Spanish learning Chinese! It's also Open Source"
	},
	{
		name: 'Ray Carnes',
		store: 'Google Play',
		initials: 'RC',
		avatar: '/images/reviews/ray.webp',
		body: 'Great free App to connect with others wanting to brush up on language skills!!'
	},
	{
		name: 'Layla Kabbaj',
		store: 'Google Play',
		initials: 'LK',
		avatar: '/images/reviews/layla.webp',
		body: 'Great concept & great admin! Love that it allows you to connect with people'
	},
	{
		name: 'Emre Kutuk',
		store: 'Google Play',
		initials: 'EK',
		tone: 'success',
		body: 'It is a perfect app. Zero cost and lots of practice. It is also easy to use and supporting web, ios, android.'
	}
];

/** The store ratings, as the reviews section states them. */
export const ratingsLine = 'Rated 5.0 on the App Store and 4.4 on Google Play.';
