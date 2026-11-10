// News posts, read from src/data/news.json (generated from the vault by tools/build-news.py;
// never edit the JSON by hand). Adds what the pages need: a stable slug, a filter kind, an
// excerpt and the body as HTML.
import { marked } from 'marked';
import raw from '../data/news.json';
import { appBySlug } from '../data/apps';

type RawPost = { date: string; app: string; tag: string; title: string; body?: string; link?: { href: string; label: string } };

export type Kind = 'release' | 'lab' | 'press' | 'covers';
export const KIND_LABEL: Record<Kind, string> = { release: 'Releases', lab: 'In the works', press: 'Press', covers: 'Covers' };

// The vault tags are free text; each maps to one filter.
const KIND_OF_TAG: Record<string, Kind> = {
  'Out now': 'release', Update: 'release', New: 'release', Free: 'release',
  'In the lab': 'lab', 'In beta': 'lab', 'Launching July': 'lab',
  Coverage: 'press',
};

// Old relative links meant /apps/<slug>/; an app that lives elsewhere (Re-deemer) goes straight there.
const fixHref = (href: string) => {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const abs = href.startsWith('/') ? href : '/apps/' + href;
  const m = abs.match(/^\/apps\/([^/]+)\/?$/);
  const ext = m && appBySlug(m[1])?.external;
  return ext || abs;
};

const slugify = (s: string) => {
  const full = s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (full.length <= 60) return full;
  const cut = full.slice(0, 61);
  return cut.slice(0, cut.lastIndexOf('-'));
};

const plain = (md: string) =>
  md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`#>]/g, '').replace(/\s+/g, ' ').trim();

function excerpt(body = '') {
  const first = body.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !p.startsWith('-') && !p.startsWith('#')) || body;
  const text = plain(first);
  if (text.length <= 220) return text;
  const cut = text.slice(0, 220);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '') + '…';
}

export type Post = RawPost & {
  slug: string;
  kind: Kind;
  excerpt: string;
  html: string;
  href: string;
  link?: { href: string; label: string };
};

const posts: Post[] = (raw as RawPost[])
  .map((p) => {
    const html = (marked.parse(p.body || '', { async: false }) as string).replace(/href="([^"]+)"/g, (_, h) => `href="${fixHref(h)}"`);
    const slug = `${p.date}-${slugify(p.title)}`;
    return {
      ...p,
      slug,
      kind: KIND_OF_TAG[p.tag] || 'release',
      excerpt: excerpt(p.body),
      html,
      href: `/news/${slug}/`,
      link: p.link ? { href: fixHref(p.link.href), label: p.link.label } : undefined,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export const allPosts = () => posts;
export const postsFor = (app: string) => posts.filter((p) => p.app === app);
export const appOf = (p: Post) => appBySlug(p.app);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`;
};
