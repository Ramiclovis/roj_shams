import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeaf, faHandshake, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import '../assets/components/Contact.css'

const subjectOptions = [
    { value: 'volunteer', labelKey: 'contact.subjectVolunteer' },
    { value: 'partnership', labelKey: 'contact.subjectPartnership' },
    { value: 'donation', labelKey: 'contact.subjectDonation' },
    { value: 'programs', labelKey: 'contact.subjectPrograms' },
    { value: 'other', labelKey: 'contact.subjectOther' },
]

export default function Contact() {
    const { t } = useLanguage()
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
                    <div className="badge">{t('contact.badge')}</div>
                    <h1>{t('contact.title')}</h1>
                    <p>{t('contact.lead')}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="contact__layout">
                        <div className="contact__form-wrap">
                            {submitted ? (
                                <div className="contact__success">
                                    <div className="contact__success-icon">✅</div>
                                    <h3>{t('contact.successTitle')}</h3>
                                    <p>{t('contact.successP')}</p>
                                    <button className="btn btn-outline-dark" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}>
                                        {t('contact.sendAnother')}
                                    </button>
                                </div>
                            ) : (
                                <form className="contact__form" onSubmit={handleSubmit} noValidate>
                                    <h2>{t('contact.formTitle')}</h2>
                                    <p style={{ marginBottom: '2rem' }}>{t('contact.formLead')}</p>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label htmlFor="name">{t('contact.labelName')}</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder={t('contact.placeholderName')}
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor="email">{t('contact.labelEmail')}</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder={t('contact.placeholderEmail')}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="subject">{t('contact.labelSubject')}</label>
                                        <select id="subject" name="subject" value={form.subject} onChange={handleChange} required>
                                            <option value="">{t('contact.subjectPlaceholder')}</option>
                                            {subjectOptions.map((opt, i) => (
                                                <option key={i} value={opt.value}>{t(opt.labelKey)}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="message">{t('contact.labelMessage')}</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder={t('contact.placeholderMessage')}
                                            rows={6}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary contact__submit">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                        {t('contact.sendButton')}
                                    </button>
                                </form>
                            )}
                        </div>

                        <aside className="contact__sidebar">
                            <div className="contact__info-card">
                                <h3>{t('contact.infoTitle')}</h3>
                                <div className="contact__info-list">
                                    <div className="contact__info-item">
                                        <div className="contact__info-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <strong>{t('contact.email')}</strong>
                                            <a href={`mailto:${t('contact.emailValue')}`}>{t('contact.emailValue')}</a>
                                        </div>
                                    </div>
                                    <div className="contact__info-item">
                                        <div className="contact__info-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <strong>{t('contact.phone')}</strong>
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
                                            <strong>{t('contact.location')}</strong>
                                            <span>Syria</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="contact__ways">
                                <h4>{t('contact.waysTitle')}</h4>
                                <div className="contact__way">
                                    <div className="contact__way-icon-wrap">
                                        <FontAwesomeIcon icon={faLeaf} className="contact__way-icon" />
                                    </div>
                                    <div>
                                        <strong>{t('contact.way1Title')}</strong>
                                        <p>{t('contact.way1P')}</p>
                                    </div>
                                </div>
                                <div className="contact__way">
                                    <div className="contact__way-icon-wrap">
                                        <FontAwesomeIcon icon={faHandshake} className="contact__way-icon" />
                                    </div>
                                    <div>
                                        <strong>{t('contact.way2Title')}</strong>
                                        <p>{t('contact.way2P')}</p>
                                    </div>
                                </div>
                                <div className="contact__way">
                                    <div className="contact__way-icon-wrap">
                                        <FontAwesomeIcon icon={faHeart} className="contact__way-icon" />
                                    </div>
                                    <div>
                                        <strong>{t('contact.way3Title')}</strong>
                                        <p>{t('contact.way3P')}</p>
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
