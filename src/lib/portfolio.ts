"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PortfolioHolding = {
  ticker: string;
  units: number;
  cost_basis: number | null;
  purchase_date: string | null;
};

export async function getHoldings(): Promise<PortfolioHolding[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_holdings")
    .select("ticker, units, cost_basis, purchase_date")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load portfolio: ${error.message}`);
  return data ?? [];
}

export async function addHolding(formData: FormData) {
  const ticker = String(formData.get("ticker") ?? "").toUpperCase().trim();
  const units = Number(formData.get("units"));
  const costBasisRaw = formData.get("costBasis");
  const costBasis = costBasisRaw ? Number(costBasisRaw) : null;

  if (!ticker || !Number.isFinite(units) || units <= 0) {
    throw new Error("Enter a valid ticker and a positive number of units.");
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getClaims();
  const userId = userData?.claims?.sub;
  if (!userId) throw new Error("You must be logged in to update your portfolio.");

  const { error } = await supabase.from("portfolio_holdings").upsert(
    {
      user_id: userId,
      ticker,
      units,
      cost_basis: costBasis,
      purchase_date: new Date().toISOString().slice(0, 10),
    },
    { onConflict: "user_id,ticker" },
  );

  if (error) throw new Error(`Failed to save ${ticker}: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/portfolio");
}

export async function removeHolding(ticker: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_holdings").delete().eq("ticker", ticker.toUpperCase());

  if (error) throw new Error(`Failed to remove ${ticker}: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/portfolio");
}
