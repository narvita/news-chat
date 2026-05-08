import { tools } from "./llm/tools";

interface ChatOptions {
  messages: any[];
  stream?: boolean;
}

export async function createChat({
  messages,
  stream = false,
}: ChatOptions) {
  return fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages,
        tools,
        tool_choice: 'auto',
        stream,
      }),
    }
  );
}