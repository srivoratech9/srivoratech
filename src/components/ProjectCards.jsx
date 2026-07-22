import { useState, useEffect, useCallback } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './ProjectCards.css'

const projects = [
  {
    id: 1,
    name: 'Narasimha Reddy',
    role: 'Founder & CEO of TFS',
    message: 'SriVoraTech built our fintech mobile app for loans and insurance, with live application tracking and a rewards + referral system.',
    reply: 'Loved building it with you.',
    color: '#6366f1',
    initial: 'N',
    type: 'fintech'
  },
  {
    id: 2,
    name: 'Sujith Reddy Gopu',
    role: 'Founder of Fluent Pro',
    message: 'SriVoraTech built Fluent Pro: an AI-powered English learning platform with instant, personalized feedback for students.',
    reply: 'Excited to support your impact.',
    color: '#f59e0b',
    initial: 'S',
    type: 'edtech'
  },
  {
    id: 3,
    name: 'Abhishek',
    role: 'Senior Business Analyst at Conquer',
    message: 'SriVoraTech built our B2B e-commerce platform with contract-based catalogues, client-specific SKUs, and dynamic discount programs.',
    reply: 'Proud to ship this together.',
    color: '#10b981',
    initial: 'A',
    type: 'ecommerce'
  },
  {
    id: 4,
    name: 'Aryan',
    role: 'Founder/CEO, PayAtom',
    message: 'SriVoraTech revamped payatom.com into a sleek, interactive fintech experience with Spline 3D elements and smooth scroll animations.',
    reply: 'Seamless payments, global reach.',
    color: '#ec4899',
    initial: 'A',
    type: 'payment'
  },
]

