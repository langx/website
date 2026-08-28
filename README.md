[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/wm9t.svg)](https://status.langx.io)

# [langx.io](https://langx.io)

Welcome to LangX! LangX matches you with people who speak the language you're learning and are learning the language you speak — real conversations, message corrections and built-in translation, on iOS, Android and the web.

## Keeping the numbers honest

Several pages state limits and prices that are enforced by the app, not by this
site. They are mirrored in [`src/lib/data/plans.ts`](src/lib/data/plans.ts) and
[`src/lib/data/token.ts`](src/lib/data/token.ts), each of which points at the
file in `langx2` it copies:

| Here                    | Source of truth in `langx2`                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `src/lib/data/plans.ts` | `packages/shared/src/limits.ts` (`PLAN_LIMITS`)                              |
| `src/lib/data/token.ts` | `packages/shared/src/token.ts` (`TOKEN_RULES`), `cosmetics.ts` (`COSMETICS`) |

When a limit or a token rule changes in `langx2`, change it in the matching file
here. Nothing checks this automatically, so a claim on the site can drift into
being false without anything failing — which is exactly what this section exists
to prevent.

The product claims on this site are also constrained by
`langx2/docs/legal/promise-change.md` and `langx2/docs/token-messaging-brief.md`.
Before adding a feature claim, check it is one the shipping app actually meets.

## Table of Contents

- [Getting Started](#getting-started)
- [Building](#building)
- [Contributing](#contributing)
- [License](#license)

## Getting started

To clone this project, simply run the following command:

```bash
# clone this repo
git clone  https://github.com/langx/website

# install dependencies
npm install
```

Once you've created your project and installed dependencies with `npm install`, you can start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Contributing

We welcome contributions from the community! If you'd like to contribute to LangX, please fork our repository and submit a pull request. We'll review your changes and merge them if they meet our guidelines. Thank you for helping to make LangX even better!

```bash
$ npm run lint
$ npm run format
```

We'll review your changes and merge them if they meet our guidelines. Thank you for helping to make LangX even better!

LangX is an open source project and we welcome contributions from the community. If you're interested in contributing, please check out our GitHub repository for more information.

## Versioning

LangX uses [Semantic Versioning](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/langx/website/releases).

### [v0.2](https://github.com/langx/website/releases/tag/v0.2)

![Site Preview v0.2 langx.io](static/images/site-preview.png)

### [v0.1](https://github.com/langx/website/releases/tag/v0.1)

![Site Preview v0.1 langx.io](static/versioning/v0.1.png)

## Stats

### Stargazers

[![Stargazers over time](https://starchart.cc/langx/website.svg?variant=adaptive)](https://starchart.cc/langx/website)

### Contributors

[![GitHub Contributor Over Time](https://contributor-overtime-api.git-contributor.com/contributors-svg?chart=contributorOverTime&repo=langx/website)](https://git-contributor.com?chart=contributorOverTime&repo=langx/website)

[![GitHub Contributors Image](https://contrib.rocks/image?repo=langx/website)](https://github.com/langx/website/graphs/contributors)

## License

LangX is released under the [MIT License](./LICENSE). If you use this project, please include the license file in your distribution.
