<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import UiIcon from '$lib/components/atoms/UiIcon.svelte';

	/**
	 * The one committing action plus the two stores. `primary` decides whether
	 * this instance owns the screen's yellow; a second instance on the same
	 * page passes `false`.
	 */
	export let primary = true;
	export let size: 'md' | 'lg' = 'lg';
	export let align: 'start' | 'center' = 'start';

	export const links = {
		web: 'https://app.langx.io',
		ios: 'https://apps.apple.com/app/languagexchange/id6474187141',
		android: 'https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange'
	};
</script>

<div class="stores {align}">
	<Button href={links.web} variant={primary ? 'primary' : 'dark'} {size}>
		Start for free
		<UiIcon slot="icon" name="arrow-right" size={18} />
	</Button>
	<div class="apps">
		<a href={links.ios} target="_blank" rel="noopener noreferrer">
			<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"
				><path
					d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.8-1.7 0-3.2 1-4.1 2.5-1.8 3.1-.5 7.6 1.3 10.1.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8 1.5 0 2 .8 3.3.8 1.4 0 2.3-1.2 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.9-1.1-2.9-4Zm-2.5-7.4c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.2.1 2.4-.6 3.1-1.5Z"
				/></svg
			>
			App Store
		</a>
		<a href={links.android} target="_blank" rel="noopener noreferrer">
			<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"
				><path
					d="M3.6 2.4 13.4 12l-9.8 9.6c-.3-.2-.5-.6-.5-1V3.4c0-.4.2-.8.5-1Zm1.1-.5c.3-.1.7 0 1 .2l11.5 6.6-2.6 2.6L5 2Zm10 12.4 2.6 2.6L5.7 22c-.3.2-.7.3-1 .2l10-7.9Zm4.6-2.1c.5.3.9.7.9 1.2s-.4.9-.9 1.2l-2.6 1.5-2.9-2.7 2.9-2.7 2.6 1.5Z"
				/></svg
			>
			Google Play
		</a>
	</div>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.stores {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 20px;

		&.center {
			justify-content: center;
		}
	}

	.apps {
		display: flex;
		align-items: center;
		gap: 4px;

		a {
			display: inline-flex;
			align-items: center;
			gap: 7px;
			min-height: 44px;
			padding: 0 12px;
			border-radius: var(--radius-pill);
			font-size: 0.9375rem;
			font-weight: 700;
			color: var(--color--text);
			transition: background-color var(--dur-fast) ease, transform var(--dur-press) var(--ease-out);

			&:active {
				transform: scale(0.97);
			}

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					background: var(--color--muted);
					color: var(--color--text);
				}
			}
		}
	}
</style>
