import { useState } from 'react'
import './Contact.css'

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        setSubmitted(true)
    }

    return (
        <div className="contact">
            <section className="page-hero">
                <div className="container">
                    <div className="badge">Get in Touch</div>
                    <h1>Contact Us</h1>
                    <p>Have a question, want to volunteer, or looking to partner with us? We'd love to hear from you.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="contact__layout">
                        {/* Form */}
                        <div className="contact__form-wrap">
                            {submitted ? (
                                <div className="contact__success">
                                    <div className="contact__success-icon">✅</div>
                                    <h3>Message Sent!</h3>
                                    <p>Thank you for reaching out. Our team will get back to you within 1–2 business days.</p>
                                    <button className="btn btn-outline-dark" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}>
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form className="contact__form" onSubmit={handleSubmit} noValidate>
                                    <h2>Send Us a Message</h2>
                                    <p style={{ marginBottom: '2rem' }}>Fill out the form below and we'll be in touch shortly.</p>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label htmlFor="name">Full Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Your full name"
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="your@email.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="subject">Subject</label>
                                        <select id="subject" name="subject" value={form.subject} onChange={handleChange} required>
                                            <option value="">Select a topic...</option>
                                            <option value="volunteer">Volunteering</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="donation">Donation</option>
                                            <option value="programs">Our Programs</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="message">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder="Tell us how we can help or how you'd like to get involved..."
                                            rows={6}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary contact__submit">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="contact__sidebar">
                            <div className="contact__info-card">
                                <h3>Contact Information</h3>
                                <div className="contact__info-list">
                                    <div className="contact__info-item">
                                        <div className="contact__info-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <strong>Email</strong>
                                            <a href="mailto:info@shamsroj.org">info@shamsroj.org</a>
                                        </div>
                                    </div>
                                    <div className="contact__info-item">
                                        <div className="contact__info-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <strong>Phone</strong>
                                            <span>+963 000 000 000</span>
                                        </div>
                                    </div>
                                    <div className="contact__info-item">
                                        <div className="contact__info-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <div>
                                            <strong>Location</strong>
                                            <span>Syria</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="contact__ways">
                                <h4>Ways to Get Involved</h4>
                                <div className="contact__way">
                                    <span className="contact__way-icon">🌱</span>
                                    <div>
                                        <strong>Volunteer</strong>
                                        <p>Join our campaigns and training programs</p>
                                    </div>
                                </div>
                                <div className="contact__way">
                                    <span className="contact__way-icon">🤝</span>
                                    <div>
                                        <strong>Partner With Us</strong>
                                        <p>Collaborate on humanitarian initiatives</p>
                                    </div>
                                </div>
                                <div className="contact__way">
                                    <span className="contact__way-icon">💛</span>
                                    <div>
                                        <strong>Support Our Work</strong>
                                        <p>Help fund community development programs</p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    )
}
