/** Category presets + request construction for the People page. */

import type { FilterCategory } from '@/lib/media-filters';

export type PersonCategory = 'popular' | 'trending_day' | 'trending_week';

export const PERSON_CATEGORIES: FilterCategory<PersonCategory>[] = [
  {
    value: 'popular',
    label: 'Popular',
    title: 'Popular People',
    eyebrow: 'Most-followed right now',
  },
  {
    value: 'trending_day',
    label: 'Trending Today',
    title: 'Trending Today',
    eyebrow: 'Rising in the last 24 hours',
  },
  {
    value: 'trending_week',
    label: 'Trending This Week',
    title: 'Trending This Week',
    eyebrow: 'Rising over the past week',
  },
];

export function personCategoryMeta(category: PersonCategory) {
  return (
    PERSON_CATEGORIES.find((c) => c.value === category) ?? PERSON_CATEGORIES[0]
  );
}

/**
 * People have no `/discover` endpoint, so there are no genre or sort controls —
 * the state is just a category preset plus an optional name query.
 */
export interface PersonFilterState {
  category: PersonCategory;
  query: string;
}

/** The TMDB list endpoint (and params) a given filter state resolves to. */
export function personListRequest(state: PersonFilterState): {
  url: string;
  params: Record<string, string | number | boolean>;
} {
  const query = state.query.trim();

  // A name query wins over the category preset.
  if (query) {
    return {
      url: '/search/person',
      params: { query, include_adult: false, language: 'en-US' },
    };
  }

  switch (state.category) {
    case 'trending_day':
      return { url: '/trending/person/day', params: { language: 'en-US' } };
    case 'trending_week':
      return { url: '/trending/person/week', params: { language: 'en-US' } };
    case 'popular':
    default:
      return { url: '/person/popular', params: { language: 'en-US' } };
  }
}
