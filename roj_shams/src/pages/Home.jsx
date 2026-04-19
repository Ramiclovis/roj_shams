import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faBook, faHeartbeat, faUsers, faLeaf, faPlay, faCreditCard, faBuildingColumns, faTruckMedical, faDollarSign, faPeopleGroup, faChevronLeft, faChevronRight, faHandHoldingHeart, faGraduationCap, faHospital, faStar, faHandshake, faGlobe, faChild, faHome, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebookF, faYoutube, faLinkedinIn, faPaypal } from '@fortawesome/free-brands-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import '../assets/components/Home.css'
import heroVideoFile from '../assets/VIDEO/2.MP4'

/* صور الهيرو (سلايدر عند عدم وجود فيديو) — معطّلة بالكومنت؛ أزل الكومنت وأعد السلايدر إن رغبت
const heroImages = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1600&auto=format&fit=crop',
]
*/
const heroImages = [] /* فارغ لأن السلايدر معطّل */

/* فيديو الهيرو — يظهر داخل قسم الهيرو مع تشغيل بطيء (سلو موشن) */
const heroVideoSrc = heroVideoFile
const heroVideoPlaybackRate = 0.5

const ICON_MAP = {
    faBullseye, faBook, faHeartbeat, faUsers, faLeaf, faTruckMedical,
    faHandHoldingHeart, faGraduationCap, faHospital, faStar,
    faHandshake, faGlobe, faChild, faHome, faChartLine,
}

const founders = [
    { name: 'Rasha Hayel Mousa', initials: 'RH', roleKey: 'founders.role' },
    { name: 'Nadia Omar Salim', initials: 'NO', roleKey: 'founders.role' },
    { name: 'Judy Badr Hassan', initials: 'JB', roleKey: 'founders.role' },
    { name: 'Mohi Al-Din Sa\'dou', initials: 'MS', roleKey: 'founders.role' },
    { name: 'Dr. Carmen Hassan Ibrahim', initials: 'CH', roleKey: 'founders.role' },
    { name: 'Ms. Lilas Ibrahim Salim', initials: 'LI', roleKey: 'founders.role' },
    { name: 'Lawyer Doaa Al-Jazmati', initials: 'DA', roleKey: 'founders.role' },
]

function MiddleEastMap({ isRtl }) {
    /*
     * In LTR (English) the green overlay covers the LEFT half → Syria (x≈159-256
     * out of 600) would be hidden.  Shifting the viewBox left by 141 units puts
     * Syria's left edge at exactly 50 % of any container width so the pin is
     * always in the transparent right half.
     * In RTL (Arabic)  the overlay covers the RIGHT half → Syria at the normal
     * left-of-centre position is already in the transparent left half.
     */
    const vb = isRtl ? '0 0 600 400' : '-141 0 600 400'
    return (
        <svg
            viewBox={vb}
            preserveAspectRatio="xMidYMin slice"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
            aria-hidden="true"
        >
            <defs>
                <style>{`
                    @keyframes map-pin-pulse {
                        0%  { transform: scale(1);   opacity: 0.55; }
                        100%{ transform: scale(3);   opacity: 0;    }
                    }
                    .mp1 { animation: map-pin-pulse 2.2s ease-out infinite;       transform-box: fill-box; transform-origin: center; }
                    .mp2 { animation: map-pin-pulse 2.2s ease-out 1s infinite;    transform-box: fill-box; transform-origin: center; }
                `}</style>
            </defs>

            {/* Ocean — wide rect covers any viewBox shift */}
            <rect x="-300" width="1200" height="400" fill="#0d2b45" />

            {/* Country fills */}
            <g fill="#1b3a28" stroke="#0a1e12" strokeWidth="0.8">
                {/* Turkey */}
                <path d="M 7,99 L 7,16 L 285,16 L 285,64 L 256,85 L 170,87 L 74,85 L 14,92 Z" />
                {/* Iraq */}
                <path d="M 208,136 L 256,85 L 285,83 L 353,127 L 353,182 L 323,196 L 286,196 L 256,182 L 240,162 L 194,140 Z" />
                {/* Iran */}
                <path d="M 285,64 L 353,58 L 495,58 L 570,86 L 570,238 L 465,252 L 377,224 L 353,182 L 285,83 Z" />
                {/* Jordan */}
                <path d="M 149,148 L 194,148 L 188,196 L 147,188 Z" />
                {/* Lebanon */}
                <path d="M 151,126 L 159,141 L 173,133 L 173,126 L 163,119 Z" />
                {/* Israel / Palestine */}
                <path d="M 141,170 L 159,141 L 151,141 L 141,188 Z" />
                {/* Saudi Arabia */}
                <path d="M 194,148 L 256,182 L 286,196 L 323,196 L 452,295 L 272,350 L 178,308 L 165,308 L 165,210 L 181,196 Z" />
                {/* Kuwait */}
                <path d="M 323,182 L 353,182 L 353,203 L 323,203 Z" />
                {/* Egypt (northern) */}
                <path d="M 0,168 L 141,188 L 165,210 L 165,310 L 0,310 Z" />
            </g>

            {/* Syria — highlighted */}
            <path
                d="M 160,104 L 160,89 L 170,87 L 194,85 L 232,85 L 256,85
                   L 256,100 L 250,127 L 243,133 L 225,133 L 208,136
                   L 194,148 L 163,148 L 159,141 L 163,119 Z"
                fill="#2d6a4f"
                stroke="#52b788"
                strokeWidth="1.5"
            />

            {/* Pulse rings on the pin */}
            <circle cx="207" cy="96" r="13" fill="#f0a500" className="mp1" />
            <circle cx="207" cy="96" r="13" fill="#f0a500" className="mp2" />

            {/* Location pin — tip ≈ centre of Syria */}
            <path
                d="M 207,74 C 197,74 189,82 189,92
                   C 189,104 207,126 207,126
                   C 207,126 225,104 225,92
                   C 225,82 217,74 207,74 Z"
                fill="#f0a500"
                stroke="#b8780a"
                strokeWidth="1.5"
            />
            <circle cx="207" cy="91" r="6" fill="white" />

            {/* Syria label */}
            <text x="207" y="141" textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.55)"
                fontFamily="Arial,sans-serif" letterSpacing="1.8">SYRIA</text>
        </svg>
    )
}

