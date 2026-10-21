/** A run of text in a correction: kept, struck out, or put in. */
export type Part = string | { del: string } | { ins: string };

export type ThreadItem =
	| { t: 'day'; text: string }
	| { t: 'them' | 'me'; text: string; lang?: string }
	| { t: 'fix'; by: string; parts: Part[]; lang?: string };

/** The bottom sheet a correction is written in. */
export interface FixSheet {
	title: string;
	/** The sentence as sent, with the wrong part struck out. */
	before: Part[];
	/** The sentence as fixed, with the new part marked. */
	after: Part[];
	note?: string;
	lang?: string;
}
