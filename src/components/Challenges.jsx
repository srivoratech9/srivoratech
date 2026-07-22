import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { AlertTriangle, Clock, TrendingDown, Users, Puzzle, ShieldAlert } from 'lucide-react'
import './Challenges.css'

const challenges = [
  {
    icon: <Clock size={22} />,
    title: 'Slow Time-to-Market',
    description: 'Traditional development cycles delay your launch, letting competitors capture your audience first.',
  },
  {
    icon: <TrendingDown size={22} />,
    title: 'Inconsistent Quality',
    description: 'Freelancers and fragmented teams often deliver uneven quality, leading to costly rework.',
  },
  {
    icon: <Users size={22} />,
    title: 'Talent Shortage',
    description: 'Hiring and retaining skilled developers is expensive and time-consuming for growing businesses.',
  },
  {
    icon: <Puzzle size={22} />,
    title: 'Scalability Issues',
    description: 'Systems built without foresight crumble under growth, requiring expensive rebuilds.',
  },
  {
    icon: <ShieldAlert size={22} />,
    title: 'Security Vulnerabilities',
    description: 'Poor security practices expose your business to data breaches and compliance risks.',
  },
  {
    icon: <AlertTriangle size={22} />,
    title: 'Poor User Experience',
    description: 'Neglecting UX leads to low adoption, high churn, and wasted marketing spend.',
  },
]

export default function Challenges() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section className="challenges section" id="challenges">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">The Challenges Modern Businesses Face</h2>
          <p className="section-subtitle">These roadblocks slow you down — we're here to clear the path.</p>
        </div>

        <div className="challenges-grid">
          {challenges.map((item, idx) => {
            const [cardRef, cardVisible] = useScrollAnimation()
            return (
              <div
                key={idx}
                ref={cardRef}
                className={`challenge-card animate-on-scroll delay-${(idx % 3) + 1} ${cardVisible ? 'visible' : ''}`}
              >
                <div className="challenge-badge">Problem</div>
                <div className="challenge-icon">{item.icon}</div>
                <h3 className="challenge-title">{item.title}</h3>
                <p className="challenge-desc">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
