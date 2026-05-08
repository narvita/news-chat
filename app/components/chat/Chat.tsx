"use client";
import { Input } from "../input";
import { useChat } from "../../hooks/chatHook";
import PromptsBox from "./PromptsBox";
import { useEffect, useRef } from "react";
import { AssistantContent } from "./Assistant";


export default function Chat() {
  const { messages, sendMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    await sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center py-3 border-b border-white/10">
        <span className="text-white/60 text-sm font-medium">News Chat</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none">
        {messages.length === 0 ? (
          <PromptsBox onSelect={handleSend} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-8">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="bg-[#2f2f2f] text-white/90 px-5 py-3 rounded-3xl max-w-[85%] text-sm leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#19c37d] flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold">
                      AI
                    </div>
                    <AssistantContent msg={msg} />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="px-4 pb-6 pt-3">
        <div className="max-w-3xl mx-auto">
          <Input onSend={handleSend} />
        </div>
        <p className="text-center text-white/25 text-xs mt-3">
          News Chat can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
