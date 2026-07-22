import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import {
  Code,
  Smartphone,
  Laptop,
  Globe,
  Bot,
  Workflow,
  Brain,
  Cpu,
  Building2,
  Users,
  Palette,
  ShieldCheck,
} from 'lucide-react'
import './Services.css'

const servicesList = [
  {
    title: 'Custom Software Development',
    desc: 'Tailored software solutions built from scratch to solve your unique business challenges with precision and scalability.',
    icon: Laptop,
    color: '#6366f1',
    features: ['Cloud-Native Architecture', 'Microservices Design', 'API Integrations', 'CI/CD Pipelines'],
    technologies: ['Python', 'Node.js', 'PostgreSQL', 'AWS'],
    benefits: ['Tailored Solutions', 'Scalable Architecture', 'Cost Efficiency'],
  },
  {
    title: 'Website Design & Development',
    desc: 'Beautiful, responsive websites that captivate visitors and drive conversions with modern design and smooth interactions.',
    icon: Globe,
    color: '#8b5cf6',
    features: ['Responsive Design', 'CMS Integration', 'SEO Optimization', 'Performance Tuning'],
    technologies: ['React', 'Next.js', 'Framer Motion', 'Tailwind CSS'],
    benefits: ['Fast Performance', 'SEO Friendly', 'Cross-Device Compatible'],
  },
  {
    title: 'Full Stack Web Application Development',
    desc: 'End-to-end web applications using React, Next.js, Node.js, and modern databases for lightning-fast performance.',
    icon: Code,
    color: '#0067f4',
    features: ['React & Next.js', 'Node.js Backend', 'REST & GraphQL APIs', 'Auth & Security'],
    technologies: ['React', 'TypeScript', 'Node.js', 'Prisma'],
    benefits: ['Lightning Fast', 'Fully Responsive', 'Secure by Design'],
  },
  {
    title: 'Mobile App Development',
    desc: 'Native and cross-platform mobile apps for iOS & Android built with Flutter and React Native for maximum reach.',
    icon: Smartphone,
    color: '#10b981',
    features: ['Flutter & React Native', 'Offline Support', 'Push Notifications', 'App Store Deployment'],
    technologies: ['Flutter', 'React Native', 'Firebase', 'Swift'],
    benefits: ['Cross-Platform', 'Smooth UX', 'Offline Capable'],
  },
  {
    title: 'AI Chatbots & Virtual Assistants',
    desc: 'Intelligent conversational AI agents that automate customer support, qualify leads, and engage users 24/7.',
    icon: Bot,
    color: '#f59e0b',
    features: ['NLP & LLM Powered', 'Multi-Channel Support', 'Context Awareness', 'Analytics Dashboard'],
    technologies: ['OpenAI API', 'LangChain', 'Pinecone', 'Vercel AI SDK'],
    benefits: ['24/7 Availability', 'Reduced Support Costs', 'Instant Responses'],
  },
  {
    title: 'AI Automation Solutions',
    desc: 'Streamline workflows with intelligent automation, eliminating repetitive tasks and boosting operational efficiency.',
    icon: Workflow,
    color: '#ef4444',
    features: ['Workflow Automation', 'Data Pipelines', 'RPA Integration', 'Real-time Monitoring'],
    technologies: ['Python', 'Zapier', 'n8n', 'PostgreSQL'],
    benefits: ['Time Savings', 'Error Reduction', 'Scalable Operations'],
  },
  {
    title: 'Generative AI Solutions',
    desc: 'Custom LLM pipelines, content generation, and AI-powered tools that transform how your business creates and consumes information.',
    icon: Brain,
    color: '#ec4899',
    features: ['Custom LLM Fine-tuning', 'RAG Systems', 'Content Generation', 'Prompt Engineering'],
    technologies: ['OpenAI GPT', 'LangChain', 'Pinecone', 'Python'],
    benefits: ['Intelligent Automation', 'Custom Solutions', 'Data-Driven Insights'],
  },
  {
    title: 'AI-Powered Websites',
    desc: 'Next-generation websites with AI-driven personalization, smart search, and dynamic content that adapts to every visitor.',
    icon: Cpu,
    color: '#06b6d4',
    features: ['Personalization Engine', 'Smart Search', 'Dynamic Content', 'Behavioral Analytics'],
    technologies: ['Next.js', 'OpenAI API', 'Vercel', 'Tailwind CSS'],
    benefits: ['Higher Engagement', 'Personalized UX', 'Real-time Adaptation'],
  },
  {
    title: 'ERP Development',
    desc: 'Enterprise Resource Planning systems that unify your operations, inventory, finance, and HR in one powerful platform.',
    icon: Building2,
    color: '#f97316',
    features: ['Modular Architecture', 'Real-time Reporting', 'Role-Based Access', 'Audit Trails'],
    technologies: ['Django', 'PostgreSQL', 'Redis', 'Celery'],
    benefits: ['Unified Operations', 'Data Accuracy', 'Process Automation'],
  },
  {
    title: 'CRM Development',
    desc: 'Customer Relationship Management solutions that help you track leads, manage pipelines, and nurture client relationships.',
    icon: Users,
    color: '#14b8a6',
    features: ['Lead Tracking', 'Pipeline Management', 'Email Integration', 'Sales Forecasting'],
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    benefits: ['Better Conversions', 'Team Collaboration', 'Customer Retention'],
  },
  {
    title: 'UI/UX & Product Design',
    desc: 'User-centered interface design, interactive prototypes, Figma design systems, and modern digital branding experiences.',
    icon: Palette,
    color: '#a855f7',
    features: ['Design Systems', 'Prototyping', 'User Testing', 'Interactive Prototypes'],
    technologies: ['Figma', 'Adobe XD', 'Framer', 'After Effects'],
    benefits: ['User Satisfaction', 'Reduced Friction', 'Brand Consistency'],
  },
  {
    title: 'Enterprise Tech Advisory',
    desc: 'Architecture audits, performance optimization, security compliance, and strategic engineering consulting for growth.',
    icon: ShieldCheck,
    color: '#0ea5e9',
    features: ['Architecture Reviews', 'Security Audits', 'Cloud Migration', 'Tech Roadmapping'],
    technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
    benefits: ['Risk Mitigation', 'Cost Savings', 'Strategic Growth'],
  },
]

