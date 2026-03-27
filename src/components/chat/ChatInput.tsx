'use client'

import { useState, useRef, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface Props {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 100) + 'px'
    }
  }

  return (
    <div className="border-t border-border px-3 py-3 flex items-end gap-2 bg-surface">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Écrivez votre message..."
        disabled={disabled}
        rows={1}
        className="flex-1 bg-background border border-border text-cream text-sm px-3 py-2 placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors resize-none leading-relaxed disabled:opacity-50"
        style={{ minHeight: '40px', maxHeight: '100px' }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className={`w-10 h-10 flex items-center justify-center shrink-0 transition-all duration-200 ${
          value.trim() && !disabled
            ? 'bg-gold hover:bg-gold-light text-background'
            : 'bg-surface border border-border text-text-muted cursor-not-allowed'
        }`}
        aria-label="Envoyer"
      >
        <Send size={15} />
      </button>
    </div>
  )
}
