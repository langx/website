<script lang="ts">
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';

	interface FaqObject {
		id: number;
		title: string;
		content: string;
		isOpen: boolean;
	}

	const faqObjects: FaqObject[] = [
		{
			id: 1,
			title: 'What platforms do we support?',
			content: `LangX is available for free on <a href="https://apps.apple.com/us/app/langx-practice-learn-succeed/id6474187141" target="_blank" style="text-decoration-color: #ff723f;"><span style="color: #ff723f; font-weight: bold;">ios</span></a>, <a href="https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange" target="_blank" style="text-decoration-color: #ff723f;"><span style="color: #ff723f; font-weight: bold;">android</span></a> and on the <a href="https://app.langx.io" target="_blank" style="text-decoration-color: #ff723f;"><span style="color: #ff723f; font-weight: bold;">web app</span></a>.`,
			isOpen: false
		},
		{
			id: 2,
			title: 'Are our services free?',
			content: `Yes, our app is <span style="color: #ff723f; font-weight: bold;">free</span> and <span style="color: #ff723f; font-weight: bold;">100% open source</span>.`,
			isOpen: false
		},
		{
			id: 3,
			title: 'How will this project monetarily support itself?',
			content: `While our app is free and 100% open-source, we plan to introduce a subscription model for our Language Copilot feature. This feature, powered by OpenAI, provides real-time feedback during conversations, enhancing the language learning process. All other features will remain free. We also accept open sponsorships on <a href="https://github.com/sponsors/langx" target="_blank" style="color: #ff723f; font-weight: bold;">GitHub Sponsorship</a>.
			<br><br>
			As for monetization upon achieving significant growth, scalability becomes crucial, right? Take, for instance, the our <span style="color: #ff723f; font-weight: bold;">Language Copilot</span> feature I mentioned. It utilizes GPT, which requires an API and incurs costs on a per-word or per-token basis, as you're likely aware. Without implementing a subscription model, the expenses could quickly deplete my resources.
			<br><br>
			Therefore, in our roadmap, post-beta stage, we intend to introduce a subscription fee exclusively for accessing this feature. All other features will remain freely available for lifetime use. Unlike Tandem, which sells features lacking added value such as "Who viewed my profile?", our 🤖 <span style="color: #ff723f; font-weight: bold;">Language Copilot</span> provides direct feedback within conversations, enhancing the language learning process by enabling users to improve in real-time during authentic conversations with other users.`,
			isOpen: false
		},
		{
			id: 4,
			title: 'What does the app have to offer?',
			content: `
			<ul>
				<li>Capture and share language learning moments with voice messages.</li>
				<li>Customize connection preferences for ideal language exchange partners.</li>
				<li>Gain insights into learning progress and habits on your profile.</li>
				<li>Enjoy user-friendly chat interface for effortless language learning.</li>
				<li>Maintain control over data and privacy settings.</li>
				<li>Rate and receive ratings for quality interactions.</li>
				<li>Activate night mode for comfortable low-light reading.</li>
				<li>Earn badges for achievements.</li>
				<li>Access comprehensive language learning features at no cost.</li>
				<li>Contribute to our open-source developer community.</li>
				<li>Learn to Earn model: LangX Token</li>
				<li>Accelerate learning with AI-powered personalized feedback, coming soon!</li>
			</ul>
			`,
			isOpen: false
		},
		{
			id: 5,
			title: 'How is LangX different and stand out?',
			content: `LangX sets itself apart by offering a comprehensive and community-driven platform that prioritizes language practice and user privacy. As a 100% open-source alternative to similar apps, we're committed to providing a seamless language learning experience while empowering users to take control of their data and privacy settings.`,
			isOpen: false
		},
		{
			id: 6,
			title: 'What is LangX Copilot 🤖?',
			content: `Harness the power of AI to accelerate your language learning journey. Get personalized feedback privately. It is going to be your private language copilot. There will be a toggle button in the top right corner of any chat room. When you open it, it feedbacks you privately when you are practicing with a real person in a room. Only you can see these feedback messages within the room. These messages are going to be different colored. I'm so excited about this feature because it speeds up your active language learning process. Stay tuned for more!`,
			isOpen: false
		},
		{
			id: 7,
			title: 'What is LangX Token 💰?',
			content: `The innovative 'Learn to Earn' Token Project, for more info please visit: <a href="https://token.langx.io/" target="_blank" style="text-decoration-color: #ff723f;"><span style="color: #ff723f; font-weight: bold;">token.langx.io</span></a>.`,
			isOpen: false
		},
		{
			id: 8,
			title: 'How can I contribute?',
			content: `We implore anyone to contribute, whether it’s just a single image, down to a single line of code/text. You can read more <a href="https://github.com/langx/website?tab=readme-ov-file#contributing" target="_blank" style="text-decoration-color: #ff723f;"><span style="color: #ff723f; font-weight: bold;">here</span></a> on how you can add your contribution.`,
			isOpen: false
		},
		{
			id: 9,
			title: 'How is it going to be moderated?',
			content: `We actually have an excellent team of contributors who are dedicated to making valuable contributions wherever possible. With that said, if you are interested in taking on the role of our first moderator as a contributor/volunteer, please reach out for details. We can also begin delving into this matter together.`,
			isOpen: false
		},
		{
			id: 10,
			title: 'Could you add sign languages?',
			content: `We'll definitely add sign languages to the study languages section during the registration process. Additionally, we have a contributor who works as an accessibility manager and can help with the following issues. Thank you for bringing this matter to our attention again :) 
			<br><br>
			For the sign language issue: <a href="https://github.com/langx/langx/issues/444" target="_blank" style="text-decoration-color: #ff723f;"><span style="color: #ff723f; font-weight: bold;">Link</span></a>.
			<br><br>
			Regarding developing standards like WCAG with the W3C: <a href="https://github.com/langx/langx/issues/436" target="_blank" style="text-decoration-color: #ff723f;"><span style="color: #ff723f; font-weight: bold;">Link</span></a>.`,
			isOpen: false
		},
		{
			id: 11,
			title: 'Is there more to come?',
			content: `This project has been a labor of love, and we're continuously updating and improving LangX to better serve our users' needs daily. We have exciting features in the pipeline, including AI-driven language learning support, and we're thrilled to share them with you in the near future.`,
			isOpen: false
		}
	];
