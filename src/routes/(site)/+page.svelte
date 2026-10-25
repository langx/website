<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import HomeHero from '$lib/components/home/HomeHero.svelte';
	import HelloStrip from '$lib/components/home/HelloStrip.svelte';
	import Chapter from '$lib/components/home/Chapter.svelte';
	import Reviews from '$lib/components/home/Reviews.svelte';
	import FreeToStart from '$lib/components/home/FreeToStart.svelte';
	import Phone from '$lib/components/phone/Phone.svelte';
	import PeopleScreen from '$lib/components/phone/PeopleScreen.svelte';
	import ThreadScreen from '$lib/components/phone/ThreadScreen.svelte';
	import EchoScreen from '$lib/components/phone/EchoScreen.svelte';
	import TodayScreen from '$lib/components/phone/TodayScreen.svelte';
	import CallScreen from '$lib/components/phone/CallScreen.svelte';
	import FAQ from '$lib/components/organisms/FAQ.svelte';
	import FinalCta from '$lib/components/organisms/FinalCta.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import { faqObjects } from '$lib/data/faq';
	import {
		appStoreUrl,
		description,
		image,
		organization,
		playStoreUrl,
		siteBaseUrl
	} from '$lib/data/meta';

	const stripTags = (html: string) => html.replace(/<[^>]+>/g, '');

	// The homepage asks five; /faq has them all.
	const HOME_QUESTIONS = [1, 2, 12, 3, 11];
	const homeFaq = HOME_QUESTIONS.map((id) => faqObjects.find((q) => q.id === id)!).map((q) => ({
		...q,
		content: q.short ?? q.content
	}));

	/**
	 * Who publishes the site, what the site is, and the app it is for. No
	 * rating is given: there is no aggregate we could honestly cite. The offer
	 * at 0 is the free plan, which is real and permanent.
	 */
	const ld = {
		'@context': 'https://schema.org',
		'@graph': [
			organization,
			{
				'@type': 'WebSite',
				'@id': `${siteBaseUrl}/#website`,
				name: 'LangX',
				url: siteBaseUrl,
				description,
				publisher: { '@id': `${siteBaseUrl}/#organization` },
				inLanguage: 'en'
			},
			{
				'@type': 'MobileApplication',
				'@id': `${siteBaseUrl}/#app`,
				name: 'LangX',
				description,
				url: siteBaseUrl,
				image,
				applicationCategory: 'EducationalApplication',
				operatingSystem: 'iOS, Android, Web',
				installUrl: [appStoreUrl, playStoreUrl, 'https://app.langx.io'],
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', category: 'Free plan' },
				publisher: { '@id': `${siteBaseUrl}/#organization` },
				license: 'https://opensource.org/licenses/BSD-3-Clause',
				isAccessibleForFree: true
			},
			{
				'@type': 'FAQPage',
				mainEntity: homeFaq.map((q) => ({
					'@type': 'Question',
					name: q.title,
					acceptedAnswer: { '@type': 'Answer', text: stripTags(q.content) }
				}))
			}
		]
	};
</script>

<Seo path="/" />
<JsonLd data={ld} />

<!--
	Colour blocks, one idea each: the hero thread, hello in eleven languages,
	then five chapters with the phone that makes each point (People,
	Corrections, Echo, Streaks, Calls), with Venus, the streak cat, after
	Streaks, and only then reviews, plans, questions
	and the closing call. No prices or token numbers here: those are on /plans,
	/faq and /tokens.
-->
<HomeHero />
<HelloStrip />

<Chapter
	id="people"
	hue="tangerine"
	tag="Matching"
	title="find someone learning yours."
	phoneSide="left"
	link={{ href: 'https://app.langx.io', label: 'See who is learning Spanish' }}
