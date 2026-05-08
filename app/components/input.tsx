'use client';
import { useRef, useState } from 'react';

export function Input({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  return (
    <div className="flex items-center gap-3 bg-[#2f2f2f] rounded-3xl px-4 py-3">
      <textarea
        ref={textareaRef}
        rows={1}
        className="flex-1 bg-transparent text-white/90 placeholder-white/35 resize-none focus:outline-none text-sm leading-6"
        placeholder="Ask about news..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{ maxHeight: '160px' }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim()}
        className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 disabled:opacity-20 disabled:cursor-not-allowed transition-opacity hover:bg-white/90"
        aria-label="Send"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 19V5M5 12l7-7 7 7"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
