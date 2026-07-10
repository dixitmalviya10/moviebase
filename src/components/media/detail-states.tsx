import { Link } from '@tanstack/react-router';
import { ArrowLeft, VideoOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/** Loading placeholder matching the detail-page hero layout. */
export function DetailSkeleton() {
  return (
    <div className="-mt-16">
      <div className="mx-auto max-w-350 px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
        <div className="flex flex-col gap-8 md:flex-row md:gap-10">
          <Skeleton className="mx-auto aspect-2/3 w-52 rounded-2xl sm:w-60 md:mx-0 md:w-72" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-2/5" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <Skeleton className="h-24 w-full max-w-3xl" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-11 w-36 rounded-lg" />
              <Skeleton className="h-11 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DetailErrorState({
  title,
  onRetry,
}: {
  title: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="glass flex size-16 items-center justify-center rounded-2xl border border-white/10">
        <VideoOff className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          It may not exist, or something went wrong reaching TMDB.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
        <Button asChild variant="glass">
          <Link to="/">
            <ArrowLeft /> Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
