import type { TickerColor } from "@/lib/mockData";

export function TickerBadge({
  ticker,
  colors,
  size = 34,
}: {
  ticker: string;
  colors: TickerColor;
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl text-[10px] font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: colors.bg,
        color: colors.fg,
      }}
    >
      {ticker.slice(0, 2)}
    </div>
  );
}
