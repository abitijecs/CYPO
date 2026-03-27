'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, ArrowRight, Star } from 'lucide-react'
import { SERVICES, CATEGORY_LABELS } from '@/data/services'
import { formatCurrency, formatDuration } from '@/lib/utils'

type Category = 'all' | string

export default function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const categories = ['all', ...Array.from(new Set(SERVICES.map((s) => s.category)))]

  const filtered =
    activeCategory === 'all' ? SERVICES : SERVICES.filter((s) => s.category === activeCategory)

  return (
    <section id="prestations" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label mb-4">Ce que je propose</p>
          <h2 className="section-title mb-4">Mes Prestations</h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="gold-line" />
            <span className="text-gold font-serif">✦</span>
            <div className="gold-line" />
          </div>
          <p className="text-text-secondary max-w-xl mx-auto text-sm leading-relaxed">
            Chaque soin est adapté à vos besoins. Prenez le temps de vous chouchouter.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs uppercase tracking-wider font-sans border transition-all duration-200 ${
                activeCategory === cat
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-border text-text-secondary hover:border-gold/40 hover:text-cream'
              }`}
            >
              {cat === 'all' ? 'Tous' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((service) => (
            <div
              key={service.id}
              className="group relative bg-surface border border-border p-6 card-hover flex flex-col"
            >
              {/* Popular badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-gold/15 border border-gold/30">
                  <Star size={10} className="text-gold fill-gold" />
                  <span className="text-gold text-[10px] uppercase tracking-wider font-sans">
                    Populaire
                  </span>
                </div>
              )}

              {/* Category label */}
              <p className="text-gold-muted text-[10px] uppercase tracking-[0.25em] font-sans mb-3">
                {CATEGORY_LABELS[service.category] || service.category}
              </p>

              {/* Name */}
              <h3 className="font-serif text-xl text-cream mb-3 group-hover:text-gold transition-colors leading-tight">
                {service.name}
              </h3>

              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-5">
                {service.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <span className="text-gold text-xl font-serif font-medium">
                    {formatCurrency(service.price)}
                  </span>
                  <span className="flex items-center gap-1 text-text-muted text-xs font-sans">
                    <Clock size={11} />
                    {formatDuration(service.duration)}
                  </span>
                </div>
                <Link
                  href={`/booking?service=${service.id}`}
                  className="flex items-center gap-1 text-gold text-xs uppercase tracking-wider font-sans hover:text-gold-light transition-colors group/link"
                >
                  Réserver
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover/link:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/booking" className="btn-outline">
            Réserver une Prestation
          </Link>
        </div>
      </div>
    </section>
  )
}
