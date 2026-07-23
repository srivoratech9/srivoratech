import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Clock, TrendingDown, Users, Puzzle, ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2, RotateCw } from 'lucide-react'
import './Challenges.css'

const challenges = [
  {
    icon: <Clock size={22} />,
    problem: 'Slow Time-to-Market',
    problemDesc: 'Traditional agency cycles take 6–12 months, letting competitors capture your audience first.',
    solution: '2–4 Week MVP Sprints',
    solutionDesc: 'We ship production-grade code in bi-weekly sprints so you hit the market in weeks, not quarters.',
    stat: '85%',
    statLabel: 'Faster Delivery',
  },
  {
    icon: <TrendingDown size={22} />,
    problem: 'Inconsistent Quality & Bugs',
    problemDesc: 'Freelancers often deliver buggy code with zero documentation, leading to costly rebuilds.',
    solution: 'Senior-Only Engineering',
    solutionDesc: 'Built with TypeScript, automated CI/CD pipelines, strict code reviews, and battle-tested architecture.',
    stat: '99.5%',
    statLabel: 'Bug-Free Rate',
  },
  {
    icon: <Users size={22} />,
    problem: 'Hiring & Retaining Risks',
    problemDesc: 'Hiring full-time engineers is expensive ($150k+ salaries) with long recruitment delays.',
    solution: 'Instant On-Demand Team',
    solutionDesc: 'Access senior full-stack developers, AI engineers, and UI/UX designers immediately without payroll risk.',
    stat: '60%',
    statLabel: 'Cost Saved',
  },
  {
    icon: <Puzzle size={22} />,
    problem: 'Scalability Bottlenecks',
    problemDesc: 'Architectures built without foresight collapse under peak user traffic.',
    solution: 'Cloud-Native Auto Scaling',
    solutionDesc: 'Serverless microservices on AWS/Vercel engineered to handle millions of requests smoothly.',
    stat: '10M+',
    statLabel: 'Requests/Sec',
  },
  {
    icon: <ShieldAlert size={22} />,
    problem: 'Security Vulnerabilities',
    problemDesc: 'Neglecting security exposes your business to data breaches and compliance fines.',
    solution: 'Enterprise Security Built-In',
    solutionDesc: 'Role-based access, encrypted API tokens, and OWASP security compliance from day one.',
    stat: '100%',
    statLabel: 'Compliance',
  },
  {
    icon: <AlertTriangle size={22} />,
    problem: 'Poor UI/UX & High Churn',
    problemDesc: 'Confusing user interfaces cause bounce rates and wasted ad spend.',
    solution: 'World-Class Figma UI/UX',
    solutionDesc: 'User-tested design systems and sleek animations that delight users and drive conversions.',
    stat: '3×',
    statLabel: 'Conversion Rate',
  },
]

export default function Challenges() {
  const [ref, isVisible] = useScrollAnimation()
  const [flippedCards, setFlippedCards] = useState({})

  const toggleFlip = (idx) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const solvedCount = Object.values(flippedCards).filter(Boolean).length

  return (
    <section className="challenges section" id="challenges">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="challenges-badge-top">
            <AlertTriangle size={14} />
            Overcoming Roadblocks
          </div>
          <h2 className="section-title">
            The Problems We <span className="gradient-text">Solve</span>
          </h2>
          <p className="section-subtitle">
            How SriVoraTech transforms common digital engineering bottlenecks into unfair competitive advantages.
            <span className="flip-hint">Click any card to reveal our solution →</span>
          </p>

          {/* Progress tracker */}
          <div className="challenges-progress-bar">
            <div className="progress-fill" style={{ width: `${(solvedCount / challenges.length) * 100}%` }} />
            <span className="progress-label">
              <CheckCircle2 size={13} /> {solvedCount} / {challenges.length} Solutions Revealed
            </span>
          </div>
        </div>

        <div className="challenges-grid">
          {challenges.map((item, idx) => {
            const [cardRef, cardVisible] = useScrollAnimation()
            const isFlipped = flippedCards[idx]
            return (
              <div
                key={idx}
                ref={cardRef}
                className={`challenge-card-wrapper animate-on-scroll delay-${(idx % 3) + 1} ${cardVisible ? 'visible' : ''}`}
                onClick={() => toggleFlip(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleFlip(idx)}
              >
                <div className={`challenge-card-flipper ${isFlipped ? 'flipped' : ''}`}>
                  {/* FRONT — Problem side */}
                  <div className="challenge-card challenge-front">
                    <div className="challenge-problem-side">
                      <div className="problem-pill">Problem</div>
                      <div className="challenge-icon-box">{item.icon}</div>
                      <h3 className="problem-title">{item.problem}</h3>
                      <p className="problem-desc">{item.problemDesc}</p>
                    </div>
                    <div className="card-flip-hint">
                      <RotateCw size={13} /> Click to see solution
                    </div>
                  </div>

                  {/* BACK — Solution side */}
                  <div className="challenge-card challenge-back">
                    <div className="challenge-solution-side">
                      <div className="solution-pill">
                        <CheckCircle2 size={12} /> Solution
                      </div>
                      <h4 className="solution-title">{item.solution}</h4>
                      <p className="solution-desc">{item.solutionDesc}</p>
                      <div className="solution-stat-chip">
                        <strong className="stat-value">{item.stat}</strong>
                        <span className="stat-label">{item.statLabel}</span>
                      </div>
                    </div>
                    <div className="card-flip-hint back-hint">
                      <RotateCw size={13} /> Flip back
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
