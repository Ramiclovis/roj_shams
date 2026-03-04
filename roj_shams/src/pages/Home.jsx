import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faBook, faHeartbeat, faUsers, faLeaf } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebookF, faYoutube, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import '../assets/components/Home.css'

const heroImages = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1600&auto=format&fit=crop',
]

const objectives = [
    {
        icon: faBullseye,
        title: 'Capacity Building',
        desc: 'Developing life skills and empowering individuals to foster sustainable community growth. We design and deliver comprehensive programs that build leadership, professional competencies, and resilience so communities can thrive from within.',
        link: '/objectives',
    },
    {
        icon: faBook,
        title: 'Education',
        desc: 'Establishing educational centers and kindergartens across all stages of learning. We ensure every child and adult has access to quality education regardless of circumstance, and we support teachers and learning environments for lasting impact.',
        link: '/objectives',
    },
    {
        icon: faHeartbeat,
        title: 'Healthcare',
        desc: 'Providing medical care for vulnerable groups and improving health standards through medical centers. Our work includes preventive care, mental health support, and outreach in underserved areas so that health becomes a right, not a privilege.',
        link: '/objectives',
    },
    {
        icon: faUsers,
        title: 'Social Support',
        desc: 'Addressing social issues and providing comprehensive psychosocial support (PSS). We offer counseling, crisis response, and family support to help individuals and communities navigate hardship with dignity and rebuild resilience.',
        link: '/objectives',
    },
    {
        icon: faLeaf,
        title: 'Volunteering',
        desc: 'Organizing volunteer campaigns and impactful training programs for communities. We channel the energy and skills of volunteers into structured service, building both individual capacity and collective impact for lasting change.',
        link: '/objectives',
    },
]



const founders = [
    { name: 'Rasha Hayel Mousa', initials: 'RH', roleKey: 'founders.role' },
    { name: 'Nadia Omar Salim', initials: 'NO', roleKey: 'founders.role' },
    { name: 'Judy Badr Hassan', initials: 'JB', roleKey: 'founders.role' },
    { name: 'Mohi Al-Din Sa\'dou', initials: 'MS', roleKey: 'founders.role' },
    { name: 'Dr. Carmen Hassan Ibrahim', initials: 'CH', roleKey: 'founders.role' },
    { name: 'Eng. Lilas Ibrahim Salim', initials: 'LI', roleKey: 'founders.role' },
    { name: 'Lawyer Doaa Al-Jazmati', initials: 'DA', roleKey: 'founders.role' },
]

