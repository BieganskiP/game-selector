"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import SearchBar from "./SearchBar";
import { Gamepad2, Shuffle, Heart, List } from "lucide-react";

interface NavigationProps {
  onSearch?: (query: string) => void;
  pageTitle?: string;
}

export default function Navigation({ onSearch, pageTitle }: NavigationProps) {
  const pathname = usePathname();
  const { savedGames } = useGameStore();

  const navItems = [
    {
      href: "/",
      label: "Discover",
      icon: Gamepad2,
      active: pathname === "/",
    },
    {
      href: "/games",
      label: "All Games",
      icon: List,
      active: pathname === "/games",
    },
    {
      href: "/picker",
      label: "Random Picker",
      icon: Shuffle,
      active: pathname === "/picker",
      badge: savedGames.length > 0 ? savedGames.length : undefined,
    },
  ];

  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-40">
      <div className="mx-auto px-4">
        {/* Main navigation bar */}
        <div className="flex items-center justify-between h-16 gap-6">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-blue-400" />
            <span className="font-bold text-xl text-white">Game Selector</span>
          </div>

          {/* Search bar in header */}
          {onSearch && (
            <div className="flex-1 max-w-md">
              <SearchBar onSearch={onSearch} className="w-full" />
            </div>
          )}

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${
                    item.active
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Heart className="w-4 h-4" />
            <span>{savedGames.length} saved</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
