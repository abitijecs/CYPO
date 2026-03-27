'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Calendar } from 'lucide-react'
import Link from 'next/link'
import type { ChatMessage } from '@/types/chat'
import ChatMessageBubble from './ChatMessage'
import ChatInput from './ChatInput'

interface Props {
  onClose: () => void
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Bonjour ! Je suis Maya, l\'assistante de Mailess M2S. ✨\n\nComment puis-je vous aider aujourd\'hui ? Je peux vous renseigner sur nos prestations, les tarifs, ou vous aider à préparer votre rendez-vous.',
  timestamp: new Date(),
}

export default function ChatPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [paymentReady, setPaymentReady] = useState(false)
  const [paymentServiceId, setPaymentServiceId] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    // Build conversation history (exclude welcome msg from history)
    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role: 'user', content }],
        }),
      })

      if (!res.ok) throw new Error('Erreur de connexion')

      // Check for payment ready header
      const paymentReadyHeader = res.headers.get('X-Payment-Ready')
      const serviceIdHeader = res.headers.get('X-Service-Id')
      if (paymentReadyHeader === 'true') {
        setPaymentReady(true)
        if (serviceIdHeader) setPaymentServiceId(serviceIdHeader)
      }

      // Stream response
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMsg])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          assistantContent += chunk
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, content: assistantContent } : m,
            ),
          )
        }
      }
    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolée, une erreur s\'est produite. Veuillez réessayer.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background border border-border flex flex-col" style={{ height: '520px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold/20 border border-gold/40 flex items-center justify-center">
            <span className="font-serif text-gold text-sm">M</span>
          </div>
          <div>
            <p className="text-cream text-sm font-medium leading-none">Maya</p>
            <p className="text-gold text-[10px] font-sans mt-0.5">Assistante M2S</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-text-secondary font-sans">En ligne</span>
          <button onClick={onClose} className="ml-2 p-1 text-text-secondary hover:text-cream">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Payment ready banner */}
      {paymentReady && (
        <div className="px-4 py-3 bg-gold/10 border-b border-gold/30 flex items-center justify-between gap-3">
          <p className="text-gold text-xs font-sans">Prête à réserver ? 🎉</p>
          <Link
            href={`/booking${paymentServiceId ? `?service=${paymentServiceId}` : ''}`}
            className="flex items-center gap-1 bg-gold text-background text-xs font-sans px-3 py-1.5 hover:bg-gold-light transition-colors shrink-0"
          >
            <Calendar size={12} />
            Réserver
          </Link>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex gap-2 items-end">
            <div className="w-6 h-6 bg-gold/20 border border-gold/40 flex items-center justify-center shrink-0">
              <span className="font-serif text-gold text-xs">M</span>
            </div>
            <div className="bg-surface-elevated border border-border px-3 py-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
