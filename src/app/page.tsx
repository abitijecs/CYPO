import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import AboutSection from '@/components/sections/AboutSection'
import InstagramSection from '@/components/sections/InstagramSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <InstagramSection />

      {/* Final CTA section */}
      <section className="py-24 px-6 bg-surface/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label mb-4">Passez à l&apos;action</p>
          <h2 className="section-title mb-6">
            Prête pour votre <em className="text-gold not-italic">transformation</em> ?
          </h2>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="gold-line" />
            <span className="text-gold font-serif">✦</span>
            <div className="gold-line" />
          </div>
          <p className="text-text-secondary text-sm mb-10 leading-relaxed">
            Réservez votre séance en quelques minutes et offrez-vous un moment de beauté
            et de bien-être sur-mesure.
          </p>
          <Link href="/booking" className="btn-primary inline-flex items-center gap-2">
            <Calendar size={16} />
            Réserver Maintenant
          </Link>
        </div>
      </section>
    </>
  )
}
