<section id="policy">

	*Effective Date: 27, Aug 2026*

	1. Introduction

		This Cookie Policy explains how LangX, a product of New Chapter Technology Limited Liability Company, uses cookies and similar technologies on the LangX website and app ("the App").

	2. What are Cookies?

		Cookies are small text files that are stored on your device when you access and use our App. Related technologies work the same way and are covered by this policy: your browser's local storage on langx.io and in the web app, and the operating system's secure storage on iOS and Android, which is where the mobile app keeps your session instead of a cookie.

	3. What We Actually Store

		3.1 Essential

		Keeping you signed in. On the web this is a session cookie; in the mobile app the same session is held in the device's secure storage. Without it you would have to log in again on every page or every launch.

		3.2 Preferences

		Your theme choice — light, dark or automatic — and whether you have dismissed a site announcement. These stay on your device and are never sent to us.

		3.3 Analytics

		**None on this site.** LangX version 1 ran a self-hosted analytics service on langx.io; it was retired and version 2 replaced it with nothing. This site sets no analytics cookie and counts no page views.

		The **app** is a different answer, and this section used to give the wrong one. It sends usage analytics to PostHog — screen names, a short list of events and your LangX user id, with no session recording and nothing that carries the content of a message. That is described in full in section 2.4 of the [privacy policy](/privacy-policy), and it is turned off in Settings → Privacy → Share usage data. It arrived without this page being updated first, which is not how it was supposed to go; the promise to say so beforehand stands for anything that comes next.

		3.4 Third-party cookies

		**We do not use any.** There is no Google Analytics, no advertising network, and no social media tracking pixel on this site. Fonts and scripts are served from langx.io itself rather than from a third-party CDN.

		One thing is worth naming rather than hiding behind that sentence: the star count in our header is read from GitHub's public API by your browser, so GitHub sees the request the way it sees any visit to a page. It sets no cookie and we send it nothing about you.

	4. Your Consent

		The only things stored on your device are the ones described above: what is needed to keep you signed in, and preferences you set yourself. Nothing here tracks you, which is why this site has no cookie banner — there is nothing to ask you to consent to. You can clear what is stored at any time through your browser settings, though clearing the essential ones will sign you out.

	5. How to Manage Cookies

		Most web browsers provide options to manage cookies. You can typically set your browser to accept or reject specific types of cookies or to notify you when a cookie is placed. Visit your browser's help menu for more information on how to manage cookies.

	6. GDPR

		We follow the General Data Protection Regulation for everyone, not only for users in the EU. Under it you can request access to your data, correct it, or have it deleted — the first and the last are available directly in the app's settings rather than by writing to us. What we store, share and delete is described in our [privacy policy](/privacy-policy).

	7. Changes to This Cookie Policy

		We may update this Cookie Policy to reflect changes in our use of cookies. Any changes will be effective immediately upon posting the updated policy on the App.

	8. Contact Information

		For any questions or concerns related to this Cookie Policy, please contact us at [hi@langx.io].

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
