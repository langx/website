/**
 * The homepage FAQ. Kept apart from the component so the page can describe
 * the same questions to search engines as FAQPage structured data.
 */
export interface FaqObject {
	id: number;
	title: string;
	content: string;
}

// Answers are static strings written here, not user input.
export const faqObjects: FaqObject[] = [
	{
		id: 1,
		title: 'Is LangX free?',
		content: `Yes. Replying to messages and correcting people are unlimited for everyone. On the free plan you can start 5 new chats and use 20 translations a day. <a href="/pro">Fluent and Polyglot</a> remove those limits and add a few extras.`
	},
	{
		id: 2,
		title: 'Where can I use it?',
		content: `On <a href="https://apps.apple.com/app/languagexchange/id6474187141" target="_blank" rel="noopener noreferrer">iPhone</a>, <a href="https://play.google.com/store/apps/details?id=tech.newchapter.languageXchange" target="_blank" rel="noopener noreferrer">Android</a> and in your <a href="https://app.langx.io" target="_blank" rel="noopener noreferrer">browser</a>. It's the same app everywhere.`
	},
	{
		id: 3,
		title: 'How does matching work?',
		content: `You only see people who speak the language you're learning and are learning the language you speak. That way every conversation is useful for both of you, not a favour one person does for the other.`
	},
	{
		id: 9,
		title: 'Is LangX a social alternative to Duolingo?',
		content: `Yes — think of it as Duolingo made of real people. Duolingo teaches with lessons and games, but there is no one on it to have a conversation with. On LangX the practice is a conversation with a native speaker who is learning your language, and they can correct you as you go. Plenty of people use both. See <a href="/social-alternative-to-duolingo">the social alternative to Duolingo</a> and the full <a href="/open-source-alternative-to-duolingo">LangX vs Duolingo</a> comparison.`
	},
	{
		id: 10,
		title: 'How does LangX compare with Tandem and HelloTalk?',
		content: `All three connect you with native speakers. LangX matches in both directions, keeps corrections unlimited on every plan, shows no ads and is open source; Tandem and HelloTalk have far bigger communities and live calls. <a href="/compare">Every comparison, side by side</a>.`
	},
	{
		id: 4,
		title: 'What is LangX Token?',
		content: `Points you earn by chatting and by correcting other people. You spend them inside the app on a streak freeze or on frames and titles for your profile. They aren't money: you can't buy, sell or trade them, and they never unlock a paid plan. <a href="/tokens">Every rule is on the tokens page</a>, and the longer write-up is at <a href="https://token.langx.io" target="_blank" rel="noopener noreferrer">token.langx.io</a>.`
	},
	{
		id: 5,
		title: 'What is LangX Copilot?',
		content: `Private AI feedback on your own messages while you chat with a real person. Only you see it. It isn't in the app yet; it's coming later, for <a href="/pro">Polyglot</a>.`
	},
	{
		id: 6,
		title: 'I used LangX before. What happens to my account?',
		content: `Sign up again with the same email. Your username is saved for you and your tokens carry over. Everything that changed is on the <a href="/welcome-back">welcome back</a> page.`
	},
	{
		id: 7,
		title: 'Is it safe?',
		content: `Yes. The whole app is open source on <a href="https://github.com/langx/langx" target="_blank" rel="noopener noreferrer">GitHub</a>, so anyone can see exactly how it works and what it stores. You can report or block anyone from inside the app, reports are reviewed by our moderation team — reachable at <a href="mailto:hi@langx.io">hi@langx.io</a> — and you need to be 16 or older to join.`
	},
	{
		id: 8,
		title: 'How can I help?',
		content: `Use the app and tell people about it. If you like code or writing, the <a href="https://github.com/langx/langx/contribute" target="_blank" rel="noopener noreferrer">good first issues</a> on GitHub are a nice place to start, and the <a href="https://discord.langx.io" target="_blank" rel="noopener noreferrer">Discord</a> is where everyone talks.`
	}
];
