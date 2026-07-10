import type { Video } from '@/types/tmdb';

/** First YouTube trailer/teaser, else any YouTube video. */
export function pickTrailer(videos?: Video[]): Video | undefined {
  const list = videos ?? [];
  return (
    list.find(
      (v) =>
        v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
    ) ?? list.find((v) => v.site === 'YouTube')
  );
}
