"use client";

import { useState, useEffect } from "react";
import {
  useSearchGames,
  usePopularGames,
  useTrendingGames,
  usePlatforms,
  useGamesByPlatform,
  useInfinitePopularGames,
  useInfiniteTrendingGames,
  useInfiniteGamesByPlatform,
  useInfiniteGames,
} from "@/hooks/useGames";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { isAPIKeyAvailable } from "@/lib/api";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import SearchBar from "./SearchBar";
import { Loader2, Gamepad2, AlertTriangle, ExternalLink } from "lucide-react";

type ViewMode = "popular" | "trending" | "search" | "platform";

export default function GamesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("popular");
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);

  // Regular queries for fallback
  const popularGames = usePopularGames();
  const trendingGames = useTrendingGames();
  const platformsData = usePlatforms();
  const searchResults = useSearchGames({
    search: searchQuery,
    page_size: 20,
  });
  const platformGames = useGamesByPlatform(selectedPlatform || 0);

  // Infinite scroll queries
  const infinitePopular = useInfinitePopularGames();
  const infiniteTrending = useInfiniteTrendingGames();
  const infinitePlatform = useInfiniteGamesByPlatform(selectedPlatform || 0);
  const infiniteSearch = useInfiniteGames({
    search: searchQuery,
    page_size: 20,
  });

  useEffect(() => {
    if (searchQuery.trim()) {
      setViewMode("search");
    } else {
      setViewMode("popular");
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getCurrentInfiniteData = () => {
    switch (viewMode) {
      case "trending":
        return infiniteTrending;
      case "search":
        return infiniteSearch;
      case "platform":
        return infinitePlatform;
      default:
        return infinitePopular;
    }
  };

  const currentInfiniteData = getCurrentInfiniteData();
  const games =
    currentInfiniteData.data?.pages.flatMap((page) => page.results) || [];
  const isLoading = currentInfiniteData.isLoading;
  const error = currentInfiniteData.error;
  const hasNextPage = currentInfiniteData.hasNextPage;
  const isFetchingNextPage = currentInfiniteData.isFetchingNextPage;
  const fetchNextPage = currentInfiniteData.fetchNextPage;

  const getTitle = () => {
    switch (viewMode) {
      case "trending":
        return "Trending Games";
      case "search":
        return `Search Results for "${searchQuery}"`;
      case "platform":
        const platform = platformsData.data?.results.find(
          (p) => p.id === selectedPlatform
        );
        return `${platform?.name || "Platform"} Games`;
      default:
        return "Popular Games";
    }
  };

  const handlePlatformSelect = (platformId: number) => {
    setSelectedPlatform(platformId);
    setViewMode("platform");
    setSearchQuery("");
  };

  // Infinite scroll setup
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    fetchNextPage,
    rootMargin: "200px", // Start loading 200px before the element is visible
  });

  // Check if API key is missing
  if (!isAPIKeyAvailable()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            API Key Required
          </h2>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            To display games, you need to add your RAWG API key to the
            environment variables.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-3">
              Setup Instructions:
            </h3>
            <ol className="text-left text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                  1
                </span>
                <span>
                  Create a{" "}
                  <code className="bg-gray-700 px-2 py-1 rounded text-blue-300">
                    .env.local
                  </code>{" "}
                  file in your project root
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                  2
                </span>
                <span>Get a free API key from RAWG.io</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                  3
                </span>
                <span>
                  Add:{" "}
                  <code className="bg-gray-700 px-2 py-1 rounded text-green-300">
                    NEXT_PUBLIC_RAWG_API_KEY=your_key_here
                  </code>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                  4
                </span>
                <span>Restart the development server</span>
              </li>
            </ol>
          </div>
          <a
            href="https://rawg.io/apidocs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Get Free API Key
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} className="max-w-2xl" />
      </div>

      <div className="flex flex-col gap-6 mb-6">
        {/* Main Navigation */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              setViewMode("popular");
              setSearchQuery("");
              setSelectedPlatform(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "popular" && !searchQuery
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => {
              setViewMode("trending");
              setSearchQuery("");
              setSelectedPlatform(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "trending" && !searchQuery
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Trending
          </button>
        </div>

        {/* Platform Filter */}
        {platformsData.data && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Filter by Platform
            </h3>
            <div className="flex flex-wrap gap-2">
              {platformsData.data.results.slice(0, 10).map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformSelect(platform.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                    viewMode === "platform" && selectedPlatform === platform.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-white">{getTitle()}</h2>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
          Error loading games:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-12">
          <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">
            {searchQuery
              ? "No games found for your search."
              : "No games available."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <GameCard key={`${game.id}-${index}`} game={game} />
            ))}
          </div>

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="py-8">
            {isFetchingNextPage && (
              <>
                <div className="flex items-center justify-center mb-6">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  <span className="ml-2 text-gray-300">
                    Loading more games...
                  </span>
                </div>
                {/* Show skeleton cards while loading more */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <GameCardSkeleton key={`skeleton-${index}`} />
                  ))}
                </div>
              </>
            )}
            {!hasNextPage && games.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  🎮 You've reached the end! That's all the games we have.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Found {games.length} games total
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
