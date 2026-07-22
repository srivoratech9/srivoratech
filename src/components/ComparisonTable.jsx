import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Check, X, Minus, Sparkles, ShieldCheck } from 'lucide-react'
import './ComparisonTable.css'

const rows = [
  {
    feature: 'Delivery Velocity & Sprints',
    us: '2-4 Week MVPs',
    freelancers: 'Unpredictable',
    employees: '3-6 Months',
    agencies: '6-12 Months',
    usStatus: 'check',
    freeStatus: 'x',
    empStatus: 'minus',
    agencyStatus: 'minus',
  },
  {
    feature: 'End-to-End Design + Engineering',
    us: 'Integrated Synergy',
    freelancers: 'Design or Code Only',
    employees: 'Requires Multi-Hire',
    agencies: 'Siloed Teams',
    usStatus: 'check',
    freeStatus: 'x',
    empStatus: 'minus',
    agencyStatus: 'minus',
  },
  {
    feature: 'Total Cost Efficiency',
    us: 'Fixed-Price / transparent',
    freelancers: 'Hourly scope creep',
    employees: '$150k+ Salary + Benefits',
    agencies: '$100k+ Overhead',
    usStatus: 'check',
    freeStatus: 'minus',
    empStatus: 'x',
    agencyStatus: 'x',
  },
  {
    feature: '100% IP & Codebase Ownership',
    us: 'Immediate Transfer',
    freelancers: 'Varies',
    employees: 'Company Owned',
    agencies: 'Proprietary Lock-in',
    usStatus: 'check',
    freeStatus: 'minus',
    empStatus: 'check',
    agencyStatus: 'x',
  },
  {
    feature: 'Modern Tech Stack (AI/Next.js)',
    us: 'Cutting-Edge 2026 Stack',
    freelancers: 'Outdated Templates',
    employees: 'Skill Gap Risks',
    agencies: 'Legacy Frameworks',
    usStatus: 'check',
    freeStatus: 'x',
    empStatus: 'minus',
    agencyStatus: 'x',
  },
  {
    feature: 'Post-Launch SLA & Support',
    us: 'Dedicated SLA Partner',
    freelancers: 'Disappears post-launch',
    employees: 'Ongoing Payroll',
    agencies: 'Expensive Retainers',
    usStatus: 'check',
    freeStatus: 'x',
    empStatus: 'minus',
    agencyStatus: 'minus',
  },
]

function StatusPill({ status, text }) {
  if (status === 'check') {
    return (
      <div className="status-pill status-check">
        <Check size={15} />
        <span>{text}</span>
      </div>
    )
  }
  if (status === 'x') {
    return (
      <div className="status-pill status-x">
        <X size={15} />
        <span>{text}</span>
      </div>
    )
  }
  return (
    <div className="status-pill status-minus">
      <Minus size={15} />
      <span>{text}</span>
    </div>
  )
}

export default function ComparisonTable() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section className="comparison section" id="comparison">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="comparison-badge">
            <Sparkles size={14} />
            Why We Win
          </div>
          <h2 className="section-title">
            How SriVoraTech <span className="gradient-text">Compares</span>
          </h2>
          <p className="section-subtitle">
            See how our agile engineering model compares to traditional alternatives.
          </p>
        </div>

        <div className="comparison-table-wrap glass-card">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="feature-col">Feature & Capability</th>
                <th className="highlight-col">
                  <div className="svt-col-header">
                    <span className="svt-badge">RECOMMENDED</span>
                    <span className="svt-title">SriVoraTech</span>
                  </div>
                </th>
                <th>Freelancers</th>
                <th>In-House Hiring</th>
                <th>Legacy Agencies</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="feature-cell">
                    <strong>{row.feature}</strong>
                  </td>
                  <td className="highlight-cell">
                    <StatusPill status={row.usStatus} text={row.us} />
                  </td>
                  <td>
                    <StatusPill status={row.freeStatus} text={row.freelancers} />
                  </td>
                  <td>
                    <StatusPill status={row.empStatus} text={row.employees} />
                  </td>
                  <td>
                    <StatusPill status={row.agencyStatus} text={row.agencies} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
