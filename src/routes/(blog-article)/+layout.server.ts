import { filteredPosts } from '$lib/data/blog-posts';

export async function load({ url }: { url: { pathname: string } }) {
  const { pathname } = url;
  // Both ends: the leading slash always, a trailing one if the URL has it.
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  const post = filteredPosts.find((post) => post.slug === slug);

  return {
    post
  };
}
