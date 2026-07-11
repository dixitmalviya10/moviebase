import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import { Hero } from '@/components/home/hero';
import { TrendingSection } from '@/components/home/trending-section';
import { LatestTrailersSection } from '@/components/home/latest-trailers-section';
import { FreeToWatchSection } from '@/components/home/free-to-watch-section';
import { DEFAULT_TITLE, canonical, seo } from '@/lib/seo';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: seo({
      title: DEFAULT_TITLE,
      description:
        'Discover trending movies and TV shows, watch the latest trailers, and explore cast and crew. Browse popular, top-rated and upcoming titles on MovieBase.',
      path: '/',
      keywords: [
        'movies',
        'tv shows',
        'trending movies',
        'movie trailers',
        'top rated movies',
        'actors',
      ],
    }),
    links: canonical('/'),
  }),
  component: HomePage,
});

const sectionMotion = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

function HomePage() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-350 space-y-16 px-4 py-16 sm:px-6 sm:py-20">
        <motion.div {...sectionMotion}>
          <TrendingSection />
        </motion.div>
        <motion.div {...sectionMotion}>
          <LatestTrailersSection />
        </motion.div>
        <motion.div {...sectionMotion}>
          <FreeToWatchSection />
        </motion.div>
      </div>
    </>
  );
}
