import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Objectives.css'

const objectives = [
    { icon: '🎯', color: '#2980B9' },
    { icon: '📚', color: '#8E44AD' },
    { icon: '🏥', color: '#27AE60' },
    { icon: '🤝', color: '#E67E22' },
    { icon: '🌱', color: '#16A085' },
]

const activityKeys = [
    ['objPage.0.act0', 'objPage.0.act1', 'objPage.0.act2', 'objPage.0.act3'],
    ['objPage.1.act0', 'objPage.1.act1', 'objPage.1.act2', 'objPage.1.act3'],
    ['objPage.2.act0', 'objPage.2.act1', 'objPage.2.act2', 'objPage.2.act3'],
    ['objPage.3.act0', 'objPage.3.act1', 'objPage.3.act2', 'objPage.3.act3'],
    ['objPage.4.act0', 'objPage.4.act1', 'objPage.4.act2', 'objPage.4.act3'],
]

export default function Objectives() {
    const { t } = useLanguage()
    return (
        <div className="objectives">
            <section className="page-hero">
                <div className="container">
                    <div className="badge">{t('objPage.badge')}</div>
                    <h1>{t('objPage.title')}</h1>
                    <p>{t('objPage.lead')}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="objectives__list">
                        {objectives.map((obj, i) => (
                            <div key={i} className={`obj-detail ${i % 2 === 1 ? 'obj-detail--reverse' : ''}`}>
                                <div className="obj-detail__visual" style={{ '--obj-color': obj.color }}>
                                    <div className="obj-detail__icon-wrapper">
                                        <span className="obj-detail__icon">{obj.icon}</span>
                                        <div className="obj-detail__number">0{i + 1}</div>
                                    </div>
                                </div>
                                <div className="obj-detail__content">
                                    <div className="badge">{t(`objPage.${i}.subtitle`)}</div>
                                    <h2>{t(`objective.${i}.title`)}</h2>
                                    <div className="divider" style={{ margin: '1rem 0' }} />
                                    <p>{t(`objective.${i}.desc`)}</p>
                                    <ul className="obj-detail__activities">
                                        {activityKeys[i].map((key, j) => (
                                            <li key={j}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12" /></svg>
                                                {t(key)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="obj-cta-strip">
                <div className="container obj-cta-strip__inner">
                    <div>
                        <h2>{t('objPage.supportTitle')}</h2>
                        <p>{t('objPage.supportP')}</p>
                    </div>
                    <NavLink to="/contact" className="btn btn-primary">{t('hero.getInvolved')}</NavLink>
                </div>
            </section>
        </div>
    )
}
