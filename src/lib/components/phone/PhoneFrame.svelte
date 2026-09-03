<script lang="ts">
	/**
	 * The device from the design: 390 wide, 36px corners, a hairline edge and a
	 * status bar. Screens inside are real HTML in the app's own sizes, so a
	 * screen here looks like the screen in the app. Parents scale the whole
	 * device with `--phone-zoom`.
	 */
	export let label: string;
	/** `fixed` is the device height (844); `auto` hugs the content. */
	export let height: 'fixed' | 'auto' = 'fixed';
	export let statusBar = true;
	export let time = '9:41';
	/** Every screen is a demonstration; the caption says so where a visitor can read it. */
	export let caption = 'Example screen. Names and numbers are demonstration data.';
</script>

<figure class="device">
	<div class="phone {height}" role="img" aria-label={label}>
		{#if statusBar}
			<div class="status" aria-hidden="true">
				<span>{time}</span>
				<span class="glyphs"><span class="signal" /><span class="battery" /></span>
			</div>
		{/if}
		<div class="screen">
			<slot />
		</div>
	</div>
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style lang="scss">
	.device {
		--phone-w: 390px;
		zoom: var(--phone-zoom, 1);
		width: 100%;
		max-width: var(--phone-w);
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.phone {
		width: 100%;
		background: var(--color--surface);
		border: 1px solid var(--color--border);
		border-radius: var(--radius-phone);
		box-shadow: var(--shadow-phone);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		color: var(--color--text);
		font-family: var(--font--default);
		font-size: 16px;
		line-height: 1.5;
		text-align: left;
		// The device is a replica, not a control surface: nothing inside it is
		// a real target.
		user-select: none;
	}

	.fixed {
		height: 844px;
	}

	.auto {
		min-height: 0;
	}

	figcaption {
		font-size: 13px;
		line-height: 1.4;
		color: var(--color--text-quiet);
		text-align: center;
	}

	.status {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18px 26px 6px;
		font-size: 13px;
		font-weight: 600;
		flex: 0 0 auto;
	}

	.glyphs {
		display: flex;
		gap: 6px;
		align-items: center;
	}

	.signal {
		width: 16px;
		height: 9px;
		background: currentColor;
		border-radius: 2px;
		display: block;
	}

	.battery {
		width: 22px;
		height: 11px;
		border: 1.5px solid currentColor;
		border-radius: 3px;
		display: block;
	}

	.screen {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}
</style>
