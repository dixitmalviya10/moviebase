/** Category presets + discover param construction for the TV Shows page. */

import {
  shiftDays,
  ymd,
  type FilterCategory,
  type FilterState,
  type SortOption,
} from '@/lib/media-filters';

export type TvCategory =
  | 'popular'
  | 'airing_today'
  | 'on_the_air'
  | 'top_rated';

export const TV_CATEGORIES: FilterCategory<TvCategory>[] = [
  {
    value: 'popular',
    label: 'Popular',
    title: 'Popular TV Shows',
    eyebrow: 'Most-watched right now',
  },
  {
    value: 'airing_today',
    label: 'Airing Today',
    title: 'Airing Today',
    eyebrow: 'New episodes today',
  },
  {
    value: 'on_the_air',
    label: 'On TV',
    title: 'Currently On TV',
    eyebrow: 'Airing this week',
  },
  {
    value: 'top_rated',
    label: 'Top Rated',
    title: 'Top Rated TV Shows',
    eyebrow: 'Critically acclaimed',
  },
];

/** `/discover/tv` has no revenue or title sorts — it uses name/first_air_date. */
export const TV_SORT_OPTIONS: SortOption[] = [
  { label: 'Popularity ↓', value: 'popularity.desc' },
  { label: 'Popularity ↑', value: 'popularity.asc' },
  { label: 'Rating ↓', value: 'vote_average.desc' },
  { label: 'Rating ↑', value: 'vote_average.asc' },
  { label: 'First Aired ↓', value: 'first_air_date.desc' },
  { label: 'First Aired ↑', value: 'first_air_date.asc' },
  { label: 'Name (A–Z)', value: 'name.asc' },
];

export type TvFilterState = FilterState<TvCategory>;

export function tvCategoryMeta(category: TvCategory) {
  return TV_CATEGORIES.find((c) => c.value === category) ?? TV_CATEGORIES[0];
}

/** The sort actually applied (explicit override, else the category default). */
export function effectiveTvSort(state: TvFilterState): string {
  if (state.sort) return state.sort;
  return state.category === 'top_rated'
    ? 'vote_average.desc'
    : 'popularity.desc';
}

/** Build the /discover/tv query params for a given filter state. */
export function buildTvDiscoverParams(
  state: TvFilterState,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {
    include_adult: false,
    include_null_first_air_dates: false,
    language: 'en-US',
    sort_by: effectiveTvSort(state),
  };

  if (state.genres.length > 0) {
    params.with_genres = state.genres.join('|');
  }

  switch (state.category) {
    case 'airing_today': {
      const today = ymd(new Date());
      params['air_date.gte'] = today;
      params['air_date.lte'] = today;
      break;
    }
    case 'on_the_air':
      params['air_date.gte'] = ymd(new Date());
      params['air_date.lte'] = ymd(shiftDays(7));
      break;
    case 'top_rated':
      params['vote_count.gte'] = 200;
      // Drop news/talk/reality/documentary, which otherwise dominate by rating.
      params.without_genres = '99,10763,10764,10767';
      break;
    case 'popular':
    default:
      break;
  }

  return params;
}
