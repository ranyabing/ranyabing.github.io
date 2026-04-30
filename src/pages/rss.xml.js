import { getCollection } from 'astro:content';
import { SITE } from '@/data/site';
import { isPublished, sortPosts } from '@/utils/posts';

export async function GET({ site }) {
  const baseUrl = site ?? new URL(SITE.url);
  const posts = sortPosts((await getCollection('posts')).filter(isPublished));

  const items = posts
    .map((post) => {
      const link = new URL(`/posts/${post.slug}/`, baseUrl).toString();
      return [
        '<item>',
        `<title>${escapeXml(post.data.title)}</title>`,
        `<description>${escapeXml(post.data.description)}</description>`,
        `<link>${link}</link>`,
        `<guid>${link}</guid>`,
        `<pubDate>${post.data.pubDate.toUTCString()}</pubDate>`,
        '</item>'
      ].join('');
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE.title)}</title>
    <description>${escapeXml(SITE.description)}</description>
    <link>${SITE.url}</link>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
}

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return char;
    }
  });
}
