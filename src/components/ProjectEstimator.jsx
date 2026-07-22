import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Calculator, ArrowRight, CheckCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react'
import './ProjectEstimator.css'

const projectTypes = [
  { id: 'web-app', name: 'Web Application', baseCost: 75000, weeks: 4, icon: '🌐' },
  { id: 'mobile-app', name: 'Mobile App (iOS/Android)', baseCost: 95000, weeks: 6, icon: '📱' },
  { id: 'ai-solution', name: 'AI Chatbot / Automation', baseCost: 65000, weeks: 3, icon: '🤖' },
  { id: 'erp-crm', name: 'Enterprise ERP / CRM', baseCost: 150000, weeks: 8, icon: '🏢' },
  { id: 'uiux-redesign', name: 'UI/UX & Design System', baseCost: 45000, weeks: 2, icon: '🎨' },
]

const addOnFeatures = [
  { id: 'auth', name: 'User Auth & Role Control', cost: 15000, addWeeks: 0.5 },
  { id: 'payments', name: 'Payment Gateway Sync', cost: 20000, addWeeks: 1 },
  { id: 'ai-engine', name: 'AI Voice / LLM Pipeline', cost: 35000, addWeeks: 1.5 },
  { id: 'admin-panel', name: 'Custom Admin Dashboard', cost: 25000, addWeeks: 1 },
  { id: 'realtime', name: 'Real-time WebSockets', cost: 20000, addWeeks: 1 },
]

const timelines = [
  { id: 'express', label: 'Rush Sprint (2-4 Weeks)', multiplier: 1.25, badge: '⚡ High Priority' },
  { id: 'standard', label: 'Standard Pace (6-8 Weeks)', multiplier: 1.0, badge: '⭐ Recommended' },
  { id: 'flexible', label: 'Flexible Enterprise', multiplier: 0.95, badge: '🛡️ Structured' },
]

export default function ProjectEstimator() {
  const [ref, isVisible] = useScrollAnimation()
  const [selectedType, setSelectedType] = useState(projectTypes[0])
  const [selectedFeatures, setSelectedFeatures] = useState(['auth', 'admin-panel'])
  const [selectedTimeline, setSelectedTimeline] = useState(timelines[1])

  const toggleFeature = (id) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== id))
    } else {
      setSelectedFeatures([...selectedFeatures, id])
    }
  }

  // Calculation logic
  const featureCost = selectedFeatures.reduce((acc, featId) => {
    const feat = addOnFeatures.find(f => f.id === featId)
    return acc + (feat ? feat.cost : 0)
  }, 0)

  const featureWeeks = selectedFeatures.reduce((acc, featId) => {
    const feat = addOnFeatures.find(f => f.id === featId)
    return acc + (feat ? feat.addWeeks : 0)
  }, 0)

  const rawCost = (selectedType.baseCost + featureCost) * selectedTimeline.multiplier
  const totalWeeks = Math.ceil((selectedType.weeks + featureWeeks))

  const formattedCostMin = Math.round(rawCost * 0.9).toLocaleString('en-IN')
  const formattedCostMax = Math.round(rawCost * 1.15).toLocaleString('en-IN')

  const handleSendToContact = () => {
    const featureNames = selectedFeatures
      .map(id => addOnFeatures.find(f => f.id === id)?.name)
      .filter(Boolean)
      .join(', ')

    const message = `Project Estimate Request:
- Type: ${selectedType.name}
- Selected Features: ${featureNames || 'None'}
- Speed: ${selectedTimeline.label}
- Estimated Timeline: ${totalWeeks} Weeks
- Estimated Budget Range: ₹${formattedCostMin} - ₹${formattedCostMax}`

    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => {
        const messageInput = document.querySelector('textarea[name="message"]')
        if (messageInput) {
          messageInput.value = message
          messageInput.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }, 500)
    }
  }

  return (
    <section className="estimator-section section" id="estimator">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="estimator-badge">
            <Calculator size={14} />
            Instant Project Calculator
          </div>
          <h2 className="section-title">
            Estimate Your Project in <span className="gradient-text">60 Seconds</span>
          </h2>
          <p className="section-subtitle">
            Configure your scope, features, and target timeline for an instant transparent estimation.
          </p>
        </div>

        <div className="estimator-card glass-card">
          <div className="estimator-grid">
            {/* Left Controls */}
            <div className="estimator-controls">
              {/* Step 1: Select Type */}
              <div className="control-step">
                <div className="step-header">
                  <span className="step-num">1</span>
                  <h3>Select Project Category</h3>
                </div>
                <div className="type-options">
                  {projectTypes.map(type => (
                    <button
                      key={type.id}
                      className={`type-btn ${selectedType.id === type.id ? 'active' : ''}`}
                      onClick={() => setSelectedType(type)}
                    >
                      <span className="type-icon">{type.icon}</span>
                      <span className="type-name">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Add-on Features */}
              <div className="control-step">
                <div className="step-header">
                  <span className="step-num">2</span>
                  <h3>Select Key Features</h3>
                </div>
                <div className="feature-checkboxes">
                  {addOnFeatures.map(feat => {
                    const checked = selectedFeatures.includes(feat.id)
                    return (
                      <button
                        key={feat.id}
                        className={`feature-btn ${checked ? 'checked' : ''}`}
                        onClick={() => toggleFeature(feat.id)}
                      >
                        <CheckCircle size={16} className="check-icon" />
                        <span>{feat.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 3: Timeline */}
              <div className="control-step">
                <div className="step-header">
                  <span className="step-num">3</span>
                  <h3>Delivery Velocity</h3>
                </div>
                <div className="timeline-options">
                  {timelines.map(tl => (
                    <button
                      key={tl.id}
                      className={`timeline-btn ${selectedTimeline.id === tl.id ? 'active' : ''}`}
                      onClick={() => setSelectedTimeline(tl)}
                    >
                      <span className="tl-badge">{tl.badge}</span>
                      <span className="tl-label">{tl.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="estimator-summary">
              <div className="summary-card-inner">
                <div className="summary-header">
                  <Sparkles size={20} className="sparkle-icon" />
                  <h4>Project Estimation Summary</h4>
                </div>

                <div className="summary-line-items">
                  <div className="summary-item">
                    <span>Base Scope</span>
                    <strong>{selectedType.name}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Add-on Features</span>
                    <strong>{selectedFeatures.length} Selected</strong>
                  </div>
                  <div className="summary-item">
                    <span>Pacing</span>
                    <strong>{selectedTimeline.label.split(' ')[0]} Pace</strong>
                  </div>
                </div>

                <div className="summary-divider" />

                <div className="summary-output">
                  <div className="output-box">
                    <span className="output-label">Estimated Duration</span>
                    <span className="output-value text-accent">~{totalWeeks} Weeks</span>
                  </div>
                  <div className="output-box">
                    <span className="output-label">Estimated Investment</span>
                    <span className="output-value">₹{formattedCostMin} – ₹{formattedCostMax}</span>
                  </div>
                </div>

                <p className="summary-guarantee">
                  <ShieldCheck size={16} /> 100% Fixed-Price Guarantee & IP Ownership Included
                </p>

                <button className="btn-accent summary-cta" onClick={handleSendToContact}>
                  Send Estimate & Book Call
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
