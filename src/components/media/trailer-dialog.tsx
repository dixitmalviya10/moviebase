import { VideoOff } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Video } from '@/types/tmdb';

/** Modal YouTube player used by the movie and TV detail pages. */
export function TrailerDialog({
  open,
  onOpenChange,
  title,
  trailer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  trailer?: Video;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-white/10 p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="pr-8">{title} — Trailer</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
            {trailer ? (
              <iframe
                className="size-full"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={title}
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
  );
}
