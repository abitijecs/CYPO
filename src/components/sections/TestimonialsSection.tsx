import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sophie L.',
    service: 'Soin Visage Hydratant',
    text: 'Un moment de pur bonheur ! Ma peau n\'a jamais été aussi lumineuse. Mailess est à l\'écoute et ses soins sont vraiment magiques.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Camille M.',
    service: 'Maquillage Soirée',
    text: 'J\'ai été sublimée pour mon anniversaire. Le maquillage a tenu toute la nuit et j\'ai reçu des compliments toute la soirée. Merci !',
    rating: 5,
  },
  {
    id: 3,
    name: 'Aïcha D.',
    service: 'Forfait Mariée',
    text: 'Mailess a transformé mon jour J en un rêve absolu. Professionnelle, créative et tellement bienveillante. Je recommande les yeux fermés !',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label mb-4">Ce qu&apos;elles disent</p>
          <h2 className="section-title">Témoignages</h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="gold-line" />
            <span className="text-gold font-serif">✦</span>
            <div className="gold-line" />
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-surface border border-border p-6 relative">
              {/* Quote mark */}
              <div className="text-gold/20 font-serif text-7xl leading-none absolute top-2 left-4 pointer-events-none select-none">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={12} className="text-gold fill-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="text-text-secondary text-sm leading-relaxed italic mb-6 relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-border/50 pt-4">
                <p className="text-cream text-sm font-medium">{t.name}</p>
                <p className="text-gold-muted text-xs font-sans mt-1">{t.service}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
