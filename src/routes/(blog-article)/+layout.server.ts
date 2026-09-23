import { filteredPosts } from '$lib/data/blog-posts';
import { ALPHABETS } from '$lib/data/alphabets';
import { WORD_LISTS } from '$lib/data/most-common-words';
import { signatureLetter } from '$lib/data/alphabet-guides';
import type { PostScript } from '$lib/utils/types';

/**
 * What the art above an alphabet guide draws: the script's signature letter
 * with its name and sound, and a handful of the others beside it. Picked
 * here, on the server, so the letter charts never ship to the browser for a
 * picture of fifteen of them.
 */
const scriptFor = (slug: string): PostScript | undefined => {
  const lang = WORD_LISTS.find((l) => `${l.slug}-alphabet-guide` === slug);
  const alphabet = lang && ALPHABETS.find((a) => a.code === lang.code);
  if (!lang || !alphabet) return undefined;

  const letters = alphabet.groups.flatMap((g) => g.letters);
  // "Ω ω" is one letter in two cases; the picture shows the capital.
  const head = (c: string) => c.split(/\s+/)[0];
  const sign = signatureLetter(lang.code, lang.nativeName);
  const featured = letters.find((l) => head(l.c) === sign) ?? letters[0];

  return {
    code: lang.code,
    rtl: Boolean(alphabet.rtl),
    featured: { c: head(featured.c), name: featured.name, sound: featured.sound },
    others: letters
      .map((l) => head(l.c))
      .filter((c) => c !== head(featured.c))
      .slice(0, 15)
  };
};

export async function load({ url }: { url: { pathname: string } }) {
  const { pathname } = url;
  // Both ends: the leading slash always, a trailing one if the URL has it.
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  const post = filteredPosts.find((post) => post.slug === slug);

  return {
    post,
    script: post ? scriptFor(post.slug) : undefined
  };
}
