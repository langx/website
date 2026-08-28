<section id="policy">

	*Effective Date: 27, Aug 2026*

	If you would like to delete your LangX account or the data we hold about you, you can do it yourself from inside the app — you do not need to contact us first.

	1. Deleting your account

		- Open LangX and go to **Settings**.
		- Choose **Delete my account**.
		- Confirm. Your account becomes invisible immediately and every session is signed out.

		The data is permanently removed **30 days** after you confirm. If you change your mind, signing back in during those 30 days cancels the deletion.

		When the 30 days are up, your profile, photos, location, devices, blocks, the reports you filed, the record of profiles you viewed, your subscription record and your sign-in credentials are all deleted. Your photos, and the photos and voice messages you sent in chat, are deleted from storage as well as from the database, so nothing remains reachable by URL.

	2. Two things that are not deleted, and why

		- **Messages you sent stay in the other person's conversation**, with their content and attachments removed and marked as belonging to a deleted account. Removing them outright would rewrite a conversation someone else is also a party to.
		- **The token ledger is kept as an audit record**, with your identity replaced by a random value stored nowhere else. The totals still reconcile and the rows no longer identify anyone. Your leaderboard entries are deleted outright.

	3. Downloading your data first

		Settings also offers **Download my data**, which returns a single file containing everything the app holds about you: your profile, the conversations you are part of, the messages you sent, your token ledger, subscriptions, blocks, the profiles you viewed and your registered devices. It does not include the other person's messages, because those are their words and not your data. Downloading before deletion is worth it — after the 30 days there is nothing left to export.

	4. Deleting some data without deleting your account

		You can remove individual photos, messages and profile fields from within the app.

		Two cases people ask about specifically:

		- **Location.** Turning off location sharing in Settings deletes the stored point outright and removes you from other people's Nearby results. You do not need to delete or export anything else to do it.
		- **Profile views.** The record of who viewed a profile is deleted automatically after 90 days, whether or not you ask.

		For anything you cannot reach yourself, email us at [hi@langx.io] with the subject "Partial Data Deletion Request".

	5. Subscriptions are separate

		Deleting your account does not cancel a paid subscription. Cancel it with Apple, Google or our web payment provider, whichever you bought it from — we cannot cancel a store subscription on your behalf.

	6. Contacting support

		If you run into a problem with any of the above, contact us at [hi@langx.io] with the subject "Data Deletion Request" and include:

		- The email address associated with your LangX account
		- A brief description of your request

		To protect your account we may need to verify your identity before acting on a request that did not come from inside the app.

	7. Timeline

		Deletion started in the app completes automatically after 30 days. A request sent to us by email is actioned within 30 days of us verifying it. Some residual copies may persist in encrypted backups for a limited period before those backups expire.

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
