import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2, SearchX, Film } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MediaGrid, MediaGridSkeleton } from '@/components/media/media-grid';
import { MovieFilters } from '@/components/movie/movie-filters';
import { useInfiniteMovies } from '@/hooks/use-tmdb';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import {
  categoryMeta,
  type MovieCategory,
  type MovieFilterState,
} from '@/lib/movie-filters';
import { canonical, seo } from '@/lib/seo';
import type { MediaItem } from '@/types/tmdb';

interface MovieSearch {
  category?: string;
  genres?: number[];
  sort?: string;
}

const CATEGORIES = ['popular', 'now_playing', 'upcoming', 'top_rated'];

const CATEGORY_DESCRIPTIONS: Record<MovieCategory, string> = {
  popular: 'Browse the most popular movies right now, ranked by what people are actually watching. Ratings, trailers, cast and crew for every title.',
  now_playing: 'See which movies are playing in theaters right now. Showtimes-ready listings with ratings, trailers, cast and crew.',
  upcoming: 'Upcoming movies and new releases coming soon to theaters. Release dates, first trailers, cast and crew.',
  top_rated: 'The highest-rated movies of all time, ranked by audience score. Explore the best films ever made with ratings, trailers and credits.',
};

export const Route = createFileRoute('/movie/')({
  /**
   * Title and description track the active category. Genre/sort permutations
   * are all the same set of films in a different order, so they canonicalise
   * back to the plain category URL rather than competing as separate pages.
   */
  head: ({ match }) => {
    const category = (match.search.category as MovieCategory) ?? 'popular';
    const meta = categoryMeta(category);
    const path = category === 'popular' ? '/movie' : `/movie?category=${category}`;

    return {
      meta: seo({
        title: `${meta.title} — Movies | MovieBase`,
        description: CATEGORY_DESCRIPTIONS[category],
        path,
        keywords: [meta.title.toLowerCase(), 'movies', 'films', 'watch movies'],
      }),
      links: canonical(path),
    };
  },
  validateSearch: (search: Record<string, unknown>): MovieSearch => {
    const out: MovieSearch = {};
    if (
      typeof search.category === 'string' &&
      CATEGORIES.includes(search.category)
    ) {
      out.category = search.category;
    }
    if (Array.isArray(search.genres)) {
      const genres = search.genres
        .map((g) => Number(g))
        .filter((n) => Number.isInteger(n));
      if (genres.length) out.genres = genres;
    }
    if (typeof search.sort === 'string') out.sort = search.sort;
    return out;
  },
  component: MoviesPage,
});

function MoviesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const state: MovieFilterState = {
    category: (search.category as MovieCategory) ?? 'popular',
    genres: search.genres ?? [],
    sort: search.sort,
  };

  const patch = React.useCallback(
    (p: Partial<MovieFilterState>) => {
      navigate({
        search: (prev) => {
          const next: MovieSearch = { ...prev, ...p };
          if (!next.genres || next.genres.length === 0) delete next.genres;
          if (!next.sort) delete next.sort;
          if (next.category === 'popular') delete next.category;
          return next;
        },
      });
    },
    [navigate],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    refetch,
  } = useInfiniteMovies(state);

  const sentinelRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage && !isFetchingNextPage && !isPending,
  );

  // Deduplicate across pages (popularity sort can shift items).
  const items = React.useMemo(() => {
    const seen = new Set<number>();
    const list: MediaItem[] = [];
    for (const page of data?.pages ?? []) {
      for (const item of page.results) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          list.push(item);
        }
      }
    }
    return list;
  }, [data]);

  const meta = categoryMeta(state.category);
  const total = data?.pages[0]?.total_results ?? 0;

  return (
    <div className="mx-auto max-w-350 px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <header className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          {meta.eyebrow}
        </p>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {meta.title}
          </h1>
          {total > 0 && (
            <span className="text-sm text-muted-foreground">
              {total.toLocaleString()} results
            </span>
          )}
        </div>
      </header>

      {/* Filters */}
      <div className="mb-8">
        <MovieFilters state={state} onChange={patch} />
      </div>

      {/* Content */}
      {isPending ? (
        <MediaGridSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState onReset={() => patch({ genres: [], sort: undefined })} />
      ) : (
        <>
          <MediaGrid items={items} media="movie" />

          {/* Infinite-scroll sentinel + status */}
          <div
            ref={sentinelRef}
            className="flex flex-col items-center justify-center py-10"
          >
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary" />
                Loading more…
              </div>
            ) : hasNextPage ? (
              <Button variant="outline" onClick={() => fetchNextPage()}>
                Load more
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                You've reached the end · {items.length} movies
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="glass flex size-16 items-center justify-center rounded-2xl border border-white/10">
        <SearchX className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">No movies match these filters</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Try removing a genre or changing the sort order.
        </p>
      </div>
      <Button variant="outline" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="glass flex size-16 items-center justify-center rounded-2xl border border-white/10">
        <Film className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Couldn't load movies</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong reaching TMDB. Please try again.
        </p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
