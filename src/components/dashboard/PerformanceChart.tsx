"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { performanceData, timeRanges, type TimeRange } from "@/lib/mockData";

type CustomTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ value?: number | string }>;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const value = Number(payload[0].value);

  return (
    <div className="rounded-2xl border border-border-strong bg-panel-2 px-4 py-3 shadow-2xl">
      <p className="text-xs text-muted">1st {label} 2025</p>
      <div className="mt-1 flex items-center gap-2">
        <p className="text-base font-semibold">
          $ {value.toLocaleString()}
        </p>
        <span className="rounded-full bg-positive/15 px-2 py-0.5 text-[11px] font-medium text-positive">
          +3%
        </span>
      </div>
    </div>
  );
}

export function PerformanceChart() {
  const [range, setRange] = useState<TimeRange>("1Y");

  return (
    <div className="panel rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">Portfolio Performance</p>
        <div className="flex items-center gap-1 rounded-full border border-border bg-white/5 p-1 text-xs">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                range === r
                  ? "bg-gradient-to-r from-accent to-accent-2 text-white"
                  : "text-muted hover:text-text"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="performanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 6" stroke="rgba(255,255,255,0.12)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            {/* recharts v3's Tooltip content prop type is awkward to satisfy exactly; cast is safe since we only read active/payload/label */}
            <Tooltip
              content={CustomTooltip as unknown as (props: unknown) => React.ReactNode}
              cursor={{ stroke: "var(--color-accent)", strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-accent)"
              strokeWidth={2.5}
              fill="url(#performanceFill)"
              isAnimationActive={false}
              activeDot={{ r: 5, fill: "var(--color-accent)", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
