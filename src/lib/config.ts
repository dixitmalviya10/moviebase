/** TMDB image CDN sizing helpers and app-wide constants. */

const IMG_BASE = 'https://image.tmdb.org/t/p';

export const img = {
  poster: (path?: string | null, size: 'w342' | 'w500' = 'w500') =>
    path ? `${IMG_BASE}/${size}${path}` : null,
  backdrop: (
    path?: string | null,
    size: 'w780' | 'w1280' | 'original' = 'w1280',
  ) => (path ? `${IMG_BASE}/${size}${path}` : null),
  profile: (path?: string | null, size: 'w185' | 'h632' = 'w185') =>
    path ? `${IMG_BASE}/${size}${path}` : null,
  still: (path?: string | null, size: 'w300' | 'w780' = 'w300') =>
    path ? `${IMG_BASE}/${size}${path}` : null,
  logo: (path?: string | null, size: 'w92' | 'w154' = 'w154') =>
    path ? `${IMG_BASE}/${size}${path}` : null,
};

export const PLACEHOLDER_POSTER = '/assets/images/no-image.png';
export const PLACEHOLDER_PROFILE = '/assets/images/no-photo.jpg';

/** Build a slugged detail path, e.g. /movie/27205-inception */
export function mediaPath(
  media: 'movie' | 'tv' | 'person',
  id: number,
  title?: string | null,
) {
  const slug = title
    ? `-${title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')}`
    : '';
  return `/${media}/${id}${slug}`;
}

export const NAV_LINKS = {
  movies: [
    { label: 'Popular', to: '/movie' },
    { label: 'Now Playing', to: '/movie/now-playing' },
    { label: 'Upcoming', to: '/movie/upcoming' },
    { label: 'Top Rated', to: '/movie/top-rated' },
  ],
  tv: [
    { label: 'Popular', to: '/tv' },
    { label: 'Airing Today', to: '/tv/airing-today' },
    { label: 'On TV', to: '/tv/on-the-air' },
    { label: 'Top Rated', to: '/tv/top-rated' },
  ],
  people: [{ label: 'Popular People', to: '/person' }],
} as const;
