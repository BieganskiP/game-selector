"use client";

import { useState } from "react";
import { useGameDetails, useGameScreenshots } from "@/hooks/useGames";
import { useGameStore } from "@/store/gameStore";
import Image from "next/image";
import Link from "next/link";
import ImageLightbox from "./ImageLightbox";
import {
  ArrowLeft,
  Heart,
  Star,
  Calendar,
  Monitor,
  ExternalLink,
  Users,
  Clock,
  Globe,
  Loader2,
  AlertCircle,
  Expand,
} from "lucide-react";

interface GameDetailsPageProps {
  gameId: number;
}

interface Screenshot {
  id: number;
  image: string;
}

export default function GameDetailsPage({ gameId }: GameDetailsPageProps) {
  const { data: game, isLoading, error } = useGameDetails(gameId);
  const { data: screenshotsData } = useGameScreenshots(gameId);
  const { addGame, removeGame, isGameSaved } = useGameStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <span className="text-gray-300 text-lg">Loading game details...</span>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Game Not Found</h2>
          <p className="text-gray-300 mb-6">
            Sorry, we couldn&apos;t find the game you&apos;re looking for.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  const saved = isGameSaved(game.id);
  const screenshots = screenshotsData?.results || [];

  const handleToggleWishlist = () => {
    if (saved) {
      removeGame(game.id);
    } else {
      addGame(game);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString();
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <Monitor className="w-32 h-32 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-900/80 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </Link>
        </div>

        {/* Game Title & Actions */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 line-clamp-2">
                {game.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-200">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">
                    {game.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-400">
                    ({game.ratings_count.toLocaleString()} ratings)
                  </span>
                </div>
                {game.metacritic && (
                  <div
                    className={`px-3 py-1 rounded font-bold ${
                      game.metacritic >= 75
                        ? "bg-green-600 text-white"
                        : game.metacritic >= 50
                        ? "bg-yellow-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {game.metacritic}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleToggleWishlist}
              className={`ml-4 p-3 rounded-full transition-all transform hover:scale-105 ${
                saved
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }`}
            >
              <Heart className={`w-6 h-6 ${saved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Game Info */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Game Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Release Date</div>
                  <div className="text-white flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(game.released)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Playtime</div>
                  <div className="text-white flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {game.playtime}h
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Rating</div>
                  <div className="text-white flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {game.esrb_rating?.name || "Not Rated"}
                  </div>
                </div>
                {game.website && (
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Website</div>
                    <a
                      href={game.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Globe className="w-4 h-4" />
                      Visit
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {game.description_raw && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                <div
                  className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: game.description_raw }}
                />
              </div>
            )}

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Screenshots
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {screenshots
                    .slice(0, 6)
                    .map((screenshot: Screenshot, index: number) => (
                      <button
                        key={screenshot.id}
                        onClick={() => openLightbox(index)}
                        className="relative h-48 rounded-lg overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <Image
                          src={screenshot.image}
                          alt={`${game.name} screenshot ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Overlay with expand icon */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 p-2 rounded-full">
                            <Expand className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
                {screenshots.length > 6 && (
                  <div className="text-center mt-4">
                    <p className="text-gray-400 text-sm">
                      Showing 6 of {screenshots.length} screenshots
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Genres */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-blue-900 text-blue-200 text-sm rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Platforms</h3>
              <div className="space-y-2">
                {game.platforms.map((platform) => (
                  <div
                    key={platform.platform.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg"
                  >
                    <Monitor className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      {platform.platform.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {game.tags.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {game.tags.slice(0, 10).map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Links</h3>
              <div className="space-y-2">
                {game.website && (
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Official Website
                  </a>
                )}
                {game.metacritic_url && (
                  <a
                    href={game.metacritic_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Metacritic
                  </a>
                )}
                {game.reddit_url && (
                  <a
                    href={game.reddit_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Reddit Community
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {screenshots.length > 0 && (
        <ImageLightbox
          images={screenshots}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          gameName={game.name}
        />
      )}
    </div>
  );
}
