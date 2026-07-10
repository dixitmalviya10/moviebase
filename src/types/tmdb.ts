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

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
  order?: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job?: string;
  department?: string;
  profile_path?: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path?: string | null;
  origin_country?: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path?: string | null;
  origin_country?: string;
}

export interface Creator {
  id: number;
  credit_id?: string;
  name: string;
  profile_path?: string | null;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date?: string | null;
  overview?: string;
  poster_path?: string | null;
  vote_average?: number;
}

/** The trimmed episode object TMDB inlines as last/next_episode_to_air. */
export interface EpisodeBrief {
  id: number;
  name: string;
  overview?: string;
  air_date?: string | null;
  episode_number: number;
  season_number: number;
  /** 'standard' | 'finale' | 'mid_season' | … */
  episode_type?: string;
  runtime?: number | null;
  still_path?: string | null;
  vote_average?: number;
}

/** TV shows carry no top-level imdb_id — it arrives via append_to_response. */
export interface ExternalIds {
  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
}

/** Full movie detail response (with credits/videos/recommendations appended). */
export interface MovieDetails {
  id: number;
  title: string;
  original_title?: string;
  tagline?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  release_date?: string;
  runtime?: number | null;
  status?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: Genre[];
  homepage?: string | null;
  budget?: number;
  revenue?: number;
  original_language?: string;
  spoken_languages?: SpokenLanguage[];
  production_companies?: ProductionCompany[];
  imdb_id?: string | null;
  credits?: Credits;
  videos?: VideoResults;
  recommendations?: Paginated<MediaItem>;
  similar?: Paginated<MediaItem>;
}

/** Full TV detail response (with credits/videos/recommendations appended). */
export interface TvDetails {
  id: number;
  name: string;
  original_name?: string;
  tagline?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  first_air_date?: string;
  last_air_date?: string;
  /** Often empty, even for long-running shows — fall back to an episode runtime. */
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  in_production?: boolean;
  status?: string;
  type?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: Genre[];
  homepage?: string | null;
  original_language?: string;
  spoken_languages?: SpokenLanguage[];
  production_companies?: ProductionCompany[];
  networks?: Network[];
  created_by?: Creator[];
  seasons?: Season[];
  last_episode_to_air?: EpisodeBrief | null;
  next_episode_to_air?: EpisodeBrief | null;
  credits?: Credits;
  videos?: VideoResults;
  recommendations?: Paginated<MediaItem>;
  similar?: Paginated<MediaItem>;
  external_ids?: ExternalIds;
}
