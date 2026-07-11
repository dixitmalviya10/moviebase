import * as React from 'react';

import { SegmentedControl } from '@/components/ui/segmented-control';
import { SectionHeader } from '@/components/media/section-header';
import { PosterRow, PosterRowSkeleton } from '@/components/media/poster-row';
import { useTrending } from '@/hooks/use-tmdb';
import type { TimeWindow } from '@/types/tmdb';

const TIME_WINDOWS = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This Week' },
] as const satisfies readonly { value: TimeWindow; label: string }[];

export function TrendingSection() {
  const [window, setWindow] = React.useState<TimeWindow>('day');
  const { data, isPending } = useTrending(window);

  return (
    <section>
      <SectionHeader
        eyebrow="What everyone's watching"
        title="Trending"
        action={
          <SegmentedControl
            options={TIME_WINDOWS}
            value={window}
            onChange={setWindow}
            label="Time window"
          />
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
