import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, Zap, Shield, Rocket, Award, Cpu, CheckCircle2 } from 'lucide-react'
import './WelcomeSplash.css'

export default function WelcomeSplash({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isDismissing, setIsDismissing] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check session storage if splash was already shown
    const splashSeen = sessionStorage.getItem('svt_splash_seen')
    if (splashSeen === 'true') {
      setIsDismissed(true)
      if (onComplete) onComplete()
      return
    }

    // Smooth Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            triggerDismiss()
          }, 250)
          return 100
        }
        return prev + 4
      })
    }, 35)

    return () => clearInterval(interval)
  }, [])

  const triggerDismiss = () => {
    if (isDismissing) return
    setIsDismissing(true)
    sessionStorage.setItem('svt_splash_seen', 'true')
    setTimeout(() => {
      setIsDismissed(true)
      if (onComplete) onComplete()
    }, 600)
  }

  if (isDismissed) return null

  return (
    <div className={`welcome-splash-overlay ${isDismissing ? 'splash-fade-out' : ''}`}>
      {/* Dynamic Glassmorphism Mesh Glow Orbs */}
      <div className="splash-orb orb-primary" />
      <div className="splash-orb orb-secondary" />
      <div className="splash-orb orb-tertiary" />
      <div className="splash-grid-pattern" />

      <div className="splash-content-box">
        {/* Top Welcome Pill Badge */}
        <div className="splash-pill-badge animate-splash-top">
          <Sparkles size={14} className="sparkle-spin" />
          <span>Official Digital Portal &bull; SriVoraTech.in</span>
        </div>

        {/* 3D Main Title Banner */}
        <div className="splash-brand-title animate-splash-title">
          <h1 className="brand-logo-text">
            SriVora<span className="brand-accent">Tech</span><span className="brand-domain">.in</span>
          </h1>
          <div className="brand-glow-reflection">SriVoraTech.in</div>
        </div>

        <p className="splash-tagline animate-splash-sub">
          Engineering Scalable AI Systems, Cloud Web Applications & Next-Gen Digital Products
        </p>

        {/* Value Highlights Pill Row */}
        <div className="splash-features-row animate-splash-features">
          <span className="feature-pill"><Zap size={13} /> High Performance</span>
          <span className="feature-pill"><Shield size={13} /> Enterprise Security</span>
          <span className="feature-pill"><Award size={13} /> 5.0 Star Rated Team</span>
        </div>

        {/* Progress Fill & Action Button */}
        <div className="splash-loading-group animate-splash-footer">
          <div className="splash-progress-track">
            <div className="splash-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="splash-action-row">
            <span className="splash-loading-status">
              <Cpu size={14} className="cpu-pulse-icon" /> Initializing Platform Modules... {progress}%
            </span>
            <button className="splash-enter-btn" onClick={triggerDismiss}>
              Explore Platform <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
