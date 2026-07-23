import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Calculator, ArrowRight, CheckCircle, ShieldCheck, Zap, Sparkles, FileText } from 'lucide-react'
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
  const [currency, setCurrency] = useState('INR') // 'INR' or 'USD'

  const exchangeRate = 83.5

  const formatPrice = (inrAmount) => {
    if (currency === 'USD') {
      const usdVal = Math.round(inrAmount / exchangeRate)
      return `$${usdVal.toLocaleString('en-US')}`
    }
    return `₹${Math.round(inrAmount).toLocaleString('en-IN')}`
  }

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

  const formattedCostMin = formatPrice(rawCost * 0.9)
  const formattedCostMax = formatPrice(rawCost * 1.15)

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
- Estimated Budget Range: ${formattedCostMin} - ${formattedCostMax}`

    // Map calculated cost to a category in Contact form selection
    let mappedBudget = "Let's Discuss"
    if (rawCost < 50000) {
      mappedBudget = 'Under ₹50,000'
    } else if (rawCost >= 50000 && rawCost <= 100000) {
      mappedBudget = '₹50,000 - ₹1,00,000'
    } else if (rawCost > 100000 && rawCost <= 500000) {
      mappedBudget = '₹1,00,000 - ₹5,00,000'
    } else if (rawCost > 500000 && rawCost <= 1000000) {
      mappedBudget = '₹5,00,000 - ₹10,00,000'
    } else if (rawCost > 1000000) {
      mappedBudget = '₹10,00,000+'
    }

    // Scroll to contact section
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }

    // Dispatch custom event to populate Contact.jsx state cleanly
    const event = new CustomEvent('svt_populate_estimate', {
      detail: { message, budget: mappedBudget }
    })
    window.dispatchEvent(event)
  }

  const handleDownloadPDFEstimate = () => {
    const featureNames = selectedFeatures
      .map(id => addOnFeatures.find(f => f.id === id)?.name)
      .filter(Boolean)
      .join(', ') || 'Standard Core Architecture'

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SriVoraTech Project Estimate Proposal</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0067f4; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 800; color: #0067f4; letter-spacing: -0.5px; }
          .sub { font-size: 12px; color: #64748b; margin-top: 4px; }
          .date { font-size: 13px; color: #64748b; font-weight: 600; }
          .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th { background: #f8fafc; text-align: left; padding: 12px 16px; border: 1px solid #e2e8f0; font-size: 12px; text-transform: uppercase; color: #475569; }
          .table td { padding: 14px 16px; border: 1px solid #e2e8f0; font-size: 14px; }
          .total-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .total-box h3 { margin: 0 0 8px; color: #1e40af; font-size: 18px; }
          .total-box p { margin: 4px 0; font-size: 14px; color: #1e3a8a; }
          .footer { font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SriVoraTech</div>
            <div class="sub">Enabling Businesses with Advanced Software & AI Solutions</div>
          </div>
          <div class="date">${dateStr}</div>
        </div>

        <div class="title">Official Project Estimate Proposal</div>

        <table class="table">
          <thead>
            <tr>
              <th>Specification</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Project Category</strong></td>
              <td>${selectedType.name}</td>
            </tr>
            <tr>
              <td><strong>Selected Features</strong></td>
              <td>${featureNames}</td>
            </tr>
            <tr>
              <td><strong>Development Speed</strong></td>
              <td>${selectedTimeline.label}</td>
            </tr>
            <tr>
              <td><strong>Estimated Duration</strong></td>
              <td>~${totalWeeks} Weeks</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          <h3>Estimated Budget Range: ${formattedCostMin} – ${formattedCostMax} (${currency})</h3>
          <p>✓ Includes 100% Source Code & Complete IP Ownership</p>
          <p>✓ Fixed-Price Guarantee & Milestone Deliverables</p>
        </div>

        <div class="footer">
          SriVoraTech • Contact: srikanth@srivoratech.in • Web: https://srivoratech.vercel.app/
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
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

          <div className="currency-toggle-wrapper">
            <span className="currency-label">Display Currency:</span>
            <button 
              type="button"
              onClick={() => setCurrency('INR')} 
              className={`currency-btn ${currency === 'INR' ? 'active' : ''}`}
            >
              ₹ INR
            </button>
            <button 
              type="button"
              onClick={() => setCurrency('USD')} 
              className={`currency-btn ${currency === 'USD' ? 'active' : ''}`}
            >
              $ USD
            </button>
          </div>
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
                    <span className="output-value">{formattedCostMin} – {formattedCostMax}</span>
                  </div>
                </div>

                <p className="summary-guarantee">
                  <ShieldCheck size={16} /> 100% Fixed-Price Guarantee & IP Ownership Included
                </p>

                <div className="summary-actions-row">
                  <button className="btn-accent summary-cta" onClick={handleSendToContact}>
                    Send Estimate & Book Call
                    <ArrowRight size={18} />
                  </button>
                  <button type="button" className="btn-secondary-light summary-pdf-btn" onClick={handleDownloadPDFEstimate}>
                    <FileText size={16} /> Download Proposal PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
