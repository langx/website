<section id="completeduserprofiles">
	<div class="profile-wrapper">
		<div class="profile-header">
			<h2>Recent Completed Profiles</h2>
		</div>
		<ul role="list">
			<!--
			loop through recent completed users profiles api,
			limit by 6 or by 3,
			sort by most recent.
			Feel free to add a link to the user profile page.
			-->
			{#each Array(6) as _, i}
				<li>
					<!--the online status needs to be dynamic, remove if not planning to use-->
					<div class="online-status" style={i % 2 === 0 ? 'background-color: #59FE59' : 'background-color: var(--color--secondary)'}></div>
					<img src="https://avatars.githubusercontent.com/u/3280475?v=4" alt="User">
					<h3>Leonard Krasner</h3>
					<p>Speaks: <span style="color: #ffffff">French</span></p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

	#completeduserprofiles {
		background-color: var(--color--text-inverse);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
		padding: 35px 0;
		border-radius: 10px;

		@media (min-width: 640px) {
      padding: 25px 0;
		}

		.profile-wrapper {
			margin: auto;
      max-width: 1280px;
      padding-left: 24px;
      padding-right: 24px;
			text-align: center;

			@media (min-width: 1024px) {
        padding-left: 32px;
        padding-right: 32px;
			}

			.profile-header {
        margin: auto;
        max-width: 672px;

				h2 {
          font-size: 30px;
          line-height: 36px;
					font-weight: bold;
          letter-spacing: -0.025em;
					color: #ffffff;

          @media (min-width: 640px) {
            font-size: 36px;
            line-height: 40px;
					}
				}
			}

			ul {
				display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 24px;
        max-width: 672px;
        margin: 80px auto 0 auto;

        @media (min-width: 640px) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
				}

        @media (min-width: 1024px) {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px;
					margin: 80px 0 0 0;
          max-width: none;
				}

				li {
          position: relative;
					list-style: none;
					background-color: var(--color--profile-card-color);
          border-radius: 16px;
          padding: 40px 32px;

					.online-status {
            position: absolute;
            top: 8px;
            left: 8px;
            width: 20px;
            height: 20px;
            border-radius: 9999px;
					}

					img {
						margin: auto;
            height: 192px;
            width: 192px;
            border-radius: 9999px;

            @media (min-width: 768px) {
              height: 224px;
              width: 224px;
						}
					}

					h3 {
            margin-top: 24px;
            font-size: 16px;
						font-weight: bold;
            line-height: 28px;
            letter-spacing: -0.025em;
						color: #ffffff;
					}

					p {
            font-size: 14px;
            line-height: 24px;
						color: var(--color--secondary);
					}
        }
      }
		}
	}
</style>