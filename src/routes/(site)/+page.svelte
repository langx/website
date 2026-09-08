<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Hero from '$lib/components/organisms/Hero.svelte';
	import LanguageMarquee from '$lib/components/organisms/LanguageMarquee.svelte';
	import Story from '$lib/components/organisms/Story.svelte';
	import ChatCard from '$lib/components/organisms/ChatCard.svelte';
	import Anywhere from '$lib/components/organisms/Anywhere.svelte';
	import Features from '$lib/components/organisms/Features.svelte';
	import GuessTheLanguage from '$lib/components/organisms/GuessTheLanguage.svelte';
	import PlanCards from '$lib/components/organisms/PlanCards.svelte';
	import Testimonials from '$lib/components/organisms/Testimonials.svelte';
	import FAQ from '$lib/components/organisms/FAQ.svelte';
	import FinalCta from '$lib/components/organisms/FinalCta.svelte';
</script>

<Seo />

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
	<GuessTheLanguage />
	<PlanCards />
	<Testimonials />
	<FAQ />
	<FinalCta />
</div>
