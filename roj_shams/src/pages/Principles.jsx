import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './Principles.css'

const coreValueKeys = [
    { icon: '🌍', color: '#2980B9', titleKey: 'principles.val0Title', descKey: 'principles.val0Desc' },
    { icon: '🚫', color: '#C0392B', titleKey: 'principles.val1Title', descKey: 'principles.val1Desc' },
    { icon: '🤝', color: '#27AE60', titleKey: 'principles.val2Title', descKey: 'principles.val2Desc' },
    { icon: '⚖️', color: '#8E44AD', titleKey: 'principles.val3Title', descKey: 'principles.val3Desc' },
]

const prohibitedKeys = ['principles.prohibited.0', 'principles.prohibited.1', 'principles.prohibited.2', 'principles.prohibited.3', 'principles.prohibited.4', 'principles.prohibited.5', 'principles.prohibited.6', 'principles.prohibited.7']

const faqKeys = [
    { qKey: 'principles.faq0q', aKey: 'principles.faq0a' },
    { qKey: 'principles.faq1q', aKey: 'principles.faq1a' },
    { qKey: 'principles.faq2q', aKey: 'principles.faq2a' },
    { qKey: 'principles.faq3q', aKey: 'principles.faq3a' },
]

function Accordion({ items, t }) {
    const [open, setOpen] = useState(null)
    return (
        <div className="accordion">
            {items.map((item, i) => (
                <div key={i} className={`accordion__item${open === i ? ' accordion__item--open' : ''}`}>
                    <button className="accordion__trigger" onClick={() => setOpen(open === i ? null : i)}>
                        <span>{t(item.qKey)}</span>
                        <svg className="accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                    <div className="accordion__body">
                        <p>{t(item.aKey)}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function Principles() {
    const { t } = useLanguage()
    return (
        <div className="principles">
            <section className="page-hero">
                <div className="container">
                    <div className="badge">{t('principles.badge')}</div>
                    <h1>{t('principles.title')}</h1>
                    <p>{t('principles.lead')}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="principles__purpose">
                        <div className="principles__purpose-text">
                            <div className="badge">{t('principles.corePurpose')}</div>
                            <h2>{t('principles.integrityTitle')}</h2>
                            <div className="divider" style={{ margin: '1.25rem 0' }} />
                            <p>{t('principles.introP1')}</p>
                            <p style={{ marginTop: '1rem' }}>{t('principles.introP2')}</p>
                        </div>
                        <div className="principles__purpose-highlights">
                            <div className="principles__highlight">
                                <span className="principles__highlight-icon">🛡️</span>
                                <strong>{t('principles.highlight1Title')}</strong>
                                <p>{t('principles.highlight1P')}</p>
                            </div>
                            <div className="principles__highlight">
                                <span className="principles__highlight-icon">🔍</span>
                                <strong>{t('principles.highlight2Title')}</strong>
                                <p>{t('principles.highlight2P')}</p>
                            </div>
                            <div className="principles__highlight">
                                <span className="principles__highlight-icon">📋</span>
                                <strong>{t('principles.highlight3Title')}</strong>
                                <p>{t('principles.highlight3P')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">{t('principles.valuesBadge')}</div>
                        <h2>{t('principles.valuesTitle')}</h2>
                        <div className="divider" />
                        <p>{t('principles.valuesLead')}</p>
                    </div>
                    <div className="values-grid">
                        {coreValueKeys.map((v, i) => (
                            <div key={i} className="value-card" style={{ '--val-color': v.color }}>
                                <div className="value-card__icon">{v.icon}</div>
                                <h3>{t(v.titleKey)}</h3>
                                <p>{t(v.descKey)}</p>
                                <div className="value-card__bar" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="prohibited">
                        <div className="prohibited__header">
                            <div className="badge">{t('principles.boundaries')}</div>
                            <h2>{t('principles.prohibitedTitle')}</h2>
                            <div className="divider" style={{ margin: '1.25rem 0' }} />
                            <p>{t('principles.prohibitedLead')}</p>
                        </div>
                        <div className="prohibited__list">
                            {prohibitedKeys.map((key, i) => (
                                <div key={i} className="prohibited__item">
                                    <div className="prohibited__icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                    </div>
                                    <span>{t(key)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">{t('principles.accountabilityBadge')}</div>
                        <h2>{t('principles.reportingTitle')}</h2>
                        <div className="divider" />
                        <p>{t('principles.reportingLead')}</p>
                    </div>
                    <Accordion items={faqKeys} t={t} />
                </div>
            </section>
        </div>
    )
}
