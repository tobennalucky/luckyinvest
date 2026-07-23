import { Bell, Settings } from "lucide-react";

export function Header({ email }: { email: string }) {
  const displayName = email.split("@")[0];

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, <span className="text-accent">{displayName}</span>
        </h1>
        <p className="mt-1 text-sm text-muted">
          Here&apos;s your investment portfolio overview
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-panel text-muted hover:text-text transition-colors cursor-pointer">
          <Bell size={17} />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-panel text-muted hover:text-text transition-colors cursor-pointer">
          <Settings size={17} />
        </button>
        <div className="flex items-center gap-3 rounded-full border border-border bg-panel py-1 pl-1 pr-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-xs font-semibold text-white">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
          <p className="text-sm font-medium">{email}</p>
        </div>
      </div>
    </div>
  );
}
