/**
 * Markdown tables in the posts, made to read like the one on /compare.
 *
 * - Every table is wrapped in `div.table-wrap`, so a wide one scrolls sideways
 *   on a phone instead of pushing the page wider than the screen.
 * - A cell that answers yes or no gets a class — `yes`, `no`, or `part` for
 *   "Partly" and "Limited" — and the stylesheet draws the mark beside the word.
 *
 * Only a cell that *starts* with the answer counts, and only when the word
 * stands alone or is followed by punctuation: "Yes (BSD-3)" and "No — paid
 * only" are answers; "No ads" is a feature, and gets no cross.
 *
 * A column of letters from another script — the alphabet guides' "ا", "Α α",
 * "ㅒ, ㅖ" — gets `glyph` on its cells, and a column where each cell leads
 * with one ("क ka", "ر ra") gets that letter wrapped in `span.glyph`, so the
 * letter is set at the size of a letter rather than of the words around it.
 * It is decided per column, so a column of words, where "что" is as short as
 * a letter, is not half large and half small.
 *
 * mdsvex runs rehype over the legal pages too (see svelte.config.js); they
 * have no tables, and if they ever do they get the same treatment.
 */

/**
 * The little of hast this needs, spelled out so the file type-checks without
 * a dependency on @types/hast.
 * @typedef {{ type: string, tagName?: string, value?: string, properties?: Record<string, unknown>, children?: HastNode[] }} HastNode
 */

const ANSWER = /^(yes|no|partly|partial|limited)(?=$|[\s]*[—–(:,.;-])/i;
/** @type {Record<string, string>} */
const CLASS = { yes: 'yes', no: 'no', partly: 'part', partial: 'part', limited: 'part' };

/** @param {HastNode} node @returns {string} */
const textOf = (node) =>
	node.type === 'text' ? node.value ?? '' : (node.children ?? []).map(textOf).join('');

/** @param {HastNode} cell */
function mark(cell) {
	const match = textOf(cell).trim().match(ANSWER);
	if (!match) return;
	const props = (cell.properties ??= {});
	const classes = Array.isArray(props.className) ? props.className : [];
	props.className = [...classes, CLASS[match[1].toLowerCase()]];
}

/** Non-Latin letters and their marks, and the Arabic joining stroke. */
const LETTERS = /^[\p{L}\p{M}\u0640\u200c\u200d]+$/u;
const LATIN = /\p{Script=Latin}/u;

/**
 * One to three letters of another script, alone or in a short list:
 * "ا", "Α α", "ㅒ, ㅖ", "ـكـ". Four is a word.
 * @param {string} text
 */
function isGlyph(text) {
	const tokens = text.split(/[\s,]+/).filter(Boolean);
	if (!tokens.length || tokens.some((t) => !LETTERS.test(t) || LATIN.test(t))) return false;
	const letters = tokens.join('').match(/[^\p{M}\u0640\u200c\u200d]/gu) ?? [];
	return letters.length <= 3;
}

/** "क ka": a letter, a space, then Latin. @param {string} text */
const leadOf = (text) => {
	const m = text.match(/^(\S+)\s+(.*\p{Script=Latin}.*)$/u);
	return m && isGlyph(m[1]) ? m : null;
};

/** @param {HastNode} cell @param {string} name */
function addClass(cell, name) {
	const props = (cell.properties ??= {});
	const classes = Array.isArray(props.className) ? props.className : [];
	props.className = [...classes, name];
}

/** @param {HastNode} node @param {string} tag @returns {HastNode[]} */
const all = (node, tag) =>
	(node.children ?? []).flatMap((c) =>
		c.type === 'element' ? (c.tagName === tag ? [c] : all(c, tag)) : []
	);

/** @param {HastNode} table */
function glyphs(table) {
	const rows = all(table, 'tbody').flatMap((b) => all(b, 'tr'));
	const grid = rows.map((r) => (r.children ?? []).filter((c) => c.tagName === 'td'));
	const width = Math.max(0, ...grid.map((r) => r.length));
	for (let col = 0; col < width; col++) {
		const cells = grid.map((r) => r[col]).filter(Boolean);
		const filled = cells.filter((c) => textOf(c).trim());
		if (!filled.length) continue;
		if (filled.every((c) => isGlyph(textOf(c).trim()))) {
			filled.forEach((c) => addClass(c, 'glyph'));
		} else if (
			filled.every((c) => c.children?.length === 1 && c.children[0].type === 'text') &&
			filled.every((c) => leadOf(textOf(c).trim()))
		) {
			for (const c of filled) {
				const [, letter, rest] = /** @type {RegExpMatchArray} */ (leadOf(textOf(c).trim()));
				c.children = [
					{
						type: 'element',
						tagName: 'span',
						properties: { className: ['glyph'] },
						children: [{ type: 'text', value: letter }]
					},
					{ type: 'text', value: ` ${rest}` }
				];
			}
		}
	}
}

/** @param {HastNode} node */
function walk(node) {
	const children = node.children;
	if (!children) return;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.type !== 'element') continue;
		if (child.tagName === 'td') mark(child);
		walk(child);
		if (child.tagName === 'table') {
			glyphs(child);
			children[i] = {
				type: 'element',
				tagName: 'div',
				properties: { className: ['table-wrap'] },
				children: [child]
			};
		}
	}
}

export default function rehypeTables() {
	return (/** @type {HastNode} */ tree) => walk(tree);
}
