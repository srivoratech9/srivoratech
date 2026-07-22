import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { TrendingUp, Award, Zap, ShieldCheck, Star } from 'lucide-react'
import './Achievements.css'

const metrics = [
  {
    number: '100%',
    label: 'Client Satisfaction Rate',
    desc: 'Zero abandoned projects and 100% on-time delivery across all client sprints.',
    icon: Award,
    color: '#0067f4',
  },
  {
    number: '2 Weeks',
    label: 'Average MVP Launch Speed',
    desc: 'From initial architecture planning to live production release in record time.',
    icon: Zap,
    color: '#8b5cf6',
  },
  {
    number: '$15M+',
    label: 'Processed Client Volume',
    desc: 'Fintech and e-commerce platforms engineered to process high-throughput transactions.',
    icon: TrendingUp,
    color: '#10b981',
  },
  {
    number: '100%',
    label: 'IP & Codebase Ownership',
    desc: 'Complete immediate transfer of source code, IP rights, and cloud credentials.',
    icon: ShieldCheck,
    color: '#ec4899',
  },
]

export default function Achievements() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section className="achievements section" id="achievements">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="achievements-badge">
            <Star size={14} />
            Proven Excellence
          </div>
          <h2 className="section-title">
            Our Key <span className="gradient-text">Impact Metrics</span>
          </h2>
          <p className="section-subtitle">
            Measurable results that reflect our commitment to engineering quality and business growth.
          </p>
        </div>

        <div className="achievements-metrics-grid">
          {metrics.map((m, idx) => {
            const Icon = m.icon
            return (
              <div
                key={m.label}
                className="metric-card glass-card"
                style={{ '--metric-color': m.color }}
              >
                <div className="metric-icon-box" style={{ background: `${m.color}15`, color: m.color }}>
                  <Icon size={24} />
                </div>
                <h3 className="metric-number" style={{ color: m.color }}>{m.number}</h3>
                <h4 className="metric-label">{m.label}</h4>
                <p className="metric-desc">{m.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
