import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved, faMagnifyingGlass, faClipboardCheck, faGlobe, faBan, faPeopleGroup, faScaleBalanced } from '@fortawesome/free-solid-svg-icons'
import '../assets/components/Principles.css'

// ─── Data config (keys only) ─────────────────────────────────────────────
const CORE_VALUES = [
    { icon: faGlobe, titleKey: 'principles.val0Title', descKey: 'principles.val0Desc' },
    { icon: faBan, titleKey: 'principles.val1Title', descKey: 'principles.val1Desc' },
    { icon: faPeopleGroup, titleKey: 'principles.val2Title', descKey: 'principles.val2Desc' },
    { icon: faScaleBalanced, titleKey: 'principles.val3Title', descKey: 'principles.val3Desc' },
]

const PROHIBITED_KEYS = [
    'principles.prohibited.0', 'principles.prohibited.1', 'principles.prohibited.2', 'principles.prohibited.3',
    'principles.prohibited.4', 'principles.prohibited.5', 'principles.prohibited.6', 'principles.prohibited.7',
]

const SCOPE_KEYS = ['principles.scopeList0', 'principles.scopeList1', 'principles.scopeList2', 'principles.scopeList3']

const REPORT_WHAT_KEYS = [
    'principles.reportWhat0', 'principles.reportWhat1', 'principles.reportWhat2', 'principles.reportWhat3',
    'principles.reportWhat4', 'principles.reportWhat5', 'principles.reportWhat6',
]

const FAQ_ITEMS = [
    { qKey: 'principles.faq0q', aKey: 'principles.faq0a' },
    { qKey: 'principles.faq1q', aKey: 'principles.faq1a' },
    { qKey: 'principles.faq2q', aKey: 'principles.faq2a' },
    { qKey: 'principles.faq3q', aKey: 'principles.faq3a' },
]

// Highlights: Integrity, Transparency, Competence (FontAwesome in dark circle + orange)
const HIGHLIGHT_ICONS = [
    { icon: faShieldHalved },
    { icon: faMagnifyingGlass },
    { icon: faClipboardCheck },
]

