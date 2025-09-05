"use client";

import {
  usePopularGames,
  useTrendingGames,
  useGamesByGenre,
} from "@/hooks/useGames";
import { isAPIKeyAvailable } from "@/lib/api";
import GameSlider from "./GameSlider";
import SearchResults from "./SearchResults";
import Navigation from "./Navigation";
import { useState } from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";

export default function NetflixStyleHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const popularGames = usePopularGames();
  const trendingGames = useTrendingGames();

  // Get games for top genres
  const actionGames = useGamesByGenre(4); // Action
  const rpgGames = useGamesByGenre(5); // RPG
  const adventureGames = useGamesByGenre(3); // Adventure
  const shooterGames = useGamesByGenre(2); // Shooter
  const strategyGames = useGamesByGenre(10); // Strategy
  const racingGames = useGamesByGenre(1); // Racing

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.trim().length > 0);
  };

  const handleBackToDiscover = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  // Show search results if there's a query
  if (showSearchResults && searchQuery.trim()) {
    return <SearchResults query={searchQuery} onBack={handleBackToDiscover} />;
  }

  // Check if API key is missing
  if (!isAPIKeyAvailable()) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-900">
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
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation onSearch={handleSearch} pageTitle="Discover Games" />
      <div className="min-h-screen bg-gray-900">
        {/* Game Sliders */}
        <div className="py-8">
          {/* Trending Games */}
          <GameSlider
            title="🔥 Trending Now"
            games={trendingGames.data?.results || []}
            isLoading={trendingGames.isLoading}
          />

          {/* Popular Games */}
          <GameSlider
            title="⭐ Most Popular"
            games={popularGames.data?.results || []}
            isLoading={popularGames.isLoading}
          />

          {/* Action Games */}
          <GameSlider
            title="💥 Action Games"
            games={actionGames.data?.results || []}
            isLoading={actionGames.isLoading}
          />

          {/* RPG Games */}
          <GameSlider
            title="⚔️ Role Playing Games"
            games={rpgGames.data?.results || []}
            isLoading={rpgGames.isLoading}
          />

          {/* Adventure Games */}
          <GameSlider
            title="🗺️ Adventure Games"
            games={adventureGames.data?.results || []}
            isLoading={adventureGames.isLoading}
          />

          {/* Shooter Games */}
          <GameSlider
            title="🎯 Shooter Games"
            games={shooterGames.data?.results || []}
            isLoading={shooterGames.isLoading}
          />

          {/* Strategy Games */}
          <GameSlider
            title="🧠 Strategy Games"
            games={strategyGames.data?.results || []}
            isLoading={strategyGames.isLoading}
          />

          {/* Racing Games */}
          <GameSlider
            title="🏎️ Racing Games"
            games={racingGames.data?.results || []}
            isLoading={racingGames.isLoading}
          />
        </div>
      </div>
    </>
  );
}
