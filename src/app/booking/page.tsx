import { Suspense } from 'react'
import type { Metadata } from 'next'
import BookingWizard from '@/components/booking/BookingWizard'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Réserver un Rendez-vous — Mailess M2S',
  description:
    'Prenez rendez-vous en ligne pour vos soins beauté et maquillage avec Mailess M2S. Simple, rapide et personnalisé.',
}

function BookingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="text-gold animate-spin" size={32} />
    </div>
  )
}

export default function BookingPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Page header */}
      <div className="bg-surface border-b border-border py-12 px-6 text-center">
        <p className="section-label mb-3">Prise de rendez-vous</p>
        <h1 className="font-serif text-4xl md:text-5xl text-cream mb-3">
          Réserver une <em className="text-gold not-italic">Séance</em>
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="gold-line" />
          <span className="text-gold font-serif">✦</span>
          <div className="gold-line" />
        </div>
      </div>

      {/* Booking wizard */}
      <Suspense fallback={<BookingFallback />}>
        <BookingWizard />
      </Suspense>
    </div>
  )
}
