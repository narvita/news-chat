import { createChat } from "@/app/lib/openRouter";
import { systemPrompt } from "@/app/lib/llm/systemPrompt";
import { emit, handleToolResponse, handlePlainResponse } from "@/app/services/chatService";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const encoder = new TextEncoder();
  const withSystem = [{ role: "system", content: systemPrompt }, ...messages];

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const firstResponse = await createChat({ messages: withSystem, stream: false });
        const firstData = await firstResponse.json();
        const assistantMessage = firstData.choices[0].message;
        const toolCall = assistantMessage.tool_calls?.[0];

        if (toolCall) {
          await handleToolResponse(controller, encoder, withSystem, assistantMessage, toolCall);
        } else {
          await handlePlainResponse(controller, encoder, withSystem);
        }

        controller.close();
      } catch (error) {
        console.error(error);
        emit(controller, encoder, { type: "error", message: "Something went wrong" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    },
  });
}
