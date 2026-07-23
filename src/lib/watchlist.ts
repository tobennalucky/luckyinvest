"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type WatchlistEntry = {
  ticker: string;
  added_at: string;
};

export async function getWatchlist(): Promise<WatchlistEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlist")
    .select("ticker, added_at")
    .order("added_at", { ascending: false });

  if (error) throw new Error(`Failed to load watchlist: ${error.message}`);
  return data ?? [];
}

export async function isTickerWatched(ticker: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getClaims();
  if (!userData?.claims) return false;

  const { data, error } = await supabase
    .from("watchlist")
    .select("ticker")
    .eq("ticker", ticker)
    .maybeSingle();

  if (error) return false;
  return !!data;
}

export async function addToWatchlist(ticker: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getClaims();
  const userId = userData?.claims?.sub;
  if (!userId) throw new Error("You must be logged in to add to your watchlist.");

  const { error } = await supabase
    .from("watchlist")
    .upsert({ user_id: userId, ticker: ticker.toUpperCase() }, { onConflict: "user_id,ticker" });

  if (error) throw new Error(`Failed to add ${ticker} to watchlist: ${error.message}`);

  revalidatePath("/");
  revalidatePath(`/stock/${ticker}`);
  revalidatePath("/search");
}

export async function removeFromWatchlist(ticker: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("watchlist").delete().eq("ticker", ticker.toUpperCase());

  if (error) throw new Error(`Failed to remove ${ticker} from watchlist: ${error.message}`);

  revalidatePath("/");
  revalidatePath(`/stock/${ticker}`);
  revalidatePath("/search");
}
