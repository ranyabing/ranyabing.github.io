import { getCollection } from 'astro:content';
import { SITE } from '@/data/site';
import { getAllTags, isPublished } from '@/utils/posts';

export async function GET({ site }) {
  const baseUrl = site ?? new URL(SITE.url);
  const posts = (await getCollection('posts')).filter(isPublished);
  const tags = getAllTags(posts);
  const paths = [
    '/',
    '/posts/',
    '/tags/',
    '/about/',
    ...posts.map((post) => `/posts/${post.slug}/`),
    ...tags.map((tag) => `/tags/${encodeURIComponent(tag)}/`)
  ];

  const urls = paths
    .map((path) => {
      const loc = new URL(path, baseUrl).toString();
      return `<url><loc>${loc}</loc></url>`;
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
