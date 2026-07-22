import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react'
import './Footer.css'

const companyLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Project Estimator', href: '#estimator' },
  { label: 'Tech Stack', href: '#tech-stack' },
  { label: 'Our Work', href: '#our-works' },
  { label: 'FAQs', href: '#faq' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { label: 'Email', href: 'mailto:contact@srivoratech.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'GitHub', href: 'https://github.com' },
]

export default function Footer() {
  const [ref, isVisible] = useScrollAnimation()
  const [subscribed, setSubscribed] = useState(false)
  const [emailInput, setEmailInput] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (emailInput) {
      setSubscribed(true)
      setEmailInput('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer ref={ref} className={`footer animate-on-scroll ${isVisible ? 'visible' : ''}`}>
      <div className="footer-bg-logo">
        <span className="footer-bg-text">SriVoraTech</span>
      </div>

      <div className="footer-grid container">
        {/* Column 1: Logo + tagline */}
        <div className="footer-col footer-brand">
          <a className="footer-logo" href="#home">
            <div className="logo-badge">
              <Zap size={16} />
            </div>
            <span className="logo-text">SriVora<span className="logo-accent">Tech</span></span>
          </a>
          <p className="footer-tagline">
            End-to-end digital product design, web engineering, and AI automation tailored to accelerate business growth.
          </p>
          <div className="footer-status-pill">
            <span className="pulse-ring" />
            <span>Accepting New Q3/Q4 Client Sprints</span>
          </div>
        </div>

        {/* Column 2: Quick Links + Socials */}
        <div className="footer-col footer-links-grid">
          <div>
            <h4 className="footer-heading">Navigation</h4>
            <div className="footer-link-list">
              {companyLinks.map((link) => (
                <a key={link.href} className="footer-link" href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Social Channels</h4>
            <div className="footer-link-list">
              {socialLinks.map((link) => (
                <a key={link.label} className="footer-link footer-social-link" href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <ArrowRight size={12} style={{ transform: 'rotate(-45deg)' }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Newsletter */}
        <div className="footer-col footer-newsletter">
          <h4 className="footer-heading">Tech Insights Newsletter</h4>
          <p className="footer-newsletter-desc">
            Subscribe for monthly engineering updates, tech stack teardowns, and design trends.
          </p>
          {subscribed ? (
            <div className="newsletter-success">
              <CheckCircle2 size={18} />
              <span>Subscribed! Thank you for joining.</span>
            </div>
          ) : (
            <form className="footer-form" onSubmit={handleNewsletterSubmit}>
              <span className="footer-form-at">@</span>
              <input
                type="email"
                placeholder="Enter work email..."
                className="footer-form-input"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <button type="submit" className="footer-form-btn" aria-label="Submit newsletter">
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom container">
        <p className="footer-copyright">© 2026 SriVoraTech Technologies. All rights reserved.</p>
        <div className="footer-legal">
          <a className="footer-legal-link" href="#privacy">Privacy Policy</a>
          <a className="footer-legal-link" href="#terms">Terms of Service</a>
          <a className="footer-legal-link" href="#security">Security</a>
        </div>
      </div>
    </footer>
  )
}
