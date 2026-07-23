"use client";

import { useRef, useState, useTransition } from "react";
import { addHolding } from "@/lib/portfolio";

export function AddHoldingForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className="panel flex flex-wrap items-end gap-3 rounded-2xl p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setError(null);
        startTransition(async () => {
          try {
            await addHolding(formData);
            formRef.current?.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
          }
        });
      }}
    >
      <div>
        <label className="text-xs text-muted" htmlFor="ticker">
          Ticker
        </label>
        <input
          id="ticker"
          name="ticker"
          required
          placeholder="AAPL"
          className="mt-1 w-24 rounded-xl border border-border bg-white/5 px-3 py-2 text-sm uppercase outline-none focus:border-border-strong"
        />
      </div>
      <div>
        <label className="text-xs text-muted" htmlFor="units">
          Units
        </label>
        <input
          id="units"
          name="units"
          type="number"
          step="any"
          min="0"
          required
          placeholder="10"
          className="mt-1 w-24 rounded-xl border border-border bg-white/5 px-3 py-2 text-sm outline-none focus:border-border-strong"
        />
      </div>
      <div>
        <label className="text-xs text-muted" htmlFor="costBasis">
          Cost / share
        </label>
        <input
          id="costBasis"
          name="costBasis"
          type="number"
          step="any"
          min="0"
          placeholder="Optional"
          className="mt-1 w-28 rounded-xl border border-border bg-white/5 px-3 py-2 text-sm outline-none focus:border-border-strong"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 disabled:opacity-60 cursor-pointer"
      >
        {isPending ? "Adding…" : "Add holding"}
      </button>
      {error && <p className="w-full text-xs text-negative">{error}</p>}
    </form>
  );
}
