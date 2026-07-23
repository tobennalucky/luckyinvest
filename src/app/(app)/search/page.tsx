import Link from "next/link";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { searchSymbols } from "@/lib/finnhub";
import { getTickerColor } from "@/lib/tickerColor";
import { TickerBadge } from "@/components/dashboard/TickerBadge";
import { WatchButton } from "@/components/WatchButton";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getWatchlist } from "@/lib/watchlist";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q.trim() ? await searchSymbols(q) : [];

  const configured = isSupabaseConfigured();
  const watchedTickers = configured
    ? new Set((await getWatchlist()).map((w) => w.ticker))
    : new Set<string>();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Market</h1>
      <p className="mt-1 text-sm text-muted">
        Search any ticker or company name to view live pricing, stats, and news.
      </p>

      <form action="/search" className="mt-6 flex items-center gap-2 rounded-full border border-border bg-panel px-4 py-3">
        <SearchIcon size={17} className="text-muted" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search for a stock, e.g. Apple or AAPL"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          autoFocus
        />
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {q.trim() && results.length === 0 && (
          <p className="text-sm text-muted">No results for &quot;{q}&quot;.</p>
        )}

        {results.map((r) => (
          <div
            key={r.symbol}
            className="panel flex items-center justify-between rounded-2xl px-5 py-4"
          >
            <Link href={`/stock/${r.symbol}`} className="flex min-w-0 flex-1 items-center gap-3">
              <TickerBadge ticker={r.symbol} colors={getTickerColor(r.symbol)} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{r.description}</p>
                <p className="text-xs text-muted">
                  {r.displaySymbol} · {r.type}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {configured && (
                <WatchButton ticker={r.symbol} initialWatched={watchedTickers.has(r.symbol.toUpperCase())} />
              )}
              <Link href={`/stock/${r.symbol}`}>
                <ArrowRight size={16} className="text-muted" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
