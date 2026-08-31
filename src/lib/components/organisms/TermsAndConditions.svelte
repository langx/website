<section id="policy">

	*Effective Date: 31, Aug 2026*

	1. Acceptance of Terms

		By accessing or using the LangX app ("the App"), you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.

	2. User Eligibility

		You must be at least 18 years old to create an account and use the LangX app. By using the App, you represent and warrant that you are at least 18 years old. Your date of birth is collected when you create a profile and the age requirement is enforced at that point. Only your age is shown to other people.

	3. Account Registration and Security

		You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use or security breach of your account.

	4. User Conduct

		You agree not to engage in any of the following activities while using the App:

		- Violating any applicable laws or regulations
		- Impersonating any person or entity or falsely stating or misrepresenting your affiliation with a person or entity
		- Posting or transmitting any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable
		- Engaging in any activity that interferes with or disrupts the App or the servers and networks connected to the App

		You can block any other user and report them to us from inside the App. We review reports and may remove content, suspend token earning, or suspend or terminate an account under section 8.

	5. Free Plan, Fluent and Polyglot

		LangX is free to use. On the free plan you may reply to every message you receive without limit, and write corrections without limit. The free plan limits three things:

		- Starting new conversations: 5 per rolling 24 hours
		- Machine translations: 20 per rolling 24 hours
		- Photos and voice messages sent: 50 per rolling 24 hours

		These are counted over a **rolling 24 hours** from each individual use, not per calendar day and not reset at midnight.

		Fluent is a paid subscription that lifts the first and third limits, raises the machine-translation allowance to 300 per rolling 24 hours, lets you learn two languages at once, and adds discovery filters. Polyglot includes everything in Fluent, raises translations to 1,000 per rolling 24 hours and learning languages to five, and adds the identity of people who viewed your profile, incognito browsing, and the Nearby sort, which orders people by approximate distance; Nearby only works if you switch location sharing on, it shows other users a rounded distance rather than a position, and our [privacy policy](/privacy-policy) describes exactly what is stored. Both plans are offered monthly and yearly, with a trial period, at prices that vary by region and are shown to you before you purchase.

		Subscriptions are billed through Apple's App Store, Google Play, or our web payment provider, depending on where you subscribe. They renew automatically at the end of each period unless cancelled at least 24 hours before it ends. You cancel and request refunds through the same store you purchased from, under that store's terms; we cannot cancel or refund a store subscription on your behalf.

		The limits and the contents of each plan may change. If a change removes something you are already paying for, it takes effect for you at your next renewal rather than immediately.

	6. LangX Token

		LangX Token is an in-app point with **no cash value**. You earn it by using the App and you spend it inside the App. It is not a currency, a security, or a crypto-asset.

		- It cannot be purchased, with money or anything else.
		- It cannot be sold, traded, staked or exchanged.
		- It cannot be transferred to another user.
		- It cannot be withdrawn or redeemed for money or any other thing of value.
		- It is not recorded on a blockchain.
		- It cannot be used to obtain Fluent, Polyglot or any part of either.

		Token balances held in version 1 of LangX are credited to your version 2 account divided by 100, rounded down. A balance below 100 therefore converts to nothing. Any earlier description of LangX Token as a tradable or on-chain asset, including the litepaper, does not describe the product and is not being built.

		We may adjust how tokens are earned, capped and priced. Tokens have no cash value, so no adjustment gives rise to a claim for compensation.

	7. Virtual Items

		Tokens may be spent on virtual items: a streak freeze, and cosmetic profile frames and titles. Virtual items are licensed to you for use within the App, are not transferable, have no cash value, and are not refundable. Unspent tokens and any virtual items you hold are forfeited when your account is deleted.

	8. Account Deletion and Termination

		You may delete your account from within the App at any time. On deletion your account becomes invisible immediately and every session is ended; the data is permanently removed 30 days later. Signing back in within those 30 days cancels the deletion.

		Messages you sent are not removed from the other person's copy of the conversation. Their content is removed and they are marked as belonging to a deleted account, because deleting them outright would rewrite a conversation someone else is also a party to. The token ledger is kept as an anonymised audit record. Both exceptions are described in the [privacy policy](/privacy-policy).

		Your email address is kept after the rest of your account is removed, on its own — no name, no profile, nothing that links it back to the account that has gone — so that we can write to you about LangX in the future. We only send promotional email to an address whose owner opted in to it, and you can have your address removed at any time by writing to [hi@langx.io](mailto:hi@langx.io). This is described in the [privacy policy](/privacy-policy) as well.

		Deleting your account does not cancel a subscription bought through a store. Cancel it with Apple, Google or our web payment provider, whichever you bought it from, or it continues to renew.

		LangX reserves the right to terminate or suspend your account and access to the App for any reason, including but not limited to a violation of these Terms and Conditions.

	9. Intellectual Property

		The LangX application and API are released as open source under the BSD 3-Clause licence, and your rights to that source code are governed by that licence rather than by these terms. The LangX name, logo and brand assets are not covered by it and remain the property of New Chapter Technology Limited Liability Company.

		Content you post remains yours. You grant us the licence necessary to store it and to show it to the people you send it to.

	10. Limitation of Liability

		To the extent permitted by applicable law, LangX and its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.

	11. Changes to Terms and Conditions

		LangX may update these Terms and Conditions from time to time. You are advised to review these terms periodically for any changes.

	12. Governing Law

		These Terms and Conditions are governed by and construed in accordance with the laws of The United States of America.

	13. Contact Information

		For any questions or concerns related to these Terms and Conditions, please contact us at [hi@langx.io].

</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#policy {
		position: relative;
		display: grid;
		align-items: start; /* Align to the start for better readability */
		justify-content: space-between;
		padding: 50px; /* Add padding around the text */
		line-height: 1.5; /* Increase line height for better readability */
		max-width: 800px; /* Limit the width of the text */
		margin: 0 auto; /* Center the text block */

		@include for-phone-only {
			grid-template-columns: 1fr;
			justify-items: center;
			gap: 20px;
      padding: 0;

			ol {
				margin: 0;
				border-left: 15px solid transparent;
			}
		}
	}
</style>
