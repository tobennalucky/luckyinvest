import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTickerColor } from "@/lib/tickerColor";
import { TickerBadge } from "@/components/dashboard/TickerBadge";

export type HoldingRow = {
  ticker: string;
  price: number;
  changeAbs: number;
  changePercent: number;
  units: number;
};

export function PortfolioCard({ holdings }: { holdings: HoldingRow[] }) {
  return (
    <div className="panel flex h-full flex-col rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">My Portfolio</p>
        <Link
          href="/portfolio"
          className="flex items-center gap-1 text-xs font-medium text-muted hover:text-text"
        >
          See all
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
        {holdings.length === 0 && (
          <p className="col-span-2 py-4 text-center text-sm text-muted">
            No holdings yet —{" "}
            <Link href="/portfolio" className="text-accent hover:underline">
              add one
            </Link>
            .
          </p>
        )}
        {holdings.map((h) => (
          <Link
            key={h.ticker}
            href={`/stock/${h.ticker}`}
            className="flex flex-col justify-between rounded-2xl border border-border bg-white/[0.03] p-3 transition-colors hover:border-border-strong"
          >
            <TickerBadge ticker={h.ticker} colors={getTickerColor(h.ticker)} size={28} />
            <div className="mt-3">
              <p className="text-sm font-semibold">
                ${h.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className={h.changePercent >= 0 ? "text-xs text-positive" : "text-xs text-negative"}>
                {h.changePercent >= 0 ? "+" : ""}
                {h.changeAbs.toFixed(2)} ({h.changePercent.toFixed(2)}%)
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>{h.ticker}</span>
                <span>
                  Units <span className="text-text">{h.units}</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
