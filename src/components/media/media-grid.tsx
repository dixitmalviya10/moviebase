import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { PosterCard } from '@/components/media/poster-card';
import type { MediaItem, MediaType } from '@/types/tmdb';

/** Shared responsive tile grid — also used by the People page. */
export const MEDIA_GRID =
  'grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';

export function MediaGrid({
  items,
  media,
  className,
}: {
  items: MediaItem[];
  media?: MediaType;
  className?: string;
}) {
  return (
    <div className={cn(MEDIA_GRID, className)}>
      {items.map((item, i) => (
        <PosterCard key={`${item.id}-${i}`} item={item} media={media} />
      ))}
    </div>
  );
}

export function MediaGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className={MEDIA_GRID}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-2/3 w-full rounded-xl" />
          <Skeleton className="mt-2.5 h-4 w-4/5" />
          <Skeleton className="mt-1.5 h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}
