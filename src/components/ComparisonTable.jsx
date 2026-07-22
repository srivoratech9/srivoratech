import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Check, X, Minus } from 'lucide-react'
import './ComparisonTable.css'

const rows = [
  {
    feature: 'Cost Efficiency',
    us: 'check',
    employees: 'x',
    agencies: 'minus',
  },
  {
    feature: 'Broad Expertise',
    us: 'check',
    employees: 'minus',
    agencies: 'minus',
  },
  {
    feature: 'Fast Turnaround',
    us: 'check',
    employees: 'minus',
    agencies: 'x',
  },
  {
    feature: 'Flexibility & Scale',
    us: 'check',
    employees: 'x',
    agencies: 'minus',
  },
  {
    feature: 'Design Excellence',
    us: 'check',
    employees: 'minus',
    agencies: 'minus',
  },
  {
    feature: 'Dedicated Focus',
    us: 'check',
    employees: 'check',
    agencies: 'x',
  },
  {
    feature: 'Post-Launch Support',
    us: 'check',
    employees: 'minus',
    agencies: 'x',
  },
]

function StatusIcon({ status }) {
  if (status === 'check') return <span className="status-check"><Check size={16} /></span>
  if (status === 'x') return <span className="status-x"><X size={16} /></span>
  return <span className="status-minus"><Minus size={16} /></span>
}

export default function ComparisonTable() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section className="comparison section">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">What Makes Us Different</h2>
          <p className="section-subtitle">See how we stack up against traditional alternatives.</p>
        </div>

        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="feature-col">Feature</th>
                <th className="highlight-col">SriVoraTech</th>
                <th>Hiring Employees</th>
                <th>Other Agencies</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="feature-cell">{row.feature}</td>
                  <td className="highlight-cell"><StatusIcon status={row.us} /></td>
                  <td><StatusIcon status={row.employees} /></td>
                  <td><StatusIcon status={row.agencies} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
