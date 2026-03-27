'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Prestations', href: '/#prestations' },
  { label: 'À Propos', href: '/#apropos' },
  { label: 'Instagram', href: '/#instagram' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-gold/60 flex items-center justify-center group-hover:border-gold transition-colors">
            <span className="font-serif text-gold text-sm font-medium">M</span>
          </div>
          <span className="font-serif text-cream text-lg tracking-wide">
            Mailess <span className="text-gold">M2S</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-secondary text-sm font-sans hover:text-cream transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link href="/booking" className="btn-primary text-xs py-2 px-6">
            Réserver
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-cream p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-b border-border px-6 py-6">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary font-sans hover:text-cream transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/booking" className="btn-primary w-full justify-center mt-2" onClick={() => setMenuOpen(false)}>
              Réserver un Rendez-vous
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
