import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ArrowRight, Zap, MousePointer2, Figma } from 'lucide-react'
import './Hero.css'

export default function Hero() {
  const [ref1, vis1] = useScrollAnimation()
  const [ref2, vis2] = useScrollAnimation()
  const [ref3, vis3] = useScrollAnimation()
  const [ref4, vis4] = useScrollAnimation()
  const [ref5, vis5] = useScrollAnimation()
  const [ref6, vis6] = useScrollAnimation()

  return (
    <section id="home" className="hero">
      {/* Background ambient glowing orbs */}
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />

      {/* Dot pattern bg */}
      <div className="hero-dots" />

      {/* Announcement badge */}
      <div ref={ref1} className={`animate-on-scroll ${vis1 ? 'visible' : ''}`}>
        <a className="hero-badge" href="#contact">
          <span className="pulse-ring" />
          <span className="hero-badge-text">Always open slots available!</span>
          <span className="hero-badge-arrow">
            <ArrowRight size={14} />
          </span>
        </a>
      </div>

      {/* Main content row */}
      <div className="hero-content-row">
        {/* Left testimonial */}
        <div className="hero-testimonial-left">
          <div className="hero-testimonial-card hero-card-left">
            <div className="hero-testimonial-bg" />
            <div className="hero-testimonial-inner">
              <div className="hero-testimonial-top">
                <p className="hero-testimonial-quote">
                  "SriVoraTech transformed our business idea into a modern, scalable web application with exceptional quality and transparent communication throughout the project."
                </p>
                <span className="hero-quote-icon">"</span>
              </div>
              <span className="hero-testimonial-author">- Badisa.Srikanth Founder, SVT</span>
            </div>
          </div>
        </div>

        {/* Center hero content */}
        <div className="hero-center">
          <h1 ref={ref2} className={`hero-title animate-on-scroll ${vis2 ? 'visible' : ''}`}>
            <span className="hero-title-line">
              World-class Tech Partner
              <span className="hero-icon-badge rotate-12">
                <MousePointer2 size={18} />
              </span>
              <span className="hero-icon-badge rotate-neg-12">
                <Figma size={18} />
              </span>
            </span>
            <span className="hero-title-line">
              Engineering Your Digital
              <span className="hero-icon-badge rotate-12">
                <Zap size={18} />
              </span>
              {' '}Success
            </span>
          </h1>

          <h1 ref={ref3} className={`hero-title-mobile animate-on-scroll ${vis3 ? 'visible' : ''}`}>
            World-class Tech Partner, Engineering Your Digital Success
          </h1>

          <p ref={ref4} className={`hero-subtitle animate-on-scroll delay-1 ${vis4 ? 'visible' : ''}`}>
            We help startups & B2B enterprises move from vision to reality, and beyond. One hand on design, the other on development.
          </p>

          <div ref={ref5} className={`hero-cta-row animate-on-scroll delay-2 ${vis5 ? 'visible' : ''}`}>
            <a href="#contact" className="hero-cta-btn">
              <div className="hero-cta-avatars">
                <div className="hero-cta-avatar hero-cta-avatar-logo">S</div>
                <span className="hero-cta-plus">+</span>
                <div className="hero-cta-avatar hero-cta-avatar-you">You</div>
              </div>
              Book a 30-Min call
            </a>
          </div>

          <div ref={ref6} className={`hero-social-proof animate-on-scroll delay-3 ${vis6 ? 'visible' : ''}`}>
            <div className="hero-avatars-stack">
              <div className="hero-avatar" style={{ background: '#0067f4', color: '#fff' }}>S</div>
              <div className="hero-avatar" style={{ background: '#8b5cf6', color: '#fff' }}>V</div>
              <div className="hero-avatar" style={{ background: '#10b981', color: '#fff' }}>T</div>
              <span className="hero-avatar-count">+02</span>
            </div>

            <div className="hero-rating">
              <div className="hero-stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="15" height="15" fill="currentColor" viewBox="0 0 20 20" className="hero-star">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                ))}
              </div>
              <span className="hero-review-text">From 02+ reviews</span>
            </div>
          </div>
        </div>

        {/* Right testimonial */}
        <div className="hero-testimonial-right">
          <div className="hero-testimonial-card hero-card-right">
            <div className="hero-testimonial-bg-r" />
            <div className="hero-testimonial-inner">
              <div className="hero-testimonial-top">
                <p className="hero-testimonial-quote">
                  "SriVoraTech brought our AI-powered English learning platform to life with personalized feedback."
                </p>
                <span className="hero-quote-icon">"</span>
              </div>
              <span className="hero-testimonial-author">- Sai manindra CTO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
