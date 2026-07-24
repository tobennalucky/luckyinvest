const FINNHUB_BASE = "https://finnhub.io/api/v1";

function apiKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    throw new Error("FINNHUB_API_KEY is not set in .env.local");
  }
  return key;
}

function warnUnavailable(label: string, symbol: string, status: number) {
  console.warn(`Finnhub ${label} unavailable for ${symbol}: ${status}`);
}

export type Quote = {
  c: number; // current price
  d: number | null; // change (absolute)
  dp: number | null; // change (percent)
  h: number; // day high
  l: number; // day low
  o: number; // day open
  pc: number; // previous close
};

const EMPTY_QUOTE: Quote = { c: 0, d: null, dp: null, h: 0, l: 0, o: 0, pc: 0 };

// Never throws — a single restricted/unavailable ticker (e.g. non-US
// exchanges are blocked on Finnhub's free tier) shouldn't crash a page that's
// rendering several tickers via Promise.all. Callers treat c === 0 as "no
// data available" (see stock detail page's notFound() check).
export async function getQuote(symbol: string): Promise<Quote> {
  const res = await fetch(
    `${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey()}`,
    { next: { revalidate: 15 } },
  );

  if (!res.ok) {
    warnUnavailable("quote", symbol, res.status);
    return EMPTY_QUOTE;
  }

  return res.json();
}

export async function getQuotes(symbols: string[]): Promise<Record<string, Quote>> {
  const unique = Array.from(new Set(symbols));
  const results = await Promise.all(unique.map((symbol) => getQuote(symbol)));
  return Object.fromEntries(unique.map((symbol, i) => [symbol, results[i]]));
}

export type SearchResult = {
  symbol: string;
  displaySymbol: string;
  description: string;
  type: string;
};

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const res = await fetch(
    `${FINNHUB_BASE}/search?q=${encodeURIComponent(query)}&token=${apiKey()}`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) {
    warnUnavailable("search", query, res.status);
    return [];
  }

  const data = await res.json();
  return (data.result ?? []) as SearchResult[];
}

export type CompanyProfile = {
  ticker: string;
  name: string;
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  finnhubIndustry: string;
  logo: string;
  weburl: string;
};

const EMPTY_PROFILE: CompanyProfile = {
  ticker: "",
  name: "",
  country: "",
  currency: "",
  exchange: "",
  ipo: "",
  marketCapitalization: 0,
  finnhubIndustry: "",
  logo: "",
  weburl: "",
};

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile> {
  const res = await fetch(
    `${FINNHUB_BASE}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey()}`,
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) {
    warnUnavailable("profile", symbol, res.status);
    return EMPTY_PROFILE;
  }

  return res.json();
}

export type KeyMetrics = {
  "52WeekHigh"?: number;
  "52WeekLow"?: number;
  peBasicExclExtraTTM?: number;
  epsBasicExclExtraItemsTTM?: number;
  dividendYieldIndicatedAnnual?: number;
  beta?: number;
};

export async function getKeyMetrics(symbol: string): Promise<KeyMetrics> {
  const res = await fetch(
    `${FINNHUB_BASE}/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all&token=${apiKey()}`,
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) {
    warnUnavailable("metrics", symbol, res.status);
    return {};
  }

  const data = await res.json();
  return (data.metric ?? {}) as KeyMetrics;
}

export type NewsItem = {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number; // unix seconds
  category?: string;
  related?: string;
};

export async function getCompanyNews(symbol: string, days = 14): Promise<NewsItem[]> {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const res = await fetch(
    `${FINNHUB_BASE}/company-news?symbol=${encodeURIComponent(symbol)}&from=${fmt(from)}&to=${fmt(to)}&token=${apiKey()}`,
    { next: { revalidate: 300 } },
  );

  if (!res.ok) {
    warnUnavailable("company news", symbol, res.status);
    return [];
  }

  return res.json();
}

export async function getMarketNews(category: "general" | "merger" = "general"): Promise<NewsItem[]> {
  const res = await fetch(
    `${FINNHUB_BASE}/news?category=${category}&token=${apiKey()}`,
    { next: { revalidate: 300 } },
  );

  if (!res.ok) {
    warnUnavailable("market news", category, res.status);
    return [];
  }

  return res.json();
}
