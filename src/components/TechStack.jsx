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
  Flame,
  Search,
  X
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
    color: '#0067f4',
    popularity: '98%',
    level: 98,
    tags: ['UI Framework', 'Hooks', 'Vite', 'SPAs'],
  },
  {
    id: 'nextjs',
    name: 'Next.js 14',
    category: 'frontend',
    desc: 'Server-side rendering, App Router, and static site generation for SEO.',
    icon: Globe,
    badge: 'Frontend',
    color: '#8b5cf6',
    popularity: '96%',
    level: 96,
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
    level: 95,
    tags: ['Type Safety', 'Interfaces', 'Enterprise'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    desc: 'Utility-first CSS framework for rapid modern UI layout construction.',
    icon: Layers,
    badge: 'Styling',
    color: '#06b6d4',
    popularity: '94%',
    level: 94,
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
    color: '#10b981',
    popularity: '97%',
    level: 97,
    tags: ['Event Loop', 'REST API', 'Microservices'],
  },
  {
    id: 'python',
    name: 'Python / FastAPI',
    category: 'backend',
    desc: 'High-performance backend API execution and asynchronous data workflows.',
    icon: Flame,
    badge: 'Backend',
    color: '#f59e0b',
    popularity: '95%',
    level: 95,
    tags: ['AsyncIO', 'FastAPI', 'Automation'],
  },

  // Cloud & DevOps
  {
    id: 'aws',
    name: 'AWS Cloud',
    category: 'cloud',
    desc: 'Scalable cloud infrastructure, S3 storage, Lambda serverless computing, and CloudFront CDN.',
    icon: Cloud,
    badge: 'Cloud Infrastructure',
    color: '#ff9900',
    popularity: '96%',
    level: 96,
    tags: ['EC2', 'S3 Storage', 'Lambda Serverless', 'CloudFront'],
  },
  {
    id: 'docker',
    name: 'Docker Containerization',
    category: 'cloud',
    desc: 'Lightweight containerized application environments for smooth staging & production deployments.',
    icon: Server,
    badge: 'DevOps',
    color: '#0284c7',
    popularity: '94%',
    level: 94,
    tags: ['Containers', 'CI/CD Pipelines', 'Deployments'],
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
    level: 97,
    tags: ['LLMs', 'RAG', 'Vector Embeddings', 'Neural Nets'],
  },
  {
    id: 'python-data',
    name: 'Pandas & NumPy',
    category: 'ai',
    desc: 'High-performance data analysis, cleaning, and predictive modeling algorithms.',
    icon: Sparkles,
    badge: 'Analytics',
    color: '#a855f7',
    popularity: '92%',
    level: 92,
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
    color: '#3b82f6',
    popularity: '96%',
    level: 96,
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
    level: 93,
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
    level: 94,
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
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTech = technologies.filter((t) => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

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

        {/* Category Filter Pills & Search */}
        <div className="tech-filter-row">
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

          <div className="tech-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search tech stack..."
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

        {/* Tech Cards Grid — Clean Professional White Startup UI/UX */}
        <div className="tech-cards-grid">
          {filteredTech.map((tech, idx) => {
            const Icon = tech.icon
            return (
              <div 
                key={tech.id} 
                className={`tech-card animate-on-scroll delay-${(idx % 4) + 1} ${isVisible ? 'visible' : ''}`}
                style={{ 
                  '--tech-accent': tech.color, 
                  '--delay': `${0.04 + idx * 0.04}s` 
                }}
              >
                {/* Top Subtle Brand Color Line */}
                <div 
                  className="tech-top-accent-line" 
                  style={{ background: tech.color }} 
                />

                <div className="tech-card-header">
                  <div 
                    className="tech-icon-wrapper" 
                    style={{ 
                      background: `linear-gradient(135deg, ${tech.color}14, ${tech.color}06)`, 
                      color: tech.color, 
                      borderColor: `${tech.color}30` 
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="tech-meta">
                    <span 
                      className="tech-badge" 
                      style={{ 
                        color: tech.color, 
                        borderColor: `${tech.color}30`, 
                        background: `${tech.color}0f` 
                      }}
                    >
                      {tech.badge}
                    </span>
                    <div className="tech-rating">
                      <span className="pulse-indicator" style={{ background: tech.color }} />
                      <span className="rating-num">{tech.popularity} Match</span>
                    </div>
                  </div>
                </div>

                <h3 className="tech-name">{tech.name}</h3>
                <p className="tech-desc">{tech.desc}</p>

                {/* Skill Meter Progress Bar */}
                <div className="tech-skill-meter">
                  <div className="skill-meter-header">
                    <span className="skill-meter-title">Production Readiness</span>
                    <span className="skill-meter-text" style={{ color: tech.color }}>
                      {tech.level}%
                    </span>
                  </div>
                  <div className="skill-meter-track">
                    <div 
                      className="skill-meter-fill" 
                      style={{ 
                        width: `${tech.level}%`, 
                        background: tech.color
                      }} 
                    />
                  </div>
                </div>

                <div className="tech-tags">
                  {tech.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="tech-tag"
                    >
                      <Zap size={10} style={{ color: tech.color }} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
