import { ChatMessage } from "@/app/types/chat";
import ArticleGrid from "../news/ArticleGrid";
import { SourceBadge } from "../SourceBadge";
import { Spinner } from "../Spinner";

export function AssistantContent({ msg }: { msg: ChatMessage }) {
  const { content, outro, articles, toolStatus, loadingArticles } = msg;
  const hasArticles = articles && articles.length > 0;

  return (
    <div className="flex-1 text-white/90 text-sm leading-relaxed min-w-0 flex flex-col gap-3">

      {toolStatus && <Spinner label={toolStatus} />}

      {content && <p className="whitespace-pre-wrap">{content}</p>}

      {loadingArticles && <Spinner label="Loading articles..." />}

      {hasArticles && (
        <div>
          <ArticleGrid articles={articles} />
        </div>
      )}

      {outro && <p className="whitespace-pre-wrap text-white/70">{outro}</p>}

      {hasArticles && <SourceBadge articles={articles} />}
    </div>
  );
}
