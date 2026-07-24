import { Header } from "@/components/dashboard/Header";
import { TotalHoldingCard } from "@/components/dashboard/TotalHoldingCard";
import { WatchlistCard } from "@/components/dashboard/WatchlistCard";
import { PortfolioCard } from "@/components/dashboard/PortfolioCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { getQuotes, getCompanyProfile } from "@/lib/finnhub";
import { watchlistSeed, holdingsSeed } from "@/lib/mockData";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getWatchlist } from "@/lib/watchlist";
import { getHoldings } from "@/lib/portfolio";
import { checkPortfolioNotification, getUnreadNotificationCount } from "@/lib/notifications";

async function getUser(): Promise<{ email: string; displayName?: string }> {
  if (!isSupabaseConfigured()) return { email: "you@luckyinvest.com" };
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return {
    email: data.user?.email ?? "you@luckyinvest.com",
    displayName: (data.user?.user_metadata?.display_name as string | undefined) || undefined,
  };
}

export default async function Home() {
  const configured = isSupabaseConfigured();
  const { email, displayName } = await getUser();

  const watchlistTickers = configured
    ? (await getWatchlist()).map((w) => w.ticker)
    : watchlistSeed.map((w) => w.ticker);

  const holdings = configured
    ? await getHoldings()
    : holdingsSeed.map((h) => ({ ticker: h.ticker, units: h.units, cost_basis: null, purchase_date: null }));

  const allTickers = [...watchlistTickers, ...holdings.map((h) => h.ticker)];
  const quotes = allTickers.length ? await getQuotes(allTickers) : {};

  const watchlistRows = configured
    ? await Promise.all(
        watchlistTickers.map(async (ticker) => {
          const profile = await getCompanyProfile(ticker).catch(() => null);
          const q = quotes[ticker];
          return {
            ticker,
            name: profile?.name || ticker,
            exchange: profile?.exchange || "",
            price: q?.c ?? 0,
            changePercent: q?.dp ?? 0,
          };
        }),
      )
    : watchlistSeed.map((w) => {
        const q = quotes[w.ticker];
        return { ...w, price: q.c, changePercent: q.dp ?? 0 };
      });

  const holdingRows = holdings.map((h) => {
    const q = quotes[h.ticker];
    return {
      ticker: h.ticker,
      units: h.units,
      price: q?.c ?? 0,
      changeAbs: q?.d ?? 0,
      changePercent: q?.dp ?? 0,
    };
  });

  const total = holdingRows.reduce((sum, h) => sum + h.price * h.units, 0);
  const totalChangeAbs = holdingRows.reduce((sum, h) => sum + h.changeAbs * h.units, 0);
  const totalChangePercent = total - totalChangeAbs !== 0 ? (totalChangeAbs / (total - totalChangeAbs)) * 100 : 0;

  let hasUnreadNotifications = false;
  if (configured) {
    await checkPortfolioNotification(total);
    hasUnreadNotifications = (await getUnreadNotificationCount()) > 0;
  }

  return (
    <>
      <Header email={email} displayName={displayName} hasUnreadNotifications={hasUnreadNotifications} />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TotalHoldingCard total={total} changePercent={totalChangePercent} />
        <WatchlistCard items={watchlistRows} />
        <PortfolioCard holdings={holdingRows} />
      </div>

      <div className="mt-4">
        <PerformanceChart />
      </div>
    </>
  );
}
