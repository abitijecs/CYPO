import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/chat/ChatWidget'

export const metadata: Metadata = {
  title: 'Mailess M2S — Beauté & Esthétique',
  description:
    'Spécialiste en soins visage, maquillage et bien-être. Prenez rendez-vous en ligne et révélez votre beauté avec Mailess M2S.',
  keywords: ['beauté', 'esthétique', 'maquillage', 'soin visage', 'réservation', 'Mailess', 'M2S'],
  openGraph: {
    title: 'Mailess M2S — Beauté & Esthétique',
    description: 'Révélez votre beauté avec Mailess M2S. Soins visage, maquillage & bien-être.',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}
