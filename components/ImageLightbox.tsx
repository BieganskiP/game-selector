"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface Screenshot {
  id: number;
  image: string;
}

interface ImageLightboxProps {
  images: Screenshot[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  gameName: string;
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  gameName,
}: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "z":
        case "Z":
          setIsZoomed(!isZoomed);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isZoomed]);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Zoom button */}
      <button
        onClick={toggleZoom}
        className="absolute top-4 left-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
      >
        {isZoomed ? (
          <ZoomOut className="w-6 h-6" />
        ) : (
          <ZoomIn className="w-6 h-6" />
        )}
      </button>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 bg-black/50 text-white rounded-full text-sm">
          {activeIndex + 1} / {images.length}
        </div>
      )}

      {/* Main image */}
      <div
        className={`relative w-full h-full flex items-center justify-center p-4 cursor-pointer ${
          isZoomed ? "overflow-auto" : ""
        }`}
        onClick={(e) => {
          // Only close if clicking the background, not the image
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          className={`relative transition-transform duration-300 ${
            isZoomed
              ? "scale-150 cursor-move"
              : "max-w-full max-h-full cursor-zoom-in"
          }`}
          onClick={isZoomed ? undefined : toggleZoom}
        >
          <Image
            src={images[activeIndex].image}
            alt={`${gameName} screenshot ${activeIndex + 1}`}
            width={1920}
            height={1080}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex gap-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm max-w-[90vw] overflow-x-auto">
            {images.map((screenshot, index) => (
              <button
                key={screenshot.id}
                onClick={() => {
                  setActiveIndex(index);
                  setIsZoomed(false);
                }}
                className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden transition-all ${
                  index === activeIndex
                    ? "ring-2 ring-blue-400 opacity-100"
                    : "opacity-60 hover:opacity-80"
                }`}
              >
                <Image
                  src={screenshot.image}
                  alt={`${gameName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-16 left-4 z-10 text-white/70 text-sm space-y-1">
        <div>Press ESC to close</div>
        {images.length > 1 && <div>Use ← → to navigate</div>}
        <div>Press Z to zoom</div>
      </div>
    </div>
  );
}
