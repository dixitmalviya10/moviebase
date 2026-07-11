import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2, SearchX, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MediaGridSkeleton } from '@/components/media/media-grid';
import { PersonGrid } from '@/components/person/person-grid';
import { PersonFilters } from '@/components/person/person-filters';
import { useDebounce } from '@/hooks/use-debounce';
import { useInfinitePeople } from '@/hooks/use-tmdb';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import {
  PERSON_CATEGORIES,
  personCategoryMeta,
  type PersonCategory,
  type PersonFilterState,
} from '@/lib/person-filters';
import type { PersonItem } from '@/types/tmdb';

interface PersonSearch {
  category?: string;
  q?: string;
}

const CATEGORIES: string[] = PERSON_CATEGORIES.map((c) => c.value);

export const Route = createFileRoute('/person/')({
  validateSearch: (search: Record<string, unknown>): PersonSearch => {
    const out: PersonSearch = {};
    if (
      typeof search.category === 'string' &&
      CATEGORIES.includes(search.category)
    ) {
      out.category = search.category;
    }
    if (typeof search.q === 'string' && search.q.trim()) {
      out.q = search.q;
    }
    return out;
  },
  component: PeoplePage,
});

function PeoplePage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const urlQuery = search.q ?? '';
  const [text, setText] = React.useState(urlQuery);
  const debounced = useDebounce(text, 350);

  const patch = React.useCallback(
    (p: PersonSearch, replace = false) => {
      navigate({
        search: (prev) => {
          const next: PersonSearch = { ...prev, ...p };
          if (!next.q) delete next.q;
          if (!next.category || next.category === 'popular')
            delete next.category;
          return next;
        },
        // Keystrokes replace rather than push, so Back leaves the page instead
        // of walking through every letter typed.
        replace,
      });
    },
    [navigate],
  );

  // Keep the debounced input and the `q` param in sync, in both directions: the
  // ref records what we last wrote, so an external change (back button, or a
  // category click clearing the search) resets the box instead of being undone.
  const lastPushed = React.useRef(urlQuery);

  React.useEffect(() => {
    if (debounced === lastPushed.current) return;
    lastPushed.current = debounced;
    patch({ q: debounced.trim() || undefined }, true);
  }, [debounced, patch]);

  React.useEffect(() => {
    if (urlQuery !== lastPushed.current) {
      lastPushed.current = urlQuery;
      setText(urlQuery);
    }
  }, [urlQuery]);

  const state: PersonFilterState = {
    category: (search.category as PersonCategory) ?? 'popular',
    query: urlQuery,
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isError,
    refetch,
  } = useInfinitePeople(state);

  const sentinelRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage && !isFetchingNextPage && !isPending,
  );

  // Deduplicate across pages (popularity ranking can shift items between them)
  // and drop adult performers, which TMDB mixes into the popular/trending feeds.
  const people = React.useMemo(() => {
    const seen = new Set<number>();
    const list: PersonItem[] = [];
    for (const page of data?.pages ?? []) {
      for (const person of page.results) {
        if (person.adult || seen.has(person.id)) continue;
        seen.add(person.id);
        list.push(person);
      }
    }
    return list;
  }, [data]);

  const searching = Boolean(state.query);
  const meta = personCategoryMeta(state.category);
  const title = searching ? 'Search Results' : meta.title;
  const eyebrow = searching ? `People matching “${state.query}”` : meta.eyebrow;
  const total = data?.pages[0]?.total_results ?? 0;

  function clearSearch() {
    setText('');
  }

  return (
    <div className="mx-auto max-w-350 px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <header className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          {eyebrow}
        </p>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {title}
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
        <PersonFilters
          category={state.category}
          query={text}
          searching={isFetching && !isFetchingNextPage}
          onCategoryChange={(category) => {
            setText('');
            patch({ category, q: undefined });
          }}
          onQueryChange={setText}
        />
      </div>

      {/* Content */}
      {isPending ? (
        <MediaGridSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : people.length === 0 ? (
        <EmptyState query={state.query} onClear={clearSearch} />
      ) : (
        <>
          <PersonGrid people={people} />

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
                You've reached the end · {people.length} people
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="glass flex size-16 items-center justify-center rounded-2xl border border-white/10">
        <SearchX className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">
          {query ? `No people match “${query}”` : 'No people to show'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {query
            ? 'Check the spelling, or try just a first or last name.'
            : 'This list is empty right now. Try another category.'}
        </p>
      </div>
      {query && (
        <Button variant="outline" onClick={onClear}>
          Clear search
        </Button>
      )}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="glass flex size-16 items-center justify-center rounded-2xl border border-white/10">
        <Users className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Couldn't load people</h2>
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
