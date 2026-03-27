import Link from 'next/link'
import { Instagram, Mail, Phone } from 'lucide-react'

const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'mailess_m2s'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border border-gold/60 flex items-center justify-center">
                <span className="font-serif text-gold text-sm font-medium">M</span>
              </div>
              <span className="font-serif text-cream text-lg tracking-wide">
                Mailess <span className="text-gold">M2S</span>
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Spécialiste en beauté et esthétique. Des soins personnalisés pour révéler votre
              beauté naturelle.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">Navigation</h3>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Accueil', href: '/' },
                { label: 'Prestations', href: '/#prestations' },
                { label: 'À Propos', href: '/#apropos' },
                { label: 'Réserver', href: '/booking' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary text-sm hover:text-cream transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-text-secondary text-sm hover:text-cream transition-colors group"
              >
                <Instagram size={16} className="text-gold group-hover:text-gold-light transition-colors" />
                @{instagramHandle}
              </a>
              <a
                href="mailto:contact@mailess.com"
                className="flex items-center gap-3 text-text-secondary text-sm hover:text-cream transition-colors group"
              >
                <Mail size={16} className="text-gold group-hover:text-gold-light transition-colors" />
                contact@mailess.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs font-sans">
            © {new Date().getFullYear()} Mailess M2S — Tous droits réservés
          </p>
          <div className="flex items-center gap-1">
            <div className="w-4 h-px bg-gold/40" />
            <span className="text-text-muted text-xs font-sans px-2">Beauté & Élégance</span>
            <div className="w-4 h-px bg-gold/40" />
          </div>
        </div>
      </div>
    </footer>
  )
}
