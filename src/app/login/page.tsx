import Link from "next/link";
import { login } from "@/lib/authActions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; checkEmail?: string }>;
}) {
  const { error, checkEmail } = await searchParams;

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <div className="panel w-full max-w-sm rounded-3xl p-8">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-sm font-bold text-white">
            L
          </div>
          <span className="text-[15px] font-semibold tracking-tight">LuckyInvest</span>
        </div>

        <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Log in to see your watchlist and portfolio.</p>

        {checkEmail && (
          <p className="mt-4 rounded-xl border border-positive/30 bg-positive/10 px-3 py-2 text-sm text-positive">
            Check your email to confirm your account, then log in below.
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-xl border border-negative/30 bg-negative/10 px-3 py-2 text-sm text-negative">
            {error}
          </p>
        )}

        <form className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-xs text-muted" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-border-strong"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs text-muted" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-border-strong"
              placeholder="••••••••"
            />
          </div>

          <button
            formAction={login}
            className="mt-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-transform hover:scale-[1.01] cursor-pointer"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
