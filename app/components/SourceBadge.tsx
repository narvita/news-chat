import { Article } from "../types/chat";

export function SourceBadge({ articles }: { articles: Article[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {articles.map((a: Article) => {
        let hostname = "";
        try { hostname = new URL(a.url).hostname; } catch {}
        return (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2f2f2f] border border-white/10 text-xs text-white/60 hover:text-white/90 hover:border-white/25 transition-colors"
          >
            {hostname && (
              <img
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`}
                alt=""
                className="w-3.5 h-3.5 rounded-sm"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <span className="max-w-[120px] truncate">{a.source}</span>
          </a>
        );
      })}
    </div>
  );
}