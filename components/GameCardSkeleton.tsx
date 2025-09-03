"use client";

export default function GameCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 animate-pulse">
      <div className="relative h-48 w-full bg-gray-700" />

      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-700 rounded w-3/4" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-700 rounded" />
            <div className="h-4 bg-gray-700 rounded w-8" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-700 rounded" />
            <div className="h-4 bg-gray-700 rounded w-12" />
          </div>
          <div className="px-2 py-1 bg-gray-700 rounded w-8 h-5" />
        </div>

        <div className="flex flex-wrap gap-1">
          <div className="px-2 py-1 bg-gray-700 rounded-full w-16 h-6" />
          <div className="px-2 py-1 bg-gray-700 rounded-full w-20 h-6" />
          <div className="px-2 py-1 bg-gray-700 rounded-full w-12 h-6" />
        </div>

        <div className="flex flex-wrap gap-1">
          <div className="px-2 py-1 bg-gray-700 rounded w-14 h-5" />
          <div className="px-2 py-1 bg-gray-700 rounded w-16 h-5" />
          <div className="px-2 py-1 bg-gray-700 rounded w-12 h-5" />
        </div>
      </div>
    </div>
  );
}
