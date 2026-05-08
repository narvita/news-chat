import { Article } from "../types/chat";

export async function searchNews(
    query: string
): Promise<Article[]> {
    const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&q=${query}&language=en`
    );

    const data = await response.json();

    return (data.results || [])
        .slice(0, 5)
        .map((article: any, index: number) => ({
            id: index + 1,
            title: article.title,
            description: article.description,
            image: article.image_url,
            source: article.source_id,
            url: article.link,
            pubDate: article.pubDate ?? null,
        }));
}