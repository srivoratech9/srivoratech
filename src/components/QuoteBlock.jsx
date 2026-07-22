import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './QuoteBlock.css'

export default function QuoteBlock() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section ref={ref} className={`quote-block animate-on-scroll ${isVisible ? 'visible' : ''}`}>
      <div className="container">
        <div className="quote-content">
          <p className="quote-label">Solutions Beyond Syntax</p>
          <blockquote className="quote-text">
            "We don't just write code — we architect digital experiences that transform businesses and delight users."
          </blockquote>
          <p className="quote-author">— Badisa Srikanth,SriVoraTech.in</p>
        </div>
      </div>
    </section>
  )
}
