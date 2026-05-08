export interface ChatMessage {
  id: string;
  role: MassageRole[keyof MassageRole];
  content: string;
  outro?: string;
  isStreaming?: boolean;
  toolStatus?: string;
  articles?: any[];
  loadingArticles?: boolean
}

export const MassageRole = {
  USER: "user",
  ASSISTANT: "assistant",
  TOOL: "tool",
} as const;

export type MassageRole = (typeof MassageRole)[keyof typeof MassageRole];

export interface Article {
  id: number;
  title: string;
  description: string;
  image: string;
  source: string;
  url: string;
  pubDate?: string | null;
}
