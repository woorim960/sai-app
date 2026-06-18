"use client";

import { Heart } from "lucide-react";
import { toggleFavoriteDeck } from "@/lib/user-data";
import { useFavoriteDeck } from "@/lib/hooks/use-user-data";
import { cn } from "@/lib/utils";

type DeckFavoriteButtonProps = {
  deckId: string;
  className?: string;
  variant?: "default" | "ghost";
};

export function DeckFavoriteButton({
  deckId,
  className,
  variant = "default",
}: DeckFavoriteButtonProps) {
  const active = useFavoriteDeck(deckId);

  return (
    <button
      type="button"
      aria-label={active ? "좋아요 취소" : "좋아요"}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavoriteDeck(deckId);
      }}
      className={cn(
        "flex size-9 items-center justify-center rounded-full transition-all active:scale-95",
        variant === "default" &&
          "bg-white/80 shadow-[0_2px_8px_rgba(45,49,66,0.08)]",
        variant === "ghost" && "bg-transparent shadow-none",
        className
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-colors",
          active
            ? "fill-red-500 text-red-500"
            : "text-sai-text-secondary"
        )}
      />
    </button>
  );
}
