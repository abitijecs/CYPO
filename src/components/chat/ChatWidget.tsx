'use client'

import { useState } from 'react'
import { MessageCircle, X, Sparkles } from 'lucide-react'
import ChatPanel from './ChatPanel'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] shadow-2xl shadow-black/50 border border-border animate-slideIn">
          <ChatPanel onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center shadow-lg shadow-black/50 transition-all duration-300 ${
          isOpen
            ? 'bg-surface border border-gold/50 hover:bg-surface-elevated'
            : 'bg-gold hover:bg-gold-light hover:shadow-[0_0_25px_rgba(201,168,76,0.5)]'
        }`}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
      >
        {isOpen ? (
          <X size={20} className="text-cream" />
        ) : (
          <MessageCircle size={22} className="text-background" />
        )}
      </button>

      {/* Notification dot — shown before first interaction */}
      {!isOpen && (
        <div className="fixed bottom-[70px] right-6 z-50">
          <div className="flex items-center gap-2 bg-surface border border-gold/30 px-3 py-1.5 shadow-lg">
            <Sparkles size={10} className="text-gold" />
            <span className="text-gold text-[10px] font-sans uppercase tracking-wider">
              Besoin d&apos;aide ?
            </span>
          </div>
        </div>
      )}
    </>
  )
}
