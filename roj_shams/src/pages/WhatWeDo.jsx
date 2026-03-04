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
    const [activeObjective, setActiveObjective] = useState(null)
    const [activitiesInView, setActivitiesInView] = useState(false)
    const activitiesRef = useRef(null)
    const { t } = useLanguage()

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
                        <h2>{t('activities.title')}</h2>
                    </div>

                    <div className="activities-nav">
                        {objectives.map((obj, i) => (
                            <button
                                key={i}
                                className={`activity-btn ${activeObjective === i ? 'active' : ''}`}
                                onClick={() => setActiveObjective(activeObjective === i ? null : i)}
                            >
                                <div className="activity-icon-wrapper">
                                    <FontAwesomeIcon icon={obj.icon} className="activity-icon" />
                                </div>
                                <span className="activity-label">{t(`objective.${i}.title`)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`activity-details-wrapper ${activeObjective !== null ? 'open' : ''}`}>
                    {activeObjective !== null && (() => {
                        const obj = objectives[activeObjective]
                        return (
                            <div className="container activity-details animate-fade-in">
                                <div className="activity-details-left">
                                    <div className="activity-details-title-row">
                                        <div className="activity-details-icon-large">
                                            <FontAwesomeIcon icon={obj.icon} />
                                        </div>
                                        <h3>{t(`objective.${activeObjective}.title`)}</h3>
                                    </div>
                                </div>
                                <div className="activity-details-right">
                                    <h4>{t('activities.ourWork')}</h4>
                                    <p>{t(`objective.${activeObjective}.desc`)}</p>
                                </div>
                            </div>
                        )
                    })()}
                </div>
            </section>
        </div>
    )
}
