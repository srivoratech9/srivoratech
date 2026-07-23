import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Rocket, ShieldCheck, Gem, Bot, TrendingUp, Users, Sparkles, ChevronRight } from 'lucide-react'
import './WhyChoose.css'

const advantages = [
  {
    id: 1,
    icon: Rocket,
    title: 'Fast Delivery',
    shortDesc: 'We follow an agile development process with clear milestones, regular updates, and rapid delivery to get your product to market faster without compromising quality.',
    metric: 'Rapid Market Launch',
    progress: 92,
    progressLabel: '92% faster than industry average',
    color: '#0067f4',
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: 'Security & Data Protection',
    shortDesc: 'Security is built into every stage of development with secure authentication, encrypted data, industry best practices, and reliable cloud infrastructure.',
    metric: '100% Data Protection',
    progress: 100,
    progressLabel: 'Enterprise-grade security compliance',
    color: '#10b981',
  },
  {
    id: 3,
    icon: Gem,
    title: 'Engineering Excellence',
    shortDesc: 'Our experienced engineers build clean, scalable, and maintainable software using modern technologies and industry standards.',
    metric: 'Clean Scalable Code',
    progress: 97,
    progressLabel: '97% code quality score',
    color: '#8b5cf6',
  },
  {
    id: 4,
    icon: Bot,
    title: 'AI-Powered Innovation',
    shortDesc: 'We integrate Artificial Intelligence, automation, AI chatbots, and intelligent workflows to help businesses improve efficiency and stay ahead of the competition.',
    metric: 'AI Workflow Engine',
    progress: 88,
    progressLabel: '88% automation efficiency',
    color: '#ec4899',
  },
  {
    id: 5,
    icon: TrendingUp,
    title: 'Scalable Solutions',
    shortDesc: 'Our applications are designed to grow with your business, ensuring high performance, flexibility, and long-term reliability.',
    metric: 'High Performance',
    progress: 95,
    progressLabel: '99.9% uptime guaranteed',
    color: '#f59e0b',
  },
  {
    id: 6,
    icon: Users,
    title: 'Transparent Collaboration',
    shortDesc: 'Stay informed throughout the project with clear communication, milestone tracking, progress updates, and dedicated support from start to finish.',
    metric: 'Dedicated Support',
    progress: 100,
    progressLabel: '100% client satisfaction',
    color: '#06b6d4',
  },
]

export default function WhyChoose() {
  const [ref, isVisible] = useScrollAnimation()
  const [expandedCard, setExpandedCard] = useState(null)

  return (
    <section ref={ref} className="why-choose section" id="why-choose">
      <div className="container">
        <div className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="why-badge">
            <Sparkles size={14} />
            Why Choose SriVoraTech
          </div>
          <h2 className="section-title">
            Why Businesses Choose <span className="gradient-text">SriVoraTech</span>
          </h2>
          <p className="section-subtitle">
            From strategy and design to development, AI integration, and ongoing support, we deliver innovative software solutions with quality, transparency, and a commitment to your long-term success.
          </p>
        </div>

        <div className={`why-grid ${isVisible ? 'cards-visible' : ''}`}>
          {advantages.map((item, idx) => {
            const Icon = item.icon
            const isExpanded = expandedCard === item.id
            return (
              <div
                key={item.title}
                className={`why-card glass-card animate-on-scroll ${isVisible ? 'visible' : ''} ${isExpanded ? 'expanded' : ''}`}
                style={{ '--why-accent': item.color, '--delay': `${0.05 + idx * 0.08}s` }}
                onClick={() => setExpandedCard(isExpanded ? null : item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setExpandedCard(isExpanded ? null : item.id)}
              >
                <div className="why-card-top-row">
                  <div className="why-icon-box" style={{ background: `${item.color}18`, color: item.color }}>
                    <Icon size={24} />
                  </div>
                  <span className="why-metric-chip" style={{ color: item.color, borderColor: `${item.color}40` }}>
                    {item.metric}
                  </span>
                </div>

                <div className="why-card-body">
                  <h3 className="why-card-title">{item.title}</h3>
                  <p className="why-card-desc">{item.shortDesc}</p>
                </div>

                {/* Animated progress bar */}
                <div className="why-progress-section">
                  <div className="why-progress-bar">
                    <div
                      className="why-progress-fill"
                      style={{
                        width: isVisible ? `${item.progress}%` : '0%',
                        background: `linear-gradient(90deg, ${item.color}cc, ${item.color})`,
                        transitionDelay: `${0.3 + idx * 0.1}s`,
                      }}
                    />
                  </div>
                  <span className="why-progress-label" style={{ color: item.color }}>
                    {item.progressLabel}
                  </span>
                </div>

                <div className="why-expand-hint">
                  <ChevronRight size={13} className={`expand-chevron ${isExpanded ? 'rotated' : ''}`} />
                  <span>{isExpanded ? 'Collapse' : 'Learn More'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
