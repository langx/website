<script lang="ts">
	import Seo from '$lib/components/atoms/Seo.svelte';
	import Block from '$lib/components/atoms/Block.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import JsonLd from '$lib/components/atoms/JsonLd.svelte';
	import { siteBaseUrl } from '$lib/data/meta';
	import { venusStickers } from '$lib/data/venus-stickers';

	// Every picture here is a render of the 2D vector rig, cut from the
	// character's own sheets and sticker files: no photo of a real cat.
	const IMG = '/images/venus';

	// Where the stickers are public today. WhatsApp adds packs only from an
	// app, so it waits for the LangX app's own export; Signal waits for someone
	// to upload the pack from Signal Desktop, and is left out until then.
	const TELEGRAM = 'https://t.me/addstickers/venus_langx';
	const GIPHY = 'https://giphy.com/langx/venus-stickers';
	const ZIP = `${IMG}/venus-langx-stickers.zip`;

	const traits = [
		{
			k: 'She wants',
			v: 'To be magnificent. The best bag, the highest counter, the most admired ears. She is named after a goddess and expects a little worship.'
		},
		{
			k: 'She needs',
			v: 'Your company. She will never say it. Her tail says it every time.'
		},
		{
			k: 'Her flaw',
			v: 'Big plans and a cat brain. She starts a grand speech, then a moth flies past.'
		},
		{
			k: 'Her tell',
			v: 'Her mouth plays it cool. Her ears and her tail tell the truth.'
		},
		{
			k: 'Her comeback',
			v: 'When she falls, she gets up as if she meant it. One paw lick, chin up.'
		}
	];

	const lines = [
		{ img: '27-meant-it', text: 'I tried to jump on the fridge for you. …Next time.' },
		{ img: '12-slow-blink', text: 'Mrrr… acceptable. …My ears say “amazing”. Ignore them.' },
		{ img: '32-hunt', text: 'Your streak outlasts my attention span. …Ooh, a moth. What?' },
		{ img: '36-wasnt-me', text: 'Proud of you. That was hard to say. Move along.' },
		{ img: '24-box-hide', text: 'Hello. I’m Venus. Mostly ears. Some cat.' }
	];

	const gags = [
		{ k: 'The bag', v: 'Any bag is a throne. She will share it with you. Probably.' },
		{ k: 'The verdict', v: '“Acceptable” is her top mark. Anything more is news.' },
		{
			k: 'The fridge',
			v: 'She jumps for it in your honour. She misses. One day she will make it.'
		},
		{ k: 'The red dot', v: 'Never caught. She says she is letting it win.' },
		{ k: 'The mirror cat', v: 'Her one rival. It copies everything she does. Rude.' },
		{ k: 'The vacuum', v: 'Heard, never seen. She hops a metre away, then: “I wasn’t scared.”' },
		{ k: 'The counter', v: 'She is not allowed up there. She is always up there.' }
	];

	const faces = [
		{ id: 'pleased', name: 'Pleased' },
		{ id: 'squint', name: 'The inspector' },
		{ id: 'slow-blink', name: 'Slow blink' },
		{ id: 'blep', name: 'Blep' },
		{ id: 'shocked', name: 'Shocked' },
		{ id: 'smug', name: 'Smug' },
		{ id: 'sleepy', name: 'Sleepy' },
		{ id: 'curious', name: 'What is that?' },
		{ id: 'proud', name: 'Proud of you' },
		{ id: 'innocent', name: 'Who, me?' },
		{ id: 'diva', name: 'Diva' },
		{ id: 'sceptical', name: 'Really?' }
	];

	const habits = [
		{
			img: '12-slow-blink',
			k: 'The slow blink',
			v: 'Cat for “I trust you”. It is how she says goodbye.'
		},
		{ img: '30-knead', k: 'Making biscuits', v: 'Kneading a cushion. She says it is exercise.' },
		{
			img: '26-zoomies',
			k: 'Zoomies',
			v: 'Across the room at full speed, then she sits as if nothing happened.'
		},
		{ img: '23-knock-off', k: 'Knocking things off', v: 'Eye contact, then one slow paw push.' },
		{ img: '32-hunt', k: 'The butt wiggle', v: 'Rump sways, she pounces, she misses.' },
		{ img: '24-box-hide', k: 'The box', v: 'A fancy new toy arrives. She sits in its box.' },
		{
			img: '29-notes',
			k: 'Sitting on your notes',
			v: 'Whatever you are reading, she is now on it.'
		},
		{ img: '33-gift', k: 'The gift', v: 'She drops the toy mouse at your feet. You are welcome.' },
		{ img: '27-meant-it', k: '“I meant to do that.”', v: 'Her answer to every fall.' }
	];

	const food = [
		{
			img: '19-hamsi',
			k: 'Her favourite fish: hamsi',
			v: 'A goddess, and her dream dinner is the smallest fish at the market. Whole and fresh, please.',
			star: true
		},
		{
			img: '22-chicken',
			k: 'Her top reward: boiled chicken',
			v: 'Plain, shredded, nothing on it. The fancy food gets a sniff. This gets a full-body reaction.',
			star: true
		},
		{
			img: '21-empty-bowl',
			k: 'The empty bowl',
			v: 'Three-quarters full, but she can see the bottom in the middle. So it is empty.'
		},
		{
			img: '36-wasnt-me',
			k: 'Counter thefts',
			v: 'The butter has a tongue-shaped groove in it. Nobody saw anything.'
		}
	];

	type Clip = {
		id: string;
		label: string;
		lang: string;
		dir: 'ltr' | 'rtl';
		line: string;
		en?: string;
	};

	const clips: Clip[] = [
		{
			id: 'en',
			label: 'English',
			lang: 'en',
			dir: 'ltr',
			line: 'Hi. I’m Venus. I’m in charge of the streak counter. …Cats can’t count. Don’t tell anyone.'
		},
		{
			id: 'tr',
			label: 'Türkçe',
			lang: 'tr',
			dir: 'ltr',
			line: 'Selam. Ben Venüs. Seri sayacından ben sorumluyum. …Kediler saymayı bilmez. Kimseye söyleme.',
			en: 'Hi. I’m Venus. I’m in charge of the streak counter. …Cats can’t count. Don’t tell anyone.'
		},
		{
			id: 'es',
			label: 'Español',
			lang: 'es',
			dir: 'ltr',
			line: 'Tenía todo un discurso. Me lamí la nariz. Adiós discurso.',
			en: 'I had a whole speech. Then I licked my nose. Gone.'
		},
		{
			id: 'ar',
			label: 'العربية',
			lang: 'ar',
			dir: 'rtl',
			line: 'كان عندي خطاب كامل. ثم لعقت أنفي. ضاع.',
			en: 'I had a whole speech. Then I licked my nose. Gone.'
		}
	];

	const languages = [
		'English',
		'Türkçe',
		'Español',
		'Português',
		'Français',
		'Deutsch',
		'Русский',
		'العربية'
	];

	const description =
		'Meet Venus, the LangX cat: tiny, huge ears, even bigger confidence. Her faces, her habits, her favourite fish, and her free sticker pack.';

	const ld = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${siteBaseUrl}/venus#webpage`,
		url: `${siteBaseUrl}/venus`,
		name: 'Meet Venus, the LangX cat',
		description,
		inLanguage: 'en',
		isPartOf: { '@id': `${siteBaseUrl}/#website` },
		primaryImageOfPage: `${siteBaseUrl}${IMG}/og.png`
	};
