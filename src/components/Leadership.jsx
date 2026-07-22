import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Sparkles, Award, Code2, Smartphone, Bot, Palette, Cloud, TestTube, BarChart3, HeartHandshake, Quote, CheckCircle2, Linkedin, Mail, ShieldCheck } from 'lucide-react'
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

const teamDisciplines = [
  {
    icon: Code2,
    title: 'Full Stack Developers',
    desc: 'Building secure, scalable, and high-performance web applications using modern technologies.',
    color: '#0067f4',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Developers',
    desc: 'Creating intuitive Android and iOS applications with exceptional user experiences.',
    color: '#8b5cf6',
  },
  {
    icon: Bot,
    title: 'AI & Machine Learning Engineers',
    desc: 'Developing intelligent AI chatbots, automation systems, predictive models, and generative AI solutions.',
    color: '#ec4899',
  },
  {
    icon: Palette,
    title: 'UI/UX Designers',
    desc: 'Designing beautiful, user-centered interfaces that deliver engaging digital experiences.',
    color: '#a855f7',
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps Engineers',
    desc: 'Managing cloud infrastructure, CI/CD pipelines, deployments, monitoring, and application scalability.',
    color: '#06b6d4',
  },
  {
    icon: TestTube,
    title: 'Quality Assurance Engineers',
    desc: 'Ensuring every product meets the highest standards of performance, security, reliability, and usability.',
    color: '#f59e0b',
  },
  {
    icon: BarChart3,
    title: 'Project Managers',
    desc: 'Coordinating teams, managing timelines, and ensuring transparent communication throughout every project.',
    color: '#10b981',
  },
  {
    icon: HeartHandshake,
    title: 'Business Development & Customer Success',
    desc: 'Helping clients identify the right solutions while ensuring long-term partnerships and exceptional support.',
    color: '#ef4444',
  },
]

export default function Leadership() {
  const [ref, isVisible] = useScrollAnimation()
  const [refTeam, isTeamVisible] = useScrollAnimation()

  return (
    <section ref={ref} className="leadership section" id="leadership">
      <div className="container">
        {/* Header */}
        <div className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="leadership-badge">
            <Sparkles size={14} />
            Executive Leadership & Vision
          </div>
          <h2 className="section-title">
            Meet Our <span className="gradient-text">Leadership</span>
          </h2>
          <p className="section-subtitle">
            Driven by Innovation. United by Vision. At SriVoraTech, our leadership team combines technical expertise, innovation, and strategic thinking to deliver world-class software, AI, and digital transformation solutions.
          </p>
        </div>

        {/* Executive Leader Cards Grid */}
        <div className={`leader-cards-grid ${isVisible ? 'cards-visible' : ''}`}>
          {leaders.map((leader, idx) => (
            <div
              key={leader.id}
              className={`leader-card glass-card animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{ '--leader-accent': leader.color, '--delay': `${0.06 + idx * 0.08}s` }}
            >
              {/* Top Accent Gradient Ribbon */}
              <div className="card-top-accent-line" style={{ background: `linear-gradient(90deg, ${leader.color}, #38bdf8)` }} />

              {/* WhatsApp / LinkedIn style Medium Circular Profile Avatar on Top */}
              <div className="leader-top-profile">
                <div className="leader-avatar-wrapper">
                  {leader.photo ? (
                    <img src={leader.photo} alt={leader.name} className="leader-avatar-img" />
                  ) : (
                    <div className="leader-avatar-circle" style={{ background: leader.color }}>
                      <span>{leader.initials}</span>
                    </div>
                  )}
                  <span className="avatar-glow-ring" style={{ background: `${leader.color}35` }} />
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

                {/* Social Quick Action Buttons */}
                <div className="leader-social-actions">
                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="leader-action-btn"
                    title={`Connect with ${leader.name} on LinkedIn`}
                    aria-label={`LinkedIn Profile for ${leader.name}`}
                  >
                    <Linkedin size={15} />
                  </a>
                  <a
                    href={`mailto:${leader.email}`}
                    className="leader-action-btn"
                    title={`Email ${leader.name}`}
                    aria-label={`Email ${leader.name}`}
                  >
                    <Mail size={15} />
                  </a>
                </div>
              </div>

              {/* Bio & Description BELOW the photo */}
              <div className="leader-bio-body">
                <p>{leader.bio}</p>
              </div>

              {/* Core Expertise Chips */}
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
          ))}
        </div>

        {/* Leadership Quote Banner */}
        <div className="leadership-quote-card animate-on-scroll visible">
          <div className="quote-icon-box">
            <Quote size={32} />
          </div>
          <blockquote className="quote-text">
            "At SriVoraTech, we believe technology should solve real-world problems. Our mission is to create innovative, secure, and intelligent digital solutions that empower businesses to grow, innovate, and succeed in an ever-evolving digital world."
          </blockquote>
          <div className="quote-author">
            <strong>Badisa Srikanth</strong>
            <span>Founder & CEO, SriVoraTech</span>
          </div>
        </div>

        {/* Our Team Section */}
        <div ref={refTeam} className={`our-team-container animate-on-scroll ${isTeamVisible ? 'visible' : ''}`}>
          <div className="team-header-block">
            <h3 className="team-section-title">
              Our <span className="gradient-text">Team</span>
            </h3>
            <p className="team-section-subtitle">
              A Team Passionate About Building the Future — Our multidisciplinary team of engineers, designers, AI specialists, and project managers collaborates to transform ideas into innovative digital products.
            </p>
          </div>

          <div className="team-disciplines-grid">
            {teamDisciplines.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="team-discipline-card glass-card">
                  <div className="discipline-icon-box" style={{ background: `${item.color}15`, color: item.color }}>
                    <Icon size={24} />
                  </div>
                  <h4 className="discipline-title">{item.title}</h4>
                  <p className="discipline-desc">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
