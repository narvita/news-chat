import { Article } from "@/app/types/chat";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {articles.map((article: Article, index: number) => (
        <div
          key={article.id}
          className="border border-white/10 rounded-xl overflow-hidden bg-[#2f2f2f] hover:bg-[#383838] transition-colors"
          style={{
            animation: "card-in 0.35s ease both",
            animationDelay: `${index * 80}ms`,
          }}
        >
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-36 object-cover"
            />
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 text-xs text-white/35 mb-1">
              <span>#{article.id}</span>
              {article.pubDate && (
                <>
                  <span>·</span>
                  <span>{formatDate(article.pubDate)}</span>
                </>
              )}
            </div>
            <h2 className="font-semibold text-white/90 text-sm leading-snug">
              {article.title}
            </h2>
            <p className="text-xs text-white/50 mt-2 line-clamp-2 leading-relaxed">
              {article.description}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#19c37d] text-xs mt-3 inline-block hover:underline"
            >
              Read more →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
