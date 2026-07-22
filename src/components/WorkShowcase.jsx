import { useState, useEffect, useRef } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ArrowUpRight, ArrowLeft, X, CheckCircle2, Sparkles, ExternalLink, Zap, Link2, MapPin, Building2, Users, Quote, ChevronRight } from 'lucide-react'
import './WorkShowcase.css'

const works = [
  {
    id: 'tfs',
    title: 'TFS - Fintech Mobile App',
    headline: 'How TFS Transformed Indian Fintech',
    category: 'Mobile App • Fintech',
    clientName: 'Narasimha Reddy',
    clientRole: 'CEO, TFS',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    about: 'TFS is India\'s first subscription-based financial services app offering loans, insurance, property services, and rewards.',
    hq: 'Miyapur, Hyderabad',
    industry: 'Fintech',
    companySize: 'Startup (<100)',
    servicesOffered: ['Web Development', 'App Development', 'Landing Page', 'UI/UX'],
    heroQuote: 'India\'s 1st Subscription-Based Financial Services App Brought to Life by SriVoraTech',
    challenge: 'Narasimha Reddy, CEO of Thoshika Financial Services Private Limited, wanted to revolutionize the way his customers accessed loan and financial services. His vision? A mobile application that lets users apply for loans, insurance, property services, and earn rewards — all in one platform. After working with multiple IT companies that failed to deliver quality or meet deadlines, trust in tech partners was at an all-time low.',
    solution: 'When hope was fading, Shanthi Priya (HR, TFS) introduced SriVoraTech to Narasimha. Reluctantly, he gave us one last chance — and that made all the difference.',
    approach: [
      'Understood TFS\'s unique multi-service, high-engagement model.',
      'Designed and built a robust mobile app in just 2 months.',
      'Created a smooth, visually appealing interface to make complex services accessible in a few taps.',
      'Engineered a first-of-its-kind rewards system to drive daily app engagement.'
    ],
    features: [
      'One-stop loan, insurance & property services',
      'Daily rewards & referral program',
      'Live application tracking & transparent status updates',
      'Seamless support & knowledge base',
      'Exclusive membership & perks for subscribers',
      'Modern, easy navigation for all ages'
    ],
    resultsList: [
      'Delivered the entire app within 2 months — when others couldn\'t deliver in over a year.',
      'Earned the trust (and friendship) of TFS leadership, becoming more than a vendor — a partner for growth.',
      'TFS\'s Instagram skyrocketed from zero to 10k followers in just one month.',
      'LinkedIn presence, branding, and marketing strategy managed end-to-end by SriVoraTech.'
    ],
    closingQuote: 'We thought it was impossible. SriVoraTech not only made it possible, they changed the way we think about technology partners. We\'re building the future together.',
    technologies: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS Amplify'],
    results: ['4.8/5 App Store Rating', '$12M+ Loans Processed', '< 2s Average API Response']
  },
  {
    id: 'fluentpro',
    title: 'Fluent Pro - AI Learning',
    headline: 'How Fluent Pro Reinvented Language Learning with AI',
    category: 'Web App • EdTech',
    clientName: 'Sujith Reddy Gopu',
    clientRole: 'Founder, Fluent Pro',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    about: 'Fluent Pro is an AI-powered English language learning platform that delivers personalized lesson paths and real-time voice feedback.',
    hq: 'Hyderabad, India',
    industry: 'EdTech',
    companySize: 'Startup (<50)',
    servicesOffered: ['Web Development', 'AI Integration', 'UI/UX', 'Backend Engineering'],
    heroQuote: 'AI-Powered English Learning Platform That Teaches Like a Human Tutor',
    challenge: 'Sujith Reddy envisioned a platform where students could learn English naturally — not through rote memorization, but through AI-driven conversations and real-time pronunciation feedback. Existing solutions were either too generic or lacked the depth of personalization he wanted.',
    solution: 'SriVoraTech partnered with Sujith to architect an AI-first learning platform from the ground up, integrating OpenAI Whisper for speech recognition and building adaptive lesson engines.',
    approach: [
      'Built a proprietary AI speech analysis pipeline with real-time scoring.',
      'Designed adaptive lesson roadmaps that evolve based on student performance.',
      'Created gamified leaderboards and achievement badges to boost engagement.',
      'Developed interactive voice conversation simulators for real-world practice.'
    ],
    features: [
      'AI speech & pronunciation scoring with instant feedback',
      'Adaptive personal lesson roadmaps',
      'Interactive voice conversation simulator',
      'Gamified student leaderboards & badges',
      'Progress tracking with detailed analytics',
      'Multi-level curriculum from beginner to advanced'
    ],
    resultsList: [
      'Onboarded over 85,000 active learners within the first year.',
      'Students achieved 40% faster fluency gains compared to traditional methods.',
      'Featured on EdTech Weekly as an innovative learning platform.',
      'Built a community-driven learning ecosystem with peer-to-peer practice sessions.'
    ],
    closingQuote: 'SriVoraTech didn\'t just build an app — they built the future of how people learn languages. Their AI integration expertise is unmatched.',
    technologies: ['Next.js 14', 'OpenAI Whisper API', 'Python FastAPI', 'Pinecone Vector DB'],
    results: ['85,000+ Active Learners', '40% Faster Fluency Gains', 'Featured on EdTech Weekly']
  },
  {
    id: 'conquer',
    title: 'Conquer - B2B E-Commerce',
    headline: 'How Conquer Streamlined Enterprise B2B Commerce',
    category: 'Web Platform • Commerce',
    clientName: 'Abhishek',
    clientRole: 'Senior Business Analyst, Conquer',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    about: 'Conquer is an enterprise B2B wholesale platform featuring contract-based pricing, custom SKU catalogues, and SAP ERP synchronization.',
    hq: 'Bangalore, India',
    industry: 'B2B Commerce',
    companySize: 'Mid-size (100–500)',
    servicesOffered: ['Web Development', 'API Integration', 'ERP Sync', 'UI/UX'],
    heroQuote: 'Enterprise B2B Platform That Processes $4.2M in Quarterly Orders with Zero Inventory Errors',
    challenge: 'Conquer needed a robust wholesale platform that could handle complex contract-based pricing, tier discounts, and real-time SAP ERP inventory synchronization. Their existing system was manual, error-prone, and couldn\'t scale.',
    solution: 'SriVoraTech designed and built a full-stack B2B e-commerce platform with automated pricing engines and real-time ERP integration.',
    approach: [
      'Architected a contract-based dynamic pricing engine with tier discount calculations.',
      'Built real-time SAP ERP bidirectional inventory sync.',
      'Designed bulk SKU upload with CSV processing for fast onboarding.',
      'Created an intuitive checkout flow optimized for wholesale buyers.'
    ],
    features: [
      'Client-specific contract pricing catalogues',
      'Dynamic volume & tier discount calculator',
      'Bulk SKU CSV upload & fast checkout',
      'Real-time SAP ERP inventory synchronizer',
      'Order tracking with automated notifications',
      'Multi-warehouse stock management'
    ],
    resultsList: [
      'Processed $4.2M in quarterly B2B orders seamlessly.',
      'Reduced manual order processing overhead by 60%.',
      'Achieved zero inventory mismatches since launch.',
      'Onboarded 200+ wholesale buyers within the first quarter.'
    ],
    closingQuote: 'SriVoraTech transformed our manual ordering chaos into a streamlined digital platform. The ERP integration alone saved us hundreds of hours.',
    technologies: ['React.js', 'Node.js', 'GraphQL', 'Redis', 'PostgreSQL'],
    results: ['$4.2M Quarterly B2B Volume', '60% Operational Time Saved', 'Zero Inventory Mismatches']
  },
  {
    id: 'payatom',
    title: 'PayAtom - Payment Platform',
    headline: 'How PayAtom Redefined Modern Fintech Experience',
    category: 'Website • Fintech',
    clientName: 'Aryan Sinha',
    clientRole: 'Founder & CEO, PayAtom',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    about: 'PayAtom is a modern fintech marketing website and merchant dashboard with Spline 3D interactive graphics and multi-currency checkout.',
    hq: 'Mumbai, India',
    industry: 'Fintech',
    companySize: 'Startup (<50)',
    servicesOffered: ['Web Development', '3D Design', 'Landing Page', 'UI/UX'],
    heroQuote: 'A Fintech Landing Page So Good, It Became a ProductHunt Top 5 Product of the Day',
    challenge: 'Aryan Sinha wanted a landing page that didn\'t just look good — it had to feel like the future. He needed immersive 3D animations, seamless checkout flows, and a merchant dashboard that conveyed trust and innovation.',
    solution: 'SriVoraTech combined Three.js/Spline 3D animations with Framer Motion micro-interactions to create a fintech website that became a viral hit on ProductHunt.',
    approach: [
      'Designed interactive 3D credit card and payment animations using Spline.',
      'Built a global multi-currency checkout gateway.',
      'Created a live merchant settlement dashboard with real-time analytics.',
      'Integrated Stripe API for instant payout capabilities.'
    ],
    features: [
      'Interactive 3D credit card & payment animation',
      'Global multi-currency checkout gateway',
      'Live merchant settlement dashboard',
      'Instant payout API integration',
      'Responsive design with 60fps animations',
      'SEO-optimized for organic growth'
    ],
    resultsList: [
      '300% higher lead conversions from the new landing page.',
      'Recognized as ProductHunt Top 5 Product of the Day.',
      'Under 100ms UI animation response time.',
      'Organic traffic increased 5x within two months of launch.'
    ],
    closingQuote: 'SriVoraTech created a website that doesn\'t just convert — it inspires. Every visitor remembers the PayAtom experience.',
    technologies: ['React.js', 'Three.js / Spline', 'Tailwind CSS', 'Framer Motion', 'Stripe API'],
    results: ['300% Higher Lead Conversions', 'ProductHunt Top 5 Product', '< 100ms UI Animation Response']
  },
]

