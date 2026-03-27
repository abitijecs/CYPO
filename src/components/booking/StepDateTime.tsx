'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { AVAILABLE_TIMES } from '@/data/services'
import { getDaysInMonth, getFirstDayOfMonth, isPastDate } from '@/lib/utils'

interface Props {
  date: string
  time: string
  serviceId: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  onNext: () => void
  onBack: () => void
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]
const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export default function StepDateTime({ date, time, onDateChange, onTimeChange, onNext, onBack }: Props) {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const selectDay = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    if (!isPastDate(dateStr)) {
      onDateChange(dateStr)
      onTimeChange('')
    }
  }

  const isSelected = (day: number) => {
    return date === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const isPast = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return isPastDate(dateStr)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-2xl text-cream mb-2">Choisissez une date & heure</h2>
        <p className="text-text-secondary text-sm">Disponibilités du lundi au samedi.</p>
      </div>

      {/* Calendar */}
      <div className="bg-surface border border-border p-5 mb-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="p-1 text-text-secondary hover:text-cream transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-serif text-cream">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 text-text-secondary hover:text-cream transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-text-muted text-[10px] uppercase tracking-wider font-sans py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const past = isPast(day)
            const selected = isSelected(day)
            return (
              <button
                key={day}
                onClick={() => selectDay(day)}
                disabled={past}
                className={`aspect-square flex items-center justify-center text-sm font-sans transition-all duration-150 ${
                  selected
                    ? 'bg-gold text-background font-medium'
                    : past
                    ? 'text-text-muted cursor-not-allowed opacity-40'
                    : 'text-text-secondary hover:text-cream hover:bg-surface-elevated'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {date && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-gold font-sans mb-3">
            Créneaux disponibles
          </p>
          <div className="grid grid-cols-4 gap-2">
            {AVAILABLE_TIMES.map((slot) => (
              <button
                key={slot}
                onClick={() => onTimeChange(slot)}
                className={`py-2.5 text-sm font-sans border transition-all duration-150 ${
                  time === slot
                    ? 'border-gold bg-gold/15 text-gold'
                    : 'border-border text-text-secondary hover:border-gold/40 hover:text-cream'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-ghost border border-border px-6 py-3">
          Retour
        </button>
        <button
          onClick={onNext}
          disabled={!date || !time}
          className={`btn-primary flex-1 justify-center ${!date || !time ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          Continuer
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
