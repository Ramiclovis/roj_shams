import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBullseye, faBook, faHeartbeat, faUsers, faLeaf, faTruckMedical,
    faHandHoldingHeart, faGraduationCap, faHospital, faStar,
    faHandshake, faGlobe, faChild, faHome, faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import { objectivesBase } from '../data/objectivesData'
import '../assets/components/WhatWeDo.css'

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

export default function WhatWeDo() {
    const [activitiesInView, setActivitiesInView] = useState(false)
    const activitiesRef = useRef(null)
    const { t, lang } = useLanguage()
    const objectives = loadObjectives()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const el = activitiesRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setActivitiesInView(true)
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div className="what-we-do-page">
            {/* ── Intro paragraph ─────────────────────────── */}
            <section className="wwd-intro section">
                <div className="container">
                    <div className="wwd-intro__inner">
                        <div className="badge">{t('whatWeDo.title')}</div>
                        <h1>{t('whatWeDo.title')}</h1>
                        <p className="wwd-intro__lead">{t('whatWeDo.pageIntro')}</p>
                    </div>
                </div>
            </section>

            {/* ── Activities & Programs ─────────────────────── */}
            <section
                ref={activitiesRef}
                className={`activities-section ${activitiesInView ? 'activities-section--in-view' : ''}`}
            >
                <div className="container">
                    <div className="section-header activities-header">

                    </div>

                    <div className="what-we-do-cards-grid">
                        {objectives.map((obj, i) => {
                            const icon  = ICON_MAP[obj.iconName] || faBullseye
                            const title = lang === 'ar' ? (obj.titleAr || obj.titleEn) : (obj.titleEn || obj.titleAr)
                            const needs = lang === 'ar' ? (obj.needsAr || obj.needsEn) : (obj.needsEn || obj.needsAr)
                            const work  = lang === 'ar' ? (obj.workAr  || obj.workEn)  : (obj.workEn  || obj.workAr)
                            return (
                            <NavLink
                                key={obj.id ?? i}
                                to={`/what-we-do/${obj.id ?? i}`}
                                className={`what-we-do-card what-we-do-card--${i % 2 === 0 ? 'from-right' : 'from-left'}`}
                                aria-label={title}
                            >
                                <div className="what-we-do-card-header">
                                    <div className="what-we-do-card-icon">
                                        <FontAwesomeIcon icon={icon} />
                                    </div>
                                    <h3 className="what-we-do-card-title">{title}</h3>
                                </div>
                                <div className="what-we-do-card-columns">
                                    <div className="what-we-do-card-col">
                                        <h4 className="what-we-do-card-subtitle">{t('activities.urgentNeeds')}</h4>
                                        <p className="what-we-do-card-text">{needs}</p>
                                    </div>
                                    <div className="what-we-do-card-col">
                                        <h4 className="what-we-do-card-subtitle">{t('activities.ourWork')}</h4>
                                        <p className="what-we-do-card-text">{work}</p>
                                    </div>
                                </div>
                            </NavLink>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}
