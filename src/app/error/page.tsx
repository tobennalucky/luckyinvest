import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 text-center">
      <div>
        <p className="text-lg font-semibold">Sorry, something went wrong.</p>
        <p className="mt-1 text-sm text-muted">The link may have expired — try signing in again.</p>
        <Link href="/login" className="mt-4 inline-block text-sm text-accent hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
