"use client";

import { useState } from "react";
import Link from "next/link";
import { getTickerColor } from "@/lib/tickerColor";
import { TickerBadge } from "@/components/dashboard/TickerBadge";

const filters = ["Most Viewed", "Gain", "Lose"] as const;

export type WatchlistRow = {
  ticker: string;
  name: string;
  exchange: string;
  price: number;
  changePercent: number;
};

export function WatchlistCard({ items: rows }: { items: WatchlistRow[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Most Viewed");

  const items =
    filter === "Gain"
      ? [...rows].sort((a, b) => b.changePercent - a.changePercent)
      : filter === "Lose"
      ? [...rows].sort((a, b) => a.changePercent - b.changePercent)
      : rows;

  return (
    <div className="panel flex h-full flex-col rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">Watchlist</p>
      </div>

      <div className="mt-4 flex items-center gap-1 rounded-full border border-border bg-white/5 p-1 text-xs">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 rounded-full px-3 py-1.5 font-medium transition-colors cursor-pointer ${
              filter === f
                ? "bg-gradient-to-r from-accent to-accent-2 text-white"
                : "text-muted hover:text-text"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {items.length === 0 && (
          <p className="py-4 text-center text-sm text-muted">
            No stocks yet —{" "}
            <Link href="/search" className="text-accent hover:underline">
              search the market
            </Link>{" "}
            to add one.
          </p>
        )}
        {items.map((item) => (
          <Link
            key={item.ticker}
            href={`/stock/${item.ticker}`}
            className="flex items-center justify-between rounded-xl px-1 py-1 transition-colors hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-3">
              <TickerBadge ticker={item.ticker} colors={getTickerColor(item.ticker)} />
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted">{item.exchange}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className={item.changePercent >= 0 ? "text-xs text-positive" : "text-xs text-negative"}>
                {item.changePercent >= 0 ? "+" : ""}
                {item.changePercent.toFixed(2)}%
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
