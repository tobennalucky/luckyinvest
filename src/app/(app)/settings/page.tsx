import { createClient } from "@/lib/supabase/server";
import { updateDisplayName, updateEmail, updatePassword } from "@/lib/settingsActions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? "";
  const displayName = (data.user?.user_metadata?.display_name as string | undefined) ?? "";

  const savedMessage =
    saved === "name"
      ? "Display name updated."
      : saved === "email"
      ? "Email updated. Check your inbox if confirmation is required."
      : saved === "password"
      ? "Password updated."
      : null;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted">Manage your account details.</p>

      {savedMessage && (
        <p className="mt-4 rounded-xl border border-positive/30 bg-positive/10 px-3 py-2 text-sm text-positive">
          {savedMessage}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl border border-negative/30 bg-negative/10 px-3 py-2 text-sm text-negative">
          {error}
        </p>
      )}

      <form className="panel mt-6 flex flex-col gap-3 rounded-2xl p-6">
        <h2 className="text-sm font-semibold">Display name</h2>
        <p className="text-xs text-muted">The name LuckyInvest calls you on your dashboard.</p>
        <input
          name="displayName"
          defaultValue={displayName}
          placeholder="e.g. Alex"
          className="rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-border-strong"
        />
        <button
          formAction={updateDisplayName}
          className="mt-1 w-fit rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-accent/20 cursor-pointer"
        >
          Save name
        </button>
      </form>

      <form className="panel mt-4 flex flex-col gap-3 rounded-2xl p-6">
        <h2 className="text-sm font-semibold">Email</h2>
        <p className="text-xs text-muted">Used to log in to LuckyInvest.</p>
        <input
          name="email"
          type="email"
          defaultValue={email}
          className="rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-border-strong"
        />
        <button
          formAction={updateEmail}
          className="mt-1 w-fit rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-accent/20 cursor-pointer"
        >
          Save email
        </button>
      </form>

      <form className="panel mt-4 flex flex-col gap-3 rounded-2xl p-6">
        <h2 className="text-sm font-semibold">Password</h2>
        <p className="text-xs text-muted">Choose a new password for your account.</p>
        <input
          name="newPassword"
          type="password"
          placeholder="At least 6 characters"
          minLength={6}
          className="rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-border-strong"
        />
        <button
          formAction={updatePassword}
          className="mt-1 w-fit rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-accent/20 cursor-pointer"
        >
          Save password
        </button>
      </form>
    </div>
  );
}
