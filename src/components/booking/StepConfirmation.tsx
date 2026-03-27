import { Loader2, AlertCircle, Calendar, Clock, User, CreditCard } from 'lucide-react'
import type { BookingFormData } from '@/types/booking'
import { SERVICES } from '@/data/services'
import { formatCurrency, formatDuration, formatDate } from '@/lib/utils'

interface Props {
  formData: BookingFormData
  submitting: boolean
  error: string
  onSubmit: () => void
  onBack: () => void
}

export default function StepConfirmation({ formData, submitting, error, onSubmit, onBack }: Props) {
  const service = SERVICES.find((s) => s.id === formData.serviceId)

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-2xl text-cream mb-2">Confirmer ma réservation</h2>
        <p className="text-text-secondary text-sm">Vérifiez les informations avant de confirmer.</p>
      </div>

      {/* Summary */}
      <div className="bg-surface border border-border p-5 mb-6 space-y-4">
        {/* Service */}
        <div className="flex items-start gap-3">
          <CreditCard size={16} className="text-gold mt-0.5 shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted font-sans mb-1">Prestation</p>
            <p className="text-cream text-sm font-medium">{service?.name}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gold font-serif">{service ? formatCurrency(service.price) : ''}</span>
              <span className="text-text-muted text-xs font-sans flex items-center gap-1">
                <Clock size={10} />
                {service ? formatDuration(service.duration) : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Date & time */}
        <div className="flex items-start gap-3">
          <Calendar size={16} className="text-gold mt-0.5 shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted font-sans mb-1">Date & Heure</p>
            <p className="text-cream text-sm capitalize">{formatDate(formData.date)}</p>
            <p className="text-text-secondary text-sm">{formData.time}</p>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Client */}
        <div className="flex items-start gap-3">
          <User size={16} className="text-gold mt-0.5 shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted font-sans mb-1">Vos coordonnées</p>
            <p className="text-cream text-sm">{formData.firstName} {formData.lastName}</p>
            <p className="text-text-secondary text-xs">{formData.email}</p>
            <p className="text-text-secondary text-xs">{formData.phone}</p>
            {formData.notes && (
              <p className="text-text-muted text-xs mt-1 italic">"{formData.notes}"</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment note */}
      <div className="flex items-start gap-2 p-4 border border-gold/20 bg-gold/5 mb-6">
        <CreditCard size={14} className="text-gold mt-0.5 shrink-0" />
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold font-medium">Paiement le jour de la séance</span>
          {' '}— Espèces, virement ou carte. Annulation gratuite jusqu&apos;à 24h avant.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 border border-red-900/50 bg-red-950/30 mb-4 text-red-400 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onBack} disabled={submitting} className="btn-ghost border border-border px-6 py-3">
          Retour
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="btn-primary flex-1 justify-center"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Confirmation en cours...
            </>
          ) : (
            'Confirmer ma Réservation'
          )}
        </button>
      </div>
    </div>
  )
}
