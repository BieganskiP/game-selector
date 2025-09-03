import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { gameApi, isAPIKeyAvailable } from "@/lib/api";
import { GameSearchParams } from "@/types/game";

export const useSearchGames = (params: GameSearchParams) => {
  return useQuery({
    queryKey: ["games", "search", params],
    queryFn: () => gameApi.searchGames(params),
    enabled: Boolean(
      params.search && params.search.length > 0 && isAPIKeyAvailable()
    ),
  });
};

export const usePopularGames = (page = 1) => {
  return useQuery({
    queryKey: ["games", "popular", page],
    queryFn: () => gameApi.getPopularGames(page),
    enabled: isAPIKeyAvailable(),
  });
};

export const useTrendingGames = (page = 1) => {
  return useQuery({
    queryKey: ["games", "trending", page],
    queryFn: () => gameApi.getTrendingGames(page),
    enabled: isAPIKeyAvailable(),
  });
};

// Infinite scroll hooks
export const useInfinitePopularGames = () => {
  return useInfiniteQuery({
    queryKey: ["games", "infinite", "popular"],
    queryFn: ({ pageParam = 1 }) => gameApi.getPopularGames(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: isAPIKeyAvailable(),
  });
};

export const useInfiniteTrendingGames = () => {
  return useInfiniteQuery({
    queryKey: ["games", "infinite", "trending"],
    queryFn: ({ pageParam = 1 }) => gameApi.getTrendingGames(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: isAPIKeyAvailable(),
  });
};

export const useInfiniteGamesByPlatform = (platformId: number) => {
  return useInfiniteQuery({
    queryKey: ["games", "infinite", "platform", platformId],
    queryFn: ({ pageParam = 1 }) =>
      gameApi.getGamesByPlatform(platformId, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: Boolean(platformId && isAPIKeyAvailable()),
  });
};

export const useGameById = (id: number) => {
  return useQuery({
    queryKey: ["games", "detail", id],
    queryFn: () => gameApi.getGameById(id),
    enabled: Boolean(id && isAPIKeyAvailable()),
  });
};

export const useGamesByGenre = (genreId: number, page = 1) => {
  return useQuery({
    queryKey: ["games", "genre", genreId, page],
    queryFn: () => gameApi.getGamesByGenre(genreId, page),
    enabled: Boolean(genreId && isAPIKeyAvailable()),
  });
};

// Infinite query for pagination
export const useInfiniteGames = (params: GameSearchParams) => {
  return useInfiniteQuery({
    queryKey: ["games", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      gameApi.searchGames({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: isAPIKeyAvailable(),
  });
};

// Game details query
export const useGameDetails = (id: number) => {
  return useQuery({
    queryKey: ["games", "details", id],
    queryFn: () => gameApi.getGameDetails(id),
    enabled: Boolean(id && isAPIKeyAvailable()),
  });
};

// Game screenshots query
export const useGameScreenshots = (id: number) => {
  return useQuery({
    queryKey: ["games", "screenshots", id],
    queryFn: () => gameApi.getGameScreenshots(id),
    enabled: Boolean(id && isAPIKeyAvailable()),
  });
};

// Platforms query
export const usePlatforms = () => {
  return useQuery({
    queryKey: ["platforms"],
    queryFn: () => gameApi.getPlatforms(),
    enabled: isAPIKeyAvailable(),
  });
};

// Games by platform query
export const useGamesByPlatform = (platformId: number, page = 1) => {
  return useQuery({
    queryKey: ["games", "platform", platformId, page],
    queryFn: () => gameApi.getGamesByPlatform(platformId, page),
    enabled: Boolean(platformId && isAPIKeyAvailable()),
  });
};
