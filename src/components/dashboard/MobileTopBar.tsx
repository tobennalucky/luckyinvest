import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";

export function MobileTopBar() {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <Logo size={28} />
        <span className="text-sm font-semibold tracking-tight">
          <strong>LuckyInvest</strong>
        </span>
      </Link>

      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-text cursor-pointer"
          aria-label="Log out"
        >
          <LogOut size={16} />
        </button>
      </form>
    </div>
  );
}