// ─── Accordion (FAQ) ─────────────────────────────────────────────────────
function Accordion({ items, t }) {
    const [openIndex, setOpenIndex] = useState(null)
    return (
        <div className="principles-accordion" role="region" aria-label={t('principles.reportingTitle')}>
            {items.map((item, i) => (
                <div
                    key={i}
                    className={`principles-accordion__item ${openIndex === i ? 'principles-accordion__item--open' : ''}`}
                >
                    <button
                        type="button"
                        className="principles-accordion__trigger"
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        aria-expanded={openIndex === i}
                        aria-controls={`faq-answer-${i}`}
                        id={`faq-question-${i}`}
                    >
                        <span>{t(item.qKey)}</span>
                        <svg className="principles-accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                    <div
                        id={`faq-answer-${i}`}
                        role="region"
                        aria-labelledby={`faq-question-${i}`}
                        className="principles-accordion__body"
                    >
                        <p>{t(item.aKey)}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function Principles() {
    const { t } = useLanguage()
    const [reportForm, setReportForm] = useState({ name: '', address: '', phone: '', message: '' })
    const [reportSubmitted, setReportSubmitted] = useState(false)

    const handleReportChange = (e) => {
        setReportForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleReportSubmit = (e) => {
        e.preventDefault()
        setReportSubmitted(true)
    }

    return (
        <div className="principles-page">
            {/* Hero */}
            <header className="principles-hero">
                <div className="container">
                    <div className="badge">{t('principles.badge')}</div>
                    <h1 className="principles-hero__title">{t('principles.title')}</h1>
                    <p className="principles-hero__lead">{t('principles.lead')}</p>
                </div>
            </header>

            {/* 1. Core Purpose & Integrity */}
            <section className="principles-section principles-section--purpose" aria-labelledby="section-purpose">
                <div className="container">
                    <div className="principles-section__head">
                        <span className="principles-section__badge">{t('principles.corePurpose')}</span>
                        <h2 id="section-purpose" className="principles-section__title">{t('principles.integrityTitle')}</h2>
                        <div className="principles-section__divider" />
                        <p className="principles-section__lead">{t('principles.introP1')}</p>
                        <p className="principles-section__text">{t('principles.introP2')}</p>
                    </div>
                    <div className="principles-highlights">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="principles-highlight">
                                <span className="principles-highlight__icon-wrap">
                                    <FontAwesomeIcon icon={HIGHLIGHT_ICONS[i - 1].icon} className="principles-highlight__icon" />
                                </span>
                                <div>
                                    <h3 className="principles-highlight__title">{t(`principles.highlight${i}Title`)}</h3>
                                    <p className="principles-highlight__text">{t(`principles.highlight${i}P`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. Scope of Application */}
            <section className="principles-section principles-section--alt" aria-labelledby="section-scope">
                <div className="container">
                    <div className="principles-section__head">
                        <span className="principles-section__badge">{t('principles.scopeBadge')}</span>
                        <h2 id="section-scope" className="principles-section__title">{t('principles.scopeTitle')}</h2>
                        <div className="principles-section__divider" />
                        <p className="principles-section__lead">{t('principles.scopeLead')}</p>
                        <p className="principles-section__text">{t('principles.scopeP1')}</p>
                        <ol className="principles-scope-list">
                            {SCOPE_KEYS.map((key, i) => (
                                <li key={i}>{t(key)}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            {/* 3. Core Values */}
            <section className="principles-section" aria-labelledby="section-values">
                <div className="container">
                    <div className="principles-section__head principles-section__head--center">
                        <span className="principles-section__badge">{t('principles.valuesBadge')}</span>
                        <h2 id="section-values" className="principles-section__title">{t('principles.valuesTitle')}</h2>
                        <div className="principles-section__divider" />
                        <p className="principles-section__lead">{t('principles.valuesLead')}</p>
                    </div>
                    <div className="principles-values-grid">
                        {CORE_VALUES.map((v, i) => (
                            <article key={i} className="principles-value-card">
                                <span className="principles-value-card__icon-wrap">
                                    <FontAwesomeIcon icon={v.icon} className="principles-value-card__icon" />
                                </span>
                                <h3 className="principles-value-card__title">{t(v.titleKey)}</h3>
                                <p className="principles-value-card__text">{t(v.descKey)}</p>
                                <div className="principles-value-card__accent" aria-hidden="true" />
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Purpose of Volunteering */}
            <section className="principles-section principles-section--alt principles-section--narrow" aria-labelledby="section-volunteer">
                <div className="container">
                    <div className="principles-section__head">
                        <span className="principles-section__badge">{t('principles.volunteerPurposeTitle')}</span>
                        <h2 id="section-volunteer" className="principles-section__title">{t('principles.volunteerPurposeTitle')}</h2>
                        <div className="principles-section__divider" />
                        <p className="principles-section__text">{t('principles.volunteerPurposeP')}</p>
                    </div>
                </div>
            </section>

            {/* 5. Prohibited Actions */}
            <section className="principles-section" aria-labelledby="section-prohibited">
                <div className="container">
                    <div className="principles-section__head">
                        <span className="principles-section__badge">{t('principles.boundaries')}</span>
                        <h2 id="section-prohibited" className="principles-section__title">{t('principles.prohibitedTitle')}</h2>
                        <div className="principles-section__divider" />
                        <p className="principles-section__lead">{t('principles.prohibitedLead')}</p>
                    </div>
                    <ul className="principles-prohibited-list">
                        {PROHIBITED_KEYS.map((key, i) => (
                            <li key={i} className="principles-prohibited-item">
                                <span className="principles-prohibited-item__icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="15" y1="9" x2="9" y2="15" />
                                        <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                </span>
                                <span>{t(key)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>




            {/* 7. Reporting Channels & What to Report */}
            <section className="principles-section" aria-labelledby="section-channels">
                <div className="container">
                    <div className="principles-section__head">
                        <span className="principles-section__badge">{t('principles.reportChannelsBadge')}</span>
                        <h2 id="section-channels" className="principles-section__title">{t('principles.reportChannelsTitle')}</h2>
                        <div className="principles-section__divider" />
                        <p className="principles-section__lead">{t('principles.reportChannelsLead')}</p>
                    </div>

                    <div className="principles-report-block">
                        <div className="principles-report-block__content">
                            <h3 className="principles-report-block__subtitle">{t('principles.reportWhatTitle')}</h3>
                            <p className="principles-report-block__lead">{t('principles.reportWhatLead')}</p>
                            <ul className="principles-report-list">
                                {REPORT_WHAT_KEYS.map((key, i) => (
                                    <li key={i}>{t(key)}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="principles-report-block__side">
                            {reportSubmitted ? (
                                <div className="principles-report-success">
                                    <div className="principles-report-success__icon">✓</div>
                                    <h3 className="principles-report-success__title">{t('principles.reportSuccessTitle')}</h3>
                                    <p className="principles-report-success__text">{t('principles.reportSuccessP')}</p>
                                    <button
                                        type="button"
                                        className="principles-report__btn principles-report__btn--secondary"
                                        onClick={() => { setReportSubmitted(false); setReportForm({ name: '', address: '', phone: '', message: '' }) }}
                                    >
                                        {t('contact.sendAnother')}
                                    </button>
                                </div>
                            ) : (
                                <form className="principles-report-form" onSubmit={handleReportSubmit} noValidate>
                                    <div className="principles-report-form__field">
                                        <label htmlFor="report-name">{t('principles.reportNameLabel')}</label>
                                        <input
                                            type="text"
                                            id="report-name"
                                            name="name"
                                            value={reportForm.name}
                                            onChange={handleReportChange}
                                            placeholder={t('principles.reportNameLabel')}
                                            required
                                        />
                                    </div>
                                    <div className="principles-report-form__field">
                                        <label htmlFor="report-address">{t('principles.reportAddressLabel')}</label>
                                        <input
                                            type="text"
                                            id="report-address"
                                            name="address"
                                            value={reportForm.address}
                                            onChange={handleReportChange}
                                            placeholder={t('principles.reportAddressLabel')}
                                        />
                                    </div>
                                    <div className="principles-report-form__field">
                                        <label htmlFor="report-phone">{t('principles.reportPhoneLabel')}</label>
                                        <input
                                            type="tel"
                                            id="report-phone"
                                            name="phone"
                                            value={reportForm.phone}
                                            onChange={handleReportChange}
                                            placeholder={t('principles.reportPhoneLabel')}
                                        />
                                    </div>
                                    <div className="principles-report-form__field">
                                        <label htmlFor="report-message">{t('principles.reportMessageLabel')}</label>
                                        <textarea
                                            id="report-message"
                                            name="message"
                                            value={reportForm.message}
                                            onChange={handleReportChange}
                                            placeholder={t('principles.reportMessagePlaceholder')}
                                            rows={4}
                                        />
                                    </div>
                                    <button type="submit" className="principles-report__btn">
                                        {t('principles.reportSubmitButton')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
