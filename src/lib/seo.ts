/**
 * SEO primitives: document-head meta, canonical URLs, and schema.org JSON-LD.
 *
 * Routes stay declarative — they call `seo()` from their `head()` and the tags
 * are rendered by `<HeadContent />` in the root layout.
 *
 * NOTE: this app is client-rendered, so these tags are only visible to crawlers
 * that execute JavaScript (Googlebot does; Facebook/X/WhatsApp/Slack do not).
 * The static fallbacks in index.html are what non-JS crawlers see.
 */

import { img, mediaPath } from '@/lib/config';
import { getYear } from '@/lib/format';
import type {
  MovieDetails,
  PersonDetails,
  TvDetails,
  CastMember,
  CrewMember,
} from '@/types/tmdb';

/**
 * Absolute origin used for canonical URLs, og:url, and the sitemap.
 *
 * Set `VITE_SITE_URL` to the production domain. Falling back to the live origin
 * keeps canonicals self-consistent on preview deploys instead of pointing every
 * preview at production.
 */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ??
  (typeof window !== 'undefined'
    ? window.location.origin
    : 'https://moviebase-psi.vercel.app')
).replace(/\/$/, '');

export const SITE_NAME = 'MovieBase';

export const DEFAULT_TITLE = 'MovieBase — Discover Movies, TV Shows & People';

export const DEFAULT_DESCRIPTION =
  'Discover millions of movies, TV shows and people. Search, browse trending titles, read cast and crew credits, and watch the latest trailers.';

/**
 * Social preview image for pages with no artwork of their own (home, browse).
 *
 * TODO: replace with a purpose-made 1200×630 branded card — this reuses the
 * hero banner, which is 16:9 and so gets cropped slightly by Facebook/X.
 */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/movie-banner.jpg`;

/** Longest description search engines and social cards will actually show. */
const DESCRIPTION_MAX = 160;

/** Resolve an app path against the site origin. Absolute URLs pass through. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Trim to a whole word within `max` chars and add an ellipsis. Search engines
 * truncate mid-word otherwise, which reads badly in a result snippet.
 */
export function truncate(
  text: string | null | undefined,
  max = DESCRIPTION_MAX,
): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** A single entry in a route's `head().meta` array. */
type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

interface SeoOptions {
  /** Page title. Rendered as-is — pass a title already suffixed with the site. */
  title?: string;
  description?: string | null;
  /** Absolute or app-relative image URL for the social card. */
  image?: string | null;
  /** App-relative path of the page, used for og:url. */
  path?: string;
  /** og:type — `website` for browse pages, `video.movie`, `profile`, etc. */
  type?: string;
  /** Set for pages that should stay out of the index (404, filtered views). */
  noindex?: boolean;
  keywords?: string[];
}

/**
 * Build the Open Graph + Twitter + description tag set for a page.
 *
 * Router merges these over the root route's defaults by `name`/`property`, so a
 * route only needs to pass what it actually overrides.
 */
export function seo({
  title,
  description,
  image,
  path,
  type = 'website',
  noindex,
  keywords,
}: SeoOptions): MetaTag[] {
  const desc = truncate(description || DEFAULT_DESCRIPTION);
  const ogImage = absoluteUrl(image || DEFAULT_OG_IMAGE);
  const tags: MetaTag[] = [];

  if (title) tags.push({ title });

  tags.push(
    { name: 'description', content: desc },

    // Open Graph — Facebook, LinkedIn, WhatsApp, Slack, Discord.
    { property: 'og:title', content: title ?? DEFAULT_TITLE },
    { property: 'og:description', content: desc },
    { property: 'og:type', content: type },
    { property: 'og:image', content: ogImage },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'en_US' },

    // Twitter/X. `summary_large_image` renders the full-bleed card.
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title ?? DEFAULT_TITLE },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:image', content: ogImage },
  );

  if (path) tags.push({ property: 'og:url', content: absoluteUrl(path) });
  if (keywords?.length)
    tags.push({ name: 'keywords', content: keywords.join(', ') });

  // Only emitted when restricting — absence already means "index, follow", and
  // a second robots tag would just muddy the directive.
  if (noindex) tags.push({ name: 'robots', content: 'noindex, follow' });

  return tags;
}

/** `<link rel="canonical">` for a route, collapsing duplicate/param URLs. */
export function canonical(path: string) {
  return [{ rel: 'canonical', href: absoluteUrl(path) }];
}

/* -------------------------------------------------------------------------- */
/*                              schema.org JSON-LD                             */
/* -------------------------------------------------------------------------- */

/** Wrap a schema object in the shape router's head parser expects. */
export function jsonLd(schema: object) {
  return { 'script:ld+json': schema } as unknown as MetaTag;
}

/** Site-level identity + logo. Emitted once, from the root route. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  };
}

/**
 * Breadcrumb trail. Google renders this as the path shown above a result title
 * in place of the raw URL.
 */
export function breadcrumbSchema(
  crumbs: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** TMDB votes are 0–10, which is already schema.org's expected shape. */
function ratingSchema(vote?: number, count?: number) {
  if (!vote || vote <= 0 || !count || count <= 0) return undefined;
  return {
    '@type': 'AggregateRating',
    ratingValue: Number(vote.toFixed(1)),
    ratingCount: count,
    bestRating: 10,
    worstRating: 0,
  };
}

function personRefs(people: Array<CastMember | CrewMember>) {
  return people.map((p) => ({
    '@type': 'Person',
    name: p.name,
    url: absoluteUrl(mediaPath('person', p.id, p.name)),
  }));
}

/** Crew holding any of `jobs`, deduped by person (one credit each). */
function crewNamed(crew: CrewMember[] | undefined, ...jobs: string[]) {
  if (!crew) return [];
  const byId = new Map<number, CrewMember>();
  for (const member of crew) {
    if (member.job && jobs.includes(member.job) && !byId.has(member.id)) {
      byId.set(member.id, member);
    }
  }
  return [...byId.values()];
}

export function movieSchema(movie: MovieDetails) {
  const rating = ratingSchema(movie.vote_average, movie.vote_count);
  const directors = crewNamed(movie.credits?.crew, 'Director');
  const cast = movie.credits?.cast?.slice(0, 10) ?? [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    url: absoluteUrl(mediaPath('movie', movie.id, movie.title)),
    image: img.poster(movie.poster_path, 'w500') ?? undefined,
    description: movie.overview || undefined,
    datePublished: movie.release_date || undefined,
    genre: movie.genres?.map((g) => g.name),
    inLanguage: movie.original_language,
    // schema.org wants ISO-8601 durations, e.g. 148 min -> PT148M.
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    director: directors.length ? personRefs(directors) : undefined,
    actor: cast.length ? personRefs(cast) : undefined,
    aggregateRating: rating,
    sameAs: movie.imdb_id
      ? `https://www.imdb.com/title/${movie.imdb_id}`
      : undefined,
  };
}

