import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faBook, faHeartbeat, faUsers, faLeaf } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import '../assets/components/WhatWeDo.css'

const objectives = [
    {
        icon: faBullseye,
        title: 'Capacity Building',
    },
    {
        icon: faBook,
        title: 'Education',
    },
    {
        icon: faHeartbeat,
        title: 'Healthcare',
    },
    {
        icon: faUsers,
        title: 'Social Support',
    },
    {
        icon: faLeaf,
        title: 'Volunteering',
    },
]

export default function WhatWeDo() {
    const [activitiesInView, setActivitiesInView] = useState(false)
    const activitiesRef = useRef(null)
    const { t } = useLanguage()

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
                        {objectives.map((obj, i) => (
                            <div
                                key={i}
                                className={`what-we-do-card what-we-do-card--${i % 2 === 0 ? 'from-right' : 'from-left'}`}
                            >
                                <div className="what-we-do-card-header">
                                    <div className="what-we-do-card-icon">
                                        <FontAwesomeIcon icon={obj.icon} />
                                    </div>
                                    <h3 className="what-we-do-card-title">{t(`objective.${i}.title`)}</h3>
                                </div>
                                <div className="what-we-do-card-columns">
                                    <div className="what-we-do-card-col">
                                        <h4 className="what-we-do-card-subtitle">{t('activities.urgentNeeds')}</h4>
                                        <p className="what-we-do-card-text">{t(`objective.${i}.needs`)}</p>
                                    </div>
                                    <div className="what-we-do-card-col">
                                        <h4 className="what-we-do-card-subtitle">{t('activities.ourWork')}</h4>
                                        <p className="what-we-do-card-text">{t(`objective.${i}.work`)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
