<script lang="ts">
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';
</script>

<section id="newsletter">
	<div class="newsletter-wrapper">
		<h2><SparklingHighlight color="secondary">Get notified when we’re launching</SparklingHighlight></h2>
		<p>Reprehenderit ad esse et non officia in nulla. Id proident tempor incididunt nostrud nulla et culpa.</p>
		<form>
			<label for="email-address" class="sr-only">Email address</label>
			<input id="email-address" name="email" type="email" autocomplete="email" required placeholder="Enter your email">
			<button type="submit">Notify me</button>
		</form>
		<svg viewBox="0 0 1024 1024" aria-hidden="true">
			<circle cx="512" cy="512" r="512" fill="var(--color--yellow)"></circle>
		</svg>
	</div>
</section>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

	#newsletter {
		margin: 80px 0;

		.newsletter-wrapper {
      padding: 144px 108px;
      border-radius: 1.5rem;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
      background: var(--color--card-background);
      overflow: hidden;
      isolation: isolate;
      position: relative;

			@include for-tablet-portrait-down {
        padding: 108px;
			}

      @include for-phone-only {
        border-radius: 10px;
        padding: 96px 24px;
      }

			h2 {
        font-weight: 700;
        text-align: center;
        max-width: 42rem;
				margin: auto;
			}

			p {
        font-size: 0.9rem;
        font-weight: 300;
        text-align: center;
        max-width: 36rem;
        margin: 0.5rem auto 0 auto;
			}

			form {
        column-gap: 1rem;
        max-width: 28rem;
        display: flex;
        margin: 2.5rem auto 0 auto;

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

				#email-address {
          line-height: 1.5rem;
          font-size: 0.875rem;
          background-color: #ffffff;
					color: rgb(17 24 39 / 1);
          padding: 0.5rem 0.875rem;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
          border-width: 0;
          border-radius: 0.375rem;
          flex: 1 1 auto;
          min-width: 0;
          appearance: none;
          margin: 0;
        }

				button {
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
          color: var(--color--secondary);
          font-weight: 600;
          font-size: 0.875rem;
          line-height: 1.25rem;
          padding: 0.625rem 0.875rem;
          background-color: #ffffff;
          border-radius: 0.375rem;
          flex: none;
          background-image: none;
          cursor: pointer;
          text-transform: none;
          margin: 0;
          outline: none;
          border: none;
					transition: color 0.2s, background-color 0.2s;

					&:hover {
            background-color: var(--color--secondary);
            color: #ffffff;
          }
        }
			}

			svg {
        width: 64rem;
        z-index: -10;
        position: absolute;
        min-width: 64rem;
        top: 61%;
        left: 50%;
        display: block;
        transform: translateX(-50%);
			}
		}
	}
</style>