import { useState, useEffect, useMemo } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Send, Sparkles, CheckCircle2, AlertCircle, Mail, User, Building2, Phone as PhoneIcon, MessageSquareText, Wallet } from 'lucide-react'
import { submitToSheet } from '../utils/submitToSheet'
import './Contact.css'

export default function Contact() {
  const [ref, isVisible] = useScrollAnimation()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState({})

  // Client "Book a Call" form state
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    budget: '',
    message: '',
  })

  useEffect(() => {
    const handlePopulate = (e) => {
      const { message, budget } = e.detail || {}
      setClientForm(prev => ({
        ...prev,
        message: message || prev.message,
        budget: budget || prev.budget
      }))
    }

    window.addEventListener('svt_populate_estimate', handlePopulate)
    return () => window.removeEventListener('svt_populate_estimate', handlePopulate)
  }, [])

  // Validation rules
  const validations = useMemo(() => ({
    name: {
      valid: clientForm.name.trim().length >= 2,
      message: 'Name must be at least 2 characters',
    },
    email: {
      valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.email),
      message: 'Enter a valid email address',
    },
    company: {
      valid: clientForm.company.trim().length >= 1,
      message: 'Company name is required',
    },
    phone: {
      valid: /^[+\d\s()-]{7,15}$/.test(clientForm.phone),
      message: 'Enter a valid phone number',
    },
    budget: {
      valid: clientForm.budget.length > 0,
      message: 'Please select a budget range',
    },
    message: {
      valid: clientForm.message.trim().length >= 10,
      message: 'Tell us more (at least 10 characters)',
    },
  }), [clientForm])

  const allValid = Object.values(validations).every(v => v.valid)
  const filledCount = Object.keys(validations).filter(k => validations[k].valid).length
  const totalFields = Object.keys(validations).length

  const handleClientChange = (e) => {
    const { name, value } = e.target
    setClientForm(prev => ({ ...prev, [name]: value }))
  }

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  const handleClientSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields touched
    const allTouched = {}
    Object.keys(validations).forEach(k => { allTouched[k] = true })
    setTouched(allTouched)

    if (!allValid) return

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
        setTouched({})
        setTimeout(() => setSubmitted(false), 6000)
      } else {
        alert(res.error || 'Error submitting form. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting client form:', error)
      alert('Error submitting form. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderFieldStatus = (fieldName) => {
    if (!touched[fieldName]) return null
    const v = validations[fieldName]
    if (v.valid) return <CheckCircle2 size={14} className="field-valid-icon" />
    return (
      <span className="field-error-group">
        <AlertCircle size={13} className="field-error-icon" />
        <span className="field-error-msg">{v.message}</span>
      </span>
    )
  }

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="contact-badge">
            <Sparkles size={14} />
            Let's Build Something Great
          </div>
          <h2 className="section-title">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle">
            Looking to build a custom web app, mobile product, or AI platform? Book a 30-minute discovery call with our technical leads.
          </p>
        </div>

        <div className="contact-wrapper">
          <div className="form-container">
            {submitted ? (
              <div className="success-message animate-pop">
                <Send size={32} className="success-icon" />
                <h3>Thank You!</h3>
                <p>We have received your project details. Our technical team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleClientSubmit} className="application-form" noValidate>
                {/* Form completion progress */}
                <div className="form-progress-track">
                  <div className="form-progress-fill" style={{ width: `${(filledCount / totalFields) * 100}%` }} />
                  <span className="form-progress-text">
                    {filledCount} / {totalFields} fields completed
                  </span>
                </div>

                <div className="form-row">
                  <div className={`form-group ${touched.name ? (validations.name.valid ? 'valid' : 'invalid') : ''}`}>
                    <label><User size={13} /> Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={clientForm.name}
                      onChange={handleClientChange}
                      onBlur={() => handleBlur('name')}
                      required
                      placeholder="Enter your full name"
                    />
                    {renderFieldStatus('name')}
                  </div>
                  <div className={`form-group ${touched.email ? (validations.email.valid ? 'valid' : 'invalid') : ''}`}>
                    <label><Mail size={13} /> Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={clientForm.email}
                      onChange={handleClientChange}
                      onBlur={() => handleBlur('email')}
                      required
                      placeholder="Enter email address"
                    />
                    {renderFieldStatus('email')}
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group ${touched.company ? (validations.company.valid ? 'valid' : 'invalid') : ''}`}>
                    <label><Building2 size={13} /> Company / Organization *</label>
                    <input
                      type="text"
                      name="company"
                      value={clientForm.company}
                      onChange={handleClientChange}
                      onBlur={() => handleBlur('company')}
                      required
                      placeholder="Your company name"
                    />
                    {renderFieldStatus('company')}
                  </div>
                  <div className={`form-group ${touched.phone ? (validations.phone.valid ? 'valid' : 'invalid') : ''}`}>
                    <label><PhoneIcon size={13} /> Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={clientForm.phone}
                      onChange={handleClientChange}
                      onBlur={() => handleBlur('phone')}
                      required
                      placeholder="Enter phone number"
                    />
                    {renderFieldStatus('phone')}
                  </div>
                </div>

                <div className={`form-group ${touched.budget ? (validations.budget.valid ? 'valid' : 'invalid') : ''}`}>
                  <label><Wallet size={13} /> Project Budget Range *</label>
                  <div className="budget-pills">
                    {['Under ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹5,00,000', '₹5,00,000 - ₹10,00,000', '₹10,00,000+', "Let's Discuss"].map(b => (
                      <button
                        type="button"
                        key={b}
                        className={`budget-pill ${clientForm.budget === b ? 'active' : ''}`}
                        onClick={() => {
                          setClientForm(prev => ({ ...prev, budget: b }))
                          setTouched(prev => ({ ...prev, budget: true }))
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <select
                    name="budget"
                    value={clientForm.budget}
                    onChange={(e) => {
                      handleClientChange(e)
                      setTouched(prev => ({ ...prev, budget: true }))
                    }}
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
                  {renderFieldStatus('budget')}
                </div>

                <div className={`form-group ${touched.message ? (validations.message.valid ? 'valid' : 'invalid') : ''}`}>
                  <label><MessageSquareText size={13} /> Project Scope / Details *</label>
                  <textarea
                    name="message"
                    value={clientForm.message}
                    onChange={handleClientChange}
                    onBlur={() => handleBlur('message')}
                    required
                    placeholder="Tell us about your project requirements, features, or goals..."
                    rows={4}
                  />
                  <div className="textarea-meta-row">
                    {renderFieldStatus('message')}
                    <span className="char-counter">{clientForm.message.length} chars</span>
                  </div>
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
          </div>
        </div>
      </div>
    </section>
  )
}
