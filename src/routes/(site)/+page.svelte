<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Hero from '$lib/components/organisms/Hero.svelte';
	import LanguageMarquee from '$lib/components/organisms/LanguageMarquee.svelte';
	import Features from '$lib/components/organisms/Features.svelte';
	import PlanCards from '$lib/components/organisms/PlanCards.svelte';
	import Testimonials from '$lib/components/organisms/Testimonials.svelte';
	import FAQ from '$lib/components/organisms/FAQ.svelte';
	import FinalCta from '$lib/components/organisms/FinalCta.svelte';
</script>

<Seo />

<div class="container">
	<Hero />
	<LanguageMarquee />
	<Features />
	<PlanCards />
	<Testimonials />
	<FAQ />
	<FinalCta />
</div>
