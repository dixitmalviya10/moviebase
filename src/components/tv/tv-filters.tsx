import { MediaFilters } from '@/components/media/media-filters';
import { useTvGenres } from '@/hooks/use-tmdb';
import {
  TV_CATEGORIES,
  TV_SORT_OPTIONS,
  effectiveTvSort,
  type TvCategory,
  type TvFilterState,
} from '@/lib/tv-filters';

interface Props {
  state: TvFilterState;
  onChange: (patch: Partial<TvFilterState>) => void;
}

export function TvFilters({ state, onChange }: Props) {
  const { data: genres = [] } = useTvGenres();

  return (
    <MediaFilters<TvCategory>
      categories={TV_CATEGORIES}
      sortOptions={TV_SORT_OPTIONS}
      genres={genres}
      activeSort={effectiveTvSort(state)}
      state={state}
      onChange={onChange}
    />
  );
}