</script>

<Seo
	title="Meet Venus, the LangX cat"
	path="/venus"
	{description}
	keywords={['venus', 'langx cat', 'langx mascot', 'cat stickers', 'telegram stickers', 'giphy']}
	ogImage="{siteBaseUrl}{IMG}/og.png"
	ogImageAlt="Venus, the LangX cat, waving: a cartoon cat with huge ears on a lilac card that says meet venus."
/>
<JsonLd data={ld} />

<!--
	The public side of the character: who she is, how she talks, her faces,
	her cat habits and food, a few clips in four of her eight languages, and
	the sticker pack people can use today. The daily streak videos are on in
	production, but only the web app plays them for now: the phone build the
	stores serve (2.9) has no player and cannot get one by OTA, so the phone
	apps are still "coming". Say they are in the apps only once the App Store
	and Google Play serve a version that plays them. They stop after day 100,
	because that is where the files stop. Adding the pack to WhatsApp needs
	the 3.1 app, so that card stays "coming soon".
-->
<Block hue="lilac" pad="hero" labelledby="venus-title">
	<div class="hero">
		<div class="copy">
			<Tag tone="ink">The LangX cat</Tag>
			<h1 id="venus-title" class="display-hero">meet venus.</h1>
			<p>
				A tiny cat with huge ears and even bigger confidence. She is sure she runs the place. Being
				a cat undoes her every day. And she is always on your side.
			</p>
			<p>Funny, lovable, and the joke is always on her. Never on you.</p>
			<span class="ask">
				<Button href="#stickers" variant="ink" size="lg">Get her stickers</Button>
			</span>
		</div>
		<img
			class="wave"
			src="{IMG}/venus-hi.webp"
			alt="Venus waving hello: a cartoon cat with huge pink ears, green eyes and a striped forehead."
			width="480"
			height="480"
			fetchpriority="high"
		/>
	</div>
