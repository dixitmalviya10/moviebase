import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Projector, TrendingUp } from 'lucide-react';

import { img } from '@/lib/config';
import { useTrending } from '@/hooks/use-tmdb';
import { HeroSearch } from '@/components/home/hero-search';

export function Hero() {
  const { data } = useTrending('day');

  const backdrops = React.useMemo(
    () =>
      (data?.results ?? [])
        .filter((r) => r.backdrop_path)
        .slice(0, 6)
        .map((r) => ({
          id: r.id,
          url: img.backdrop(r.backdrop_path, 'original'),
          title: r.title || r.name,
        })),
    [data],
  );

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (backdrops.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % backdrops.length),
      6000,
    );
    return () => clearInterval(id);
  }, [backdrops.length]);

  const current = backdrops[index];

  return (
    <section className="relative -mt-16 flex min-h-[92vh] items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
        <AnimatePresence mode="popLayout">
          {current?.url && (
            <motion.img
              key={current.id}
              src={current.url}
              alt=""
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1.2 },
                scale: { duration: 7 },
              }}
              className="absolute inset-0 size-full object-cover"
            />
          )}
        </AnimatePresence>
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/40" />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_92%)]" />
      </div>

      <div className="mx-auto w-full max-w-350 px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 glass px-3 py-1.5 text-xs font-medium text-gold-soft">
            <Projector className="size-3.5" />
            Your gateway to cinema
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Discover your next
            <br />
            <span className="text-gradient-gold">favorite story</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Millions of movies, TV shows and people to explore. Search, browse
            trending titles, and watch the latest trailers — all in one place.
          </p>

          <div className="mt-8">
            <HeroSearch />
          </div>

          {current?.title && (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="size-4 text-primary" />
              Trending now:
              <span className="font-medium text-foreground">
                {current.title}
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Slide indicators */}
      {backdrops.length > 1 && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {backdrops.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-8 bg-primary'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
