import { Search, Loader2, X } from 'lucide-react';

import { SegmentedControl } from '@/components/ui/segmented-control';
import { PERSON_CATEGORIES, type PersonCategory } from '@/lib/person-filters';

interface Props {
  category: PersonCategory;
  /** Raw input text (the page owns it, and debounces it into the URL). */
  query: string;
  /** True while a search request is in flight. */
  searching?: boolean;
  onCategoryChange: (category: PersonCategory) => void;
  onQueryChange: (query: string) => void;
}

/**
 * Category presets + name search for the People page. There is no
 * `/discover/person`, so genre and sort controls don't apply here.
 */
export function PersonFilters({
  category,
  query,
  searching,
  onCategoryChange,
  onQueryChange,
}: Props) {
  // A name query overrides the category preset, so dim the presets while one is
  // active — clicking any of them clears the search.
  const searchActive = query.trim().length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SegmentedControl
        options={PERSON_CATEGORIES}
        value={searchActive ? null : category}
        onChange={onCategoryChange}
        label="Category"
        dimmed={searchActive}
      />

      <div className="relative min-w-0 flex-1 sm:ml-auto sm:w-72 sm:flex-none">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search people by name…"
          aria-label="Search people by name"
          className="glass h-10 w-full rounded-full border border-white/10 pl-10 pr-10 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
        />
        <div className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center">
          {searching && searchActive ? (
            <Loader2 className="size-4 animate-spin text-primary" />
          ) : searchActive ? (
            <button
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