function ProjectMockup({ type, color }) {
  if (type === 'fintech') {
    return (
      <div className="mockup-container fintech-mockup">
        <div className="phone-frame">
          <div className="phone-screen">
            <div className="phone-notch" />
            <div className="phone-header">
              <span className="phone-time">9:41</span>
              <div className="phone-status-icons">
                <span className="phone-battery" />
              </div>
            </div>
            <div className="phone-app-content">
              <div className="app-bar">
                <span className="app-title">TFS Finance</span>
                <span className="app-bell">🔔</span>
              </div>
              <div className="app-card" style={{ background: `linear-gradient(135deg, ${color}, #4f46e5)` }}>
                <div className="card-top">
                  <span>Balance</span>
                  <span className="card-chip" />
                </div>
                <div className="card-amount">$12,450.00</div>
                <div className="card-bottom">
                  <span>**** 4890</span>
                  <span>VISA</span>
                </div>
              </div>
              <div className="app-section">
                <div className="section-header">
                  <span>Active Loan</span>
                  <span className="section-link">View</span>
                </div>
                <div className="progress-container">
                  <div className="progress-labels">
                    <span>Paid: $4,500</span>
                    <span>Remaining: $5,500</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '45%', background: color }} />
                  </div>
                </div>
              </div>
              <div className="app-rewards">
                <div className="rewards-badge" style={{ background: `${color}22`, color }}>
                  🎉 500 Referral Points Earned
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'edtech') {
    return (
      <div className="mockup-container edtech-mockup">
        <div className="browser-frame">
          <div className="browser-header">
            <div className="browser-dots">
              <span /><span /><span />
            </div>
            <div className="browser-url">fluentpro.ai/dashboard</div>
          </div>
          <div className="browser-screen">
            <div className="dashboard-sidebar">
              <div className="sidebar-logo">FP</div>
              <div className="sidebar-nav">
                <div className="nav-item active" style={{ color }} />
                <div className="nav-item" />
                <div className="nav-item" />
              </div>
            </div>
            <div className="dashboard-content">
              <div className="content-header">
                <h2>English Daily</h2>
                <div className="streak-badge">🔥 14 Days</div>
              </div>
              <div className="pronunciation-card">
                <div className="pronunciation-title">Pronunciation Score</div>
                <div className="score-radial">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" stroke={color} strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage" fill={color}>85%</text>
                  </svg>
                </div>
                <div className="voice-waves">
                  <span style={{ animationDelay: '0.1s', background: color }} />
                  <span style={{ animationDelay: '0.3s', background: color }} />
                  <span style={{ animationDelay: '0.2s', background: color }} />
                  <span style={{ animationDelay: '0.4s', background: color }} />
                  <span style={{ animationDelay: '0.5s', background: color }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'ecommerce') {
    return (
      <div className="mockup-container ecommerce-mockup">
        <div className="browser-frame">
          <div className="browser-header">
            <div className="browser-dots">
              <span /><span /><span />
            </div>
            <div className="browser-url">conquer-b2b.com/portal</div>
          </div>
          <div className="browser-screen">
            <div className="portal-header">
              <span>Client: Intel Corp</span>
              <span className="price-contract" style={{ color }}>Contract: Gold Tier</span>
            </div>
            <div className="portal-body">
              <div className="catalog-search">
                <div className="search-bar-mock" />
              </div>
              <div className="catalog-grid">
                <div className="catalog-item">
                  <div className="item-img-mock" style={{ background: `${color}15` }} />
                  <div className="item-details">
                    <span className="item-title">Xeon Processor</span>
                    <span className="item-sku">SKU-990-XP</span>
                    <div className="item-pricing">
                      <span className="item-old-price">$450</span>
                      <span className="item-new-price" style={{ color }}>$380</span>
                    </div>
                  </div>
                </div>
                <div className="catalog-item">
                  <div className="item-img-mock" style={{ background: `${color}15` }} />
                  <div className="item-details">
                    <span className="item-title">Core i9 CPU</span>
                    <span className="item-sku">SKU-775-CI</span>
                    <div className="item-pricing">
                      <span className="item-old-price">$310</span>
                      <span className="item-new-price" style={{ color }}>$275</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mockup-container payment-mockup">
      <div className="glass-card">
        <div className="glass-card-bg" style={{ background: `radial-gradient(circle at 80% 20%, ${color}aa, transparent)` }} />
        <div className="glass-card-content">
          <div className="glass-card-top">
            <span className="logo-atom">PayAtom</span>
            <span className="card-contactless">📶</span>
          </div>
          <div className="glass-card-middle">
            <span className="card-number">**** **** **** 8820</span>
            <div className="card-holder-row">
              <div className="card-holder">
                <span className="card-label">CARD HOLDER</span>
                <span className="card-val">ARYAN SINHA</span>
              </div>
              <div className="card-expiry">
                <span className="card-label">EXPIRES</span>
                <span className="card-val">09/30</span>
              </div>
            </div>
          </div>
          <div className="glass-card-bottom">
            <div className="live-badge">
              <span className="live-dot" />
              LIVE TRANSACTIONS
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectCards() {
  const [ref, isVisible] = useScrollAnimation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [direction, setDirection] = useState(1)

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }, [])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }, [])

  useEffect(() => {
    if (isHovering) return
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % projects.length)
    }, 2400)
    return () => clearInterval(timer)
  }, [isHovering])

  const project = projects[currentIndex]

  return (
    <section ref={ref} className={`project-cards-section animate-on-scroll ${isVisible ? 'visible' : ''}`}>
      <div
        className="project-cards-viewport"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="project-cards-stage">
          <div
            key={currentIndex}
            className={`project-card-active ${direction > 0 ? 'enter-left' : 'enter-right'}`}
          >
            <div className="project-card">
              <div className="project-card-banner" style={{ background: `linear-gradient(135deg, ${project.color}05, ${project.color}15)` }}>
                <ProjectMockup type={project.type} color={project.color} />
              </div>
              <div className="project-card-chat">
                <div className="chat-bubble chat-bubble-client">
                  <p className="chat-bubble-text">{project.message}</p>
                  <span className="chat-bubble-author">{project.name.split(' ')[0]}</span>
                </div>
                <div className="chat-bubble chat-bubble-reply">
                  <p className="chat-bubble-text">{project.reply}</p>
                  <span className="chat-bubble-author">SriVoraTech</span>
                </div>
              </div>
              <div className="project-card-person">
                <div className="project-card-avatar" style={{ background: project.color, color: '#fff' }}>
                  {project.initial}
                </div>
                <div className="project-card-info">
                  <p className="project-card-name">{project.name}</p>
                  <span className="project-card-role">{project.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="project-cards-nav">
          <button className="scroll-btn" onClick={goPrev} aria-label="Scroll left">←</button>
          <button className="scroll-btn" onClick={goNext} aria-label="Scroll right">→</button>
        </div>
      </div>
    </section>
  )
}
