import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function StockNotFound() {
  return (
    <div className="max-w-md">
      <Link href="/search" className="flex items-center gap-1 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} />
        Back to search
      </Link>

      <div className="panel mt-6 rounded-3xl p-8 text-center">
        <p className="text-base font-semibold">No pricing data for this ticker</p>
        <p className="mt-2 text-sm text-muted">
          This is likely a non-US listing — our data provider&apos;s free tier only covers
          US exchanges. Try searching for a US-listed ticker instead.
        </p>
      </div>
    </div>
  );
}
