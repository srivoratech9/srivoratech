import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Send, Briefcase, GraduationCap, Link, Phone } from 'lucide-react'
import { submitToSheet } from '../utils/submitToSheet'
import './Contact.css'

const fresherRoles = {
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

const experiencedRoles = {
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
    'Performance Test Engineer',
  ],
  'Management': [
    'Project Manager',
    'Product Manager',
    'Delivery Manager',
    'Scrum Master',
  ],
  'Business': [
    'Business Analyst',
    'Technical Consultant',
    'Sales Manager',
    'HR Manager',
    'Finance Executive',
    'Customer Success Manager',
  ],
}

export default function Contact() {
  const [ref, isVisible] = useScrollAnimation()
  const [activeTab, setActiveTab] = useState('fresher')
  const [fresherForm, setFresherForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    role: '',
    degree: '',
    graduationYear: '2025',
    resume: '',
    portfolio: '',
  })
  const [experiencedForm, setExperiencedForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    role: '',
    yearsOfExperience: '',
    resume: '',
    portfolio: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Client "Book a Call" form state
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    budget: '',
    message: '',
  })

  const handleClientChange = (e) => {
    const { name, value } = e.target
    setClientForm(prev => ({ ...prev, [name]: value }))
  }

  const handleClientSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        fullName: clientForm.name,
        name: clientForm.name,
        email: clientForm.email,
        company: clientForm.company,
        phone: clientForm.phone,
        budget: clientForm.budget,
        message: clientForm.message,
        whySriVoraTech: clientForm.message,
      }

      const res = await submitToSheet('contact', payload)

      if (res.success) {
        setSubmitted(true)
        setClientForm({
          name: '',
          email: '',
          company: '',
          phone: '',
          budget: '',
          message: '',
        })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert(res.error || 'Error submitting. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting client form:', error)
      alert('Error submitting. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFresherChange = (e) => {
    const { name, value } = e.target
    setFresherForm(prev => ({
      ...prev,
      [name]: value,
      role: name === 'category' ? (fresherRoles[value]?.[0] || '') : (name === 'role' ? value : prev.role),
    }))
  }

  const handleExperiencedChange = (e) => {
    const { name, value } = e.target
    setExperiencedForm(prev => ({
      ...prev,
      [name]: value,
      role: name === 'category' ? (experiencedRoles[value]?.[0] || '') : (name === 'role' ? value : prev.role),
    }))
  }


  const handleFresherSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const payload = {
        fullName: `${fresherForm.firstName} ${fresherForm.lastName}`.trim(),
        firstName: fresherForm.firstName,
        lastName: fresherForm.lastName,
        email: fresherForm.email,
        phone: fresherForm.phone,
        address: fresherForm.address || 'N/A',
        category: fresherForm.category,
        role: fresherForm.role,
        degree: fresherForm.degree || '',
        graduationYear: fresherForm.graduationYear || '2025',
        yearsOfExperience: fresherForm.graduationYear || '',
        skills: `${fresherForm.category} - ${fresherForm.role}`,
        portfolio: fresherForm.portfolio || '',
        resumeLink: fresherForm.resume || '',
        whySriVoraTech: `Applied for ${fresherForm.role} under ${fresherForm.category}. Degree: ${fresherForm.degree || 'N/A'}, Grad Year: ${fresherForm.graduationYear || '2025'}. Address: ${fresherForm.address}`
      }

      const res = await submitToSheet('fresher', payload)

      if (res.success) {
        setSubmitted(true)
        setFresherForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          category: '',
          role: '',
          degree: '',
          graduationYear: '2025',
          resume: '',
          portfolio: '',
        })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert(res.error || 'Error submitting application to Google Sheets')
      }
    } catch (error) {
      console.error('Error submitting fresher application:', error)
      alert('Error submitting application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleExperiencedSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const payload = {
        fullName: `${experiencedForm.firstName} ${experiencedForm.lastName}`.trim(),
        firstName: experiencedForm.firstName,
        lastName: experiencedForm.lastName,
        email: experiencedForm.email,
        phone: experiencedForm.phone,
        address: experiencedForm.address || 'N/A',
        category: experiencedForm.category,
        role: experiencedForm.role,
        yearsOfExperience: experiencedForm.yearsOfExperience || '1-2',
        skills: `${experiencedForm.category} - ${experiencedForm.role}`,
        portfolio: experiencedForm.portfolio || '',
        resumeLink: experiencedForm.resume || '',
        noticePeriod: '1 Month',
        whySriVoraTech: `Applied for ${experiencedForm.role} (${experiencedForm.yearsOfExperience} yrs exp). Address: ${experiencedForm.address}`
      }

      const res = await submitToSheet('experience', payload)

      if (res.success) {
        setSubmitted(true)
        setExperiencedForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          category: '',
          role: '',
          yearsOfExperience: '',
          resume: '',
          portfolio: '',
        })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert(res.error || 'Error submitting application to Google Sheets')
      }
    } catch (error) {
      console.error('Error submitting experienced application:', error)
      alert('Error submitting application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const currentRoles = activeTab === 'fresher' ? fresherRoles : experiencedRoles
  const currentForm = activeTab === 'fresher' ? fresherForm : experiencedForm
  const currentChange = activeTab === 'fresher' ? handleFresherChange : handleExperiencedChange
  const currentSubmit = activeTab === 'fresher' ? handleFresherSubmit : handleExperiencedSubmit

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle">
            Looking to build something amazing? Or ready to join our team? Let's connect and make it happen.
          </p>
        </div>

        <div className="contact-wrapper">
          {/* Tabs */}
          <div className="form-tabs">
            <button
              className={`tab-btn ${activeTab === 'client' ? 'active' : ''}`}
              onClick={() => setActiveTab('client')}
            >
              <Phone size={18} />
              Book a Call
            </button>
            <button
              className={`tab-btn ${activeTab === 'fresher' ? 'active' : ''}`}
              onClick={() => setActiveTab('fresher')}
            >
              <GraduationCap size={18} />
              Fresher Opportunities
            </button>
            <button
              className={`tab-btn ${activeTab === 'experienced' ? 'active' : ''}`}
              onClick={() => setActiveTab('experienced')}
            >
              <Briefcase size={18} />
              Experienced Professionals
            </button>
          </div>

          {/* Forms */}
          <div className="form-container animate-tab" key={activeTab}>
            {submitted && (
              <div className="success-message">
                <Send size={24} />
                <p>{activeTab === 'client' ? 'Thank you! We\'ll get back to you shortly.' : 'Application submitted successfully! We\'ll get back to you soon.'}</p>
              </div>
            )}

            {/* Book a Call - Client Form */}
            {activeTab === 'client' && !submitted && (
              <form onSubmit={handleClientSubmit} className="application-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={clientForm.name}
                      onChange={handleClientChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={clientForm.email}
                      onChange={handleClientChange}
                      required
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Company / Organization *</label>
                    <input
                      type="text"
                      name="company"
                      value={clientForm.company}
                      onChange={handleClientChange}
                      required
                      placeholder="Your company name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={clientForm.phone}
                      onChange={handleClientChange}
                      required
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Project Budget *</label>
                  <select
                    name="budget"
                    value={clientForm.budget}
                    onChange={handleClientChange}
                    required
                  >
                    <option value="">Select budget range</option>
                    <option value="Under ₹50,000">Under ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000 - ₹5,00,000">₹1,00,000 - ₹5,00,000</option>
                    <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 - ₹10,00,000</option>
                    <option value="₹10,00,000+">₹10,00,000+</option>
                    <option value="Let's Discuss">Let's Discuss</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message / Project Details *</label>
                  <textarea
                    name="message"
                    value={clientForm.message}
                    onChange={handleClientChange}
                    required
                    placeholder="Tell us about your project requirements..."
                    rows={4}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : (
                    <>
                      <Send size={18} />
                      Book a Call
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Fresher / Experienced Forms */}
            {activeTab !== 'client' && !submitted && (
            <form onSubmit={currentSubmit} className="application-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={currentForm.firstName}
                    onChange={currentChange}
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={currentForm.lastName}
                    onChange={currentChange}
                    required
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={currentForm.email}
                    onChange={currentChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={currentForm.phone}
                    onChange={currentChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={currentForm.address}
                  onChange={currentChange}
                  required
                  placeholder="Enter your address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={currentForm.category}
                    onChange={currentChange}
                    required
                  >
                    <option value="">Select category</option>
                    {Object.keys(currentRoles).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Interested Role *</label>
                  <select
                    name="role"
                    value={currentForm.role}
                    onChange={currentChange}
                    required
                    disabled={!currentForm.category}
                  >
                    <option value="">Select role *</option>
                    {currentForm.category && currentRoles[currentForm.category]?.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              {activeTab === 'fresher' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Degree / Branch *</label>
                    <input
                      type="text"
                      name="degree"
                      value={fresherForm.degree}
                      onChange={handleFresherChange}
                      required
                      placeholder="e.g. B.Tech CSE / B.E."
                    />
                  </div>
                  <div className="form-group">
                    <label>Graduation Year *</label>
                    <select
                      name="graduationYear"
                      value={fresherForm.graduationYear}
                      onChange={handleFresherChange}
                      required
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'experienced' && (
                <div className="form-group">
                  <label>Years of Experience *</label>
                  <select
                    name="yearsOfExperience"
                    value={experiencedForm.yearsOfExperience}
                    onChange={handleExperiencedChange}
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="1-2">1-2 years</option>
                    <option value="2-3">2-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-7">5-7 years</option>
                    <option value="7-10">7-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Resume / CV Link *</label>
                  <div className="input-with-icon">
                    <Link size={18} className="input-icon" />
                    <input
                      type="url"
                      name="resume"
                      value={currentForm.resume}
                      onChange={currentChange}
                      required
                      placeholder="https://drive.google.com/your-resume-link"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Portfolio / Website Link</label>
                  <input
                    type="text"
                    name="portfolio"
                    value={currentForm.portfolio}
                    onChange={currentChange}
                    placeholder="https://your-portfolio.com (optional)"
                  />
                </div>
              </div>


              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : (
                  <>
                    <Send size={18} />
                    Submit Application
                  </>
                )}
              </button>
            </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
