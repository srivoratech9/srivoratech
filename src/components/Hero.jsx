import { useState, useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ArrowRight, Zap, MousePointer2, Figma, Shield, Clock, Rocket, Sparkles, Cpu, Globe, Palette } from 'lucide-react'
import HeroCanvas from './HeroCanvas'
import './Hero.css'

const colorThemes = [
  { id: 'sapphire', label: 'Sapphire Electric', gradient: 'linear-gradient(135deg, #0067f4 0%, #6366f1 100%)', textGrad: 'linear-gradient(135deg, #0067f4, #8b5cf6, #ec4899)' },
  { id: 'sunset', label: 'Neon Sunset', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', textGrad: 'linear-gradient(135deg, #f59e0b, #ef4444, #f97316)' },
  { id: 'emerald', label: 'Cyber Emerald', gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', textGrad: 'linear-gradient(135deg, #10b981, #06b6d4, #3b82f6)' },
  { id: 'cosmic', label: 'Cosmic Violet', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', textGrad: 'linear-gradient(135deg, #8b5cf6, #ec4899, #6366f1)' },
]

export default function Hero() {
  const [ref1, vis1] = useScrollAnimation()
  const [ref2, vis2] = useScrollAnimation()
  const [ref3, vis3] = useScrollAnimation()
  const [ref4, vis4] = useScrollAnimation()
  const [ref5, vis5] = useScrollAnimation()
  const [ref6, vis6] = useScrollAnimation()

  const [colorMode, setColorMode] = useState('sapphire')
  const [activeHeroTab, setActiveHeroTab] = useState('fintech')
  const [ratingStats, setRatingStats] = useState({ averageRating: 5.0, totalCount: 15 })

  useEffect(() => {
    const fetchRatingStats = async () => {
      try {
        const res = await fetch('/api/reviews')
        const data = await res.json()
        if (data.success) {
          setRatingStats({
            averageRating: data.averageRating,
            totalCount: data.totalCount
          })
        }
      } catch (e) {
        // fallback
      }
    }
    fetchRatingStats()
    const timer = setInterval(fetchRatingStats, 10000)
    return () => clearInterval(timer)
  }, [])

  const currentTheme = colorThemes.find(t => t.id === colorMode) || colorThemes[0]

  return (
    <section id="home" className={`hero hero-theme-${colorMode}`}>
      {/* Background Particle Physics Canvas */}
      <HeroCanvas colorMode={colorMode} />

      {/* Ambient background glow orbs */}
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />

      {/* Dot pattern background overlay */}
      <div className="hero-dots" />

      {/* Announcement & Color Theme Switcher Pill */}
      <div ref={ref1} className={`hero-top-bar-group animate-on-scroll ${vis1 ? 'visible' : ''}`}>
        <a className="hero-badge" href="#estimator">
          <span className="pulse-ring" />
          <span className="hero-badge-text">Engineering the Future of Digital Innovation</span>
          <span className="hero-badge-arrow">
            <ArrowRight size={14} />
          </span>
        </a>

        {/* Color Theme Selector Pills */}
        <div className="hero-theme-selector">
          <Palette size={13} className="palette-icon" />
          {colorThemes.map(t => (
            <button
              key={t.id}
              className={`theme-dot ${colorMode === t.id ? 'active' : ''}`}
              style={{ background: t.gradient }}
              onClick={() => setColorMode(t.id)}
              title={`Switch to ${t.label}`}
              aria-label={`Switch to ${t.label}`}
            />
          ))}
        </div>
      </div>

      {/* Center hero content */}
      <div className="hero-center">
        <h1 ref={ref2} className={`hero-title animate-on-scroll ${vis2 ? 'visible' : ''}`}>
          <span className="hero-title-line">
            Transforming Ideas into
            <span className="hero-icon-badge rotate-12" title="UI/UX Design Systems">
              <MousePointer2 size={18} />
            </span>
            <span className="hero-icon-badge rotate-neg-12" title="Figma Precision">
              <Figma size={18} />
            </span>
          </span>
          <span className="hero-title-line">
            Powerful
            <span className="hero-gradient-badge" style={{ backgroundImage: currentTheme.textGrad }}>
              <Sparkles size={16} /> Digital Products
            </span>
          </span>
        </h1>

        <h1 ref={ref3} className={`hero-title-mobile animate-on-scroll ${vis3 ? 'visible' : ''}`}>
          Transforming Ideas into Powerful Digital Products
        </h1>

        <p ref={ref4} className={`hero-subtitle animate-on-scroll delay-1 ${vis4 ? 'visible' : ''}`}>
          We help startups, growing businesses, and enterprises build secure, scalable, and AI-powered websites, web applications, mobile apps, and enterprise software that accelerate growth and deliver measurable business value.
        </p>

        {/* Value proposition badges */}
        <div className="hero-trust-badges">
          <span className="trust-pill"><Rocket size={14} /> 2-Week MVP Delivery</span>
          <span className="trust-pill"><Shield size={14} /> 100% IP Ownership</span>
          <span className="trust-pill"><Clock size={14} /> 99.8% On-Time Track</span>
        </div>

        <div ref={ref5} className={`hero-cta-row animate-on-scroll delay-2 ${vis5 ? 'visible' : ''}`}>
          <a href="#contact" className="btn-primary hero-main-btn">
            Book a 30-Min Call
            <span className="btn-icon">
              <ArrowRight size={18} style={{ transform: 'rotate(-45deg)' }} />
            </span>
          </a>

          <a href="#estimator" className="btn-secondary-light">
            Estimate Scope in 60s
          </a>
        </div>

        {/* Social Proof Row */}
        <div ref={ref6} className={`hero-social-proof animate-on-scroll delay-3 ${vis6 ? 'visible' : ''}`}>
          <div className="hero-avatars-stack" title="Badisa Srikanth (Founder & CEO), Narasimha Reddy, Sujith Reddy">
            <div className="hero-avatar" style={{ background: '#0067f4', color: '#fff', fontWeight: 800 }}>B</div>
            <div className="hero-avatar" style={{ background: '#8b5cf6', color: '#fff', fontWeight: 800 }}>N</div>
            <div className="hero-avatar" style={{ background: '#10b981', color: '#fff', fontWeight: 800 }}>S</div>
            <span className="hero-avatar-count">+03</span>
          </div>

          <a href="#website-rating" className="hero-rating" title="View Community Star Ratings">
            <div className="hero-stars">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="15" height="15" fill={i < Math.round(ratingStats.averageRating) ? "#f59e0b" : "currentColor"} viewBox="0 0 20 20" className="hero-star" style={{ color: i < Math.round(ratingStats.averageRating) ? "#f59e0b" : "#cbd5e1" }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              ))}
            </div>
            <span className="hero-review-text">Rated {ratingStats.averageRating}/5 ({ratingStats.totalCount} Approved Reviews)</span>
          </a>
        </div>

        {/* Interactive Live Product Preview Widget */}
        <div className="hero-live-preview glass-card">
          <div className="preview-top-bar">
            <div className="preview-dots"><span /><span /><span /></div>
            <div className="preview-tabs">
              <button
                className={`p-tab ${activeHeroTab === 'fintech' ? 'active' : ''}`}
                onClick={() => setActiveHeroTab('fintech')}
              >
                <Globe size={13} /> Fintech App
              </button>
              <button
                className={`p-tab ${activeHeroTab === 'ai' ? 'active' : ''}`}
                onClick={() => setActiveHeroTab('ai')}
              >
                <Cpu size={13} /> AI Engine
              </button>
              <button
                className={`p-tab ${activeHeroTab === 'b2b' ? 'active' : ''}`}
                onClick={() => setActiveHeroTab('b2b')}
              >
                <Zap size={13} /> B2B Portal
              </button>
            </div>
            <div className="preview-status">
              <span className="live-dot" /> LIVE 60fps
            </div>
          </div>

          <div className="preview-body">
            {activeHeroTab === 'fintech' && (
              <div className="preview-screen fintech-screen">
                <div className="preview-stat-card">
                  <span className="stat-title">Quarterly Loans Volume</span>
                  <strong className="stat-num">$12,450,000</strong>
                  <span className="stat-growth">+142% vs last Q</span>
                </div>
                <div className="preview-stat-card alt-card">
                  <span className="stat-title">Active Subscribers</span>
                  <strong className="stat-num">48,920</strong>
                  <span className="stat-growth green-growth">Live Sync</span>
                </div>
              </div>
            )}

            {activeHeroTab === 'ai' && (
              <div className="preview-screen ai-screen">
                <div className="ai-wave-box">
                  <div className="ai-prompt-line">
                    <span className="ai-sparkle">✨</span>
                    <span>"Analyzing English voice pronunciation score..."</span>
                  </div>
                  <div className="ai-score-pill">98.4% Accuracy</div>
                </div>
                <div className="ai-wave-bars">
                  <span className="w-bar" style={{ height: '60%' }} />
                  <span className="w-bar" style={{ height: '90%' }} />
                  <span className="w-bar" style={{ height: '40%' }} />
                  <span className="w-bar" style={{ height: '100%' }} />
                  <span className="w-bar" style={{ height: '75%' }} />
                </div>
              </div>
            )}

            {activeHeroTab === 'b2b' && (
              <div className="preview-screen b2b-screen">
                <div className="b2b-row">
                  <span>Contract: Gold Tier</span>
                  <strong className="b2b-badge">SAP ERP Synced</strong>
                </div>
                <div className="b2b-grid-mini">
                  <div className="b2b-item-mini">SKU-990-XP • $380 (Bulk Rate)</div>
                  <div className="b2b-item-mini">SKU-775-CI • $275 (Contract)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
