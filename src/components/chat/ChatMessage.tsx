import type { ChatMessage } from '@/types/chat'

interface Props {
  message: ChatMessage
}

export default function ChatMessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-2 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-6 h-6 bg-gold/20 border border-gold/40 flex items-center justify-center shrink-0 mb-0.5">
          <span className="font-serif text-gold text-xs">M</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-gold/20 border border-gold/30 text-cream'
            : 'bg-surface-elevated border border-border text-text-primary'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
