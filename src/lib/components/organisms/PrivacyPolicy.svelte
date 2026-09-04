<section id="policy">

	*Effective Date: 3, Sep 2026*

	1. Introduction

		Welcome to LangX, a language learning platform designed to connect language learners worldwide. This Privacy Policy is designed to inform you about the types of information we collect, why we collect it, and how we use and protect that information. LangX is a product of New Chapter Technology Limited Liability Company.

		This policy is written from what the application actually stores, rather than from a template. Where a section says we do not collect something, that means no part of the app writes it.

		LangX version 2 runs on entirely new infrastructure, built and operated by us rather than rented from the backend platform version 1 used. This policy replaces the previous one in full: the system it described no longer exists.

	2. Information We Collect

		2.1 Information you give us

		- **Email address** — for sign-in, verification and password reset. Required.
		- **Display name and username** — shown on your profile. Required.
		- **Date of birth** — used for the 16+ requirement, and so that we can wish you a happy birthday. Only your age is ever shown to anyone else; the date itself is visible to nobody but you.
		- **Languages and levels** — the entire matching mechanism depends on these. Required.
		- **Gender** — shown on your profile and used by the Pro gender filter. "Undisclosed" is a valid answer.
		- **City** — shown on your profile. Optional.
		- **Photos** — your avatar and gallery. Optional.
		- **Interests** — shown on your profile, and shared interests nudge someone higher in your suggestions. Optional.
		- **A short text about you** — optional.

		If you sign in with Google or Apple rather than with a LangX password, we receive your email address and your name from them and nothing else — never your password for that account, and nothing about how you use theirs.

		2.2 Information created by using the app

		- **Messages** — text, photos and voice messages, stored so we can deliver your conversations.
		- **Text you ask us to translate** — sent to our translation provider, and the result kept for 30 days under a one-way hash of the original text so the same phrase is not paid for twice. That cache records the translation, not who asked for it.
		- **Timezone** — so that your streak day and any reminders follow your local day rather than ours. Optional; we fall back to UTC.
		- **Approximate time of your last activity** — for the "online now" indicator.
		- **Daily activity counts** — how many messages and corrections you wrote on a given day and how many different people you spoke to. Tokens, streaks and the daily pool are calculated from these.
		- **Your token ledger** — every token you have earned or spent, and what for.
		- **Push notification token** — only if you grant notification permission.
		- **Profile views** — who viewed your profile. Not recorded at all when the viewer is browsing incognito, and deleted automatically after 90 days.
		- **Blocks and reports** — only if you block or report someone.
		- **Purchase state** — whether you have an active Fluent or Polyglot subscription, which store it came from, and when it renews or expires. Only if you subscribe.
		- **Approximate location** — only if you switch it on. Section 3 describes it in full, because it is new in version 2 and it is the part worth reading carefully.

		2.3 Technical information

		Our servers necessarily see your IP address in order to answer a request, apply rate limits and refuse abuse. We do not build a profile from it and it is not stored as part of your account.

		One thing is derived from it: **your country**, as a two-letter code, when you create your profile. It is shown on your profile and used by the Pro country filter, which is only worth having if the country is not something anyone can simply type. The address itself is not kept — only the country it resolved to. If it is wrong, granting location permission in the app replaces it with the country your device reports; nothing else can change it.

	3. Approximate Location, and Only If You Ask For It

		Polyglot includes a "Nearby" sort that orders people by roughly how far away they are. It is the only feature that uses location anywhere in LangX, and this is exactly what it does.

		- **It is off until you turn it on.** Nothing writes your location at sign-up, during onboarding, or in the background. The only two places that ask for it are the switch in Settings and the Nearby tab itself, and both run your device's own permission prompt first.
		- **When-in-use only.** The app declares no background location permission on either platform, so it cannot read your position while you are not using it.
		- **We ask your device for its least accurate answer**, and then round what comes back to two decimal places — a grid of roughly one kilometre — before storing it. The precise reading is discarded at that point and is never written to any record, log or backup. There is no precise version of your position for us to lose, export or be compelled to hand over, because we never made one.
		- **Nobody is ever shown a position.** Your coordinates are not part of your public profile and are not sent to other users in any form. The only thing anyone else sees is a distance rounded **up** to a fixed band — "under 5 km away" — rather than a measured number. The bands exist so that repeated readings of a moving account cannot be combined back into a point.
		- **Turning it off deletes it.** The switch in Settings removes the stored point outright rather than hiding it, and that also removes you from everyone else's Nearby results straight away. There is no retention period to state, because nothing is retained.

	4. What We Do Not Collect

		Stating this precisely is what makes the rest of the policy credible.

		- **No precise location.** See section 3: the app asks for the coarsest reading your device will give and rounds it before storing it. A street-level position is never collected.
		- **No analytics, and no analytics SDK.** LangX version 1 ran a self-hosted analytics service; version 2 ships none. There is no product-analytics or session-recording SDK in the app or on this website, and no page-view counter on langx.io.
		- **No advertising identifiers.** No IDFA, no Android advertising ID, no ad network, and nothing is sold or passed to a data broker.
		- **No tracking across other apps or websites.**
		- **No contacts, no calendar, no photos beyond the ones you choose to upload, no microphone access outside recording a voice message you send, no health data.**
		- **No financial data.** Payment happens entirely inside Apple's, Google's or our payment provider's flow. Our servers only ever receive whether a subscription is active — never a card number.

	5. How We Use Your Information

		- To create and manage your LangX account
		- To match you with people whose languages fit yours in both directions
		- To deliver your conversations, corrections and translations
		- To calculate your streak, tokens and leaderboard position
		- To keep the service safe: handling reports, blocks and abuse
		- To notify you about activity, if you have granted permission
		- To restore your account if you used LangX version 1 — see section 7

	6. Sharing With Third Parties

		We share the minimum each service needs to do its job. None of them receive your data for their own advertising or profiling, and we do not sell data or share it with data brokers.

		- **Resend**, our email provider — your email address and the contents of the mail, to send verification and password-reset messages.
		- **Google Cloud Translation** — the text you asked to translate, and nothing identifying you.
		- **RevenueCat** — your LangX user id and your purchase events, so we know whether your subscription is active. Payment itself is taken by Apple, Google or Stripe, and none of them send us your card details.
		- **Expo's push service**, and through it Apple's and Google's push infrastructure — your push token and the text of the notification. A new-message notification includes the beginning of the message, because that is what makes it useful; if you would rather it did not, turn notifications off.
		- **Cloudflare R2 or Backblaze B2**, our object storage — your photos and voice messages, to host them.
		- **Sentry**, our error reporting service — the details of a server error, with your user id attached so we can tell whether a fault affected one account or everybody. It is configured never to send request bodies, cookies or authentication headers, so message contents and session tokens do not reach it.
		- **Google and Apple**, if you choose to sign in with them — they tell us your email address and name; we tell them nothing about what you do in LangX.

		Our servers run on **Fly.io** in Frankfurt, our database is **MongoDB Atlas**, and langx.io is served through **Cloudflare**. These providers host and deliver the service and do not use your data for any purpose of their own.

		We may also disclose information where we are legally required to do so.

	7. If You Used LangX Version 1

		Version 1's database was migrated so that returning users could pick up where they left off, and this is what was carried over: your username, profile details, photos, token balance, streak, and your conversations.

		Your old password could not be migrated and was not: you create a new sign-in, and your old profile is only released to you once you have proved you control the email address it belonged to. We match on a salted one-way hash of that address rather than on the address itself.

		An old conversation is only restored once **both** people in it have come back. Until then it stays untouched and neither side can read it, because a conversation belongs to two people and one of them returning is not consent from the other.

		If you never return, that staged copy is deleted along with the rest of the version 1 data.

	8. Security

		Passwords are hashed and the server never stores them in plain text. All traffic is encrypted in transit. Every conversation and every profile listing is authorised on the server against your session, including over the realtime connection, so the realtime transport cannot be used to reach data the regular API would refuse.

		No method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.

	9. Cookies and Similar Technologies

		The website and app store a small amount of data on your device to keep you signed in and to remember preferences such as your theme. See our [cookie policy](/cookie-policy) for details.

	10. Your Choices

		10.1 Access and export

		You can download everything we hold about you from the app's settings, as a single file.

		10.2 Correction

		You can edit your profile information at any time from within the app.

		10.3 Deletion

		You can delete your account from within the app. See section 11.

		10.4 Location

		You can withdraw your location at any time from the switch in Settings, which deletes the stored point. You do not have to delete or export your account to do it.

		10.5 Notifications and email

		Notifications are switched per kind and per channel in Settings → Notifications: messages, streak reminders, badges, profile visits and marketing, each with a separate switch for your phone and for email. You can also turn off push entirely from your device settings.

		Every notification email carries an unsubscribe link in its footer. It works without signing in and does not expire, and it turns off email only — the notifications on your phone are unaffected, because turning off email says nothing about them. Marketing email is off unless you switch it on.

		Notification email is limited to counts and display names: how many messages are waiting, and who wrote or looked. It never contains the text of a message.

		If you have already deleted your account, write to [hi@langx.io](mailto:hi@langx.io) and we will remove your address from the list described in section 11.

	11. Data Retention and Deletion

		We retain your information for as long as your account exists, and as required by applicable laws.

		When you delete your account it becomes invisible immediately and every session is ended. The data is permanently removed 30 days later; signing back in within those 30 days cancels the deletion. Your photos and voice messages are removed from storage as well as from the database, so nothing stays reachable by URL.

		Three exceptions are worth stating plainly:

		- **The token ledger survives as an audit record**, with your identity replaced by a random value that is stored nowhere else. The totals still reconcile and the rows no longer identify anyone. Your leaderboard entries are deleted outright.
		- **Messages you sent are not deleted from the other person's conversation.** Their content is removed and they are marked as belonging to a deleted account. Deleting them outright would rewrite a conversation someone else is also a party to.
		- **Your email address is kept**, and it is the only thing that is. When your account is removed we move the address onto a list that holds nothing else: no name, no profile, no identifier that links it back to the account, which is deleted in full. We keep it so that we can tell you about LangX in the future, and we only send promotional email to an address whose owner turned promotional email on while their account existed. Write to [hi@langx.io](mailto:hi@langx.io) at any time — before or after deleting your account — and we will remove your address from that list too.

		Records of who viewed a profile are deleted automatically after 90 days, whether or not you delete your account.

	12. Age

		LangX is a 16+ service. You must be at least 16 to create an account, and this is enforced when your profile is created. The app is not directed to children, we do not knowingly collect information from anyone under 16, and we do not operate it under any "designed for families" programme. If we learn that an account belongs to someone under 16, we remove it.

	13. Changes to This Privacy Policy

		We may update our Privacy Policy to reflect changes in our data practices. We will notify you of any material changes through the app or via email.

	14. Official Contact Information

		LangX is a product of New Chapter Technology Limited Liability Company, a legal entity registered under the laws with a registered address at:

		- 34 N Franklin Ave Ste 687 2534 Pinedale, WY 82941

		The registered agent for New Chapter Technology Limited Liability Company is Registered Agents Inc, with a registered office located at:

		- 30 N Gould St Ste R Sheridan, WY 82801

		Registered Agents Inc has voluntarily consented to serve as the registered agent for New Chapter Technology Limited Liability Company and has certified they are in compliance with the requirements of W.S. 17-28-101 through W.S. 17-28-111.

		For questions or concerns related to privacy or data protection, you can contact us at [hi@langx.io].

</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#policy {
		position: relative;
		display: grid;
		align-items: start; /* Align to the start for better readability */
		justify-content: space-between;
		padding: 0 0 var(--space-2xl);
		line-height: 1.5; /* Increase line height for better readability */
		max-width: 72ch;
		margin: 0;

		@include for-phone-only {
			grid-template-columns: 1fr;
			justify-items: start;
			gap: 20px;
      padding: 0;

      ol {
        margin: 0;
        border-left: 15px solid transparent;
      }
		}
	}
</style>
