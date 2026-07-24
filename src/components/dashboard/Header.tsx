import Link from "next/link";
import { Bell, Settings } from "lucide-react";
import { HeaderSearchBox } from "@/components/dashboard/HeaderSearchBox";

export function Header({
  email,
  displayName,
  hasUnreadNotifications = false,
}: {
  email: string;
  displayName?: string;
  hasUnreadNotifications?: boolean;
}) {
  const name = displayName || email.split("@")[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome, <span className="text-accent">{name}</span>
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here&apos;s your investment portfolio overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-panel text-muted hover:text-text transition-colors"
          >
            <Bell size={17} />
            {hasUnreadNotifications && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
            )}
          </Link>
          <Link
            href="/settings"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-panel text-muted hover:text-text transition-colors"
          >
            <Settings size={17} />
          </Link>
          <div className="flex items-center gap-3 rounded-full border border-border bg-panel py-1 pl-1 pr-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-xs font-semibold text-white">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <p className="hidden text-sm font-medium sm:block">{email}</p>
          </div>
        </div>
      </div>

      <HeaderSearchBox />
    </div>
  );
}
