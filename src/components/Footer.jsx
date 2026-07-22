import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ArrowRight } from 'lucide-react'
import './Footer.css'

const companyLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Our Work', href: '#our-works' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'FAQs', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { label: 'Email', href: 'mailto:team@srivoratech.com' },
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
]

export default function Footer() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <footer ref={ref} className={`footer animate-on-scroll ${isVisible ? 'visible' : ''}`}>
      <div className="footer-bg-logo">
        <span className="footer-bg-text">SriVoraTech</span>
      </div>

      <div className="footer-grid">
        {/* Column 1: Logo + tagline */}
        <div className="footer-col footer-brand">
          <a className="footer-logo" href="#home">
            <span className="logo-text">SriVora<span className="logo-accent">Tech</span></span>
          </a>
          <p className="footer-tagline">
            Strategic web design, and campaigns tailored to drive results and conversions.
          </p>
        </div>

        {/* Column 2: Company + Socials */}
        <div className="footer-col footer-links-grid">
          <div>
            <h4 className="footer-heading">Company</h4>
            <div className="footer-link-list">
              {companyLinks.map((link) => (
                <a key={link.href} className="footer-link" href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Socials</h4>
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
          <h4 className="footer-heading">Newsletter</h4>
          <p className="footer-newsletter-desc">
            Stay ahead with design & marketing tips and strategies that drive results.
          </p>
          <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
            <span className="footer-form-at">@</span>
            <input
              type="email"
              placeholder="Enter your email..."
              className="footer-form-input"
            />
            <button type="submit" className="footer-form-btn" aria-label="Submit newsletter">
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">©2025 SriVoraTech All rights reserved</p>
        <div className="footer-legal">
          <a className="footer-legal-link" href="#">Privacy Policy</a>
          <a className="footer-legal-link" href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
