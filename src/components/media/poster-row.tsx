import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { PosterCard } from '@/components/media/poster-card';
import type { MediaItem, MediaType } from '@/types/tmdb';

const ITEM_BASIS =
  'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6';

export function PosterRowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className={`shrink-0 grow-0 ${ITEM_BASIS} min-w-0`}>
          <Skeleton className="aspect-2/3 w-full rounded-xl" />
          <Skeleton className="mt-2.5 h-4 w-4/5" />
          <Skeleton className="mt-1.5 h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

/** Horizontal, draggable carousel of poster cards. */
export function PosterRow({
  items,
  media,
}: {
  items: MediaItem[];
  media?: MediaType;
}) {
  return (
    <Carousel
      opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
      className="group/row"
    >
      <CarouselContent className="-ml-4">
        {items.map((item) => (
          <CarouselItem key={`${item.id}-${item.media_type ?? media}`} className={`pl-4 ${ITEM_BASIS}`}>
            <PosterCard item={item} media={media} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-1 opacity-0 transition-opacity group-hover/row:opacity-100 disabled:!opacity-0" />
      <CarouselNext className="right-1 opacity-0 transition-opacity group-hover/row:opacity-100 disabled:!opacity-0" />
    </Carousel>
  );
}
