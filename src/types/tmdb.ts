/** Shared TMDB response types (partial — covers what the UI consumes). */

export type MediaType = 'movie' | 'tv' | 'person';

export interface MediaItem {
  id: number;
  media_type?: MediaType;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  profile_path?: string | null;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  original_language?: string;
  popularity?: number;
  known_for_department?: string;
}

export interface Paginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideoResults {
  id: number;
  results: Video[];
}

export interface Genre {
  id: number;
  name: string;
}

export type TimeWindow = 'day' | 'week';
