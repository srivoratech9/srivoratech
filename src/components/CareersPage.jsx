import { useState, useEffect } from 'react'
import { ArrowLeft, Send, CheckCircle2, GraduationCap, Briefcase, AlertCircle, Upload, FileText } from 'lucide-react'
import { submitToSheet } from '../utils/submitToSheet'
import './CareersPage.css'

const fresherRolesMap = {
  'Software Development': [
    'Junior Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'React.js Developer',
    'Node.js Developer',
    'Python Developer',
    'Java Developer',
  ],
  'Mobile Development': [
    'Android Developer',
    'Flutter Developer',
    'React Native Developer',
  ],
  'AI & Data': [
    'AI Engineer Trainee',
    'Machine Learning Intern',
    'Data Science Intern',
  ],
  'Design': [
    'UI/UX Designer',
    'Graphic Designer',
  ],
  'Testing': [
    'QA Tester',
    'Manual Testing Trainee',
    'Automation Testing Trainee',
  ],
  'Cloud & DevOps': [
    'DevOps Trainee',
    'Cloud Engineer Trainee',
  ],
  'Business': [
    'Technical Support Executive',
    'Digital Marketing Executive',
    'Business Development Executive',
  ],
}

const experiencedRolesMap = {
  'Engineering': [
    'Senior Full Stack Developer',
    'Senior Frontend Developer',
    'Senior Backend Developer',
    'Software Architect',
    'Solution Architect',
    'Technical Lead',
  ],
  'AI': [
    'AI Engineer',
    'Machine Learning Engineer',
    'Data Engineer',
  ],
  'Mobile': [
    'Senior Android Developer',
    'Flutter Developer',
    'React Native Developer',
  ],
  'Cloud': [
    'DevOps Engineer',
    'Cloud Engineer',
    'Site Reliability Engineer (SRE)',
  ],
  'Design': [
    'Senior UI/UX Designer',
    'Product Designer',
  ],
  'Quality Assurance': [
    'QA Engineer',
    'Automation Test Engineer',
  ],
  'Management': [
    'Project Manager',
    'Product Manager',
    'Scrum Master',
  ],
}

const INITIAL_FRESHER = {
  fullName: '',
  email: '',
  phone: '',
  category: 'Software Development',
  role: 'Junior Full Stack Developer',
  college: '',
  degree: '',
  graduationYear: '2025',
  skills: '',
  portfolio: '',
  resume: '',
  resumeLink: '',
  whySriVoraTech: '',
}

const INITIAL_EXPERIENCE = {
  fullName: '',
  email: '',
  phone: '',
  category: 'Engineering',
  role: 'Senior Full Stack Developer',
  company: '',
  designation: 'Senior Developer',
  yearsOfExperience: '1-2',
  skills: '',
  portfolio: '',
  noticePeriod: 'Immediate',
  resume: '',
  resumeLink: '',
  whySriVoraTech: '',
}

