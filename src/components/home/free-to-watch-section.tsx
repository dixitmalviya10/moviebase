import * as React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeader } from '@/components/media/section-header';
import { PosterRow, PosterRowSkeleton } from '@/components/media/poster-row';
import { useFreeToWatch } from '@/hooks/use-tmdb';

export function FreeToWatchSection() {
  const [media, setMedia] = React.useState<'movie' | 'tv'>('movie');
  const { data, isPending } = useFreeToWatch(media);

  return (
    <section>
      <SectionHeader
        eyebrow="No subscription needed"
        title="Free to Watch"
        action={
          <Tabs value={media} onValueChange={(v) => setMedia(v as 'movie' | 'tv')}>
            <TabsList>
              <TabsTrigger value="movie">Movies</TabsTrigger>
              <TabsTrigger value="tv">TV</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />
      {isPending ? (
        <PosterRowSkeleton />
      ) : (
        <PosterRow items={data?.results ?? []} media={media} />
      )}
    </section>
  );
}
