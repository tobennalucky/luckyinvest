"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const ranges = ["1M", "3M", "6M", "1Y"];

export function TotalHoldingCard({
  total,
  changePercent,
}: {
  total: number;
  changePercent: number;
}) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState("6M");

  return (
    <div className="panel rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Total Holding</p>
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 rounded-full border border-border-strong bg-white/5 px-3 py-1 text-xs font-medium text-text cursor-pointer"
          >
            {range}
            <ChevronDown size={13} />
          </button>
          {open && (
            <div className="absolute right-0 z-10 mt-2 w-20 overflow-hidden rounded-xl border border-border bg-panel-2 shadow-xl">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRange(r);
                    setOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-xs text-muted hover:bg-white/5 hover:text-text cursor-pointer"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">
        $ {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p className={changePercent >= 0 ? "mt-1 text-xs text-positive" : "mt-1 text-xs text-negative"}>
        {changePercent >= 0 ? "+" : ""}
        {changePercent.toFixed(2)}% today
      </p>
    </div>
  );
}
