import { searchNews } from "@/app/lib/news";
import { createChat } from "@/app/lib/openRouter";
import { LIST_START_RE, OUTRO_START_RE } from "@/app/utils/constants";

const PHASE = {
  INTRO: "intro",
  LIST:  "list",
  OUTRO: "outro",
} as const;

type Phase = typeof PHASE[keyof typeof PHASE];

export function emit(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  payload: object,
) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
}

function parseDelta(line: string): string {
  if (!line.startsWith("data:")) return "";
  const raw = line.slice("data: ".length);
  if (raw === "[DONE]") return "";
  try {
    return JSON.parse(raw).choices?.[0]?.delta?.content ?? "";
  } catch {
    return "";
  }
}

async function* streamDeltas(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let sseBuffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    sseBuffer += decoder.decode(value, { stream: true });
    const events = sseBuffer.split("\n\n");
    sseBuffer = events.pop() ?? "";

    for (const event of events) {
      for (const line of event.split("\n")) {
        const delta = parseDelta(line);
        if (delta) yield delta;
      }
    }
  }
}


export async function handleToolResponse(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  withSystem: object[],
  assistantMessage: object,
  toolCall: { id: string; function: { arguments: string } },
) {
  const args = JSON.parse(toolCall.function.arguments);

  emit(controller, encoder, { type: "tool_start", query: args.query });

  const articles = await searchNews(args.query);

  const secondResponse = await createChat({
    messages: [
      ...withSystem,
      assistantMessage,
      {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(
          articles.map((a) => ({
            id: a.id,
            title: a.title,
            description: a.description?.slice(0, 150),
          }))
        ),
      },
    ],
    stream: true,
  });

  let accumulated = ""; 
  let introSent = 0;
  let listStartIdx = 0;
  let phase: Phase = PHASE.INTRO;

  for await (const delta of streamDeltas(secondResponse.body!)) {
    accumulated += delta;

    if (phase === PHASE.INTRO) {
      const listMatch = LIST_START_RE.exec(accumulated);

      if (listMatch) {

        const introText = accumulated.slice(introSent, listMatch.index).trimEnd();
        if (introText) {
          emit(controller, encoder, { type: "text", content: introText })
        }
        emit(controller, encoder, { type: "loading_articles" });
        listStartIdx = listMatch.index;
        phase = PHASE.LIST;
      } else {
        const safeEnd = accumulated.length - 8;
        if (safeEnd > introSent) {
          emit(controller, encoder, { type: "text", content: accumulated.slice(introSent, safeEnd) });
          introSent = safeEnd;
        }
      }

    } else if (phase === PHASE.LIST) {
      const outroMatch = OUTRO_START_RE.exec(accumulated.slice(listStartIdx));

      if (outroMatch) {
        const outroStartIdx = listStartIdx + outroMatch.index + 2;
        emit(controller, encoder, { type: "articles", articles });
        const outroSoFar = accumulated.slice(outroStartIdx).trimStart();
        if (outroSoFar) emit(controller, encoder, { type: "outro", content: outroSoFar });
        phase = PHASE.OUTRO;
      }

    } else {
      emit(controller, encoder, { type: "outro", content: delta });
    }
  }

  if (phase === PHASE.INTRO) {
    const remaining = accumulated.slice(introSent);
    if (remaining.trim()) emit(controller, encoder, { type: "text", content: remaining });
    emit(controller, encoder, { type: "articles", articles });

  } else if (phase === PHASE.LIST) {
    emit(controller, encoder, { type: "articles", articles });
    const outroMatch = OUTRO_START_RE.exec(accumulated.slice(listStartIdx));
    if (outroMatch) {
      const outroText = accumulated.slice(listStartIdx + outroMatch.index + 2).trim();
      if (outroText) emit(controller, encoder, { type: "outro", content: outroText });
    }
  }
}

export async function handlePlainResponse(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  withSystem: object[],
) {
  const response = await createChat({ messages: withSystem, stream: true });
  for await (const delta of streamDeltas(response.body!)) {
    emit(controller, encoder, { type: "text", content: delta });
  }
}
