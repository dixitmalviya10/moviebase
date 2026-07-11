import { ChevronDown, ArrowUpDown, RotateCcw, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SegmentedControl } from '@/components/ui/segmented-control';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type {
  FilterCategory,
  FilterState,
  SortOption,
} from '@/lib/media-filters';
import type { Genre } from '@/types/tmdb';

interface Props<C extends string> {
  categories: FilterCategory<C>[];
  sortOptions: SortOption[];
  genres: Genre[];
  /** Sort in effect right now — the explicit one, or the category default. */
  activeSort: string;
  state: FilterState<C>;
  onChange: (patch: Partial<FilterState<C>>) => void;
}

/**
 * Category / genre / sort controls shared by the Movies and TV Shows pages.
 * Media-specific presets are supplied by the caller.
 */
export function MediaFilters<C extends string>({
  categories,
  sortOptions,
  genres,
  activeSort,
  state,
  onChange,
}: Props<C>) {
  const selectedGenres = genres.filter((g) => state.genres.includes(g.id));
  const sortLabel =
    sortOptions.find((o) => o.value === activeSort)?.label ?? 'Sort';
  const hasFilters = state.genres.length > 0 || Boolean(state.sort);

  function toggleGenre(id: number) {
    const next = state.genres.includes(id)
      ? state.genres.filter((g) => g !== id)
      : [...state.genres, id];
    onChange({ genres: next });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          options={categories}
          value={state.category}
          onChange={(category) => onChange({ category })}
          label="Category"
        />

        <div className="ml-auto flex items-center gap-2">
          {/* Genres */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                Genres
                {state.genres.length > 0 && (
                  <Badge
                    variant="gold"
                    className="ml-0.5 h-5 min-w-5 justify-center rounded-full px-1"
                  >
                    {state.genres.length}
                  </Badge>
                )}
                <ChevronDown className="size-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-80 w-56 overflow-y-auto"
            >
              <DropdownMenuLabel>Filter by genre</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {genres.map((g) => (
                <DropdownMenuCheckboxItem
                  key={g.id}
                  checked={state.genres.includes(g.id)}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleGenre(g.id);
                  }}
                >
                  {g.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowUpDown className="size-3.5 opacity-70" />
                {sortLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={activeSort}
                onValueChange={(v) => onChange({ sort: v })}
              >
                {sortOptions.map((o) => (
                  <DropdownMenuRadioItem key={o.value} value={o.value}>
                    {o.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange({ genres: [], sort: undefined })}
              className="text-muted-foreground"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Active genre chips */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((g) => (
            <button
              key={g.id}
              onClick={() => toggleGenre(g.id)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {g.name}
              <X className="size-3 opacity-60 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
