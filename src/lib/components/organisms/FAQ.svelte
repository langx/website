<script lang="ts">
    interface MyObject {
        id: number;
        title: string;
        content: string;
        isOpen: boolean;
    }

    const arrayOfObjects: MyObject[] = [
        { id: 1, title: "First Title", content: "First Content", isOpen: false },
        { id: 2, title: "Second Title", content: "Second Content", isOpen: false },
        { id: 3, title: "Third Title", content: "Third Content", isOpen: false }
    ];

    const openAccordionContent = () => {
        console.log('works so far');
    }
</script>

<section id="faq">
    <div class="faq-container">
        <h2>Frequently Asked Questions</h2>
        <div class="accordion">
            {#each arrayOfObjects as item (item.id)}
                <div class="accordion-item">
                    <button on:click={()=>{item.isOpen = !item.isOpen}} id="accordion-button-5" aria-expanded={item?.isOpen}><span class="accordion-title">{item?.title}</span><span class="icon" aria-hidden="true"></span></button>
                    <div class="accordion-content">
                        <p>{item?.content}</p>
                    </div>
                </div>
            {/each}
        </div>
      </div>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#faq {
		color: #000;
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

    @import url('https://fonts.googleapis.com/css?family=Hind:300,400&display=swap');

    $bg: #fff;
    $text: #7288a2;
    $gray: #4d5974;
    $lightgray: #e5e5e5;
    $blue: #03b5d2;

    .faq-container {
        margin: 0 auto;
        padding: 4rem;
        width: 48rem;

        .accordion {
        .accordion-item {
            border-bottom: 1px solid $lightgray;

            button[aria-expanded='true'] {
                border-bottom: 1px solid $blue;
            }
        }

        button {
            position: relative;
            display: block;
            text-align: left;
            width: 100%;
            padding: 1em 0;
            color: $text;
            font-size: 1.15rem;
            font-weight: 400;
            border: none;
            background: none;
            outline: none;

            &:hover, &:focus {
                cursor: pointer;
                color: $blue;

                &::after {
                    cursor: pointer;
                    color: $blue;
                    border: 1px solid $blue;
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
            color: $blue;

            .icon {
                &::after {
                    width: 0;
                }
            }

            + .accordion-content {
                opacity: 1;
                max-height: 9em;
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
                font-size: 1rem;
                font-weight: 300;
                margin: 2em 0;
            }
        }
    }
}
</style>
