/** Category presets + discover param construction for the Movies page. */

export type MovieCategory =
  | 'popular'
  | 'now_playing'
  | 'upcoming'
  | 'top_rated';

export const MOVIE_CATEGORIES: {
  value: MovieCategory;
  label: string;
  title: string;
  eyebrow: string;
}[] = [
  {
    value: 'popular',
    label: 'Popular',
    title: 'Popular Movies',
    eyebrow: 'Most-watched right now',
  },
  {
    value: 'now_playing',
    label: 'Now Playing',
    title: 'Now Playing',
    eyebrow: 'In theaters',
  },
  {
    value: 'upcoming',
    label: 'Upcoming',
    title: 'Upcoming Movies',
    eyebrow: 'Coming soon',
  },
  {
    value: 'top_rated',
    label: 'Top Rated',
    title: 'Top Rated Movies',
    eyebrow: 'Critically acclaimed',
  },
];

export const MOVIE_SORT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Popularity ↓', value: 'popularity.desc' },
  { label: 'Popularity ↑', value: 'popularity.asc' },
  { label: 'Rating ↓', value: 'vote_average.desc' },
  { label: 'Rating ↑', value: 'vote_average.asc' },
  { label: 'Release Date ↓', value: 'primary_release_date.desc' },
  { label: 'Release Date ↑', value: 'primary_release_date.asc' },
  { label: 'Revenue ↓', value: 'revenue.desc' },
  { label: 'Title (A–Z)', value: 'title.asc' },
];

export function categoryMeta(category: MovieCategory) {
  return (
    MOVIE_CATEGORIES.find((c) => c.value === category) ?? MOVIE_CATEGORIES[0]
  );
}

function ymd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function shiftDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export interface MovieFilterState {
  category: MovieCategory;
  genres: number[];
  sort?: string;
}

/** The sort actually applied (explicit override, else the category default). */
export function effectiveSort(state: MovieFilterState): string {
  if (state.sort) return state.sort;
  return state.category === 'top_rated'
    ? 'vote_average.desc'
    : 'popularity.desc';
}

/** Build the /discover/movie query params for a given filter state. */
export function buildMovieDiscoverParams(
  state: MovieFilterState,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {
    include_adult: false,
    include_video: false,
    language: 'en-US',
    sort_by: effectiveSort(state),
  };

  if (state.genres.length > 0) {
    params.with_genres = state.genres.join('|');
  }

  switch (state.category) {
    case 'now_playing':
      params['release_date.gte'] = ymd(shiftDays(-45));
      params['release_date.lte'] = ymd(new Date());
      params.with_release_type = '2|3';
      break;
    case 'upcoming':
      params['release_date.gte'] = ymd(shiftDays(1));
      params['release_date.lte'] = ymd(shiftDays(120));
      params.with_release_type = '2|3';
      break;
    case 'top_rated':
      params['vote_count.gte'] = 300;
      params.without_genres = '99,10755';
      break;
    case 'popular':
    default:
      break;
  }

  return params;
}
