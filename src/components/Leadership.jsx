import { useState, useRef } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Sparkles, Award, CheckCircle2, Linkedin, Mail, ShieldCheck, ChevronLeft, ChevronRight, Eye, ChevronDown } from 'lucide-react'
import './Leadership.css'
import saiPhoto from '../assets/sai_manindra.jpg'
import srikanthPhoto from '../assets/badisa_srikanth.jpg'

const leaders = [
  {
    id: 'srikanth',
    name: 'Badisa Srikanth',
    role: 'Founder & Chief Executive Officer (CEO)',
    level: 'Executive Leadership',
    initials: 'BS',
    color: '#0067f4',
    photo: srikanthPhoto,
    linkedin: 'https://linkedin.com',
    email: 'srikanth@srivoratech.com',
    bio: "Badisa Srikanth is the Founder and CEO of SriVoraTech. He leads the company's vision, product strategy, business growth, and innovation initiatives. Passionate about software engineering, artificial intelligence, and entrepreneurship, he focuses on building scalable digital solutions that help businesses accelerate their digital transformation.",
    expertise: [
      'Business Strategy',
      'Software Architecture',
      'Full Stack Development',
      'Artificial Intelligence',
      'Product Innovation',
      'Client Success',
    ],
  },
  {
    id: 'vamsi',
    name: 'Badisa Vamsi Krishna',
    role: 'Co-Founder & Chief Operating Officer (COO)',
    level: 'Executive Leadership',
    initials: 'VK',
    color: '#8b5cf6',
    photo: null,
    linkedin: 'https://in.linkedin.com/in/vamsi-krishna-badisa-8b03ba1aa',
    email: 'vamsi@srivoratech.com',
    bio: 'Badisa Vamsi Krishna oversees daily operations, project delivery, business development, and customer relationships. He ensures efficient execution, operational excellence, and seamless collaboration between teams and clients.',
    expertise: [
      'Operations Management',
      'Business Development',
      'Project Management',
      'Client Relations',
      'Team Coordination',
      'Quality Delivery',
    ],
  },
  {
    id: 'manindra',
    name: 'Garapati Sai Manindra',
    role: 'Chief Technology Officer (CTO)',
    level: 'Technical Leadership',
    initials: 'GSM',
    color: '#10b981',
    photo: saiPhoto,
    linkedin: 'https://linkedin.com',
    email: 'manindra@srivoratech.com',
    bio: "Garapati Sai Manindra leads the company's technology vision, engineering excellence, and software architecture. He is responsible for building secure, scalable, and high-performance web applications, mobile apps, cloud platforms, and AI-powered solutions.",
    expertise: [
      'Software Engineering',
      'System Architecture',
      'Cloud Computing',
      'AI & Machine Learning',
      'DevOps',
      'Technology Leadership',
    ],
  },
]

