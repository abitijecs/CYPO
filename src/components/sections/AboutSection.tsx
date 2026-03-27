import Link from 'next/link'
import { Instagram, Award, Users, Heart } from 'lucide-react'

const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'mailess_m2s'

const stats = [
  { icon: Users, value: '200+', label: 'Clientes satisfaites' },
  { icon: Award, value: '5+', label: "Années d'expérience" },
  { icon: Heart, value: '100%', label: 'Passion & dévouement' },
]

export default function AboutSection() {
  return (
    <section id="apropos" className="py-24 px-6 bg-surface/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <div className="relative">
            {/* Decorative frame */}
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent border border-gold/20" />
              <div className="absolute inset-4 bg-gradient-to-br from-surface-elevated to-background border border-border flex items-center justify-center">
                {/* Monogram */}
                <div className="text-center">
                  <div className="w-24 h-24 border border-gold/40 flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif text-gold text-5xl font-light">M</span>
                  </div>
                  <p className="text-gold text-xs uppercase tracking-[0.4em] font-sans">Mailess</p>
                  <p className="text-text-muted text-xs font-sans tracking-wider mt-1">M2S</p>
                </div>
              </div>
              {/* Corner accents */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-gold" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-gold" />
            </div>
          </div>

          {/* Text side */}
          <div>
            <p className="section-label mb-4">Mon histoire</p>
            <h2 className="section-title mb-6">
              À Propos de{' '}
              <em className="text-gold not-italic">Mailess</em>
            </h2>
            <div className="gold-line mb-8" />

            <div className="space-y-4 text-text-secondary text-sm leading-relaxed mb-8">
              <p>
                Passionnée par la beauté depuis toujours, j&apos;ai développé une expertise
                approfondie en soins esthétiques, maquillage et bien-être. Mon approche est simple :
                chaque cliente est unique, chaque soin est personnalisé.
              </p>
              <p>
                Je mets tout mon savoir-faire au service de votre beauté naturelle, en utilisant
                des produits soigneusement sélectionnés pour respecter votre peau et sublimer vos
                traits.
              </p>
              <p>
                Mon cabinet est un espace de confiance et de sérénité, où vous pourrez vous
                ressourcer et prendre soin de vous en toute tranquillité.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <Icon size={16} className="text-gold mx-auto mb-2" />
                  <p className="font-serif text-2xl text-cream mb-1">{value}</p>
                  <p className="text-text-muted text-xs font-sans leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Instagram CTA */}
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center gap-2"
            >
              <Instagram size={16} />
              Suivre sur Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
