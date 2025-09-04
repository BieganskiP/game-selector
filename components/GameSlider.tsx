"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Game } from "@/types/game";
import GameCard from "./GameCard";

interface GameSliderProps {
  title: string;
  games: Game[];
  isLoading?: boolean;
}

export default function GameSlider({
  title,
  games,
  isLoading,
}: GameSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -800,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 800,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 px-6">{title}</h2>
        <div className="flex gap-4 px-6 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="min-w-[300px] h-80 bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!games.length) return null;

  return (
    <div
      className="mb-12 relative"
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    >
      <h2 className="text-2xl font-bold text-white mb-4 px-6">{title}</h2>

      <div className="relative slider-container group">
        {/* Left scroll button */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right scroll button */}
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrollable games container */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {games.map((game, index) => (
            <div
              key={`${game.id}-${index}`}
              className="min-w-[300px] flex-shrink-0"
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
