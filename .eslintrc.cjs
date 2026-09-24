module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			// These pages build a JSON-LD block from their own data and inject it
			// with {@html}. Listed here because an inline disable comment could
			// not be used while mdsvex also ran over .svelte files (it wrapped an
			// HTML comment in <svelte:head> in a <p>); it no longer does.
			// Matched with wildcards because the directory is literally named
			// "[language]", and brackets are a character class in a glob.
			files: [
				'**/tools/+page.svelte',
				'**/most-common-words/+page.svelte',
				'**/most-common-words/*/+page.svelte',
				'**/tools/say/+page.svelte',
				'**/tools/say/*/+page.svelte',
				'**/tools/vocabulary-test/*/+page.svelte',
				'**/tools/similar/*/+page.svelte',
				'**/tools/alphabet/*/+page.svelte',
				'**/tools/word-game/*/+page.svelte',
				'**/tools/meaning-quiz/*/+page.svelte'
			],
			rules: { 'svelte/no-at-html-tags': 'off' }
		},
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
