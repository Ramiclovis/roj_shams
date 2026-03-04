import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faBook, faHeartbeat, faUsers, faLeaf } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebookF, faYoutube, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import '../assets/components/Home.css'

/* صور الهيرو (سلايدر عند عدم وجود فيديو) — معطّلة بالكومنت؛ أزل الكومنت وأعد السلايدر إن رغبت
const heroImages = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1600&auto=format&fit=crop',
]
*/
const heroImages = [] /* فارغ لأن السلايدر معطّل؛ يُستخدم poster فقط إن وُجد فيديو */

/* فيديو الهيرو من assets/VIDEO مع تشغيل مسرّع — مسار يتوافق مع النشر على Vercel/GitHub Pages */
const heroVideoSrc = new URL('../assets/VIDEO/VIDEO.mp4', import.meta.url).href
const heroVideoPlaybackRate = 1.5

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

const newsItems = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', /* غيّر الرابط إلى فيديو منظمة */
        titleKey: 'news.item1.title',
        dateKey: 'news.item1.date',
        excerptKey: 'news.item1.excerpt',
        link: '#',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=600&auto=format&fit=crop',
        titleKey: 'news.item2.title',
        dateKey: 'news.item2.date',
        excerptKey: 'news.item2.excerpt',
        link: '#',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
        titleKey: 'news.item3.title',
        dateKey: 'news.item3.date',
        excerptKey: 'news.item3.excerpt',
        link: '#',
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop',
        titleKey: 'news.item4.title',
        dateKey: 'news.item4.date',
        excerptKey: 'news.item4.excerpt',
        link: '#',
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
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
    const [currentTileIndex, setCurrentTileIndex] = useState(0)
    const [activeObjective, setActiveObjective] = useState(null)
    const [activitiesInView, setActivitiesInView] = useState(false)
    const [wwdInView, setWwdInView] = useState(false)
    const [isNarrow, setIsNarrow] = useState(false)
    const activitiesRef = useRef(null)
    const wwdRef = useRef(null)
    const heroVideoRef = useRef(null)
    const { t } = useLanguage()

    useEffect(() => {
        const mql = window.matchMedia('(max-width: 900px)')
        const handle = () => setIsNarrow(mql.matches)
        mql.addEventListener('change', handle)
        handle()
        return () => mql.removeEventListener('change', handle)
    }, [])

    useEffect(() => {
        const maxIndex = isNarrow ? newsItems.length - 1 : Math.max(0, newsItems.length - 3)
        setCurrentTileIndex((prev) => Math.min(prev, maxIndex))
    }, [isNarrow])

    /* سلايدر صور الهيرو معطّل — كان يغيّر currentImageIndex كل 2 ثانية
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [])
    */

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

    useEffect(() => {
        const maxIndex = isNarrow ? newsItems.length - 1 : Math.max(0, newsItems.length - 3)
        const interval = setInterval(() => {
            setCurrentTileIndex((prev) => (prev + 1) % (maxIndex + 1))
        }, 4500)
        return () => clearInterval(interval)
    }, [isNarrow])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeaturedIndex((prev) => (prev + 1) % newsItems.length)
        }, 4500)
        return () => clearInterval(interval)
    }, [])

    /* تشغيل الفيديو مباشرة على Safari — تحميل صريح + تشغيل برمجي بعد أحداث التحميل */
    useEffect(() => {
        if (!heroVideoSrc) return
        const video = heroVideoRef.current
        if (!video) return

        video.setAttribute('playsinline', 'true')
        video.setAttribute('webkit-playsinline', 'true')
        video.muted = true
        video.load()

        const startPlayback = () => {
            video.muted = true
            video.playbackRate = heroVideoPlaybackRate
            video.play().catch(() => {})
        }

        const tryPlayAfterLayout = () => {
            requestAnimationFrame(() => setTimeout(startPlayback, 0))
        }

        video.addEventListener('loadedmetadata', tryPlayAfterLayout)
        video.addEventListener('loadeddata', tryPlayAfterLayout)
        video.addEventListener('canplay', tryPlayAfterLayout)
        video.addEventListener('canplaythrough', tryPlayAfterLayout)

        if (video.readyState >= 2) tryPlayAfterLayout()
        else setTimeout(tryPlayAfterLayout, 400)

        const wrap = video.closest('.hero__video-wrap')
        const retryOnUserInteraction = () => {
            video.muted = true
            video.play().catch(() => {})
            wrap?.removeEventListener('touchstart', retryOnUserInteraction)
            wrap?.removeEventListener('click', retryOnUserInteraction)
            document.removeEventListener('touchstart', retryOnDocument)
            document.removeEventListener('click', retryOnDocument)
        }
        const retryOnDocument = () => {
            video.muted = true
            video.play().catch(() => {})
            document.removeEventListener('touchstart', retryOnDocument)
            document.removeEventListener('click', retryOnDocument)
            wrap?.removeEventListener('touchstart', retryOnUserInteraction)
            wrap?.removeEventListener('click', retryOnUserInteraction)
        }
        if (wrap) {
            wrap.addEventListener('touchstart', retryOnUserInteraction, { once: true, passive: true })
            wrap.addEventListener('click', retryOnUserInteraction, { once: true })
        }
        document.addEventListener('touchstart', retryOnDocument, { once: true, passive: true })
        document.addEventListener('click', retryOnDocument, { once: true })

        return () => {
            video.removeEventListener('loadedmetadata', tryPlayAfterLayout)
            video.removeEventListener('loadeddata', tryPlayAfterLayout)
            video.removeEventListener('canplay', tryPlayAfterLayout)
            video.removeEventListener('canplaythrough', tryPlayAfterLayout)
            wrap?.removeEventListener('touchstart', retryOnUserInteraction)
            wrap?.removeEventListener('click', retryOnUserInteraction)
            document.removeEventListener('touchstart', retryOnDocument)
            document.removeEventListener('click', retryOnDocument)
        }
    }, [heroVideoSrc])

    return (
        <div className="home">
            {/* ── Hero ─────────────────────────────────── */}
            <section className="hero">
                {/* خلفية الفيديو أو السلايدر */}
                {heroVideoSrc && (
                    <div className="hero__video-wrap" aria-hidden="true">
                        <video
                            ref={heroVideoRef}
                            className="hero__video"
                            src={heroVideoSrc}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            poster={heroImages[0] || ''}
                            onLoadedData={() => {
                                if (heroVideoRef.current) {
                                    heroVideoRef.current.muted = true
                                    heroVideoRef.current.playbackRate = heroVideoPlaybackRate
                                    heroVideoRef.current.play().catch(() => {})
                                }
                            }}
                        />
                    </div>
                )}
                {/* سلايدر صور الهيرو معطّل — أزل الكومنت لتفعيل السلايدر عند إلغاء الفيديو
                {!heroVideoSrc && (
                    <div className="hero__slider" aria-hidden="true">
                        {heroImages.map((img, i) => (
                            <div
                                key={i}
                                className={`hero__slide ${i === currentImageIndex ? 'hero__slide--active' : ''}`}
                                style={{ backgroundImage: `url(${img})` }}
                            />
                        ))}
                    </div>
                )}
                */}
                <div className="hero__slider-overlay" />

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

            {/* ── News & Updates ────────────────────────── */}
            <section className="news-section">
                <div className="container">
                    <div className="news-section__header">
                        <span className="news-section__label">{t('news.badge')}</span>
                        <h2 className="news-section__heading">{t('news.title')}</h2>
                    </div>

                    {/* سلايدر الصورة الكبيرة */}
                    <div className="news-featured-slider">
                        <div
                            className="news-featured-slider__track"
                            style={{ transform: `translateX(-${currentFeaturedIndex * 100}%)` }}
                        >
                            {newsItems.map((item, i) => (
                                <div key={item.id} className="news-featured-slider__slide">
                                    <article className="news-featured">
                                        <a href={item.link} className="news-featured__media">
                                            <div
                                                className="news-featured__image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />
                                            <div className="news-featured__overlay">
                                                <time className="news-featured__date">{t(item.dateKey)}</time>
                                                <h3 className="news-featured__title">{t(item.titleKey)}</h3>
                                                <p className="news-featured__excerpt">{t(item.excerptKey)}</p>
                                            </div>
                                        </a>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* سلايدر: 3 بطاقات ظاهرة، الانزلاق يكشف الرابعة */}
                    <div className="news-tiles-slider">
                        <div
                            className="news-tiles-slider__track"
                            style={{
                                transform: `translateX(-${currentTileIndex * (isNarrow ? 100 : 100 / 3)}%)`,
                            }}
                        >
                            {newsItems.map((item) => (
                                <div key={item.id} className="news-tiles-slider__slide">
                                    <article className="news-tile">
                                        <a href={item.link} className="news-tile__link">
                                            <div
                                                className="news-tile__image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />
                                            <div className="news-tile__overlay">
                                                <time className="news-tile__date">{t(item.dateKey)}</time>
                                                <h3 className="news-tile__title">{t(item.titleKey)}</h3>
                                                <span className="news-tile__read">{t('news.readMore')} →</span>
                                            </div>
                                        </a>
                                    </article>
                                </div>
                            ))}
                        </div>
                        <div className="news-tiles-slider__dots" aria-hidden="true">
                            {Array.from({
                                length: isNarrow ? newsItems.length : Math.max(1, newsItems.length - 2),
                            }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`news-tiles-slider__dot ${i === currentTileIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentTileIndex(i)}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="news-section__footer">
                        <NavLink to="/contact" className="news-section__cta">{t('news.viewAll')}</NavLink>
                    </div>
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
