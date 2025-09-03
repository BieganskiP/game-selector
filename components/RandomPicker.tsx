"use client";

import { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import { Game } from "@/types/game";
import Image from "next/image";
import Link from "next/link";
import { Shuffle, Gift, AlertCircle, Star, Trash2, List } from "lucide-react";

export default function RandomPicker() {
  const { savedGames, getRandomGame, removeGame } = useGameStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [spinningGames, setSpinningGames] = useState<Game[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showGamesList, setShowGamesList] = useState(false);
  const spinnerRef = useRef<HTMLDivElement>(null);

  // Create a pool of games for the spinning animation
  const createSpinningPool = (winningGame: Game) => {
    if (savedGames.length === 0) return [];

    const pool: Game[] = [];
    const totalItems = 50; // More items for a fuller reel
    const centerIndex = Math.floor(totalItems / 2); // Position for winning game

    // Fill the pool with random games
    for (let i = 0; i < totalItems; i++) {
      if (i === centerIndex) {
        // Place the winning game in the center
        pool.push(winningGame);
      } else {
        // Fill with random games from saved games
        const randomGame =
          savedGames[Math.floor(Math.random() * savedGames.length)];
        pool.push(randomGame);
      }
    }

    return pool;
  };

  const handleSpin = () => {
    if (savedGames.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    setSelectedGame(null);

    // Select the final game first
    const finalGame = getRandomGame();

    // Create pool with the winning game positioned correctly
    const pool = createSpinningPool(finalGame!);
    setSpinningGames(pool);

    // Start the animation
    setTimeout(() => {
      if (spinnerRef.current) {
        const containerWidth = spinnerRef.current.offsetWidth;
        const itemWidth = 200; // Width of each game item (including margin)
        const centerIndex = Math.floor(pool.length / 2);

        // Calculate position to center the winning game
        const finalPosition = -(
          centerIndex * itemWidth -
          containerWidth / 2 +
          itemWidth / 2
        );

        spinnerRef.current.style.transform = `translateX(${finalPosition}px)`;
      }
    }, 100);

    // Show result after animation
    setTimeout(() => {
      setSelectedGame(finalGame);
      setShowResult(true);
      setIsSpinning(false);
    }, 4000);
  };

  const resetPicker = () => {
    setSelectedGame(null);
    setShowResult(false);
    setSpinningGames([]);
    if (spinnerRef.current) {
      spinnerRef.current.style.transform = "translateX(0px)";
    }
  };

  useEffect(() => {
    resetPicker();
  }, []);

  if (savedGames.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            No Games in Your List
          </h2>
          <p className="text-gray-300 mb-6">
            Add some games to your wishlist first, then come back to pick a
            random game!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gift className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Random Game Picker</h1>
        </div>
        <p className="text-gray-300">
          Can&apos;t decide what to play? Let fate choose for you!
        </p>
        <p className="text-sm text-gray-400 mt-2">
          You have {savedGames.length} games in your list
        </p>
      </div>

      {/* Case Opening Container */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 rounded-xl p-8 mb-8 shadow-2xl">
        <div className="relative">
          {/* Spinning Reel */}
          <div className="overflow-hidden rounded-lg bg-black/20 border-2 border-yellow-400 relative">
            <div className="h-48 relative">
              {/* Center indicator line */}
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-yellow-400 z-10 transform -translate-x-0.5"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-400 rounded-full z-10 transform -translate-x-1/2 -translate-y-1/2"></div>

              {/* Game items */}
              <div
                ref={spinnerRef}
                className={`flex items-center h-full transition-transform duration-[4000ms] ease-out ${
                  isSpinning ? "animate-none" : ""
                }`}
                style={{ willChange: "transform" }}
              >
                {spinningGames.map((game, index) => (
                  <div
                    key={`${game.id}-${index}`}
                    className="flex-shrink-0 w-48 h-44 mx-1 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 relative group"
                  >
                    {game.background_image ? (
                      <Image
                        src={game.background_image}
                        alt={game.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        sizes="192px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Gift className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white text-sm font-semibold line-clamp-2">
                        {game.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400 text-xs">
                          {game.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                isSpinning
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              <Shuffle
                className={`w-6 h-6 ${isSpinning ? "animate-spin" : ""}`}
              />
              {isSpinning ? "Opening..." : "Open Case"}
            </button>
          </div>
        </div>
      </div>

      {/* Result Display */}
      {showResult && selectedGame && (
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border-4 border-yellow-400 animate-pulse">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              🎉 Your Game Has Been Chosen! 🎉
            </h2>

            <div className="max-w-md mx-auto bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-6">
              <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                {selectedGame.background_image ? (
                  <Image
                    src={selectedGame.background_image}
                    alt={selectedGame.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <Gift className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {selectedGame.name}
              </h3>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-300 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{selectedGame.rating.toFixed(1)}</span>
                </div>
                {selectedGame.metacritic && (
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      selectedGame.metacritic >= 75
                        ? "bg-green-900 text-green-200"
                        : selectedGame.metacritic >= 50
                        ? "bg-yellow-900 text-yellow-200"
                        : "bg-red-900 text-red-200"
                    }`}
                  >
                    {selectedGame.metacritic}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1 justify-center">
                {selectedGame.genres?.slice(0, 3).map((genre) => (
                  <span
                    key={genre.id}
                    className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={resetPicker}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Pick Another
              </button>
              <Link
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Games
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Saved Games Management */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">
              Your Saved Games
            </h3>
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {savedGames.length}
            </span>
          </div>
          <button
            onClick={() => setShowGamesList(!showGamesList)}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            {showGamesList ? "Hide List" : "Show List"}
          </button>
        </div>

        {showGamesList && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedGames.map((game) => (
              <div
                key={game.id}
                className="bg-gray-700 rounded-lg overflow-hidden group hover:bg-gray-600 transition-colors"
              >
                <div className="flex">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    {game.background_image ? (
                      <Image
                        src={game.background_image}
                        alt={game.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <Gift className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-3 flex justify-between items-center">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-white font-medium text-sm line-clamp-1 mb-1">
                        {game.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span>{game.rating.toFixed(1)}</span>
                        {game.metacritic && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                              game.metacritic >= 75
                                ? "bg-green-900 text-green-200"
                                : game.metacritic >= 50
                                ? "bg-yellow-900 text-yellow-200"
                                : "bg-red-900 text-red-200"
                            }`}
                          >
                            {game.metacritic}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeGame(game.id)}
                      className="ml-2 p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                      title="Remove from list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showGamesList && savedGames.length === 0 && (
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-300">No saved games yet</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-3 text-blue-400 hover:text-blue-300"
            >
              Browse games to add some
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
