"use client";

import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types/game";
import { useGameStore } from "@/store/gameStore";
import { Heart, Star, Monitor, ExternalLink } from "lucide-react";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { addGame, removeGame, isGameSaved } = useGameStore();
  const saved = isGameSaved(game.id);

  const handleToggleWishlist = () => {
    if (saved) {
      removeGame(game.id);
    } else {
      addGame(game);
    }
  };

  return (
    <div className="relative rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-80 game-card">
      {/* Full card background image */}
      {game.background_image ? (
        <Image
          src={game.background_image}
          alt={game.name}
          fill
          className="object-cover card-image transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
          <Monitor className="w-16 h-16 text-gray-400" />
        </div>
      )}

      {/* Clickable overlay for navigation */}
      <Link
        href={`/game/${game.id}`}
        className="absolute inset-0 z-0 cursor-pointer"
      />

      {/* Rating pill in top left */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-white font-semibold text-sm">
            {game.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Heart button in top right */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 ${
          saved
            ? "bg-red-500 text-white hover:bg-red-600 hover:scale-110"
            : "bg-black/50 text-white hover:bg-red-500 hover:scale-110"
        }`}
      >
        <Heart className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
      </button>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 z-10 pointer-events-none">
        {/* Game title */}
        <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">
          {game.name}
        </h3>

        {/* Metacritic score */}
        {game.metacritic && (
          <div className="mb-2">
            <div
              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                game.metacritic >= 75
                  ? "bg-green-600 text-white"
                  : game.metacritic >= 50
                  ? "bg-yellow-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {game.metacritic}
            </div>
          </div>
        )}

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-2">
          {game.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre.id}
              className="px-2 py-1 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm"
            >
              {genre.name}
            </span>
          ))}
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap gap-1">
          {game.platforms?.slice(0, 3).map((platform) => (
            <span
              key={platform.platform.id}
              className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded backdrop-blur-sm"
            >
              {platform.platform.name}
            </span>
          ))}
        </div>
      </div>

      {/* Hover overlay with view details */}
      <div className="absolute inset-0 card-overlay transition-colors duration-300 flex items-center justify-center z-10 pointer-events-none">
        <div className="card-expand-icon opacity-0 transition-opacity duration-300 bg-white/20 backdrop-blur-sm p-3 rounded-full">
          <ExternalLink className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
