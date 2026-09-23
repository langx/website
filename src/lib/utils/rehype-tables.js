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
