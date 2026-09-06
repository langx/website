<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Hero from '$lib/components/organisms/Hero.svelte';
	import ChatCard from '$lib/components/organisms/ChatCard.svelte';
	import LanguageChips from '$lib/components/organisms/LanguageChips.svelte';
	import Features from '$lib/components/organisms/Features.svelte';
	import PlanCards from '$lib/components/organisms/PlanCards.svelte';
	import Testimonials from '$lib/components/organisms/Testimonials.svelte';
	import FinalCta from '$lib/components/organisms/FinalCta.svelte';
</script>

<Seo />

<div class="container">
	<Hero />
	<ChatCard />
	<LanguageChips />
	<Features />
	<PlanCards />
	<Testimonials />
	<FinalCta />
</div>
