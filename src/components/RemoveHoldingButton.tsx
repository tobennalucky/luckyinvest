"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { removeHolding } from "@/lib/portfolio";

export function RemoveHoldingButton({ ticker }: { ticker: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => removeHolding(ticker))}
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-negative disabled:opacity-60 cursor-pointer"
      aria-label={`Remove ${ticker}`}
    >
      <X size={15} />
    </button>
  );
}
