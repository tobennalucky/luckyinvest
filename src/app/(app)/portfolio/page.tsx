import { getQuotes } from "@/lib/finnhub";
import { getTickerColor } from "@/lib/tickerColor";
import { TickerBadge } from "@/components/dashboard/TickerBadge";
import { AddHoldingForm } from "@/components/AddHoldingForm";
import { RemoveHoldingButton } from "@/components/RemoveHoldingButton";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getHoldings } from "@/lib/portfolio";
import { holdingsSeed } from "@/lib/mockData";

export default async function PortfolioPage() {
  const configured = isSupabaseConfigured();

  const holdings = configured
    ? await getHoldings()
    : holdingsSeed.map((h) => ({ ticker: h.ticker, units: h.units, cost_basis: null, purchase_date: null }));

  const quotes = holdings.length ? await getQuotes(holdings.map((h) => h.ticker)) : {};

  const rows = holdings.map((h) => {
    const q = quotes[h.ticker];
    const price = q?.c ?? 0;
    const marketValue = price * h.units;
    const costTotal = h.cost_basis != null ? h.cost_basis * h.units : null;
    const gain = costTotal != null ? marketValue - costTotal : null;
    const gainPercent = costTotal ? (gain! / costTotal) * 100 : null;
    return { ...h, price, marketValue, gain, gainPercent };
  });

  const totalValue = rows.reduce((sum, r) => sum + r.marketValue, 0);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
      <p className="mt-1 text-sm text-muted">
        Total market value: ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </p>

      {!configured && (
        <p className="mt-4 rounded-xl border border-border-strong bg-white/5 px-4 py-3 text-sm text-muted">
          Showing sample holdings — connect Supabase to persist your real portfolio.
        </p>
      )}

      {configured && (
        <div className="mt-6">
          <AddHoldingForm />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2">
        {rows.length === 0 && (
          <p className="text-sm text-muted">No holdings yet — add one above.</p>
        )}

        {rows.map((r) => (
          <div key={r.ticker} className="panel flex items-center justify-between rounded-2xl px-5 py-4">
            <div className="flex items-center gap-3">
              <TickerBadge ticker={r.ticker} colors={getTickerColor(r.ticker)} />
              <div>
                <p className="text-sm font-medium">{r.ticker}</p>
                <p className="text-xs text-muted">
                  {r.units} units {r.cost_basis != null ? `· cost $${r.cost_basis.toFixed(2)}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-medium">
                  ${r.marketValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted">${r.price.toFixed(2)} / share</p>
              </div>

              <div className="w-24 text-right">
                {r.gain != null ? (
                  <p className={`text-sm font-medium ${r.gain >= 0 ? "text-positive" : "text-negative"}`}>
                    {r.gain >= 0 ? "+" : ""}
                    {r.gain.toFixed(2)} ({r.gainPercent!.toFixed(1)}%)
                  </p>
                ) : (
                  <p className="text-xs text-muted">—</p>
                )}
              </div>

              {configured && <RemoveHoldingButton ticker={r.ticker} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
