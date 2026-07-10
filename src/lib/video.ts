import type { Video } from '@/types/tmdb';

/** Prefer YouTube trailer, then teaser, then any YouTube video. */
export function pickTrailer(videos?: Video[]): Video | undefined {
  const list = videos ?? [];

  return (
    list.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ??
    list.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ??
    list.find((v) => v.site === 'YouTube')
  );
}
