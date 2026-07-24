"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function getCredentials(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    throw new Error("Email and password are required");
  }
  return { email, password };
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { email, password } = getCredentials(formData);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const { email, password } = getCredentials(formData);
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!displayName) {
    redirect("/signup?error=Enter a display name");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // If email confirmation is off, signUp() returns an active session right
  // away — go straight into the app instead of showing a "check your email"
  // screen for a step that already happened.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  redirect("/login?checkEmail=1");
}
