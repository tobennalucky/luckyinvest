"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";

export function WatchButton({
  ticker,
  initialWatched,
}: {
  ticker: string;
  initialWatched: boolean;
}) {
  const [watched, setWatched] = useState(initialWatched);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              if (watched) {
                await removeFromWatchlist(ticker);
                setWatched(false);
              } else {
                await addToWatchlist(ticker);
                setWatched(true);
              }
            } catch (e) {
              setError(e instanceof Error ? e.message : "Something went wrong.");
            }
          });
        }}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer disabled:opacity-60 ${
          watched
            ? "border border-border-strong bg-white/5 text-text hover:bg-white/10"
            : "bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg shadow-accent/20"
        }`}
      >
        <Star size={15} fill={watched ? "currentColor" : "none"} />
        {watched ? "Watching" : "Add to Watchlist"}
      </button>
      {error && <p className="text-xs text-negative">{error}</p>}
    </div>
  );
}
