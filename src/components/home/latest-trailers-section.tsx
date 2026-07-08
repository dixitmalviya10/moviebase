import * as React from 'react';
import { Play, Loader2, VideoOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { img } from '@/lib/config';
import { useMediaList, useVideos } from '@/hooks/use-tmdb';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SectionHeader } from '@/components/media/section-header';
import type { MediaItem } from '@/types/tmdb';

const TABS = [
  { value: 'movie/popular', label: 'Popular', media: 'movie' as const },
  { value: 'movie/now_playing', label: 'Streaming', media: 'movie' as const },
  { value: 'tv/on_the_air', label: 'On TV', media: 'tv' as const },
];

type Selected = {
  id: number;
  title: string;
  media: 'movie' | 'tv';
  language?: string;
};

function TrailerCard({
  item,
  onHover,
  onPlay,
}: {
  item: MediaItem;
  onHover: () => void;
  onPlay: () => void;
}) {
  const backdrop = img.backdrop(item.backdrop_path, 'w780');
  const title = item.title || item.name || 'Untitled';

  return (
    <button
      onMouseEnter={onHover}
      onClick={onPlay}
      className="group/trailer block w-full text-left"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-muted shadow-lg transition-all duration-300 group-hover/trailer:border-primary/40 group-hover/trailer:shadow-[0_12px_40px_-12px_var(--primary)]">
        {backdrop ? (
          <img
            loading="lazy"
            src={backdrop}
            alt={title}
            className="size-full object-cover transition-transform duration-500 group-hover/trailer:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <VideoOff className="size-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 transition-colors group-hover/trailer:bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 group-hover/trailer:scale-110 group-hover/trailer:border-primary group-hover/trailer:bg-primary group-hover/trailer:text-primary-foreground group-hover/trailer:shadow-[0_0_25px_-2px_var(--primary)]">
            <Play className="size-6 translate-x-0.5 fill-current" />
          </span>
        </div>
      </div>
      <h3 className="mt-2.5 truncate text-sm font-semibold transition-colors group-hover/trailer:text-primary">
        {title}
      </h3>
    </button>
  );
}

export function LatestTrailersSection() {
  const [tab, setTab] = React.useState(TABS[0]);
  const { data, isPending } = useMediaList(tab.value);
  const [bg, setBg] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<Selected | null>(null);

  const items = data?.results ?? [];
  const heroBackdrop =
    bg ?? img.backdrop(items[0]?.backdrop_path, 'w1280') ?? null;

  const { data: videos, isFetching: loadingVideo } = useVideos(
    selected?.media ?? 'movie',
    selected?.id ?? null,
    selected?.language,
  );

  const trailer = React.useMemo(() => {
    const list = videos?.results ?? [];
    return (
      list.find(
        (v) =>
          v.site === 'YouTube' &&
          (v.type === 'Trailer' || v.type === 'Teaser'),
      ) ?? list.find((v) => v.site === 'YouTube')
    );
  }, [videos]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10">
      {/* Reactive blurred backdrop */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="popLayout">
          {heroBackdrop && (
            <motion.img
              key={heroBackdrop}
              src={heroBackdrop}
              alt=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 size-full scale-110 object-cover blur-2xl"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="p-6 sm:p-8">
        <SectionHeader
          eyebrow="Fresh from the studios"
          title="Latest Trailers"
          action={
            <Tabs
              value={tab.value}
              onValueChange={(v) =>
                setTab(TABS.find((t) => t.value === v) ?? TABS[0])
              }
            >
              <TabsList>
                {TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          }
        />

        {isPending ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-0 shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="mt-2.5 h-4 w-3/5" />
              </div>
            ))}
          </div>
        ) : (
          <Carousel
            opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
            className="group/row"
          >
            <CarouselContent className="-ml-4">
              {items.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <TrailerCard
                    item={item}
                    onHover={() =>
                      setBg(img.backdrop(item.backdrop_path, 'w1280'))
                    }
                    onPlay={() =>
                      setSelected({
                        id: item.id,
                        title: item.title || item.name || 'Trailer',
                        media: tab.media,
                        language: item.original_language,
                      })
                    }
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 opacity-0 transition-opacity group-hover/row:opacity-100 disabled:!opacity-0" />
            <CarouselNext className="right-1 opacity-0 transition-opacity group-hover/row:opacity-100 disabled:!opacity-0" />
          </Carousel>
        )}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent className="max-w-3xl border-white/10 p-0 sm:max-w-4xl">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="pr-8">{selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <div
              className={cn(
                'relative aspect-video w-full overflow-hidden rounded-xl bg-black',
              )}
            >
              {loadingVideo ? (
                <div className="flex size-full items-center justify-center">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              ) : trailer ? (
                <iframe
                  className="size-full"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  title={selected?.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <VideoOff className="size-8" />
                  <p className="text-sm">No trailer available</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
