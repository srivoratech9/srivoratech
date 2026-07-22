import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ChevronDown, Search, X, HelpCircle } from 'lucide-react'
import './FAQ.css'

const faqs = [
  {
    id: 1,
    cat: 'scope',
    question: "Who's behind SriVoraTech?",
    answer: "We're a tight-knit team of senior designers, full-stack engineers, and AI architects. We combine deep technical expertise with human-centered product design.",
    color: '#0067f4',
  },
  {
    id: 2,
    cat: 'scope',
    question: 'Do you accept custom requirements & complex integrations?',
    answer: "Absolutely. Every project we take on is built custom from scratch. We integrate with SAP ERPs, OpenAI Whisper, Stripe payments, and AWS Cloud infrastructure.",
    color: '#8b5cf6',
  },
  {
    id: 3,
    cat: 'pricing',
    question: 'What is your typical turnaround speed for an MVP?',
    answer: "A standard MVP sprint is delivered in 2–4 weeks. Enterprise portals take 6–10 weeks. We give you a fixed-price guarantee and precise milestone schedule during our discovery phase.",
    color: '#10b981',
  },
  {
    id: 4,
    cat: 'security',
    question: 'Who owns the source code and IP rights?',
    answer: "You do — 100%. Upon completion and delivery, all source code, Figma design system files, credentials, and IP rights are immediately transferred to your company.",
    color: '#ec4899',
  },
  {
    id: 5,
    cat: 'security',
    question: 'Do you provide ongoing SLA & maintenance support?',
    answer: "Yes! We offer 24/7 post-launch maintenance, automated security patches, cloud scaling optimization, and sprint feature iterations to act as your long-term tech partner.",
    color: '#f59e0b',
  },
  {
    id: 6,
    cat: 'pricing',
    question: "What engagement & pricing models do you offer?",
    answer: "We offer transparent fixed-price sprints for well-defined projects, and flexible monthly dedicated engineering retainer teams for growing startups.",
    color: '#06b6d4',
  },
]

const categories = [
  { id: 'all', label: 'All FAQs' },
  { id: 'pricing', label: 'Pricing & Velocity' },
  { id: 'security', label: 'IP & Security' },
  { id: 'scope', label: 'Scope & Custom Build' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const [activeCat, setActiveCat] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [ref, isVisible] = useScrollAnimation()

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  const filteredFaqs = faqs.filter((f) => {
    const matchesCat = activeCat === 'all' || f.cat === activeCat
    const matchesSearch = searchQuery === '' ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <section className="faq section" id="faq">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="faq-badge">
            <HelpCircle size={14} />
            Got Questions?
          </div>
          <h2 className="section-title">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about our engineering process, pricing, and IP transfer.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="faq-filter-bar">
          <div className="faq-tabs">
            {categories.map((c) => (
              <button
                key={c.id}
                className={`faq-tab-btn ${activeCat === c.id ? 'active' : ''}`}
                onClick={() => setActiveCat(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="faq-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="faq-list">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div key={faq.id} className={`faq-item glass-card ${isOpen ? 'open' : ''}`}>
                <button className="faq-trigger" onClick={() => toggle(idx)}>
                  <span className="faq-question">{faq.question}</span>
                  <span className={`faq-chevron ${isOpen ? 'rotated' : ''}`}>
                    <ChevronDown size={20} />
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-answer animate-fade-in">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}

          {filteredFaqs.length === 0 && (
            <div className="faq-empty-state">
              <p>No questions matched your search query.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
