"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateDisplayName(formData: FormData) {
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!displayName) {
    redirect("/settings?error=Display name can't be empty");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ data: { display_name: displayName } });

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/settings?saved=name");
}

export async function updateEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    redirect("/settings?error=Email can't be empty");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/settings?saved=email");
}

export async function updatePassword(formData: FormData) {
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!newPassword) {
    redirect("/settings?error=Enter a new password");
  }
  if (newPassword.length < 6) {
    redirect("/settings?error=New password must be at least 6 characters");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/settings?saved=password");
}
