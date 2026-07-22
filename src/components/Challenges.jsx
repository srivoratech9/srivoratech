import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Clock, TrendingDown, Users, Puzzle, ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'
import './Challenges.css'

const challenges = [
  {
    icon: <Clock size={22} />,
    problem: 'Slow Time-to-Market',
    problemDesc: 'Traditional agency cycles take 6–12 months, letting competitors capture your audience first.',
    solution: '2–4 Week MVP Sprints',
    solutionDesc: 'We ship production-grade code in bi-weekly sprints so you hit the market in weeks, not quarters.',
  },
  {
    icon: <TrendingDown size={22} />,
    problem: 'Inconsistent Quality & Bugs',
    problemDesc: 'Freelancers often deliver buggy code with zero documentation, leading to costly rebuilds.',
    solution: 'Senior-Only Engineering',
    solutionDesc: 'Built with TypeScript, automated CI/CD pipelines, strict code reviews, and battle-tested architecture.',
  },
  {
    icon: <Users size={22} />,
    problem: 'Hiring & Retaining Risks',
    problemDesc: 'Hiring full-time engineers is expensive ($150k+ salaries) with long recruitment delays.',
    solution: 'Instant On-Demand Team',
    solutionDesc: 'Access senior full-stack developers, AI engineers, and UI/UX designers immediately without payroll risk.',
  },
  {
    icon: <Puzzle size={22} />,
    problem: 'Scalability Bottlenecks',
    problemDesc: 'Architectures built without foresight collapse under peak user traffic.',
    solution: 'Cloud-Native Auto Scaling',
    solutionDesc: 'Serverless microservices on AWS/Vercel engineered to handle millions of requests smoothly.',
  },
  {
    icon: <ShieldAlert size={22} />,
    problem: 'Security Vulnerabilities',
    problemDesc: 'Neglecting security exposes your business to data breaches and compliance fines.',
    solution: 'Enterprise Security Built-In',
    solutionDesc: 'Role-based access, encrypted API tokens, and OWASP security compliance from day one.',
  },
  {
    icon: <AlertTriangle size={22} />,
    problem: 'Poor UI/UX & High Churn',
    problemDesc: 'Confusing user interfaces cause bounce rates and wasted ad spend.',
    solution: 'World-Class Figma UI/UX',
    solutionDesc: 'User-tested design systems and sleek animations that delight users and drive conversions.',
  },
]

export default function Challenges() {
  const [ref, isVisible] = useScrollAnimation()

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
          </p>
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
                {/* Problem header */}
                <div className="challenge-problem-side">
                  <div className="problem-pill">Problem</div>
                  <div className="challenge-icon-box">{item.icon}</div>
                  <h3 className="problem-title">{item.problem}</h3>
                  <p className="problem-desc">{item.problemDesc}</p>
                </div>

                <div className="challenge-divider">
                  <span className="arrow-badge"><ArrowRight size={14} /></span>
                </div>

                {/* Solution header */}
                <div className="challenge-solution-side">
                  <div className="solution-pill">
                    <CheckCircle2 size={12} /> Solution
                  </div>
                  <h4 className="solution-title">{item.solution}</h4>
                  <p className="solution-desc">{item.solutionDesc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
