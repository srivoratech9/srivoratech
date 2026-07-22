import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { MessageSquare, Lightbulb, Rocket } from 'lucide-react'
import './OnboardingSteps.css'

const steps = [
  {
    num: '01',
    icon: <MessageSquare size={24} />,
    title: 'Share Your Vision',
    description: 'Tell us about your idea, goals, and timeline. We listen carefully to understand your unique needs and challenges.',
  },
  {
    num: '02',
    icon: <Lightbulb size={24} />,
    title: 'Collaborate on a Solution',
    description: 'Our team crafts a tailored strategy — from architecture to design — and walks you through every step of the plan.',
  },
  {
    num: '03',
    icon: <Rocket size={24} />,
    title: 'Watch Your Idea Come to Life',
    description: 'We build, test, and launch your product with weekly updates. You stay in control while we handle the heavy lifting.',
  },
]

export default function OnboardingSteps() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section className="onboarding section">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to go from idea to a fully launched product.</p>
        </div>

        <div className="onboarding-steps">
          {steps.map((step, idx) => {
            const [stepRef, stepVisible] = useScrollAnimation()
            return (
              <div
                key={idx}
                ref={stepRef}
                className={`onboarding-step animate-on-scroll delay-${idx + 1} ${stepVisible ? 'visible' : ''}`}
              >
                <div className="step-number">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
                {idx < steps.length - 1 && <div className="step-connector" />}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
