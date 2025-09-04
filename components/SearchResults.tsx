"use client";

import { useSearchGames } from "@/hooks/useGames";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import { ArrowLeft, Gamepad2 } from "lucide-react";

interface SearchResultsProps {
  query: string;
  onBack: () => void;
}

export default function SearchResults({ query, onBack }: SearchResultsProps) {
  const { data, isLoading, error } = useSearchGames({
    search: query,
    page_size: 20,
  });

  const games = data?.results || [];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors "
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Search Results</h1>
            <p className="text-gray-300">Results for &quot;{query}&quot;</p>
          </div>
        </div>

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
              No games found for &quot;{query}&quot;. Try a different search
              term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
