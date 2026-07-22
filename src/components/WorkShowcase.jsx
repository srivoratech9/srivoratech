import { useState, useEffect, useRef } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { ArrowUpRight, ArrowLeft, X, CheckCircle2, Search, Link2, MapPin, Building2, Users, Quote, ChevronRight, Filter } from 'lucide-react'
import './WorkShowcase.css'

const works = [
  {
    id: 'srierp',
    title: 'SriERP Pro - Enterprise ERP',
    headline: 'Centralized HR, Payroll, Inventory & Finance Platform',
    category: 'Enterprise Software • ERP',
    catGroup: 'enterprise',
    clientName: 'Badisa Srikanth',
    clientRole: 'Founder & CEO, SriVoraTech',
    color: '#0067f4',
    gradient: 'linear-gradient(135deg, #0067f4, #6366f1)',
    about: 'A comprehensive Enterprise Resource Planning (ERP) platform managing HR, payroll, inventory, finance, attendance, customer management, and project workflows from one centralized dashboard.',
    hq: 'Hyderabad, India',
    industry: 'Enterprise Software',
    companySize: 'Enterprise (500+)',
    servicesOffered: ['Full Stack Development', 'ERP Architecture', 'PostgreSQL Data Pipeline', 'Docker AWS Deployment'],
    heroQuote: 'Comprehensive Enterprise Resource Planning Platform Built for Security & Scalability',
    challenge: 'Growing enterprises face fragmented systems across payroll, HR, attendance, inventory, and financial reporting, leading to data silos and manual overhead.',
    solution: 'SriVoraTech architected SriERP Pro — a unified enterprise portal with real-time analytics, automated payroll calculators, and role-based access control.',
    approach: [
      'Built a modular React.js dashboard with instant data visualization charts.',
      'Architected NestJS microservices backed by high-throughput PostgreSQL DB.',
      'Containerized all services using Docker on AWS cloud infrastructure.',
      'Integrated automated salary calculators and attendance biometric logging.'
    ],
    features: [
      'Centralized HR & Automated Payroll Management',
      'Real-Time Multi-Warehouse Inventory Tracking',
      'Financial Accounting & Invoicing Module',
      'Biometric Attendance & Leave Workflow',
      'Project Task & Milestone Management',
      'Role-Based JWT Security & Audit Logs'
    ],
    resultsList: [
      'Reduced enterprise administrative overhead by 65%.',
      'Achieved sub-second data query response for 100,000+ employee records.',
      'Zero downtime during peak end-of-month payroll processing.',
      'Full compliance with enterprise security and data privacy standards.'
    ],
    closingQuote: 'Building innovative software and AI-powered solutions that empower businesses to grow, automate, and succeed in the digital era.',
    technologies: ['React.js', 'NestJS', 'PostgreSQL', 'Docker', 'AWS'],
    results: ['65% Admin Overhead Saved', 'Sub-Second Query Speed', '100% Payroll Accuracy']
  },
  {
    id: 'smartai',
    title: 'SmartAI Assistant',
    headline: 'AI Virtual Assistant & Workflow Automation Engine',
    category: 'AI Platform • Workflow',
    catGroup: 'ai',
    clientName: 'Badisa Srikanth',
    clientRole: 'Founder & CEO, SriVoraTech',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    about: 'An AI-powered virtual assistant that answers customer queries, automates business workflows, summarizes documents, and integrates with websites, CRM, and ERP platforms.',
    hq: 'Hyderabad, India',
    industry: 'Artificial Intelligence',
    companySize: 'Mid-size & Enterprise',
    servicesOffered: ['Python AI Engine', 'FastAPI Backend', 'LangChain Integration', 'Vector Database Pipeline'],
    heroQuote: 'AI Virtual Assistant That Automates Customer Support & Summarizes Enterprise Docs',
    challenge: 'Businesses struggle with high support ticket volume and manual document processing, slowing response times for critical customer inquiries.',
    solution: 'SriVoraTech engineered SmartAI Assistant using RAG (Retrieval-Augmented Generation), Python FastAPI, and vector databases for semantic document search.',
    approach: [
      'Built document embedding pipelines using OpenAI & Google Gemini APIs.',
      'Leveraged Pinecone/Vector DB for sub-100ms semantic knowledge retrieval.',
      'Designed website chat widget & CRM/ERP integration webhooks.',
      'Created automated workflow triggers for email, ticket, and lead capture.'
    ],
    features: [
      '24/7 AI Customer Support & Chatbot Embed',
      'Automated Enterprise Document Summarization',
      'LangChain & Vector Database RAG Architecture',
      'Seamless CRM & ERP Webhook Integrations',
      'Multi-Language Translation & Voice Assist',
      'Real-Time Analytics & Escalation Routing'
    ],
    resultsList: [
      'Automated 80% of routine customer support queries instantly.',
      'Saved teams over 120 hours monthly in document analysis.',
      'Integrated smoothly across web, CRM, and internal Slack channels.',
      'Maintained 99.4% semantic retrieval accuracy on technical knowledge bases.'
    ],
    closingQuote: 'SmartAI Assistant turns enterprise knowledge into instant, accurate answers for customers and internal teams.',
    technologies: ['Python', 'FastAPI', 'OpenAI / Gemini', 'LangChain', 'Vector DB'],
    results: ['80% Support Tickets Automated', '120+ Hours Monthly Saved', '99.4% Retrieval Accuracy']
  },
  {
    id: 'shopsphere',
    title: 'ShopSphere Commerce',
    headline: 'Modern Multi-Vendor E-Commerce Platform',
    category: 'E-Commerce • Payments',
    catGroup: 'commerce',
    clientName: 'Badisa Srikanth',
    clientRole: 'Founder & CEO, SriVoraTech',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    about: 'A modern e-commerce platform featuring secure payments, inventory management, order tracking, analytics, customer accounts, discount management, and an admin dashboard.',
    hq: 'Hyderabad, India',
    industry: 'E-Commerce',
    companySize: 'SMBs & Retail Brands',
    servicesOffered: ['Next.js App Router', 'Node.js API', 'Stripe / Razorpay Checkout', 'Cloudinary Media CDN'],
    heroQuote: 'Modern E-Commerce Engine Delivering Lightning-Fast Checkout & Admin Analytics',
    challenge: 'E-commerce retailers face slow page loading times, high cart abandonment, and clunky inventory admin interfaces.',
    solution: 'SriVoraTech created ShopSphere Commerce with server-side rendered Next.js 14, Stripe/Razorpay payment gateways, and automated Cloudinary image optimization.',
    approach: [
      'Utilized Next.js 14 SSR for sub-second page loads and maximum SEO performance.',
      'Integrated Stripe & Razorpay multi-currency checkout gateways.',
      'Built a full-featured admin dashboard with real-time revenue analytics.',
      'Designed coupon discount engines and automated order status webhooks.'
    ],
    features: [
      'Multi-Currency Stripe & Razorpay Checkout',
      'Real-Time Inventory & Low-Stock Alerts',
      'Automated Order Tracking & Email Receipts',
      'Dynamic Discount & Coupon Code Engine',
      'Customer Account Portals & Order History',
      'Intuitive Admin Sales Analytics Dashboard'
    ],
    resultsList: [
      'Boosted mobile conversion rate by 45% with instant checkout.',
      'Achieved a 99.9% uptime track during high-traffic promotional sales.',
      'Reduced image payload size by 70% using Cloudinary CDN.',
      'Processed over 50,000 orders without a single transaction error.'
    ],
    closingQuote: 'ShopSphere delivers the speed and scalability online retailers need to convert visitors into loyal customers.',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe / Razorpay', 'Cloudinary'],
    results: ['45% Higher Conversion Rate', '99.9% Sale Uptime Track', '50,000+ Orders Processed']
  },
  {
    id: 'healthconnect',
    title: 'HealthConnect Healthcare',
    headline: 'Digital Teleconsultation & Patient EMR Platform',
    category: 'Healthcare • Telemed',
    catGroup: 'healthcare',
    clientName: 'Badisa Srikanth',
    clientRole: 'Founder & CEO, SriVoraTech',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    about: 'A digital healthcare solution enabling online appointment booking, electronic medical records (EMR), teleconsultation, prescription management, and patient-doctor communication.',
    hq: 'Hyderabad, India',
    industry: 'Healthcare & HealthTech',
    companySize: 'Hospitals & Clinics',
    servicesOffered: ['React.js Frontend', 'WebRTC Video Engine', 'MySQL Database', 'Firebase Realtime'],
    heroQuote: 'Secure Digital Healthcare Solution Bringing Teleconsultations & EMR to Patients',
    challenge: 'Healthcare providers require HIPAA-compliant, encrypted video consultation systems and instant digital prescription management.',
    solution: 'SriVoraTech built HealthConnect using WebRTC peer-to-peer video streams, secure MySQL EMR databases, and Firebase real-time notifications.',
    approach: [
      'Engineered WebRTC encrypted video calling with zero plugin downloads.',
      'Designed digital prescription generation with downloadable PDFs.',
      'Built online appointment scheduling with doctor calendar sync.',
      'Implemented end-to-end encrypted medical record storage.'
    ],
    features: [
      'WebRTC HD Peer-to-Peer Teleconsultation',
      'Electronic Medical Records (EMR) Vault',
      'Online Doctor Appointment Booking',
      'Digital Prescription Generator (PDF)',
      'Secure Doctor-Patient In-App Messaging',
      'Real-Time Firebase Push Notifications'
    ],
    resultsList: [
      'Facilitated over 25,000 successful video consultations.',
      'Reduced patient waiting times by 50% through digital queues.',
      'Maintained 100% data encryption compliance for medical records.',
      'Rated 4.9/5 stars by participating physicians and patients.'
    ],
    closingQuote: 'HealthConnect bridges the distance between patients and doctors with secure, intuitive digital healthcare.',
    technologies: ['React.js', 'Node.js', 'MySQL', 'WebRTC', 'Firebase'],
    results: ['25,000+ Video Consults', '50% Reduced Wait Time', '4.9/5 Rating by Physicians']
  },
  {
    id: 'eduverse',
    title: 'EduVerse LMS',
    headline: 'Cloud-Based Learning Management System',
    category: 'Education • LMS',
    catGroup: 'education',
    clientName: 'Badisa Srikanth',
    clientRole: 'Founder & CEO, SriVoraTech',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    about: 'A cloud-based Learning Management System (LMS) for schools, colleges, and training institutes, providing online classes, assessments, course management, and progress analytics.',
    hq: 'Hyderabad, India',
    industry: 'EdTech & Education',
    companySize: 'Institutes & Universities',
    servicesOffered: ['React.js Dashboard', 'Django REST Framework', 'PostgreSQL DB', 'AWS S3 Video Streaming'],
    heroQuote: 'Cloud-Based LMS Empowering Universities & Institutes with Online Assessment & Classes',
    challenge: 'Educational institutions need reliable platforms to manage course materials, stream video lectures, track student attendance, and conduct online assessments.',
    solution: 'SriVoraTech designed EduVerse LMS with Django REST APIs, AWS S3 video streaming, and automated grading analytics.',
    approach: [
      'Architected secure AWS S3 video streaming for HD lecture playback.',
      'Built automated quiz & assignment grading engines with instant results.',
      'Designed student attendance and progress tracking analytics dashboard.',
      'Implemented JWT authentication with role-based student/teacher access.'
    ],
    features: [
      'Online Course Management & Lecture Video Stream',
      'Automated Quiz & Assignment Grading System',
      'Student Attendance & Engagement Tracking',
      'Progress Analytics & Performance Reports',
      'Role-Based Access for Students, Teachers & Admins',
      'AWS S3 Secure Cloud Storage Integration'
    ],
    resultsList: [
      'Supported 40,000+ enrolled students across multiple campuses.',
      'Achieved 99.8% streaming reliability during final exams.',
      'Saved faculty 30+ hours per semester in automated grading.',
      'Enabled seamless remote learning and assessment management.'
    ],
    closingQuote: 'EduVerse LMS transforms traditional education into a modern, accessible cloud learning experience.',
    technologies: ['React.js', 'Django', 'PostgreSQL', 'AWS S3', 'JWT Auth'],
    results: ['40,000+ Enrolled Students', '99.8% Exam Streaming Reliability', '30+ Hours Saved per Faculty']
  },
  {
    id: 'projectflow',
    title: 'ProjectFlow CRM',
    headline: 'Business CRM & Collaborative Project Workspace',
    category: 'Business CRM • Projects',
    catGroup: 'crm',
    clientName: 'Badisa Srikanth',
    clientRole: 'Founder & CEO, SriVoraTech',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    about: 'A customer relationship and project management platform with lead tracking, client communication, task assignment, milestone tracking, invoicing, team collaboration, and real-time reporting.',
    hq: 'Hyderabad, India',
    industry: 'Business Productivity',
    companySize: 'Agencies & Startups',
    servicesOffered: ['React.js App', 'Express.js API', 'MongoDB Cluster', 'Socket.IO Realtime'],
    heroQuote: 'All-in-One CRM & Project Management Tool for Lead Tracking & Team Collaboration',
    challenge: 'Growing companies struggle to track sales pipelines, assign project tasks, and issue client invoices across disjointed tools.',
    solution: 'SriVoraTech built ProjectFlow CRM using React.js, Express.js, MongoDB, and Socket.IO for real-time team messaging and milestone updates.',
    approach: [
      'Created Kanban & List project views with drag-and-drop task movement.',
      'Engineered Socket.IO real-time chat and notification webhooks.',
      'Built automated client invoice generation with PDF exports.',
      'Designed lead pipeline funnel tracking with conversion analytics.'
    ],
    features: [
      'Visual Lead Sales Pipeline & CRM Funnel',
      'Drag-and-Drop Task & Milestone Management',
      'Socket.IO Real-Time Team Collaboration & Chat',
      'Automated Client Invoicing & Payment Status',
      'Time Tracking & Project Budget Reports',
      'Docker Containerized Architecture'
    ],
    resultsList: [
      'Increased lead-to-client conversion rate by 35%.',
      'Accelerated project milestone completion speed by 25%.',
      'Eliminated reliance on 4 separate subscription software tools.',
      'Adopted by over 150 growing business teams.'
    ],
    closingQuote: 'ProjectFlow CRM streamlines lead generation, project execution, and invoicing in one powerful platform.',
    technologies: ['React.js', 'Express.js', 'MongoDB', 'Socket.IO', 'Docker'],
    results: ['35% Higher Lead Conversion', '25% Faster Milestone Delivery', '150+ Teams Onboarded']
  },
]

