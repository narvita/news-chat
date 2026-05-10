"use client";

import { getRandomPrompts } from "@/app/utils/randomPrompts";
import { useEffect, useState } from "react";

interface Props {
  onSelect: (text: string) => void;
}

export default function PromptsBox({ onSelect }: Props) {
  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    setPrompts(getRandomPrompts());
  }, []);

  if (prompts.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full px-4 pb-12">
      <h1 className="text-white text-3xl font-semibold mb-8 tracking-tight">
        What's in the news?
      </h1>
      <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="px-4 py-3 text-sm text-white/75 rounded-2xl border border-white/15 bg-[#2f2f2f] hover:bg-[#3a3a3a] transition-colors text-left cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
