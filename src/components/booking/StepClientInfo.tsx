import { ArrowRight } from 'lucide-react'

interface ClientData {
  firstName: string
  lastName: string
  email: string
  phone: string
  notes: string
}

interface Props {
  data: ClientData
  onChange: (field: string, value: string) => void
  onNext: () => void
  onBack: () => void
}

interface FieldProps {
  label: string
  id: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}

function Field({ label, id, type = 'text', value, onChange, placeholder, required }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-wider text-gold font-sans mb-2">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-surface border border-border text-cream text-sm px-4 py-3 placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  )
}

export default function StepClientInfo({ data, onChange, onNext, onBack }: Props) {
  const isValid = data.firstName && data.lastName && data.email && data.phone

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-2xl text-cream mb-2">Vos coordonnées</h2>
        <p className="text-text-secondary text-sm">
          Ces informations sont utilisées uniquement pour confirmer votre réservation.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Prénom"
            id="firstName"
            value={data.firstName}
            onChange={(v) => onChange('firstName', v)}
            placeholder="Camille"
            required
          />
          <Field
            label="Nom"
            id="lastName"
            value={data.lastName}
            onChange={(v) => onChange('lastName', v)}
            placeholder="Dupont"
            required
          />
        </div>
        <Field
          label="Email"
          id="email"
          type="email"
          value={data.email}
          onChange={(v) => onChange('email', v)}
          placeholder="camille@email.com"
          required
        />
        <Field
          label="Téléphone"
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(v) => onChange('phone', v)}
          placeholder="+33 6 00 00 00 00"
          required
        />
        <div>
          <label htmlFor="notes" className="block text-xs uppercase tracking-wider text-gold font-sans mb-2">
            Notes (optionnel)
          </label>
          <textarea
            id="notes"
            value={data.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Précisions sur votre peau, allergies, occasion spéciale..."
            rows={3}
            className="w-full bg-surface border border-border text-cream text-sm px-4 py-3 placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-ghost border border-border px-6 py-3">
          Retour
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`btn-primary flex-1 justify-center ${!isValid ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          Vérifier ma réservation
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
