import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from '@tanstack/react-query';

import { tmdbGet } from '@/lib/tmdb';
import {
  buildMovieDiscoverParams,
  type MovieFilterState,
} from '@/lib/movie-filters';
import type {
  Genre,
  MediaItem,
  Paginated,
  TimeWindow,
  VideoResults,
} from '@/types/tmdb';

/** Trending movies + TV in a single window (day/week). */
export function useTrending(timeWindow: TimeWindow) {
  return useQuery({
    queryKey: ['trending', 'all', timeWindow],
    queryFn: () =>
      tmdbGet<Paginated<MediaItem>>(`/trending/all/${timeWindow}`),
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Latest-trailers feed. `endpoint` is one of the TMDB list paths, e.g.
 * `movie/popular`, `movie/now_playing`, `tv/on_the_air`.
 */
export function useMediaList(endpoint: string) {
  return useQuery({
    queryKey: ['media-list', endpoint],
    queryFn: () => tmdbGet<Paginated<MediaItem>>(`/${endpoint}`),
    staleTime: 1000 * 60 * 10,
  });
}

/** Free-to-watch discovery for movies or TV (region-scoped). */
export function useFreeToWatch(media: 'movie' | 'tv', region = 'IN') {
  return useQuery({
    queryKey: ['free-to-watch', media, region],
    queryFn: () =>
      tmdbGet<Paginated<MediaItem>>(`/discover/${media}`, {
        with_watch_monetization_types: 'free|ads',
        watch_region: region,
        sort_by: 'popularity.desc',
      }),
    staleTime: 1000 * 60 * 10,
  });
}

/** Videos (trailers/teasers) for a single title, fetched on demand. */
export function useVideos(
  media: 'movie' | 'tv',
  id: number | null,
  language?: string,
) {
  return useQuery({
    queryKey: ['videos', media, id, language],
    queryFn: () =>
      tmdbGet<VideoResults>(`/${media}/${id}/videos`, {
        include_video_language: language ? `${language},en,null` : undefined,
      }),
    enabled: id != null,
    staleTime: 1000 * 60 * 30,
  });
}

/** Movie genre list (for filter chips). Cached indefinitely. */
export function useMovieGenres() {
  return useQuery({
    queryKey: ['genres', 'movie'],
    queryFn: () => tmdbGet<{ genres: Genre[] }>('/genre/movie/list'),
    staleTime: Infinity,
    select: (data) => data.genres,
  });
}

/** Infinite, filterable discovery feed for the Movies page. */
export function useInfiniteMovies(state: MovieFilterState) {
  return useInfiniteQuery({
    queryKey: ['discover', 'movie', state],
    queryFn: ({ pageParam }) =>
      tmdbGet<Paginated<MediaItem>>('/discover/movie', {
        ...buildMovieDiscoverParams(state),
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < Math.min(last.total_pages, 500)
        ? last.page + 1
        : undefined,
    staleTime: 1000 * 60 * 5,
  });
}

/** Multi-search across movies, TV, and people. */
export function useMultiSearch(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: ['search', 'multi', q],
    queryFn: () =>
      tmdbGet<Paginated<MediaItem>>('/search/multi', {
        query: q,
        include_adult: false,
      }),
    enabled: q.length > 1,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}
