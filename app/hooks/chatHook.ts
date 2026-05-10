"use client";

import { useState } from "react";
import { ChatMessage, MassageRole } from "../types/chat";

function updateLast(
  prev: ChatMessage[],
  patch: Partial<ChatMessage>,
): ChatMessage[] {
  const copy = [...prev];
  copy[copy.length - 1] = { ...copy[copy.length - 1], ...patch };
  return copy;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  async function sendMessage(text: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: MassageRole.USER,
      content: text,
    };

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: MassageRole.ASSISTANT,
      content: "",
      outro: "",
      isStreaming: true,
      toolStatus: "Thinking...",
      loadingArticles: false,
      articles: [],
    };

    const nextMessages = [...messages, userMessage];

    setMessages([...nextMessages, assistantMessage]);
  console.log(nextMessages, 'nextmassages');
  

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader!.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        for (const line of event.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const json = line.replace("data: ", "");
          if (!json || json === "[DONE]") continue;

          try {
            const data = JSON.parse(json);

            if (data.type === "tool_start") {
              setMessages((prev) =>
                updateLast(prev, {
                  toolStatus: `Searching news for "${data.query}"...`,
                }),
              );
            }

            if (data.type === "text") {
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                return updateLast(prev, {
                  content: last.content + data.content,
                  toolStatus: "",
                  isStreaming: false,
                });
              });
            }

            if (data.type === "loading_articles") {
              setMessages((prev) =>
                updateLast(prev, { loadingArticles: true }),
              );
            }

            if (data.type === "articles") {
              setMessages((prev) =>
                updateLast(prev, {
                  articles: data.articles,
                  loadingArticles: false,
                }),
              );
            }

            if (data.type === "outro") {
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                return updateLast(prev, {
                  outro: (last.outro ?? "") + data.content,
                });
              });
            }

            if (data.type === "error") {
              setMessages((prev) =>
                updateLast(prev, {
                  content: "Something went wrong.",
                  isStreaming: false,
                  toolStatus: "",
                }),
              );
            }
          } catch (err) {
            console.error("JSON parse error:", err);
          }
        }
      }
    }

    setMessages((prev) =>
      updateLast(prev, {
        isStreaming: false,
        toolStatus: "",
        loadingArticles: false,
      }),
    );
  }

  return { messages, sendMessage };
}