>
	<p>
		Say what you speak and what you are learning. LangX shows you native speakers who fit, and who
		are around right now.
	</p>
	<p><strong>Not a dating app. Just people who want to practise.</strong></p>
	{#snippet phone()}
		<Phone
			label="LangX app: Yuki and Katya, English speakers learning Spanish"
			cut="phone"
			cutHeight={420}
		>
			<PeopleScreen />
		</Phone>
	{/snippet}
</Chapter>

<Chapter
	id="corrections"
	hue="aqua"
	tag="Corrections"
	title="fix each other’s mistakes."
	phoneSide="right"
>
	<p>
		Hold a message, change what is wrong, send. Your partner sees exactly what changed, and you get
		the same help back.
	</p>
	<p class="pill-note">
		<svg
			aria-hidden="true"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg
		>Replies and corrections are free on every plan.
	</p>
	{#snippet phone()}
		<Phone
			label="LangX app: Sofia corrects Marina’s Spanish: estoy muy cansada, not soy muy cansada"
			height={560}
			cut="phone"
			cutHeight={460}
		>
			<ThreadScreen
				partner="marina"
				hue="aqua"
				composer={false}
				items={[
					{ t: 'me', text: '¿Qué tal tu día?', lang: 'es' },
					{ t: 'them', text: 'Soy muy cansada después del trabajo.', lang: 'es' }
				]}
				sheet={{
					title: 'Fix Marina’s sentence',
					before: [{ del: 'Soy' }, ' muy cansada después del trabajo.'],
					after: [{ ins: 'Estoy' }, ' muy cansada después del trabajo.'],
					note: 'For how you feel right now, use estar.',
					lang: 'es'
				}}
			/>
		</Phone>
	{/snippet}
</Chapter>

<Chapter
	id="echo"
	hue="sky"
	tag="Echo"
	title="the words you missed come back."
	phoneSide="left"
	link={{ href: '/faq#echo', label: 'How Echo works' }}
>
	<p>
		Keep any sentence from a chat in Echo. It comes back tomorrow, then in three days, then in a
		week, until you know it.
	</p>
	{#snippet phone()}
		<Phone
			label="LangX app: an Echo card from the chat with George, On Saturday I went to the beach"
			height={520}
			cut="phone"
			cutHeight={440}
		>
			<EchoScreen />
		</Phone>
	{/snippet}
</Chapter>

<Chapter
	id="streaks"
	hue="lime"
	tag="Streaks"
	title="keep your streak going."
	phoneSide="right"
	link={{ href: '/faq#streaks', label: 'How streaks work' }}
>
	<p>One message a day keeps your streak alive. Miss a day, and a streak freeze can cover it.</p>
	{#snippet phone()}
		<Phone
			label="LangX app: a twelve-day streak and chats with George, Marina and Yuki"
			cut="phone"
			cutHeight={420}
		>
			<TodayScreen />
		</Phone>
	{/snippet}
</Chapter>

<Chapter
	id="venus"
	hue="lilac"
	tag="Venus"
	title="meet venus, our cat."
	phoneSide="left"
	link={{ href: '/venus', label: 'Meet Venus' }}
>
	<p>
		A tiny cat with huge ears and even bigger confidence. She is sure she runs the place. Then a
		moth flies past.
	</p>
	<p>
		<strong>Funny, lovable, and the joke is always on her.</strong> Send her to your partner: her stickers
		are free in every chat.
	</p>
	{#snippet phone()}
		<img
			class="venus"
			src="/images/venus/venus-hi.webp"
			alt="Venus, the LangX cat, waving hello: a cartoon cat with huge pink ears."
			width="480"
			height="480"
			loading="lazy"
		/>
	{/snippet}
</Chapter>

<Chapter
	id="calls"
	hue="mint"
	tag="Calls"
	title="call when you are ready to talk."
	phoneSide="left"
	link={{ href: '/faq#calls', label: 'When you can call' }}
>
	<p>
		Voice and video calls right inside the chat, on iPhone and the web. Type first, talk when it
		feels right.
	</p>
	{#snippet phone()}
		<Phone
			label="LangX app: a voice call with George, four minutes in"
			height={560}
			cut="phone"
			cutHeight={400}
			dark
		>
			<CallScreen />
		</Phone>
	{/snippet}
</Chapter>

<div class="plain">
	<Reviews />
	<FreeToStart />
	<FAQ items={homeFaq} more={{ href: '/faq', label: 'All questions' }} />
</div>

<FinalCta bleed />

<style lang="scss">
	.plain {
		display: flex;
		flex-direction: column;
		gap: 72px;
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding: 56px 16px 72px;

		@media (min-width: 768px) {
			max-width: calc(var(--container-max) + 64px);
			padding: 112px 32px;
			gap: 112px;
		}
	}

	.plain > :global(.faq) {
		padding-top: 0;
	}

	// Venus stands in for the phone: the same 320px column, and on a phone
	// some room under her before the next block.
	.venus {
		display: block;
		width: 100%;
		max-width: 320px;
		height: auto;
		padding-bottom: 32px;

		@media (min-width: 900px) {
			padding-bottom: 0;
		}
	}

	.pill-note {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 40px;
		padding: 6px 16px;
		border-radius: 999px;
		box-shadow: inset 0 0 0 2px currentColor;
		font-weight: 800;
		font-size: 0.9375rem;
	}
</style>
