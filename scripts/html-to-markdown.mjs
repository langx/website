// One prerendered page, as Markdown: what an agent gets from langx.io when it
// asks for `Accept: text/markdown`. scripts/markdown.mjs runs this over every
// page in build/ and explains how the result reaches the agent.
//
// Only <main> is converted. The header, footer and cookie of every page are
// the same links repeated 1,400 times, and the frontmatter carries what the
// <head> knows: title, description and canonical URL.
//
// Most of the work is deciding what a reader would not miss. The rules follow
// what a screen reader is told, because that is already the site's statement
// of what each thing is:
//
// - anything `hidden` or `aria-hidden` goes, as do form controls, buttons and
//   the labels that prompt for input. A button inside a heading stays: the
//   FAQ questions are written that way.
// - an element with `role="img"` is a picture, whatever it is drawn with. The
//   phone mock-ups are a few hundred elements of demonstration data each;
//   their `aria-label` ("A LangX chat: two messages arrive, then a correction")
//   is what is kept, like an image's alt text.
// - an image with empty alt text is decoration and goes; one with alt text
//   stays, as a Markdown image.
// - a <nav> that only jumps within the page ("On this page") goes; the
//   headings are right there. One that links elsewhere ("Other languages")
//   stays, since that is how an agent finds the rest of the site.
//
// Three repairs make the text read as it looks:
//
// - inline elements that touch in the markup ("<span>Guide</span><span>
//   Vocabulary</span>") are set apart with a space, where CSS had set them
//   apart with a margin. Nothing on the site splits a word across elements.
// - a link that holds a whole card (title, summary, reading time, tags)
//   becomes `[Title](url) — the rest`, instead of all of it as link text.
// - a <br> in a heading becomes a space; Markdown headings are one line.
//
// Links and images are made absolute against the canonical URL, so the text
// still works when it is quoted somewhere else.
import { fromHtml } from 'hast-util-from-html';
import { toMdast } from 'hast-util-to-mdast';
import { gfmToMarkdown } from 'mdast-util-gfm';
import { toMarkdown } from 'mdast-util-to-markdown';

/**
 * The little of hast this needs.
 * @typedef {{ type: string, tagName?: string, value?: string, properties?: Record<string, any>, children?: HastNode[] }} HastNode
 */

/** Controls, and things that have no text of their own. */
const DROP = new Set([
	'canvas',
	'dialog',
	'input',
	'noscript',
	'script',
	'select',
	'style',
	'svg',
	'template',
	'textarea'
]);

const HEADING = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

/** Elements laid out in a line, which CSS sets apart and the markup may not. */
const INLINE = new Set([
	'a',
	'abbr',
	'b',
	'cite',
	'code',
	'data',
	'dfn',
	'em',
	'i',
	'kbd',
	'mark',
	'q',
	's',
	'samp',
	'small',
	'span',
	'strong',
	'sub',
	'sup',
	'time',
	'u',
	'var'
]);

/** @param {HastNode} node */
const tag = (node) => node.tagName ?? '';

/** @param {HastNode} node @param {string} [tagName] */
const isElement = (node, tagName) =>
	node.type === 'element' && (tagName === undefined || node.tagName === tagName);

/** @param {string} value @returns {HastNode} */
const text = (value) => ({ type: 'text', value });

/**
 * @param {string} tagName
 * @param {Record<string, any>} properties
 * @param {HastNode[]} children
 * @returns {HastNode}
 */
const element = (tagName, properties, children) => ({
	type: 'element',
	tagName,
	properties,
	children
});

/**
 * Depth first, the first node that passes.
 * @param {HastNode} node
 * @param {(node: HastNode) => boolean} test
 * @returns {HastNode | undefined}
 */
function find(node, test) {
	if (test(node)) return node;
	for (const child of node.children ?? []) {
		const found = find(child, test);
		if (found) return found;
	}
}

/**
 * Text content, with a space wherever one element meets the next.
 * @param {HastNode} node
 * @param {HastNode} [skip] a descendant to leave out
 * @returns {string}
 */
function textOf(node, skip) {
	if (node === skip) return '';
	if (node.type === 'text') return node.value ?? '';
	return (node.children ?? [])
		.map((child) => textOf(child, skip))
		.join(' ')
		.replace(/\s+/g, ' ')
		.trim();
}

/** @param {HastNode} node */
const hasImage = (node) => find(node, (n) => isElement(n, 'img')) !== undefined;

/** @param {HastNode} node */
const isEmpty = (node) => textOf(node) === '' && !hasImage(node);

/**
 * @param {HastNode} node
 * @param {boolean} inHeading
 */
function isDropped(node, inHeading) {
	const p = node.properties ?? {};
	if (p.hidden !== undefined && p.hidden !== false) return true;
	if (p.ariaHidden === 'true' || p.ariaHidden === true) return true;
	if (DROP.has(tag(node))) return true;
	if (tag(node) === 'button') return !inHeading;
	if (tag(node) === 'img') return !String(p.alt ?? '').trim();
	if (tag(node) === 'nav') return onlyJumpsWithinPage(node);
	if (tag(node) === 'label') return isPrompt(node);
	return false;
}

/**
 * A label that asks for input ("Search this list", "I know this" beside a
 * box), rather than one that is the choice itself: the vocabulary test's
 * words are each the label of a checkbox, and are the page.
 * @param {HastNode} label
 */
function isPrompt(label) {
	if (label.properties?.htmlFor) return true;
	const control = find(label, (n) => ['input', 'select', 'textarea'].includes(tag(n)));
	return control !== undefined && !['checkbox', 'radio'].includes(String(control.properties?.type));
}

