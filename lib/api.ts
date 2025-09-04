import axios from "axios";
import {
  GameResponse,
  GameSearchParams,
  Game,
  PlatformInfo,
} from "@/types/game";

const BASE_URL = "https://api.rawg.io/api";
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

// Check if API key is available
export const isAPIKeyAvailable = () => {
  return Boolean(
    API_KEY && API_KEY.trim() !== "" && API_KEY !== "your_api_key_here"
  );
};

if (!isAPIKeyAvailable()) {
  console.warn(
    "🎮 RAWG API key is missing! Please add NEXT_PUBLIC_RAWG_API_KEY to your .env.local file.\n" +
      "Get your free API key at: https://rawg.io/apidocs"
  );
}

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  if (!isAPIKeyAvailable()) {
    throw new Error(
      "RAWG API key is not configured. Please add NEXT_PUBLIC_RAWG_API_KEY to your .env.local file."
    );
  }
  return config;
});

export const gameApi = {
  // Search games with filters
  searchGames: async (params: GameSearchParams = {}): Promise<GameResponse> => {
    const response = await api.get("/games", {
      params: {
        page_size: 20,
        ...params,
      },
    });
    return response.data;
  },

  // Get game details by ID
  getGameById: async (id: number): Promise<Game> => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  // Get popular games
  getPopularGames: async (page = 1): Promise<GameResponse> => {
    const response = await api.get("/games", {
      params: {
        ordering: "-rating",
        page_size: 20,
        page,
      },
    });
    return response.data;
  },

  // Get trending games
  getTrendingGames: async (page = 1): Promise<GameResponse> => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateString = thirtyDaysAgo.toISOString().split("T")[0];

    const response = await api.get("/games", {
      params: {
        dates: `${dateString},${new Date().toISOString().split("T")[0]}`,
        ordering: "-added",
        page_size: 20,
        page,
      },
    });
    return response.data;
  },

  // Get games by genre
  getGamesByGenre: async (genreId: number, page = 1): Promise<GameResponse> => {
    const response = await api.get("/games", {
      params: {
        genres: genreId,
        page_size: 20,
        page,
      },
    });
    return response.data;
  },

  // Get genres list
  getGenres: async (): Promise<{
    results: Array<{
      id: number;
      name: string;
      slug: string;
      games_count: number;
    }>;
  }> => {
    const response = await api.get("/genres", {
      params: {
        page_size: 20,
      },
    });
    return response.data;
  },

  // Get detailed game information
  getGameDetails: async (id: number): Promise<Game> => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  // Get game screenshots
  getGameScreenshots: async (id: number) => {
    const response = await api.get(`/games/${id}/screenshots`);
    return response.data;
  },

  // Get all platforms
  getPlatforms: async (): Promise<{ results: PlatformInfo[] }> => {
    const response = await api.get("/platforms", {
      params: {
        page_size: 50,
      },
    });
    return response.data;
  },

  // Get games by platform
  getGamesByPlatform: async (
    platformId: number,
    page = 1
  ): Promise<GameResponse> => {
    const response = await api.get("/games", {
      params: {
        platforms: platformId,
        page_size: 20,
        page,
        ordering: "-rating",
      },
    });
    return response.data;
  },
};
