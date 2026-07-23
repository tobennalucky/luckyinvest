export type TickerColor = {
  bg: string;
  fg: string;
};

export const tickerColors: Record<string, TickerColor> = {
  SPOT: { bg: "#1DB954", fg: "#0a0a0a" },
  AMZN: { bg: "#FF9900", fg: "#0a0a0a" },
  MSFT: { bg: "#00A4EF", fg: "#ffffff" },
  NVDA: { bg: "#76B900", fg: "#0a0a0a" },
  AAPL: { bg: "#A2AAAD", fg: "#0a0a0a" },
};

// Seed metadata only — live price/change comes from Finnhub at request time
// (see src/lib/finnhub.ts and src/app/page.tsx).
export type WatchlistSeed = {
  ticker: string;
  name: string;
  exchange: string;
};

export const watchlistSeed: WatchlistSeed[] = [
  { ticker: "SPOT", name: "Spotify", exchange: "NYSE: SPOT" },
  { ticker: "AMZN", name: "Amazon", exchange: "NYSE: AMZN" },
  { ticker: "MSFT", name: "Microsoft", exchange: "NYSE: MSFT" },
  { ticker: "NVDA", name: "NVIDIA", exchange: "NYSE: NVDA" },
];

export type HoldingSeed = {
  ticker: string;
  units: number;
};

export const holdingsSeed: HoldingSeed[] = [
  { ticker: "AAPL", units: 104 },
  { ticker: "AMZN", units: 12 },
  { ticker: "MSFT", units: 41 },
  { ticker: "NVDA", units: 16 },
];

export type PerformancePoint = {
  month: string;
  value: number;
};

export const performanceData: PerformancePoint[] = [
  { month: "Jan", value: 92000 },
  { month: "Feb", value: 78000 },
  { month: "Mar", value: 88000 },
  { month: "Apr", value: 132000 },
  { month: "May", value: 148000 },
  { month: "Jun", value: 165000 },
  { month: "Jul", value: 118000 },
  { month: "Aug", value: 96000 },
  { month: "Sep", value: 132000 },
  { month: "Oct", value: 148000 },
  { month: "Nov", value: 108000 },
  { month: "Dec", value: 128000 },
];

export const timeRanges = ["1D", "1W", "1M", "6M", "1Y"] as const;
export type TimeRange = (typeof timeRanges)[number];
