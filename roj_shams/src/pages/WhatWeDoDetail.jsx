import { NavLink, useParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBullseye, faBook, faHeartbeat, faUsers, faLeaf, faTruckMedical,
  faHandHoldingHeart, faGraduationCap, faHospital, faStar,
  faHandshake, faGlobe, faChild, faHome, faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../context/LanguageContext'
import { objectivesBase } from '../data/objectivesData'
import '../assets/components/WhatWeDoDetail.css'

const ICON_MAP = {
  faBullseye, faBook, faHeartbeat, faUsers, faLeaf, faTruckMedical,
  faHandHoldingHeart, faGraduationCap, faHospital, faStar,
  faHandshake, faGlobe, faChild, faHome, faChartLine,
}

function normalizeUrlList(list) {
  if (!Array.isArray(list)) return []
  return list
    .map((item) => {
      if (!item) return null
      if (typeof item === 'string') return item
      if (typeof item === 'object') return item.url || item.src || null
      return null
    })
    .filter(Boolean)
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
      // /embed/<id> or /shorts/<id>
      const idFromPath = parts[parts.length - 1]
      if (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') {
        return idFromPath ? `https://www.youtube.com/embed/${idFromPath}` : null
      }
      // Fallback: try last segment
      return idFromPath ? `https://www.youtube.com/embed/${idFromPath}` : null
    }
    return null
  } catch {
    return null
  }
}

function loadObjectives() {
  try {
    const stored = localStorage.getItem('admin_objectives')
    if (stored) return JSON.parse(stored).filter((o) => o.active !== false)
  } catch { /* ignore */ }
  return objectivesBase.filter((o) => o.active !== false)
}

export default function WhatWeDoDetail() {
  const { id } = useParams()
  const { t, lang } = useLanguage()

  const objectives = useMemo(() => loadObjectives(), [])
  const objective = objectives.find((o) => String(o.id) === String(id))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!objective) {
    return (
      <div className="what-we-do-detail-page">
        <section className="page-hero">
          <div className="container">
            <div className="badge">{t('whatWeDo.title')}</div>
            <h1>{t('news.notFoundTitle') || 'Not found'}</h1>
            <p>{t('news.notFoundText') || 'This item does not exist.'}</p>
            <NavLink to="/what-we-do" className="btn btn-primary">
              {t('nav.back') || t('nav.home') || 'Back'}
            </NavLink>
          </div>
        </section>
      </div>
    )
  }

  const icon = ICON_MAP[objective.iconName] || faBullseye
  const title = lang === 'ar' ? (objective.titleAr || objective.titleEn) : (objective.titleEn || objective.titleAr)
  const needs = lang === 'ar' ? (objective.needsAr || objective.needsEn) : (objective.needsEn || objective.needsAr)
  const work = lang === 'ar' ? (objective.workAr || objective.workEn) : (objective.workEn || objective.workAr)
  const acts = lang === 'ar'
    ? (objective.activitiesAr?.filter(Boolean) || [])
    : (objective.activitiesEn?.filter(Boolean) || [])
  const images = normalizeUrlList(objective.images)
  const videos = normalizeUrlList(objective.videos)
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
                  <NavLink to="/what-we-do" className="btn btn-secondary">{t('nav.back') || 'Back'}</NavLink>
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

              {hasImages && (
                <>
                  <h3 className="wwd-media__title">{lang === 'ar' ? 'الصور' : 'Photos'}</h3>
                  <div className="wwd-media__grid wwd-media__grid--images">
                    {images.map((src, idx) => (
                      <div className="wwd-media-card" key={idx}>
                        <img className="wwd-media-card__img" src={src} alt={`${title} - photo ${idx + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {hasVideos && (
                <>
                  <h3 className="wwd-media__title">{lang === 'ar' ? 'الفيديوهات' : 'Videos'}</h3>
                  <div className="wwd-media__grid wwd-media__grid--videos">
                    {videos.map((urlOrSrc, idx) => {
                      const youtubeEmbed = getYouTubeEmbedUrl(urlOrSrc)
                      const isFile =
                        /\.(mp4|webm|ogg)(\?.*)?$/i.test(String(urlOrSrc))
                      return (
                        <div className="wwd-media-card" key={idx}>
                          {youtubeEmbed ? (
                            <iframe
                              className="wwd-media-card__iframe"
                              src={youtubeEmbed}
                              title={`${title} - video ${idx + 1}`}
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          ) : isFile ? (
                            <video
                              className="wwd-media-card__video"
                              controls
                              preload="none"
                              src={urlOrSrc}
                            >
                              {lang === 'ar' ? 'متصفحك لا يدعم تشغيل الفيديو.' : 'Your browser does not support video.'}
                            </video>
                          ) : (
                            <iframe
                              className="wwd-media-card__iframe"
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
                </>
              )}
            </section>
          </article>
        </div>
      </section>
    </div>
  )
}

