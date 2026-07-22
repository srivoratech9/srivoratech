import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ArrowRight, Sparkles, Shield, Rocket, Flame } from 'lucide-react'
import './PreFooterCTA.css'

const marqueeItems = [
  'React.js 18',
  'Next.js 14',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'FastAPI',
  'Python AI',
  'PostgreSQL',
  'Redis Cache',
  'AWS Cloud',
  'Docker CI/CD',
  'GraphQL',
]

export default function PreFooterCTA() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section className="pre-footer-cta" id="cta-section">
      <div className="container">
        <div ref={ref} className={`pre-footer-card animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="cta-orb orb-cta-1" />
          <div className="cta-orb orb-cta-2" />

          <div className="cta-content-inner">
            <div className="cta-status-pill">
              <Flame size={14} className="flame-icon" />
              <span>Only 2 Sprint Slots Open for Q3 2026</span>
            </div>

            <h2 className="pre-footer-title">
              Let's Turn Your Vision into a <span className="gradient-text">Market Leader</span>
            </h2>

            <p className="pre-footer-subtitle">
              Book a 30-minute discovery session with our lead architects to walk through your product roadmap, design system, and timeline.
            </p>

            <div className="cta-actions-row">
              <a href="#contact" className="btn-accent cta-main-btn">
                Book a 30-Min Call
                <ArrowRight size={18} />
              </a>

              <a href="#estimator" className="btn-secondary-dark">
                Estimate Project in 60s
              </a>
            </div>

            <div className="cta-trust-list">
              <span><Rocket size={14} /> 2-Week MVP Delivery</span>
              <span><Shield size={14} /> 100% IP Code Ownership</span>
              <span>⚡ Fixed-Price Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Ticker */}
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="marquee-item">
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
