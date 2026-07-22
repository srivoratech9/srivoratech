import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ArrowRight } from 'lucide-react'
import './WhyChoose.css'

const advantages = [
  {
    title: '🚀 End-to-End Development',
    shortDesc: 'From concept and UI/UX design to deployment and maintenance, we handle the complete software development lifecycle.',
    fullDesc: 'From the first sprint to post-launch support, we stay involved so you don\'t have to manage multiple vendors or chase updates.',
    color: '#6366f1',
  },
  {
    title: '🔍 Transparent Project Tracking',
    shortDesc: 'Stay informed with live project dashboards, milestone tracking, and progress updates throughout development.',
    fullDesc: 'From the first sprint to post-launch support, we stay involved so you don\'t have to manage multiple vendors or chase updates.',
    color: '#8b5cf6',
  },
  {
    title: '⚡ Modern Technology Stack',
    shortDesc: 'We leverage the latest technologies to build secure, scalable, and future-ready digital solutions.',
    fullDesc: 'From the first sprint to post-launch support, we stay involved so you don\'t have to manage multiple vendors or chase updates.',
    color: '#0067f4',
  },
  {
    title: '🔒 Security First',
    shortDesc: 'We follow industry best practices to ensure your applications are secure, reliable, and protected.',
    fullDesc: 'From the first sprint to post-launch support, we stay involved so you don\'t have to manage multiple vendors or chase updates.',
    color: '#10b981',
  },
  {
    title: '🤝 Dedicated Team',
    shortDesc: 'Work with experienced developers, designers, AI engineers, and project managers committed to your success.',
    fullDesc: 'From the first sprint to post-launch support, we stay involved so you don\'t have to manage multiple vendors or chase updates.',
    color: '#f59e0b',
  },
  {
    title: '🛠 Long-Term Support',
    shortDesc: 'Our partnership continues after launch with maintenance, performance optimization, and ongoing technical support.',
    fullDesc: 'From the first sprint to post-launch support, we stay involved so you don\'t have to manage multiple vendors or chase updates.',
    color: '#ef4444',
  },
]

export default function WhyChoose() {
  const [ref, isVisible] = useScrollAnimation()
  const [expandedId, setExpandedId] = useState(null)

  const toggleCard = (title) => {
    setExpandedId(expandedId === title ? null : title)
  }

  return (
    <section className="why-choose section" id="why-choose">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="why-badge">
            <span className="why-badge-dot" />
            Why Choose Us
          </div>
          <h2 className="section-title">
            Why Choose <span className="gradient-text">SriVoraTech?</span>
          </h2>
          <p className="section-subtitle">
            We combine technical excellence with design sensibility to deliver products that perform.
          </p>
        </div>

        <div className={`why-grid ${isVisible ? 'cards-visible' : ''}`}>
          {advantages.map((item, idx) => {
            const isExpanded = expandedId === item.title
            return (
              <div
                key={item.title}
                className={`why-card animate-on-scroll ${isExpanded ? 'expanded' : ''}`}
                style={{ '--service-color': item.color, '--delay': `${0.05 + idx * 0.08}s` }}
              >
                <div className="why-card-glow" />
                <div className="why-card-header">
                  <h3 className="why-card-title">{item.title}</h3>
                  <button
                    className="why-card-arrow"
                    onClick={() => toggleCard(item.title)}
                    aria-label="Toggle details"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
                <p className="why-card-desc">{item.shortDesc}</p>

                {isExpanded && (
                  <div className="why-card-expanded">
                    <p>{item.fullDesc}</p>
                  </div>
                )}
              </div>
            )
          })}

          {/* CTA Card */}
          <div className="why-card why-card-cta">
            <div className="why-cta-content">
              <h3 className="why-cta-title">Reserve Your Slot</h3>
              <p className="why-cta-desc">Only 2 open slots this month — let's build your product today.</p>
              <a href="#contact" className="btn-accent why-cta-btn">
                Book a Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
