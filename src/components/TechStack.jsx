import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { 
  Code2, 
  Cpu, 
  Database, 
  Cloud, 
  Layers, 
  Sparkles, 
  Zap, 
  Server,
  Globe,
  Terminal,
  ShieldCheck,
  Flame,
  Boxes
} from 'lucide-react'
import './TechStack.css'

const categories = [
  { id: 'all', label: 'All Technologies', icon: Sparkles },
  { id: 'frontend', label: 'Frontend', icon: Globe },
  { id: 'backend', label: 'Backend & APIs', icon: Server },
  { id: 'cloud', label: 'Cloud & DevOps', icon: Cloud },
  { id: 'ai', label: 'AI & Data', icon: Cpu },
  { id: 'database', label: 'Databases', icon: Database },
]

const technologies = [
  // Frontend
  {
    id: 'react',
    name: 'React.js',
    category: 'frontend',
    desc: 'Component-driven UI architecture for high-speed dynamic web applications.',
    icon: Code2,
    badge: 'Frontend',
    color: '#61dafb',
    popularity: '98%',
    tags: ['UI Framework', 'Hooks', 'Vite', 'SPAs'],
  },
  {
    id: 'nextjs',
    name: 'Next.js 14',
    category: 'frontend',
    desc: 'Server-side rendering, App Router, and static site generation for SEO.',
    icon: Globe,
    badge: 'Frontend',
    color: '#a78bfa',
    popularity: '96%',
    tags: ['SSR/SSG', 'Server Actions', 'SEO Optimized'],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    desc: 'Strongly typed JavaScript for scalable, robust, and error-free codebases.',
    icon: Terminal,
    badge: 'Language',
    color: '#3178c6',
    popularity: '95%',
    tags: ['Type Safety', 'Interfaces', 'Enterprise'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    desc: 'Utility-first CSS framework for rapid modern UI layout construction.',
    icon: Layers,
    badge: 'Styling',
    color: '#38bdf8',
    popularity: '94%',
    tags: ['Glassmorphism', 'Responsive', 'Design Systems'],
  },

  // Backend
  {
    id: 'nodejs',
    name: 'Node.js & Express',
    category: 'backend',
    desc: 'Event-driven, asynchronous JavaScript runtime powering REST & GraphQL microservices.',
    icon: Server,
    badge: 'Backend',
    color: '#4ade80',
    popularity: '97%',
    tags: ['Event Loop', 'REST API', 'Microservices'],
  },
  {
    id: 'python',
    name: 'Python / FastAPI',
    category: 'backend',
    desc: 'High-performance backend API execution and asynchronous data workflows.',
    icon: Flame,
    badge: 'Backend',
    color: '#facc15',
    popularity: '95%',
    tags: ['AsyncIO', 'FastAPI', 'Automation'],
  },
  {
    id: 'nest',
    name: 'NestJS',
    category: 'backend',
    desc: 'Progressive Node.js framework built with TypeScript for enterprise applications.',
    icon: Boxes,
    badge: 'Architecture',
    color: '#e11d48',
    popularity: '90%',
    tags: ['Dependency Injection', 'Decorators', 'Scalable'],
  },

  // Cloud & DevOps
  {
    id: 'aws',
    name: 'Amazon Web Services',
    category: 'cloud',
    desc: 'Cloud infrastructure hosting EC2, Lambda, S3, ECS, and CloudFront CDN.',
    icon: Cloud,
    badge: 'Cloud',
    color: '#f97316',
    popularity: '99%',
    tags: ['Serverless', 'S3', 'EC2', 'CloudFront'],
  },
  {
    id: 'docker',
    name: 'Docker & Containers',
    category: 'cloud',
    desc: 'Containerization for consistent deployment environments across dev and prod.',
    icon: Boxes,
    badge: 'DevOps',
    color: '#0284c7',
    popularity: '96%',
    tags: ['Containers', 'Docker Compose', 'CI/CD'],
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes (K8s)',
    category: 'cloud',
    desc: 'Automated container orchestration, scaling, and load-balancing management.',
    icon: ShieldCheck,
    badge: 'Orchestration',
    color: '#3b82f6',
    popularity: '91%',
    tags: ['Auto-scaling', 'Clusters', 'Helm'],
  },

  // AI & Data
  {
    id: 'ai-ml',
    name: 'PyTorch & OpenAI API',
    category: 'ai',
    desc: 'Generative AI integrations, LLM pipelines, RAG systems, and custom ML modeling.',
    icon: Cpu,
    badge: 'AI / ML',
    color: '#ec4899',
    popularity: '97%',
    tags: ['LLMs', 'RAG', 'Vector Embeddings', 'Neural Nets'],
  },
  {
    id: 'python-data',
    name: 'Pandas & NumPy',
    category: 'ai',
    desc: 'High-performance data analysis, cleaning, and predictive modeling algorithms.',
    icon: Sparkles,
    badge: 'Analytics',
    color: '#8b5cf6',
    popularity: '92%',
    tags: ['Data Science', 'ETL Pipelines', 'Analytics'],
  },

  // Databases
  {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'database',
    desc: 'Battle-tested relational database with JSONB support, indexing, and high reliability.',
    icon: Database,
    badge: 'Relational',
    color: '#38bdf8',
    popularity: '96%',
    tags: ['ACID Compliant', 'SQL', 'JSONB', 'Prisma ORM'],
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'database',
    desc: 'Document-oriented NoSQL database for flexible data structures and rapid scaling.',
    icon: Database,
    badge: 'NoSQL',
    color: '#22c55e',
    popularity: '93%',
    tags: ['NoSQL', 'Document Store', 'Mongoose'],
  },
  {
    id: 'redis',
    name: 'Redis Cache',
    category: 'database',
    desc: 'Ultra-fast in-memory data store for session caching, pub/sub, and rate limiting.',
    icon: Zap,
    badge: 'Caching',
    color: '#ef4444',
    popularity: '94%',
    tags: ['In-Memory', 'Pub/Sub', 'High Throughput'],
  },
]

const marqueeRow1 = [
  'React.js', 'Next.js 14', 'TypeScript', 'Node.js', 'Python', 'AWS Cloud', 'Docker', 'PostgreSQL'
]

const marqueeRow2 = [
  'PyTorch AI', 'Tailwind CSS', 'FastAPI', 'MongoDB', 'Redis', 'NestJS', 'Kubernetes', 'GraphQL'
]

export default function TechStack() {
  const [sectionRef, isVisible] = useScrollAnimation()
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredTech = activeCategory === 'all'
    ? technologies
    : technologies.filter(t => t.category === activeCategory)

  return (
    <section className="tech-section section" id="tech-stack">
      {/* Background Animated Gradient Orbs */}
      <div className="tech-bg-orb orb-1" />
      <div className="tech-bg-orb orb-2" />

      <div className="container">
        {/* Section Header */}
        <div ref={sectionRef} className={`tech-header animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="tech-badge-top">
            <Zap size={14} className="badge-zap" />
            <span>Modern Tech Ecosystem</span>
          </div>
          <h2 className="tech-title">
            Engineered with <span className="tech-title-gradient">Cutting-Edge Tech</span>
          </h2>
          <p className="tech-subtitle">
            We leverage battle-tested frameworks, serverless cloud architectures, and intelligent AI models to deliver hyper-scalable solutions.
          </p>
        </div>

        {/* Continuous Ticker / Marquee Banner */}
        <div className="tech-marquee-container">
          <div className="tech-marquee-track track-left">
            {[...marqueeRow1, ...marqueeRow1, ...marqueeRow1].map((item, idx) => (
              <div key={`m1-${idx}`} className="tech-marquee-chip">
                <span className="chip-dot" />
                <span className="chip-text">{item}</span>
              </div>
            ))}
          </div>
          <div className="tech-marquee-track track-right">
            {[...marqueeRow2, ...marqueeRow2, ...marqueeRow2].map((item, idx) => (
              <div key={`m2-${idx}`} className="tech-marquee-chip chip-alt">
                <span className="chip-dot dot-alt" />
                <span className="chip-text">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="tech-category-tabs">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                className={`tech-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Icon size={16} className="tab-icon" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tech Cards Grid */}
        <div className="tech-cards-grid">
          {filteredTech.map((tech) => {
            const Icon = tech.icon
            return (
              <div 
                key={tech.id} 
                className="tech-card"
                style={{ '--tech-accent': tech.color }}
              >
                <div className="tech-card-header">
                  <div className="tech-icon-wrapper">
                    <Icon size={24} style={{ color: tech.color }} />
                  </div>
                  <div className="tech-meta">
                    <span className="tech-badge">{tech.badge}</span>
                    <div className="tech-rating">
                      <span className="pulse-indicator" style={{ background: tech.color }} />
                      <span className="rating-num">{tech.popularity} Match</span>
                    </div>
                  </div>
                </div>

                <h3 className="tech-name">{tech.name}</h3>
                <p className="tech-desc">{tech.desc}</p>

                <div className="tech-tags">
                  {tech.tags.map((tag) => (
                    <span key={tag} className="tech-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="tech-card-shine" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
