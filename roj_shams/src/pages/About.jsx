import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import '../assets/components/About.css'

const timelineKeys = [
    { yearKey: 'about.timeline.0.year', titleKey: 'about.timeline.0.title', descKey: 'about.timeline.0.desc' },
    { yearKey: 'about.timeline.1.year', titleKey: 'about.timeline.1.title', descKey: 'about.timeline.1.desc' },
    { yearKey: 'about.timeline.2.year', titleKey: 'about.timeline.2.title', descKey: 'about.timeline.2.desc' },
    { yearKey: 'about.timeline.3.year', titleKey: 'about.timeline.3.title', descKey: 'about.timeline.3.desc' },
]

export default function About() {
    const { t } = useLanguage()
    return (
        <div className="about">
            <section className="page-hero">
                <div className="container">
                    <div className="badge">{t('about.badge')}</div>
                    <h1>{t('about.title')}</h1>
                    <p>{t('about.lead')}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="about__intro">
                        <div className="about__intro-text">
                            <div className="badge">{t('about.whoWeAre')}</div>
                            <h2>{t('about.introTitle')}</h2>
                            <div className="divider" style={{ margin: '1.25rem 0' }} />
                            <p>{t('about.introP1')}</p>
                            <p style={{ marginTop: '1rem' }}>{t('about.introP2')}</p>
                            <p style={{ marginTop: '1rem' }}>{t('about.introP3')}</p>
                        </div>
                        <div className="about__intro-visual">
                            <div className="about__quote-card">
                                <div className="about__quote-mark">"</div>
                                <blockquote>{t('about.quote')}</blockquote>
                                <cite>{t('about.quoteCite')}</cite>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">{t('about.purpose')}</div>
                        <h2>{t('about.visionMission')}</h2>
                        <div className="divider" />
                    </div>
                    <div className="vm-grid">
                        <div className="vm-card vm-card--vision">
                            <div className="vm-card__icon">🌅</div>
                            <h3>{t('about.visionTitle')}</h3>
                            <p>{t('about.visionP')}</p>
                        </div>
                        <div className="vm-card vm-card--mission">
                            <div className="vm-card__icon">🎯</div>
                            <h3>{t('about.missionTitle')}</h3>
                            <p>{t('about.missionP')}</p>
                        </div>
                        <div className="vm-card vm-card--values">
                            <div className="vm-card__icon">⚖️</div>
                            <h3>{t('about.valuesTitle')}</h3>
                            <p>{t('about.valuesP')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">{t('about.journey')}</div>
                        <h2>{t('about.howWeGrew')}</h2>
                        <div className="divider" />
                    </div>
                    <div className="timeline">
                        {timelineKeys.map((item, i) => (
                            <div key={i} className="timeline__item">
                                <div className="timeline__dot" />
                                <div className="timeline__content">
                                    <div className="timeline__year">{t(item.yearKey)}</div>
                                    <h4>{t(item.titleKey)}</h4>
                                    <p>{t(item.descKey)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section section-alt">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2>{t('about.wantMore')}</h2>
                    <p style={{ margin: '1rem auto 2rem', maxWidth: '500px' }}>{t('about.wantMoreP')}</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <NavLink to="/founders" className="btn btn-primary">{t('about.meetFounders')}</NavLink>
                        <NavLink to="/contact" className="btn btn-outline-dark">{t('nav.contact')}</NavLink>
                    </div>
                </div>
            </section>
        </div>
    )
}
