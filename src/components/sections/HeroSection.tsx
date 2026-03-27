'use client'

import Link from 'next/link'
import { ArrowDown, Sparkles } from 'lucide-react'

export default function HeroSection() {
  const scrollToServices = () => {
    document.getElementById('prestations')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />
        {/* Decorative lines */}
        <div className="absolute top-1/4 left-0 w-px h-48 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-1/3 right-0 w-px h-64 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
        {/* Corner accents */}
        <div className="absolute top-24 left-8 w-16 h-16 border-l border-t border-gold/20" />
        <div className="absolute bottom-16 right-8 w-16 h-16 border-r border-b border-gold/20" />
        {/* Dots pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #c9a84c 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 border border-gold/30 bg-gold/5">
          <Sparkles size={12} className="text-gold" />
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-sans">
            Beauté & Esthétique
          </span>
          <Sparkles size={12} className="text-gold" />
        </div>

        {/* Main heading */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-6">
          Révélez
          <br />
          <em className="text-gold not-italic">Votre Beauté</em>
        </h1>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/60" />
          <span className="text-gold text-lg font-serif">✦</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        {/* Subtitle */}
        <p className="text-text-secondary text-lg md:text-xl font-sans font-light leading-relaxed max-w-xl mx-auto mb-12">
          Soins visage sur-mesure, maquillage artistique & bien-être.
          <br className="hidden md:block" />
          Chaque séance, une expérience unique.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/booking" className="btn-primary">
            Prendre Rendez-vous
          </Link>
          <button onClick={scrollToServices} className="btn-outline">
            Découvrir les Prestations
          </button>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToServices}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted hover:text-gold transition-colors"
          aria-label="Défiler vers le bas"
        >
          <ArrowDown size={18} className="animate-bounce" />
        </button>
      </div>
    </section>
  )
}
