import nodemailer from 'nodemailer'
import type { BookingFormData } from '@/types/booking'
import { SERVICES } from '@/data/services'
import { formatCurrency, formatDate, formatDuration } from '@/lib/utils'

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendBookingConfirmation(booking: BookingFormData & { id: string }) {
  const service = SERVICES.find((s) => s.id === booking.serviceId)
  if (!service) return

  const transporter = createTransporter()
  const ownerEmail = process.env.OWNER_EMAIL

  if (!ownerEmail || !process.env.SMTP_USER) {
    console.log('[Email] SMTP non configuré. Réservation:', booking)
    return
  }

  const dateFormatted = formatDate(booking.date)
  const servicePrice = formatCurrency(service.price)
  const serviceDuration = formatDuration(service.duration)

  // Email to owner
  await transporter.sendMail({
    from: `"M2S Booking" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: `📅 Nouvelle Réservation — ${service.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f0e8; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #c9a84c; font-size: 28px; margin: 0;">M2S — Nouvelle Réservation</h1>
          <p style="color: #a89880; margin: 8px 0 0;">Référence : #${booking.id}</p>
        </div>

        <div style="background: #111111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #c9a84c; font-size: 16px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px;">Prestation</h2>
          <p style="font-size: 20px; margin: 0 0 8px;">${service.name}</p>
          <p style="color: #a89880; margin: 0;">${serviceDuration} · ${servicePrice}</p>
        </div>

        <div style="background: #111111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #c9a84c; font-size: 16px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px;">Date & Heure</h2>
          <p style="font-size: 18px; margin: 0 0 4px; text-transform: capitalize;">${dateFormatted}</p>
          <p style="color: #a89880; margin: 0; font-size: 18px;">${booking.time}</p>
        </div>

        <div style="background: #111111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #c9a84c; font-size: 16px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px;">Cliente</h2>
          <p style="margin: 0 0 4px;">${booking.firstName} ${booking.lastName}</p>
          <p style="color: #a89880; margin: 0 0 4px;">${booking.email}</p>
          <p style="color: #a89880; margin: 0;">${booking.phone}</p>
          ${booking.notes ? `<p style="color: #c8b89a; margin: 12px 0 0; font-style: italic;">"${booking.notes}"</p>` : ''}
        </div>

        <p style="color: #5c5248; font-size: 12px; text-align: center; margin: 0;">Mailess M2S — Booking System</p>
      </div>
    `,
  })

  // Confirmation email to client
  await transporter.sendMail({
    from: `"Mailess M2S" <${process.env.SMTP_USER}>`,
    to: booking.email,
    subject: `Votre réservation est confirmée — ${service.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f0e8; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #c9a84c; font-size: 28px; margin: 0;">Merci ${booking.firstName} !</h1>
          <p style="color: #a89880; margin: 8px 0 0;">Votre réservation est confirmée</p>
        </div>

        <div style="background: #111111; border: 1px solid #c9a84c; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 18px;"><strong>${service.name}</strong></p>
          <p style="color: #a89880; margin: 0 0 8px; text-transform: capitalize;">${dateFormatted} à ${booking.time}</p>
          <p style="color: #c9a84c; margin: 0; font-size: 20px; font-weight: bold;">${servicePrice}</p>
        </div>

        <p style="color: #a89880; text-align: center;">
          À très bientôt,<br>
          <strong style="color: #f5f0e8;">Mailess M2S</strong>
        </p>
      </div>
    `,
  })
}

export async function sendPaymentReadyNotification(
  conversationContext: string,
  serviceId?: string,
) {
  const ownerEmail = process.env.OWNER_EMAIL

  if (!ownerEmail || !process.env.SMTP_USER) {
    console.log('[Email] SMTP non configuré. Notification paiement prêt.')
    return
  }

  const service = serviceId ? SERVICES.find((s) => s.id === serviceId) : null
  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"M2S Booking" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: `🔔 Cliente prête à payer — ${service?.name ?? 'Prestation à confirmer'}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f0e8; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #c9a84c; font-size: 28px; margin: 0;">Cliente Prête à Réserver</h1>
          <p style="color: #a89880; margin: 8px 0 0;">${new Date().toLocaleString('fr-FR')}</p>
        </div>

        ${service ? `
        <div style="background: #111111; border: 1px solid #c9a84c; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 18px;">Prestation : <strong>${service.name}</strong></p>
          <p style="color: #c9a84c; margin: 8px 0 0; font-size: 20px;">${formatCurrency(service.price)}</p>
        </div>
        ` : ''}

        <div style="background: #111111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #c9a84c; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px;">Contexte de la conversation</h2>
          <p style="color: #a89880; white-space: pre-wrap; font-size: 14px; margin: 0;">${conversationContext}</p>
        </div>

        <p style="color: #a89880; text-align: center; font-size: 14px;">
          Connectez-vous au chat pour finaliser la réservation.
        </p>
      </div>
    `,
  })
}
