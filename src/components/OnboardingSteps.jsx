import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Lightbulb, FileText, Palette, Code2, TestTube, Rocket, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import './OnboardingSteps.css'

const steps = [
  {
    num: '01',
    icon: Lightbulb,
    title: 'Discover & Understand',
    description: 'We begin by understanding your business goals, target audience, challenges, and project requirements to create the right strategy.',
    highlights: ['Business Goal Alignment', 'Requirement Analysis', 'Target Audience Mapping'],
    color: '#0067f4',
  },
  {
    num: '02',
    icon: FileText,
    title: 'Strategy & Planning',
    description: 'Our experts prepare the project roadmap, technical architecture, timeline, milestones, and development plan for successful execution.',
    highlights: ['Technical Architecture', 'Milestone Roadmap', 'Resource Allocation'],
    color: '#8b5cf6',
  },
  {
    num: '03',
    icon: Palette,
    title: 'UI/UX Design',
    description: 'We design intuitive, modern, and user-friendly interfaces with wireframes, prototypes, and responsive layouts focused on exceptional user experience.',
    highlights: ['Figma Prototypes', 'Responsive UI Systems', 'User Centric Experience'],
    color: '#ec4899',
  },
  {
    num: '04',
    icon: Code2,
    title: 'Development',
    description: 'Our developers build secure, scalable, and high-performance websites, mobile apps, AI solutions, and enterprise software using modern technologies.',
    highlights: ['Clean Modular Code', 'AI & Cloud Integration', 'Sub-Second Latency'],
    color: '#10b981',
  },
  {
    num: '05',
    icon: TestTube,
    title: 'Testing & Quality Assurance',
    description: 'Every feature is thoroughly tested for functionality, security, performance, responsiveness, and reliability before deployment.',
    highlights: ['Security Audits', 'Performance Tuning', 'Cross-Device QA'],
    color: '#f59e0b',
  },
  {
    num: '06',
    icon: Rocket,
    title: 'Deployment & Ongoing Support',
    description: 'After successful launch, we provide continuous maintenance, security updates, feature enhancements, and technical support to ensure long-term success.',
    highlights: ['Production Cloud Launch', '100% IP Transfer', '24/7 SLA Support'],
    color: '#06b6d4',
  },
]

export default function OnboardingSteps() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section className="onboarding section" id="process">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="onboarding-badge">
            <Sparkles size={14} />
            Proven Development Process
          </div>
          <h2 className="section-title">
            How We Build <span className="gradient-text">Your Product</span>
          </h2>
          <p className="section-subtitle">
            Our proven development process combines strategy, design, engineering, and continuous collaboration to deliver secure, scalable, and future-ready digital solutions.
          </p>
        </div>

        <div className="onboarding-steps-grid">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="onboarding-step-card glass-card"
                style={{ '--step-color': step.color }}
              >
                <div className="step-top-row">
                  <span className="step-num-badge" style={{ background: `${step.color}15`, color: step.color }}>
                    Step {step.num}
                  </span>
                  <span className="step-phase-label">Phase {idx + 1}</span>
                </div>

                <div className="step-icon-box" style={{ background: `${step.color}15`, color: step.color }}>
                  <Icon size={24} />
                </div>

                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>

                <div className="step-deliverables">
                  <span className="del-header">KEY HIGHLIGHTS:</span>
                  {step.highlights.map((item) => (
                    <span key={item} className="del-chip">
                      <CheckCircle2 size={12} style={{ color: step.color }} /> {item}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
