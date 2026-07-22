import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, Zap } from 'lucide-react'
import './Navbar.css'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Estimator', href: '#estimator' },
  { label: 'Tech Stack', href: '#tech-stack' },
  { label: 'Our Work', href: '#our-works' },
  { label: 'FAQs', href: '#faq' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      {/* Desktop logo left */}
      <a className="navbar-logo-left" href="#home">
        <div className="logo-badge">
          <Zap size={16} className="logo-icon" />
        </div>
        <div className="logo-text">
          SriVora<span className="logo-accent">Tech</span>
        </div>
      </a>

      {/* Center nav pill */}
      <div className={`navbar-pill ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-pill-inner">
          {/* Mobile logo */}
          <a className="navbar-logo-mobile" href="#home">
            <div className="logo-text-sm">
              SriVora<span className="logo-accent">Tech</span>
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <a key={link.href} className="navbar-link" href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="navbar-mobile-menu">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="navbar-mobile-link"
                href={link.href}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="#contact" className="btn-primary mobile-cta" onClick={() => setMobileOpen(false)}>
              Book a Call
              <span className="btn-icon">
                <ArrowRight size={16} style={{ transform: 'rotate(-45deg)' }} />
              </span>
            </a>
          </div>
        )}
      </div>

      {/* Desktop CTA right */}
      <div className="navbar-cta-right">
        <a href="#contact" className="btn-primary">
          Book a Call
          <span className="btn-icon">
            <ArrowRight size={16} style={{ transform: 'rotate(-45deg)' }} />
          </span>
        </a>
      </div>
    </div>
  )
}
