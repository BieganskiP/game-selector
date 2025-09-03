export interface Game {
  id: number;
  name: string;
  slug: string;
  background_image: string | null;
  released: string | null;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number | null;
  playtime: number;
  platforms: Platform[];
  genres: Genre[];
  tags: Tag[];
  short_screenshots: Screenshot[];
  price?: number;
  added_to_wishlist?: boolean;
  // Additional fields for detailed view
  description_raw?: string;
  description?: string;
  website?: string;
  reddit_url?: string;
  reddit_name?: string;
  reddit_description?: string;
  reddit_logo?: string;
  reddit_count?: number;
  twitch_count?: number;
  youtube_count?: number;
  reviews_text_count?: number;
  suggestions_count?: number;
  alternative_names?: string[];
  metacritic_url?: string;
  parents_count?: number;
  additions_count?: number;
  game_series_count?: number;
  esrb_rating?: EsrbRating;
  screenshots?: Screenshot[];
}

export interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
}

export interface Screenshot {
  id: number;
  image: string;
}

export interface GameResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

export interface EsrbRating {
  id: number;
  name: string;
  slug: string;
}

export interface PlatformInfo {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background?: string;
}

export interface GameSearchParams {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
  genres?: string;
  platforms?: string;
  metacritic?: string;
}
