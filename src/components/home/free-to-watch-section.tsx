import * as React from 'react';

import { SegmentedControl } from '@/components/ui/segmented-control';
import { SectionHeader } from '@/components/media/section-header';
import { PosterRow, PosterRowSkeleton } from '@/components/media/poster-row';
import { useFreeToWatch } from '@/hooks/use-tmdb';

const MEDIA_OPTIONS = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV' },
] as const;

export function FreeToWatchSection() {
  const [media, setMedia] = React.useState<'movie' | 'tv'>('movie');
  const { data, isPending } = useFreeToWatch(media);

  return (
    <section>
      <SectionHeader
        eyebrow="No subscription needed"
        title="Free to Watch"
        action={
          <SegmentedControl
            options={MEDIA_OPTIONS}
            value={media}
            onChange={setMedia}
            label="Media type"
          />
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
