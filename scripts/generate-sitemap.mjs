/**
 * Generate public/sitemap.xml.
 *
 * The browse pages are a fixed handful of URLs; the pages actually worth
 * indexing are the detail pages, and there are ~a million of them. So we submit
 * the head of the distribution — the most popular and highest-rated titles and
 * people — which is what search engines will rank anyway. The rest get
 * discovered by crawling the recommendation links on those pages.
 *
 * Usage:  npm run sitemap
 *
 * Reads VITE_API_TOKEN (TMDB v4 read token) and VITE_SITE_URL from .env. Run it
 * before `npm run build` when you want the sitemap refreshed; it is deliberately
 * not part of the build, so a missing token or a TMDB outage can never break a
 * deploy.
 */

import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Minimal .env reader — avoids taking on a dotenv dependency for one script. */
async function loadEnv() {
  const file = path.join(ROOT, '.env');
  if (!existsSync(file)) return;
  const text = await readFile(file, 'utf8');
  for (const line of text.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const value = (match[2] ?? '').trim().replace(/^(['"])(.*)\1$/, '$2');
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

await loadEnv();

const TOKEN = process.env.VITE_API_TOKEN;
const SITE_URL = (
  process.env.VITE_SITE_URL ?? 'https://moviebase-psi.vercel.app'
).replace(/\/$/, '');

if (!TOKEN) {
  console.error(
    'VITE_API_TOKEN is not set — cannot reach TMDB. Add it to .env and retry.',
  );
  process.exit(1);
}

/** How many 20-result pages to pull per list. 5 pages = 100 titles each. */
const PAGES_PER_LIST = 5;

/** Transient-failure retries per page before giving up on the run. */
const MAX_RETRIES = 4;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch one TMDB page, retrying on transient failures.
 *
 * Firing every page at once gets a large share of the sockets dropped
 * ("fetch failed") and trips TMDB's rate limiter, so requests are issued
 * serially by `collect` and retried with backoff here.
 */
async function tmdb(endpoint, params = {}, attempt = 1) {
  const url = new URL(`https://api.themoviedb.org/3${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' },
    });
    if (res.status === 429 || res.status >= 500) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    if (!res.ok) {
      // 401/404 are configuration errors — retrying will not fix them.
      throw Object.assign(new Error(`${res.status} ${res.statusText}`), {
        fatal: true,
      });
    }
    return await res.json();
  } catch (err) {
    if (err.fatal || attempt > MAX_RETRIES) throw err;
    await sleep(2 ** attempt * 250);
    return tmdb(endpoint, params, attempt + 1);
  }
}

/** Pull `PAGES_PER_LIST` pages of a TMDB list, serially, and flatten them. */
async function collect(endpoint) {
  const results = [];
  for (let page = 1; page <= PAGES_PER_LIST; page++) {
    const data = await tmdb(endpoint, { page });
    results.push(...(data.results ?? []));
  }
  console.log(`  ${endpoint} — ${results.length} items`);
  return results;
}

/** Must match mediaPath() in src/lib/config.ts, or canonicals won't line up. */
function mediaPath(media, id, title) {
  const slug = title
    ? `-${title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')}`
    : '';
  return `/${media}/${id}${slug}`;
}

function xmlEscape(value) {
  return value.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[c],
  );
}

const today = new Date().toISOString().slice(0, 10);

/** Browse pages: few, stable, and the entry points a crawler starts from. */
const staticEntries = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/movie', changefreq: 'daily', priority: '0.9' },
  { path: '/movie?category=now_playing', changefreq: 'daily', priority: '0.8' },
  { path: '/movie?category=upcoming', changefreq: 'daily', priority: '0.8' },
  { path: '/movie?category=top_rated', changefreq: 'weekly', priority: '0.8' },
  { path: '/tv', changefreq: 'daily', priority: '0.9' },
  { path: '/tv?category=airing_today', changefreq: 'daily', priority: '0.8' },
  { path: '/tv?category=on_the_air', changefreq: 'daily', priority: '0.8' },
  { path: '/tv?category=top_rated', changefreq: 'weekly', priority: '0.8' },
  { path: '/person', changefreq: 'daily', priority: '0.9' },
];

console.log(`Building sitemap for ${SITE_URL}`);

const [
  popularMovies,
  topMovies,
  popularTv,
  topTv,
  popularPeople,
] = await Promise.all([
  collect('/movie/popular'),
  collect('/movie/top_rated'),
  collect('/tv/popular'),
  collect('/tv/top_rated'),
  collect('/person/popular'),
]);

/** Dedupe by id — popular and top-rated overlap heavily. */
function detailEntries(items, media, priority) {
  const byId = new Map();
  for (const item of items) {
    const title = item.title || item.name;
    if (!item.id || !title) continue;
    byId.set(item.id, {
      path: mediaPath(media, item.id, title),
      changefreq: 'weekly',
      priority,
      lastmod: item.release_date || item.first_air_date || today,
    });
  }
  return [...byId.values()];
}

const entries = [
  ...staticEntries.map((entry) => ({ ...entry, lastmod: today })),
  ...detailEntries([...popularMovies, ...topMovies], 'movie', '0.7'),
  ...detailEntries([...popularTv, ...topTv], 'tv', '0.7'),
  ...detailEntries(popularPeople, 'person', '0.6'),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
    .map(
      (entry) => `  <url>
    <loc>${xmlEscape(SITE_URL + entry.path)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n')}
</urlset>
`;

await writeFile(path.join(ROOT, 'public', 'sitemap.xml'), xml, 'utf8');

console.log(
  `Wrote public/sitemap.xml — ${entries.length} URLs ` +
  `(${staticEntries.length} browse, ${entries.length - staticEntries.length} detail).`,
);
