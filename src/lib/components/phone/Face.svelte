<script lang="ts">
	import { PEOPLE, type PersonId } from './people';

	interface Props {
		who: PersonId;
		/** Diameter in px. */
		size?: number;
		/** The hero's face loads with the page; every other one waits until it is near. */
		eager?: boolean;
		/** A green dot for someone online now. */
		online?: boolean;
		/** A 3px ring in this colour, to lift the face off a ground of the same hue. */
		ring?: string;
	}

	let { who, size = 40, eager = false, online = false, ring }: Props = $props();

	const person = $derived(PEOPLE[who]);
</script>

<span class="face" style="--s:{size}px; {ring ? `--ring:${ring}` : ''}" class:ringed={!!ring}>
	<img
		src="/images/avatars/v3/{person.face}.svg"
		alt="{person.name}’s profile picture"
		width={size}
		height={size}
		loading={eager ? 'eager' : 'lazy'}
		decoding="async"
	/>
	{#if online}<span class="dot" aria-hidden="true"></span>{/if}
</span>

<style lang="scss">
	.face {
		position: relative;
		display: inline-flex;
		flex: 0 0 auto;
		width: var(--s);
		height: var(--s);
		border-radius: 50%;
	}

	.ringed {
		box-shadow: 0 0 0 3px var(--ring);
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.dot {
		position: absolute;
		right: 0;
		bottom: 0;
		width: calc(var(--s) * 0.26);
		height: calc(var(--s) * 0.26);
		border-radius: 50%;
		background: var(--color--online);
		box-shadow: 0 0 0 2px var(--dot-ring, var(--color--page-background));
	}
</style>
