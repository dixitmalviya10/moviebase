import { Link } from '@tanstack/react-router';
import { Star, ImageOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import { img } from '@/lib/config';
import { getYear, formatRating } from '@/lib/format';
import type { MediaItem, MediaType } from '@/types/tmdb';

function resolveMedia(item: MediaItem, forced?: MediaType): MediaType {
  if (forced) return forced;
  if (item.media_type) return item.media_type;
  if (item.title || item.original_title) return 'movie';
  if (item.name && item.first_air_date !== undefined) return 'tv';
  return 'movie';
}

/** Poster tile with rating, title and year; links to the detail route. */
export function PosterCard({
  item,
  media,
  className,
}: {
  item: MediaItem;
  media?: MediaType;
  className?: string;
}) {
  const type = resolveMedia(item, media);
  const title = item.title || item.name || 'Untitled';
  const poster = img.poster(item.poster_path);
  const year = getYear(item.release_date || item.first_air_date);
  const rating = item.vote_average ?? 0;

  const inner = (
    <div className="group/card relative">
      <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-white/10 bg-muted shadow-md transition-all duration-300 group-hover/card:-translate-y-1 group-hover/card:border-primary/40 group-hover/card:shadow-[0_12px_40px_-12px_var(--primary)]">
        {poster ? (
          <img
            loading="lazy"
            src={poster}
            alt={title}
            className="size-full object-cover transition-transform duration-500 group-hover/card:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-8" />
            <span className="px-3 text-center text-xs">{title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

        {rating > 0 && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2 py-0.5 text-xs font-semibold text-gold-soft backdrop-blur-sm">
            <Star className="size-3 fill-gold text-gold" />
            {formatRating(rating)}
          </div>
        )}
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="truncate text-sm font-semibold leading-tight transition-colors group-hover/card:text-primary">
          {title}
        </h3>
        {year && <p className="mt-0.5 text-xs text-muted-foreground">{year}</p>}
      </div>
    </div>
  );

  const classes = cn('block focus:outline-none', className);

  if (type === 'movie') {
    return (
      <Link
        to="/movie/$movieId"
        params={{ movieId: String(item.id) }}
        className={classes}
      >
        {inner}
      </Link>
    );
  }
  if (type === 'tv') {
    return (
      <Link
        to="/tv/$tvId"
        params={{ tvId: String(item.id) }}
        className={classes}
      >
        {inner}
      </Link>
    );
  }
  return (
    <Link
      to="/person/$personId"
      params={{ personId: String(item.id) }}
      className={classes}
    >
      {inner}
    </Link>
  );
}
