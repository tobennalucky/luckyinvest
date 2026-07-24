"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { useLiveSearch } from "@/lib/useLiveSearch";
import { getTickerColor } from "@/lib/tickerColor";
import { TickerBadge } from "@/components/dashboard/TickerBadge";

export function HeaderSearchBox() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { results, loading } = useLiveSearch(query);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToStock(symbol: string) {
    setOpen(false);
    setQuery("");
    router.push(`/stock/${symbol}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="flex items-center gap-2 rounded-full border border-border bg-panel px-4 py-2.5">
        <SearchIcon size={16} className="text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search stocks..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border-strong bg-panel-2 shadow-2xl">
          {loading && <p className="px-4 py-3 text-sm text-muted">Searching…</p>}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted">No results for &quot;{query}&quot;.</p>
          )}
          {!loading &&
            results.slice(0, 8).map((r, i) => (
              <button
                key={`${r.symbol}-${i}`}
                onClick={() => goToStock(r.symbol)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5 cursor-pointer"
              >
                <TickerBadge ticker={r.symbol} colors={getTickerColor(r.symbol)} size={28} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.description}</p>
                  <p className="text-xs text-muted">{r.displaySymbol}</p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
