import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ChevronDown } from 'lucide-react'
import './FAQ.css'

const faqs = [
  {
    question: "Who's behind SriVoraTech?",
    answer: "We're a tight-knit team of designers, developers, and strategists with 8+ years of experience building digital products for startups and enterprises alike. We combine technical depth with design sensibility.",
    color: '#6366f1',
    initial: 'V',
  },
  {
    question: 'Do you accept custom requirements?',
    answer: "Absolutely. Every project we take on is unique, and we tailor our approach to match your specific business goals, timeline, and technical requirements. No cookie-cutter solutions here.",
    color: '#f59e0b',
    initial: 'S',
  },
  {
    question: 'What is your turnaround time?',
    answer: "It depends on the scope. A typical MVP takes 6-8 weeks, a full web application 8-12 weeks, and mobile apps 10-14 weeks. We'll give you a precise timeline after our discovery call.",
    color: '#10b981',
    initial: 'A',
  },
  {
    question: 'Do you provide ongoing support?',
    answer: "Yes! We offer post-launch maintenance, feature updates, and scaling support. We believe in long-term partnerships, not just one-off projects.",
    color: '#ec4899',
    initial: 'R',
  },
  {
    question: 'Can you handle branding and marketing too?',
    answer: "We offer comprehensive branding services including logo design, brand identity, and digital marketing strategies including SEO, content, and performance marketing.",
    color: '#8b5cf6',
    initial: 'P',
  },
  {
    question: "What's your pricing?",
    answer: "Our pricing varies based on project complexity and scope. We offer flexible engagement models — fixed-price for well-defined projects and time & materials for evolving ones. Book a call for a custom quote.",
    color: '#0ea5e9',
    initial: 'K',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const [ref, isVisible] = useScrollAnimation()
  const [listRef, listVisible] = useScrollAnimation()

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="faq section" id="faq">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Got questions? We've got answers.</p>
        </div>

        <div ref={listRef} className={`faq-list animate-on-scroll ${listVisible ? 'visible' : ''}`}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button className="faq-trigger" onClick={() => toggle(idx)}>
                  <div className="faq-trigger-left">
                    <div className="faq-avatar" style={{ background: faq.color, color: '#fff' }}>
                      {faq.initial}
                    </div>
                    <span className="faq-question">{faq.question}</span>
                  </div>
                  <span className={`faq-chevron ${isOpen ? 'rotated' : ''}`}>
                    <ChevronDown size={20} />
                  </span>
                </button>
                <div className={`faq-answer-wrap ${isOpen ? 'expanded' : ''}`}>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
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
