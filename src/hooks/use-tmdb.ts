import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
  queryOptions,
} from '@tanstack/react-query';

import { tmdbGet } from '@/lib/tmdb';
import {
  buildMovieDiscoverParams,
  type MovieFilterState,
} from '@/lib/movie-filters';
import { buildTvDiscoverParams, type TvFilterState } from '@/lib/tv-filters';
import {
  personListRequest,
  type PersonFilterState,
} from '@/lib/person-filters';
import type {
  Genre,
  MediaItem,
  MovieDetails,
  Paginated,
  PersonDetails,
  PersonItem,
  TimeWindow,
  TvDetails,
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

/**
 * Detail-query factories.
 *
 * These are shared by the route `loader` (via `queryClient.ensureQueryData`, so
 * the route's `head()` has real data to build meta tags from) and by the hooks
 * below. Both sides resolve to the same cache entry, so the loader's fetch is
 * the only one — the component reads it straight from cache.
 */

/**
 * Full detail for a single movie, with credits, videos, and related titles
 * folded into one request via `append_to_response`.
 */
export function movieDetailsQuery(id: number) {
  return queryOptions({
    queryKey: ['movie', 'details', id],
    queryFn: () =>
      tmdbGet<MovieDetails>(`/movie/${id}`, {
        append_to_response: 'credits,videos,recommendations,similar',
      }),
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Full detail for a single TV show. `external_ids` is appended because — unlike
 * movies — TV responses carry no top-level `imdb_id`.
 */
export function tvDetailsQuery(id: number) {
  return queryOptions({
    queryKey: ['tv', 'details', id],
    queryFn: () =>
      tmdbGet<TvDetails>(`/tv/${id}`, {
        append_to_response:
          'credits,videos,recommendations,similar,external_ids',
      }),
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Full detail for a single person. `combined_credits` merges their movie and TV
 * work into one list (each entry carries its own `media_type`).
 */
export function personDetailsQuery(id: number) {
  return queryOptions({
    queryKey: ['person', 'details', id],
    queryFn: () =>
      tmdbGet<PersonDetails>(`/person/${id}`, {
        append_to_response: 'combined_credits,external_ids',
      }),
    staleTime: 1000 * 60 * 30,
  });
}

export function useMovieDetails(id: number | null) {
  return useQuery({
    ...movieDetailsQuery(id as number),
    enabled: id != null && !Number.isNaN(id),
  });
}

export function useTvDetails(id: number | null) {
  return useQuery({
    ...tvDetailsQuery(id as number),
    enabled: id != null && !Number.isNaN(id),
  });
}

export function usePersonDetails(id: number | null) {
  return useQuery({
    ...personDetailsQuery(id as number),
    enabled: id != null && !Number.isNaN(id),
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

/** TV genre list (for filter chips). Cached indefinitely. */
export function useTvGenres() {
  return useQuery({
    queryKey: ['genres', 'tv'],
    queryFn: () => tmdbGet<{ genres: Genre[] }>('/genre/tv/list'),
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

/** Infinite, filterable discovery feed for the TV Shows page. */
export function useInfiniteTvShows(state: TvFilterState) {
  return useInfiniteQuery({
    queryKey: ['discover', 'tv', state],
    queryFn: ({ pageParam }) =>
      tmdbGet<Paginated<MediaItem>>('/discover/tv', {
        ...buildTvDiscoverParams(state),
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

/**
 * Infinite people feed for the People page. There is no `/discover/person`, so
 * the category preset (or an active name query) selects the endpoint outright.
 * Previous results are kept while a new query resolves, so typing in the search
 * box doesn't flash the grid back to a skeleton.
 */
export function useInfinitePeople(state: PersonFilterState) {
  const { url, params } = personListRequest(state);
  return useInfiniteQuery({
    queryKey: ['people', state],
    queryFn: ({ pageParam }) =>
      tmdbGet<Paginated<PersonItem>>(url, { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < Math.min(last.total_pages, 500) ? last.page + 1 : undefined,
    placeholderData: keepPreviousData,
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