export default function Services() {
  const [ref, isVisible] = useScrollAnimation()
  const [expandedId, setExpandedId] = useState(null)

  const toggleService = (title) => {
    setExpandedId(expandedId === title ? null : title)
  }

  return (
    <section className="services section" id="services">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="services-badge">
            <span className="services-badge-dot" />
            What We Offer
          </div>
          <h2 className="section-title">
            Our Core <span className="gradient-text">Services</span>
          </h2>
          <p className="section-subtitle">
            End-to-end digital engineering and product design tailored to fuel growth for startups and enterprises.
          </p>
        </div>

        <div className={`services-grid ${isVisible ? 'cards-visible' : ''}`}>
          {servicesList.map((service, idx) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className={`service-card animate-on-scroll ${expandedId === service.title ? 'expanded' : ''}`}
                style={{ '--service-color': service.color, '--delay': `${0.05 + idx * 0.05}s` }}
              >
                <div className="service-card-glow" />
                <div className="service-icon-box">
                  <Icon size={26} className="service-icon" />
                </div>
                <div className="service-card-content">
                  <div className="service-card-header">
                    <div>
                      <h3 className="service-card-title">{service.title}</h3>
                      <p className="service-card-desc">{service.desc}</p>
                    </div>
                    <button className="service-card-arrow" onClick={() => toggleService(service.title)} aria-label="Toggle service details">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {expandedId === service.title && (
                    <div className="service-card-expanded">
                      <div className="expanded-section">
                        <h4>Technologies</h4>
                        <div className="tech-tags">
                          {service.technologies.map(tech => (
                            <span key={tech} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                      </div>
                      <div className="expanded-section">
                        <h4>Key Features</h4>
                        <ul className="features-list">
                          {service.features.map(feature => (
                            <li key={feature}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="expanded-section">
                        <h4>Benefits</h4>
                        <ul className="benefits-list">
                          {service.benefits.map(benefit => (
                            <li key={benefit}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
