"use client";

import { useState, useEffect, useCallback } from "react";

interface FavoriteButtonProps {
  itemId: string;
  itemLabel?: string;
  size?: "sm" | "md";
  onToggle?: (isFavorite: boolean) => void;
}

const STORAGE_KEY = "pitchdeck-favorites";

export function getFavorites(): Record<string, { label: string; addedAt: number }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getFavoritesCount(): number {
  return Object.keys(getFavorites()).length;
}

export default function FavoriteButton({ itemId, itemLabel, size = "md", onToggle }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const favs = getFavorites();
    setIsFavorite(!!favs[itemId]);
  }, [itemId]);

  const toggle = useCallback(() => {
    const favs = getFavorites();
    const newState = !isFavorite;

    if (newState) {
      favs[itemId] = { label: itemLabel || itemId, addedAt: Date.now() };
    } else {
      delete favs[itemId];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    setIsFavorite(newState);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);

    window.dispatchEvent(new CustomEvent("favorites-changed"));
    onToggle?.(newState);
  }, [isFavorite, itemId, itemLabel, onToggle]);

  const iconSize = size === "sm" ? 16 : 20;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      className={`group relative p-1.5 rounded-lg transition-all duration-200 hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
        animating ? "scale-125" : "scale-100"
      }`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={isFavorite ? 0 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-300 ${
          isFavorite
            ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]"
            : "text-neutral-500 group-hover:text-amber-400/60"
        }`}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
}
