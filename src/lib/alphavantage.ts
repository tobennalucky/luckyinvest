const ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query";

export type PricePoint = {
  date: string;
  close: number;
};

export async function getDailyTimeSeries(symbol: string): Promise<PricePoint[]> {
  const apiKey = process.env.ALPHAVANTAGE_API_KEY;
  if (!apiKey) {
    throw new Error("ALPHAVANTAGE_API_KEY is not set in .env.local");
  }

  const res = await fetch(
    `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${apiKey}`,
    // Alpha Vantage's free tier caps at 25 requests/day — this is daily-granularity
    // data anyway, so cache aggressively to avoid burning the quota.
    { next: { revalidate: 21600 } },
  );

  if (!res.ok) {
    throw new Error(`Alpha Vantage request failed for ${symbol}: ${res.status}`);
  }

  const data = await res.json();
  const series = data["Time Series (Daily)"] as Record<string, { "4. close": string }> | undefined;

  if (!series) {
    // Rate-limited or invalid symbol — Alpha Vantage returns a "Note"/"Information"
    // field instead of the series in that case. Treat as no data rather than crash.
    return [];
  }

  return Object.entries(series)
    .map(([date, values]) => ({ date, close: Number(values["4. close"]) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