/** A <nav> whose every link is a `#fragment` of this page. @param {HastNode} nav */
function onlyJumpsWithinPage(nav) {
	/** @type {string[]} */
	const hrefs = [];
	find(nav, (n) => {
		if (isElement(n, 'a')) hrefs.push(String(n.properties?.href ?? ''));
		return false;
	});
	return hrefs.every((href) => href.startsWith('#'));
}

/**
 * A link around a card: a title, then a summary, reading time and tags. The
 * title is the heading inside the link if there is one; otherwise the first
 * of several blocks the link is made of. A link with words of its own at the
 * top level is prose, and is left alone, and so is a short one: "all" and
 * "53" in two spans are a word and its count, not a card.
 * @param {HastNode} link
 * @returns {{ title: string, rest: string } | undefined}
 */
function readCard(link) {
	let title = find(link, (n) => HEADING.has(tag(n)));
	if (!title) {
		if (textOf(link).length <= 80) return;
		let node = link;
		for (;;) {
			const children = node.children ?? [];
			if (children.some((c) => c.type === 'text' && c.value?.trim())) return;
			const blocks = children.filter((c) => c.type === 'element' && textOf(c) !== '');
			if (blocks.length === 0) return;
			if (blocks.length > 1) {
				title = blocks[0];
				break;
			}
			node = blocks[0];
		}
	}
	return { title: textOf(title), rest: textOf(link, title) };
}

/**
 * Prune and repair a subtree in place.
 * @param {HastNode} parent
 * @param {boolean} inHeading
 */
function tidy(parent, inHeading) {
	/** @type {HastNode[]} */
	const kept = [];
	for (const node of parent.children ?? []) {
		if (node.type === 'comment') continue;
		if (node.type !== 'element') {
			kept.push(node);
			continue;
		}
		if (isDropped(node, inHeading)) continue;

		const p = node.properties ?? {};
		if (p.role === 'img') {
			const label = String(p.ariaLabel ?? '').trim();
			if (label) kept.push(INLINE.has(tag(node)) ? text(label) : element('p', {}, [text(label)]));
			continue;
		}
		if (inHeading && tag(node) === 'br') {
			kept.push(text(' '));
			continue;
		}

		tidy(node, inHeading || HEADING.has(tag(node)));

		if (tag(node) === 'a') {
			const card = readCard(node);
			if (card) {
				node.children = [text(card.title)];
				kept.push(node);
				if (card.rest) kept.push(text(` — ${card.rest}`));
				continue;
			}
			if (isEmpty(node)) {
				const label = String(p.ariaLabel ?? p.title ?? '').trim();
				if (label) {
					node.children = [text(label)];
					kept.push(node);
				}
				continue;
			}
		}
		if (tag(node) === 'table') {
			// A caption says what the table is (often only to a screen reader);
			// Markdown tables have no caption, so it goes above as a line.
			const caption = node.children?.find((c) => isElement(c, 'caption'));
			if (caption && textOf(caption)) kept.push(element('p', {}, [text(textOf(caption))]));
		}
		if (['li', 'ul', 'ol', 'dl', 'p', 'figure'].includes(tag(node)) && isEmpty(node)) continue;
		kept.push(node);
	}

	// Set apart inline elements that touch.
	parent.children = kept.flatMap((node, index) => {
		const before = kept[index - 1];
		const touching = before && INLINE.has(tag(before)) && INLINE.has(tag(node));
		return touching ? [text(' '), node] : [node];
	});
}

/**
 * @param {HastNode} head
 * @param {string} name `name` or `property` of a <meta>
 */
function meta(head, name) {
	const node = find(
		head,
		(n) => isElement(n, 'meta') && (n.properties?.name === name || n.properties?.property === name)
	);
	return node ? String(node.properties?.content ?? '') : undefined;
}

/**
 * @param {string} html a whole prerendered page
 * @returns {{ url: string, markdown: string } | undefined} undefined for a
 *   page that asks not to be indexed (the 404)
 */
export function htmlToMarkdown(html) {
	const tree = /** @type {HastNode} */ (fromHtml(html));
	const head = find(tree, (n) => isElement(n, 'head'));
	const main = find(tree, (n) => isElement(n, 'main'));
	if (!head || !main) throw new Error('A page with no <head> or no <main>');

	if (/\bnoindex\b/i.test(meta(head, 'robots') ?? '')) return undefined;

	const canonical = find(
		head,
		(n) => isElement(n, 'link') && (n.properties?.rel ?? []).includes('canonical')
	);
	const url = String(canonical?.properties?.href ?? '');
	if (!url) throw new Error('A page with no canonical URL');
	const titleNode = find(head, (n) => isElement(n, 'title'));
	const title = titleNode ? textOf(titleNode) : '';
	const description = meta(head, 'description') ?? '';

	tidy(main, false);
	// <base> is how hast-util-to-mdast resolves relative URLs; it has to come
	// before the first link.
	main.children?.unshift(element('base', { href: url }, []));

	const body = toMarkdown(toMdast(/** @type {any} */ (main)), {
		bullet: '-',
		emphasis: '_',
		rule: '-',
		// Unpadded tables: a thousand-row word list is mostly padding otherwise.
		extensions: [gfmToMarkdown({ tablePipeAlign: false })]
	}).trim();
	if (!body) throw new Error(`${url} converted to an empty page`);

	// JSON strings are valid YAML, and need no thought about colons and quotes.
	const frontmatter = [
		'---',
		`title: ${JSON.stringify(title)}`,
		`description: ${JSON.stringify(description)}`,
		`url: ${JSON.stringify(url)}`,
		'---'
	].join('\n');

	return { url, markdown: `${frontmatter}\n\n${body}\n` };
}
