"use server";

import { createClient } from "@/lib/supabase/server";

const INCREASE_THRESHOLD = 10;

export type NotificationRow = {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
};

export async function getNotifications(): Promise<NotificationRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, message, created_at, read")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load notifications: ${error.message}`);
  return data ?? [];
}

export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("read", false);

  if (error) return 0;
  return count ?? 0;
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  await supabase.from("notifications").update({ read: true }).eq("read", false);
}

/**
 * Checks the user's current total portfolio value against the value they
 * were last notified about, and records a new notification for every full
 * $10 increase past that point. Called opportunistically whenever the
 * dashboard renders (see (app)/page.tsx) — there's no background job, so
 * this only fires while the app is actually being used.
 */
export async function checkPortfolioNotification(currentTotal: number): Promise<void> {
  if (!Number.isFinite(currentTotal) || currentTotal <= 0) return;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getClaims();
  const userId = userData?.claims?.sub;
  if (!userId) return;

  const { data: baseline } = await supabase
    .from("portfolio_baseline")
    .select("last_value")
    .maybeSingle();

  if (!baseline) {
    // First time we've seen this user's portfolio — establish the starting
    // point silently, don't notify on an arbitrary "increase from zero".
    await supabase.from("portfolio_baseline").insert({ user_id: userId, last_value: currentTotal });
    return;
  }

  const delta = currentTotal - baseline.last_value;
  if (delta < INCREASE_THRESHOLD) return;

  await supabase.from("notifications").insert({
    user_id: userId,
    message: `Your portfolio is up $${delta.toFixed(2)}, now worth $${currentTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
  });

  await supabase
    .from("portfolio_baseline")
    .update({ last_value: currentTotal, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
}
