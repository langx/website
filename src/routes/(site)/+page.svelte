<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Hero from '$lib/components/organisms/Hero.svelte';
	import LanguageMarquee from '$lib/components/organisms/LanguageMarquee.svelte';
	import Story from '$lib/components/organisms/Story.svelte';
	import ChatCard from '$lib/components/organisms/ChatCard.svelte';
	import Anywhere from '$lib/components/organisms/Anywhere.svelte';
	import Features from '$lib/components/organisms/Features.svelte';
	import TokenSection from '$lib/components/organisms/TokenSection.svelte';
	import GuessTheLanguage from '$lib/components/organisms/GuessTheLanguage.svelte';
	import PlanCards from '$lib/components/organisms/PlanCards.svelte';
	import Testimonials from '$lib/components/organisms/Testimonials.svelte';
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
				mainEntity: faqObjects.map((q) => ({
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
	The page shows the app before it describes it: a chat playing in the hero,
	four chapters with the screens that make each point, then the things a still
	screen cannot show. Only after that does it tell (the six), let you play
	(the guessing game) and ask (plans, reviews, the FAQ and the closing call).
-->
<div class="container">
	<Hero />
	<LanguageMarquee />
	<Story />
	<ChatCard />
	<Anywhere />
	<Features />
	<TokenSection />
	<GuessTheLanguage />
	<PlanCards />
	<Testimonials />
	<FAQ />
	<FinalCta />
</div>
