"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Briefcase,
  Newspaper,
  Store,
  Settings,
  LifeBuoy,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
  { label: "Market", href: "/search", icon: Store },
  { label: "News", href: "/news", icon: Newspaper },
];

const bottomItems = [
  { label: "Settings", icon: Settings },
  { label: "Support", icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between px-5 py-6">
      <div>
        <Link href="/" className="flex items-center gap-2 px-2 mb-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-sm font-bold text-white">
            L
          </div>
          <span className="text-[15px] font-semibold tracking-tight">
            LuckyInvest
          </span>
        </Link>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg shadow-accent/20"
                    : "text-muted hover:bg-white/5 hover:text-text"
                }`}
              >
                <Icon size={17} strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <nav className="flex flex-col gap-1">
        {bottomItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-text cursor-pointer"
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </button>
        ))}
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-text cursor-pointer"
          >
            <LogOut size={17} strokeWidth={2} />
            Log out
          </button>
        </form>
      </nav>
    </aside>
  );
}
