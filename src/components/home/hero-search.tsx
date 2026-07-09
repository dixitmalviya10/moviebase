import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Loader2, Film, Tv, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { img } from '@/lib/config';
import { getYear } from '@/lib/format';
import { useDebounce } from '@/hooks/use-debounce';
import { useMultiSearch } from '@/hooks/use-tmdb';
import type { MediaItem, MediaType } from '@/types/tmdb';

const typeMeta: Record<MediaType, { icon: typeof Film; label: string }> = {
  movie: { icon: Film, label: 'Movie' },
  tv: { icon: Tv, label: 'TV' },
  person: { icon: User, label: 'Person' },
};

function itemType(item: MediaItem): MediaType {
  return (item.media_type as MediaType) ?? 'movie';
}

export function HeroSearch() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  function scrollActiveIntoView(index: number) {
    itemRefs.current[index]?.scrollIntoView({ block: 'nearest' });
  }

  const debounced = useDebounce(value, 350);
  const { data, isFetching } = useMultiSearch(debounced);

  const results = React.useMemo(
    () =>
      (data?.results ?? [])
        .filter(
          (r) =>
            (r.media_type === 'movie' ||
              r.media_type === 'tv' ||
              r.media_type === 'person') &&
            (r.title || r.name),
        )
        .slice(0, 7),
    [data],
  );

  // Keep the highlighted index in range as results change (no effect needed).
  const activeIndex = active < results.length ? active : 0;

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function go(item: MediaItem) {
    const type = itemType(item);
    setOpen(false);
    setValue('');
    if (type === 'movie')
      navigate({ to: '/movie/$movieId', params: { movieId: String(item.id) } });
    else if (type === 'tv')
      navigate({ to: '/tv/$tvId', params: { tvId: String(item.id) } });
    else
      navigate({
        to: '/person/$personId',
        params: { personId: String(item.id) },
      });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (activeIndex + 1) % results.length;
      setActive(next);
      scrollActiveIntoView(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (activeIndex - 1 + results.length) % results.length;
      setActive(next);
      scrollActiveIntoView(next);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground z-50" />
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search for a movie, TV show, or person…"
          className="glass h-14 w-full rounded-2xl border border-white/15 pl-12 pr-12 text-base shadow-xl outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
          aria-label="Search"
        />
        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">
          {isFetching && value ? (
            <Loader2 className="size-5 animate-spin text-primary" />
          ) : value ? (
            <button
              onClick={() => {
                setValue('');
                setOpen(false);
              }}
              aria-label="Clear search"
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              <X className="size-5" />
            </button>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {open && debounced.trim().length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="glass absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/15 shadow-2xl"
          >
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                {isFetching ? 'Searching…' : `No results for “${debounced}”`}
              </div>
            ) : (
              <ul className="max-h-88 overflow-y-auto p-2">
                {results.map((item, i) => {
                  const type = itemType(item);
                  const Meta = typeMeta[type];
                  const thumb =
                    type === 'person'
                      ? img.profile(item.profile_path)
                      : img.poster(item.poster_path, 'w342');
                  const year = getYear(
                    item.release_date || item.first_air_date,
                  );
                  return (
                    <li
                      key={`${type}-${item.id}`}
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                    >
                      <button
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(item)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors cursor-pointer',
                          activeIndex === i
                            ? 'bg-primary/15'
                            : 'hover:bg-white/5',
                        )}
                      >
                        <div className="h-16 w-11 shrink-0 overflow-hidden rounded-md bg-muted">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-muted-foreground">
                              <Meta.icon className="size-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">
                            {item.title || item.name}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Meta.icon className="size-3" />
                            {Meta.label}
                            {year && <span>· {year}</span>}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