</Block>

<section class="column" aria-labelledby="who-title">
	<h2 id="who-title" class="display-section">who she is.</h2>
	<dl class="traits">
		{#each traits as t}
			<div>
				<dt>{t.k}</dt>
				<dd>{t.v}</dd>
			</div>
		{/each}
	</dl>
</section>

<Block hue="aqua" labelledby="talk-title">
	<div class="stack">
		<Tag tone="ink">How she talks</Tag>
		<h2 id="talk-title" class="display-chapter">dry first, warm last.</h2>
		<p class="lede">
			A short line, a pause, then the turn. She never lectures and never guilts you. If anyone ends
			up looking silly, it is her.
		</p>
		<ul class="lines" role="list">
			{#each lines as l}
				<li>
					<img src="{IMG}/stickers/{l.img}.webp" alt="" width="192" height="192" loading="lazy" />
					<q>{l.text}</q>
				</li>
			{/each}
		</ul>
		<h3 class="sub">Her running jokes</h3>
		<dl class="gags">
			{#each gags as g}
				<div>
					<dt>{g.k}</dt>
					<dd>{g.v}</dd>
				</div>
			{/each}
		</dl>
	</div>
</Block>

<section class="column" aria-labelledby="faces-title">
	<h2 id="faces-title" class="display-section">all those faces.</h2>
	<p class="lede muted">
		Venus is a flat 2D drawing with over forty faces. Her ears do most of the acting.
	</p>
	<ul class="faces" role="list">
		{#each faces as f}
			<li>
				<img
					src="{IMG}/faces/{f.id}.webp"
					alt="Venus, {f.name.toLowerCase()}"
					width="164"
					height="164"
					loading="lazy"
				/>
				<span>{f.name}</span>
			</li>
		{/each}
	</ul>
</section>

<Block hue="lime" labelledby="cat-title">
	<div class="stack">
		<Tag tone="ink">Cat habits</Tag>
		<h2 id="cat-title" class="display-chapter">a real cat, mostly.</h2>
		<p class="lede">
			She only does what a real cat would do. If you have a cat, you will know every one of these.
		</p>
		<ul class="cards" role="list">
			{#each habits as h}
				<li>
					<img src="{IMG}/stickers/{h.img}.webp" alt="" width="192" height="192" loading="lazy" />
					<div>
						<h3>{h.k}</h3>
						<p>{h.v}</p>
					</div>
				</li>
			{/each}
		</ul>
		<h3 class="sub" id="food">What she eats</h3>
		<ul class="cards food" role="list" aria-labelledby="food">
			{#each food as f}
				<li class:star={f.star}>
					<img src="{IMG}/stickers/{f.img}.webp" alt="" width="192" height="192" loading="lazy" />
					<div>
						<h3>{f.k}</h3>
						<p>{f.v}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</Block>

<Block hue="sky" labelledby="speak-title">
	<div class="stack">
		<Tag tone="ink">Daily videos</Tag>
		<h2 id="speak-title" class="display-chapter">she speaks your language.</h2>
		<p class="lede">
			Venus speaks all eight of the app’s languages: {#each languages as l, i}{i ? ', ' : ''}<bdi
					>{l}</bdi
				>{/each}. Keep a streak, and she has a short new video for each of your first 100 days, in
			the language your app is set to.
		</p>
		<p class="lede">
			It plays on the day your streak counts, and the play button on your streak plays it again
			until the day ends. Start over after a break, and she has a comeback video for that too. For
			now the videos play in the web app, and they are coming to the iPhone and Android apps.
		</p>
		<p class="lede">Here are a few she has already recorded. Turn the sound on.</p>
		<ul class="clips" role="list">
			{#each clips as c}
				<li>
					<video
						src="{IMG}/clips/venus-{c.id}.mp4"
						poster="{IMG}/clips/venus-{c.id}.webp"
						width="432"
						height="768"
						controls
						playsinline
						preload="none"
						aria-label="Venus speaking {c.label}"
					>
						<!-- The caption is drawn into the picture too, so the track starts off. -->
						<track
							kind="captions"
							src="{IMG}/clips/venus-{c.id}.vtt"
							srclang={c.lang}
							label={c.label}
						/>
					</video>
					<span class="lang">{c.label}</span>
					<q lang={c.lang} dir={c.dir}>{c.line}</q>
					{#if c.en}
						<span class="gloss">{c.en}</span>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</Block>

<Block hue="tangerine" id="stickers" labelledby="stickers-title">
	<div class="stack">
		<Tag tone="ink">Free stickers</Tag>
		<h2 id="stickers-title" class="display-chapter">use venus everywhere.</h2>
		<p class="lede">
			Free Venus stickers: her faces, her cat habits, and hello and thanks in all eight languages.
		</p>
		<ul class="where" role="list">
			<li>
				<h3>In LangX</h3>
				<p>Free in the sticker picker of every chat.</p>
				<Button href="/download" variant="ink">Get the app</Button>
			</li>
			<li>
				<h3>Telegram</h3>
				<p>Add the Venus · LangX set in one tap.</p>
				<Button href={TELEGRAM} variant="ink">Add to Telegram</Button>
			</li>
			<li>
				<h3>Instagram, Facebook and Messenger</h3>
				<p>
					When you add a GIF or a sticker, search “langx venus”. On iPhone, the GIPHY app in
					iMessage finds her too.
				</p>
				<Button href={GIPHY} variant="ink">Find Venus on GIPHY</Button>
			</li>
			<li>
				<h3>Discord, Slack and more</h3>
				<p>Every sticker as a PNG, to add as a server sticker or a custom emoji.</p>
				<Button href={ZIP} variant="ink">Download the pack</Button>
			</li>
			<li class="soon">
				<h3>WhatsApp <span class="soon-tag">Coming soon</span></h3>
				<p>Add the whole pack to WhatsApp, straight from the LangX app.</p>
			</li>
		</ul>
		<ul class="pack" role="list">
			{#each venusStickers as st}
				<li>
					<img
						src="{IMG}/stickers/{st.file}.webp"
						alt="Venus sticker: {st.name}"
						width="192"
						height="192"
						loading="lazy"
					/>
				</li>
			{/each}
		</ul>
	</div>
</Block>

<style lang="scss">
	.hero {
		display: grid;
		gap: 24px;

		@media (min-width: 900px) {
			grid-template-columns: 1fr 400px;
			gap: 64px;
			align-items: center;
		}
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;

		> p {
			margin: 0;
			max-width: 540px;
			font-size: 1.1875rem;
			line-height: 1.47;
			font-weight: 500;
		}
	}

	.wave {
		display: block;
		width: min(100%, 320px);
		height: auto;
		margin-inline: auto;

		@media (min-width: 900px) {
			width: 100%;
		}
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: calc(var(--container-max) + 32px);
		margin-inline: auto;
		padding: 48px 16px;

		@media (min-width: 768px) {
			max-width: calc(var(--container-max) + 64px);
			padding: 88px 32px;
		}

		h2 {
			margin: 0;
		}
	}

	.stack {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
		padding-bottom: 40px;

		@media (min-width: 900px) {
			gap: 24px;
			padding-bottom: 0;
		}

		h2 {
			margin: 0;
		}
	}

	// Ink on a hue, like the rest of the block; the muted one is on the ground.
	.lede {
		margin: 0;
		color: inherit;
		max-width: 620px;
		font-size: 1.0625rem;
		line-height: 1.5;
		font-weight: 500;

		@media (min-width: 900px) {
			font-size: 1.1875rem;
			line-height: 1.47;
		}

		&.muted {
			color: var(--color--text-shade);
		}
	}

	.sub {
		margin: 16px 0 0;
		font-family: var(--font--title);
		font-weight: 900;
		font-size: 1.5rem;
	}

	// Cards on the page's own ground.
	.traits {
		display: grid;
		gap: 12px;
		margin: 0;

		@media (min-width: 700px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (min-width: 1000px) {
			grid-template-columns: repeat(3, 1fr);
		}

		div {
			padding: 22px;
			border-radius: var(--radius-xl);
			background: var(--color--muted);
		}

		dt {
			font-family: var(--font--title);
			font-weight: 900;
			font-size: 1.25rem;
		}

		dd {
			margin: 8px 0 0;
			color: var(--color--text-shade);
			line-height: 1.5;
		}
	}

	// Speech bubbles: white on the hue, ink text, in both schemes.
	.lines {
		display: grid;
		gap: 12px;
		width: 100%;
		margin: 8px 0 0;

		@media (min-width: 900px) {
			grid-template-columns: repeat(2, 1fr);
		}

		li {
			display: flex;
			align-items: center;
			gap: 12px;
		}

		img {
			flex: none;
			width: 72px;
			height: 72px;
		}

		q {
			padding: 14px 18px;
			border-radius: var(--radius-bubble);
			background: #fff;
			color: var(--color--ink);
			font-weight: 700;
			line-height: 1.4;
			quotes: none;
		}
	}

	.gags {
		display: grid;
		gap: 10px 32px;
		margin: 0;
		max-width: 900px;

		@media (min-width: 900px) {
			grid-template-columns: repeat(2, 1fr);
		}

		dt {
			display: inline;
			font-weight: 900;
		}

		dt::after {
			content: ': ';
		}

		dd {
			display: inline;
			margin: 0;
		}
	}

	.faces {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin: 0;

		@media (min-width: 700px) {
			grid-template-columns: repeat(4, 1fr);
		}
		@media (min-width: 1000px) {
			grid-template-columns: repeat(6, 1fr);
		}

		li {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		img {
			width: 100%;
			height: auto;
			border-radius: var(--radius-xl);
		}

		span {
			font-weight: 800;
			font-size: 0.9375rem;
		}
	}

	// Habit and food cards: the drawing beside a short line.
	.cards {
		display: grid;
		gap: 12px;
		width: 100%;
		margin: 0;

		@media (min-width: 700px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (min-width: 1000px) {
			grid-template-columns: repeat(3, 1fr);
		}

		&.food {
			@media (min-width: 1000px) {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		li {
			display: flex;
			align-items: center;
			gap: 14px;
			padding: 14px 18px 14px 10px;
			border-radius: var(--radius-xl);
			background: rgba(255, 255, 255, 0.5);
		}

		li.star {
			background: #fff;
			box-shadow: inset 0 0 0 3px var(--color--ink);
		}

		img {
			flex: none;
			width: 88px;
			height: 88px;
		}

		h3 {
			margin: 0;
			font-family: var(--font--title);
			font-weight: 900;
			font-size: 1.125rem;
		}

		p {
			margin: 4px 0 0;
			line-height: 1.45;
		}
	}

	.clips {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px 12px;
		width: 100%;
		margin: 8px 0 0;

		@media (min-width: 900px) {
			grid-template-columns: repeat(4, 1fr);
			gap: 20px;
		}

		li {
			display: flex;
			flex-direction: column;
			gap: 8px;
			min-width: 0;
		}

		video {
			display: block;
			width: 100%;
			height: auto;
			aspect-ratio: 9 / 16;
			border-radius: var(--radius-lg);
			background: var(--color--ink);
		}

		.lang {
			font-family: var(--font--title);
			font-weight: 900;
			font-size: 1.125rem;
		}

		q {
			font-weight: 700;
			line-height: 1.4;
			quotes: none;
		}

		.gloss {
			font-size: 0.9375rem;
			line-height: 1.4;
		}
	}

	.where {
		display: grid;
		gap: 12px;
		width: 100%;
		margin: 0;

		@media (min-width: 700px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (min-width: 1000px) {
			grid-template-columns: repeat(3, 1fr);
		}

		li {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
			padding: 22px;
			border-radius: var(--radius-xl);
			background: rgba(255, 255, 255, 0.5);
		}

		h3 {
			margin: 0;
			font-family: var(--font--title);
			font-weight: 900;
			font-size: 1.25rem;
		}

		p {
			margin: 0 0 4px;
			line-height: 1.45;
		}

		// Not live yet: no button, and an ink edge instead of the fill.
		.soon {
			background: none;
			box-shadow: inset 0 0 0 2px var(--color--ink);
		}
	}

	.soon-tag {
		display: inline-block;
		margin-left: 6px;
		padding: 3px 10px;
		border-radius: var(--radius-pill);
		background: var(--color--ink);
		color: var(--block);
		font-size: 0.8125rem;
		vertical-align: 3px;
	}

	.pack {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 4px;
		width: 100%;
		margin: 8px 0 0;

		@media (min-width: 700px) {
			grid-template-columns: repeat(10, 1fr);
		}

		img {
			display: block;
			width: 100%;
			height: auto;
		}
	}
</style>
