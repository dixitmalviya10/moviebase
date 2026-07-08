import * as React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeader } from '@/components/media/section-header';
import { PosterRow, PosterRowSkeleton } from '@/components/media/poster-row';
import { useTrending } from '@/hooks/use-tmdb';
import type { TimeWindow } from '@/types/tmdb';

export function TrendingSection() {
  const [window, setWindow] = React.useState<TimeWindow>('day');
  const { data, isPending } = useTrending(window);

  return (
    <section>
      <SectionHeader
        eyebrow="What everyone's watching"
        title="Trending"
        action={
          <Tabs
            value={window}
            onValueChange={(v) => setWindow(v as TimeWindow)}
          >
            <TabsList>
              <TabsTrigger value="day">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />
      {isPending ? (
        <PosterRowSkeleton />
      ) : (
        <PosterRow items={data?.results ?? []} />
      )}
    </section>
  );
}
