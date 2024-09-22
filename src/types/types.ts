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

export interface MovieDataInterface {
  id: number;
  title: string;
  backdrop_path: string;
  budget: number;
  poster_path: string;
  release_date: string;
  release_dates: {
    iso_3166_1: string;
    release_dates: {
      certification: string;
      iso_639_1: string;
      release_date: string;
    }[];
  };
  genres: { id: number; name: string }[];
  runtime: number;
  vote_average: number;
  tagline: string;
  overview: string;
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
      original_name: string;
    }[];
    crew: { id: number; name: string; job: string; department: string }[];
  };
  'watch/providers'?: {
    results: {
      IN: {
        flatrate: {
          provider_id: number;
          name: string;
          logo_path: string;
        }[];
        link: string;
      };
    };
  };
  reviews: {
    results: {
      id: string;
      author_details: { avatar_path: string; name: string; rating: number };
      content: string;
      created_at: string;
    }[];
  };
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
  keywords: { keywords: { name: string; id: number | null }[] };
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
        flatrate: { provider_id: number; name: string; logo_path: string }[];
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

export interface TrendingDataArray {
  readonly id: number;
  name: string;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string;
  first_air_date: string;
}

export interface TrendingData {
  results: TrendingDataArray[];
}

export interface MoviesInterface {
  results: TrendingDataArray[];
}
