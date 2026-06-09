import { useEffect, useRef } from 'react';

const MODE_AVATARS = {
  interview: '🎙️',
  debate: '⚔️',
  gd: '👥',
  casual: '☕',
};

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4 slide-up">
      <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-sm shrink-0">
        🤖
      </div>
      <div className="bubble-bot px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, isLoading, mode }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const avatar = MODE_AVATARS[mode] || '🤖';

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
      {messages.map((msg, i) => (
        <div
          key={msg.id || i}
          className={`flex items-end gap-2 mb-4 slide-up ${
            msg.role === 'user' ? 'flex-row-reverse' : ''
          }`}
        >
          {/* Avatar */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
              msg.role === 'user'
                ? 'bg-teal-500/20 border border-teal-400/30'
                : 'bg-violet-600/20 border border-violet-500/30'
            }`}
          >
            {msg.role === 'user' ? '🧑' : avatar}
          </div>

          {/* Bubble */}
          <div
            className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user' ? 'bubble-user text-white' : 'bubble-bot text-gray-100'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}

      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
