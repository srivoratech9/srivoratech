import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Send, Phone, Sparkles } from 'lucide-react'
import { submitToSheet } from '../utils/submitToSheet'
import './Contact.css'

export default function Contact() {
  const [ref, isVisible] = useScrollAnimation()
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
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
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
                  <label>Project Budget Range *</label>
                  <div className="budget-pills">
                    {['Under ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹5,00,000', '₹5,00,000 - ₹10,00,000', '₹10,00,000+', "Let's Discuss"].map(b => (
                      <button
                        type="button"
                        key={b}
                        className={`budget-pill ${clientForm.budget === b ? 'active' : ''}`}
                        onClick={() => setClientForm(prev => ({ ...prev, budget: b }))}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
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
                  <label>Project Scope / Details *</label>
                  <textarea
                    name="message"
                    value={clientForm.message}
                    onChange={handleClientChange}
                    required
                    placeholder="Tell us about your project requirements, features, or goals..."
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
          </div>
        </div>
      </div>
    </section>
  )
}
