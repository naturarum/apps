// RSS feed of every post, newest first.
import type { APIRoute } from 'astro';
import { allPosts, appOf } from '../../lib/news';
import { SITE } from '../../data/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('http://localhost:4321');
  const abs = (p: string) => new URL(p, base).href;
  const items = allPosts().map((p) => {
    const app = appOf(p);
    const html = p.html.replace(/href="\//g, `href="${base.origin}/`);
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${abs(p.href)}</link>
      <guid isPermaLink="true">${abs(p.href)}</guid>
      <pubDate>${new Date(p.date + 'T12:00:00Z').toUTCString()}</pubDate>
      ${app ? `<category>${esc(app.name)}</category>` : ''}
      <description>${esc(html)}</description>
    </item>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>naturarum news</title>
    <link>${abs('/')}</link>
    <atom:link href="${abs('/news/feed.xml')}" rel="self" type="application/rss+xml" />
    <description>${esc(SITE.tagline)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
