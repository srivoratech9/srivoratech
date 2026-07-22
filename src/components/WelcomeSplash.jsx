import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, Zap, ShieldCheck } from 'lucide-react'
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

    // Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            triggerDismiss()
          }, 200)
          return 100
        }
        return prev + 5
      })
    }, 45)

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
      {/* 3D Dynamic Ambient Light Beam Orbs */}
      <div className="splash-light-beam beam-1" />
      <div className="splash-light-beam beam-2" />
      <div className="splash-grid-dots" />

      <div className="splash-content-container">
        {/* Top Welcome Pill */}
        <div className="splash-welcome-pill animate-splash-top">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Welcome to SriVoraTech.in</span>
        </div>

        {/* 3D Cinematic Movie Title Effect */}
        <div className="splash-title-3d-wrapper animate-splash-title">
          <h1 className="splash-3d-logo" data-text="SriVoraTech.in">
            SriVora<span className="logo-accent">Tech</span><span className="logo-domain">.in</span>
          </h1>
          <div className="splash-3d-reflection">SriVoraTech.in</div>
        </div>

        <p className="splash-tagline animate-splash-sub">
          Engineering the Future of AI & Digital Product Innovation
        </p>

        {/* Progress Bar & Skip Button */}
        <div className="splash-footer-group animate-splash-footer">
          <div className="splash-progress-bar-bg">
            <div className="splash-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="splash-status-row">
            <span className="splash-status-text">
              <Zap size={13} className="live-zap" /> Loading Sprints 60fps... {progress}%
            </span>
            <button className="splash-skip-btn" onClick={triggerDismiss}>
              Explore Platform <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
