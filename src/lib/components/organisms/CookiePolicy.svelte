<section id="policy">

	*Effective Date: 8, Sep 2026*

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

		**This site has analytics, and none of it is stored on your device.** That is a change: until September 2026 this section said there were none at all. There are two, and both are described below.

		langx.io and token.langx.io send page views and a short list of events to **PostHog**, on its European cloud, in what PostHog calls cookieless mode. No cookie, no local storage, no session storage — nothing is written to your browser. A visitor is counted with a hash PostHog computes on its own side from a salt that is thrown away daily, so there is no identifier here that outlives a day. What is sent is the address of the page you are on, whether you clicked a link that leaves for the app, and whether a newsletter sign-up went through. There is no session recording, and clicks are not swept up wholesale — only the one just named.

		The cost of that choice is worth stating rather than leaving you to work out: it cannot tell a returning reader from a new one, so it measures what gets read and never who reads it.

		There is a second one, thinner, and it predates the first. Both sites are served through Cloudflare, and Cloudflare Pages measures the traffic it delivers: the page, the link that referred you, your country, and which browser, operating system and device type asked. It is switched on in Cloudflare's dashboard rather than by anything in our code, which is how it went unnamed here for longer than it should have. It writes nothing to your browser either — we opened the site and checked rather than taking the word for it — so section 4 is unchanged by it.

		The **app** is a separate answer with a separate switch. It sends screen names, a short list of events and your LangX user id, described in full in section 2.4 of the [privacy policy](/privacy-policy) and turned off in Settings → Privacy → Share usage data. When that arrived, this page was not updated first, and we said the promise to say so beforehand would stand for anything that came next. This was that next thing.

		3.4 Third-party cookies

		**We do not use any.** There is no Google Analytics, no advertising network, and no social media tracking pixel on this site, and neither of the two analytics in section 3.3 sets a cookie of any kind. PostHog's script is served from langx.io itself rather than from its CDN, the way our fonts are; Cloudflare's is the exception, and it is named below.

		Three things are worth naming rather than hiding behind that sentence. The star count in our header is read from GitHub's public API by your browser, so GitHub sees the request the way it sees any visit to a page. Your browser does not connect to PostHog at all: the page views are sent to langx.io itself, and Cloudflare passes them on to PostHog's European endpoint from its own network. That is a route, not a destination — PostHog receives the same page views it did before, and we pass on the address your request came from, because without it PostHog would count everyone behind one Cloudflare data centre as a single visitor. What it buys is that a request to langx.io cannot be blocked by an ad blocker without blocking the site, so the count is of everybody rather than of whoever is not running one. And Cloudflare, which serves this site, adds a small measurement script of its own from its own domain — the one described in section 3.3, injected at its edge rather than written into our pages. None of the three sets a cookie, and none is told anything about you beyond what is described above.

	4. Your Consent

		The only things stored on your device are the ones described above: what is needed to keep you signed in, and preferences you set yourself. Neither of the analytics in section 3.3 adds anything to that list, because neither writes anything at all — which is why this site still has no cookie banner. There is genuinely nothing stored on your device for us to ask you to consent to. You can clear what is stored at any time through your browser settings, though clearing the essential ones will sign you out.

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
