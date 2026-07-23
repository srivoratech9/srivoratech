import { useState, useEffect, useCallback } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle2, ShieldCheck, Zap, ArrowRight, Layers, Cpu, ShoppingBag, Activity, GraduationCap, Briefcase } from 'lucide-react'
import './ProjectCards.css'

const projects = [
  {
    id: 1,
    name: 'SriERP Pro',
    category: 'Enterprise Software (ERP)',
    desc: 'A comprehensive Enterprise Resource Planning (ERP) platform managing HR, payroll, inventory, finance, attendance, customer management, and project workflows from one centralized dashboard.',
    techs: ['React.js', 'NestJS', 'PostgreSQL', 'Docker', 'AWS'],
    color: '#0067f4',
    initial: 'E',
    icon: Layers,
    metrics: ['Automated Payroll & HR', 'Real-Time Inventory', 'Sub-Second Analytics']
  },
  {
    id: 2,
    name: 'SmartAI Assistant',
    category: 'Artificial Intelligence',
    desc: 'An AI-powered virtual assistant that answers customer queries, automates business workflows, summarizes documents, and integrates with websites, CRM, and ERP platforms to improve productivity.',
    techs: ['Python', 'FastAPI', 'OpenAI / Gemini', 'LangChain', 'Vector Database'],
    color: '#8b5cf6',
    initial: 'A',
    icon: Cpu,
    metrics: ['99.4% Query Accuracy', 'Automated Workflows', 'Vector Search Engine']
  },
  {
    id: 3,
    name: 'ShopSphere Commerce',
    category: 'E-Commerce Platform',
    desc: 'A modern e-commerce platform featuring secure payments, inventory management, order tracking, analytics, customer accounts, discount management, and an intuitive admin dashboard.',
    techs: ['Next.js', 'Node.js', 'MongoDB', 'Stripe / Razorpay', 'Cloudinary'],
    color: '#10b981',
    initial: 'S',
    icon: ShoppingBag,
    metrics: ['Stripe / Razorpay Sync', 'Bulk Order Tracking', 'Instant Checkout']
  },
  {
    id: 4,
    name: 'HealthConnect',
    category: 'Healthcare Platform',
    desc: 'A digital healthcare solution enabling online appointment booking, electronic medical records, teleconsultation, prescription management, and patient-doctor communication in a secure environment.',
    techs: ['React.js', 'Node.js', 'MySQL', 'WebRTC', 'Firebase'],
    color: '#ec4899',
    initial: 'H',
    icon: Activity,
    metrics: ['HD Teleconsultation', 'Encrypted E-Records', 'Real-Time Rx Sync']
  },
  {
    id: 5,
    name: 'EduVerse LMS',
    category: 'Education Platform',
    desc: 'A cloud-based Learning Management System (LMS) for schools, colleges, and training institutes, providing online classes, assessments, course management, attendance tracking, and progress analytics.',
    techs: ['React.js', 'Django', 'PostgreSQL', 'AWS S3', 'JWT Auth'],
    color: '#f59e0b',
    initial: 'E',
    icon: GraduationCap,
    metrics: ['Live Assessments', 'Progress Analytics', 'Cloud AWS S3 Storage']
  },
  {
    id: 6,
    name: 'ProjectFlow CRM',
    category: 'Business CRM & Project Management',
    desc: 'A customer relationship and project management platform with lead tracking, client communication, task assignment, milestone tracking, invoicing, team collaboration, and real-time reporting.',
    techs: ['React.js', 'Express.js', 'MongoDB', 'Socket.IO', 'Docker'],
    color: '#06b6d4',
    initial: 'P',
    icon: Briefcase,
    metrics: ['Socket.IO Real-Time Chat', 'Automated Invoicing', 'Lead Pipeline Graph']
  },
  {
    id: 7,
    name: 'SriVora AI Autonomous Agents',
    category: 'Enterprise AI • Autonomous Agents',
    desc: 'An upcoming autonomous multi-agent platform designed to orchestrate complex enterprise tasks, execute data pipelines, run automated software testing, and manage AI customer interactions.',
    techs: ['Python', 'LangGraph', 'FastAPI', 'DeepSeek-V3', 'Pinecone'],
    color: '#8b5cf6',
    initial: 'A',
    icon: Cpu,
    isUpcoming: true,
    statusTag: 'Upcoming Project (Q4 2026)',
    metrics: ['Multi-Agent Graph Orchestrator', '10x Speed Scaling', 'Q4 2026 Expected Launch']
  },
]

