import { useState, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBullseye, faBook, faHeartbeat, faUsers, faLeaf, faTruckMedical,
  faHandHoldingHeart, faGraduationCap, faHospital, faStar,
  faHandshake, faGlobe, faChild, faHome, faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import '../assets/components/WhatWeDoDetail.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const ICON_MAP = {
  faBullseye, faBook, faHeartbeat, faUsers, faLeaf, faTruckMedical,
  faHandHoldingHeart, faGraduationCap, faHospital, faStar,
  faHandshake, faGlobe, faChild, faHome, faChartLine,
}

function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  const baseOrigin = (API_BASE.replace(/\/api\/?$/, '')).replace(/\/$/, '')
  if (/^((uploads\/)?news\/images|(uploads\/)?news\/videos|(uploads\/)?objectives\/images|(uploads\/)?objectives\/videos)\//i.test(trimmed)) {
    return `${baseOrigin}/storage/${trimmed}`
  }
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed)
      if (parsed.pathname.startsWith('/storage/') && parsed.origin !== baseOrigin) {
        return `${baseOrigin}${parsed.pathname}${parsed.search || ''}`
      }
    } catch {}
    return trimmed
  }
  return `${baseOrigin}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`
}

function normalize(item) {
  const actsAr = Array.isArray(item.activities_ar || item.activitiesAr)
    ? (item.activities_ar || item.activitiesAr) : []
  const actsEn = Array.isArray(item.activities_en || item.activitiesEn)
    ? (item.activities_en || item.activitiesEn) : []
  return {
    id:           item.id,
    iconName:     item.icon_name    || item.iconName    || 'faBullseye',
    titleAr:      item.title_ar     || item.titleAr     || '',
    titleEn:      item.title_en     || item.titleEn     || '',
    needsAr:      item.needs_ar     || item.needsAr     || '',
    needsEn:      item.needs_en     || item.needsEn     || '',
    workAr:       item.work_ar      || item.workAr      || '',
    workEn:       item.work_en      || item.workEn      || '',
    activitiesAr: actsAr.filter(Boolean),
    activitiesEn: actsEn.filter(Boolean),
    images:       (Array.isArray(item.images) ? item.images : []).map(resolveMediaUrl).filter(Boolean),
    videos:       (Array.isArray(item.videos) ? item.videos : []).map(resolveMediaUrl).filter(Boolean),
    active:       item.active !== false,
  }
}

function getYouTubeEmbedUrl(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '').trim()
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes('youtube.com')) {
      const idFromQuery = u.searchParams.get('v')
      if (idFromQuery) return `https://www.youtube.com/embed/${idFromQuery}`
      const parts = u.pathname.split('/').filter(Boolean)
      const idFromPath = parts[parts.length - 1]
      if (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') {
        return idFromPath ? `https://www.youtube.com/embed/${idFromPath}` : null
      }
      return idFromPath ? `https://www.youtube.com/embed/${idFromPath}` : null
    }
    return null
  } catch {
    return null
  }
}