const categories = [
  { id: 'all', label: 'All Solutions' },
  { id: 'enterprise', label: 'Enterprise Software' },
  { id: 'ai', label: 'Artificial Intelligence' },
  { id: 'commerce', label: 'E-Commerce' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'crm', label: 'CRM & Projects' },
]

/* Individual card component */
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
      aria-label={`View solution details for ${work.title}`}
    >
      <div className="work-card-image" style={{ background: work.gradient }}>
        <div className="work-card-mockup">
          <div className="mockup-browser">
            <div className="mockup-dots"><span /><span /><span /></div>
            <div className="mockup-content" style={{ background: `${work.color}22` }}>
              <div className="mockup-header" style={{ background: `${work.color}44`, width: '60%', height: '14px', borderRadius: '6px' }} />
              <div className="mockup-lines">
                <div style={{ background: `${work.color}33`, width: '85%', height: '8px', borderRadius: '4px' }} />
                <div style={{ background: `${work.color}33`, width: '65%', height: '8px', borderRadius: '4px' }} />
                <div style={{ background: `${work.color}33`, width: '45%', height: '8px', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`work-card-overlay ${isHovered ? 'work-card-overlay--visible' : ''}`}>
        <span className="work-view-label">
          View Solution Details <ArrowUpRight size={16} />
        </span>
      </div>

      <div className="work-card-info">
        <h3 className="work-card-title">{work.title}</h3>
        <span className="work-card-category">{work.category}</span>
      </div>
    </div>
  )
}

