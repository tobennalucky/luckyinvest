import { tickerColors, type TickerColor } from "@/lib/mockData";

const palette: TickerColor[] = [
  { bg: "#e8469a", fg: "#ffffff" },
  { bg: "#a855f7", fg: "#ffffff" },
  { bg: "#38bdf8", fg: "#0a0a0a" },
  { bg: "#34d399", fg: "#0a0a0a" },
  { bg: "#f59e0b", fg: "#0a0a0a" },
  { bg: "#f87171", fg: "#0a0a0a" },
];

export function getTickerColor(ticker: string): TickerColor {
  if (tickerColors[ticker]) return tickerColors[ticker];

  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash = (hash * 31 + ticker.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}
