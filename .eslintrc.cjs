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
			// These two build a JSON-LD block from their own data and inject it
			// with {@html}. The usual inline disable comment cannot be used:
			// mdsvex runs markdown over .svelte files here, and an HTML comment
			// in <svelte:head> makes it wrap the tag in a <p>.
			// Matched with wildcards because the directory is literally named
			// "[language]", and brackets are a character class in a glob.
			files: ['**/most-common-words/+page.svelte', '**/most-common-words/*/+page.svelte'],
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
