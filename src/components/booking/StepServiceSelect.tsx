import { Clock, ArrowRight, Star } from 'lucide-react'
import { SERVICES, CATEGORY_LABELS } from '@/data/services'
import { formatCurrency, formatDuration } from '@/lib/utils'

interface Props {
  selectedServiceId: string
  onSelect: (id: string) => void
  onNext: () => void
}

export default function StepServiceSelect({ selectedServiceId, onSelect, onNext }: Props) {
  const handleSelect = (id: string) => {
    onSelect(id)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-2xl text-cream mb-2">Choisissez votre prestation</h2>
        <p className="text-text-secondary text-sm">
          Sélectionnez le soin ou le maquillage qui vous correspond.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8 max-h-[480px] overflow-y-auto pr-1">
        {SERVICES.map((service) => {
          const isSelected = selectedServiceId === service.id
          return (
            <button
              key={service.id}
              onClick={() => handleSelect(service.id)}
              className={`w-full text-left p-4 border transition-all duration-200 ${
                isSelected
                  ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(201,168,76,0.1)]'
                  : 'border-border bg-surface hover:border-gold/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-base text-cream">{service.name}</span>
                    {service.popular && (
                      <span className="flex items-center gap-1">
                        <Star size={9} className="text-gold fill-gold" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-gold-muted font-sans mb-1">
                    {CATEGORY_LABELS[service.category]}
                  </p>
                  <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-serif text-gold text-lg">{formatCurrency(service.price)}</p>
                  <p className="flex items-center gap-1 text-text-muted text-xs font-sans justify-end mt-1">
                    <Clock size={10} />
                    {formatDuration(service.duration)}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-gold/20">
                  <p className="text-gold text-xs font-sans">✓ Prestation sélectionnée</p>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!selectedServiceId}
        className={`btn-primary w-full justify-center ${!selectedServiceId ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        Continuer
        <ArrowRight size={16} />
      </button>
    </div>
  )
}
