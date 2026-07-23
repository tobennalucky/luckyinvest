import { ExternalLink } from "lucide-react";
import { getMarketNews } from "@/lib/finnhub";

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function NewsPage() {
  const news = await getMarketNews("general");

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Market News</h1>
      <p className="mt-1 text-sm text-muted">The latest headlines across the market.</p>

      <div className="mt-6 flex flex-col gap-3">
        {news.slice(0, 30).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="panel flex gap-4 rounded-2xl p-4 transition-colors hover:border-border-strong"
          >
            {item.image && (
              // Article thumbnails come from arbitrary third-party news domains,
              // so next/image's allowlist isn't practical here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt=""
                className="h-20 w-28 shrink-0 rounded-xl object-cover bg-white/5"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.headline}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted">{item.summary}</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                {item.source} · {formatDate(item.datetime)}
                <ExternalLink size={12} />
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
