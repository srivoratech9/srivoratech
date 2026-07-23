import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, Zap, Shield, Award, Cpu } from 'lucide-react'
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

    // Smooth progress animation
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
    }, 550)
  }

  if (isDismissed) return null

  return (
    <div className={`welcome-splash-overlay ${isDismissing ? 'splash-fade-out' : ''}`}>
      {/* Soft Light Ambient Glow Orbs */}
      <div className="splash-light-orb light-orb-1" />
      <div className="splash-light-orb light-orb-2" />
      <div className="splash-light-orb light-orb-3" />
      <div className="splash-light-grid" />

      <div className="splash-card-light animate-splash-card">
        {/* Top Welcome Badge */}
        <div className="splash-light-badge animate-splash-top">
          <Sparkles size={14} className="sparkle-gold" />
          <span>Official Portal &bull; SriVoraTech.in</span>
        </div>

        {/* Crisp Brand Title */}
        <div className="splash-brand-heading animate-splash-title">
          <h1 className="brand-title-text">
            SriVora<span className="brand-accent-blue">Tech</span><span className="brand-domain-sub">.in</span>
          </h1>
        </div>

        <p className="splash-light-subheading animate-splash-sub">
          Engineering Enterprise AI Solutions, Scalable Cloud Systems & Digital Innovation
        </p>

        {/* Professional Trust Feature Pills */}
        <div className="splash-pills-row animate-splash-features">
          <span className="light-feature-pill"><Zap size={13} className="pill-blue-icon" /> High Performance</span>
          <span className="light-feature-pill"><Shield size={13} className="pill-green-icon" /> Enterprise Security</span>
          <span className="light-feature-pill"><Award size={13} className="pill-gold-icon" /> 5.0 Star Rated Team</span>
        </div>

        {/* Progress Fill & Action Button */}
        <div className="splash-footer-light animate-splash-footer">
          <div className="splash-progress-track-light">
            <div className="splash-progress-fill-blue" style={{ width: `${progress}%` }} />
          </div>

          <div className="splash-bottom-bar">
            <span className="splash-loading-label">
              <Cpu size={14} className="cpu-spin-icon" /> Initializing Platform Modules... {progress}%
            </span>
            <button className="splash-explore-btn-light" onClick={triggerDismiss}>
              Explore Platform <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
