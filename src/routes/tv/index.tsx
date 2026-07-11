import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2, SearchX, Tv } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MediaGrid, MediaGridSkeleton } from '@/components/media/media-grid';
import { TvFilters } from '@/components/tv/tv-filters';
import { useInfiniteTvShows } from '@/hooks/use-tmdb';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import {
  TV_CATEGORIES,
  tvCategoryMeta,
  type TvCategory,
  type TvFilterState,
} from '@/lib/tv-filters';
import { canonical, seo } from '@/lib/seo';
import type { MediaItem } from '@/types/tmdb';

interface TvSearch {
  category?: string;
  genres?: number[];
  sort?: string;
}

const CATEGORIES: string[] = TV_CATEGORIES.map((c) => c.value);

const CATEGORY_DESCRIPTIONS: Record<TvCategory, string> = {
  popular: 'Browse the most popular TV shows and series right now. Episode guides, ratings, trailers, cast and crew for every show.',
  airing_today: "TV shows airing today. See what's on, with episode details, ratings, trailers and full cast lists.",
  on_the_air: 'TV series currently on the air with new episodes this week. Ratings, episode guides, trailers and cast.',
  top_rated: 'The highest-rated TV series of all time, ranked by audience score. Explore the best shows ever made with ratings and credits.',
};

export const Route = createFileRoute('/tv/')({
  /** See the movies route — same category-driven title / canonical strategy. */
  head: ({ match }) => {
    const category = (match.search.category as TvCategory) ?? 'popular';
    const meta = tvCategoryMeta(category);
    const path = category === 'popular' ? '/tv' : `/tv?category=${category}`;

    return {
      meta: seo({
        title: `${meta.title} — TV Shows | MovieBase`,
        description: CATEGORY_DESCRIPTIONS[category],
        path,
        keywords: [meta.title.toLowerCase(), 'tv shows', 'series', 'streaming'],
      }),
      links: canonical(path),
    };
  },
  validateSearch: (search: Record<string, unknown>): TvSearch => {
    const out: TvSearch = {};
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
  component: TvShowsPage,
});

function TvShowsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const state: TvFilterState = {
    category: (search.category as TvCategory) ?? 'popular',
    genres: search.genres ?? [],
    sort: search.sort,
  };

  const patch = React.useCallback(
    (p: Partial<TvFilterState>) => {
      navigate({
        search: (prev) => {
          const next: TvSearch = { ...prev, ...p };
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
  } = useInfiniteTvShows(state);

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

  const meta = tvCategoryMeta(state.category);
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
        <TvFilters state={state} onChange={patch} />
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
          <MediaGrid items={items} media="tv" />

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
                You've reached the end · {items.length} shows
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
        <h2 className="text-lg font-semibold">No shows match these filters</h2>
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
        <Tv className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Couldn't load TV shows</h2>
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
