import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ArrowRight } from 'lucide-react'
import './PreFooterCTA.css'

const marqueeItems = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'Express.js',
  'NestJS',
  'Python',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'AWS',
  'Docker',
  'Vercel',
  'GitHub',
]

export default function PreFooterCTA() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section className="pre-footer-cta" id="contact">
      <div className="container">
        <div ref={ref} className={`pre-footer-content animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h2 className="pre-footer-title">
            You've reached the end — now let's start something new!
          </h2>
          <a href="mailto:team@srivoratech.com" className="btn-accent pre-footer-btn">
            Let's Connect <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Marquee */}
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="marquee-item">
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <p className="pre-footer-tagline">Trust us, we are good at this :)</p>
    </section>
  )
}