export default function Home() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [activeObjective, setActiveObjective] = useState(null)
    const [activitiesInView, setActivitiesInView] = useState(false)
    const [wwdInView, setWwdInView] = useState(false)
    const activitiesRef = useRef(null)
    const wwdRef = useRef(null)
    const { t } = useLanguage()

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
        }, 2000)
        return () => clearInterval(interval)
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

    useEffect(() => {
        const el = wwdRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setWwdInView(true)
            },
            { threshold: 0.2 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div className="home">
            {/* ── Hero ─────────────────────────────────── */}
            <section className="hero">
                {/* Background Slider */}
                <div className="hero__slider" aria-hidden="true">
                    {heroImages.map((img, i) => (
                        <div
                            key={i}
                            className={`hero__slide ${i === currentImageIndex ? 'hero__slide--active' : ''}`}
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    ))}
                    <div className="hero__slider-overlay" />
                </div>

                <div className="container hero__content">
                    <div className="badge animate-fade-up">{t('hero.badge')}</div>
                    <h1 className="animate-fade-up-delay-1">
                        {t('hero.titleLine1')}<br />
                        <span className="hero__accent">{t('hero.titleAccent')}</span> {t('hero.titleLine2')}
                    </h1>
                    <p className="hero__lead animate-fade-up-delay-2">
                        {t('hero.lead')}
                    </p>
                    <div className="hero__actions animate-fade-up-delay-3">
                        <NavLink to="/objectives" className="btn btn-primary">{t('hero.exploreWork')}</NavLink>
                        <NavLink to="/contact" className="btn btn-outline">{t('hero.getInvolved')}</NavLink>
                    </div>
                    <div className="hero__social animate-fade-up-delay-4" aria-label="Social media">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="Instagram">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="Facebook">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="YouTube">
                            <FontAwesomeIcon icon={faYoutube} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="LinkedIn">
                            <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                    </div>
                    <div className="hero__scroll-hint animate-fade-up-delay-5" aria-hidden="true">
                        <div className="hero__scroll-line" />
                        <span>{t('hero.scrollHint')}</span>
                    </div>
                </div>
            </section>

            {/* ── Activities & Programs (Objectives) ────────── */}
            <section ref={activitiesRef} className={`activities-section ${activitiesInView ? 'activities-section--in-view' : ''}`}>
                <div className="container">
                    <div className="section-header activities-header">
                        <h2>{t('activities.title')}</h2>
                    </div>

                    <div className="activities-nav">
                        {objectives.map((obj, i) => {
                            return (
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
                            )
                        })}
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

            {/* ── What do we do ────────────────────────── */}
            <section className="wwd-section">
                <div
                    ref={wwdRef}
                    className={`wwd-panel ${wwdInView ? 'wwd-panel--in-view' : ''}`}
                >
                    {/* Full-width background image */}
                    <div className="wwd-panel__bg" />
                    {/* Left half: dark overlay + text */}
                    <div className="wwd-panel__left">
                        <div className="wwd-panel__overlay" />
                        <div className="wwd-panel__content">
                            <h2 className="wwd-panel__title">{t('whatWeDo.title')}</h2>
                            <div className="wwd-panel__divider" />
                            <p className="wwd-panel__text">{t('whatWeDo.text')}</p>
                            <NavLink to="/what-we-do" className="wwd-panel__btn">
                                {t('whatWeDo.learnMore')}
                            </NavLink>
                        </div>
                    </div>
                    {/* Right half: clear image, no overlay */}
                    <div className="wwd-panel__right" />
                </div>
            </section>

            {/* ── Values Strip ─────────────────────────── */}
            {/* <section className="values-strip">
                <div className="container values-strip__inner">
                    <div className="values-strip__text">
                        <h2>{t('values.title')}</h2>
                        <p>{t('values.p')}</p>
                        <NavLink to="/principles" className="btn btn-outline">{t('values.readPrinciples')}</NavLink>
                    </div>
                    <div className="values-strip__badges">
                        {[t('values.dignity'), t('values.zeroTolerance'), t('values.solidarity'), t('values.justice')].map((v, i) => (
                            <span key={i} className="values-strip__badge">{v}</span>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* ── Founders Preview ─────────────────────── */}
            {/* <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">{t('founders.badge')}</div>
                        <h2>{t('founders.title')}</h2>
                        <div className="divider" />
                        <p>{t('founders.subtitle')}</p>
                    </div>
                    <div className="founders-preview">
                        {founders.map((f, i) => (
                            <div key={i} className="founder-chip">
                                <div className="founder-chip__avatar">{f.initials}</div>
                                <div>
                                    <span className="founder-chip__name">{f.name}</span>
                                    <span className="founder-chip__role">{t(f.roleKey)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <NavLink to="/founders" className="btn btn-outline-dark">{t('founders.viewAll')}</NavLink>
                    </div>
                </div>
            </section> */}

            {/* ── CTA Banner ───────────────────────────── */}
            <section className="cta-banner">
                <div className="container cta-banner__inner">
                    <div>
                        <h2>{t('cta.title')}</h2>
                        <p>{t('cta.p')}</p>
                    </div>
                    <NavLink to="/contact" className="btn btn-primary">{t('cta.button')}</NavLink>
                </div>
            </section>
        </div>
    )
}