export default function Home() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
    const [currentTileIndex, setCurrentTileIndex] = useState(0)
    const [objectives, setObjectives] = useState([])
    const [activeObjective, setActiveObjective] = useState(null)
    const [activitiesInView, setActivitiesInView] = useState(false)
    const [wwdInView, setWwdInView] = useState(false)
    const [newsInView, setNewsInView] = useState(false)
    const [isNarrow, setIsNarrow] = useState(false)
    const [promiseInView, setPromiseInView] = useState(false)
    const [promisePercent, setPromisePercent] = useState(0)
    const [whereWeAreInView, setWhereWeAreInView] = useState(false)
    const [newsItems, setNewsItems] = useState([])
    const [newsImageTick, setNewsImageTick] = useState(0)
    const activitiesRef = useRef(null)
    const wwdRef = useRef(null)
    const newsRef = useRef(null)
    const heroVideoRef = useRef(null)
    const promiseRef = useRef(null)
    const whereWeAreRef = useRef(null)
    const { t, lang } = useLanguage()
    const isRtl = lang === 'AR'
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const featuredCount = newsItems.length
    const tileItems = newsItems.filter((_, idx) => idx !== currentFeaturedIndex)
    const tileMaxIndex = isNarrow ? Math.max(0, tileItems.length - 1) : Math.max(0, tileItems.length - 3)
    const prevFeatured = () => {
        if (!featuredCount) return
        setCurrentFeaturedIndex((prev) => (prev - 1 + featuredCount) % featuredCount)
    }
    const nextFeatured = () => {
        if (!featuredCount) return
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredCount)
    }
    const prevTiles = () => {
        if (!tileMaxIndex) return
        setCurrentTileIndex((prev) => (prev - 1 + tileMaxIndex + 1) % (tileMaxIndex + 1))
    }
    const nextTiles = () => {
        if (!tileMaxIndex) return
        setCurrentTileIndex((prev) => (prev + 1) % (tileMaxIndex + 1))
    }
    const resolveMediaUrl = (url) => {
        if (!url || typeof url !== 'string') return ''
        const trimmed = url.trim()
        if (!trimmed) return ''
        const baseOrigin = (API_BASE.replace(/\/api\/?$/, '')).replace(/\/$/, '')
        if (/^((uploads\/)?news\/images|(uploads\/)?news\/videos)\//i.test(trimmed)) {
            return `${baseOrigin}/storage/${trimmed}`
        }
        if (trimmed.startsWith('data:')) return trimmed
        if (/^https?:\/\//i.test(trimmed)) {
            try {
                const parsed = new URL(trimmed)
                if (parsed.pathname.startsWith('/storage/') && parsed.origin !== baseOrigin) {
                    return `${baseOrigin}${parsed.pathname}${parsed.search || ''}`
                }
            } catch { }
            return trimmed
        }
        return `${baseOrigin}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`
    }
    const formatDate = (value) => {
        if (!value) return '—'
        const d = new Date(value)
        if (Number.isNaN(d.getTime())) return value
        return d.toLocaleDateString(lang === 'AR' ? 'ar-EG' : 'en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    useEffect(() => {
        let mounted = true
            ; (async () => {
                try {
                    const res = await fetch(`${API_BASE}/news?active_only=1`, {
                        headers: { Accept: 'application/json' },
                    })
                    if (!res.ok) throw new Error('failed')
                    const data = await res.json()
                    if (!mounted) return
                    const mapped = (Array.isArray(data) ? data : []).map((n) => ({
                        id: n.id,
                        image: resolveMediaUrl(Array.isArray(n.images) && n.images.length ? n.images[0] : ''),
                        images: (Array.isArray(n.images) ? n.images : []).map(resolveMediaUrl).filter(Boolean),
                        videoUrl: resolveMediaUrl(Array.isArray(n.videos) && n.videos.length ? n.videos[0] : ''),
                        dateLabel: formatDate(n.date),
                        titleLabel: lang === 'AR' ? (n.title_ar || n.title_en) : (n.title_en || n.title_ar),
                        excerptLabel: lang === 'AR' ? (n.excerpt_ar || n.excerpt_en) : (n.excerpt_en || n.excerpt_ar),
                    }))
                    setNewsItems(mapped)
                    setCurrentFeaturedIndex(0)
                    setCurrentTileIndex(0)
                } catch {
                    if (mounted) setNewsItems([])
                }
            })()
        return () => { mounted = false }
    }, [lang])

    useEffect(() => {
        let mounted = true
        fetch(`${API_BASE}/objectives?active_only=1`, {
            headers: { Accept: 'application/json' },
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                if (!mounted) return
                setObjectives((Array.isArray(data) ? data : []).map(o => ({
                    id: o.id,
                    icon: ICON_MAP[o.icon_name] || ICON_MAP[o.iconName] || faBullseye,
                    titleAr: o.title_ar || o.titleAr || '',
                    titleEn: o.title_en || o.titleEn || '',
                    needsAr: o.needs_ar || o.needsAr || '',
                    needsEn: o.needs_en || o.needsEn || '',
                    workAr: o.work_ar || o.workAr || '',
                    workEn: o.work_en || o.workEn || '',
                })))
            })
            .catch(() => { if (mounted) setObjectives([]) })
        return () => { mounted = false }
    }, [])

    useEffect(() => {
        const mql = window.matchMedia('(max-width: 900px)')
        const handle = () => setIsNarrow(mql.matches)
        mql.addEventListener('change', handle)
        handle()
        return () => mql.removeEventListener('change', handle)
    }, [])

    useEffect(() => {
        if (!tileItems.length) return
        const maxIndex = isNarrow ? tileItems.length - 1 : Math.max(0, tileItems.length - 3)
        setCurrentTileIndex((prev) => Math.min(prev, maxIndex))
    }, [isNarrow, tileItems.length])

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
        const el = newsRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setNewsInView(true)
            },
            { threshold: 0.15 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const el = whereWeAreRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setWhereWeAreInView(true)
            },
            { threshold: 0.2 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    /* أنيميشن نسبة Our Promise من 0 إلى 95 عند ظهور القسم */
    const PROMISE_TARGET = 95
    useEffect(() => {
        const el = promiseRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setPromiseInView(true)
            },
            { threshold: 0.3 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])
    useEffect(() => {
        if (!promiseInView) return
        const duration = 1800
        const start = performance.now()
        const step = (now) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 2)
            setPromisePercent(Math.round(easeOut * PROMISE_TARGET))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [promiseInView])

    useEffect(() => {
        if (!tileItems.length) return
        const maxIndex = isNarrow ? tileItems.length - 1 : Math.max(0, tileItems.length - 3)
        const interval = setInterval(() => {
            setCurrentTileIndex((prev) => (prev + 1) % (maxIndex + 1))
        }, 4500)
        return () => clearInterval(interval)
    }, [isNarrow, tileItems.length])

    useEffect(() => {
        if (!newsItems.length) return
        const interval = setInterval(() => {
            setCurrentFeaturedIndex((prev) => (prev + 1) % newsItems.length)
        }, 4500)
        return () => clearInterval(interval)
    }, [newsItems.length])

    // تبديل صور الخبر نفسه تلقائياً إذا كان يحتوي أكثر من صورة
    useEffect(() => {
        if (!newsItems.length) return
        const hasMultiImages = newsItems.some((item) => (item.images?.length || 0) > 1)
        if (!hasMultiImages) return
        const interval = setInterval(() => {
            setNewsImageTick((prev) => prev + 1)
        }, 2600)
        return () => clearInterval(interval)
    }, [newsItems])

    /* تشغيل الفيديو في الهيرو — سرعة + تشغيل تلقائي ومساعدة Safari */
    useEffect(() => {
        if (!heroVideoSrc) return
        const video = heroVideoRef.current
        if (!video) return
        video.muted = true
        video.setAttribute('playsinline', 'true')
        video.setAttribute('webkit-playsinline', 'true')
        const start = () => {
            video.muted = true
            video.playbackRate = heroVideoPlaybackRate
            video.play().catch(() => { })
        }
        video.addEventListener('loadeddata', start)
        video.addEventListener('canplay', start)
        if (video.readyState >= 2) start()
        const onInteraction = () => {
            video.muted = true
            video.play().catch(() => { })
            document.removeEventListener('touchstart', onInteraction)
            document.removeEventListener('click', onInteraction)
        }
        document.addEventListener('touchstart', onInteraction, { once: true, passive: true })
        document.addEventListener('click', onInteraction, { once: true })
        return () => {
            video.removeEventListener('loadeddata', start)
            video.removeEventListener('canplay', start)
            document.removeEventListener('touchstart', onInteraction)
            document.removeEventListener('click', onInteraction)
        }
    }, [heroVideoSrc])

    return (
        <div className="home">
            {/* ── Hero ─────────────────────────────────── */}
            <section className="hero">
                {/* خلفية الفيديو — من public/2.mp4 */}
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
                    />
                </div>
                <div className="hero__slider-overlay" />

                <div className="container hero__content">
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
                        <a href="https://www.instagram.com/shamsroj?igsh=cW9leDhtN2hwYnRk&utm_source=gr" target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="Instagram">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://www.facebook.com/share/18HJjbiDib/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="Facebook">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="https://youtube.com/@shamsroj?si=8sD7om21k54hPSfg" target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="YouTube">
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
                            const label = lang === 'AR' ? (obj.titleAr || obj.titleEn) : (obj.titleEn || obj.titleAr)
                            return (
                                <button
                                    key={obj.id ?? i}
                                    className={`activity-btn ${activeObjective === i ? 'active' : ''}`}
                                    onClick={() => setActiveObjective(activeObjective === i ? null : i)}
                                >
                                    <div className="activity-icon-wrapper">
                                        <FontAwesomeIcon icon={obj.icon} className="activity-icon" />
                                    </div>
                                    <span className="activity-label">{label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className={`activity-details-wrapper ${activeObjective !== null ? 'open' : ''}`}>
                    {activeObjective !== null && objectives[activeObjective] && (() => {
                        const obj = objectives[activeObjective]
                        const title = lang === 'AR' ? (obj.titleAr || obj.titleEn) : (obj.titleEn || obj.titleAr)
                        const needs = lang === 'AR' ? (obj.needsAr || obj.needsEn) : (obj.needsEn || obj.needsAr)
                        const work = lang === 'AR' ? (obj.workAr || obj.workEn) : (obj.workEn || obj.workAr)
                        return (
                            <div className="container activity-details animate-fade-in">
                                <div className="activity-details-left">
                                    <div className="activity-details-title-row">
                                        <div className="activity-details-icon-large">
                                            <FontAwesomeIcon icon={obj.icon} />
                                        </div>
                                        <h3>{title}</h3>
                                    </div>
                                </div>
                                <div className="activity-details-right">
                                    <h4>{t('activities.urgentNeeds')}</h4>
                                    <p>{needs}</p>
                                    <h4>{t('activities.ourWork')}</h4>
                                    <p>{work}</p>
                                </div>
                            </div>
                        )
                    })()}
                </div>
            </section>

            {/* ── News & Updates ────────────────────────── */}
            <section ref={newsRef} className={`news-section ${newsInView ? 'news-section--in-view' : ''}`}>
                <div className="container">
                    <div className="news-section__header">
                        <span className="news-section__label">{t('news.badge')}</span>
                        <h2 className="news-section__heading">{t('news.title')}</h2>
                        <p className="news-section__lead">{t('news.pageLead')}</p>
                    </div>

                    {/* سلايدر الصورة الكبيرة */}
                    <div className="news-featured-slider">
                        <div
                            className="news-featured-slider__track"
                            style={{
                                transform: `translateX(${isRtl ? currentFeaturedIndex * 100 : -currentFeaturedIndex * 100}%)`,
                            }}
                        >
                            {newsItems.map((item, i) => {
                                const imgList = item.images?.length ? item.images : (item.image ? [item.image] : [])
                                const currentImage = imgList.length ? imgList[newsImageTick % imgList.length] : ''
                                return (
                                    <div key={item.id} className="news-featured-slider__slide">
                                        <article className={`news-featured ${item.videoUrl ? 'news-featured--has-video' : ''}`}>
                                            <NavLink to={`/news/${item.id}`} className="news-featured__media">
                                                <div
                                                    className="news-featured__image"
                                                    style={{ backgroundImage: `url(${currentImage || item.image})` }}
                                                />
                                                {item.videoUrl && (
                                                    <span className="news-featured__play" aria-hidden="true">
                                                        <FontAwesomeIcon icon={faPlay} />
                                                    </span>
                                                )}
                                                {item.videoUrl && (
                                                    <span className="news-featured__video-badge">{t('news.videoLabel')}</span>
                                                )}
                                                <div className="news-featured__overlay">
                                                    <time className="news-featured__date">{item.dateLabel || '—'}</time>
                                                    <h3 className="news-featured__title">{item.titleLabel}</h3>
                                                    <p className="news-featured__excerpt">{item.excerptLabel}</p>
                                                </div>
                                            </NavLink>
                                        </article>
                                    </div>
                                )
                            })}
                        </div>
                        {featuredCount > 1 && (
                            <>
                                <button type="button" className="news-slider__arrow news-slider__arrow--prev" onClick={prevFeatured} aria-label="Previous featured news">
                                    <FontAwesomeIcon icon={isRtl ? faChevronRight : faChevronLeft} />
                                </button>
                                <button type="button" className="news-slider__arrow news-slider__arrow--next" onClick={nextFeatured} aria-label="Next featured news">
                                    <FontAwesomeIcon icon={isRtl ? faChevronLeft : faChevronRight} />
                                </button>
                                <div className="news-featured-slider__dots" aria-hidden="true">
                                    {newsItems.map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className={`news-featured-slider__dot ${i === currentFeaturedIndex ? 'active' : ''}`}
                                            onClick={() => setCurrentFeaturedIndex(i)}
                                            aria-label={`Featured slide ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* سلايدر: 3 بطاقات ظاهرة، الانزلاق يكشف الرابعة */}
                    {tileItems.length > 0 && (
                        <div className="news-tiles-slider">
                            <div
                                className="news-tiles-slider__track"
                                style={{
                                    transform: `translateX(${isRtl ? currentTileIndex * (isNarrow ? 100 : 100 / 3) : -currentTileIndex * (isNarrow ? 100 : 100 / 3)}%)`,
                                }}
                            >
                                {tileItems.map((item) => {
                                    const imgList = item.images?.length ? item.images : (item.image ? [item.image] : [])
                                    const currentImage = imgList.length ? imgList[newsImageTick % imgList.length] : ''
                                    return (
                                        <div key={item.id} className="news-tiles-slider__slide">
                                            <article className={`news-tile ${item.videoUrl ? 'news-tile--has-video' : ''}`}>
                                                <NavLink to={`/news/${item.id}`} className="news-tile__link">
                                                    <div className="news-tile__media">
                                                        <div
                                                            className="news-tile__image"
                                                            style={{ backgroundImage: `url(${currentImage || item.image})` }}
                                                        />
                                                        {item.videoUrl && (
                                                            <span className="news-tile__play" aria-hidden="true">
                                                                <FontAwesomeIcon icon={faPlay} />
                                                            </span>
                                                        )}
                                                        {item.videoUrl && (
                                                            <span className="news-tile__video-badge">{t('news.videoLabel')}</span>
                                                        )}
                                                    </div>
                                                    <div className="news-tile__overlay">
                                                        <time className="news-tile__date">{item.dateLabel || '—'}</time>
                                                        <h3 className="news-tile__title">{item.titleLabel}</h3>
                                                        <span className="news-tile__read">{t('news.readMore')} →</span>
                                                    </div>
                                                </NavLink>
                                            </article>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="news-tiles-slider__dots" aria-hidden="true">
                                {Array.from({
                                    length: isNarrow ? tileItems.length : Math.max(1, tileItems.length - 2),
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
                            {tileMaxIndex > 0 && (
                                <>
                                    <button type="button" className="news-slider__arrow news-slider__arrow--prev news-slider__arrow--tiles" onClick={prevTiles} aria-label="Previous news cards">
                                        <FontAwesomeIcon icon={isRtl ? faChevronRight : faChevronLeft} />
                                    </button>
                                    <button type="button" className="news-slider__arrow news-slider__arrow--next news-slider__arrow--tiles" onClick={nextTiles} aria-label="Next news cards">
                                        <FontAwesomeIcon icon={isRtl ? faChevronLeft : faChevronRight} />
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    <div className="news-section__footer">
                        <NavLink to="/news" className="news-section__cta">{t('news.viewAll')}</NavLink>
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
                            <NavLink to="/objectives" className="wwd-panel__btn">
                                {t('whatWeDo.learnMore')}
                            </NavLink>
                        </div>
                    </div>
                    {/* Right half: clear image, no overlay */}
                    <div className="wwd-panel__right" />
                </div>
            </section>

            {/* ── Donations impact (infographic) ──────────── */}
            <section className="donations-impact">
                <div className="container donations-impact__inner">
                    <h2 className="donations-impact__title">{t('donationsImpact.title')}</h2>
                    <div className="donations-impact__stats">
                        <div className="donations-impact__circle donations-impact__circle--left">
                            <div className="donations-impact__icon-wrap">
                                <FontAwesomeIcon icon={faDollarSign} className="donations-impact__icon" />
                            </div>
                            <span className="donations-impact__value">{t('donationsImpact.amount')}</span>
                            <span className="donations-impact__label">{t('donationsImpact.amountLabel')}</span>
                        </div>
                        <div className="donations-impact__connector" aria-hidden="true" />
                        <div className="donations-impact__circle donations-impact__circle--right">
                            <div className="donations-impact__icon-wrap">
                                <FontAwesomeIcon icon={faPeopleGroup} className="donations-impact__icon" />
                            </div>
                            <span className="donations-impact__value">{t('donationsImpact.peopleCount')}</span>
                            <span className="donations-impact__label">{t('donationsImpact.peopleLabel')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Where we are ───────────────────────────── */}
            <section className={`where-we-are ${whereWeAreInView ? 'where-we-are--in-view' : ''}`} ref={whereWeAreRef}>
                <div className="where-we-are__strip" aria-hidden="true" />
                <div className="where-we-are__map-wrap">
                    <MiddleEastMap isRtl={isRtl} />
                </div>
                <div className="container where-we-are__inner">
                    <div className="where-we-are__content">
                        <h2 className="where-we-are__title">{t('whereWeAre.title')}</h2>
                        <p className="where-we-are__text">{t('whereWeAre.text')}</p>
                        <NavLink to="/contact" className="where-we-are__btn">
                            {t('whereWeAre.learnMore')}
                        </NavLink>
                    </div>
                </div>
            </section>

            {/* ── Our Promise ── تبرعات + 90% + طرق الدفع */}
            <section className="promise-section" ref={promiseRef}>
                <div className="promise-section__accent" aria-hidden="true" />
                <div className="container promise-section__container">
                    <span className="promise-section__badge">{t('promise.badge')}</span>
                    <h2 className="promise-section__title">{t('promise.title')}</h2>
                    <p className="promise-section__text">{t('promise.text')}</p>
                    <div className="promise-section__circle-wrap">
                        <div
                            className="promise-section__circle"
                            style={{ '--promise-deg': (promisePercent / 100) * 360 + 'deg' }}
                            aria-hidden="true"
                        >
                            <span className="promise-section__percent">{t('promise.percent')}</span>
                        </div>
                    </div>
                    <div className="promise-section__payments">

                        <div className="promise-section__payment">
                            <div className="promise-section__payment-icon">
                                <FontAwesomeIcon icon={faBuildingColumns} />
                            </div>
                            <span className="promise-section__payment-name">CHAM BANK</span>
                            <span className="promise-section__payment-desc">{t('promise.CHAM BANK')}</span>
                            <span className="promise-section__payment-detail">{t('promise.CHAM BANKNumber')}</span>
                        </div>

                    </div>
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