/* Individual card component to avoid calling hooks inside .map() */
function WorkCard({ work, idx, onSelect }) {
  const [cardRef, cardVisible] = useScrollAnimation()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      ref={cardRef}
      className={`work-card animate-on-scroll delay-${(idx % 4) + 1} ${cardVisible ? 'visible' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(work)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(work); } }}
      aria-label={`View project details for ${work.title}`}
    >
      <div className="work-card-image" style={{ background: work.gradient }}>
        <div className="work-card-mockup">
          <div className="mockup-browser">
            <div className="mockup-dots"><span /><span /><span /></div>
            <div className="mockup-content" style={{ background: `${work.color}22` }}>
              <div className="mockup-header" style={{ background: `${work.color}33`, width: '60%', height: '12px', borderRadius: '6px' }} />
              <div className="mockup-lines">
                <div style={{ background: `${work.color}22`, width: '80%', height: '8px', borderRadius: '4px' }} />
                <div style={{ background: `${work.color}22`, width: '65%', height: '8px', borderRadius: '4px' }} />
                <div style={{ background: `${work.color}22`, width: '45%', height: '8px', borderRadius: '4px' }} />
              </div>
              <div className="mockup-blocks">
                <div style={{ background: `${work.color}33`, borderRadius: '8px', flex: 1, height: '40px' }} />
                <div style={{ background: `${work.color}33`, borderRadius: '8px', flex: 1, height: '40px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`work-card-overlay ${isHovered ? 'work-card-overlay--visible' : ''}`}>
        <span className="work-view-label">
          View Project <ArrowUpRight size={16} />
        </span>
      </div>

      <div className="work-card-info">
        <h3 className="work-card-title">{work.title}</h3>
        <span className="work-card-category">{work.category}</span>
      </div>
    </div>
  )
}

/* ===== FULL PROJECT DETAIL PAGE (Codedale-style) ===== */
function ProjectDetailPage({ project, onClose, onSelectProject, allProjects }) {
  const pageRef = useRef(null)

  useEffect(() => {
    setTimeout(() => pageRef.current?.scrollTo(0, 0), 50)
  }, [project.id])

  const otherProjects = allProjects.filter(p => p.id !== project.id)

  return (
    <div className="project-page-backdrop" role="dialog" aria-modal="true">
      <div className="project-page" ref={pageRef}>
        {/* Top Navigation Bar */}
        <div className="project-page-nav">
          <button className="project-back-btn" onClick={onClose}>
            <ArrowLeft size={18} /> Back to Our Work
          </button>
          <button className="project-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* ===== HERO SECTION ===== */}
        <div className="project-hero">
          <div className="project-hero-left">
            <div className="project-breadcrumb">
              <span className="breadcrumb-link" onClick={onClose}>Our Work</span>
              <ChevronRight size={14} />
              <span className="breadcrumb-current">{project.id.toUpperCase()}</span>
            </div>
            <h1 className="project-hero-title">{project.headline}</h1>
            <p className="project-hero-subtitle">A conversation with:</p>
            <div className="project-client-row">
              <div className="project-client-avatar" style={{ background: project.gradient }}>
                {project.clientName.charAt(0)}
              </div>
              <div>
                <span className="project-client-name">{project.clientName}</span>
                <span className="project-client-role">{project.clientRole}</span>
              </div>
            </div>
          </div>
          <div className="project-hero-right">
            <div className="project-hero-banner" style={{ background: project.gradient }}>
              <div className="hero-banner-content">
                <span className="hero-banner-badge">{project.industry}</span>
                <h3 className="hero-banner-title">{project.title.split(' - ')[0]}</h3>
                <p className="hero-banner-sub">{project.category}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 3-COLUMN BODY ===== */}
        <div className="project-body">
          {/* Left Sidebar — About */}
          <aside className="project-sidebar-left">
            <div className="sidebar-section">
              <span className="sidebar-label">ABOUT</span>
              <h4 className="sidebar-company">{project.id.toUpperCase()} <Link2 size={14} /></h4>
              <p className="sidebar-desc">{project.about}</p>
            </div>
            <div className="sidebar-section">
              <span className="sidebar-label">HQ</span>
              <p className="sidebar-value"><MapPin size={14} /> {project.hq}</p>
            </div>
            <div className="sidebar-section">
              <span className="sidebar-label">INDUSTRY</span>
              <p className="sidebar-value"><Building2 size={14} /> {project.industry}</p>
            </div>
            <div className="sidebar-section">
              <span className="sidebar-label">COMPANY SIZE</span>
              <p className="sidebar-value"><Users size={14} /> {project.companySize}</p>
            </div>
          </aside>

          {/* Center Content — Story */}
          <main className="project-content">
            <blockquote className="project-hero-quote">
              <Quote size={24} className="quote-icon" style={{ color: project.color }} />
              {project.heroQuote}
            </blockquote>

            <div className="content-divider" />

            <h2 className="content-heading">The Challenge</h2>
            <p className="content-text">{project.challenge}</p>

            <h2 className="content-heading">Enter SriVoraTech: Turning Vision into Reality</h2>
            <p className="content-text">{project.solution}</p>

            <h3 className="content-subheading">Our Approach</h3>
            <ul className="content-list">
              {project.approach.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h2 className="content-heading">Key Features at a Glance</h2>
            <ul className="content-list content-list--features">
              {project.features.map((feat, i) => (
                <li key={i}>
                  <CheckCircle2 size={16} style={{ color: project.color, flexShrink: 0 }} />
                  {feat}
                </li>
              ))}
            </ul>

            <h2 className="content-heading">Results</h2>
            <ul className="content-list">
              {project.resultsList.map((result, i) => (
                <li key={i}>{result}</li>
              ))}
            </ul>

            {/* Closing Quote */}
            <blockquote className="project-closing-quote" style={{ color: project.color }}>
              <Quote size={20} style={{ opacity: 0.5 }} />
              {project.closingQuote}
              <cite>— {project.clientName}, {project.clientRole}</cite>
            </blockquote>

            {/* Tech Stack */}
            <div className="project-tech-section">
              <h3 className="content-subheading">Technologies Used</h3>
              <div className="project-tech-tags">
                {project.technologies.map(tech => (
                  <span key={tech} className="project-tech-tag">{tech}</span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="project-cta-section">
              <a href="#contact" className="project-cta-btn" onClick={onClose}>
                Build Something Similar <ArrowUpRight size={18} />
              </a>
            </div>
          </main>

          {/* Right Sidebar — Services */}
          <aside className="project-sidebar-right">
            <div className="sidebar-section">
              <span className="sidebar-label">SERVICES OFFERED</span>
              <ul className="sidebar-services-list">
                {project.servicesOffered.map((svc, i) => (
                  <li key={i}>{svc}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* ===== SUGGESTED PROJECTS ===== */}
        <div className="project-suggestions">
          <h3 className="suggestions-title">Explore More Work</h3>
          <div className="suggestions-grid">
            {otherProjects.map(p => (
              <div
                key={p.id}
                className="suggestion-card"
                onClick={() => onSelectProject(p)}
                role="button"
                tabIndex={0}
              >
                <div className="suggestion-card-image" style={{ background: p.gradient }}>
                  <span className="suggestion-badge">{p.category}</span>
                </div>
                <div className="suggestion-card-info">
                  <h4>{p.title}</h4>
                  <span className="suggestion-link">View Project <ArrowUpRight size={14} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WorkShowcase() {
  const [ref, isVisible] = useScrollAnimation()
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null)
    }
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProject])

  return (
    <section className="work-showcase section" id="our-works">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">Our Work Speaks for Itself</h2>
          <p className="section-subtitle">
            Real products we've designed and built for real businesses across industries.
          </p>
        </div>

        <div className="work-grid">
          {works.map((work, idx) => (
            <WorkCard key={work.id} work={work} idx={idx} onSelect={setSelectedProject} />
          ))}
        </div>
      </div>

      {/* Full Project Detail Page Overlay */}
      {selectedProject && (
        <ProjectDetailPage
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSelectProject={setSelectedProject}
          allProjects={works}
        />
      )}
    </section>
  )
}
