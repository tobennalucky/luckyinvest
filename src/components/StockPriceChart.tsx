"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { PricePoint } from "@/lib/alphavantage";

type TooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ value?: number | string }>;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const value = Number(payload[0].value);

  return (
    <div className="rounded-2xl border border-border-strong bg-panel-2 px-4 py-3 shadow-2xl">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-base font-semibold">${value.toFixed(2)}</p>
    </div>
  );
}

function formatDateTick(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function StockPriceChart({ data }: { data: PricePoint[] }) {
  if (data.length === 0) {
    return (
      <div className="panel flex h-64 items-center justify-center rounded-3xl p-6 text-sm text-muted">
        Historical chart unavailable right now.
      </div>
    );
  }

  return (
    <div className="panel rounded-3xl p-6">
      <p className="text-sm text-muted">Last {data.length} trading days</p>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="stockPriceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 6" stroke="rgba(255,255,255,0.12)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateTick}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              minTickGap={40}
              dy={10}
            />
            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              tickFormatter={(v) => `$${v}`}
              width={55}
            />
            <Tooltip
              content={CustomTooltip as unknown as (props: unknown) => React.ReactNode}
              cursor={{ stroke: "var(--color-accent)", strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="var(--color-accent)"
              strokeWidth={2.5}
              fill="url(#stockPriceFill)"
              isAnimationActive={false}
              activeDot={{ r: 5, fill: "var(--color-accent)", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
