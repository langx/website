import type { Competitor } from './competitors';

/**
 * The rows /compare puts every app through, and the words in each cell. One
 * file, three readers — the head-to-head picker, the icon rows and the full
 * matrix — so the same field always shows the same mark and word.
 *
 * Every cell is a mark and a word, never colour alone: the icon carries the
 * scan, the word the meaning, so nothing depends on telling blue from grey.
 */
export type Mark = 'yes' | 'part' | 'no' | '';
export type Cell = { mark: Mark; text: string };

/** Can you have a conversation with a real person? */
export const PEOPLE: Record<Competitor['people'], Cell> = {
	yes: { mark: 'yes', text: 'Yes' },
	paid: { mark: 'part', text: 'Paid tutors' },
	partial: { mark: 'part', text: 'Corrections only' },
	no: { mark: 'no', text: 'No' }
};

/** A plan you can keep using without paying. */
export const FREE: Record<Competitor['freePlan'], Cell> = {
	yes: { mark: 'yes', text: 'Yes' },
	partial: { mark: 'part', text: 'Trial or limited' },
	no: { mark: 'no', text: 'No' }
};

/**
 * Ads, with the mark on the reader's side: a check is good news, so no ads
 * gets the check and ads get the cross. Sources are in competitors.ts.
 */
export const ADS: Record<Competitor['ads'], Cell> = {
	none: { mark: 'yes', text: 'None' },
	'free-plan': { mark: 'part', text: 'Free plan only' },
	yes: { mark: 'no', text: 'Yes' },
	unknown: { mark: '', text: '—' }
};

/** The map: every app under the kind of thing it is. */
export type Kind = { kind: Competitor['kind']; title: string; what: string; icon: string };
export const KINDS: Kind[] = [
	{
		kind: 'exchange',
		title: 'Language exchange',
		what: 'You talk with people learning your language',
		icon: 'chat'
	},
	{ kind: 'penpal', title: 'Pen pals', what: 'Longer, slower letters and messages', icon: 'feed' },
	{
		kind: 'tutors',
		title: 'Paid tutors',
		what: 'Lessons with a teacher, booked and paid',
		icon: 'award'
	},
	{
		kind: 'course',
		title: 'Courses',
		what: 'Structured lessons; little or no talking to people',
		icon: 'star'
	},
	{ kind: 'ai', title: 'AI tutors', what: 'You talk with an AI, not a person', icon: 'sparkle' }
];
export const KIND_LABEL = Object.fromEntries(KINDS.map((k) => [k.kind, k.title])) as Record<
	Competitor['kind'],
	string
>;

/**
 * LangX in the same rows as everyone else. Each line has to stay true of the
 * shipping app — see PRODUCT.md and `plans.ts`.
 */
export const LANGX = {
	name: 'LangX',
	what: 'Two-way exchange with corrections and translation in the chat, plus free Echo packs to learn from',
	kind: 'Language exchange + Echo packs',
	people: { mark: 'yes', text: 'Yes' } as Cell,
	freePlan: { mark: 'yes', text: 'Yes' } as Cell,
	free: 'Unlimited replies and corrections; 5 new conversations a day',
	ads: { mark: 'yes', text: 'None' } as Cell,
	openSource: { mark: 'yes', text: 'Yes (BSD-3)' } as Cell,
	bestFor: 'Practice that teaches, without ads'
};

/**
 * One honest paragraph on LangX and one other app, built from the fields
 * rather than written per app, so it can never say more than the table does.
 */
export function verdict(c: Competitor): string {
	if (c.status !== 'active') {
		return `${c.name} is no longer available: ${c.status.toLowerCase()}. The comparison is kept for people who used it and are looking for a new app.`;
	}

	const lines: string[] = [];

	switch (c.people) {
		case 'yes':
			lines.push('Both put you in touch with real people.');
			break;
		case 'paid':
			lines.push(`${c.name} sells lessons with tutors; LangX is a free exchange between learners.`);
			break;
		case 'partial':
			lines.push(`On ${c.name} people correct your exercises; on LangX you talk with them.`);
			break;
		case 'no':
			lines.push(
				c.kind === 'ai'
					? `${c.name} gives you an AI to talk to; LangX gives you a person.`
					: `${c.name} has no one to talk to; LangX is made of people.`
			);
			break;
	}

	// A course app and LangX both give you something to study alone: its
	// lessons, and Echo's free packs (see echo.ts).
	if (c.kind === 'course') {
		lines.push(`Both give you something to study alone: ${c.name} its lessons, LangX its free Echo packs.`);
	}

	if (c.ads === 'free-plan') {
		lines.push(`${c.name} shows ads on its free plan; LangX shows none on any plan.`);
	} else if (c.ads === 'yes') {
		lines.push(`${c.name} shows ads; LangX shows none.`);
	} else if (c.ads === 'none') {
		lines.push('Neither shows ads.');
	}

	if (!c.openSource) lines.push(`LangX is open source; ${c.name} is not.`);

	return lines.join(' ');
}
