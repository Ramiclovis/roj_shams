import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBullseye, faBook, faHeartbeat, faUsers, faLeaf, faTruckMedical,
    faHandHoldingHeart, faGraduationCap, faHospital, faStar,
    faHandshake, faGlobe, faChild, faHome, faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import { objectivesBase } from '../data/objectivesData'
import '../assets/components/Objectives.css'

const ICON_MAP = {
    faBullseye, faBook, faHeartbeat, faUsers, faLeaf, faTruckMedical,
    faHandHoldingHeart, faGraduationCap, faHospital, faStar,
    faHandshake, faGlobe, faChild, faHome, faChartLine,
}

function loadObjectives() {
    try {
        const stored = localStorage.getItem('admin_objectives')
        if (stored) return JSON.parse(stored).filter(o => o.active !== false)
    } catch { /* ignore */ }
    return objectivesBase.filter(o => o.active !== false)
}

export default function Objectives() {
    const { t, lang } = useLanguage()
    const objectives = loadObjectives()

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
                        {objectives.map((obj, i) => {
                            const icon = ICON_MAP[obj.iconName] || faBullseye
                            const title = lang === 'ar' ? (obj.titleAr || obj.titleEn) : (obj.titleEn || obj.titleAr)
                            const needs = lang === 'ar' ? (obj.needsAr || obj.needsEn) : (obj.needsEn || obj.needsAr)
                            const work  = lang === 'ar' ? (obj.workAr  || obj.workEn)  : (obj.workEn  || obj.workAr)
                            const acts  = lang === 'ar'
                                ? (obj.activitiesAr?.filter(Boolean) || [])
                                : (obj.activitiesEn?.filter(Boolean) || [])
                            return (
                            <NavLink
                                key={obj.id ?? i}
                                to={`/what-we-do/${obj.id ?? i}`}
                                className={`obj-detail ${i % 2 === 1 ? 'obj-detail--reverse' : ''}`}
                                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', cursor: 'pointer' }}
                            >
                                <div className="obj-detail__visual">
                                    <div className="obj-detail__icon-wrapper">
                                        <FontAwesomeIcon icon={icon} className="obj-detail__icon" />
                                        <div className="obj-detail__number">{String(i + 1).padStart(2, '0')}</div>
                                    </div>
                                </div>
                                <div className="obj-detail__content">
                                    <h2>{title}</h2>
                                    <div className="divider" style={{ margin: '1rem 0' }} />
                                    {needs && <p><strong>{t('activities.urgentNeeds')}:</strong> {needs}</p>}
                                    {work  && <p style={{ marginTop: '0.5rem' }}><strong>{t('activities.ourWork')}:</strong> {work}</p>}
                                    {acts.length > 0 && (
                                        <ul className="obj-detail__activities">
                                            {acts.map((act, j) => (
                                                <li key={j}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12" /></svg>
                                                    {act}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </NavLink>
                            )
                        })}
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
