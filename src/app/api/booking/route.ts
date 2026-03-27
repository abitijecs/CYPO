import { NextRequest, NextResponse } from 'next/server'
import type { BookingFormData } from '@/types/booking'
import { SERVICES } from '@/data/services'
import { generateId } from '@/lib/utils'
import { sendBookingConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const data: BookingFormData = await req.json()

    // Validate required fields
    const required: (keyof BookingFormData)[] = [
      'serviceId', 'date', 'time', 'firstName', 'lastName', 'email', 'phone',
    ]
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Champ requis manquant : ${field}` }, { status: 400 })
      }
    }

    // Validate service exists
    const service = SERVICES.find((s) => s.id === data.serviceId)
    if (!service) {
      return NextResponse.json({ error: 'Prestation invalide' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const booking = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'pending' as const,
    }

    // Send confirmation emails (non-blocking — don't fail booking if email fails)
    sendBookingConfirmation(booking).catch((err) => {
      console.error('[Booking Email Error]', err)
    })

    return NextResponse.json({ id: booking.id, status: 'confirmed' })
  } catch (error) {
    console.error('[Booking API Error]', error)
    return NextResponse.json({ error: 'Erreur lors de la réservation' }, { status: 500 })
  }
}