export default function Leadership() {
  const [ref, isVisible] = useScrollAnimation()
  const scrollStreamRef = useRef(null)
  const [expandedLeaderId, setExpandedLeaderId] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollLeadership = (direction) => {
    if (scrollStreamRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380
      scrollStreamRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollToCard = (index) => {
    setActiveIndex(index)
    if (scrollStreamRef.current) {
      const cardWidth = 380
      scrollStreamRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
    }
  }

  const toggleLeaderExpand = (id) => {
    setExpandedLeaderId(prev => prev === id ? null : id)
  }

  return (
    <section ref={ref} className="leadership section" id="leadership">
      <div className="container">
        {/* Header */}
        <div className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="leadership-badge-header-row">
            <div className="leadership-badge">
              <Sparkles size={14} />
              Executive Leadership & Vision
            </div>

            {/* Horizontal Scroll Controls */}
            <div className="leadership-scroll-nav">
              <button
                type="button"
                onClick={() => scrollLeadership('left')}
                className="leadership-nav-btn"
                title="Scroll Left"
                aria-label="Scroll leadership left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollLeadership('right')}
                className="leadership-nav-btn"
                title="Scroll Right"
                aria-label="Scroll leadership right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <h2 className="section-title">
            Meet Our <span className="gradient-text">Leadership</span>
          </h2>
          <p className="section-subtitle">
            Driven by Innovation. United by Vision. At SriVoraTech, our leadership team combines technical expertise, innovation, and strategic thinking.
            <span className="hover-hint-span"> (Click or hover any card to reveal executive bio & expertise)</span>
          </p>
        </div>

        {/* Executive Leader Cards Carousel (Left-to-Right Horizontal Stream) */}
        <div className="leadership-carousel-wrapper" ref={scrollStreamRef}>
          <div className={`leadership-carousel-track ${isVisible ? 'cards-visible' : ''}`}>
            {leaders.map((leader, idx) => {
              const isExpanded = expandedLeaderId === leader.id
              return (
                <div
                  key={leader.id}
                  className={`leader-card glass-card animate-on-scroll ${isVisible ? 'visible' : ''} ${isExpanded ? 'is-expanded' : ''}`}
                  style={{ '--leader-accent': leader.color, '--delay': `${0.06 + idx * 0.08}s` }}
                  onClick={() => toggleLeaderExpand(leader.id)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleLeaderExpand(leader.id)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isExpanded}
                >
                  {/* Top Accent Gradient Ribbon */}
                  <div className="card-top-accent-line" style={{ background: `linear-gradient(90deg, ${leader.color}, #38bdf8)` }} />

                  {/* Circular Profile Avatar (Strict 100% Circular Shape) */}
                  <div className="leader-top-profile">
                    <div className="leader-avatar-wrapper">
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.name} className="leader-avatar-img circular-pic" />
                      ) : (
                        <div className="leader-avatar-circle circular-pic" style={{ background: leader.color }}>
                          <span>{leader.initials}</span>
                        </div>
                      )}
                      <span className="avatar-glow-ring" style={{ background: `${leader.color}45` }} />
                    </div>

                    <div className="leader-badge-row">
                      <span className="leader-level-badge" style={{ color: leader.color, borderColor: `${leader.color}40`, background: `${leader.color}10` }}>
                        <Award size={13} /> {leader.level}
                      </span>
                      <span className="verified-leadership-chip">
                        <ShieldCheck size={12} style={{ color: '#10b981' }} /> Verified Executive
                      </span>
                    </div>

                    <h3 className="leader-name">{leader.name}</h3>
                    <p className="leader-role" style={{ color: leader.color }}>{leader.role}</p>

                    {/* Interactive Click / Hover Hint */}
                    <div className="leader-hover-hint">
                      {isExpanded ? <ChevronDown size={13} /> : <Eye size={13} />}
                      <span>{isExpanded ? 'Hide Details' : 'Click/Hover for Bio'}</span>
                    </div>

                    {/* Social Action Buttons */}
                    <div className="leader-social-actions" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={leader.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="leader-action-btn linkedin"
                        title={`Connect with ${leader.name} on LinkedIn`}
                        aria-label={`LinkedIn Profile for ${leader.name}`}
                      >
                        <Linkedin size={15} />
                      </a>
                      <a
                        href={`mailto:${leader.email}`}
                        className="leader-action-btn email"
                        title={`Email ${leader.name}`}
                        aria-label={`Email ${leader.name}`}
                      >
                        <Mail size={15} />
                      </a>
                    </div>
                  </div>

                  {/* Animated Hover Description Drawer */}
                  <div className="leader-hover-drawer">
                    <div className="leader-bio-body">
                      <p>{leader.bio}</p>
                    </div>

                    <div className="leader-expertise-section">
                      <span className="expertise-title">CORE EXPERTISE & SKILLS</span>
                      <div className="expertise-chips-grid">
                        {leader.expertise.map((item) => (
                          <span key={item} className="expertise-chip">
                            <CheckCircle2 size={12} style={{ color: leader.color }} /> {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="leadership-dots-bar">
          {leaders.map((leader, idx) => (
            <button
              key={leader.id}
              type="button"
              className={`leadership-dot ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => scrollToCard(idx)}
              title={`View ${leader.name}`}
              aria-label={`Scroll to ${leader.name}`}
              style={{ '--dot-color': leader.color }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