const founderQuote = {
  name: 'Badisa Srikanth',
  role: 'Founder & CEO – SriVoraTech',
  text: '"Building innovative software and AI-powered solutions that empower businesses to grow, automate, and succeed in the digital era."',
  avatar: 'B'
}

function ProjectMockup({ project }) {
  const Icon = project.icon

  return (
    <div className="mockup-frame-box">
      <div className="browser-mock-wrapper">
        <div className="b-header">
          <div className="b-dots"><span /><span /><span /></div>
          <span className="b-url">srivoratech.com/products/{project.name.toLowerCase().replace(/\s+/g, '-')}</span>
          {project.isUpcoming && (
            <span className="b-upcoming-tag">🚀 Upcoming Project</span>
          )}
        </div>
        <div className="b-body">
          <div className="b-score-card" style={{ background: `${project.color}08`, borderColor: `${project.color}30` }}>
            <div className="b-project-icon-box" style={{ background: project.color, color: '#ffffff' }}>
              <Icon size={22} />
            </div>
            <span className="b-score-title" style={{ color: project.color }}>{project.category}</span>
            <strong className="b-score-val" style={{ color: '#0f172a' }}>{project.name}</strong>
          </div>

          <div className="b-tech-pills">
            {project.techs.map((tech) => (
              <span key={tech} className="b-tech-chip">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectCards() {
  const [ref, isVisible] = useScrollAnimation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }, [])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }, [])

  useEffect(() => {
    if (isHovering) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isHovering])

  const project = projects[currentIndex]

  return (
    <section ref={ref} className={`project-cards-section section animate-on-scroll ${isVisible ? 'visible' : ''}`} id="our-products">
      <div className="container">
        <div className="project-cards-header">
          <div className="section-badge">
            <Sparkles size={14} />
            Featured Enterprise Products & Platforms
          </div>
          <h2 className="section-title">
            Featured <span className="gradient-text">Solutions We Build</span>
          </h2>
          <p className="section-subtitle">
            From Enterprise ERPs to AI Assistants and Healthcare Platforms, explore our signature products built with security and scalability.
          </p>
        </div>

        <div
          className="project-cards-stage-wrap"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="project-card-container glass-card">
            {/* Left Product Display */}
            <div className="project-card-left" style={{ background: `linear-gradient(135deg, ${project.color}10, ${project.color}25)` }}>
              <div className="project-tag-pill" style={{ background: project.color }}>
                {project.category}
              </div>

              <ProjectMockup project={project} />

              <div className="project-metrics-row">
                {project.metrics.map((m) => (
                  <span key={m} className="metric-badge">
                    <CheckCircle2 size={13} style={{ color: project.color }} /> {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Product Info & Founder Quote */}
            <div className="project-card-right">
              <div className="chat-thread">
                <div className="chat-bubble chat-client">
                  <h3 className="project-feature-name" style={{ color: project.color }}>{project.name}</h3>
                  <p className="chat-text">{project.desc}</p>
                </div>

                <div className="chat-bubble chat-reply">
                  <p className="chat-text">{founderQuote.text}</p>
                  <span className="chat-author">{founderQuote.name} • {founderQuote.role}</span>
                </div>
              </div>

              <div className="person-row">
                <div className="person-avatar" style={{ background: '#0067f4' }}>
                  {founderQuote.avatar}
                </div>
                <div className="person-meta">
                  <strong className="person-name">{founderQuote.name}</strong>
                  <span className="person-role">{founderQuote.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="project-controls-bar">
            <button className="nav-arrow-btn" onClick={goPrev} aria-label="Previous product">
              <ChevronLeft size={20} />
            </button>

            <div className="slide-counter">
              <strong>0{currentIndex + 1}</strong> / <span>0{projects.length}</span>
            </div>

            <button className="nav-arrow-btn" onClick={goNext} aria-label="Next product">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