export default function CareersPage({ onBack }) {
  const [tab, setTab] = useState('fresher')
  const [fresherData, setFresherData] = useState(INITIAL_FRESHER)
  const [expData, setExpData] = useState(INITIAL_EXPERIENCE)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setErrors({})
    setSubmitError('')
  }, [tab])

  const currentData = tab === 'fresher' ? fresherData : expData
  const setCurrentData = tab === 'fresher' ? setFresherData : setExpData
  const rolesMap = tab === 'fresher' ? fresherRolesMap : experiencedRolesMap

  const handleChange = (e) => {
    const { name, value } = e.target

    setCurrentData((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === 'category') {
        const availableRoles = rolesMap[value] || []
        updated.role = availableRoles[0] || ''
      }
      if (name === 'resume') {
        updated.resumeLink = value
      }
      return updated
    })

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (submitError) setSubmitError('')
  }

  const validate = () => {
    const d = currentData
    const errs = {}

    if (d.fullName.trim().length < 2) errs.fullName = 'Full name is required.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(d.email)) errs.email = 'Enter a valid email address.'
    if (d.phone.trim().length < 10) errs.phone = 'Enter a valid phone number.'
    if (!d.role) errs.role = 'Please select a role.'

    if (tab === 'fresher') {
      if (d.college.trim().length < 2) errs.college = 'College name is required.'
      if (d.degree.trim().length < 2) errs.degree = 'Degree / Branch is required.'
      if (d.skills.trim().length < 2) errs.skills = 'List at least one skill.'
      if (d.whySriVoraTech.trim().length < 2) errs.whySriVoraTech = 'Please tell us why you want to join.'
    } else {
      if (d.company.trim().length < 2) errs.company = 'Company name is required.'
      if (d.designation.trim().length < 2) errs.designation = 'Designation is required.'
      if (d.skills.trim().length < 2) errs.skills = 'List at least one skill.'
      if (d.whySriVoraTech.trim().length < 2) errs.whySriVoraTech = 'Please tell us why you want to join.'
    }


    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    const result = await submitToSheet(tab, currentData)

    setSubmitting(false)

    if (result.success) {
      setSubmitted(true)
    } else {
      setSubmitError(result.error || 'Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="careers-page success-page">
        <header className="detail-navbar">
          <button onClick={onBack} className="back-btn">
            <ArrowLeft size={16} /> Back to Home
          </button>
          <span className="detail-logo">SriVora<span className="logo-accent">Tech</span></span>
        </header>

        <main className="careers-success-main">
          <div className="success-card">
            <CheckCircle2 size={64} className="success-icon" />
            <h1>Application Submitted!</h1>
            <p>Thank you, <strong>{currentData.fullName}</strong>.</p>
            <p className="success-desc">
              Your {tab === 'fresher' ? 'fresher' : 'experienced professional'} application for <strong>{currentData.role}</strong> has been received.
              Our HR team will review your application and contact you soon.
            </p>
            <button onClick={onBack} className="success-home-btn">
              Return to Home
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="careers-page">
      <header className="detail-navbar">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={16} /> Back to Home
        </button>
        <span className="detail-logo">SriVora<span className="logo-accent">Tech</span></span>
      </header>

      <main className="careers-main">
        <div className="careers-header">
          <h1 className="careers-title">Join Our Team</h1>
          <p className="careers-subtitle">
            We're always looking for passionate people. Whether you're starting out or bringing years of expertise — let's build something great together.
          </p>
        </div>

        <div className="tab-switcher">
          <button
            className={`tab-btn ${tab === 'fresher' ? 'active' : ''}`}
            onClick={() => setTab('fresher')}
            type="button"
          >
            <GraduationCap size={18} className="tab-icon" />
            Fresher
          </button>
          <button
            className={`tab-btn ${tab === 'experience' ? 'active' : ''}`}
            onClick={() => setTab('experience')}
            type="button"
          >
            <Briefcase size={18} className="tab-icon" />
            Experienced
          </button>
        </div>

        <div className="careers-form-card" key={tab}>
          <form onSubmit={handleSubmit} className="careers-form" noValidate>

            <div className="form-group full-width">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={currentData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`form-input ${errors.fullName ? 'input-error' : ''}`}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={currentData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={currentData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={`form-input ${errors.phone ? 'input-error' : ''}`}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>

            {/* Role & Category Selection Box Section */}
            <div className="roles-section-box">
              <h3 className="roles-box-title">
                {tab === 'fresher' ? 'Fresher Role Selection' : 'Experienced Role Selection'}
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department / Category *</label>
                  <div className="select-wrapper">
                    <select
                      name="category"
                      value={currentData.category}
                      onChange={handleChange}
                      className="form-input form-select"
                    >
                      {Object.keys(rolesMap).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Role Applied For *</label>
                  <div className="select-wrapper">
                    <select
                      name="role"
                      value={currentData.role}
                      onChange={handleChange}
                      className={`form-input form-select ${errors.role ? 'input-error' : ''}`}
                    >
                      {(rolesMap[currentData.category] || []).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.role && <span className="error-text">{errors.role}</span>}
                </div>
              </div>
            </div>

            {tab === 'fresher' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">College Name *</label>
                    <input
                      type="text"
                      name="college"
                      value={fresherData.college}
                      onChange={handleChange}
                      placeholder="e.g. SRM Institute, VIT, Anna University"
                      className={`form-input ${errors.college ? 'input-error' : ''}`}
                    />
                    {errors.college && <span className="error-text">{errors.college}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Degree / Branch *</label>
                    <input
                      type="text"
                      name="degree"
                      value={fresherData.degree}
                      onChange={handleChange}
                      placeholder="e.g. B.Tech Computer Science"
                      className={`form-input ${errors.degree ? 'input-error' : ''}`}
                    />
                    {errors.degree && <span className="error-text">{errors.degree}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Year of Graduation</label>
                    <div className="select-wrapper">
                      <select
                        name="graduationYear"
                        value={fresherData.graduationYear}
                        onChange={handleChange}
                        className="form-input form-select"
                      >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Technical Skills *</label>
                    <input
                      type="text"
                      name="skills"
                      value={fresherData.skills}
                      onChange={handleChange}
                      placeholder="e.g. React, Python, Java, SQL"
                      className={`form-input ${errors.skills ? 'input-error' : ''}`}
                    />
                    {errors.skills && <span className="error-text">{errors.skills}</span>}
                  </div>
                </div>
              </>
            )}

            {tab === 'experience' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Current / Last Company *</label>
                    <input
                      type="text"
                      name="company"
                      value={expData.company}
                      onChange={handleChange}
                      placeholder="e.g. TCS, Infosys, Startup"
                      className={`form-input ${errors.company ? 'input-error' : ''}`}
                    />
                    {errors.company && <span className="error-text">{errors.company}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation / Role Title *</label>
                    <input
                      type="text"
                      name="designation"
                      value={expData.designation}
                      onChange={handleChange}
                      placeholder="e.g. Senior Software Engineer"
                      className={`form-input ${errors.designation ? 'input-error' : ''}`}
                    />
                    {errors.designation && <span className="error-text">{errors.designation}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <div className="select-wrapper">
                      <select
                        name="yearsOfExperience"
                        value={expData.yearsOfExperience}
                        onChange={handleChange}
                        className="form-input form-select"
                      >
                        <option value="1-2">1 – 2 Years</option>
                        <option value="2-4">2 – 4 Years</option>
                        <option value="4-6">4 – 6 Years</option>
                        <option value="6-8">6 – 8 Years</option>
                        <option value="8-10">8 – 10 Years</option>
                        <option value="10+">10+ Years</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Technical Skills *</label>
                    <input
                      type="text"
                      name="skills"
                      value={expData.skills}
                      onChange={handleChange}
                      placeholder="e.g. React, Node.js, AWS, Docker"
                      className={`form-input ${errors.skills ? 'input-error' : ''}`}
                    />
                    {errors.skills && <span className="error-text">{errors.skills}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Notice Period</label>
                    <div className="select-wrapper">
                      <select
                        name="noticePeriod"
                        value={expData.noticePeriod}
                        onChange={handleChange}
                        className="form-input form-select"
                      >
                        <option value="Immediate">Immediate</option>
                        <option value="15 Days">15 Days</option>
                        <option value="1 Month">1 Month</option>
                        <option value="2 Months">2 Months</option>
                        <option value="3 Months">3 Months</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Portfolio / LinkedIn Link</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={expData.portfolio}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                      className="form-input"
                    />
                  </div>
                </div>
              </>
            )}

            {tab === 'fresher' && (
              <div className="form-group full-width">
                <label className="form-label">Portfolio / GitHub Link (optional)</label>
                <input
                  type="url"
                  name="portfolio"
                  value={fresherData.portfolio}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="form-input"
                />
              </div>
            )}

            {/* Resume Link Input Box */}
            <div className="form-group full-width">
              <label className="form-label">Resume / CV Link *</label>
              <input
                type="url"
                name="resume"
                value={currentData.resume}
                onChange={handleChange}
                placeholder="https://drive.google.com/your-resume-link"
                className={`form-input ${errors.resume ? 'input-error' : ''}`}
                required
              />
              {errors.resume && <span className="error-text">{errors.resume}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label">Why do you want to join SriVoraTech? *</label>
              <textarea
                name="whySriVoraTech"
                value={currentData.whySriVoraTech}
                onChange={handleChange}
                placeholder="Share your goals and why you're excited about this role..."
                className={`form-input form-textarea ${errors.whySriVoraTech ? 'input-error' : ''}`}
              />
              {errors.whySriVoraTech && <span className="error-text">{errors.whySriVoraTech}</span>}
            </div>

            {submitError && (
              <div className="form-error-banner">
                <AlertCircle size={18} />
                {submitError}
              </div>
            )}

            <button type="submit" className="careers-submit-btn" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="btn-spinner" />
                  <span>Submitting…</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

