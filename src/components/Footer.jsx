import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ArrowRight, Zap, CheckCircle2, Mail, Shield, FileText, Scale, Copyright, Heart } from 'lucide-react'
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

const servicesList = [
  'Custom Software Development',
  'Website Development',
  'Mobile App Development',
  'AI Chatbots & Automation',
  'ERP & CRM Solutions',
  'UI/UX Design',
  'Cloud & DevOps Solutions',
]

const socialLinks = [
  { label: 'Email Us', href: 'mailto:srivoratech9@gmail.com' },
  { label: 'WhatsApp Chat', href: 'https://wa.me/919182030946' },
  { label: 'Instagram', href: 'https://www.instagram.com/srivora_tech?igsh=MTg2eTZnczRuemJ6bg==' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/srikanthbadisa/' },
  { label: 'GitHub', href: 'https://github.com/srivoratech9' },
]

export default function Footer() {
  const [ref, isVisible] = useScrollAnimation()
  const [subscribed, setSubscribed] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [activeLegal, setActiveLegal] = useState(null)

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (emailInput) {
      setSubscribed(true)
      setEmailInput('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  const toggleLegal = (section) => {
    setActiveLegal(activeLegal === section ? null : section)
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
          <p className="footer-contact-email">
            <Mail size={14} /> srivoratech9@gmail.com
          </p>
          <div className="footer-status-pill">
            <span className="pulse-ring" />
            <span>Building Innovative Software • AI Solutions • Digital Experiences</span>
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

      {/* ── Legal Sections ── */}
      <div className="footer-legal-sections container">
        {/* Privacy Policy */}
        <div className={`legal-accordion ${activeLegal === 'privacy' ? 'open' : ''}`}>
          <button className="legal-accordion-btn" onClick={() => toggleLegal('privacy')}>
            <span className="legal-icon-label">
              <Shield size={16} /> Privacy Policy
            </span>
            <span className="legal-toggle">{activeLegal === 'privacy' ? '−' : '+'}</span>
          </button>
          {activeLegal === 'privacy' && (
            <div className="legal-content">
              <p className="legal-updated">Last Updated: July 2026</p>
              <p>At SriVoraTech, we respect your privacy and are committed to protecting your personal information. Any information you share through our website, contact forms, or project inquiries is used solely to communicate with you, provide our services, and improve your experience. We do not sell or share your personal information with third parties except when required by law or necessary to deliver our services.</p>
              <p>If you have any privacy-related questions, please contact us at:</p>
              <p className="legal-email"><Mail size={14} /> srivoratech9@gmail.com</p>
            </div>
          )}
        </div>

        {/* Terms of Service */}
        <div className={`legal-accordion ${activeLegal === 'terms' ? 'open' : ''}`}>
          <button className="legal-accordion-btn" onClick={() => toggleLegal('terms')}>
            <span className="legal-icon-label">
              <FileText size={16} /> Terms of Service
            </span>
            <span className="legal-toggle">{activeLegal === 'terms' ? '−' : '+'}</span>
          </button>
          {activeLegal === 'terms' && (
            <div className="legal-content">
              <p>By accessing or using SriVoraTech's website and services, you agree to our Terms of Service.</p>
              <p><strong>Our services include:</strong></p>
              <ul className="legal-list">
                {servicesList.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p>Clients are responsible for providing accurate project requirements, timely approvals, and payments according to the agreed proposal. All custom software is developed under the agreed project scope and terms.</p>
              <p className="legal-email"><Mail size={14} /> srivoratech9@gmail.com</p>
            </div>
          )}
        </div>

        {/* Security */}
        <div className={`legal-accordion ${activeLegal === 'security' ? 'open' : ''}`}>
          <button className="legal-accordion-btn" onClick={() => toggleLegal('security')}>
            <span className="legal-icon-label">
              <Shield size={16} /> Security
            </span>
            <span className="legal-toggle">{activeLegal === 'security' ? '−' : '+'}</span>
          </button>
          {activeLegal === 'security' && (
            <div className="legal-content">
              <p>At SriVoraTech, security is integrated into every stage of our software development process.</p>
              <p><strong>Our security practices include:</strong></p>
              <ul className="legal-list">
                <li>Secure Software Development</li>
                <li>Data Encryption</li>
                <li>Secure Authentication</li>
                <li>Cloud Security Best Practices</li>
                <li>Regular Security Updates</li>
                <li>Code Reviews</li>
                <li>Performance Monitoring</li>
                <li>Secure API Integration</li>
                <li>Role-Based Access Control</li>
                <li>Backup & Recovery</li>
              </ul>
              <p>If you discover a security issue, please report it responsibly.</p>
              <p className="legal-email"><Mail size={14} /> srivoratech9@gmail.com</p>
            </div>
          )}
        </div>

        {/* Copyright & IP */}
        <div className={`legal-accordion ${activeLegal === 'copyright' ? 'open' : ''}`}>
          <button className="legal-accordion-btn" onClick={() => toggleLegal('copyright')}>
            <span className="legal-icon-label">
              <Copyright size={16} /> Copyright & Intellectual Property
            </span>
            <span className="legal-toggle">{activeLegal === 'copyright' ? '−' : '+'}</span>
          </button>
          {activeLegal === 'copyright' && (
            <div className="legal-content">
              <p>© 2026 SriVoraTech. All Rights Reserved.</p>
              <p>All content, source code, software, designs, graphics, logos, trademarks, documentation, and digital assets on this website are the intellectual property of SriVoraTech unless otherwise stated.</p>
              <p>Unauthorized copying, reproduction, modification, distribution, reverse engineering, or commercial use of any content without prior written permission is strictly prohibited.</p>
              <h5>🛡 Intellectual Property Notice</h5>
              <p>All custom software, applications, AI solutions, websites, mobile apps, UI/UX designs, and proprietary technologies developed by SriVoraTech are protected under applicable intellectual property and copyright laws. Any unauthorized use, duplication, resale, or distribution of our proprietary work may result in legal action.</p>
            </div>
          )}
        </div>

        {/* Legal Notice */}
        <div className={`legal-accordion ${activeLegal === 'legal' ? 'open' : ''}`}>
          <button className="legal-accordion-btn" onClick={() => toggleLegal('legal')}>
            <span className="legal-icon-label">
              <Scale size={16} /> Legal Notice
            </span>
            <span className="legal-toggle">{activeLegal === 'legal' ? '−' : '+'}</span>
          </button>
          {activeLegal === 'legal' && (
            <div className="legal-content">
              <p>SriVoraTech reserves the right to modify, update, or discontinue any service or content on this website without prior notice.</p>
              <p>While we strive to provide accurate information, we do not guarantee that all content is complete, current, or error-free.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom container">
        <p className="footer-copyright">© 2026 SriVoraTech. All Rights Reserved.</p>
        <p className="footer-made-with">
          Designed & Developed with <Heart size={13} className="heart-icon" /> by SriVoraTech
        </p>
        <div className="footer-legal">
          <button className="footer-legal-link" onClick={() => toggleLegal('privacy')}>Privacy Policy</button>
          <button className="footer-legal-link" onClick={() => toggleLegal('terms')}>Terms of Service</button>
          <button className="footer-legal-link" onClick={() => toggleLegal('security')}>Security</button>
        </div>
      </div>
    </footer>
  )
}
