<script>
	import Counter from './Counter.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<section>
	<h1>Welcome to <span>languageXchange</span>!</h1>
	<p>
		Language learning can be a challenging but rewarding process. At <span>languageXchange</span>,
		we believe that the best way to learn a language is through practice and immersion. That's why
		we've created a platform that connects language learners from around the world, so you can
		practice speaking with native speakers and improve your skills in a fun and engaging way.
	</p>
	<p>
		Our app is coming soon and will offer a range of features to help you on your language learning
		journey. From personalized lesson plans to conversation practice with native speakers, our app
		has everything you need to take your language skills to the next level. Stay tuned for updates
		and get ready to start your language learning adventure with <span>languageXchange</span>!
	</p>
	<p>
		<span>languageXchange</span> is an open source project and we welcome contributions from the
		community. If you're interested in contributing, please check out our
		<a href="https://github.com/languageXchange/website">GitHub repository</a> for more information.
	</p>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	span {
		font-weight: bold;
	}
</style>
