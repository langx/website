/**
 * The demonstration people in the v3 phones. Sofia R. (@sofia) is the person
 * holding the phone: a native Spanish speaker learning English. Matching runs
 * both ways, so everyone she is shown or talks to is a native English speaker
 * learning Spanish; Elif and Mateo are kept for screens about other pairs.
 * All of them are made up, and every phone says so in its caption.
 *
 * Faces are the app's v3 default avatars, exported flat from the master sheet
 * into static/images/avatars/v3 (see the README there). Each keeps the ground
 * the avatar board gave it, so a face looks the same here and in the app.
 */
export type Hue = 'tangerine' | 'lime' | 'mint' | 'aqua' | 'sky' | 'lilac';

export interface Person {
	name: string;
	/** File name under /images/avatars/v3, without the extension. */
	face: string;
	native: string;
	learning: string;
}

export const PEOPLE = {
	sofia: { name: 'Sofia', face: 'sofia', native: 'Spanish', learning: 'English' },
	george: { name: 'George', face: 'george', native: 'English', learning: 'Spanish' },
	anna: { name: 'Anna', face: 'anna', native: 'English', learning: 'Spanish' },
	yuki: { name: 'Yuki', face: 'yuki', native: 'English', learning: 'Spanish' },
	katya: { name: 'Katya', face: 'katya', native: 'English', learning: 'Spanish' },
	marina: { name: 'Marina', face: 'marina', native: 'English', learning: 'Spanish' },
	elif: { name: 'Elif', face: 'elif', native: 'Turkish', learning: 'English' },
	mateo: { name: 'Mateo', face: 'mateo', native: 'Spanish', learning: 'English' }
} as const satisfies Record<string, Person>;

export type PersonId = keyof typeof PEOPLE;
