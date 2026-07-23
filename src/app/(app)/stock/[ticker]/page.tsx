import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getQuote, getCompanyProfile, getKeyMetrics, getCompanyNews } from "@/lib/finnhub";
import { getDailyTimeSeries } from "@/lib/alphavantage";
import { getTickerColor } from "@/lib/tickerColor";
import { TickerBadge } from "@/components/dashboard/TickerBadge";
import { WatchButton } from "@/components/WatchButton";
import { StockPriceChart } from "@/components/StockPriceChart";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isTickerWatched } from "@/lib/watchlist";

function formatMarketCap(millions: number | undefined): string {
  if (!millions) return "—";
  if (millions >= 1_000_000) return `$${(millions / 1_000_000).toFixed(2)}T`;
  if (millions >= 1_000) return `$${(millions / 1_000).toFixed(2)}B`;
  return `$${millions.toFixed(0)}M`;
}

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker: rawTicker } = await params;
  const ticker = rawTicker.toUpperCase();

  const configured = isSupabaseConfigured();

  const [quote, profile, metrics, news, watched, priceHistory] = await Promise.all([
    getQuote(ticker),
    getCompanyProfile(ticker),
    getKeyMetrics(ticker),
    getCompanyNews(ticker),
    configured ? isTickerWatched(ticker) : Promise.resolve(false),
    getDailyTimeSeries(ticker).catch(() => []),
  ]);

  if (!quote || quote.c === 0) {
    notFound();
  }

  const isUp = (quote.dp ?? 0) >= 0;
  const changeColor = isUp ? "text-positive" : "text-negative";

  const stats = [
    { label: "Market Cap", value: formatMarketCap(profile.marketCapitalization) },
    { label: "P/E (TTM)", value: metrics.peBasicExclExtraTTM?.toFixed(2) ?? "—" },
    { label: "EPS (TTM)", value: metrics.epsBasicExclExtraItemsTTM?.toFixed(2) ?? "—" },
    {
      label: "52-Week Range",
      value:
        metrics["52WeekLow"] && metrics["52WeekHigh"]
          ? `${metrics["52WeekLow"].toFixed(2)} - ${metrics["52WeekHigh"].toFixed(2)}`
          : "—",
    },
    { label: "Day Range", value: `${quote.l.toFixed(2)} - ${quote.h.toFixed(2)}` },
    { label: "Prev. Close", value: quote.pc.toFixed(2) },
    { label: "Open", value: quote.o.toFixed(2) },
    { label: "Beta", value: metrics.beta?.toFixed(2) ?? "—" },
  ];

  return (
    <div className="max-w-4xl">
      <Link href="/search" className="flex items-center gap-1 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} />
        Back to search
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <TickerBadge ticker={ticker} colors={getTickerColor(ticker)} size={48} />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{profile.name || ticker}</h1>
            <p className="text-sm text-muted">
              {ticker} · {profile.exchange || "—"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-semibold tracking-tight">${quote.c.toFixed(2)}</p>
          <p className={`text-sm font-medium ${changeColor}`}>
            {isUp ? "+" : ""}
            {quote.d?.toFixed(2)} ({isUp ? "+" : ""}
            {quote.dp?.toFixed(2)}%) today
          </p>
          {configured && (
            <div className="mt-3 flex justify-end">
              <WatchButton ticker={ticker} initialWatched={watched} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <StockPriceChart data={priceHistory} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="panel rounded-2xl p-4">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="mt-1 text-sm font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">News</h2>
        <div className="mt-3 flex flex-col gap-3">
          {news.length === 0 && <p className="text-sm text-muted">No recent news for {ticker}.</p>}
          {news.slice(0, 10).map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="panel flex items-center justify-between gap-4 rounded-2xl p-4 transition-colors hover:border-border-strong"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.headline}</p>
                <p className="mt-1 text-xs text-muted">
                  {item.source} · {formatDate(item.datetime)}
                </p>
              </div>
              <ExternalLink size={15} className="shrink-0 text-muted" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
