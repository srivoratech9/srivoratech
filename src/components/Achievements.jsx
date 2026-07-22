import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { TrendingUp, Layers, Rocket, Star, ArrowUpRight } from 'lucide-react'
import './Achievements.css'

const techTags = [
  'Web Development', 'App Development', 'AI Applications',
  'Cloud & DevOps', 'Logo Designing', 'API & System Integrations',
  'UI/UX Design', 'SaaS Products'
]

export default function Achievements() {
  const [ref, isVisible] = useScrollAnimation()
  const [cardRef1, cardVisible1] = useScrollAnimation()
  const [cardRef2, cardVisible2] = useScrollAnimation()
  const [cardRef3, cardVisible3] = useScrollAnimation()

  return (
    <section className="achievements section" id="achievements">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">Our Achievements</h2>
          <p className="section-subtitle">
            Numbers that reflect our commitment to excellence.
          </p>
        </div>

        <div className="achievements-grid">
          {/* Card 1: Projects Served — with app preview illustration */}
          <div ref={cardRef1} className={`achievement-card animate-on-scroll ${cardVisible1 ? 'visible' : ''}`}>
            <div className="ach-visual ach-visual--projects">
              <div className="ach-app-preview">
                <div className="ach-app-header">
                  <div className="ach-app-dots"><span /><span /><span /></div>
                </div>
                <div className="ach-app-content">
                  <div className="ach-app-title-bar" />
                  <div className="ach-app-line ach-app-line--long" />
                  <div className="ach-app-line ach-app-line--medium" />
                  <div className="ach-app-btn" />
                </div>
              </div>
              <div className="ach-app-preview ach-app-preview--secondary">
                <div className="ach-app-header ach-app-header--alt">
                  <div className="ach-app-dots"><span /><span /><span /></div>
                </div>
                <div className="ach-app-content">
                  <div className="ach-app-blocks">
                    <div className="ach-block" />
                    <div className="ach-block" />
                  </div>
                  <div className="ach-app-line ach-app-line--short" />
                </div>
              </div>
            </div>
            <div className="ach-text">
              <h3 className="achievement-number">3+</h3>
              <h4 className="achievement-label">Projects Served</h4>
              <p className="achievement-desc">
                From early-stage startups to established enterprises, we've helped build world-class digital products.
              </p>
            </div>
          </div>

          {/* Card 2: Experience — with floating tech tags around large number */}
          <div ref={cardRef2} className={`achievement-card achievement-card--experience animate-on-scroll delay-1 ${cardVisible2 ? 'visible' : ''}`}>
            <div className="ach-visual ach-visual--experience">
              <div className="ach-big-number">2</div>
              <div className="ach-floating-tags">
                {techTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="ach-float-tag"
                    style={{
                      animationDelay: `${idx * 0.4}s`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="ach-text">
              <h3 className="achievement-number">2+</h3>
              <h4 className="achievement-label">Years of Experience</h4>
              <p className="achievement-desc">
                Bringing seasoned expertise to every project with modern tech stack.
              </p>
            </div>
          </div>

          {/* Card 3: Scaling — with growth chart illustration */}
          <div ref={cardRef3} className={`achievement-card animate-on-scroll delay-2 ${cardVisible3 ? 'visible' : ''}`}>
            <div className="ach-visual ach-visual--scaling">
              <div className="ach-chart-container">
                <span className="ach-scaling-title">Scaling</span>
                <span className="ach-growth-badge">Growth Highlight</span>
                <svg className="ach-growth-chart" viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 85 Q30 80 50 70 T100 55 T150 35 T200 20 T240 10"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                    fill="none"
                    className="ach-chart-line"
                  />
                  <path
                    d="M0 85 Q30 80 50 70 T100 55 T150 35 T200 20 T240 10 V100 H0 Z"
                    fill="url(#chartFill)"
                    className="ach-chart-area"
                  />
                </svg>
              </div>
            </div>
            <div className="ach-text">
              <h4 className="achievement-label">Empowering Brands to Scale</h4>
              <p className="achievement-desc">
                We help brands redirect resources to fuel innovation and expansion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