/* Full project detail modal */
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
            <ArrowLeft size={18} /> Back to Products
          </button>
          <button className="project-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Hero Section */}
        <div className="project-hero">
          <div className="project-hero-left">
            <div className="project-breadcrumb">
              <span className="breadcrumb-link" onClick={onClose}>Products</span>
              <ChevronRight size={14} />
              <span className="breadcrumb-current">{project.id.toUpperCase()}</span>
            </div>
            <h1 className="project-hero-title">{project.headline}</h1>
            <p className="project-hero-subtitle">Solution Overview by Founder:</p>
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

        {/* 3-Column Body */}
        <div className="project-body">
          {/* Left Sidebar */}
          <aside className="project-sidebar-left">
            <div className="sidebar-section">
              <span className="sidebar-label">ABOUT</span>
              <h4 className="sidebar-company">{project.id.toUpperCase()} <Link2 size={14} /></h4>
              <p className="sidebar-desc">{project.about}</p>
            </div>
            <div className="sidebar-section">
              <span className="sidebar-label">LOCATION</span>
              <p className="sidebar-value"><MapPin size={14} /> {project.hq}</p>
            </div>
            <div className="sidebar-section">
              <span className="sidebar-label">CATEGORY</span>
              <p className="sidebar-value"><Building2 size={14} /> {project.industry}</p>
            </div>
            <div className="sidebar-section">
              <span className="sidebar-label">TARGET USERS</span>
              <p className="sidebar-value"><Users size={14} /> {project.companySize}</p>
            </div>
          </aside>

          {/* Center Content */}
          <main className="project-content">
            <blockquote className="project-hero-quote">
              <Quote size={24} className="quote-icon" style={{ color: project.color }} />
              {project.heroQuote}
            </blockquote>

            <div className="content-divider" />

            <h2 className="content-heading">The Industry Problem</h2>
            <p className="content-text">{project.challenge}</p>

            <h2 className="content-heading">SriVoraTech Solution Architecture</h2>
            <p className="content-text">{project.solution}</p>

            <h3 className="content-subheading">Engineering Approach</h3>
            <ul className="content-list">
              {project.approach.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h2 className="content-heading">Key Product Features</h2>
            <ul className="content-list content-list--features">
              {project.features.map((feat, i) => (
                <li key={i}>
                  <CheckCircle2 size={16} style={{ color: project.color, flexShrink: 0 }} />
                  {feat}
                </li>
              ))}
            </ul>

            <h2 className="content-heading">Verified Business Results</h2>
            <ul className="content-list">
              {project.resultsList.map((result, i) => (
                <li key={i}>{result}</li>
              ))}
            </ul>

            {/* Closing Founder Quote */}
            <blockquote className="project-closing-quote" style={{ color: project.color }}>
              <Quote size={20} style={{ opacity: 0.5 }} />
              {project.closingQuote}
              <cite>— {project.clientName}, {project.clientRole}</cite>
            </blockquote>

            {/* Tech Stack */}
            <div className="project-tech-section">
              <h3 className="content-subheading">Technologies Powered By</h3>
              <div className="project-tech-tags">
                {project.technologies.map(tech => (
                  <span key={tech} className="project-tech-tag">{tech}</span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="project-cta-section">
              <a href="#contact" className="project-cta-btn" onClick={onClose}>
                Request Demo or Custom Build <ArrowUpRight size={18} />
              </a>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="project-sidebar-right">
            <div className="sidebar-section">
              <span className="sidebar-label">ENGINEERING STACK</span>
              <ul className="sidebar-services-list">
                {project.servicesOffered.map((svc, i) => (
                  <li key={i}>{svc}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Suggested Projects */}
        <div className="project-suggestions">
          <h3 className="suggestions-title">Explore Other Enterprise Products</h3>
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
                  <span className="suggestion-link">View Product <ArrowUpRight size={14} /></span>
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
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredWorks = works.filter((w) => {
    const matchesTab = activeTab === 'all' || w.catGroup === activeTab
    const matchesSearch = searchQuery === '' || 
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.about.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  })

  return (
    <section className="work-showcase section" id="our-works">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">Our Solutions & Products</h2>
          <p className="section-subtitle">
            Enterprise software platforms, AI virtual assistants, e-commerce engines, and healthcare solutions built by SriVoraTech.
          </p>
        </div>

        {/* Portfolio Category Filters & Search */}
        <div className="work-filter-bar">
          <div className="work-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`work-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="work-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by tech or keyword..."
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

        <div className="work-grid">
          {filteredWorks.map((work, idx) => (
            <WorkCard key={work.id} work={work} idx={idx} onSelect={setSelectedProject} />
          ))}

          {filteredWorks.length === 0 && (
            <div className="work-empty-state">
              <Filter size={32} />
              <p>No products match your current filter. Try adjusting your search query.</p>
            </div>
          )}
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