export function tvSchema(tv: TvDetails) {
  const rating = ratingSchema(tv.vote_average, tv.vote_count);
  const cast = tv.credits?.cast?.slice(0, 10) ?? [];
  const imdbId = tv.external_ids?.imdb_id;

  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: tv.name,
    url: absoluteUrl(mediaPath('tv', tv.id, tv.name)),
    image: img.poster(tv.poster_path, 'w500') ?? undefined,
    description: tv.overview || undefined,
    datePublished: tv.first_air_date || undefined,
    genre: tv.genres?.map((g) => g.name),
    inLanguage: tv.original_language,
    numberOfSeasons: tv.number_of_seasons,
    numberOfEpisodes: tv.number_of_episodes,
    creator: tv.created_by?.length
      ? tv.created_by.map((c) => ({
          '@type': 'Person',
          name: c.name,
          url: absoluteUrl(mediaPath('person', c.id, c.name)),
        }))
      : undefined,
    actor: cast.length ? personRefs(cast) : undefined,
    aggregateRating: rating,
    sameAs: imdbId ? `https://www.imdb.com/title/${imdbId}` : undefined,
  };
}

export function personSchema(person: PersonDetails) {
  const ext = person.external_ids;
  const profiles = [
    person.imdb_id && `https://www.imdb.com/name/${person.imdb_id}`,
    ext?.instagram_id && `https://instagram.com/${ext.instagram_id}`,
    ext?.twitter_id && `https://x.com/${ext.twitter_id}`,
    ext?.facebook_id && `https://facebook.com/${ext.facebook_id}`,
  ].filter((v): v is string => Boolean(v));

  // Their most popular credits — gives the entity real-world grounding.
  const knownFor = [...(person.combined_credits?.cast ?? [])]
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 5)
    .map((c) => ({
      '@type': c.media_type === 'tv' ? 'TVSeries' : 'Movie',
      name: c.title || c.name,
      url: absoluteUrl(
        mediaPath(
          c.media_type === 'tv' ? 'tv' : 'movie',
          c.id,
          c.title || c.name,
        ),
      ),
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: absoluteUrl(mediaPath('person', person.id, person.name)),
    image: img.profile(person.profile_path, 'h632') ?? undefined,
    description: person.biography ? truncate(person.biography, 300) : undefined,
    birthDate: person.birthday || undefined,
    deathDate: person.deathday || undefined,
    birthPlace: person.place_of_birth || undefined,
    jobTitle: person.known_for_department || undefined,
    alternateName: person.also_known_as?.length
      ? person.also_known_as
      : undefined,
    sameAs: profiles.length ? profiles : undefined,
    performerIn: knownFor.length ? knownFor : undefined,
  };
}

/* -------------------------------------------------------------------------- */
/*                          per-entity page descriptions                       */
/* -------------------------------------------------------------------------- */

/** Fall back to a generated line when TMDB has no overview/biography. */
export function movieDescription(movie: MovieDetails): string {
  if (movie.overview) return truncate(movie.overview);
  const year = getYear(movie.release_date);
  const genres = movie.genres?.map((g) => g.name).join(', ');
  return truncate(
    `${movie.title}${year ? ` (${year})` : ''}${genres ? ` — ${genres}` : ''}. Cast, crew, ratings, trailers and recommendations on ${SITE_NAME}.`,
  );
}

export function tvDescription(tv: TvDetails): string {
  if (tv.overview) return truncate(tv.overview);
  const year = getYear(tv.first_air_date);
  const seasons = tv.number_of_seasons;
  return truncate(
    `${tv.name}${year ? ` (${year})` : ''}${seasons ? ` — ${seasons} season${seasons > 1 ? 's' : ''}` : ''}. Cast, episodes, ratings and trailers on ${SITE_NAME}.`,
  );
}

export function personDescription(person: PersonDetails): string {
  if (person.biography) return truncate(person.biography);
  const role = person.known_for_department;
  const credits = person.combined_credits?.cast?.length ?? 0;
  return truncate(
    `${person.name}${role ? ` — ${role}` : ''}. Biography, filmography${credits ? ` of ${credits} credits` : ''}, photos and more on ${SITE_NAME}.`,
  );
}