export default function WhatWeDoDetail() {
  const { id } = useParams()
  const { t, lang } = useLanguage()
  const [objective, setObjective] = useState(null)
  const [loading, setLoading] = useState(true)
  const [videoOrientations, setVideoOrientations] = useState({})

  const handleVideoMeta = (idx, e) => {
    const { videoWidth, videoHeight } = e.target
    if (!videoWidth || !videoHeight) return
    setVideoOrientations(prev => ({
      ...prev,
      [idx]: videoHeight > videoWidth ? 'portrait' : 'landscape',
    }))
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    fetch(`${API_BASE}/objectives/${id}`, {
      headers: { Accept: 'application/json' },
    })
      .then(r => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(data => setObjective(normalize(data)))
      .catch(() => setObjective(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="what-we-do-detail-page">
        <section className="page-hero">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              جاري التحميل...
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!objective) {
    return (
      <div className="what-we-do-detail-page">
        <section className="page-hero">
          <div className="container">
            <div className="badge">{t('whatWeDo.title')}</div>
            <h1>{t('news.notFoundTitle') || 'Not found'}</h1>
            <p>{t('news.notFoundText') || 'This item does not exist.'}</p>
            <NavLink to="/objectives" className="btn btn-primary">
              {t('nav.back')}
            </NavLink>
          </div>
        </section>
      </div>
    )
  }

  const icon = ICON_MAP[objective.iconName] || faBullseye
  const title = lang === 'ar' ? (objective.titleAr || objective.titleEn) : (objective.titleEn || objective.titleAr)
  const needs = lang === 'ar' ? (objective.needsAr || objective.needsEn) : (objective.needsEn || objective.needsAr)
  const work  = lang === 'ar' ? (objective.workAr  || objective.workEn)  : (objective.workEn  || objective.workAr)
  const acts  = lang === 'ar'
    ? objective.activitiesAr.filter(Boolean)
    : objective.activitiesEn.filter(Boolean)
  const images    = objective.images
  const videos    = objective.videos
  const hasImages = images.length > 0
  const hasVideos = videos.length > 0

  return (
    <div className="what-we-do-detail-page">
      <section className="wwd-detail-hero">
        <div className="wwd-container-fluid wwd-detail-hero__container">
          <div className="wwd-detail-hero__grid">
            <div className="wwd-detail-hero__main">
              <div className="wwd-detail-hero__badge">
                <div className="badge">{t('whatWeDo.title')}</div>
              </div>
              <div className="wwd-detail-hero__title-row">
                <div className="wwd-detail-hero__icon" aria-hidden="true">
                  <FontAwesomeIcon icon={icon} />
                </div>
                <div>
                  <h1 className="wwd-detail-hero__title">{title}</h1>
                  <p className="wwd-detail-hero__lead">{needs}</p>
                </div>
              </div>
            </div>

            <aside className="wwd-detail-hero__aside" aria-label="Actions">
              <div className="wwd-detail-aside-card">
                <p className="wwd-detail-aside-card__kicker">{t('hero.getInvolved') || 'Get involved'}</p>
                <h2 className="wwd-detail-aside-card__title">{t('contact.title') || 'Contact'}</h2>
                <p className="wwd-detail-aside-card__text">
                  {t('contact.lead') || 'If you want to support this activity or learn more, reach out to us.'}
                </p>
                <div className="wwd-detail-aside-card__actions">
                  <NavLink to="/contact" className="btn btn-primary">{t('hero.getInvolved')}</NavLink>
                  <NavLink to="/objectives" className="btn btn-secondary">{t('nav.back')}</NavLink>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wwd-container-fluid">
          <article className="wwd-surface wwd-surface--full">
            <header className="wwd-surface__header">
              <h2 className="wwd-surface__title">{t('activities.ourWork')}</h2>
              <p className="wwd-surface__subtitle">{title}</p>
            </header>

            {work && <p className="wwd-prose">{work}</p>}

            {acts.length > 0 && (
              <section className="wwd-section" aria-label="Activities list">
                <h3 className="wwd-section__title">{lang === 'ar' ? 'الأنشطة' : 'Activities'}</h3>
                <ul className="wwd-list">
                  {acts.map((a, idx) => (
                    <li key={idx} className="wwd-list__item">
                      <span className="wwd-list__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span className="wwd-list__text">{a}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="wwd-media" aria-label="Media">
              {!hasImages && !hasVideos && (
                <div className="wwd-media__empty">
                  <div className="wwd-media__empty-icon" aria-hidden="true">🖼️</div>
                  <h3 className="wwd-media__empty-title">
                    {lang === 'ar' ? 'لا توجد صور أو فيديو حاليا' : 'No photos or videos yet'}
                  </h3>
                  <p className="wwd-media__empty-text">
                    {lang === 'ar'
                      ? 'قم بإضافة وسائط من لوحة التحكم للعرض هنا.'
                      : 'Add media from the admin panel to show it here.'}
                  </p>
                </div>
              )}

              {/* ── Image gallery ── */}
              {hasImages && (
                <div className="wwd-gallery-section">
                  <div className="wwd-gallery-header">
                    <span className="wwd-gallery-header__icon">📷</span>
                    <h3 className="wwd-gallery-header__title">
                      {lang === 'ar' ? 'الصور' : 'Photos'}
                      <span className="wwd-gallery-header__count"> ({images.length})</span>
                    </h3>
                  </div>
                  <div className={`wwd-gallery wwd-gallery--${Math.min(images.length, 4)}`}>
                    {images.map((src, idx) => (
                      <div className="wwd-gallery__item" key={idx}>
                        <img
                          className="wwd-gallery__img"
                          src={src}
                          alt={`${title} ${idx + 1}`}
                          loading="lazy"
                          onError={e => { e.target.parentElement.style.display = 'none' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Videos ── */}
              {hasVideos && (
                <div className="wwd-videos-section">
                  <div className="wwd-gallery-header">
                    <span className="wwd-gallery-header__icon">🎬</span>
                    <h3 className="wwd-gallery-header__title">
                      {lang === 'ar' ? 'الفيديوهات' : 'Videos'}
                      <span className="wwd-gallery-header__count"> ({videos.length})</span>
                    </h3>
                  </div>
                  <div className="wwd-videos-grid">
                    {videos.map((urlOrSrc, idx) => {
                      const youtubeEmbed = getYouTubeEmbedUrl(urlOrSrc)
                      const isFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(String(urlOrSrc))
                      const orientation = videoOrientations[idx] || 'landscape'
                      const itemClass = isFile
                        ? `wwd-video-item wwd-video-item--file wwd-video-item--${orientation}`
                        : 'wwd-video-item wwd-video-item--embed'
                      return (
                        <div className={itemClass} key={idx}>
                          {youtubeEmbed ? (
                            <iframe
                              className="wwd-video-item__frame"
                              src={youtubeEmbed}
                              title={`${title} - video ${idx + 1}`}
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          ) : isFile ? (
                            <video
                              className="wwd-video-item__player"
                              controls
                              preload="metadata"
                              src={urlOrSrc}
                              onLoadedMetadata={(e) => handleVideoMeta(idx, e)}
                            >
                              {lang === 'ar' ? 'متصفحك لا يدعم تشغيل الفيديو.' : 'Your browser does not support video.'}
                            </video>
                          ) : (
                            <iframe
                              className="wwd-video-item__frame"
                              src={urlOrSrc}
                              title={`${title} - video ${idx + 1}`}
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </section>
          </article>
        </div>
      </section>
    </div>
  )
}