</script>

<section id="faq">
	<div class="faq-container">
		<h2><SparklingHighlight color="secondary">Frequently Asked Questions</SparklingHighlight></h2>
		<div class="accordion">
			{#each faqObjects as item (item.id)}
				<div class="accordion-item">
					<button
						on:click={() => {
							item.isOpen = !item.isOpen;
						}}
						id="accordion-button-5"
						aria-expanded={item?.isOpen}
						><span class="accordion-title">{item?.title}</span><span
							class="icon"
							aria-hidden="true"
						/></button
					>
					<div class="accordion-content">
						<p>{@html item?.content}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#faq {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 15px;
		position: relative;
		padding: 80px 0;

		@include for-phone-only {
			padding: 40px 0 50px;
		}

		.hello {
			text-align: center;
		}
	}

	$yellow: var(--color--primary);

	.faq-container {
		width: 100%;

		h2 {
			color: #ff723f;
		}

		.accordion {
			.accordion-item {
				border-bottom: 1px solid #32343e;

				button[aria-expanded='true'] {
					border-bottom: 1px solid $yellow;
				}
			}

			button {
				position: relative;
				display: block;
				text-align: left;
				width: 100%;
				padding: 1em 0;
				color: unset;
				font-size: 1.2rem;
				font-weight: 400;
				border: none;
				background: none;
				outline: none;

				@include for-phone-only {
					font-size: 1rem;
				}

				&:hover,
				&:focus {
					cursor: pointer;
					color: $yellow;

					&::after {
						cursor: pointer;
						color: $yellow;
						border: 1px solid $yellow;
					}
				}

				.accordion-title {
					padding: 1em 1.5em 1em 0;
				}

				.icon {
					display: inline-block;
					position: absolute;
					top: 18px;
					right: 0;
					width: 22px;
					height: 22px;
					border: 1px solid;
					border-radius: 22px;

					&::before {
						display: block;
						position: absolute;
						content: '';
						top: 9px;
						left: 5px;
						width: 10px;
						height: 2px;
						background: currentColor;
					}

					&::after {
						display: block;
						position: absolute;
						content: '';
						top: 5px;
						left: 9px;
						width: 2px;
						height: 10px;
						background: currentColor;
					}
				}
			}

			button[aria-expanded='true'] {
				color: $yellow;

				.icon {
					&::after {
						width: 0;
					}
				}

				+ .accordion-content {
					opacity: 1;
					max-height: fit-content;
					transition: all 200ms linear;
					will-change: opacity, max-height;
				}
			}

			.accordion-content {
				opacity: 0;
				max-height: 0;
				overflow: hidden;
				transition: opacity 200ms linear, max-height 200ms linear;
				will-change: opacity, max-height;

				p {
					font-size: 0.9rem;
					font-weight: 300;
					margin: 2em 0;
				}
			}
		}
	}
</style>
