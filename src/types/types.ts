export interface CurrentSeasonData {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface Reviews {
  results: {
    id: string;
    author_details: { avatar_path: string; name: string; rating: number };
    content: string;
    created_at: string;
  }[];
}

export interface TVDataInterface {
  id: number;
  name: string;
  backdrop_path: string;
  budget: number;
  poster_path: string;
  release_date: string;
  content_ratings: {
    iso_3166_1: string;
    rating: string;
  };
  genres: { id: number; name: string }[];
  runtime: number;
  vote_average: number;
  tagline: string;
  overview: string;
  credits: { cast: []; crew: [] };
  created_by: { id: number; name: string }[];
  networks: { id: number; logo_path: string; name: string }[];
  'watch/providers': {
    results: {
      IN: {
        flatrate: { id: number; name: string; logo_path: string }[];
        link: string;
      };
    };
  };
  last_episode_to_air: {
    air_date: string;
    episode_number: number;
    episode_type: string;
    id: number;
    name: string;
    overview: string;
    runtime: number;
    season_number: number;
    still_path: string;
    vote_average: string;
    vote_count: number;
  };
  seasons: CurrentSeasonData[];
  number_of_seasons: number;
  reviews: Reviews;
  external_ids: {
    facebook_id: string;
    imdb_id: string;
    instagram_id: string;
    twitter_id: string;
  };
  homepage: string;
  status: string;
  original_language: string;
  revenue: number;
  keywords: { results: { name: string; id: number | null }[] };
  type: string;
}

export interface TrailerInfoInterface {
  title: string;
  url: string;
}
