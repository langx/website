<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Hero from '$lib/components/organisms/Hero.svelte';
	import LanguageMarquee from '$lib/components/organisms/LanguageMarquee.svelte';
	import Story from '$lib/components/organisms/Story.svelte';
	import Anywhere from '$lib/components/organisms/Anywhere.svelte';
	import OpenSource from '$lib/components/organisms/OpenSource.svelte';
	import Testimonials from '$lib/components/organisms/Testimonials.svelte';
	import Faq from '$lib/components/organisms/FAQ.svelte';
	import FinalCta from '$lib/components/organisms/FinalCta.svelte';
</script>

<Seo />

<div class="container">
	<Hero />
	<LanguageMarquee />
	<Story />
	<Anywhere />
	<OpenSource />
	<Testimonials />
	<Faq />
	<FinalCta />
</div>
