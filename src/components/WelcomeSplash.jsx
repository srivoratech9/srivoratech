import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import './WelcomeSplash.css'

export default function WelcomeSplash({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isDismissing, setIsDismissing] = useState(false)

  useEffect(() => {
    // Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 4
      })
    }, 40)

    // Auto dismiss splash screen after 2.4s
    const timer = setTimeout(() => {
      handleDismiss()
    }, 2400)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissing(true)
    setTimeout(() => {
      if (onComplete) onComplete()
    }, 600)
  }

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
            <button className="splash-skip-btn" onClick={handleDismiss}>
              Explore Platform <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
