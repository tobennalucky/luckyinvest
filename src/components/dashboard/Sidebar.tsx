"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Briefcase,
  Newspaper,
  Store,
  Settings,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
  { label: "Market", href: "/search", icon: Store },
  { label: "News", href: "/news", icon: Newspaper },
];

const bottomItems = [{ label: "Settings", href: "/settings", icon: Settings }];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between px-5 py-6">
      <div>
        <Link href="/" className="flex items-center gap-2 px-2 mb-10">
          <Logo size={32} />
          <span className="text-[15px] font-semibold tracking-tight">
            <strong>LuckyInvest</strong>
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
        {bottomItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
              pathname.startsWith(href)
                ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg shadow-accent/20"
                : "text-muted hover:bg-white/5 hover:text-text"
            }`}
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </Link>
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
