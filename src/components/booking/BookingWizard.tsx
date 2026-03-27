'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import type { BookingFormData } from '@/types/booking'
import { SERVICES } from '@/data/services'
import StepServiceSelect from './StepServiceSelect'
import StepDateTime from './StepDateTime'
import StepClientInfo from './StepClientInfo'
import StepConfirmation from './StepConfirmation'

const STEPS = [
  { number: 1, label: 'Prestation' },
  { number: 2, label: 'Date & Heure' },
  { number: 3, label: 'Vos Infos' },
  { number: 4, label: 'Confirmation' },
]

export default function BookingWizard() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [bookingRef, setBookingRef] = useState('')

  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    serviceId: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })

  // Pre-select service from URL query param
  useEffect(() => {
    const serviceId = searchParams.get('service')
    if (serviceId && SERVICES.find((s) => s.id === serviceId)) {
      setFormData((prev) => ({ ...prev, serviceId }))
    }
  }, [searchParams])

  const updateField = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 4))
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      const data = await res.json()
      setBookingRef(data.id)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 border-2 border-gold flex items-center justify-center mx-auto mb-8">
          <Check size={32} className="text-gold" />
        </div>
        <h2 className="font-serif text-3xl text-cream mb-3">Réservation Confirmée !</h2>
        <p className="text-text-secondary text-sm mb-2">Référence : <span className="text-gold font-mono">#{bookingRef}</span></p>
        <p className="text-text-secondary text-sm max-w-sm mx-auto">
          Un email de confirmation a été envoyé à {formData.email}.
          À très bientôt !
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Progress steps */}
      <div className="flex items-center justify-between mb-12">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 border flex items-center justify-center transition-all duration-300 ${
                  currentStep > step.number
                    ? 'bg-gold border-gold'
                    : currentStep === step.number
                    ? 'border-gold text-gold'
                    : 'border-border text-text-muted'
                }`}
              >
                {currentStep > step.number ? (
                  <Check size={14} className="text-background" />
                ) : (
                  <span className="text-xs font-sans font-medium">{step.number}</span>
                )}
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider font-sans mt-2 hidden sm:block ${
                  currentStep >= step.number ? 'text-gold' : 'text-text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 transition-all duration-500 ${
                  currentStep > step.number ? 'bg-gold' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <StepServiceSelect
            selectedServiceId={formData.serviceId || ''}
            onSelect={(id) => updateField('serviceId', id)}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <StepDateTime
            date={formData.date || ''}
            time={formData.time || ''}
            serviceId={formData.serviceId || ''}
            onDateChange={(v) => updateField('date', v)}
            onTimeChange={(v) => updateField('time', v)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 3 && (
          <StepClientInfo
            data={{
              firstName: formData.firstName || '',
              lastName: formData.lastName || '',
              email: formData.email || '',
              phone: formData.phone || '',
              notes: formData.notes || '',
            }}
            onChange={(field, value) => updateField(field as keyof BookingFormData, value)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 4 && (
          <StepConfirmation
            formData={formData as BookingFormData}
            submitting={submitting}
            error={error}
            onSubmit={handleSubmit}
            onBack={prevStep}
          />
        )}
      </div>
    </div>
  )
}
