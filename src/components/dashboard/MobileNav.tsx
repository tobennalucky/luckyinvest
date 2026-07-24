"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Briefcase, Store, Newspaper, Settings } from "lucide-react";

const items = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
  { label: "Market", href: "/search", icon: Store },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-panel/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map(({ label, href, icon: Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={label}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
              isActive ? "text-accent" : "text-muted"
            }`}
          >
            <Icon size={19} strokeWidth={2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
