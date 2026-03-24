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

  return (
    <div className="what-we-do-detail-page">
      <section className="wwd-detail-hero">
        <div className="container wwd-detail-hero__container">
          <nav className="wwd-detail-breadcrumbs" aria-label="Breadcrumb">
            <NavLink className="wwd-detail-breadcrumbs__link" to="/">{t('nav.home') || 'Home'}</NavLink>
            <span className="wwd-detail-breadcrumbs__sep" aria-hidden="true">/</span>
            <NavLink className="wwd-detail-breadcrumbs__link" to="/what-we-do">{t('whatWeDo.title')}</NavLink>
            <span className="wwd-detail-breadcrumbs__sep" aria-hidden="true">/</span>
            <span className="wwd-detail-breadcrumbs__current" aria-current="page">{title}</span>
          </nav>

          <div className="wwd-detail-hero__grid">
            <div className="wwd-detail-hero__main">
              <div className="wwd-detail-hero__badge-row">
                <div className="badge">{t('whatWeDo.title')}</div>
                <span className="wwd-detail-hero__id">#{String(objective.id ?? id)}</span>
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

              <div className="wwd-detail-hero__chips" role="list" aria-label="Highlights">
                {needs && (
                  <div className="wwd-chip" role="listitem">
                    <span className="wwd-chip__label">{t('activities.urgentNeeds')}</span>
                    <span className="wwd-chip__value">{needs}</span>
                  </div>
                )}
                {work && (
                  <div className="wwd-chip" role="listitem">
                    <span className="wwd-chip__label">{t('activities.ourWork')}</span>
                    <span className="wwd-chip__value">{work}</span>
                  </div>
                )}
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
        <div className="container">
          <div className="wwd-detail-content">
            <article className="wwd-surface">
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
            </article>

            <aside className="wwd-side">
              <div className="wwd-surface wwd-surface--compact">
                <h3 className="wwd-side__title">{t('activities.urgentNeeds')}</h3>
                {needs ? <p className="wwd-side__text">{needs}</p> : <p className="wwd-side__text">—</p>}
              </div>

              <div className="wwd-surface wwd-surface--compact">
                <h3 className="wwd-side__title">{lang === 'ar' ? 'روابط سريعة' : 'Quick links'}</h3>
                <div className="wwd-side__links">
                  <NavLink to="/what-we-do" className="wwd-link">{t('whatWeDo.title')}</NavLink>
                  <NavLink to="/objectives" className="wwd-link">{t('nav.objectives') || 'Objectives'}</NavLink>
                  <NavLink to="/contact" className="wwd-link">{t('nav.contact') || 'Contact'}</NavLink>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}

