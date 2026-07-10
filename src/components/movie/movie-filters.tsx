import { MediaFilters } from '@/components/media/media-filters';
import { useMovieGenres } from '@/hooks/use-tmdb';
import {
  MOVIE_CATEGORIES,
  MOVIE_SORT_OPTIONS,
  effectiveSort,
  type MovieCategory,
  type MovieFilterState,
} from '@/lib/movie-filters';

interface Props {
  state: MovieFilterState;
  onChange: (patch: Partial<MovieFilterState>) => void;
}

export function MovieFilters({ state, onChange }: Props) {
  const { data: genres = [] } = useMovieGenres();

  return (
    <MediaFilters<MovieCategory>
      categories={MOVIE_CATEGORIES}
      sortOptions={MOVIE_SORT_OPTIONS}
      genres={genres}
      activeSort={effectiveSort(state)}
      state={state}
      onChange={onChange}
    />
  );
}
